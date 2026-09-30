/**
 * ROSE SALES ENGINE - DATABASE MIGRATION MODULE
 * vc.tsolutionsipidd.com - Motor de Ventas Persistente
 * 
 * Este módulo crea las tablas del motor de ventas de forma completamente aditiva.
 * NO modifica ninguna tabla existente del proyecto.
 */

import { getPool } from './db.js';
export { getPool };


/**
 * Inicializa el esquema de la base de datos del Rose Sales Engine.
 * Llamado automáticamente desde los endpoints del módulo.
 * Idempotente: safe de ejecutar múltiples veces (CREATE IF NOT EXISTS).
 */
export async function initSalesEngineDb() {
  const pool = getPool();

  try {
    // ── Paso 1: Tabla de Workspaces (garantizar que exista el workspace primario TSolutions) ──
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Insertar workspace primario de TSolutions IPIDD si no existe
      INSERT INTO workspaces (id, name, domain)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'TSolutions IPIDD',
        'vc.tsolutionsipidd.com'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    // ── Paso 2: CRM de Prospectos de vc.tsolutionsipidd.com ──
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vcard_crm_leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES workspaces(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        email VARCHAR(150) NOT NULL,
        phone_whatsapp VARCHAR(30) NOT NULL,
        company_name VARCHAR(120),
        industry VARCHAR(80),
        suggested_slug VARCHAR(100),
        source VARCHAR(80) DEFAULT 'web_form', -- 'web_form', 'referral', 'paid_ad', 'organic'
        ip_address VARCHAR(100),
        demo_clicked BOOLEAN DEFAULT FALSE,
        demo_clicked_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(30) DEFAULT 'NEW' CHECK (status IN (
          'NEW',
          'QUEUED_IN_BATCH',
          'CONTACTED',
          'CONVERTED',
          'LOST'
        )),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_vcard_crm_leads_status ON vcard_crm_leads(status);
      CREATE INDEX IF NOT EXISTS idx_vcard_crm_leads_email ON vcard_crm_leads(LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_vcard_crm_leads_workspace ON vcard_crm_leads(workspace_id, status);
    `);

    // ── Paso 3: Lotes Automatizados de 50 Prospectos ──
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_campaign_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES workspaces(id) ON DELETE CASCADE,
        batch_number SERIAL,
        lead_count INTEGER NOT NULL DEFAULT 50,
        status VARCHAR(30) DEFAULT 'PENDING_APPROVAL' CHECK (status IN (
          'COLLECTING',
          'PENDING_APPROVAL',
          'APPROVED',
          'DISPATCHING',
          'COMPLETED',
          'REJECTED'
        )),
        generated_content JSONB NOT NULL DEFAULT '{}',
        approval_notes TEXT,
        approved_by UUID,
        approved_at TIMESTAMP WITH TIME ZONE,
        dispatched_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_mcb_status ON marketing_campaign_batches(status);
      CREATE INDEX IF NOT EXISTS idx_mcb_workspace ON marketing_campaign_batches(workspace_id, status);
    `);

    // ── Paso 4: Relación N:M de Prospectos por Lote ──
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_batch_leads (
        batch_id UUID NOT NULL REFERENCES marketing_campaign_batches(id) ON DELETE CASCADE,
        lead_id UUID NOT NULL REFERENCES vcard_crm_leads(id) ON DELETE CASCADE,
        email_delivery_status VARCHAR(20) DEFAULT 'PENDING' CHECK (email_delivery_status IN (
          'PENDING', 'SENT', 'OPENED', 'BOUNCED', 'FAILED'
        )),
        whatsapp_delivery_status VARCHAR(20) DEFAULT 'PENDING' CHECK (whatsapp_delivery_status IN (
          'PENDING', 'SENT', 'DELIVERED', 'READ', 'REPLIED', 'FAILED'
        )),
        email_sent_at TIMESTAMP WITH TIME ZONE,
        whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (batch_id, lead_id)
      );

      CREATE INDEX IF NOT EXISTS idx_mbl_lead ON marketing_batch_leads(lead_id);
    `);

    // ── Paso 5: Métricas Consolidadas del Lote ──
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_batch_metrics (
        batch_id UUID PRIMARY KEY REFERENCES marketing_campaign_batches(id) ON DELETE CASCADE,
        emails_sent INTEGER DEFAULT 0,
        emails_opened INTEGER DEFAULT 0,
        whatsapp_sent INTEGER DEFAULT 0,
        whatsapp_replied INTEGER DEFAULT 0,
        demo_clicks INTEGER DEFAULT 0,
        cards_ordered INTEGER DEFAULT 0,
        total_revenue_generated NUMERIC(12, 2) DEFAULT 0.00,
        conversion_rate NUMERIC(5, 2) GENERATED ALWAYS AS (
          CASE WHEN emails_sent > 0 
          THEN ROUND((cards_ordered::NUMERIC / emails_sent) * 100, 2)
          ELSE 0.00 END
        ) STORED,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    return { success: true };
  } catch (err) {
    console.error('[SalesEngineDb] Error durante la migración:', err.message);
    // No lanzar - sistema aditivo, no debe bloquear el resto de la app
    return { success: false, error: err.message };
  }
}

/**
 * Cuenta los prospectos con status 'NEW' disponibles para el próximo lote.
 */
export async function countNewLeads(workspaceId = '00000000-0000-0000-0000-000000000001') {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT COUNT(*) as count FROM vcard_crm_leads WHERE status = 'NEW' AND workspace_id = $1`,
    [workspaceId]
  );
  return parseInt(rows[0].count, 10);
}

/**
 * Empaqueta los primeros 50 leads NEW en un nuevo lote de campaña.
 * Retorna el batch_id creado.
 * @param {string} workspaceId
 * @param {object} generatedContent - Contenido generado por Nexus IA
 */
export async function packLeadsIntoBatch(workspaceId, generatedContent) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Obtener los primeros 50 leads NEW en orden FIFO
    const { rows: leads } = await client.query(`
      SELECT id FROM vcard_crm_leads
      WHERE status = 'NEW' AND workspace_id = $1
      ORDER BY created_at ASC
      LIMIT 50
      FOR UPDATE SKIP LOCKED
    `, [workspaceId]);

    if (leads.length < 50) {
      await client.query('ROLLBACK');
      return null; // No hay suficientes leads todavía
    }

    const leadIds = leads.map(l => l.id);

    // Crear el registro del lote
    const { rows: [batch] } = await client.query(`
      INSERT INTO marketing_campaign_batches (workspace_id, lead_count, status, generated_content)
      VALUES ($1, 50, 'PENDING_APPROVAL', $2)
      RETURNING id, batch_number
    `, [workspaceId, JSON.stringify(generatedContent)]);

    // Vincular los 50 leads al lote
    const batchLeadValues = leadIds.map((leadId, idx) =>
      `('${batch.id}', '${leadId}')`
    ).join(', ');

    await client.query(`
      INSERT INTO marketing_batch_leads (batch_id, lead_id)
      VALUES ${batchLeadValues}
    `);

    // Actualizar status de los leads
    await client.query(`
      UPDATE vcard_crm_leads
      SET status = 'QUEUED_IN_BATCH'
      WHERE id = ANY($1::uuid[])
    `, [leadIds]);

    // Crear registro de métricas para el lote
    await client.query(`
      INSERT INTO marketing_batch_metrics (batch_id)
      VALUES ($1)
    `, [batch.id]);

    await client.query('COMMIT');
    return { batchId: batch.id, batchNumber: batch.batch_number, leadIds };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[SalesEngineDb] Error al empaquetar lote:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Aprueba un lote de campaña y registra quién y cuándo lo aprobó.
 */
export async function approveBatch(batchId, approvedByUserId) {
  const pool = getPool();
  const { rows } = await pool.query(`
    UPDATE marketing_campaign_batches
    SET status = 'APPROVED',
        approved_by = $2,
        approved_at = NOW()
    WHERE id = $1 AND status = 'PENDING_APPROVAL'
    RETURNING *
  `, [batchId, approvedByUserId]);

  return rows[0] || null;
}

/**
 * Marca un lote como 'DISPATCHING' al inicio del envío.
 */
export async function setBatchDispatching(batchId) {
  const pool = getPool();
  await pool.query(`
    UPDATE marketing_campaign_batches
    SET status = 'DISPATCHING', dispatched_at = NOW()
    WHERE id = $1
  `, [batchId]);
}

/**
 * Marca un lote como 'COMPLETED' al finalizar todos los envíos.
 */
export async function setBatchCompleted(batchId) {
  const pool = getPool();
  await pool.query(`
    UPDATE marketing_campaign_batches
    SET status = 'COMPLETED', completed_at = NOW()
    WHERE id = $1
  `, [batchId]);
}

/**
 * Obtiene un lote junto con sus leads para procesamiento del dispatcher.
 */
export async function getBatchWithLeads(batchId) {
  const pool = getPool();

  const { rows: [batch] } = await pool.query(`
    SELECT * FROM marketing_campaign_batches WHERE id = $1
  `, [batchId]);

  if (!batch) return null;

  const { rows: leads } = await pool.query(`
    SELECT l.*, mbl.email_delivery_status, mbl.whatsapp_delivery_status
    FROM vcard_crm_leads l
    JOIN marketing_batch_leads mbl ON mbl.lead_id = l.id
    WHERE mbl.batch_id = $1
    ORDER BY l.created_at ASC
  `, [batchId]);

  return { ...batch, leads };
}

/**
 * Actualiza el estado de entrega individual de email o WhatsApp para un lead del lote.
 */
export async function updateLeadDeliveryStatus(batchId, leadId, channel, status) {
  const pool = getPool();
  const col = channel === 'email' ? 'email_delivery_status' : 'whatsapp_delivery_status';
  const sentCol = channel === 'email' ? 'email_sent_at' : 'whatsapp_sent_at';

  await pool.query(`
    UPDATE marketing_batch_leads
    SET ${col} = $1, ${sentCol} = NOW()
    WHERE batch_id = $2 AND lead_id = $3
  `, [status, batchId, leadId]);
}

/**
 * Incrementa los contadores de métricas del lote de forma atómica.
 */
export async function incrementBatchMetric(batchId, field, amount = 1) {
  const ALLOWED_FIELDS = [
    'emails_sent', 'emails_opened', 'whatsapp_sent',
    'whatsapp_replied', 'demo_clicks', 'cards_ordered'
  ];
  if (!ALLOWED_FIELDS.includes(field)) return;

  const pool = getPool();
  await pool.query(`
    UPDATE marketing_batch_metrics
    SET ${field} = ${field} + $1, updated_at = NOW()
    WHERE batch_id = $2
  `, [amount, batchId]);
}

/**
 * Suma ingresos generados al lote correspondiente al lead convertido.
 */
export async function recordConversion(leadId, revenueAmount) {
  const pool = getPool();

  // Encontrar el lote al que pertenece este lead
  const { rows: [rel] } = await pool.query(`
    SELECT batch_id FROM marketing_batch_leads WHERE lead_id = $1
  `, [leadId]);

  // Marcar el lead como CONVERTED
  await pool.query(`
    UPDATE vcard_crm_leads SET status = 'CONVERTED' WHERE id = $1
  `, [leadId]);

  if (rel?.batch_id) {
    await pool.query(`
      UPDATE marketing_batch_metrics
      SET cards_ordered = cards_ordered + 1,
          total_revenue_generated = total_revenue_generated + $1,
          updated_at = NOW()
      WHERE batch_id = $2
    `, [revenueAmount, rel.batch_id]);

    // Consultar tasa de conversión para alerta
    const { rows: [metrics] } = await pool.query(`
      SELECT conversion_rate, cards_ordered, emails_sent FROM marketing_batch_metrics
      WHERE batch_id = $1
    `, [rel.batch_id]);

    return { batchId: rel.batch_id, metrics };
  }

  return null;
}

/**
 * Obtiene el listado de lotes para el panel administrativo.
 */
export async function listBatches(workspaceId = '00000000-0000-0000-0000-000000000001', limit = 20) {
  const pool = getPool();
  const { rows } = await pool.query(`
    SELECT 
      b.*,
      m.emails_sent, m.emails_opened, m.whatsapp_sent, m.whatsapp_replied,
      m.demo_clicks, m.cards_ordered, m.total_revenue_generated, m.conversion_rate
    FROM marketing_campaign_batches b
    LEFT JOIN marketing_batch_metrics m ON m.batch_id = b.id
    WHERE b.workspace_id = $1
    ORDER BY b.created_at DESC
    LIMIT $2
  `, [workspaceId, limit]);

  return rows;
}
