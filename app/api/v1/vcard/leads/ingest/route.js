/**
 * ROSE SALES ENGINE - LEAD INGEST ENDPOINT
 * POST /api/v1/vcard/leads/ingest
 */

import { NextResponse } from 'next/server';
import { initSalesEngineDb, countNewLeads, packLeadsIntoBatch, getPool } from '@/lib/salesEngineDb.js';
import { generateBatchContent } from '@/lib/nexusVcardCopywriter.js';
import { notifyBatchReadyForApproval } from '@/lib/salesEngineEvents.js';

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';
const BATCH_TRIGGER = 50;

function generateSlug(firstName, lastName, companyName) {
  const base = [firstName, lastName, companyName]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const suffix = Math.floor(Math.random() * 900) + 100;
  return `${base}-${suffix}`;
}

function normalizePhone(phone) {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) return `52${clean}`;
  if (clean.length === 12 && clean.startsWith('52')) return clean;
  return clean.slice(-12);
}

export async function POST(request) {
  try {
    await initSalesEngineDb();
    const body = await request.json();
    const { first_name, last_name, email, phone_whatsapp, company_name, industry, source = 'web_form' } = body;

    if (!first_name?.trim() || !email?.trim() || !phone_whatsapp?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: first_name, email, phone_whatsapp' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Formato de email inválido' }, { status: 400 });
    }

    const pool = getPool();
    const { rows: existing } = await pool.query(
      `SELECT id, status FROM vcard_crm_leads WHERE LOWER(email) = LOWER($1) AND workspace_id = $2`,
      [email.trim(), WORKSPACE_ID]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true, duplicate: true,
        message: 'Este prospecto ya está registrado en el CRM.',
        lead_id: existing[0].id, status: existing[0].status
      });
    }

    const phone = normalizePhone(phone_whatsapp);
    const slug = generateSlug(first_name, last_name, company_name);
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]
      || request.headers.get('x-real-ip') || null;

    const { rows: [newLead] } = await pool.query(`
      INSERT INTO vcard_crm_leads
        (workspace_id, first_name, last_name, email, phone_whatsapp, company_name, industry, suggested_slug, source, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, first_name, email, status
    `, [
      WORKSPACE_ID, first_name.trim(), last_name?.trim() || null,
      email.trim().toLowerCase(), phone, company_name?.trim() || null,
      industry?.trim() || null, slug, source, ipAddress
    ]);

    const newLeadCount = await countNewLeads(WORKSPACE_ID);
    let batchCreated = null;

    if (newLeadCount >= BATCH_TRIGGER) {
      try {
        const { rows: leadsForContent } = await pool.query(
          `SELECT * FROM vcard_crm_leads WHERE status = 'NEW' AND workspace_id = $1 ORDER BY created_at ASC LIMIT 50`,
          [WORKSPACE_ID]
        );
        const generatedContent = await generateBatchContent(leadsForContent);
        const batchResult = await packLeadsIntoBatch(WORKSPACE_ID, generatedContent);
        if (batchResult) {
          batchCreated = batchResult;
          notifyBatchReadyForApproval({
            batchId: batchResult.batchId, batchNumber: batchResult.batchNumber,
            leadCount: 50, workspaceId: WORKSPACE_ID
          });
          console.log(`[Ingest] ✅ Lote #${batchResult.batchNumber} creado y notificado.`);
        }
      } catch (batchErr) {
        console.error('[Ingest] Error en proceso de lote:', batchErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      lead_id: newLead.id,
      demo_url: `https://vc.tsolutionsipidd.com/demo/${slug}`,
      message: '¡Registro exitoso! Tu demo estará disponible en breve.',
      batch_triggered: batchCreated !== null,
      ...(batchCreated && { batch_id: batchCreated.batchId })
    }, { status: 201 });

  } catch (err) {
    console.error('[Ingest] Error crítico:', err.message);
    return NextResponse.json({ success: false, error: 'Error interno del servidor.' }, { status: 500 });
  }
}
