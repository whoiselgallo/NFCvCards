/**
 * BRAND CONFIGURATION - MARCA BLANCA
 * 
 * Configuración centralizada de marca, paleta de colores y recursos visuales
 * inspirados en la Rosa Geométrica Cyber / Neo-Rose.
 */

const brandConfig = {
  // Identidad de la Marca
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'ROSE Card',
  brandTagline: 'Cyber vCard Engine & Identidad Digital NFC',
  brandDescription: 'Generador de Identidad Digital Interactiva, NFC & vCard Corporativa con diseño Neo-Rose.',
  brandHeading: {
    prefix: 'ROSE',
    highlight: 'CARD',
    suffix: 'ENGINE'
  },

  // Empresa y Enlaces
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'ROSE Card Digital',
  website: process.env.NEXT_PUBLIC_APP_URL || 'https://rosecard.io',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@rosecard.io',
  
  // Archivos de Medios y Favicons (Logotipo Oficial Neo-Rose)
  assets: {
    logo: '/brand/logo.png',
    icon: '/icon.png',
    favicon: '/favicon.png',
    appleIcon: '/apple-icon.png'
  },

  // Paleta de Colores Extraída Directamente del Logotipo
  theme: {
    primaryColor: '#E11D48',     // Rojo Rubí / Rose Principal
    primaryHover: '#BE123C',     // Carmesí Intenso
    primaryNeon: '#FF2A54',      // Rosa Neón / Resplandor de circuitos
    primaryGlow: 'rgba(225, 29, 72, 0.45)',
    deepWine: '#4C0519',         // Vino oscuro de sombra
    secondaryColor: '#E2E8F0',   // Plata cromada / Nodos de circuito
    accentCyan: '#00F0FF',       // Cian cibernético secundario
    darkBg: '#07060A',           // Negro obsidiana de fondo
    cardDarkBg: '#120E17',       // Fondo de panel con tinte amatista/vino
    borderRose: 'rgba(225, 29, 72, 0.35)' // Borde con brillo sutil
  },

  // Seguridad y Control de Acceso del Panel Administrativo
  adminAuth: {
    allowedDomains: process.env.ALLOWED_ADMIN_DOMAINS || '*',
    sessionCookieName: 'rose_admin_session',
    sessionDurationDays: 7,
    domainRestrictionMessage: 'Acceso restringido: Solo cuentas autorizadas pueden ingresar al panel administrativo.'
  },

  // Plantillas de Entrega para Clientes (ZIP / Modal / Correo de Bienvenida)
  delivery: {
    emailSubject: (empresa) => `🚀 Entrega Oficial de tu Identidad Digital NFC & vCard - ${process.env.NEXT_PUBLIC_BRAND_NAME || 'ROSE Card'}`,
    emailGreeting: (nombre, empresa) => 
`¡Hola, ${nombre || 'Equipo'}!

En nombre de todo el equipo de ${process.env.NEXT_PUBLIC_BRAND_NAME || 'ROSE Card'}, queremos agradecerte sinceramente por confiar en nosotros para el diseño, desarrollo y despliegue de la nueva Identidad Digital Interactiva para ${empresa || 'tu empresa'}.

Hemos finalizado con éxito la configuración y pruebas operativas de tu vCard inteligente. A continuación, encontrarás los enlaces de acceso y recursos indispensables para la integración de tus tarjetas NFC y códigos QR físicos y digitales.`,

    instructionsFilename: (nombre) => `Instrucciones_Entrega_${(process.env.NEXT_PUBLIC_BRAND_NAME || 'ROSE_Card').replace(/\s+/g, '_')}.txt`,
    qrFilename: (nombre, empresa) => `QR_${nombre || 'Contacto'}_${empresa || 'Oficial'}.png`
  },

  // Footer & Créditos
  footer: {
    enabled: true,
    text: 'Powered by ROSE Card NFC Engine',
    link: 'https://rosecard.io'
  }
};

export default brandConfig;
