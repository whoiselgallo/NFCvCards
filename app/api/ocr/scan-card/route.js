import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

/**
 * API Endpoint para Escaneo OCR de Tarjetas Físicas de Presentación
 * Recibe una imagen en Base64 o Texto crudo extraído y lo estructura mediante IA / Regex en un objeto de contacto.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { image_base64, raw_text, target_slug } = body;

    if (!image_base64 && !raw_text) {
      return NextResponse.json(
        { success: false, error: 'Se requiere image_base64 o raw_text para realizar el escaneo OCR' },
        { status: 400 }
      );
    }

    let extractedData = null;
    let engineUsed = 'heuristic';
    let textToParse = raw_text || '';

    // 1. Motor Principal de IA: Google AI Studio (Gemini Multimodal)
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY);
    if (hasGeminiKey) {
      try {
        const { parseBusinessCardWithGemini } = await import('../../../../lib/gemini');
        extractedData = await parseBusinessCardWithGemini({
          imageBase64: image_base64,
          rawText: raw_text
        });
        engineUsed = 'google_ai_studio_gemini';
      } catch (geminiErr) {
        console.warn('[OCR] Google AI Studio falló, recurriendo a motor secundario:', geminiErr.message);
      }
    }

    // 2. Motor Secundario: Google Vision API (si Gemini no está o falló)
    if (!extractedData && image_base64 && !textToParse) {
      const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
      if (visionApiKey) {
        try {
          const visionRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requests: [{
                image: { content: image_base64.replace(/^data:image\/\w+;base64,/, '') },
                features: [{ type: 'TEXT_DETECTION' }]
              }]
            })
          });
          const visionData = await visionRes.json();
          textToParse = visionData.responses?.[0]?.fullTextAnnotation?.text || '';
          engineUsed = 'google_vision_api';
        } catch (visionErr) {
          console.error('[OCR] Error en Google Vision API:', visionErr);
        }
      }
    }

    // 3. Fallback Heurístico si no se procesó con Gemini
    if (!extractedData) {
      extractedData = parseBusinessCardText(textToParse);
    }

    // Si se especificó target_slug, registrar automáticamente el contacto capturado en la BD
    if (target_slug) {
      await initDb();
      const pool = getPool();
      
      const profileRes = await pool.query('SELECT id FROM vcard_profiles WHERE slug = $1 LIMIT 1', [target_slug]);
      const profileId = profileRes.rows[0]?.id || null;

      const leadInsertRes = await pool.query(
        `INSERT INTO card_leads (profile_id, slug, lead_name, lead_email, lead_phone, lead_company, lead_note, source_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ocr_scan')
         RETURNING id`,
        [
          profileId,
          target_slug,
          `${extractedData.nombre || ''} ${extractedData.apellido || ''}`.trim() || 'Contacto OCR',
          extractedData.correo || '',
          extractedData.telefono || '',
          extractedData.empresa || '',
          `Escaneado con IA (${engineUsed}): ${extractedData.puesto || ''}`,
        ]
      );

      // Sincronizar automáticamente con el CRM nativo
      try {
        const leadName = `${extractedData.nombre || ''} ${extractedData.apellido || ''}`.trim() || 'Contacto OCR';
        await pool.query(
          `INSERT INTO crm_contacts (
            external_id, source, display_name, company_name, phone_number, email, notes, status, lead_score
          ) VALUES ($1, 'ocr_scan', $2, $3, $4, $5, $6, 'new', 75)
          ON CONFLICT (source, external_id) DO NOTHING`,
          [
            `ocr_lead_${leadInsertRes.rows[0]?.id || Date.now()}`,
            leadName,
            extractedData.empresa || '',
            extractedData.telefono || '',
            (extractedData.correo || '').toLowerCase(),
            `Tarjeta física escaneada con IA (${engineUsed}) para vCard: ${target_slug}`,
          ]
        );
      } catch (crmSyncErr) {
        console.error('Error sincronizando OCR con crm_contacts:', crmSyncErr);
      }
    }

    return NextResponse.json({
      success: true,
      engine: engineUsed,
      data: extractedData,
      raw_text: textToParse
    });

  } catch (error) {
    console.error('Error en escáner OCR de tarjetas:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la tarjeta física' },
      { status: 500 }
    );
  }
}

/**
 * Función heurística de extracción de campos desde texto plano de tarjeta de presentación
 */
function parseBusinessCardText(text) {
  if (!text) {
    return { nombre: '', apellido: '', correo: '', telefono: '', empresa: '', puesto: '', sitio_web: '' };
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extraer Correo Electrónico
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const correo = emailMatch ? emailMatch[0] : '';

  // Extraer Teléfono
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  const phoneMatch = text.match(phoneRegex);
  const telefono = phoneMatch ? phoneMatch[0] : '';

  // Extraer Sitio Web
  const webRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/;
  const webMatch = text.match(webRegex);
  let sitio_web = webMatch ? webMatch[0] : '';

  // Primera línea suele ser Nombre / Empresa
  let nombre = '';
  let apellido = '';
  let empresa = '';
  let puesto = '';

  if (lines.length > 0) {
    const words = lines[0].split(' ');
    nombre = words[0] || '';
    apellido = words.slice(1).join(' ') || '';
  }

  if (lines.length > 1 && !lines[1].includes('@') && !lines[1].match(/\d{5,}/)) {
    puesto = lines[1];
  }

  if (lines.length > 2 && !lines[2].includes('@') && !lines[2].match(/\d{5,}/)) {
    empresa = lines[2];
  }

  return {
    nombre,
    apellido,
    correo,
    telefono,
    empresa,
    puesto,
    sitio_web
  };
}
