/**
 * NEXUS VCARD COPYWRITER ENGINE
 * Generador de Contenido IA para las 3 Modalidades del Rose Sales Engine
 * 
 * Usa las API Keys de Gemini configuradas en .env para generar variantes de:
 *   1. Email + WhatsApp (Nutrición directa 1:1)
 *   2. Meta Ads (Facebook & Instagram - TOFU/MOFU/BOFU)
 *   3. TikTok & YouTube Shorts (Guión técnico <30s)
 */

const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean);

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

// Tokens corporativos TSolutions IPIDD
const BRAND = {
  name: 'TSolutions IPIDD',
  product: 'Rose vCard',
  url: 'vc.tsolutionsipidd.com',
  chip: 'NTAG216',
  colors: {
    naranja: '#FF6B00',
    aqua: '#00E5FF',
    midnight: '#121722',
    negro: '#0A0D14',
  },
  tagline: 'Tecnología instalada. Conocimiento transferido. Negocios escalados.',
  packages: {
    starter: '$1,200 MXN',
    business_pro: '$2,500 MXN (incluye NFC físico)',
    enterprise: '$599 USD/año'
  }
};

/**
 * Selecciona la siguiente API key disponible con rotación round-robin.
 */
let _keyIndex = 0;
function getNextApiKey() {
  if (!GEMINI_API_KEYS.length) {
    throw new Error('[NexusCopywriter] No se configuraron GEMINI_API_KEY_* en las variables de entorno.');
  }
  const key = GEMINI_API_KEYS[_keyIndex % GEMINI_API_KEYS.length];
  _keyIndex++;
  return key;
}

/**
 * Llama a la Gemini API con reintentos automáticos en caso de rate limit.
 */
async function callGemini(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = getNextApiKey();
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            }
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429 && attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 2000));
          continue;
        }
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Respuesta vacía de Gemini');

      // Limpiar posibles backticks de markdown
      const cleanText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      return JSON.parse(cleanText);
    } catch (err) {
      if (attempt === maxRetries - 1) {
        console.error('[NexusCopywriter] Error en Gemini tras reintentos:', err.message);
        return null;
      }
    }
  }
  return null;
}

/**
 * Genera un resumen estadístico de la audiencia del lote (industrias, empresas).
 */
function summarizeLeads(leads) {
  const industries = {};
  leads.forEach(l => {
    const ind = l.industry || 'No especificado';
    industries[ind] = (industries[ind] || 0) + 1;
  });
  const topIndustries = Object.entries(industries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ind, count]) => `${ind} (${count})`)
    .join(', ');

  return {
    total: leads.length,
    topIndustries,
    sampleNames: leads.slice(0, 3).map(l => l.first_name).join(', ')
  };
}

/**
 * MODALIDAD 1: Email + WhatsApp
 * Genera copys personalizados para contacto directo uno a uno.
 */
async function generateEmailWhatsAppContent(leads) {
  const summary = summarizeLeads(leads);

  const prompt = `
Eres un experto en copywriting de alto impacto para ventas B2B en México.
Genera copys de venta para la empresa ${BRAND.name} que vende ${BRAND.product} (${BRAND.url}).

Audiencia del lote: ${summary.total} prospectos de industrias: ${summary.topIndustries}.
Ejemplos de nombres: ${summary.sampleNames}.

Producto: Tarjetas de presentación digitales NFC con chip ${BRAND.chip}.
Paquetes: Starter ${BRAND.packages.starter}, Business Pro NFC ${BRAND.packages.business_pro}.
Tagline: "${BRAND.tagline}"

Genera en formato JSON EXACTAMENTE esta estructura:
{
  "email": {
    "subject": "Línea de asunto (máx 60 chars, alto impacto, sin spam words)",
    "preheader": "Texto de previsualización (máx 90 chars)",
    "html_template": "Template HTML completo con placeholders {{first_name}}, {{company_name}}, {{slug}}. Usa colores: fondo #121722, acento #FF6B00, texto #F8FAFC. Incluye botón CTA naranja con link a https://${BRAND.url}/demo/{{slug}}",
    "plain_text": "Versión texto plano con los mismos placeholders"
  },
  "whatsapp": {
    "message": "Mensaje conversacional con botones (máx 1024 chars). Incluye placeholders {{first_name}}, {{company_name}}, {{slug}}.",
    "quick_replies": ["Ver Demo en Vivo", "Hablar con un Asesor", "Ver Precios"],
    "media_url": "https://${BRAND.url}/assets/wa-demo-card.jpg"
  }
}
`;

  const result = await callGemini(prompt);
  if (!result) return generateEmailWhatsAppFallback();
  return result;
}

