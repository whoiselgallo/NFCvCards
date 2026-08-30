'use client';

import React, { useEffect } from 'react';

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
    logo_img = null,
    cover_photo = null
  } = profile;

  // Cargar Google Font dinámica
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
    if (linkedin) vcard += `URL;TYPE=LinkedIn:${linkedin}\r\n`;
    if (instagram) vcard += `URL;TYPE=Instagram:${instagram}\r\n`;
    if (facebook) vcard += `URL;TYPE=Facebook:${facebook}\r\n`;
    if (calle || ciudad || estado || cp || pais) {
      vcard += `ADR;TYPE=WORK:;;${calle || ''};${ciudad || ''};${estado || ''};${cp || ''};${pais || ''}\r\n`;
    }
    if (google_maps_url) vcard += `NOTE:Google Maps: ${google_maps_url}\\n${nota || ''}\r\n`;
    else if (nota) vcard += `NOTE:${nota}\r\n`;

    if (logo_img) {
      const b64 = logo_img.split(',')[1];
      if (b64) vcard += `PHOTO;ENCODING=b;TYPE=JPEG:${b64}\r\n`;
    }

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

  const isDark = theme === 'modern';
  const bgColor = isDark ? '#090912' : theme === 'minimal' ? '#FAFAFA' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#1E293B';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6"
      style={{
        backgroundColor: '#04040A',
        fontFamily: font_family
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all relative pb-24"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
        }}
      >
        {/* CABECERA / PORTADA */}
        {theme === 'classic' && (
          <div>
            <div className="h-32 w-full relative overflow-hidden" style={{ backgroundColor: color_secundario }}>
              {cover_photo && (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={cover_photo}
                    alt="Cover"
                    className="w-full h-full object-cover transition-all"
                    style={{
                      objectPosition: `center ${cover_position_y || 50}%`,
                      transform: `scale(${(cover_zoom || 100) / 100})`,
                      transformOrigin: `center ${cover_position_y || 50}%`
                    }}
                  />
                </div>
              )}
            </div>
            <div className="px-6 -mt-12">
              <div
                className="rounded-2xl shadow-xl bg-white p-1 border-2 border-white flex items-center justify-center overflow-hidden"
                style={{ width: `${logo_scale}px`, height: `${logo_scale}px` }}
              >
                {logo_img ? (
                  <img src={logo_img} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs font-bold text-gray-400">LOGO</span>
                )}
              </div>

              <div className="mt-4">
                <h1 className="text-2xl font-bold">{nombre} {apellido}</h1>
                <div className="h-1.5 w-14 my-2.5 rounded-full" style={{ backgroundColor: color_secundario }}></div>
                <p className="text-base font-bold" style={{ color: color_primario }}>{puesto}</p>
                {empresa && (
                  <div className="inline-block px-2.5 py-0.5 mt-1.5 rounded-md text-xs font-bold tracking-wider uppercase border" style={{ backgroundColor: `${color_secundario}15`, borderColor: `${color_secundario}50`, color: color_secundario }}>
                    {empresa}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {theme === 'modern' && (
          <div className="p-6 flex flex-col items-center text-center">
            {cover_photo && (
              <div className="w-full h-28 rounded-2xl overflow-hidden mb-4 border border-white/10 relative">
                <img
                  src={cover_photo}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y || 50}%`,
                    transform: `scale(${(cover_zoom || 100) / 100})`,
                    transformOrigin: `center ${cover_position_y || 50}%`
                  }}
                />
              </div>
            )}

            <div
              className="rounded-full shadow-2xl bg-[#090912] p-3 flex items-center justify-center overflow-hidden my-2 border-2 transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`,
                borderColor: color_primario,
                boxShadow: `0 0 20px ${color_primario}60`
              }}
            >
              {logo_img ? (
                <img src={logo_img} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <span className="text-xs font-mono text-gray-400">LOGO</span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight mt-3">{nombre} {apellido}</h1>
            <div className="h-1.5 w-14 my-2.5 rounded-full" style={{ backgroundColor: color_secundario, boxShadow: `0 0 10px ${color_secundario}80` }}></div>
            <p className="text-base font-bold" style={{ color: color_primario }}>{puesto}</p>
            {empresa && (
              <div className="inline-block px-3 py-1 mt-1.5 rounded-full text-xs uppercase tracking-widest font-bold border" style={{ backgroundColor: `${color_secundario}15`, borderColor: `${color_secundario}60`, color: color_secundario }}>
                {empresa}
              </div>
            )}
          </div>
        )}

        {theme === 'minimal' && (
          <div className="p-8">
            {cover_photo && (
              <div className="w-full h-32 overflow-hidden mb-6 border-b border-gray-200 relative">
                <img
                  src={cover_photo}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y || 50}%`,
                    transform: `scale(${(cover_zoom || 100) / 100})`,
                    transformOrigin: `center ${cover_position_y || 50}%`
                  }}
                />
              </div>
            )}

            <div
              className="bg-gray-100 p-2 flex items-center justify-center mb-4 border border-gray-200"
              style={{ width: `${logo_scale}px`, height: `${logo_scale}px` }}
            >
              {logo_img ? (
                <img src={logo_img} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs font-mono text-gray-400">LOGO</span>
              )}
            </div>

            <h1 className="text-3xl font-light tracking-tight">{nombre} <span className="font-extrabold">{apellido}</span></h1>
            <div className="w-12 h-1 my-3 rounded-full" style={{ backgroundColor: color_secundario }}></div>
            <p className="text-sm font-bold tracking-wider uppercase" style={{ color: color_primario }}>{puesto}</p>
            {empresa && <p className="text-xs font-semibold mt-1" style={{ color: color_secundario }}>{empresa}</p>}
          </div>
        )}

        {/* BIO / NOTA */}
        {nota && (
          <div className="px-6 py-2">
            <p className="text-xs md:text-sm italic opacity-80 leading-relaxed p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              "{nota}"
            </p>
          </div>
        )}

        {/* PASTILLAS DE CONTACTO & REDES */}
        <div className="px-6 space-y-2.5 mt-4">
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

          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>📘</span>
              <span className="truncate">Facebook</span>
            </a>
          )}

          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>📸</span>
              <span className="truncate">Instagram</span>
            </a>
          )}

          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }}
            >
              <span className="text-lg" style={{ color: color_secundario }}>💼</span>
              <span className="truncate">LinkedIn</span>
            </a>
          )}

          {google_maps_url && (
            <a
              href={google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${color_secundario}15`, borderColor: color_secundario, color: color_secundario }}
            >
              <span>📍</span> Ver Ubicación en Google Maps
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
