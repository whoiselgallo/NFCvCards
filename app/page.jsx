'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Temas Estructurales
const THEMES = {
  classic: {
    id: 'classic',
    name: 'Clásico Corporativo',
    desc: 'Franja superior de acento y logotipo destacado',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    subTextColor: '#64748b'
  },
  modern: {
    id: 'modern',
    name: 'Cyber Modern / Dark',
    desc: 'Lienzo oscuro con bordes luminosos y glow',
    bgColor: '#090912',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista Ejecutivo',
    desc: 'Estilo editorial, sobrio y de alto contraste',
    bgColor: '#fafafa',
    textColor: '#0f172a',
    subTextColor: '#475569'
  }
};

const POPULAR_FONTS = [
  'Inter',
  'Montserrat',
  'Poppins',
  'Space Grotesk',
  'Playfair Display',
  'Roboto',
  'Outfit',
  'Syne',
  'Raleway',
  'Oswald'
];

export default function VCardEngineApp() {
  const [mode, setMode] = useState('vcard');

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    empresa: 'TSolutions IPIDD',
    puesto: 'CEO / Director Creativo',
    telefono: '+52 686 676 1131',
    whatsapp: '+52 686 526 1453',
    correo: 'contacto@tsolutionsipidd.com',
    url: 'https://tsolutionsipidd.com',
    linkedin: '',
    instagram: '',
    facebook: '',
    calle: 'Av. Ignacio Aldama #185',
    ciudad: 'Mexicali',
    estado: 'Baja California',
    cp: '21000',
    pais: 'México',
    nota: 'Tecnología instalada. Conocimiento transferido. Negocios escalados.',
    googleMapsUrl: '',
    videoYoutubeUrl: ''
  });

  const [design, setDesign] = useState({
    fontFamily: 'Inter',
    customFont: '',
    colorPrimario: '#00E5FF',
    colorSecundario: '#3B82F6',
    colorCTA: '#F97316',
    theme: 'modern',
    logoScale: 100
  });

  const [logoImg, setLogoImg] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  useEffect(() => {
    const font = design.customFont.trim() || design.fontFamily;
    if (font) {
      const linkId = 'gfonts-dynamic-cdn';
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

  const downloadVCardFile = () => {
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

    if (logoImg) {
      const b64 = logoImg.split(',')[1];
      if (b64) vcard += `PHOTO;ENCODING=b;TYPE=JPEG:${b64}\r\n`;
    }

    vcard += `END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.nombre || 'contacto'}_${formData.apellido || 'vcard'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadQrCode = () => {
    const svg = document.getElementById('preview-qr-svg');
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

  const handleCloudDeploy = () => {
    alert('¡Perfil listo para sincronizar con Google Cloud SQL (Fase 3)!');
  };

  const activeTheme = THEMES[design.theme] || THEMES.modern;
  const currentFont = design.customFont.trim() || design.fontFamily;
  const qrTargetValue = mode === 'review' 
    ? (formData.googleMapsUrl || 'https://maps.google.com') 
    : (formData.url || 'https://tsolutionsipidd.com');

  return (
    <div className="min-h-screen bg-[#04040A] text-[#F0F0F8] p-3 sm:p-6 lg:p-8">
      
      {/* HEADER PRINCIPAL */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0A0A14] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#F97316] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <div className="w-full h-full bg-[#04040A] rounded-[10px] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bruno font-bold tracking-wide text-white">TSOLUTIONS <span className="text-[#00E5FF]">IPIDD</span></h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-bold uppercase tracking-wider">vCard Engine PRO</span>
            </div>
            <p className="text-xs text-gray-400">Constructor Dinámico de Identidad Digital & NFC de Alta Coherencia</p>
          </div>
        </div>

        {/* SELECTOR DE MODO */}
        <div className="flex bg-[#04040A] p-1 rounded-xl border border-white/10 w-full md:w-auto shadow-inner">
          <button
            onClick={() => setMode('vcard')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bruno transition-all flex items-center justify-center gap-2 ${
              mode === 'vcard' 
                ? 'bg-gradient-to-r from-[#F97316] to-orange-500 text-black font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📇</span> Perfil Digital (vCard)
          </button>
          <button
            onClick={() => setMode('review')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bruno transition-all flex items-center justify-center gap-2 ${
              mode === 'review' 
                ? 'bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black font-extrabold shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⭐</span> Tap to Review (Maps)
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL EN GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: CONFIGURADOR */}
        <div className="lg:col-span-7 space-y-4">
          
          {mode === 'review' ? (
            <div className="bg-[#0A0A14] border border-[#00E5FF]/20 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
                <span className="text-xl">⭐</span>
                <div>
                  <h2 className="text-base font-bruno text-[#00E5FF]">Configuración de Reseñas de Google</h2>
                  <p className="text-xs text-gray-400">Redirección directa a la pantalla de 5 estrellas al acercar el teléfono</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre del Negocio o Establecimiento</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    placeholder="Ej. TSolutions IPIDD Mexicali"
                    className="input-dark w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Enlace de Reseñas (Google Place Review URL)</label>
                  <input
                    type="text"
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={handleInputChange}
                    placeholder="https://g.page/r/tu-negocio/review"
                    className="input-dark w-full text-sm border-[#00E5FF]/40 focus:border-[#00E5FF]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">💡 Pega el link directo que Google Business te entrega en el botón "Solicitar reseñas".</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 1. INFORMACIÓN PERSONAL */}
              <section className="bg-[#0A0A14] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h2 className="text-sm font-bruno text-[#00E5FF] mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  <span>👤</span> 1. Información Personal & Corporativa
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Empresa / Negocio</label>
                    <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} placeholder="Empresa" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Puesto / Título Profesional</label>
                    <input type="text" name="puesto" value={formData.puesto} onChange={handleInputChange} placeholder="Ej. CEO / Especialista" className="input-dark w-full text-sm" />
                  </div>
                </div>
              </section>

              {/* 2. BRANDING, PALETA CROMÁTICA & LOGOS */}
              <section className="bg-[#0A0A14] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h2 className="text-sm font-bruno text-[#F97316] mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  <span>🎨</span> 2. Branding, Paleta Cromática & Logos
                </h2>

                {/* TEMAS */}
                <div className="mb-4">
                  <label className="block text-[11px] text-gray-400 uppercase font-semibold mb-2 tracking-wider">Tema Estructural</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(THEMES).map(th => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setDesign(prev => ({ ...prev, theme: th.id }))}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          design.theme === th.id 
                            ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.2)]' 
                            : 'bg-black/30 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className={`text-xs font-bruno font-bold ${design.theme === th.id ? 'text-[#00E5FF]' : 'text-white'}`}>{th.name}</span>
                        <span className="text-[10px] text-gray-400 mt-1 line-clamp-1">{th.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 COLORES: PRIMARIO, SECUNDARIO, CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  
                  {/* Primario */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Color Primario</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="colorPrimario"
                        value={design.colorPrimario}
                        onChange={handleDesignChange}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        name="colorPrimario"
                        value={design.colorPrimario}
                        onChange={handleDesignChange}
                        className="input-dark w-full text-xs font-mono uppercase h-8 px-2"
                      />
                    </div>
                  </div>

                  {/* Secundario */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Color Secundario</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="colorSecundario"
                        value={design.colorSecundario}
                        onChange={handleDesignChange}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        name="colorSecundario"
                        value={design.colorSecundario}
                        onChange={handleDesignChange}
                        className="input-dark w-full text-xs font-mono uppercase h-8 px-2"
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Color CTA (Botón)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="colorCTA"
                        value={design.colorCTA}
                        onChange={handleDesignChange}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        name="colorCTA"
                        value={design.colorCTA}
                        onChange={handleDesignChange}
                        className="input-dark w-full text-xs font-mono uppercase h-8 px-2"
                      />
                    </div>
                  </div>
                </div>

                {/* FUENTES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Tipografías Recomendadas</label>
                    <select
                      name="fontFamily"
                      value={design.fontFamily}
                      onChange={handleDesignChange}
                      className="input-dark w-full text-xs font-medium"
                    >
                      {POPULAR_FONTS.map(f => (
                        <option key={f} value={f} className="bg-[#0A0A14] text-white">{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">O escribe cualquier Google Font exacta</label>
                    <input
                      type="text"
                      name="customFont"
                      value={design.customFont}
                      onChange={handleDesignChange}
                      placeholder="Ej. Bebas Neue, Lato, Cinzel..."
                      className="input-dark w-full text-xs"
                    />
                  </div>
                </div>

                {/* LOGO Y FOTO DE PRESENTACIÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  
                  {/* LOGO CON ESCALADOR */}
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2">
                    <label className="block text-xs font-semibold text-white">Logotipo de la Empresa</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#00E5FF] file:text-black file:font-bold file:text-xs hover:file:bg-cyan-400 cursor-pointer"
                    />
                    
                    <div className="pt-1">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                        <span>Ajuste de Escala / Tamaño</span>
                        <span className="font-mono text-[#00E5FF]">{design.logoScale}px</span>
                      </div>
                      <input
                        type="range"
                        name="logoScale"
                        min="50"
                        max="160"
                        value={design.logoScale}
                        onChange={handleDesignChange}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                      />
                    </div>
                  </div>

                  {/* FOTO DE PRESENTACIÓN */}
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2">
                    <label className="block text-xs font-semibold text-white">Foto de Presentación / Portada</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#F97316] file:text-black file:font-bold file:text-xs hover:file:bg-orange-400 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 pt-1">Ideal para retrato personal o foto de las instalaciones del negocio.</p>
                  </div>
                </div>

              </section>

              {/* 3. CONTACTO, REDES & MULTIMEDIA */}
              <section className="bg-[#0A0A14] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h2 className="text-sm font-bruno text-[#00E5FF] mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  <span>🌐</span> 3. Canales de Contacto, Redes & Ubicación
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Teléfono Móvil</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+52 686 000 0000" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">WhatsApp Directo</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+52 686 000 0000" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Correo Electrónico</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="contacto@tudominio.com" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Sitio Web Oficial</label>
                    <input type="text" name="url" value={formData.url} onChange={handleInputChange} placeholder="https://tudominio.com" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Facebook Page URL</label>
                    <input type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="https://facebook.com/tupagina" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Instagram URL</label>
                    <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="https://instagram.com/tuperfil" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">LinkedIn Perfil / Empresa</label>
                    <input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/usuario" className="input-dark w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Google Maps (Ubicación)</label>
                    <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="input-dark w-full text-sm" />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] text-gray-400 mb-1">Video de Presentación (YouTube URL)</label>
                  <input type="text" name="videoYoutubeUrl" value={formData.videoYoutubeUrl} onChange={handleInputChange} placeholder="https://youtube.com/watch?v=..." className="input-dark w-full text-sm" />
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] text-gray-400 mb-1">Nota / Propuesta de Valor / Bio</label>
                  <textarea name="nota" value={formData.nota} onChange={handleInputChange} rows={2} placeholder="Descripción de los servicios..." className="input-dark w-full text-sm py-2" />
                </div>
              </section>
            </>
          )}

          {/* BOTÓN MAESTRO DE ACCIÓN */}
          <div className="pt-1">
            <button
              onClick={handleCloudDeploy}
              className="w-full py-4 rounded-xl font-bruno text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 text-black shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all hover:scale-[1.01] active:scale-100"
              style={{ backgroundColor: design.colorCTA }}
            >
              <span>🚀</span> Guardar y Desplegar Perfil en la Nube
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: SIMULADOR MÓVIL & ENTREGABLES */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 sticky top-6">
          
          {/* MOCKUP DEL TELÉFONO CELULAR */}
          <div className="w-[305px] sm:w-[325px] h-[630px] rounded-[44px] border-[9px] border-[#181826] bg-[#000000] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
            
            {/* NOTCH */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#181826] rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-black rounded-full mr-2"></div>
              <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
            </div>

            {/* CONTENEDOR DEL CELULAR */}
            <div
              className="flex-1 overflow-y-auto relative pb-20 select-none"
              style={{
                backgroundColor: activeTheme.bgColor,
                fontFamily: currentFont,
                color: activeTheme.textColor
              }}
            >
              
              {mode === 'review' ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-yellow-400/10 border-2 border-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4">
                    ⭐
                  </div>
                  <h2 className="text-xl font-bold">{formData.empresa || 'Nombre del Negocio'}</h2>
                  <p className="text-xs opacity-70 mt-1">Calificación en Google Maps</p>
                  
                  <div className="flex gap-1 my-4 text-yellow-400 text-lg">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 w-full mt-4">
                    <p className="text-xs font-semibold mb-2">Redirigiendo a Google...</p>
                    <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: `${design.colorPrimario} transparent transparent transparent` }}></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* CLÁSICO */}
                  {design.theme === 'classic' && (
                    <div>
                      <div className="h-28 w-full relative overflow-hidden" style={{ backgroundColor: design.colorSecundario }}>
                        {coverPhoto && <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-90" />}
                      </div>

                      <div className="px-5 -mt-10">
                        <div
                          className="rounded-2xl shadow-xl bg-white p-1 border-2 border-white flex items-center justify-center overflow-hidden"
                          style={{ width: `${design.logoScale}px`, height: `${design.logoScale}px` }}
                        >
                          {logoImg ? (
                            <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Logo</span>
                          )}
                        </div>

                        <div className="mt-3">
                          <h2 className="text-xl font-bold leading-tight">{formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}</h2>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto'}</p>
                          <p className="text-xs opacity-75">{formData.empresa || 'Empresa'}</p>
                        </div>

                        {formData.nota && (
                          <p className="text-xs mt-3 p-2.5 rounded-xl bg-black/5 opacity-80 leading-relaxed italic border-l-2" style={{ borderColor: design.colorCTA }}>
                            "{formData.nota}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODERNO */}
                  {design.theme === 'modern' && (
                    <div className="p-5 flex flex-col items-center text-center">
                      {coverPhoto && (
                        <div className="w-full h-24 rounded-2xl overflow-hidden mb-3 border border-white/10">
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div
                        className="rounded-full shadow-2xl bg-[#090912] p-1 flex items-center justify-center overflow-hidden my-2 border-2"
                        style={{
                          width: `${design.logoScale}px`,
                          height: `${design.logoScale}px`,
                          borderColor: design.colorPrimario,
                          boxShadow: `0 0 15px ${design.colorPrimario}40`
                        }}
                      >
                        {logoImg ? (
                          <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-500">LOGO</span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold tracking-tight mt-2">{formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}</h2>
                      <p className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: design.colorSecundario }}>{formData.empresa || 'EMPRESA'}</p>
                      <p className="text-sm font-medium mt-1" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto'}</p>

                      {formData.nota && (
                        <p className="text-xs mt-3 opacity-80 leading-relaxed px-2">
                          {formData.nota}
                        </p>
                      )}
                    </div>
                  )}

                  {/* MINIMALISTA */}
                  {design.theme === 'minimal' && (
                    <div className="p-6">
                      {coverPhoto && (
                        <div className="w-full h-28 overflow-hidden mb-4 border-b border-gray-200">
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div
                        className="bg-gray-100 p-2 flex items-center justify-center mb-4 border border-gray-200"
                        style={{ width: `${design.logoScale}px`, height: `${design.logoScale}px` }}
                      >
                        {logoImg ? (
                          <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">LOGO</span>
                        )}
                      </div>

                      <h2 className="text-2xl font-light tracking-tight">{formData.nombre || 'Nombre'} <span className="font-extrabold">{formData.apellido || 'Apellido'}</span></h2>
                      <p className="text-xs font-bold mt-1 tracking-wider uppercase" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto'}</p>
                      <div className="w-8 h-0.5 my-3" style={{ backgroundColor: design.colorSecundario }}></div>
                      <p className="text-xs opacity-70">{formData.empresa || 'Empresa'}</p>

                      {formData.nota && (
                        <p className="text-xs mt-4 opacity-75 leading-relaxed">
                          {formData.nota}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ENLACES RÁPIDOS */}
                  <div className="px-5 space-y-2 mt-3">
                    {formData.videoYoutubeUrl && (
                      <div className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 shadow-md">
                        <span>▶</span> Ver Presentación en Video
                      </div>
                    )}
                    {formData.googleMapsUrl && (
                      <div className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border" style={{ borderColor: design.colorPrimario, color: design.colorPrimario }}>
                        <span>📍</span> Ubicación en Google Maps
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* BOTÓN FLOTANTE INFERIOR */}
            {mode === 'vcard' && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <button
                  onClick={downloadVCardFile}
                  className="w-full py-3.5 rounded-xl text-center font-bruno font-bold text-xs uppercase tracking-wider text-black shadow-2xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: design.colorCTA }}
                >
                  <span>💾</span> Guardar Contacto (.vcf)
                </button>
              </div>
            )}
          </div>

          {/* LOS 2 ENTREGABLES OFICIALES */}
          <div className="w-full bg-[#0A0A14] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bruno text-[#F97316] uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
              <span>📦</span> Los 2 Entregables Oficiales
            </h3>

            {/* QR CODE */}
            <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="p-1.5 bg-white rounded-lg shrink-0 shadow-md">
                <QRCodeSVG
                  id="preview-qr-svg"
                  value={qrTargetValue}
                  size={75}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">Código QR de Alta Resolución</p>
                <p className="text-[10px] text-gray-400 truncate">Destino: {qrTargetValue}</p>
                <button
                  onClick={downloadQrCode}
                  className="mt-1.5 px-3 py-1 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all border border-[#00E5FF]/30 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>⬇</span> Descargar QR (.PNG)
                </button>
              </div>
            </div>

            {/* ARCHIVO .VCF */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Archivo de Contacto (.vcf)</p>
                <p className="text-[10px] text-gray-400">Compatible con iOS, Android & NFC</p>
              </div>
              <button
                onClick={downloadVCardFile}
                className="px-3 py-2 bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316] hover:text-black transition-all border border-[#F97316]/30 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <span>💾</span> Bajar .VCF
              </button>
            </div>

            {/* TELEMETRÍA */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[10px] flex justify-between items-center text-gray-400">
              <span>Payload URL para NFC: <b className="text-[#00E5FF]">~38 Bytes</b></span>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-bold">100% NTAG213 / NTAG216</span>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
