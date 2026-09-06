/**
 * SISTEMA CENTRALIZADO DE TEMAS VISUALES PARA TARJETAS NFC
 * Divididos por Niveles de Suscripción (Alumno, Pro, Business, Business Elite)
 */

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Alumno (Prueba Gratuita)',
    tagline: 'Empieza con buen pie creando un perfil digital sencillo e inteligente para estudiantes.',
    price: 0,
    period: 'Gratis',
    badge: 'Estudiantes',
    color: '#64748B',
    popular: false,
    features: [
      '1 Tema visual exclusivo (Clásico)',
      '1 Usuario / 1 Negocio',
      'Todas las funciones básicas',
      'Generación de código QR estándar',
      'Descarga de contacto vCard (.vcf)',
      'Almacenamiento limitado',
      'Sin soporte técnico especializado'
    ],
    themesAllowed: ['classic'],
    maxUsers: 1,
    pwaEnabled: false,
    customDomain: false,
    customLayout: false,
    whiteLabel: false
  },
  pro: {
    id: 'pro',
    name: 'Profesional',
    tagline: 'Mejora tu marca personal con funciones avanzadas y presencia ejecutiva.',
    price: 199,
    currency: 'MXN',
    period: '/Año',
    badge: 'Popular',
    color: '#E11D48',
    popular: true,
    features: [
      '5 Temas visuales premium',
      '3 Usuarios / Perfiles gestionables',
      'Habilitar Aplicación Web Progresiva (PWA instalable)',
      'Acceso a funciones avanzadas (Google Maps directo, videos, analítica)',
      'Descarga de Paquete Oficial (.ZIP con QR PNG en alta definición)',
      'Soporte Técnico Premium'
    ],
    themesAllowed: ['classic', 'modern', 'minimal', 'midnight_gold', 'neon_cyber'],
    maxUsers: 3,
    pwaEnabled: true,
    customDomain: false,
    customLayout: false,
    whiteLabel: false
  },
  business: {
    id: 'business',
    name: 'Negocio',
    tagline: 'Potencie a su equipo con herramientas avanzadas y control total.',
    price: 599,
    currency: 'MXN',
    period: '/Año',
    badge: 'Equipos & Pymes',
    color: '#00F0FF',
    popular: false,
    features: [
      '10 Temas visuales premium y temáticos',
      '10 Usuarios / Perfiles colaborativos',
      'Dominio personalizado + subdominio propio',
      'Marca personalizada (colores, logotipos e identidad)',
      'Aplicación Web Progresiva (PWA)',
      'Acceso completo a funciones Adv + Pro',
      'Dashboard con Analíticas de Conversión',
      'Soporte Técnico Premium prioritario'
    ],
    themesAllowed: [
      'classic', 'modern', 'minimal', 'midnight_gold', 'neon_cyber',
      'emerald_prestige', 'nordic_frost', 'vintage_leather', 'ocean_breeze', 'sunset_vibes'
    ],
    maxUsers: 10,
    pwaEnabled: true,
    customDomain: true,
    customLayout: false,
    whiteLabel: false
  },
  elite: {
    id: 'elite',
    name: 'Business Elite',
    tagline: 'Potencie a su equipo con herramientas avanzadas, control total, personalizador de layout y actualizaciones continuas.',
    price: 1499,
    currency: 'MXN',
    period: '/Año',
    badge: 'Máximo Poder & White-Label',
    color: '#FF2A54',
    popular: false,
    features: [
      'White Label Plataforma 100% independiente',
      '50 Usuarios / Perfiles | Panel de control por usuario',
      '14+ Temas ilimitados + Editor Visual de Layout Drag & Position',
      'Modifica información, tema, tipografía, logo o fotos sin costo adicional',
      'Gestor Dinámico de Campos (Agrega/Quita campos personalizados)',
      'Módulos Elite: Portafolio, Agenda Google/Calendly, Fototeca, Carrusel de Marketing y Reseñas',
      'Dominio personalizado + subdominio ilimitado',
      'Marca personalizada total (Sin mención de la plataforma)',
      'Aplicación Web Progresiva (PWA) con icono propio',
      'Dashboard Centralizado de Analítica & KPIs de Conversión',
      'Soporte VIP 24/7 con actualizaciones continuas'
    ],
    themesAllowed: [
      'classic', 'modern', 'minimal', 'midnight_gold', 'neon_cyber',
      'emerald_prestige', 'nordic_frost', 'vintage_leather', 'ocean_breeze', 'sunset_vibes',
      'dark_matter', 'holographic', 'royal_amethyst', 'carbon_fiber'
    ],
    maxUsers: 50,
    pwaEnabled: true,
    customDomain: true,
    customLayout: true,
    whiteLabel: true
  }
};