/**
 * Fallback estático si Gemini falla - Garantiza que el lote siempre tenga contenido.
 */
function generateEmailWhatsAppFallback() {
  return {
    email: {
      subject: 'Tu tarjeta de papel está terminando en la basura — aquí está el reemplazo',
      preheader: `Accede al demo de tu perfil interactivo en ${BRAND.url}`,
      html_template: `
        <div style="background:#121722;font-family:Inter,sans-serif;color:#F8FAFC;padding:40px 20px;max-width:600px;margin:0 auto;border-radius:12px">
          <div style="text-align:center;margin-bottom:32px">
            <p style="color:#FF6B00;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase">TSolutions IPIDD</p>
            <h1 style="font-size:26px;font-weight:800;margin:8px 0">Hola {{first_name}},</h1>
          </div>
          <p style="color:#CBD5E1;line-height:1.7">El <strong style="color:#FF6B00">88% de las tarjetas de papel</strong> intercambiadas en eventos de negocios terminan en la basura en menos de una semana. Cada vez que entregas cartón, pierdes un cliente potencial.</p>
          <p style="color:#CBD5E1;line-height:1.7;margin-top:16px">Diseñamos un <strong>demo funcional para {{company_name}}</strong> en ${BRAND.url}:</p>
          <ul style="color:#CBD5E1;margin:16px 0;padding-left:20px;line-height:2">
            <li><strong style="color:#00E5FF">Guardado instantáneo:</strong> Tus clientes descargan tu contacto (.vcf) completo en un solo toque.</li>
            <li><strong style="color:#00E5FF">Chip NFC ${BRAND.chip}:</strong> Acerca tu tarjeta al smartphone sin instalar ninguna app.</li>
            <li><strong style="color:#00E5FF">Actualización continua:</strong> Cambia tu info en la nube, sin volver a imprimir.</li>
          </ul>
          <div style="text-align:center;margin:32px 0">
            <a href="https://${BRAND.url}/demo/{{slug}}" style="background:#FF6B00;color:#fff;padding:16px 36px;border-radius:8px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;box-shadow:0 0 20px rgba(255,107,0,0.5)">Probar Mi Tarjeta Digital en Vivo</a>
          </div>
          <p style="color:#64748B;font-size:12px;text-align:center;margin-top:40px;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px">${BRAND.name} • ${BRAND.tagline}</p>
        </div>
      `,
      plain_text: `Hola {{first_name}},\n\nEl 88% de las tarjetas de papel van a la basura en menos de una semana.\n\nCreamos un demo para {{company_name}}: https://${BRAND.url}/demo/{{slug}}\n\nChip NFC ${BRAND.chip} • Perfil digital activo en 24h • ${BRAND.packages.starter} Starter\n\n${BRAND.tagline}\n${BRAND.name}`
    },
    whatsapp: {
      message: `Hola {{first_name}}, un gusto saludarte 👋\n\nNotamos tu interés en modernizar la presencia de *{{company_name}}*.\n\nDiseñamos tu demostración de tarjeta inteligente NFC en:\nhttps://${BRAND.url}/demo/{{slug}}\n\nCon un toque en el celular de tu cliente, guardas tu WhatsApp, catálogo y datos fiscales directo en sus contactos. Sin apps extra. 🚀\n\n¿Prefieres recibir la tarjeta física en PVC mate con chip NFC o probar primero la versión digital anual?`,
      quick_replies: ['Ver Demo en Vivo', 'Hablar con un Asesor', 'Ver Precios'],
      media_url: `https://${BRAND.url}/assets/wa-demo-card.jpg`
    }
  };
}

/**
 * MODALIDAD 2: Meta Ads (Facebook & Instagram) - TOFU / MOFU / BOFU
 */
