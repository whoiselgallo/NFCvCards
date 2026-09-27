/**
 * Cliente de Google AI Studio (Gemini API) con Alta Disponibilidad & Auto-Failover
 * TSolutions / ROSE Card
 * 
 * Soporta anidación de hasta 3 claves (o más). Si una clave agota su cuota (HTTP 429),
 * rota automáticamente a la siguiente clave sin interrumpir la operación del usuario.
 * 
 * Obtén claves gratuitas en: https://aistudio.google.com/apikey
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
let activeKeyIndex = 0;

/**
 * Obtiene la lista ordenada de claves disponibles sin duplicados
 */
export function getGeminiApiKeys() {
  const list = [];
  if (process.env.GEMINI_API_KEY_1) list.push(process.env.GEMINI_API_KEY_1);
  if (process.env.GEMINI_API_KEY_2) list.push(process.env.GEMINI_API_KEY_2);
  if (process.env.GEMINI_API_KEY_3) list.push(process.env.GEMINI_API_KEY_3);
  if (process.env.GEMINI_API_KEY) list.push(process.env.GEMINI_API_KEY);
  if (process.env.GOOGLE_AI_STUDIO_API_KEY) list.push(process.env.GOOGLE_AI_STUDIO_API_KEY);
  if (process.env.GEMINI_API_KEYS) {
    list.push(...process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()));
  }
  return Array.from(new Set(list.filter(Boolean)));
}

/**
 * Ejecuta una petición contra Google AI Studio rotando entre las claves
 * si se recibe un error de límite de cuota (429), permisos (403) o sobrecarga (503).
 */
async function callGeminiWithFailover(payload) {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) {
    throw new Error('No hay claves de Google AI Studio (GEMINI_API_KEY) configuradas en el entorno (.env).');
  }

  let lastError = null;

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const keyIndex = (activeKeyIndex + attempt) % keys.length;
    const apiKey = keys[keyIndex];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Detección de agotamiento de cuota o rate limit
      if (response.status === 429 || response.status === 403 || response.status === 503) {
        const errorText = await response.text();
        console.warn(`[Gemini Failover] Clave #${keyIndex + 1} de ${keys.length} agotó cuota (${response.status}). Rotando automáticamente a la siguiente clave...`);
        lastError = new Error(`Clave #${keyIndex + 1} con estado ${response.status}: ${errorText}`);
        activeKeyIndex = (keyIndex + 1) % keys.length;
        continue; // Intenta con la siguiente clave
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google AI Studio Error (${response.status}): ${errorBody}`);
      }

      // Éxito: fijamos la clave activa para las siguientes llamadas
      activeKeyIndex = keyIndex;
      return await response.json();
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Failover] Fallo en clave #${keyIndex + 1}: ${err.message}. Probando siguiente clave...`);
    }
  }

  throw new Error(`Todas las claves (${keys.length}) de Google AI Studio fallaron o agotaron cuota. Último error: ${lastError?.message}`);
}

/**
 * Escanea y extrae datos estructurados de una tarjeta de presentación física
 * usando la visión multimodal de Gemini (Google AI Studio) con tolerancia a fallos.
 */
export async function parseBusinessCardWithGemini({ imageBase64, rawText }) {
  const parts = [];

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

  const payload = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  const json = await callGeminiWithFailover(payload);
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
 * usando Google AI Studio (Gemini) con tolerancia a fallos.
 */
export async function generateBioWithGemini({ nombre, puesto, empresa, industria, tono = 'profesional' }) {
  const prompt = `Redacta una biografía ejecutiva concisa y de alto impacto (máximo 3 párrafos cortos) para la tarjeta digital interactiva de:
Nombre: ${nombre}
Puesto: ${puesto || 'Profesional'}
Empresa: ${empresa || 'Independiente'}
Industria: ${industria || 'Negocios'}
Tono: ${tono} (elegante, persuasivo, orientado a conversión y networking).

Enfócate en la propuesta de valor, confianza y llamada a conectar. Devuelve solo el texto de la biografía.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500
    }
  };

  const json = await callGeminiWithFailover(payload);
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
