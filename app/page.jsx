'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Temas Estructurales
const THEMES = {
  classic: {
    id: 'classic',
    name: 'Clásico Corporativo',
    desc: 'Cabecera vibrante, logotipo central y pastillas de contacto',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    subTextColor: '#64748b'
  },
  modern: {
    id: 'modern',
    name: 'Cyber Modern / Dark',
    desc: 'Lienzo oscuro con acentos luminosos y doble glow',
    bgColor: '#090912',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista Ejecutivo',
    desc: 'Estilo editorial sobrio con líneas de corte y alto contraste',
    bgColor: '#fafafa',
    textColor: '#0f172a',
    subTextColor: '#475569'
  }
};

const POPULAR_FONTS = [
  { label: 'Inter (Moderna y Limpia)', value: 'Inter' },
  { label: 'Space Grotesk (Tecnológica)', value: 'Space Grotesk' },
  { label: 'Playfair Display (Elegante y Clásica)', value: 'Playfair Display' },
  { label: 'Montserrat (Geométrica)', value: 'Montserrat' },
  { label: 'Poppins (Amigable y Redondeada)', value: 'Poppins' },
  { label: 'Roboto (Estándar Android)', value: 'Roboto' },
  { label: 'Outfit (Vanguardista)', value: 'Outfit' },
  { label: 'Syne (Alta Moda / Diseño)', value: 'Syne' }
];

