'use client';

import React, { useState, useEffect } from 'react';
import { getTranslation } from '../../../lib/i18n';
import brandConfig from '../../../brand.config';
import { THEMES } from '../../../lib/themes';

// Helper para sanitizar y autocomponer URLs de Redes Sociales
export function getSocialUrl(type, value) {
  if (!value || !value.trim()) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(facebook|instagram|linkedin|tiktok|twitter|x)\.com\/(in\/)?/, '');
  if (type === 'facebook') return `https://facebook.com/${clean}`;
  if (type === 'instagram') return `https://instagram.com/${clean}`;
  if (type === 'linkedin') return `https://linkedin.com/in/${clean}`;
  if (type === 'tiktok') return `https://tiktok.com/@${clean}`;
  if (type === 'x' || type === 'twitter') return `https://x.com/${clean}`;
  if (type === 'telegram') return `https://t.me/${clean}`;
  if (type === 'youtube') return `https://youtube.com/@${clean}`;
  return trimmed;
}

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
    slug = '',
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
    color_primario = '#E11D48',
    color_secundario = '#00F0FF',
    color_cta = '#E11D48',
    logo_scale = 100,
    cover_position_y = 50,
    cover_zoom = 100,
    logo_img = null,
    cover_photo = null,
    logo_url = null,
    cover_url = null,
    plan_tier = 'free',
    custom_fields = [],
    custom_layout = {},
    portfolio = [],
    google_calendar_url = '',
    gallery = [],
    marketing_carousel = [],
    customer_reviews = []
  } = profile;

  // Estado para modal de fototeca
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Tema activo y estilos
  const activeThemeConfig = THEMES[theme] || THEMES.modern;
  const activeLogo = logo_img || logo_url || null;
  const activeCover = cover_photo || cover_url || null;

  const currentFontPrimary = font_primary || font_family || 'Inter';
  const currentFontSecondary = font_secondary || font_family || 'Inter';

  // Configuración de Layout Visual
  const layout = typeof custom_layout === 'object' && custom_layout !== null ? custom_layout : {};
  const logoPosition = layout.logoPosition || 'center'; // 'center', 'left', 'floating', 'compact'
  const infoBoxStyle = layout.infoBoxStyle || 'floating'; // 'floating', 'flat', 'glass', 'minimal'

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

  // Registro de analítica de interacción
  const trackEvent = (eventType) => {
    if (!slug) return;
    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const deviceType = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, eventType, deviceType })
      }).catch(() => {});
    } catch (e) {}
  };

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

  const locationLabel = [ciudad, pais].filter(Boolean).join(', ') || (empresa ? `Buscar ${empresa}` : 'Ver Ubicación en Maps');

  // Descarga de Archivo vCard (.VCF)
  const downloadVCF = () => {
    trackEvent('vcf_download');
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vcard += `N:${apellido || ''};${nombre || ''};;;\r\n`;
    vcard += `FN:${(nombre + ' ' + apellido).trim()}\r\n`;
    if (empresa) vcard += `ORG:${empresa}\r\n`;
    if (puesto) vcard += `TITLE:${puesto}\r\n`;
    if (telefono) vcard += `TEL;TYPE=CELL,VOICE:${telefono}\r\n`;
    if (whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${whatsapp}\r\n`;
    if (correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${correo}\r\n`;
    if (url) vcard += `URL;TYPE=WORK:${url}\r\n`;
    if (calle || ciudad || estado || cp || pais) {
      vcard += `ADR;TYPE=WORK:;;${calle || ''};${ciudad || ''};${estado || ''};${cp || ''};${pais || ''}\r\n`;
    }
    if (effectiveMapsUrl) vcard += `NOTE:Google Maps: ${effectiveMapsUrl}\\n${nota || ''}\r\n`;
    else if (nota) vcard += `NOTE:${nota}\r\n`;
    vcard += `END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const linkUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = linkUrl;
    a.download = `${nombre || 'Contacto'}_${apellido || 'Digital'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(linkUrl);
  };

  const fbUrl = getSocialUrl('facebook', facebook);
  const igUrl = getSocialUrl('instagram', instagram);
  const inUrl = getSocialUrl('linkedin', linkedin);

  // Arrays auxiliares seguros
  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  const safeGallery = Array.isArray(gallery) ? gallery : [];
  const safeMarketing = Array.isArray(marketing_carousel) ? marketing_carousel : [];
  const safeReviews = Array.isArray(customer_reviews) ? customer_reviews : [];
  const safeCustomFields = Array.isArray(custom_fields) ? custom_fields : [];

  return (
    <div
      className="min-h-screen flex justify-center items-start p-2 sm:p-4 md:p-6"
      style={{
        backgroundColor: activeThemeConfig.bgColor || '#060509',
        color: activeThemeConfig.textColor || '#F8FAFC',
        fontFamily: currentFontSecondary
      }}
    >
      <div
        className="w-full max-w-[430px] rounded-3xl shadow-2xl overflow-hidden relative pb-28 border animate-fadeIn"
        style={{
          backgroundColor: activeThemeConfig.cardBg || '#0F0B15',
          borderColor: activeThemeConfig.borderColor || 'rgba(255,255,255,0.1)',
          boxShadow: `0 20px 50px rgba(0,0,0,0.6)`
        }}
      >
<<<<<<< HEAD
        {/* CABECERA / PORTADA */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/60">
          {activeCover ? (
            <img
              src={activeCover}
              alt="Portada"
              className="w-full h-full object-cover transition-all"
              style={{
                objectPosition: `center ${cover_position_y}%`,
                transform: `scale(${cover_zoom / 100})`
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${color_primario}40 0%, ${color_secundario}20 50%, #000000 100%)`
              }}
            >
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <span className="font-bruno text-4xl opacity-20 tracking-widest text-white">
                {empresa ? empresa.substring(0, 3).toUpperCase() : 'NFC'}
              </span>
            </div>
          )}

          {/* BADGE DE PLAN (SI ES ELITE / PRO) */}
          {plan_tier !== 'free' && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bruno font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg flex items-center gap-1"
              style={{
                backgroundColor: `${color_primario}30`,
                borderColor: color_primario,
                color: '#FFFFFF'
              }}
            >
              <span>⭐</span> {plan_tier === 'elite' ? 'Business Elite' : plan_tier === 'business' ? 'Business' : 'Pro'}
            </div>
          )}
        </div>

        {/* CONTENEDOR DE AVATAR / LOGOTIPO */}
        <div className={`relative px-6 ${logoPosition === 'left' ? 'text-left' : 'text-center'} -mt-14 mb-4 z-10`}>
          <div className="inline-block relative">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 shadow-2xl flex items-center justify-center overflow-hidden border-2 bg-[#0a0a10]"
              style={{
                borderColor: color_primario,
                boxShadow: `0 0 24px ${color_primario}40`
              }}
            >
              {activeLogo ? (
                <img
                  src={activeLogo}
                  alt={nombre}
                  className="w-full h-full object-contain rounded-xl"
                  style={{ transform: `scale(${logo_scale / 100})` }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-xl flex items-center justify-center font-bruno text-2xl font-bold text-white"
                  style={{ backgroundColor: color_primario }}
                >
                  {nombre ? nombre.charAt(0).toUpperCase() : '★'}
                </div>
              )}
=======
        {/* TEMA CLÁSICO */}
        {isClassic && (
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
                <p className="text-xs mt-4 p-3 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-4 w-full" style={{ borderColor: color_cta }}>
                  "{nota}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* TEMA MODERNO CYBER DARK */}
        {isModern && (
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
>>>>>>> 575e9a4de75df8502c40977aff20c0870c00833d
            </div>
          </div>

          {/* NOMBRE Y PUESTO */}
          <div className="mt-3">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: currentFontPrimary }}
            >
              {nombre} {apellido}
            </h1>
            
            {puesto && (
              <p
                className="text-sm font-semibold tracking-wide mt-1 uppercase"
                style={{ color: color_primario }}
              >
                {puesto}
              </p>
            )}

            {empresa && (
              <p className="text-xs font-mono tracking-wider opacity-80 mt-0.5">
                {empresa}
              </p>
            )}
          </div>
        </div>

        {/* CONTENIDO Y SECCIONES */}
        <div className="px-5 sm:px-6 space-y-4">

          {/* BIO / NOTA */}
          {nota && (
            <div
<<<<<<< HEAD
              className="p-3.5 rounded-2xl text-xs leading-relaxed border backdrop-blur-md"
              style={{
                backgroundColor: `${color_secundario}08`,
                borderColor: `${color_secundario}25`,
                color: activeThemeConfig.textColor
              }}
            >
              <p>{nota}</p>
            </div>
          )}

          {/* ACCIÓN PRINCIPAL RÁPIDA: AGENDAR CITA EN GOOGLE CALENDAR / CALENDLY */}
          {google_calendar_url && (
            <a
              href={google_calendar_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('calendar_click')}
              className="w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bruno font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] border"
              style={{
                background: `linear-gradient(135deg, ${color_primario} 0%, #000000 120%)`,
                borderColor: color_primario
              }}
            >
              <span className="text-base">📅</span> Agendar Cita en Google Calendar
            </a>
          )}

          {/* CARRUSEL DE MARKETING / PROMOCIONES (MÓDULO ELITE) */}
          {safeMarketing.length > 0 && (
            <div className="rounded-2xl p-4 border bg-black/40 space-y-2.5" style={{ borderColor: `${color_primario}30` }}>
              <div className="flex justify-between items-center text-[11px] font-bruno uppercase tracking-wider" style={{ color: color_primario }}>
                <span className="flex items-center gap-1.5"><span>📢</span> Promociones & Novedades</span>
                <span className="text-[10px] opacity-60">{activeCarouselIndex + 1}/{safeMarketing.length}</span>
              </div>
              
              <div className="relative overflow-hidden rounded-xl bg-[#141420] p-3 text-xs">
                {safeMarketing[activeCarouselIndex]?.image && (
                  <img src={safeMarketing[activeCarouselIndex].image} alt="Promo" className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <h4 className="font-bold text-white text-sm">{safeMarketing[activeCarouselIndex]?.title || 'Promoción Especial'}</h4>
                <p className="text-gray-300 text-xs mt-1 leading-snug">{safeMarketing[activeCarouselIndex]?.description}</p>
                {safeMarketing[activeCarouselIndex]?.link && (
                  <a
                    href={safeMarketing[activeCarouselIndex].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('marketing_click')}
                    className="mt-2.5 inline-block px-3 py-1.5 rounded-lg text-[11px] font-bold text-white uppercase"
                    style={{ backgroundColor: color_primario }}
                  >
                    Ver Oferta →
                  </a>
                )}
              </div>

              {safeMarketing.length > 1 && (
                <div className="flex justify-center gap-1.5 pt-1">
                  {safeMarketing.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCarouselIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${idx === activeCarouselIndex ? 'w-5 bg-[#E11D48]' : 'w-1.5 bg-gray-600'}`}
                    />
                  ))}
                </div>
              )}
=======
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
>>>>>>> 575e9a4de75df8502c40977aff20c0870c00833d
            </div>
          )}

          {/* CANALES DE CONTACTO DIRECTO */}
          <div className="space-y-2.5">
            {telefono && (
              <a
                href={`tel:${telefono.replace(/\s+/g, '')}`}
                onClick={() => trackEvent('call_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base" style={{ color: color_primario }}>📞</span>
                <span className="truncate font-mono">Llamar: {telefono}</span>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base" style={{ color: '#25D366' }}>💬</span>
                <span className="truncate">WhatsApp: {whatsapp}</span>
              </a>
            )}

            {correo && (
              <a
                href={`mailto:${correo}`}
                onClick={() => trackEvent('email_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base" style={{ color: color_primario }}>✉️</span>
                <span className="truncate">{correo}</span>
              </a>
            )}

            {url && (
              <a
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('website_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base" style={{ color: color_secundario }}>🌐</span>
                <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
              </a>
            )}

            {fbUrl && (
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base text-blue-500">📘</span>
                <span className="truncate font-mono">facebook.com/{facebook.replace(/^@+/, '')}</span>
              </a>
            )}

            {igUrl && (
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base text-pink-500">📸</span>
                <span className="truncate font-mono">instagram.com/{instagram.replace(/^@+/, '')}</span>
              </a>
            )}

            {inUrl && (
              <a
                href={inUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_secundario}0A`, borderColor: `${color_secundario}30` }}
              >
                <span className="text-base text-sky-400">💼</span>
                <span className="truncate font-mono">linkedin.com/in/{linkedin.replace(/^@+/, '')}</span>
              </a>
            )}

            {/* CAMPOS DINÁMICOS PERSONALIZADOS (AGREGADOS EN EL PORTAL ELITE) */}
            {safeCustomFields.map((field, idx) => (
              <a
                key={idx}
                href={field.value.startsWith('http') ? field.value : `https://${field.value}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('custom_click')}
                className="flex items-center gap-3.5 p-3 rounded-xl text-xs font-medium border transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${color_primario}12`, borderColor: `${color_primario}40` }}
              >
                <span className="text-base">{field.icon || '🔗'}</span>
                <span className="truncate font-semibold">{field.label}: <span className="opacity-80 font-normal">{field.value}</span></span>
              </a>
            ))}

            {effectiveMapsUrl && (
              <a
                href={effectiveMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('maps_click')}
                className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border transition-all hover:scale-[1.01]"
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
                onClick={() => trackEvent('video_click')}
                className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 shadow-lg transition-all hover:scale-[1.01]"
              >
                <span>▶</span> Ver Video de Presentación
              </a>
            )}
          </div>

          {/* PORTAFOLIO DE TRABAJOS (MÓDULO ELITE) */}
          {safePortfolio.length > 0 && (
            <div className="pt-2 space-y-2.5">
              <h3 className="text-xs font-bruno uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <span>💼</span> Portafolio & Proyectos
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {safePortfolio.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-gray-800 flex gap-3 items-center">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#FF2A54] hover:underline mt-1 inline-block">
                          Ver Proyecto →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOTOTECA / GALERÍA (MÓDULO ELITE) */}
          {safeGallery.length > 0 && (
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bruno uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <span>📸</span> Fototeca & Instalaciones
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {safeGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryImg(imgUrl)}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-800 hover:border-[#E11D48] transition-all hover:scale-105"
                  >
                    <img src={imgUrl} alt={`Galeria ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN DE RESEÑAS DE CLIENTES (MÓDULO ELITE) */}
          {safeReviews.length > 0 && (
            <div className="pt-2 space-y-2.5">
              <h3 className="text-xs font-bruno uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <span>⭐</span> Reseñas de Clientes
              </h3>
              <div className="space-y-2">
                {safeReviews.map((rev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-gray-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{rev.name || 'Cliente'}</span>
                      <span className="text-yellow-400 text-xs">{'★'.repeat(rev.stars || 5)}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER DISCRETO WHITE-LABEL */}
          {brandConfig.footer?.enabled && (
            <div className="pt-4 text-center">
              <a
                href={brandConfig.footer.link || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
              >
                <span>🌹</span> {brandConfig.footer.text}
              </a>
            </div>
          )}

        </div>

        {/* BOTÓN FLOTANTE PARA GUARDAR CONTACTO EN LA AGENDA DEL MÓVIL */}
        <div className="fixed bottom-3 left-0 right-0 max-w-[430px] mx-auto px-4 z-30">
          <button
            onClick={downloadVCF}
            className="w-full py-4 rounded-2xl font-bruno font-bold text-xs uppercase tracking-wider text-white shadow-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99] border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${color_cta} 0%, #BE123C 100%)`,
              boxShadow: `0 8px 30px ${color_cta}60`
            }}
          >
            <span className="text-base">💾</span> Guardar Contacto en Mi Celular
          </button>
        </div>

        {/* MODAL LIGHTBOX DE FOTOTECA */}
        {selectedGalleryImg && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedGalleryImg(null)}
          >
            <div className="relative max-w-sm w-full">
              <img src={selectedGalleryImg} alt="Ampliación" className="w-full rounded-2xl shadow-2xl border border-rose-500/40" />
              <button
                type="button"
                onClick={() => setSelectedGalleryImg(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 text-white font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}

<<<<<<< HEAD
=======
        {/* BOTONES DE CONTACTO */}
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
              <span className="truncate font-mono">facebook.com/{facebook.replace(/^@+/, '')}</span>
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
              <span className="truncate font-mono">instagram.com/{instagram.replace(/^@+/, '')}</span>
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono text-[#FF6500] hover:text-white bg-black/40 hover:bg-black/60 border border-[#FF6500]/60 hover:border-[#FF6500] transition-all group"
            style={{ boxShadow: '0 0 8px #FF650044, 0 0 16px #FF650022' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px #FF6500aa, 0 0 28px #FF650055, 0 0 48px #FF650022'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 8px #FF650044, 0 0 16px #FF650022'}
          >
            <span className="text-[#FF6500] group-hover:scale-110 transition-transform drop-shadow-[0_0_6px_#FF6500]">⚡</span>
            <span>{t('card_powered')}</span>
            <span className="text-[#FF6500]/60 group-hover:text-[#FF6500]">↗</span>
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
            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-black shadow-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99]"
            style={{
              backgroundColor: color_cta,
              fontFamily: currentFontPrimary
            }}
          >
            <span>💾</span> {lang === 'es' ? 'Guardar Contacto en Mi Celular' : 'Save Contact to My Phone'}
          </button>
        </div>
>>>>>>> 575e9a4de75df8502c40977aff20c0870c00833d
      </div>
    </div>
  );
}
