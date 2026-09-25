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

    let textToParse = raw_text || '';

    // Si se proporciona una imagen base64 y está disponible una API de OCR (p.ej. Google Vision API o Anthropic/Gemini)
    if (image_base64 && !textToParse) {
      // Si existe GOOGLE_VISION_API_KEY o similar en el entorno, se llama a la API externa
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
        } catch (visionErr) {
          console.error('Error llamando a Google Vision API:', visionErr);
        }
      }
    }

    // Parser heurístico inteligente para extraer datos de contacto del texto OCR
    const extractedData = parseBusinessCardText(textToParse);

    // Si se especificó target_slug, registrar automáticamente el contacto capturado en la BD
    if (target_slug) {
      await initDb();
      const pool = getPool();
      
      const profileRes = await pool.query('SELECT id FROM vcard_profiles WHERE slug = $1 LIMIT 1', [target_slug]);
      const profileId = profileRes.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO card_leads (profile_id, slug, lead_name, lead_email, lead_phone, lead_company, lead_note, source_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ocr_scan')`,
        [
          profileId,
          target_slug,
          `${extractedData.nombre} ${extractedData.apellido}`.trim() || 'Contacto OCR',
          extractedData.correo,
          extractedData.telefono,
          extractedData.empresa,
          `Escaneado vía OCR: ${extractedData.puesto || ''}`,
        ]
      );
    }

    return NextResponse.json({
      success: true,
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
