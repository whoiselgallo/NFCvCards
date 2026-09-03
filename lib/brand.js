import brandConfig from '../brand.config';

export { brandConfig };

/**
 * Valida si un correo electrónico cumple con los dominios autorizados de la marca blanca.
 * Si allowedDomains es '*', cualquier correo con formato válido es permitido.
 */
export function isAuthorizedAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  
  const allowed = brandConfig.adminAuth.allowedDomains;
  if (!allowed || allowed === '*' || allowed.trim() === '') {
    // Acepta cualquier correo válido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  }

  const domainList = allowed.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
  return domainList.some(domain => {
    const prefix = domain.startsWith('@') ? domain : `@${domain}`;
    return clean.endsWith(prefix) && clean.length > prefix.length;
  });
}

/**
 * Genera el texto completo de la carta de entrega de la tarjeta digital
 */
export function generateDeliveryInstructions({ nombre, apellido, empresa, slug, originUrl }) {
  const brandName = brandConfig.brandName;
  const website = brandConfig.website;
  const supportEmail = brandConfig.supportEmail;
  const enlacePerfil = `${originUrl || website}/p/${slug}`;
  const titular = `${nombre || 'Contacto'} ${apellido || ''}`.trim() || 'Titular';
  const emp = empresa || 'Tu Empresa';

  return `======================================================================
🚀 CARTA DE ENTREGA OFICIAL - IDENTIDAD DIGITAL INTERACTIVA & NFC
   ${brandName.toUpperCase()} - PLATAFORMA DE IDENTIDAD DIGITAL
======================================================================

Estimado/a ${titular},

Es un placer para el equipo de ${brandName} entregarte tu nueva Identidad Digital Interactiva y Tarjeta de Presentación Inteligente lista para producción.

----------------------------------------------------------------------
📌 1. DATOS DE TU PERFIL DIGITAL
----------------------------------------------------------------------
• Titular de la Tarjeta : ${titular}
• Empresa / Organización: ${emp}
• Enlace Web Directo    : ${enlacePerfil}

----------------------------------------------------------------------
📲 2. CÓMO ESCRIBIR TU TARJETA EN UN CHIP NFC (NTAG213 / NTAG215 / NTAG216)
----------------------------------------------------------------------
1. Descarga la aplicación gratuita "NFC Tools" (disponible en iOS App Store y Android Google Play Store).
2. Abre la app y selecciona la pestaña "Escribir" (Write).
3. Toca en "Agregar un registro" (Add a record) y selecciona "URL / Enlace Web" (URL / URI).
4. Pega exactamente el siguiente enlace:
   ${enlacePerfil}
5. Presiona "Aceptar" (OK) y luego toca "Escribir / [X] Bytes" (Write).
6. Acerca tu tarjeta física, anillo o sticker NFC a la parte trasera de tu teléfono móvil hasta escuchar el pitido o sentir la vibración de confirmación.
7. ¡Listo! Al tocar la tarjeta con cualquier smartphone moderno, se abrirá instantáneamente tu perfil digital interactivo sin necesidad de apps instaladas.

----------------------------------------------------------------------
🖼️ 3. CÓDIGO QR CORPORATIVO DE ALTA DEFINICIÓN
----------------------------------------------------------------------
En este paquete de entrega encontrarás el archivo de imagen oficial con tu código QR generado en ultra-alta resolución, listo para:
• Impresión en tarjetas de presentación físicas.
• Fondo de pantalla de tu smartphone o Apple Wallet / Google Wallet.
• Firmas de correo electrónico y presentaciones ejecutivas.
• Rollups, stands, eventos y catálogos comerciales.

----------------------------------------------------------------------
💬 4. SOPORTE TÉCNICO Y PERSONALIZACIÓN
----------------------------------------------------------------------
Si requieres actualizar tus números telefónicos, enlaces de redes sociales, catálogo o diseño corporativo:
• Portal Web : ${website}
• Correo     : ${supportEmail}

¡Gracias por confiar en ${brandName} para llevar tu presencia profesional al siguiente nivel!

Atentamente,
El Equipo de ${brandName}
${website}
`;
}