export default function VCardEngineDashboard() {
  const [mode, setMode] = useState('vcard'); // 'vcard' | 'review'

  // Datos del Formulario
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
    googleMapsUrl: 'https://maps.google.com',
    videoYoutubeUrl: ''
  });

  // Paleta Cromática (1: Primario, 2: Secundario, 3: CTA)
  const [design, setDesign] = useState({
    fontFamily: 'Inter',
    customFont: '',
    colorPrimario: '#F97316',   // Color 1: Naranja (Títulos / Puesto)
    colorSecundario: '#00E5FF', // Color 2: Aqua (Franjas / Badges / Íconos / Bordes)
    colorCTA: '#F97316',        // Color 3: Botón de Acción Principal
    theme: 'modern',
    logoScale: 100
  });

  // Imágenes
  const [logoImg, setLogoImg] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  // Inyección reactiva de Google Fonts
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

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCoverPhoto(evt.target?.result);
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

  const activeTheme = THEMES[design.theme] || THEMES.modern;
  const currentFontFamily = design.customFont.trim() || design.fontFamily;
  const qrTargetValue = mode === 'review'
    ? (formData.googleMapsUrl || 'https://maps.google.com')
    : (formData.url || 'https://tsolutionsipidd.com');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col bg-[#04040A] text-[#F0F0F8]">
      
      {/* HEADER MINIMALISTA CYBERPUNK */}
      <header className="mb-6 max-w-[1920px] mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bruno text-white tracking-wide">
            TSOLUTIONS <span className="text-[#F97316]">VCARD</span> ENGINE
          </h1>
          <p className="text-gray-400 text-sm mt-1">Generador de identidad digital con optimización algorítmica y base de datos.</p>
        </div>

        {/* CONTROLES DE CABECERA: SELECTOR DE MODO & LOGO */}
        <div className="flex items-center gap-4">
          <div className="flex bg-[#0A0A14] p-1 rounded-xl border border-gray-800 shadow-inner">
            <button
              onClick={() => setMode('vcard')}
              className={`px-4 py-2 rounded-lg text-xs font-bruno transition-all flex items-center gap-2 ${
                mode === 'vcard'
                  ? 'bg-[#F97316] text-black font-extrabold shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📇</span> Perfil Digital (vCard)
            </button>
            <button
              onClick={() => setMode('review')}
              className={`px-4 py-2 rounded-lg text-xs font-bruno transition-all flex items-center gap-2 ${
                mode === 'review'
                  ? 'bg-[#00E5FF] text-black font-extrabold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>⭐</span> Tap to Review (Maps)
            </button>
          </div>

          {/* Logo Oficial Tsolutions */}
          <div className="tsolutions-logo hidden sm:flex shrink-0" title="tsolutions ipidd">
            <div className="tsolutions-triangle"></div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 max-w-[1920px] mx-auto w-full items-start">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO DATA INPUT */}
        <section className="w-full lg:w-1/2 panel-glass p-6 md:p-8 overflow-y-auto space-y-6">
          <h2 className="text-xl font-bruno text-[#00E5FF] flex items-center gap-2 border-b border-gray-800 pb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            DATA INPUT
          </h2>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {mode === 'review' ? (
              /* MODO GOOGLE REVIEWS */
              <div className="bg-[#12121c] border border-[#00E5FF]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="text-sm font-bruno font-bold">Configuración de Reseñas de Google</h3>
                    <p className="text-xs text-gray-400">Redirección directa a la pantalla de 5 estrellas al acercar el teléfono</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Nombre del Negocio</label>
                  <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. TSolutions IPIDD" />
                </div>

                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Enlace de Reseñas de Google</label>
                  <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} className="input-dark w-full border-[#00E5FF]/40" placeholder="https://g.page/r/tu-negocio/review" />
                  <p className="text-[10px] text-gray-500 mt-1">Pega el link directo que Google Business te da para solicitar opiniones.</p>
                </div>
              </div>
            ) : (
              /* MODO VCARD COMPLETO */
              <>
                {/* LOGO Y PORTADA CON ESCALADOR */}
                <div className="bg-[#12121c] p-5 rounded-[var(--radius-soft)] border border-gray-800 shadow-[var(--shadow-card)] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logotipo */}
                    <div>
                      <label className="block text-xs font-bruno text-[#F0F0F8] mb-1.5 uppercase tracking-wider">Logotipo de la Empresa</label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleLogoUpload}
                        className="w-full text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F97316] file:text-black hover:file:bg-orange-400 transition-colors cursor-pointer"
                      />
                    </div>

                    {/* Foto de Portada / Banner */}
                    <div>
                      <label className="block text-xs font-bruno text-[#F0F0F8] mb-1.5 uppercase tracking-wider">Foto de Portada / Banner</label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleCoverUpload}
                        className="w-full text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#00E5FF] file:text-black hover:file:bg-cyan-400 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slider de Escala del Logo */}
                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex justify-between items-center text-xs font-bruno text-[#00E5FF] mb-1 uppercase">
                      <span>Tamaño / Escala del Logo</span>
                      <span className="text-white font-mono">{design.logoScale}px</span>
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

                {/* REDES SOCIALES (Facebook incluida, TikTok eliminada) */}
                <div className="border-t border-gray-800 pt-4 mt-4">
                  <h3 className="text-sm font-bruno text-[#00E5FF] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Redes Sociales & Canales Digitales
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
                  <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Nota / Bio / Propuesta de Valor</label>
                  <textarea name="nota" value={formData.nota} onChange={handleInputChange} className="input-dark w-full h-20 py-2.5" placeholder="Soluciones digitales, optimización y desarrollo..."></textarea>
                </div>
                
                {/* BRANDING DEL CLIENTE (Temas + 3 Colores + Google Fonts) */}
                <div className="bg-[#0c0c16] border border-gray-800 p-5 rounded-[var(--radius-large)] mt-6 space-y-4">
                  <h3 className="text-sm font-bruno text-[#FFD700] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Branding, Tema & Paleta Cromática
                  </h3>

                  {/* SELECTOR DE TEMAS ESTRUCTURALES */}
                  <div>
                    <label className="block text-xs text-gray-300 mb-2 uppercase tracking-wide">Tema de la Tarjeta</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(THEMES).map(th => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setDesign(prev => ({ ...prev, theme: th.id }))}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            design.theme === th.id
                              ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                              : 'bg-black/30 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <p className={`text-xs font-bruno font-bold ${design.theme === th.id ? 'text-[#00E5FF]' : 'text-white'}`}>{th.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{th.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* TIPOGRAFÍA GOOGLE FONTS */}
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

                  {/* PALETA 3 COLORES CON ETIQUETAS CLARAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Color 1: Primario */}
                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">1. Color Primario (Puesto/Títulos)</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>

                    {/* Color 2: Secundario (Franjas / Badges / Íconos) */}
                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">2. Color Secundario (Franjas/Íconos)</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>

                    {/* Color 3: CTA */}
                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">3. Color CTA (Botón Acción)</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

          </form>
        </section>

        {/* COLUMNA DERECHA: MOCKUP DEL CELULAR Y RESULTADOS */}
        <section className="w-full lg:w-1/2 flex flex-col items-center gap-6">
          
          {/* MOCKUP ELEGANTE DEL CELULAR (320px x 640px) */}
          <div className="w-[315px] sm:w-[335px] h-[640px] rounded-[44px] border-[8px] border-[#181826] bg-[#000000] shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col">
            
            {/* NOTCH / BOCINA */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#181826] rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-black rounded-full mr-2"></div>
              <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
            </div>

            {/* PANTALLA INTERNA DEL CELULAR */}
            <div
              className="flex-1 overflow-y-auto relative pb-20 select-none transition-all"
              style={{
                backgroundColor: activeTheme.bgColor,
                fontFamily: currentFontFamily,
                color: activeTheme.textColor
              }}
            >
              
              {mode === 'review' ? (
                /* MODO REVIEW EN CELULAR */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-yellow-400/10 border-2 border-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4">
                    ⭐
                  </div>
                  <h2 className="text-xl font-bold font-bruno">{formData.empresa || 'Nombre del Negocio'}</h2>
                  <p className="text-xs opacity-70 mt-1">Calificación en Google Maps</p>
                  
                  <div className="flex gap-1 my-4 text-yellow-400 text-lg">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>

                  <div className="p-4 bg-black/5 rounded-2xl border border-black/10 w-full mt-4">
                    <p className="text-xs font-semibold mb-2">Redirigiendo a Google...</p>
                    <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: `${design.colorPrimario} transparent transparent transparent` }}></div>
                  </div>
                </div>
              ) : (
                /* MODO VCARD SEGÚN EL TEMA */
                <>
                  {/* TEMA CLÁSICO */}
                  {design.theme === 'classic' && (
                    <div>
                      {/* Portada o Franja Secundaria Vibrante */}
                      <div
                        className="h-28 w-full relative overflow-hidden flex items-center justify-center transition-colors"
                        style={{ backgroundColor: design.colorSecundario }}
                      >
                        {coverPhoto ? (
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        )}
                      </div>

                      <div className="px-5 -mt-10">
                        {/* Logo Escalable */}
                        <div
                          className="rounded-2xl shadow-xl bg-white p-1 border-2 border-white flex items-center justify-center overflow-hidden"
                          style={{ width: `${design.logoScale}px`, height: `${design.logoScale}px` }}
                        >
                          {logoImg ? (
                            <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase font-bruno">LOGO</span>
                          )}
                        </div>

                        <div className="mt-3">
                          <h2 className="text-xl font-bold leading-tight">{formData.nombre} {formData.apellido}</h2>
                          
                          {/* Franja de Acento (Color Secundario con Glow) */}
                          <div
                            className="h-1.5 w-14 my-2.5 rounded-full transition-all"
                            style={{
                              backgroundColor: design.colorSecundario,
                              boxShadow: `0 0 10px ${design.colorSecundario}60`
                            }}
                          ></div>
                          
                          <p className="text-sm font-bold font-bruno" style={{ color: design.colorPrimario }}>{formData.puesto}</p>
                          
                          {/* Badge de Empresa en Color Secundario */}
                          {formData.empresa && (
                            <div
                              className="inline-block px-2.5 py-0.5 mt-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase border transition-all"
                              style={{
                                backgroundColor: `${design.colorSecundario}15`,
                                borderColor: `${design.colorSecundario}50`,
                                color: design.colorSecundario
                              }}
                            >
                              {formData.empresa}
                            </div>
                          )}
                        </div>

                        {formData.nota && (
                          <p className="text-xs mt-3 p-2.5 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-3" style={{ borderColor: design.colorCTA }}>
                            "{formData.nota}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TEMA MODERNO (CYBER DARK) */}
                  {design.theme === 'modern' && (
                    <div className="p-5 flex flex-col items-center text-center">
                      {coverPhoto && (
                        <div className="w-full h-24 rounded-2xl overflow-hidden mb-3 border border-white/10">
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Logo Circular con Glow de Color Primario & Secundario */}
                      <div
                        className="rounded-full shadow-2xl bg-[#090912] p-1 flex items-center justify-center overflow-hidden my-2 border-2 transition-all"
                        style={{
                          width: `${design.logoScale}px`,
                          height: `${design.logoScale}px`,
                          borderColor: design.colorPrimario,
                          boxShadow: `0 0 16px ${design.colorPrimario}50`
                        }}
                      >
                        {logoImg ? (
                          <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-500 font-bruno">LOGO</span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold tracking-tight mt-2 font-bruno">{formData.nombre} {formData.apellido}</h2>
                      
                      {/* Franja de Acento (Color Secundario con Glow) */}
                      <div
                        className="h-1.5 w-14 my-2 rounded-full transition-all"
                        style={{
                          backgroundColor: design.colorSecundario,
                          boxShadow: `0 0 10px ${design.colorSecundario}80`
                        }}
                      ></div>
                      
                      <p className="text-sm font-bold mt-0.5" style={{ color: design.colorPrimario }}>{formData.puesto}</p>
                      
                      {/* Badge de Empresa con Fondo y Borde Secundario */}
                      {formData.empresa && (
                        <div
                          className="inline-block px-3 py-1 mt-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all"
                          style={{
                            backgroundColor: `${design.colorSecundario}15`,
                            borderColor: `${design.colorSecundario}60`,
                            color: design.colorSecundario
                          }}
                        >
                          {formData.empresa}
                        </div>
                      )}

                      {formData.nota && (
                        <p className="text-xs mt-3 opacity-80 leading-relaxed px-2 italic">
                          "{formData.nota}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* TEMA MINIMALISTA */}
                  {design.theme === 'minimal' && (
                    <div className="p-6">
                      {coverPhoto && (
                        <div className="w-full h-28 overflow-hidden mb-4 border-b border-gray-200">
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div
                        className="bg-gray-100 p-2 flex items-center justify-center mb-3 border border-gray-200"
                        style={{ width: `${design.logoScale}px`, height: `${design.logoScale}px` }}
                      >
                        {logoImg ? (
                          <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400 font-bruno">LOGO</span>
                        )}
                      </div>

                      <h2 className="text-2xl font-light tracking-tight">{formData.nombre} <span className="font-extrabold">{formData.apellido}</span></h2>
                      
                      {/* Línea de Color Secundario */}
                      <div className="w-12 h-1 my-2.5 rounded-full" style={{ backgroundColor: design.colorSecundario }}></div>
                      
                      <p className="text-xs font-bold tracking-wider uppercase font-bruno" style={{ color: design.colorPrimario }}>{formData.puesto}</p>
                      
                      {formData.empresa && (
                        <p className="text-xs font-semibold mt-1" style={{ color: design.colorSecundario }}>{formData.empresa}</p>
                      )}

                      {formData.nota && (
                        <p className="text-xs mt-3 opacity-75 leading-relaxed italic">
                          "{formData.nota}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* PASTILLAS DE CONTACTO (Con Acentos del Color Secundario) */}
                  <div className="px-5 space-y-2 mt-4">
                    {formData.telefono && (
                      <div
                        className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          backgroundColor: `${design.colorSecundario}08`,
                          borderColor: `${design.colorSecundario}25`
                        }}
                      >
                        <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span className="truncate">{formData.telefono}</span>
                      </div>
                    )}
                    {formData.correo && (
                      <div
                        className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          backgroundColor: `${design.colorSecundario}08`,
                          borderColor: `${design.colorSecundario}25`
                        }}
                      >
                        <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="truncate">{formData.correo}</span>
                      </div>
                    )}
                    {formData.url && (
                      <div
                        className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          backgroundColor: `${design.colorSecundario}08`,
                          borderColor: `${design.colorSecundario}25`
                        }}
                      >
                        <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        <span className="truncate">{formData.url.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                    {formData.googleMapsUrl && (
                      <div
                        className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border transition-all"
                        style={{
                          backgroundColor: `${design.colorSecundario}15`,
                          borderColor: design.colorSecundario,
                          color: design.colorSecundario
                        }}
                      >
                        <span>📍</span> Ver Ubicación en Maps
                      </div>
                    )}
                    {formData.videoYoutubeUrl && (
                      <div className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 shadow-md">
                        <span>▶</span> Ver Video de Presentación
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* BOTÓN FLOTANTE INFERIOR DENTRO DEL MOCKUP (Color CTA) */}
            {mode === 'vcard' && (
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                <button
                  onClick={downloadVCF}
                  className="w-full py-3 rounded-xl text-center font-bruno font-bold text-xs uppercase tracking-wider text-black shadow-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110"
                  style={{ backgroundColor: design.colorCTA }}
                >
                  <span>💾</span> Guardar Contacto (.vcf)
                </button>
              </div>
            )}
          </div>

          {/* PANEL DE RESULTADOS, QR Y LOS 2 ENTREGABLES (Midnight Panel) */}
          <div className="w-full panel-glass p-6 md:p-8 flex flex-col justify-between space-y-6">
            
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
                    value={qrTargetValue}
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
