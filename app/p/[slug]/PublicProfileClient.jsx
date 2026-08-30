'use client';

import React, { useEffect } from 'react';

// Helper para sanitizar y autocomponer URLs de Redes Sociales
export function getSocialUrl(type, value) {
  if (!value || !value.trim()) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(facebook|instagram|linkedin)\.com\/(in\/)?/, '');
  if (type === 'facebook') return `https://facebook.com/${clean}`;
  if (type === 'instagram') return `https://instagram.com/${clean}`;
  if (type === 'linkedin') return `https://linkedin.com/in/${clean}`;
  return trimmed;
}

export default function PublicProfileClient({ profile }) {
  const {
    nombre = '',
    apellido = '',
    empresa = '',
    puesto = '',
    telefono = '',
    whatsapp = '',
    correo = '',
    url = '',
    linkedin = '',
    instagram = '',
    facebook = '',
    calle = '',
    ciudad = '',
    estado = '',
    cp = '',
    pais = '',
    nota = '',
    google_maps_url = '',
    video_youtube_url = '',
    theme = 'modern',
    font_family = 'Inter',
    color_primario = '#F97316',
    color_secundario = '#00E5FF',
    color_cta = '#F97316',
    logo_scale = 100,
    cover_position_y = 50,
    cover_zoom = 100,
    logo_url = null,
    cover_url = null
  } = profile;

  // Inyección de Google Font dinámicamente
  useEffect(() => {
    if (font_family) {
      const linkId = 'gfonts-public-profile';
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font_family)}:wght@300;400;500;600;700;800&display=swap`;
    }
  }, [font_family]);

  // Generador Inteligente de URL de Google Maps
  const effectiveMapsUrl = google_maps_url && google_maps_url.trim().startsWith('http')
    ? google_maps_url.trim()
    : (() => {
        const parts = [];
        if (calle?.trim()) parts.push(calle.trim());
        if (ciudad?.trim()) parts.push(ciudad.trim());
        if (estado?.trim()) parts.push(estado.trim());
        if (pais?.trim()) parts.push(pais.trim());

        if (parts.length > 0) {
          const query = (empresa?.trim() ? empresa.trim() + ', ' : '') + parts.join(', ');
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        } else if (empresa?.trim()) {
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(empresa.trim())}`;
        }
        return '';
      })();

  const locationLabel = [ciudad, pais].filter(Boolean).join(', ') || (empresa ? `Buscar ${empresa}` : 'Ver Ubicación en Google Maps');

  // URLs completas de redes sociales
  const fbUrl = getSocialUrl('facebook', facebook);
  const igUrl = getSocialUrl('instagram', instagram);
  const inUrl = getSocialUrl('linkedin', linkedin);

  // Generador de .VCF descargable
  const downloadVCF = () => {
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vcard += `N:${apellido || ''};${nombre || ''};;;\r\n`;
    vcard += `FN:${(nombre + ' ' + apellido).trim()}\r\n`;
    if (empresa) vcard += `ORG:${empresa}\r\n`;
    if (puesto) vcard += `TITLE:${puesto}\r\n`;
    if (telefono) vcard += `TEL;TYPE=CELL,VOICE:${telefono}\r\n`;
    if (whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${whatsapp}\r\n`;
    if (correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${correo}\r\n`;
    if (url) vcard += `URL;TYPE=WORK:${url}\r\n`;
    if (inUrl) vcard += `URL;TYPE=LinkedIn:${inUrl}\r\n`;
    if (igUrl) vcard += `URL;TYPE=Instagram:${igUrl}\r\n`;
    if (fbUrl) vcard += `URL;TYPE=Facebook:${fbUrl}\r\n`;
    if (calle || ciudad || estado || cp || pais) {
      vcard += `ADR;TYPE=WORK:;;${calle || ''};${ciudad || ''};${estado || ''};${cp || ''};${pais || ''}\r\n`;
    }
    if (effectiveMapsUrl) vcard += `NOTE:Google Maps: ${effectiveMapsUrl}\\n${nota || ''}\r\n`;
    else if (nota) vcard += `NOTE:${nota}\r\n`;
    vcard += `END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${nombre || 'contacto'}_${apellido || 'vcard'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  // Configuración de Colores de Fondo según el Tema
  const isModern = theme === 'modern';
  const isClassic = theme === 'classic';
  const isMinimal = theme === 'minimal';

  const bgColor = isModern ? '#090912' : isClassic ? '#ffffff' : '#fafafa';
  const textColor = isModern ? '#f8fafc' : '#0f172a';

  return (
    <div
      className="min-h-screen flex justify-center items-center p-0 sm:p-4 transition-colors"
      style={{ backgroundColor: isModern ? '#04040A' : '#f1f5f9' }}
    >
      <div
        className="w-full max-w-md min-h-screen sm:min-h-[720px] sm:rounded-[36px] shadow-2xl overflow-hidden relative pb-28 select-none transition-all flex flex-col"
        style={{
          backgroundColor: bgColor,
          fontFamily: font_family,
          color: textColor
        }}
      >
        {/* TEMA CLÁSICO CORPORATIVO */}
        {isClassic && (
          <div>
            <div
              className="h-36 w-full relative overflow-hidden flex items-center justify-center transition-colors"
              style={{ backgroundColor: color_secundario }}
            >
              {cover_url ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={cover_url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `center ${cover_position_y}%`,
                      transform: `scale(${cover_zoom / 100})`,
                      transformOrigin: `center ${cover_position_y}%`
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              )}
            </div>

            <div className="px-6 -mt-12">
              <div
                className="rounded-2xl shadow-xl bg-white p-2.5 border-2 border-white flex items-center justify-center overflow-hidden"
                style={{ width: `${logo_scale}px`, height: `${logo_scale}px` }}
              >
                {logo_url ? (
                  <img src={logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-xs font-bold text-gray-400 uppercase">LOGO</span>
                )}
              </div>

              <div className="mt-4">
                <h1 className="text-2xl font-bold leading-tight">{nombre} {apellido}</h1>
                <div
                  className="h-1.5 w-16 my-2.5 rounded-full"
                  style={{ backgroundColor: color_secundario, boxShadow: `0 0 10px ${color_secundario}60` }}
                ></div>
                <p className="text-base font-bold" style={{ color: color_primario }}>{puesto}</p>
                {empresa && (
                  <div
                    className="inline-block px-3 py-1 mt-2 rounded-md text-xs font-bold tracking-wider uppercase border"
                    style={{
                      backgroundColor: `${color_secundario}15`,
                      borderColor: `${color_secundario}50`,
                      color: color_secundario
                    }}
                  >
                    {empresa}
                  </div>
                )}
              </div>

              {nota && (
                <p className="text-xs mt-4 p-3 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-4" style={{ borderColor: color_cta }}>
                  "{nota}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* TEMA MODERNO CYBER DARK */}
        {isModern && (
          <div className="p-6 flex flex-col items-center text-center">
            {cover_url && (
              <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-white/10 relative">
                <img
                  src={cover_url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
              </div>
            )}

            <div
              className="rounded-full shadow-2xl bg-[#090912] p-3 flex items-center justify-center overflow-hidden my-3 border-2 transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`,
                borderColor: color_primario,
                boxShadow: `0 0 20px ${color_primario}60`
              }}
            >
              {logo_url ? (
                <img
                  src={logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  style={{ padding: '2px' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 85,28 85,72 50,90 15,72 15,28" fill="none" stroke={color_primario} strokeWidth="6" />
                    <polygon points="50,28 72,68 28,68" fill={color_primario} />
                  </svg>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight mt-2">{nombre} {apellido}</h1>
            <div
              className="h-1.5 w-16 my-2 rounded-full transition-all"
              style={{ backgroundColor: color_secundario, boxShadow: `0 0 12px ${color_secundario}80` }}
            ></div>
            <p className="text-sm font-bold mt-1" style={{ color: color_primario }}>{puesto}</p>

            {empresa && (
              <div
                className="inline-block px-3.5 py-1 mt-2 rounded-full text-xs uppercase tracking-widest font-bold border transition-all"
                style={{
                  backgroundColor: `${color_secundario}15`,
                  borderColor: `${color_secundario}60`,
                  color: color_secundario
                }}
              >
                {empresa}
              </div>
            )}

            {nota && (
              <p className="text-xs mt-4 opacity-80 leading-relaxed px-2 italic">
                "{nota}"
              </p>
            )}
          </div>
        )}

        {/* TEMA MINIMALISTA */}
        {isMinimal && (
          <div className="p-8">
            {cover_url && (
              <div className="w-full h-32 overflow-hidden mb-5 border-b border-gray-200 relative">
                <img
                  src={cover_url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
              </div>
            )}

            <div
              className="bg-gray-100 p-3 flex items-center justify-center mb-4 border border-gray-200"
              style={{ width: `${logo_scale}px`, height: `${logo_scale}px` }}
            >
              {logo_url ? (
                <img src={logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-xs font-mono text-gray-400">LOGO</span>
              )}
            </div>

            <h1 className="text-3xl font-light tracking-tight">{nombre} <span className="font-extrabold">{apellido}</span></h1>
            <div className="w-16 h-1 my-3 rounded-full" style={{ backgroundColor: color_secundario }}></div>
            <p className="text-sm font-bold tracking-wider uppercase" style={{ color: color_primario }}>{puesto}</p>
            {empresa && <p className="text-xs font-semibold mt-1 text-gray-500">{empresa}</p>}

            {nota && (
              <p className="text-xs mt-4 opacity-75 leading-relaxed italic">
                "{nota}"
              </p>
            )}
          </div>
        )}

        {/* PASTILLAS DE CONTACTO & REDES SOCIALES */}
        <div className="px-6 space-y-2.5 mt-2 flex-1">
          {telefono && (
            <a
              href={`tel:${telefono}`}
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>📞</span>
              <span className="truncate">{telefono}</span>
            </a>
          )}

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>💬</span>
              <span className="truncate">WhatsApp: {whatsapp}</span>
            </a>
          )}

          {correo && (
            <a
              href={`mailto:${correo}`}
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>✉️</span>
              <span className="truncate">{correo}</span>
            </a>
          )}

          {url && (
            <a
              href={url.startsWith('http') ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>🌐</span>
              <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
            </a>
          )}

          {fbUrl && (
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>📘</span>
              <span className="truncate font-mono">facebook.com/{facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/^@/, '')}</span>
            </a>
          )}

          {igUrl && (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>📸</span>
              <span className="truncate font-mono">instagram.com/{instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '')}</span>
            </a>
          )}

          {inUrl && (
            <a
              href={inUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>💼</span>
              <span className="truncate font-mono">linkedin.com/in/{linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/^@/, '')}</span>
            </a>
          )}

          {effectiveMapsUrl && (
            <a
              href={effectiveMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}15`, borderColor: color_secundario, color: color_secundario }}
            >
              <span>📍</span> {locationLabel}
            </a>
          )}

          {video_youtube_url && (
            <a
              href={video_youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white bg-red-600 shadow-lg transition-all hover:scale-[1.01]"
            >
              <span>▶</span> Ver Video de Presentación
            </a>
          )}
        </div>

        {/* BOTÓN FLOTANTE GUARDAR CONTACTO */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button
            onClick={downloadVCF}
            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-black shadow-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99]"
            style={{ backgroundColor: color_cta }}
          >
            <span>💾</span> Guardar Contacto en Mi Celular
          </button>
        </div>
      </div>
    </div>
  );
}
