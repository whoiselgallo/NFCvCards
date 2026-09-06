'use client';

import React, { useState, useEffect } from 'react';
import { getTranslation } from '../../../lib/i18n';
import brandConfig from '../../../brand.config';

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

const THEME_CONFIGS = {
  classic: {
    bgOuter: '#f1f5f9',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    subTextColor: '#475569'
  },
  modern: {
    bgOuter: '#04040A',
    bgColor: '#090912',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8'
  },
  minimal: {
    bgOuter: '#f1f5f9',
    bgColor: '#fafafa',
    textColor: '#0f172a',
    subTextColor: '#475569'
  },
  glassmorphism: {
    bgOuter: '#040711',
    bgColor: '#0b0f19',
    textColor: '#f1f5f9',
    subTextColor: '#94a3b8'
  },
  monolith: {
    bgOuter: '#000000',
    bgColor: '#0d0d0d',
    textColor: '#f5f5f5',
    subTextColor: '#a3a3a3'
  },
  neobrutalism: {
    bgOuter: '#e5e2da',
    bgColor: '#fffdfa',
    textColor: '#000000',
    subTextColor: '#262626'
  },
  split_hero: {
    bgOuter: '#05070c',
    bgColor: '#0a0e17',
    textColor: '#ffffff',
    subTextColor: '#94a3b8'
  },
  bento_grid: {
    bgOuter: '#08080b',
    bgColor: '#0f0f14',
    textColor: '#f8fafc',
    subTextColor: '#a1a1aa'
  },
  cyber_matrix: {
    bgOuter: '#020204',
    bgColor: '#050508',
    textColor: '#f8fafc',
    subTextColor: '#71717a'
  },
  editorial_swiss: {
    bgOuter: '#f4f4f5',
    bgColor: '#ffffff',
    textColor: '#09090b',
    subTextColor: '#71717a'
  }
};

