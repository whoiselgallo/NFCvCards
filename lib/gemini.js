/**
 * Cliente de Google AI Studio (Gemini API) para ROSE Card / TSolutions
 * Usa los modelos multimodales Gemini 2.0 / 2.5 Flash de Google AI Studio
 * Obtén tu API Key gratuita en: https://aistudio.google.com/apikey
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Escanea y extrae datos estructurados de una tarjeta de presentación física
 * usando la visión multimodal de Gemini (Google AI Studio).
 * 
 * @param {Object} params
 * @param {string} params.imageBase64 - Imagen en base64 (con o sin prefijo data:image/...)
 * @param {string} params.rawText - Texto opcional si ya fue pre-extraído
 * @returns {Promise<Object>} Datos estructurados del contacto
 */
export async function parseBusinessCardWithGemini({ imageBase64, rawText }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada. Obtén tu clave en https://aistudio.google.com/apikey');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [];
  const parts = [];

  // Prompt con instrucciones precisas de extracción JSON
  const prompt = `Eres un asistente de digitalización empresarial de élite para la plataforma ROSE Card.
Tu tarea es analizar esta tarjeta de presentación (business card) física y extraer toda la información de contacto con la mayor precisión posible.

Responde ÚNICAMENTE con un objeto JSON válido (sin formato markdown adicional, sin bloques de código con comillas invertidas) con las siguientes propiedades:
{
  "nombre": "Nombre de pila del titular",
  "apellido": "Apellidos del titular",
  "empresa": "Nombre comercial o razón social de la empresa",
  "puesto": "Cargo o título profesional",
  "correo": "Correo electrónico principal",
  "telefono": "Teléfono de contacto con clave de país/área si existe",
  "whatsapp": "Número de WhatsApp si se identifica expresamente o coincide con móvil",
  "sitio_web": "Página web o URL",
  "ciudad": "Ciudad / Estado si aparece en la dirección",
  "direccion": "Dirección física completa si aparece",
  "nota": "Breve resumen de especialidad o lema de la empresa si aparece"
}

Si algún campo no aparece en la tarjeta, déjalo como una cadena vacía "".`;

  parts.push({ text: prompt });

  if (imageBase64) {
    // Detectar tipo mime o default a image/jpeg
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    parts.push({
      inlineData: {
        mimeType,
        data: cleanBase64
      }
    });
  } else if (rawText) {
    parts.push({
      text: `Texto escaneado de la tarjeta:\n${rawText}`
    });
  }

  contents.push({ role: 'user', parts });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google AI Studio Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const rawResponseText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  try {
    const cleanJsonText = rawResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (parseErr) {
    console.error('Error parseando JSON de Gemini:', rawResponseText);
    throw new Error('Gemini no devolvió un formato JSON válido');
  }
}

/**
 * Genera una propuesta de biografía y pitch profesional de impacto para una vCard
 * usando Google AI Studio (Gemini).
 */
export async function generateBioWithGemini({ nombre, puesto, empresa, industria, tono = 'profesional' }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Redacta una biografía ejecutiva concisa y de alto impacto (máximo 3 párrafos cortos) para la tarjeta digital interactiva de:
Nombre: ${nombre}
Puesto: ${puesto || 'Profesional'}
Empresa: ${empresa || 'Independiente'}
Industria: ${industria || 'Negocios'}
Tono: ${tono} (elegante, persuasivo, orientado a conversión y networking).

Enfócate en la propuesta de valor, confianza y llamada a conectar. Devuelve solo el texto de la biografía.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Error de Google AI Studio: ${response.statusText}`);
  }

  const json = await response.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