async function generateMetaAdsContent(leads) {
  const summary = summarizeLeads(leads);

  const prompt = `
Eres un estratega de publicidad digital especializado en Meta Ads B2B para México.
Genera copy de campañas para ${BRAND.name} vendiendo ${BRAND.product}.
Audiencia: ${summary.total} prospectos de ${summary.topIndustries}.

Genera en formato JSON esta estructura EXACTA:
{
  "tofu": {
    "format": "Reel/Video 9:16",
    "primary_text": "Texto principal del anuncio (máx 125 chars)",
    "headline": "Titular (máx 40 chars, font Bruno Ace)",
    "description": "Descripción del anuncio (máx 30 chars)",
    "video_script_summary": "Resumen de 2 líneas del guión visual del Reel",
    "cta": "LEARN_MORE"
  },
  "mofu": {
    "format": "Carrusel",
    "slides": [
      {"headline": "Titular tarjeta 1 (máx 40 chars)", "body": "Cuerpo (máx 125 chars)", "image_description": "Descripción visual para el diseñador"},
      {"headline": "Titular tarjeta 2", "body": "Cuerpo 2", "image_description": "Visual 2"},
      {"headline": "Titular tarjeta 3", "body": "Cuerpo 3", "image_description": "Visual 3"},
      {"headline": "Titular tarjeta 4 con precio", "body": "Cuerpo con paquete", "image_description": "Visual 4"}
    ],
    "cta": "SHOP_NOW"
  },
  "bofu": {
    "format": "Imagen Estática / Retargeting",
    "primary_text": "Texto principal para retargeting (máx 125 chars)",
    "headline": "Titular directo (máx 40 chars)",
    "description": "Urgencia/beneficio (máx 30 chars)",
    "audience_note": "Nota: audiencia es el lote de ${summary.total} prospectos del CRM",
    "cta": "BUY_NOW"
  }
}
`;

  const result = await callGemini(prompt);
  if (!result) return generateMetaAdsFallback();
  return result;
}

function generateMetaAdsFallback() {
  return {
    tofu: {
      format: 'Reel/Video 9:16',
      primary_text: '¿Sigues entregando tarjetas de papel? El 88% van a la basura. Tu próximo cliente merece más. 🚀',
      headline: 'TARJETA NFC INTELIGENTE',
      description: 'Entrega inmediata • Chip NTAG216',
      video_script_summary: 'Tarjetas de cartón cayendo a la papelera → ejecutivo hace "tap" de tarjeta NFC en iPhone → pantalla muestra perfil y botón Guardar Contacto.',
      cta: 'LEARN_MORE'
    },
    mofu: {
      format: 'Carrusel',
      slides: [
        { headline: 'Cero papel, máxima conversión', body: 'Una sola tarjeta NFC reemplaza 500 tarjetas de papel al año. Actualizable desde la nube.', image_description: 'Primer plano tarjeta NFC negra mate con chip dorado visible' },
        { headline: 'Código QR dinámico integrado', body: 'Tu perfil interactivo siempre actualizado. QR de alta velocidad incluido en cada tarjeta.', image_description: 'Pantalla de teléfono escaneando QR, perfil cargando instantáneamente' },
        { headline: 'Panel de analítica en vivo', body: 'Conoce cuántas personas vieron tu tarjeta, descargaron tu contacto y te llamaron.', image_description: 'Dashboard con métricas de clics, guardados y conversiones' },
        { headline: `Business Pro NFC · ${BRAND.packages.business_pro}`, body: '50 tarjetas NFC físicas + perfil digital + QR dinámico + panel de métricas incluido.', image_description: 'Pack de tarjetas NFC con caja de presentación corporativa' }
      ],
      cta: 'SHOP_NOW'
    },
    bofu: {
      format: 'Imagen Estática / Retargeting',
      primary_text: `Tu red de contactos no puede depender de un trozo de papel. Equipa a tu empresa con Rose vCards de ${BRAND.name}. Entrega garantizada con chip NFC ${BRAND.chip} y perfil digital activo en 24 horas.`,
      headline: 'TARJETA INTELIGENTE NFC • ENTREGA INMEDIATA',
      description: `Starter ${BRAND.packages.starter} • Business Pro NFC`,
      audience_note: 'Retargeting al lote del CRM con hashes SHA-256 de emails y teléfonos',
      cta: 'BUY_NOW'
    }
  };
}

/**
 * MODALIDAD 3: TikTok & YouTube Shorts (Guión técnico <30 segundos)
 */
async function generateShortsContent(leads) {
  const summary = summarizeLeads(leads);

  const prompt = `
Eres un guionista experto en contenido viral de TikTok y YouTube Shorts B2B para México.
Crea un guión técnico para ${BRAND.name} - ${BRAND.product}.
El video debe durar máximo 30 segundos. Audiencia: emprendedores, directivos, profesionistas.

Genera en formato JSON esta estructura EXACTA:
{
  "duration": "30 segundos",
  "hook": "Primera frase de impacto (00-03s, máx 10 palabras)",
  "scenes": [
    {
      "time_range": "00-03",
      "video": "Descripción de lo que se ve en pantalla",
      "audio": "Voz en off o música",
      "overlay_text": "Texto superpuesto en pantalla (font-bruno)",
      "overlay_color": "#FF6B00 o #00E5FF"
    },
    {"time_range": "04-09", "video": "...", "audio": "...", "overlay_text": "...", "overlay_color": "..."},
    {"time_range": "10-18", "video": "...", "audio": "...", "overlay_text": "...", "overlay_color": "..."},
    {"time_range": "19-25", "video": "...", "audio": "...", "overlay_text": "...", "overlay_color": "..."},
    {"time_range": "26-30", "video": "...", "audio": "...", "overlay_text": "...", "overlay_color": "..."}
  ],
  "caption": "Caption para TikTok/IG con hashtags (máx 300 chars)",
  "hashtags": ["#NFC", "#TarjetaDigital", "#TSolutionsIPIDD", "#RoseCard", "#NetworkingMexico"],
  "cta_final": "Llamado a la acción final en pantalla"
}
`;

  const result = await callGemini(prompt);
  if (!result) return generateShortsFallback();
  return result;
}

