/**
 * BRAND CONFIGURATION - MARCA BLANCA
 * 
 * Modifica este archivo para cambiar completamente la identidad visual,
 * nombres, logotipos, correos, dominios permitidos y textos de entrega
 * de toda la plataforma sin tener que editar componentes individuales.
 */

const brandConfig = {
  // Identidad de la Marca
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'ROSE Card',
  brandTagline: 'vCard Engine & Identidad Digital NFC',
  brandDescription: 'Generador de Identidad Digital Interactiva, NFC & vCard Corporativa.',
  brandHeading: {
    prefix: 'ROSE',
    highlight: 'CARD',
    suffix: 'ENGINE'
  },

  // Empresa y Enlaces
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'ROSE Card Digital',
  website: process.env.NEXT_PUBLIC_APP_URL || 'https://rosecard.io',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contacto@rosecard.io',
  
  // Archivos de Medios y Favicons
  assets: {
    logo: '/logoTSPNGSQ.png',
    icon: '/icon.png',
    favicon: '/favicon.png',
    appleIcon: '/apple-icon.png'
  },

  // Configuración de Paleta de Colores Oficial (Cyber Rose Neon Palette)
  theme: {
    cyberRoseNeon: '#FF2A54',     // Títulos principales, resplandor de marca, focos y estados activos
    rubyRose: '#E11D48',          // Botones de acción primaria (CTA), marcos del logo y acentos corporativos
    crimsonShadow: '#BE123C',     // Degradados de botones y estados hover
    deepGarnet: '#4C0519',        // Sombras facetadas, bordes y reflejos de fondo
    circuitSilver: '#E2E8F0',     // Tipografías de lectura, nodos de circuito y bordes sutiles
    obsidianCyberDark: '#060509', // Fondo principal inmersivo con gradiente radial y rejilla cibernética

    primaryColor: '#E11D48',
    primaryNeon: '#FF2A54',
    primaryHover: '#BE123C',
    primaryGlow: 'rgba(225, 29, 72, 0.45)',
    secondaryColor: '#00E5FF',
    darkBg: '#060509',
    cardDarkBg: '#0C0A12',
    borderDark: '#2A0E18'
  },

  // Seguridad y Control de Acceso del Panel Administrativo
  // Si se establece en '*', cualquier correo corporativo o estándar puede registrarse/acceder.
  // Si se listan dominios separados por coma (ej: '@rosecard.io,@miempresa.com'), solo esos dominios tendrán acceso.
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
