'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Temas Disponibles
const THEMES = {
  classic: { name: 'Clásico Empresarial', bgColor: '#ffffff', textColor: '#333333', cardBg: '#f8f9fa' },
  modern: { name: 'Moderno / Oscuro', bgColor: '#121212', textColor: '#ffffff', cardBg: '#1e1e1e' },
  minimal: { name: 'Minimalista', bgColor: '#fafafa', textColor: '#000000', cardBg: '#ffffff' }
};

// Fuentes Populares
const POPULAR_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Playfair Display', 'Space Grotesk'];

export default function Dashboard() {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', empresa: '', puesto: '',
        telefono: '', whatsapp: '', correo: '', url: '',
    linkedin: '', instagram: '', facebook: '', tiktok: '',
    nota: '', googleMapsUrl: '', videoYoutubeUrl: ''
  });

  const [mode, setMode] = useState('vcard'); // 'vcard' o 'review'
  
  const [design, setDesign] = useState({
    fontFamily: 'Inter',
    customFont: '',
    colorPrimario: '#F97316',
    colorSecundario: '#00E5FF',
    colorTexto: '#333333',
    theme: 'classic'
  });

  const [photo, setPhoto] = useState(null);

  // Inyectar fuente de Google Dinámicamente
  useEffect(() => {
    const fontToLoad = design.customFont || design.fontFamily;
    if (fontToLoad) {
      const linkId = 'dynamic-font';
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = "https://fonts.googleapis.com/css2?family=" + fontToLoad.replace(/ /g, "+") + ":wght@300;400;600;700&display=swap";
    }
  }, [design.fontFamily, design.customFont]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDesignChange = (e) => {
    setDesign({ ...design, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setPhoto(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Aquí implementaremos la lógica de Firebase en la Fase 3
    alert("Guardando perfil en la nube...");
  };

  const activeTheme = THEMES[design.theme];
  const currentFont = design.customFont || design.fontFamily;

  return (
    <div className="min-h-screen bg-[var(--negro-profundo)] text-[var(--blanco-puro)] p-4 md:p-8 flex flex-col md:flex-row gap-8">
      
      {/* PANEL IZQUIERDO: FORMULARIO */}
      <div className="w-full md:w-2/3 space-y-8">
        <div>
          <h1 className="text-3xl font-bruno text-[var(--aqua-turquesa)] mb-2">VCard Engine <span className="text-sm text-[var(--naranja-energy)]">PRO</span></h1>
          <p className="text-gray-400 text-sm">Plataforma Dinámica de Perfiles y Redirecciones.</p>
        </div>

        {/* MODO DE OPERACIÓN */}
        <div className="flex gap-4 p-1 bg-black/40 rounded-xl border border-gray-800">
          <button onClick={() => setMode('vcard')} className={`flex-1 py-3 text-sm font-bruno rounded-lg transition-all ${mode === 'vcard' ? 'bg-[var(--naranja-energy)] text-black' : 'text-gray-400 hover:bg-gray-800'}`}>
            Perfil Digital (vCard)
          </button>
          <button onClick={() => setMode('review')} className={`flex-1 py-3 text-sm font-bruno rounded-lg transition-all ${mode === 'review' ? 'bg-[var(--aqua-turquesa)] text-black' : 'text-gray-400 hover:bg-gray-800'}`}>
            Tap to Review (Google Maps)
          </button>
        </div>

                {mode === 'review' ? (
          <div className="panel-glass p-6">
            <h2 className="text-xl font-bruno mb-4 border-b border-gray-800 pb-2 text-[var(--aqua-turquesa)]">Configuración de Reseñas</h2>
            <p className="text-sm text-gray-400 mb-4">El usuario será enviado directamente a la pantalla de "Dejar 5 estrellas" en Google Maps sin pasar por un perfil intermedio.</p>
            <input type="text" name="empresa" placeholder="Nombre del Negocio" className="input-dark w-full mb-4" onChange={handleChange} value={formData.empresa} />
            <input type="text" name="googleMapsUrl" placeholder="Link exacto de Google Reviews" className="input-dark w-full mb-4" onChange={handleChange} value={formData.googleMapsUrl} />
            
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
               <h3 className="text-sm font-bold text-[var(--naranja-energy)] mb-2">💡 Práctica Recomendada</h3>
               <p className="text-xs text-gray-400">Programa la tarjeta NFC o el QR con la URL generada. Ideal para mostradores o mesas de restaurantes.</p>
            </div>
          </div>
        ) : (
          <>
          {/* 1. Datos Personales */}
        <div className="panel-glass p-6">
          <h2 className="text-xl font-bruno mb-4 border-b border-gray-800 pb-2">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="apellido" placeholder="Apellido" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="empresa" placeholder="Empresa" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="puesto" placeholder="Puesto / Cargo" className="input-dark w-full" onChange={handleChange} />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-2">Fotografía (Alta Definición Habilitada)</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--aqua-turquesa)] file:text-black hover:file:bg-cyan-400 cursor-pointer" />
          </div>
        </div>

        {/* 2. Diseño y Marca */}
        <div className="panel-glass p-6">
          <h2 className="text-xl font-bruno mb-4 border-b border-gray-800 pb-2">Branding y Diseño</h2>
          
          {/* Themes */}
          <div className="mb-6">
            <label className="block text-sm text-[var(--naranja-energy)] mb-2">Tema Estructural</label>
            <div className="flex gap-4">
              {Object.keys(THEMES).map(key => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" value={key} checked={design.theme === key} onChange={handleDesignChange} className="accent-[var(--naranja-energy)]" />
                  <span className="text-sm">{THEMES[key].name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fonts */}
            <div>
              <label className="block text-sm mb-2 text-gray-400">Tipografía de Marca (Google Fonts)</label>
              <select name="fontFamily" className="input-dark w-full mb-2" onChange={handleDesignChange} value={design.fontFamily}>
                {POPULAR_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
              <input type="text" name="customFont" placeholder="O escribe el nombre de una fuente exacta" className="input-dark w-full text-xs" onChange={handleDesignChange} value={design.customFont} />
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="color" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" />
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Color Primario (Hex)</label>
                  <input type="text" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="input-dark w-full h-8 text-sm uppercase" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="color" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" />
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Color Secundario (Hex)</label>
                  <input type="text" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="input-dark w-full h-8 text-sm uppercase" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Contacto & Redes */}
        <div className="panel-glass p-6">
          <h2 className="text-xl font-bruno mb-4 border-b border-gray-800 pb-2">Contacto y Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="telefono" placeholder="Teléfono Móvil" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="whatsapp" placeholder="WhatsApp" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="correo" placeholder="Correo Electrónico" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="url" placeholder="Sitio Web" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="linkedin" placeholder="LinkedIn URL" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="instagram" placeholder="Instagram URL" className="input-dark w-full" onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input type="text" name="googleMapsUrl" placeholder="Enlace de Google Maps (Ubicación)" className="input-dark w-full" onChange={handleChange} />
            <input type="text" name="videoYoutubeUrl" placeholder="Video de YouTube (Presentación)" className="input-dark w-full" onChange={handleChange} />
          </div>
          <textarea name="nota" placeholder="Bio / Descripción de la empresa..." className="input-dark w-full mt-4 h-24 py-3" onChange={handleChange}></textarea>
        </div>
          </>
        )}

        <button onClick={handleSave} className="btn-primary w-full text-lg py-4">
          Guardar y Desplegar Perfil
        </button>
      </div>

      {/* PANEL DERECHO: PREVIEW MÓVIL (WEB PROFILE) */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <h3 className="text-sm font-bruno text-gray-400 mb-4 uppercase tracking-widest">Vista Previa Móvil</h3>
        
        {/* Celular Mockup */}
        <div className="w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-gray-800 overflow-hidden relative shadow-2xl flex flex-col" style={{ backgroundColor: activeTheme.bgColor, fontFamily: currentFont }}>
          
                    {/* Renders based on Theme */}
          {mode === 'review' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
               <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center text-4xl shadow-lg">⭐</div>
               <h2 className="text-2xl font-bold text-gray-900">{formData.empresa || 'Tu Negocio'}</h2>
               <p className="text-gray-500 text-sm mt-2">Redirigiendo a Google Maps para dejar reseña...</p>
               <div className="mt-8 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {mode === 'vcard' && design.theme === 'classic' && (
            <div className="flex-1 overflow-y-auto">
              <div className="h-24 w-full" style={{ backgroundColor: design.colorSecundario }}></div>
              <div className="px-6 -mt-12">
                <div className="w-24 h-24 rounded-xl shadow-lg bg-white overflow-hidden border-4 border-white flex items-center justify-center text-xs text-gray-300">
                  {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : 'LOGO'}
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold" style={{ color: activeTheme.textColor }}>{formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}</h2>
                  <p className="font-semibold text-lg" style={{ color: design.colorPrimario }}>{formData.puesto || 'Cargo Profesional'}</p>
                  <p className="text-sm opacity-70" style={{ color: activeTheme.textColor }}>{formData.empresa || 'Empresa S.A.'}</p>
                </div>
                {formData.nota && <p className="mt-4 text-sm opacity-80" style={{ color: activeTheme.textColor }}>{formData.nota}</p>}
                
                {formData.videoYoutubeUrl && (
                  <div className="mt-4 w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ border: 1px solid  }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center z-10">
                       <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
                
                {formData.googleMapsUrl && (
                  <div className="mt-3 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer" style={{ backgroundColor: design.colorPrimario, color: '#fff' }}>
                     📍 Ver Ubicación en Maps
                  </div>
                )}
              </div>
            </div>
          )}

          {design.theme === 'modern' && (
            <div className="flex-1 overflow-y-auto flex flex-col items-center pt-12 px-6 text-center">
              <div className="w-32 h-32 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-gray-800 overflow-hidden border-2 flex items-center justify-center mb-6" style={{ borderColor: design.colorPrimario }}>
                {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">LOGO</span>}
              </div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: activeTheme.textColor }}>{formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}</h2>
              <p className="text-sm mt-1 uppercase tracking-widest" style={{ color: design.colorSecundario }}>{formData.empresa || 'EMPRESA'}</p>
              <p className="text-md mt-2" style={{ color: design.colorPrimario }}>{formData.puesto || 'Cargo Profesional'}</p>
              
              <div className="w-full h-px bg-gray-800 my-6"></div>
              {formData.nota && <p className="text-sm opacity-80 leading-relaxed mb-4" style={{ color: activeTheme.textColor }}>{formData.nota}</p>}
              
              {formData.videoYoutubeUrl && (
                  <div className="w-full h-40 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg border border-gray-700 mb-4 relative overflow-hidden">
                    <span className="text-xs text-gray-400 absolute bottom-2">Presentación de Negocio</span>
                    <div className="w-12 h-12 bg-[var(--naranja-energy)] rounded-full flex items-center justify-center shadow-lg">▶</div>
                  </div>
              )}
              
              {formData.googleMapsUrl && (
                  <div className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase border" style={{ borderColor: design.colorSecundario, color: design.colorSecundario }}>
                     📍 Navegar con Maps
                  </div>
              )}
            </div>
          )}

          {design.theme === 'minimal' && (
            <div className="flex-1 overflow-y-auto pt-16 px-8">
              <h2 className="text-3xl font-light tracking-tighter" style={{ color: activeTheme.textColor }}>
                {formData.nombre || 'Nombre'} <br/><span className="font-bold">{formData.apellido || 'Apellido'}</span>
              </h2>
              <p className="mt-4 text-sm font-semibold" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto'}</p>
              <div className="w-12 h-1 mt-4" style={{ backgroundColor: design.colorSecundario }}></div>
              
              <div className="mt-8 w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 grayscale">
                 {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : 'FOTO'}
              </div>
              {formData.nota && <p className="mt-6 text-sm opacity-60 leading-loose" style={{ color: activeTheme.textColor }}>{formData.nota}</p>}
              
              {formData.videoYoutubeUrl && (
                  <div className="mt-6 w-full h-32 bg-gray-100 flex items-center justify-center border border-gray-200">
                    <span className="text-xs font-bold tracking-widest text-gray-500">▶ VIDEO INTRO</span>
                  </div>
              )}
              
              {formData.googleMapsUrl && (
                  <div className="mt-4 w-full py-2 text-center border-b border-black text-xs font-bold tracking-widest uppercase cursor-pointer" style={{ color: activeTheme.textColor }}>
                     📍 Google Maps
                  </div>
              )}
            </div>
          )}

          {/* Botón Flotante Falso (Simulación de Guardar Contacto) */}
          <div className="absolute bottom-6 left-6 right-6">
             <div className="w-full py-4 rounded-xl text-center font-bold text-white shadow-xl text-sm" style={{ backgroundColor: design.colorPrimario }}>
               GUARDAR CONTACTO
             </div>
          </div>
          )}
        </div>

        {/* Generador de Link NFC */}
        <div className="panel-glass p-4 mt-6 w-full text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Para tu Chip NFC</p>
          <div className="bg-black/50 p-2 rounded text-sm text-[var(--aqua-turquesa)] break-all font-mono">
            https://tsolutions.com/p/ejemplo
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Pesa solo 32 bytes (100% compatible NTAG213)</p>
        </div>
      </div>

    </div>
  );
}