function generateShortsFallback() {
  return {
    duration: '30 segundos',
    hook: '¿Sigues usando papel? Deja de perder clientes.',
    scenes: [
      {
        time_range: '00-03',
        video: 'Primer plano: persona intentando escribir un número desde una tarjeta arrugada y equivocándose.',
        audio: '"Deja de perder clientes en tus reuniones por entregar cartón."',
        overlay_text: '¿SIGUES USANDO PAPEL?',
        overlay_color: '#FF6B00'
      },
      {
        time_range: '04-09',
        video: 'Presentador saca tarjeta negra mate con detalles en naranja y hace "tap" en la parte trasera de un iPhone.',
        audio: '"Con Rose vCard de TSolutions IPIDD solo necesitas hacer esto: un toque en el celular..."',
        overlay_text: 'UN TOQUE. ESO ES TODO.',
        overlay_color: '#FF6B00'
      },
      {
        time_range: '10-18',
        video: 'Pantalla dividida: smartphone abre perfil interactivo en vc.tsolutionsipidd.com y se presiona Guardar Contacto.',
        audio: '"...y todos tus enlaces, WhatsApp, catálogo y datos fiscales quedan guardados en su teléfono al instante. Sin aplicaciones extras."',
        overlay_text: 'SIN APPS • SIN FRICCIÓN',
        overlay_color: '#00E5FF'
      },
      {
        time_range: '19-25',
        video: 'Gráfico animado mostrando los 3 paquetes: Starter ($1,200 MXN), Business Pro NFC ($2,500 MXN) y Enterprise.',
        audio: '"Plataforma en la nube, código QR dinámico y chip NFC de alta durabilidad."',
        overlay_text: 'DESDE $1,200 MXN',
        overlay_color: '#FF6B00'
      },
      {
        time_range: '26-30',
        video: 'Presentador sonríe a la cámara, guarda su tarjeta en la cartera.',
        audio: '"Entra a vc.tsolutionsipidd.com y activa la tuya hoy mismo."',
        overlay_text: 'vc.tsolutionsipidd.com',
        overlay_color: '#00E5FF'
      }
    ],
    caption: '¿Tu tarjeta de papel va a la basura? Modernízate con tecnología NFC. Un solo toque y tu cliente ya tiene todos tus datos. 🔥 Link en bio para tu demo gratis. #NFC #TarjetaDigital #TSolutionsIPIDD',
    hashtags: ['#NFC', '#TarjetaDigital', '#TSolutionsIPIDD', '#RoseCard', '#NetworkingMexico', '#EmprendedoresMexico', '#B2BMexico'],
    cta_final: `Entra a ${BRAND.url} • Chip ${BRAND.chip} • Perfil activo en 24h`
  };
}

/**
 * FUNCIÓN PRINCIPAL: Genera el contenido completo de las 3 modalidades para el lote.
 * Esta función es la que se llama desde el Batch Engine.
 */
export async function generateBatchContent(leads) {
  console.log(`[NexusCopywriter] Generando contenido para lote de ${leads.length} prospectos...`);

  const [emailWhatsApp, metaAds, shorts] = await Promise.all([
    generateEmailWhatsAppContent(leads).catch(err => {
      console.error('[NexusCopywriter] Fallback Email/WA:', err.message);
      return generateEmailWhatsAppFallback();
    }),
    generateMetaAdsContent(leads).catch(err => {
      console.error('[NexusCopywriter] Fallback Meta Ads:', err.message);
      return generateMetaAdsFallback();
    }),
    generateShortsContent(leads).catch(err => {
      console.error('[NexusCopywriter] Fallback Shorts:', err.message);
      return generateShortsFallback();
    })
  ]);

  const content = {
    generated_at: new Date().toISOString(),
    lead_count: leads.length,
    brand: BRAND.name,
    modalities: {
      email_whatsapp: emailWhatsApp,
      meta_ads: metaAds,
      tiktok_shorts: shorts
    }
  };

  console.log('[NexusCopywriter] Contenido generado con éxito para las 3 modalidades.');
  return content;
}
