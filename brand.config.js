/**
 * BRAND CONFIGURATION - MARCA BLANCA
 * 
 * Configuración centralizada de marca, paleta de colores y recursos visuales
 * inspirados en la Rosa Geométrica Cyber / Neo-Rose y la Guía Oficial de Tipografía.
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

  // Tipografía Oficial de Marca (Design Tokens)
  typography: {
    primary: 'Plaster',                  // Tipografía Principal Display / Logotipo oficial
    secondary: 'Rosetta Tech Sans',      // Tipografía de Comunicación Corporativa y Titulares
    body: 'Inter',                       // Tipografía de Lectura y Formularios UI
    displayFont: 'Plaster, sans-serif',
    corporateFont: 'Rosetta Tech Sans, Space Grotesk, Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
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

  // Configuración de Paleta de Colores Oficial (Figma Design Tokens)
  theme: {
    // Paleta Principal
    rojoNucleo: '#C8102E',       // Rojo Núcleo (RGB: 200, 16, 46)
    carmesiGeometrico: '#EE334E',// Carmesí Geométrico (RGB: 238, 51, 78)
    grisCircuito: '#B1B3B3',     // Gris Circuito (RGB: 177, 179, 179)
    negroProfundo: '#0A0A0A',    // Negro Profundo (RGB: 10, 10, 10)

    // Paleta Secundaria
    grisApoyo: '#EBEBF2',        // Gris de Apoyo (RGB: 235, 235, 242)
    azulTecnologico: '#4A7AFF',  // Azul Tecnológico - Cool Accent (RGB: 74, 122, 255)
    plataMetalizado: '#D9DADC',  // Plata Metalizado - Highlights (RGB: 217, 218, 220)
    sombraCarmesi: '#9A0020',    // Sombra Carmesí (RGB: 154, 0, 32)

    // Mapeos de Interfaz
    primaryColor: '#C8102E',
    primaryNeon: '#EE334E',
    primaryHover: '#9A0020',
    primaryGlow: 'rgba(238, 51, 78, 0.45)',
    secondaryColor: '#4A7AFF',
    accentCyan: '#4A7AFF',
    darkBg: '#0A0A0A',
    cardDarkBg: '#121114',
    borderRose: 'rgba(200, 16, 46, 0.30)'
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