export default function PublicProfileClient({ profile = {} }) {
  const [lang, setLang] = useState('es');

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('en')) {
        setLang('en');
      }
    }
  }, []);

  const t = (key) => getTranslation(lang, key);
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
    font_primary = '',
    font_secondary = '',
    color_primario = '#C8102E',
    color_secundario = '#00E5FF',
    color_cta = '#C8102E',
    logo_scale = 100,
    cover_position_y = 50,
    cover_zoom = 100,
    logo_img = null,
    cover_photo = null,
    logo_url = null,
    cover_url = null
  } = profile;

  // IMÁGENES ACTIVAS (Lee directamente de la base de datos Cloud SQL: logo_img y cover_photo)
  const activeLogo = logo_img || logo_url || profile.logo_img || profile.logo_url || null;
  const activeCover = cover_photo || cover_url || profile.cover_photo || profile.cover_url || null;

  const currentFontPrimary = font_primary || font_family || 'Inter';
  const currentFontSecondary = font_secondary || font_family || 'Inter';

  // Inyección de Google Fonts dinámicamente
  useEffect(() => {
    const uniqueFonts = Array.from(new Set([currentFontPrimary, currentFontSecondary]));
    const linkId = 'gfonts-public-profile';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const fontParams = uniqueFonts
      .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
      .join('&');
    link.href = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
  }, [currentFontPrimary, currentFontSecondary]);

  // Generador Inteligente de Google Maps
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

  const fbUrl = getSocialUrl('facebook', facebook);
  const igUrl = getSocialUrl('instagram', instagram);
  const inUrl = getSocialUrl('linkedin', linkedin);

  // Generador .VCF
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

  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.modern;

  return (
    <div
      className="min-h-screen flex justify-center items-center p-0 sm:p-4 transition-colors"
      style={{ backgroundColor: themeConfig.bgOuter }}
    >
      <div
        className="w-full max-w-md min-h-screen sm:min-h-[720px] sm:rounded-[36px] shadow-2xl overflow-hidden relative pb-32 select-none transition-all flex flex-col"
        style={{
          backgroundColor: themeConfig.bgColor,
          fontFamily: currentFontSecondary,
          color: themeConfig.textColor
        }}
      >
        {/* 1. TEMA CLÁSICO CORPORATIVO */}
        {theme === 'classic' && (
          <div>
            <div
              className="h-36 w-full relative overflow-hidden flex items-center justify-center transition-colors"
              style={{ backgroundColor: color_secundario }}
            >
              {activeCover ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={activeCover}
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

            <div className="px-6 -mt-14 relative z-20 flex flex-col items-center text-center">
              <div
                className="flex items-center justify-center overflow-hidden transition-all bg-transparent border-0 shadow-none"
                style={{
                  width: `${logo_scale}px`,
                  height: `${logo_scale}px`
                }}
              >
                <img
                  src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="mt-4 w-full">
                <h1 className="text-2xl font-bold leading-tight text-slate-800" style={{ fontFamily: currentFontPrimary }}>
                  {nombre} {apellido}
                </h1>
                <div className="h-1.5 w-16 my-2.5 mx-auto rounded-full" style={{ backgroundColor: color_secundario }}></div>
                <p className="text-base font-bold" style={{ color: color_primario }}>{puesto}</p>
                {empresa && (
                  <div
                    className="inline-block px-3 py-1 mt-2 rounded-full text-xs font-bold tracking-wider uppercase border"
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
                <p className="text-xs mt-4 p-3 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-4 w-full text-slate-700" style={{ borderColor: color_cta }}>
                  "{nota}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. TEMA MODERNO CYBER DARK */}
        {theme === 'modern' && (
          <div className="p-6 flex flex-col items-center text-center">
            {activeCover && (
              <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-white/10 relative">
                <img
                  src={activeCover}
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
              className="flex items-center justify-center overflow-hidden my-3 bg-transparent border-0 shadow-none transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`
              }}
            >
              <img
                src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mt-2 text-white" style={{ fontFamily: currentFontPrimary }}>
              {nombre} {apellido}
            </h1>
            <div className="h-1.5 w-16 my-2 mx-auto rounded-full" style={{ backgroundColor: color_secundario }}></div>
            <p className="text-sm font-bold mt-1" style={{ color: color_primario }}>{puesto}</p>

            {empresa && (
              <div
                className="inline-block px-3.5 py-1 mt-2 rounded-full text-xs uppercase tracking-widest font-bold border"
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
              <p className="text-xs mt-4 opacity-80 leading-relaxed px-2 italic text-gray-300">
                "{nota}"
              </p>
            )}
          </div>
        )}

        {/* 3. TEMA MINIMALISTA EJECUTIVO */}
        {theme === 'minimal' && (
          <div className="p-8 flex flex-col items-center text-center">
            {activeCover && (
              <div className="w-full h-32 overflow-hidden mb-5 border-b border-gray-200 relative rounded-lg">
                <img
                  src={activeCover}
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
              className="flex items-center justify-center my-3 bg-transparent border-0 shadow-none transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`
              }}
            >
              <img
                src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-3xl font-light tracking-tight text-slate-900" style={{ fontFamily: currentFontPrimary }}>
              {nombre} <span className="font-extrabold">{apellido}</span>
            </h1>
            <div className="w-16 h-1 my-3 mx-auto rounded-full" style={{ backgroundColor: color_secundario }}></div>
            <p className="text-sm font-bold tracking-wider uppercase" style={{ color: color_primario }}>{puesto}</p>
            {empresa && <p className="text-xs font-semibold mt-1 text-gray-500">{empresa}</p>}

            {nota && (
              <p className="text-xs mt-4 opacity-75 leading-relaxed italic max-w-[90%] text-slate-700">
                "{nota}"
              </p>
            )}
          </div>
        )}

        {/* 4. TEMA GLASSMORPHISM FROST */}
        {theme === 'glassmorphism' && (
          <div className="p-6 flex flex-col items-center relative">
            <div className="absolute top-6 -left-10 w-44 h-44 rounded-full bg-[#C8102E]/25 blur-3xl pointer-events-none"></div>
            <div className="absolute top-24 -right-10 w-44 h-44 rounded-full bg-[#00E5FF]/20 blur-3xl pointer-events-none"></div>

            {activeCover && (
              <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-white/20 relative shadow-lg">
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <div className="w-full backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col items-center text-center">
              <div
                className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
                style={{
                  width: `${logo_scale}px`,
                  height: `${logo_scale}px`
                }}
              >
                <img
                  src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                  alt="Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight mt-2 text-white" style={{ fontFamily: currentFontPrimary }}>
                {nombre} {apellido}
              </h1>

              <div
                className="h-1 w-16 my-2.5 rounded-full backdrop-blur-md"
                style={{ backgroundColor: color_secundario, boxShadow: `0 0 10px ${color_secundario}` }}
              ></div>

              <p className="text-sm font-semibold tracking-wide" style={{ color: color_primario }}>{puesto}</p>

              {empresa && (
                <div className="inline-block px-3 py-1 mt-2 rounded-full text-[11px] uppercase font-mono tracking-widest backdrop-blur-md bg-white/10 border border-white/20 text-gray-200">
                  ✨ {empresa}
                </div>
              )}

              {nota && (
                <p className="text-xs mt-3 text-gray-300 italic leading-relaxed backdrop-blur-sm bg-black/20 p-3 rounded-2xl border border-white/10 w-full">
                  "{nota}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* 5. TEMA MONOLITO LUXURY VIP */}
        {theme === 'monolith' && (
          <div className="p-6 flex flex-col items-center text-center bg-[#0d0d0d] relative">
            <div
              className="w-full h-1 rounded-full mb-4 shadow-[0_0_15px_rgba(200,16,46,0.5)]"
              style={{ background: `linear-gradient(90deg, transparent, ${color_primario}, ${color_secundario}, transparent)` }}
            ></div>

            {activeCover && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-white/10 relative shadow-2xl">
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all filter contrast-110"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30"></div>
              </div>
            )}

            <div
              className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`
              }}
            >
              <img
                src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center gap-2 justify-center text-[10px] uppercase font-mono tracking-widest text-amber-300/80 mb-1">
              <span>◆</span>
              <span>VIP EXECUTIVE</span>
              <span>◆</span>
            </div>

            <h1 className="text-2xl font-extrabold uppercase tracking-wider text-white" style={{ fontFamily: currentFontPrimary }}>
              {nombre} {apellido}
            </h1>

            <p className="text-xs font-mono uppercase tracking-widest mt-1 font-bold" style={{ color: color_primario }}>
              {puesto}
            </p>

            {empresa && (
              <div
                className="inline-block px-4 py-1 mt-2.5 rounded-lg text-xs font-mono uppercase tracking-widest font-bold border"
                style={{
                  borderColor: `${color_secundario}60`,
                  backgroundColor: `${color_secundario}10`,
                  color: color_secundario
                }}
              >
                {empresa}
              </div>
            )}

            {nota && (
              <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs italic text-gray-300 leading-relaxed w-full">
                "{nota}"
              </div>
            )}
          </div>
        )}

        {/* 6. TEMA NEO-BRUTALISM POP */}
        {theme === 'neobrutalism' && (
          <div className="p-6 flex flex-col items-center text-center bg-[#fffdfa] text-black">
            {activeCover && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border-3 border-black shadow-[4px_4px_0px_#000000] relative bg-white">
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
              </div>
            )}

            <div
              className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`
              }}
            >
              <img
                src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-white border-2.5 border-black shadow-[4px_4px_0px_#000000] p-4 rounded-2xl w-full mt-1">
              <h1 className="text-2xl font-black tracking-tight text-black uppercase" style={{ fontFamily: currentFontPrimary }}>
                {nombre} {apellido}
              </h1>

              <div className="h-1 w-full bg-black my-2.5"></div>

              <p className="text-xs font-extrabold uppercase font-mono" style={{ color: color_primario }}>
                {puesto}
              </p>

              {empresa && (
                <div
                  className="inline-block px-3 py-1 mt-2 rounded-md text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000]"
                  style={{ backgroundColor: color_secundario, color: '#000000' }}
                >
                  {empresa}
                </div>
              )}
            </div>

            {nota && (
              <div className="mt-4 p-3 rounded-xl bg-yellow-200/90 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-bold italic text-black leading-relaxed w-full">
                "{nota}"
              </div>
            )}
          </div>
        )}

        {/* 7. TEMA HERO ASIMÉTRICO */}
        {theme === 'split_hero' && (
          <div className="p-6 flex flex-col bg-[#0a0e17] text-white">
            {activeCover ? (
              <div
                className="w-full h-36 overflow-hidden rounded-2xl mb-4 relative border border-white/10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 100%)' }}
              >
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
              </div>
            ) : (
              <div
                className="w-full h-16 rounded-2xl mb-3"
                style={{
                  background: `linear-gradient(135deg, ${color_primario}, ${color_secundario})`,
                  clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)'
                }}
              ></div>
            )}

            <div className="flex items-start justify-between gap-3 mt-1">
              <div className="flex-1 text-left">
                <h1 className="text-2xl font-extrabold leading-tight text-white tracking-tight" style={{ fontFamily: currentFontPrimary }}>
                  {nombre} <span className="block text-gray-300">{apellido}</span>
                </h1>
                <p className="text-sm font-bold mt-1" style={{ color: color_primario }}>
                  {puesto}
                </p>
                {empresa && (
                  <div
                    className="inline-block px-3 py-0.5 mt-2 rounded-md text-[11px] font-mono uppercase font-bold border"
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

              <div
                className="flex items-center justify-center overflow-hidden shrink-0 bg-transparent border-0 shadow-none transition-all"
                style={{
                  width: `${Math.min(logo_scale, 100)}px`,
                  height: `${Math.min(logo_scale, 100)}px`
                }}
              >
                <img
                  src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {nota && (
              <div
                className="mt-4 p-3 rounded-xl bg-white/[0.04] border-l-3 text-xs italic text-gray-300 leading-relaxed text-left"
                style={{ borderColor: color_cta }}
              >
                "{nota}"
              </div>
            )}
          </div>
        )}

        {/* 8. TEMA BENTO GRID TECH */}
        {theme === 'bento_grid' && (
          <div className="p-5 flex flex-col gap-3.5 bg-[#0f0f14] text-white">
            <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
              {activeCover && (
                <div className="w-full h-28 rounded-2xl overflow-hidden mb-3.5 relative border border-white/10">
                  <img
                    src={activeCover}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `center ${cover_position_y}%`,
                      transform: `scale(${cover_zoom / 100})`,
                      transformOrigin: `center ${cover_position_y}%`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14]/80 to-transparent"></div>
                </div>
              )}

              <div
                className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
                style={{
                  width: `${logo_scale}px`,
                  height: `${logo_scale}px`
                }}
              >
                <img
                  src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: currentFontPrimary }}>
                {nombre} {apellido}
              </h1>

              <p className="text-sm font-semibold mt-0.5" style={{ color: color_primario }}>{puesto}</p>

              {empresa && (
                <span
                  className="inline-block px-3.5 py-1 mt-2.5 rounded-full text-xs font-mono uppercase font-bold border"
                  style={{
                    backgroundColor: `${color_secundario}15`,
                    borderColor: `${color_secundario}40`,
                    color: color_secundario
                  }}
                >
                  {empresa}
                </span>
              )}
            </div>

            {nota && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-xs italic text-gray-300 text-center leading-relaxed">
                "{nota}"
              </div>
            )}
          </div>
        )}

        {/* 9. TEMA CYBER NEON MATRIX */}
        {theme === 'cyber_matrix' && (
          <div className="p-6 flex flex-col items-center text-center bg-[#050508] text-white relative font-mono">
            <div className="w-full flex justify-between text-[11px] text-cyan-400/80 mb-3 border-b border-cyan-500/20 pb-1.5 font-mono">
              <span>[SYS_PROFILE]</span>
              <span className="text-emerald-400">● LIVE HUD</span>
            </div>

            {activeCover && (
              <div className="w-full h-32 rounded-lg overflow-hidden mb-4 border border-cyan-500/30 relative shadow-[0_0_15px_rgba(0,255,255,0.15)]">
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent opacity-80"></div>
              </div>
            )}

            <div className="relative my-2">
              <div
                className="flex items-center justify-center overflow-hidden bg-transparent border-0 shadow-none transition-all"
                style={{
                  width: `${logo_scale}px`,
                  height: `${logo_scale}px`
                }}
              >
                <img
                  src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                  alt="Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(200,16,46,0.6)]"
                />
              </div>
              <span className="absolute -top-1 -left-1 text-[10px] text-cyan-400">+</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] text-cyan-400">+</span>
            </div>

            <h1 className="text-2xl font-bold tracking-widest text-cyan-100 uppercase mt-2" style={{ fontFamily: currentFontPrimary }}>
              {nombre} {apellido}
            </h1>

            <div className="flex items-center gap-1.5 my-2">
              <span className="w-2 h-2 rounded-full bg-[#EE334E] animate-ping"></span>
              <p className="text-xs uppercase tracking-wider font-bold" style={{ color: color_primario }}>
                // {puesto}
              </p>
            </div>

            {empresa && (
              <div className="px-3 py-1 mt-1 rounded text-xs uppercase tracking-widest font-bold border border-cyan-500/40 bg-cyan-950/30 text-cyan-300">
                ID: {empresa}
              </div>
            )}

            {nota && (
              <div className="mt-4 p-3 rounded bg-black/80 border-l-2 border-r-2 border-cyan-500/40 text-xs text-cyan-200/80 leading-relaxed text-left w-full">
                &gt; {nota}
              </div>
            )}
          </div>
        )}

        {/* 10. TEMA SUIZO EDITORIAL CLEAN */}
        {theme === 'editorial_swiss' && (
          <div className="p-7 flex flex-col items-center text-center bg-white text-zinc-900">
            {activeCover && (
              <div className="w-full h-32 overflow-hidden mb-4 border-b border-zinc-200 relative">
                <img
                  src={activeCover}
                  alt="Cover"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                  style={{
                    objectPosition: `center ${cover_position_y}%`,
                    transform: `scale(${cover_zoom / 100})`,
                    transformOrigin: `center ${cover_position_y}%`
                  }}
                />
              </div>
            )}

            <div
              className="flex items-center justify-center my-3 bg-transparent border-0 shadow-none transition-all"
              style={{
                width: `${logo_scale}px`,
                height: `${logo_scale}px`
              }}
            >
              <img
                src={activeLogo || brandConfig.assets?.logo || '/brand/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain filter contrast-125"
              />
            </div>

            <div className="w-full border-t border-b border-zinc-900/20 py-3 my-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase text-zinc-900" style={{ fontFamily: currentFontPrimary }}>
                {nombre} {apellido}
              </h1>
              <p className="text-xs uppercase tracking-widest font-bold mt-1" style={{ color: color_primario }}>
                {puesto}
              </p>
            </div>

            {empresa && (
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold mt-1">
                — {empresa} —
              </p>
            )}

            {nota && (
              <p className="text-xs mt-4 text-zinc-600 font-serif italic border-l-2 border-zinc-900 pl-3 text-left w-full leading-relaxed">
                "{nota}"
              </p>
            )}
          </div>
        )}

        {/* BOTONES DE CONTACTO DINÁMICOS POR TEMA */}
        <div className="px-6 space-y-2.5 mt-2 flex-1">
          {telefono && (
            <a
              href={`tel:${telefono}`}
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
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
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
            >
              <span className="text-lg" style={{ color: color_secundario }}>💬</span>
              <span className="truncate">WhatsApp: {whatsapp}</span>
            </a>
          )}

          {correo && (
            <a
              href={`mailto:${correo}`}
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
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
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
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
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
            >
              <span className="text-lg" style={{ color: color_secundario }}>📘</span>
              <span className="truncate font-mono">facebook.com/{facebook.replace(/^@+/, '')}</span>
            </a>
          )}

          {igUrl && (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
            >
              <span className="text-lg" style={{ color: color_secundario }}>📸</span>
              <span className="truncate font-mono">instagram.com/{instagram.replace(/^@+/, '')}</span>
            </a>
          )}

          {inUrl && (
            <a
              href={inUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium border transition-all hover:scale-[1.01] ${
                theme === 'neobrutalism'
                  ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] font-bold'
                  : theme === 'glassmorphism'
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 text-white shadow-sm hover:bg-white/10'
                  : theme === 'cyber_matrix'
                  ? 'border border-cyan-500/30 bg-black/60 text-cyan-200 font-mono shadow-[0_0_10px_rgba(0,255,255,0.05)]'
                  : theme === 'monolith'
                  ? 'border border-white/10 bg-black/50 text-white hover:border-white/20'
                  : theme === 'editorial_swiss'
                  ? 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400 font-medium'
                  : ''
              }`}
              style={
                theme !== 'neobrutalism' && theme !== 'glassmorphism' && theme !== 'cyber_matrix' && theme !== 'monolith' && theme !== 'editorial_swiss'
                  ? { backgroundColor: `${color_secundario}08`, borderColor: `${color_secundario}30` }
                  : {}
              }
            >
              <span className="text-lg" style={{ color: color_secundario }}>💼</span>
              <span className="truncate font-mono">linkedin.com/in/{linkedin.replace(/^@+/, '')}</span>
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

        {/* BADGE DE CONVERSIÓN VIRAL TSOLUTIONS IPIDD (MARKETING 2.0) & SELECTOR DE IDIOMA */}
        <div className="px-6 pt-6 pb-2 text-center flex flex-col items-center gap-3">
          <a
            href="https://tsolutionsipidd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono text-gray-400 hover:text-white bg-black/40 hover:bg-black/80 border border-white/10 hover:border-[#C8102E]/50 transition-all group"
          >
            <span className="text-[#C8102E] group-hover:scale-110 transition-transform">⚡</span>
            <span>{t('card_powered')}</span>
            <span className="text-gray-500 group-hover:text-[#C8102E]">↗</span>
          </a>

          {/* Selector de Idioma en Tarjeta Pública */}
          <button
            type="button"
            onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
            className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center gap-1"
          >
            <span>🌐</span>
            <span>{lang === 'es' ? 'English 🇺🇸' : 'Español 🇲🇽'}</span>
          </button>
        </div>

        {/* BOTÓN FLOTANTE */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button
            onClick={downloadVCF}
            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white shadow-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99] ${
              theme === 'neobrutalism'
                ? 'border-2.5 border-black shadow-[4px_4px_0px_#000] font-black'
                : theme === 'glassmorphism'
                ? 'backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : theme === 'cyber_matrix'
                ? 'border border-cyan-400 font-mono shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                : theme === 'monolith'
                ? 'border border-white/20 shadow-2xl font-bold'
                : ''
            }`}
            style={{
              backgroundColor: color_cta,
              fontFamily: currentFontPrimary
            }}
          >
            <span>💾</span> {lang === 'es' ? 'Guardar Contacto en Mi Celular' : 'Save Contact to My Phone'}
          </button>
        </div>
      </div>
    </div>
  );
}