export const THEMES = {
  // 1. TEMA BASE (Plan Alumno / Todos)
  classic: {
    id: 'classic',
    name: 'Clásico Corporativo',
    tier: 'free',
    tierLabel: 'Alumno & Todos',
    desc: 'Lienzo blanco pulcro, logotipo centrado y pastillas de contacto con alto contraste profesional.',
    bgColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    textColor: '#1E293B',
    subTextColor: '#64748B',
    accentColor: '#2563EB',
    borderColor: '#E2E8F0',
    headerStyle: 'solid',
    badge: 'Esencial'
  },

  // 2-5. TEMAS PROFESIONAL (Plan Pro + Business + Elite)
  modern: {
    id: 'modern',
    name: 'Cyber Modern / Dark',
    tier: 'pro',
    tierLabel: 'Pro',
    desc: 'Lienzo oscuro inmersivo con reflejos carmesí y acentos luminosos.',
    bgColor: '#060509',
    cardBg: '#0F0B15',
    textColor: '#F8FAFC',
    subTextColor: '#94A3B8',
    accentColor: '#E11D48',
    borderColor: 'rgba(225, 29, 72, 0.3)',
    headerStyle: 'gradient',
    badge: 'Pro'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista Ejecutivo',
    tier: 'pro',
    tierLabel: 'Pro',
    desc: 'Estilo editorial geométrico centrado, bordes ultrafinos y tipografía limpia.',
    bgColor: '#FAFAFA',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    subTextColor: '#475569',
    accentColor: '#0F172A',
    borderColor: '#CBD5E1',
    headerStyle: 'minimal',
    badge: 'Pro'
  },
  midnight_gold: {
    id: 'midnight_gold',
    name: 'Midnight Gold / Lujo',
    tier: 'pro',
    tierLabel: 'Pro',
    desc: 'Fondo negro azabache con elegantes biseles en oro champagne y brillo VIP.',
    bgColor: '#0A0A0A',
    cardBg: '#141414',
    textColor: '#FFFDF5',
    subTextColor: '#A3A3A3',
    accentColor: '#D4AF37',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    headerStyle: 'gold_glow',
    badge: 'Lujo'
  },
  neon_cyber: {
    id: 'neon_cyber',
    name: 'Cyberpunk Neón',
    tier: 'pro',
    tierLabel: 'Pro',
    desc: 'Estética futurista con bordes de luz neón rosa y cian de alto impacto.',
    bgColor: '#05050D',
    cardBg: '#0D0D1E',
    textColor: '#FFFFFF',
    subTextColor: '#38BDF8',
    accentColor: '#FF2A54',
    borderColor: '#00F0FF',
    headerStyle: 'neon',
    badge: 'Neón'
  },

  // 6-10. TEMAS BUSINESS (Plan Business + Elite)
  emerald_prestige: {
    id: 'emerald_prestige',
    name: 'Esmeralda Prestige',
    tier: 'business',
    tierLabel: 'Business',
    desc: 'Verde esmeralda oscuro con sutiles toques platino para despachos y finanzas.',
    bgColor: '#03140E',
    cardBg: '#062319',
    textColor: '#F0FDF4',
    subTextColor: '#86EFAC',
    accentColor: '#10B981',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    headerStyle: 'emerald',
    badge: 'Business'
  },
  nordic_frost: {
    id: 'nordic_frost',
    name: 'Nordic Frost / Glaciar',
    tier: 'business',
    tierLabel: 'Business',
    desc: 'Inspiración escandinava con efecto de cristal esmerilado y tonos celestes gélidos.',
    bgColor: '#F0F9FF',
    cardBg: '#FFFFFF',
    textColor: '#0C4A6E',
    subTextColor: '#0284C7',
    accentColor: '#0EA5E9',
    borderColor: '#BAE6FD',
    headerStyle: 'frost',
    badge: 'Business'
  },
  vintage_leather: {
    id: 'vintage_leather',
    name: 'Vintage Leather / Barbershop',
    tier: 'business',
    tierLabel: 'Business',
    desc: 'Ideal para barberías, estudios artesanales y marcas con estilo clásico o rústico.',
    bgColor: '#1A120B',
    cardBg: '#2A1E17',
    textColor: '#FDF8F5',
    subTextColor: '#D7C4B7',
    accentColor: '#C2410C',
    borderColor: 'rgba(194, 65, 12, 0.4)',
    headerStyle: 'vintage',
    badge: 'Artesanal'
  },
  ocean_breeze: {
    id: 'ocean_breeze',
    name: 'Ocean Breeze / Zafiro',
    tier: 'business',
    tierLabel: 'Business',
    desc: 'Gradientes en azul profundo y turquesa marina con frescura corporativa.',
    bgColor: '#020617',
    cardBg: '#0F172A',
    textColor: '#F8FAFC',
    subTextColor: '#38BDF8',
    accentColor: '#2563EB',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    headerStyle: 'ocean',
    badge: 'Business'
  },
  sunset_vibes: {
    id: 'sunset_vibes',
    name: 'Sunset Gradient / Creativo',
    tier: 'business',
    tierLabel: 'Business',
    desc: 'Aura cálida de puesta de sol con degradados violeta, rosa y naranja para creadores.',
    bgColor: '#0E071A',
    cardBg: '#1A0B2E',
    textColor: '#FFF1F2',
    subTextColor: '#FDA4AF',
    accentColor: '#F43F5E',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    headerStyle: 'sunset',
    badge: 'Creativo'
  },

  // 11-14. TEMAS BUSINESS ELITE (Acceso Exclusivo Elite)
  dark_matter: {
    id: 'dark_matter',
    name: 'Dark Matter / Titanio Stealth',
    tier: 'elite',
    tierLabel: 'Business Elite',
    desc: 'Negro puro OLED #000000 con acabados en titanio mate y sombras hiper-profundas.',
    bgColor: '#000000',
    cardBg: '#080808',
    textColor: '#F5F5F5',
    subTextColor: '#737373',
    accentColor: '#E5E5E5',
    borderColor: '#262626',
    headerStyle: 'stealth',
    badge: 'Elite'
  },
  holographic: {
    id: 'holographic',
    name: 'Holographic Glass / Prisma',
    tier: 'elite',
    tierLabel: 'Business Elite',
    desc: 'Glassmorphism de nueva generación con borde iridiscente reactivo y destellos prismáticos.',
    bgColor: '#0B0A14',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    textColor: '#FFFFFF',
    subTextColor: '#E0E7FF',
    accentColor: '#818CF8',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    headerStyle: 'hologram',
    badge: 'Elite'
  },
  royal_amethyst: {
    id: 'royal_amethyst',
    name: 'Royal Amethyst / Púrpura',
    tier: 'elite',
    tierLabel: 'Business Elite',
    desc: 'Púrpura imperial majestuoso con destellos violeta neón para marcas de alto estatus.',
    bgColor: '#08020F',
    cardBg: '#130421',
    textColor: '#FAF5FF',
    subTextColor: '#D8B4FE',
    accentColor: '#A855F7',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    headerStyle: 'amethyst',
    badge: 'Elite'
  },
  carbon_fiber: {
    id: 'carbon_fiber',
    name: 'Carbon Fiber / Racing Rose',
    tier: 'elite',
    tierLabel: 'Business Elite',
    desc: 'Textura de fibra de carbono deportiva con acentos en rojo carrera y estética aerodinámica.',
    bgColor: '#0A0A0E',
    cardBg: '#121218',
    textColor: '#FFFFFF',
    subTextColor: '#A1A1AA',
    accentColor: '#DC2626',
    borderColor: 'rgba(220, 38, 38, 0.4)',
    headerStyle: 'carbon',
    badge: 'Elite'
  }
};

/**
 * Filtra los temas permitidos según el nivel de suscripción
 */
export function getThemesForPlan(planId = 'free') {
  const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  const allowedIds = plan.themesAllowed || ['classic'];
  return Object.values(THEMES).filter(t => allowedIds.includes(t.id));
}

/**
 * Valida si un tema está habilitado para un plan
 */
export function isThemeAllowed(themeId, planId = 'free') {
  const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  return plan.themesAllowed ? plan.themesAllowed.includes(themeId) : themeId === 'classic';
}
