'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const POPULAR_FONTS = [
  { label: 'Inter (Moderna y Limpia)', value: 'Inter' },
  { label: 'Space Grotesk (Tecnológica)', value: 'Space Grotesk' },
  { label: 'Playfair Display (Elegante y Clásica)', value: 'Playfair Display' },
  { label: 'Montserrat (Geométrica)', value: 'Montserrat' },
  { label: 'Poppins (Amigable y Redondeada)', value: 'Poppins' },
  { label: 'Roboto (Estándar Android)', value: 'Roboto' }
];

export default function VCardEngineDashboard() {
  const [formData, setFormData] = useState({
    nombre: 'Javier E.',
    apellido: 'Gallardo Arredondo',
    empresa: 'TSOLUTIONS IPIDD',
    puesto: 'CEO / Consultor Estratega',
    telefono: '+526866761131',
    whatsapp: '+526865261453',
    correo: 'javier.gallardo@tsolutionsipidd.com',
    url: 'https://tsolutionsipidd.com',
    linkedin: 'https://linkedin.com/in/javiergallardoa',
    instagram: 'https://instagram.com/tsolutionsi',
    facebook: 'https://facebook.com/tsolutionsipidd',
    calle: 'Av. Ignacio Aldama #185',
    ciudad: 'Mexicali',
    estado: 'Baja California',
    cp: '21000',
    pais: 'México',
    nota: 'Innovación que impulsa tu crecimiento...',
    googleMapsUrl: '',
    videoYoutubeUrl: ''
  });

  // Paleta Cromática: Primario, Secundario, CTA
  const [design, setDesign] = useState({
    fontFamily: 'Inter',
    customFont: '',
    colorPrimario: '#F97316',   // Naranja Energy
    colorSecundario: '#00E5FF', // Aqua Turquesa (Franja)
    colorCTA: '#F97316',        // Color de Botones / Acción
    colorTexto: '#111827',      // Texto oscuro de la tarjeta
    logoScale: 100              // Escala de 50px a 160px
  });

  const [logoImg, setLogoImg] = useState(null);

  // Inyección dinámica de Google Fonts
  useEffect(() => {
    const font = design.customFont.trim() || design.fontFamily;
    if (font) {
      const linkId = 'gfonts-preview-cdn';
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800&display=swap`;
    }
  }, [design.fontFamily, design.customFont]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDesignChange = (e) => {
    setDesign(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setLogoImg(evt.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Construir string vCard 3.0 para cálculo de bytes y descarga
  const buildVCardString = () => {
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vcard += `N:${formData.apellido || ''};${formData.nombre || ''};;;\r\n`;
    vcard += `FN:${(formData.nombre + ' ' + formData.apellido).trim()}\r\n`;
    if (formData.empresa) vcard += `ORG:${formData.empresa}\r\n`;
    if (formData.puesto) vcard += `TITLE:${formData.puesto}\r\n`;
    if (formData.telefono) vcard += `TEL;TYPE=CELL,VOICE:${formData.telefono}\r\n`;
    if (formData.whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${formData.whatsapp}\r\n`;
    if (formData.correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${formData.correo}\r\n`;
    if (formData.url) vcard += `URL;TYPE=WORK:${formData.url}\r\n`;
    if (formData.linkedin) vcard += `URL;TYPE=LinkedIn:${formData.linkedin}\r\n`;
    if (formData.instagram) vcard += `URL;TYPE=Instagram:${formData.instagram}\r\n`;
    if (formData.facebook) vcard += `URL;TYPE=Facebook:${formData.facebook}\r\n`;
    if (formData.calle || formData.ciudad || formData.estado || formData.cp || formData.pais) {
      vcard += `ADR;TYPE=WORK:;;${formData.calle || ''};${formData.ciudad || ''};${formData.estado || ''};${formData.cp || ''};${formData.pais || ''}\r\n`;
    }
    if (formData.googleMapsUrl) vcard += `NOTE:Google Maps: ${formData.googleMapsUrl}\\n${formData.nota || ''}\r\n`;
    else if (formData.nota) vcard += `NOTE:${formData.nota}\r\n`;
    vcard += `END:VCARD`;
    return vcard;
  };

  const vcardString = buildVCardString();
  const vcardBytes = new Blob([vcardString]).size;

  // Descarga de archivo .vcf (Entregable 1)
  const downloadVCF = () => {
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.nombre || 'contacto'}_${formData.apellido || 'vcard'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Descarga de Código QR en PNG (Entregable 2)
  const downloadQR = () => {
    const svg = document.getElementById('preview-qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 900, 900);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `QR_${formData.nombre || 'tsolutions'}_${formData.empresa || 'card'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const currentFontFamily = design.customFont.trim() || design.fontFamily;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col bg-[#04040A] text-[#F0F0F8]">
      
      {/* HEADER MINIMALISTA CYBERPUNK (Exacto como Screenshot 2) */}
      <header className="mb-8 max-w-[1920px] mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-scaleIn">
        <div>
          <h1 className="text-2xl md:text-3xl font-bruno text-white tracking-wide">
            TSOLUTIONS <span className="text-[#F97316]">VCARD</span> ENGINE
          </h1>
          <p className="text-gray-300 text-sm mt-1">Generador de identidad digital con optimización algorítmica y base de datos.</p>
        </div>
        
        {/* LOGO OFICIAL TSOLUTIONS EN EL HEADER */}
        <div className="tsolutions-logo hidden sm:flex shrink-0" title="tsolutions ipidd">
          <div className="tsolutions-triangle"></div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL EN 2 COLUMNAS (Exacto Screenshot 2) */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 max-w-[1920px] mx-auto w-full">
        
        {/* SECCIÓN 1: FORMULARIO DATA INPUT (Izquierda) */}
        <section className="w-full lg:w-1/2 panel-glass p-6 md:p-8 overflow-y-auto">
          <h2 className="text-xl font-bruno text-[#00E5FF] mb-6 flex items-center gap-2 border-b border-gray-800 pb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            DATA INPUT
          </h2>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* LOGOTIPO / FOTO CON ESCALADOR */}
            <div className="bg-[#12121c] p-5 rounded-[var(--radius-soft)] border border-gray-800 shadow-[var(--shadow-card)]">
              <label className="block text-sm font-bruno text-[#F0F0F8] mb-2">Logotipo o Foto de Marca</label>
              
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="file"
                  id="logo-input"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-soft)] file:border-0 file:text-sm file:font-semibold file:bg-[#F97316] file:text-black hover:file:bg-orange-400 transition-colors cursor-pointer"
                />
              </div>

              {/* Slider de Escala de Logo */}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <div className="flex justify-between items-center text-xs font-bruno text-[#00E5FF] mb-1.5 uppercase">
                  <span>Tamaño / Escala del Logo</span>
                  <span className="text-white">{design.logoScale}px</span>
                </div>
                <input
                  type="range"
                  name="logoScale"
                  min="50"
                  max="160"
                  value={design.logoScale}
                  onChange={handleDesignChange}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase tracking-wide">
                  <span>Compacto (50px)</span>
                  <span>Prominente (160px)</span>
                </div>
              </div>
            </div>

            {/* NOMBRE Y APELLIDO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. Javier" />
              </div>
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Apellido</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. Gallardo" />
              </div>
            </div>

            {/* EMPRESA Y PUESTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Empresa</label>
                <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className="input-dark w-full" placeholder="TSolutions" />
              </div>
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Puesto</label>
                <input type="text" name="puesto" value={formData.puesto} onChange={handleInputChange} className="input-dark w-full" placeholder="CEO / Consultor Estratega" />
              </div>
            </div>

            {/* TELÉFONO Y WHATSAPP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="input-dark w-full" placeholder="+526860000000" />
              </div>
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">WhatsApp</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="input-dark w-full" placeholder="+526860000000" />
              </div>
            </div>

            {/* CORREO Y SITIO WEB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} className="input-dark w-full" placeholder="contacto@tudominio.com" />
              </div>
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Sitio Web</label>
                <input type="url" name="url" value={formData.url} onChange={handleInputChange} className="input-dark w-full" placeholder="https://tudominio.com" />
              </div>
            </div>

            {/* REDES SOCIALES (Con Facebook, sin TikTok) */}
            <div className="border-t border-gray-800 pt-4 mt-4">
              <h3 className="text-sm font-bruno text-[#00E5FF] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Redes Sociales & Multimedia (Opcional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} className="input-dark w-full text-xs" placeholder="Facebook Page URL" />
                <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="input-dark w-full text-xs" placeholder="Instagram URL" />
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="input-dark w-full text-xs" placeholder="LinkedIn URL" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} className="input-dark w-full text-xs" placeholder="Google Maps (Ubicación)" />
                <input type="url" name="videoYoutubeUrl" value={formData.videoYoutubeUrl} onChange={handleInputChange} className="input-dark w-full text-xs" placeholder="Video de YouTube (Presentación)" />
              </div>
            </div>

            {/* DIRECCIÓN */}
            <div className="border-t border-gray-800 pt-4 mt-4">
              <h3 className="text-sm font-bruno text-[#00E5FF] mb-3">Dirección de Trabajo</h3>
              <input type="text" name="calle" value={formData.calle} onChange={handleInputChange} className="input-dark w-full mb-3" placeholder="Calle y Número, Colonia" />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="input-dark w-full" placeholder="Ciudad" />
                <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="input-dark w-full" placeholder="Estado" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="cp" value={formData.cp} onChange={handleInputChange} className="input-dark w-full" placeholder="Código Postal" />
                <input type="text" name="pais" value={formData.pais} onChange={handleInputChange} className="input-dark w-full" placeholder="País" />
              </div>
            </div>

            {/* NOTA */}
            <div>
              <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Nota / Descripción</label>
              <textarea name="nota" value={formData.nota} onChange={handleInputChange} className="input-dark w-full h-20 py-2.5" placeholder="Soluciones digitales, optimización y desarrollo..."></textarea>
            </div>
            
            {/* BRANDING DEL CLIENTE (3 Colores + Google Fonts) */}
            <div className="bg-[#0c0c16] border border-gray-800 p-5 rounded-[var(--radius-large)] mt-6 space-y-4">
              <h3 className="text-sm font-bruno text-[#FFD700] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Branding & Paleta Cromática
              </h3>
              
              {/* TIPOGRAFÍA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1 uppercase tracking-wide">Tipografía</label>
                  <select name="fontFamily" value={design.fontFamily} onChange={handleDesignChange} className="input-dark w-full cursor-pointer">
                    {POPULAR_FONTS.map(f => (
                      <option key={f.value} value={f.value} className="bg-[#0A0A14] text-white">{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1 uppercase tracking-wide">O Google Font Exacta</label>
                  <input type="text" name="customFont" value={design.customFont} onChange={handleDesignChange} placeholder="Ej. Bebas Neue, Outfit..." className="input-dark w-full text-xs" />
                </div>
              </div>

              {/* 3 COLORES CON COLOR PICKER + CÓDIGO HEX */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Color Primario */}
                <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                  <label className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-bold">Color Primario</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                    <input type="text" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                  </div>
                </div>

                {/* Color Secundario (Franja) */}
                <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                  <label className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-bold">Secundario (Franja)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                    <input type="text" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                  </div>
                </div>

                {/* Color CTA / Acción */}
                <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                  <label className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-bold">Color CTA (Botón)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                    <input type="text" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                  </div>
                </div>
              </div>

            </div>
          </form>
        </section>

        {/* SECCIÓN 2: VISTA PREVIA Y ANÁLISIS (Derecha - Exacto Screenshot 2) */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6">
          
          {/* TARJETA BLANCA MINIMALISTA ELEGANTE (Screenshot 2) */}
          <div
            className="p-8 md:p-12 vcard-preview flex flex-col justify-center min-h-[420px] transition-all"
            style={{ fontFamily: currentFontFamily }}
          >
            <div className="text-center mt-2 mb-6">
              
              {/* Logo Escalable */}
              <div className="mx-auto flex items-center justify-center mb-4 min-h-[90px]">
                {logoImg ? (
                  <img
                    src={logoImg}
                    alt="Logo"
                    className="object-contain transition-all"
                    style={{ width: `${design.logoScale}px`, maxHeight: `${design.logoScale}px` }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Hexágono Naranja por Defecto si no hay logo */}
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-14 h-14">
                        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke={design.colorPrimario} strokeWidth="6" />
                        <polygon points="50,25 75,70 25,70" fill={design.colorPrimario} />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nombre Principal */}
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 font-bruno">
                {formData.nombre} {formData.apellido}
              </h2>
              
              {/* Franja Secundaria Minimalista */}
              <div className="accent-stripe my-3" style={{ backgroundColor: design.colorSecundario }}></div>
              
              {/* Puesto */}
              <p className="text-base md:text-lg font-bold font-bruno" style={{ color: design.colorPrimario }}>
                {formData.puesto || 'Puesto / Especialidad'}
              </p>
              
              {/* Empresa */}
              {formData.empresa && (
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-1.5 font-bold">
                  {formData.empresa}
                </p>
              )}
            </div>

            {/* Filas de Contacto (Pills Limpias) */}
            <div className="space-y-3 text-sm max-w-sm mx-auto w-full">
              {formData.telefono && (
                <div className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium tracking-wide truncate">{formData.telefono}</span>
                </div>
              )}

              {formData.correo && (
                <div className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium tracking-wide truncate">{formData.correo}</span>
                </div>
              )}

              {formData.url && (
                <div className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="font-medium tracking-wide truncate">{formData.url.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
            
            {/* Nota / Bio Itálica */}
            {formData.nota && (
              <div className="mt-8 pt-5 border-t border-gray-200 max-w-sm mx-auto text-center w-full">
                <p className="text-xs md:text-sm italic text-gray-600 font-light leading-relaxed">
                  "{formData.nota}"
                </p>
              </div>
            )}
          </div>

          {/* PANEL DE RESULTADOS, QR Y LOS 2 ENTREGABLES (Midnight Panel) */}
          <div className="panel-glass p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Telemetría NTAG */}
              <div>
                <h3 className="text-base font-bruno text-[#00E5FF] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  TELEMETRÍA NTAG
                </h3>
                
                <div className="mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Payload Generado</p>
                  <div className="flex items-end gap-1.5 text-[#00E5FF]">
                    <span className="text-3xl font-bruno font-bold">{vcardBytes}</span>
                    <span className="text-xs mb-1 font-bruno">B</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[var(--radius-soft)] bg-[#12121c] border border-gray-800">
                  <p className="text-[10px] font-bruno text-gray-400 mb-1 uppercase tracking-wider">Chip Sugerido</p>
                  <p className="text-lg font-bruno font-bold text-[#F97316]">
                    {vcardBytes <= 144 ? 'NTAG213' : vcardBytes <= 504 ? 'NTAG215' : 'NTAG216'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {vcardBytes <= 888 ? 'Capacidad óptima compatible' : 'Modo Cloud Activo (Sin límite)'}
                  </p>
                </div>
              </div>

              {/* Matriz QR (Fallback) */}
              <div className="flex flex-col items-center justify-center bg-[#12121c] p-4 rounded-[var(--radius-soft)] border border-gray-800">
                <p className="text-[10px] font-bruno text-gray-400 mb-2.5 uppercase tracking-wider">Matriz QR (Entregable 1)</p>
                <div className="bg-white p-2 rounded-lg shadow-xl">
                  <QRCodeSVG
                    id="preview-qr-code-svg"
                    value={formData.url || 'https://tsolutionsipidd.com'}
                    size={110}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <button
                  onClick={downloadQR}
                  className="mt-3 px-3 py-1 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all border border-[#00E5FF]/30 rounded-md text-[10px] font-bruno font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>⬇</span> Descargar QR (.PNG)
                </button>
              </div>

            </div>

            {/* BOTÓN DESCARGAR .VCF (Entregable 2) */}
            <div className="pt-2">
              <button
                onClick={downloadVCF}
                className="btn-primary w-full text-xs font-bruno tracking-wider flex items-center justify-center gap-2"
                style={{ backgroundColor: design.colorCTA }}
              >
                <span>💾</span> DESCARGAR ARCHIVO .VCF (ENTREGABLE 2)
              </button>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
