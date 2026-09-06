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
<<<<<<< HEAD
    color_primario = '#ff0003',
    color_secundario = '#00E5FF',
    color_cta = '#ff0003',
=======
    color_primario = '#E11D48',
    color_secundario = '#00F0FF',
    color_cta = '#E11D48',
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
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

<<<<<<< HEAD
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.modern;

  return (
    <div
      className="min-h-screen flex justify-center items-center p-0 sm:p-4 transition-colors"
      style={{ backgroundColor: themeConfig.bgOuter }}
=======
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
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
    >
      <div
        className="w-full max-w-[430px] rounded-3xl shadow-2xl overflow-hidden relative pb-28 border animate-fadeIn"
        style={{
<<<<<<< HEAD
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
=======
          backgroundColor: activeThemeConfig.cardBg || '#0F0B15',
          borderColor: activeThemeConfig.borderColor || 'rgba(255,255,255,0.1)',
          boxShadow: `0 20px 50px rgba(0,0,0,0.6)`
        }}
      >
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LAYOUT RENDERER — 10 PRESETS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

        {/* ── LAYOUT: SPLIT HERO ─────────────────────────────────────
            Cover full-bleed con info superpuesta desde abajo       */}
        {theme === 'split_hero' && (
          <div className="relative">
            <div className="relative h-64 w-full overflow-hidden">
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
              {activeCover ? (
                <img src={activeCover} alt="Cover" className="w-full h-full object-cover"
                  style={{ objectPosition: `center ${cover_position_y}%`, transform: `scale(${cover_zoom/100})`, transformOrigin: `center ${cover_position_y}%` }} />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${color_primario} 0%, ${color_secundario}60 60%, #000 100%)` }} />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl border-2 overflow-hidden shrink-0 bg-black/50 flex items-center justify-center"
                    style={{ borderColor: color_primario, boxShadow: `0 0 20px ${color_primario}60` }}>
                    {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                      : <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '★'}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: currentFontPrimary }}>{nombre} {apellido}</h1>
                    {puesto && <p className="text-xs font-semibold uppercase mt-0.5" style={{ color: color_primario }}>{puesto}</p>}
                    {empresa && <p className="text-xs text-gray-300 opacity-80 font-mono">{empresa}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LAYOUT: NEON CYBER ─────────────────────────────────────
            Grid oscuro con bordes neón rosa-cian               */}
        {theme === 'neon_cyber' && (
          <div className="relative p-5">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,.05) 28px,rgba(255,255,255,.05) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,.05) 28px,rgba(255,255,255,.05) 29px)' }} />
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{ borderColor: color_secundario, boxShadow: `0 0 20px ${color_secundario}80, 0 0 40px ${color_primario}40` }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '⚡'}</div>}
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: currentFontPrimary, color: '#fff', textShadow: `0 0 20px ${color_primario}` }}>{nombre} {apellido}</h1>
                {puesto && <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: color_secundario }}>{puesto}</p>}
                {empresa && <p className="text-xs text-gray-400 font-mono mt-0.5">{empresa}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── LAYOUT: MIDNIGHT GOLD ──────────────────────────────────
            Negro azabache, divisores dorados, logo premium     */}
        {theme === 'midnight_gold' && (
          <div className="relative">
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color_primario}, ${color_secundario}, ${color_primario}, transparent)` }} />
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden border flex items-center justify-center bg-black"
                style={{ borderColor: color_primario, boxShadow: `0 0 30px ${color_primario}50` }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ color: color_primario }}>{nombre?.charAt(0) || '✦'}</div>}
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: currentFontPrimary, color: color_primario }}>{nombre} {apellido}</h1>
                <div className="h-px w-16 mx-auto my-2" style={{ background: `linear-gradient(90deg, transparent, ${color_primario}, transparent)` }} />
                {puesto && <p className="text-xs uppercase tracking-widest font-mono" style={{ color: color_secundario }}>{puesto}</p>}
                {empresa && <p className="text-xs opacity-60 mt-1" style={{ color: '#A3A3A3' }}>{empresa}</p>}
              </div>
            </div>
            <div className="h-px mx-6" style={{ background: `linear-gradient(90deg, transparent, ${color_primario}60, transparent)` }} />
          </div>
        )}

        {/* ── LAYOUT: AVATAR FOCUS ───────────────────────────────────
            Logo circular gigante centrado, gradiente radial     */}
        {theme === 'avatar_focus' && (
          <div className="relative pt-8 pb-4 flex flex-col items-center text-center gap-3">
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${color_primario}25 0%, transparent 70%)` }} />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center"
              style={{ borderColor: color_primario, boxShadow: `0 0 0 6px ${color_primario}20, 0 0 40px ${color_primario}40` }}>
              {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '👤'}</div>}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: currentFontPrimary }}>{nombre} {apellido}</h1>
              {puesto && <p className="text-sm font-semibold uppercase mt-1" style={{ color: color_primario }}>{puesto}</p>}
              {empresa && <p className="text-xs text-gray-400 font-mono mt-0.5">{empresa}</p>}
            </div>
          </div>
        )}

        {/* ── LAYOUT: SIDEBAR STRIPE ─────────────────────────────────
            Franja vertical izquierda + info a la derecha        */}
        {theme === 'sidebar_stripe' && (
          <div className="relative flex min-h-[160px]">
            <div className="w-3 shrink-0 rounded-bl-none" style={{ background: `linear-gradient(180deg, ${color_primario}, ${color_secundario})` }} />
            <div className="flex-1 p-5 flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 flex items-center justify-center bg-gray-100"
                style={{ borderColor: color_primario }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '▌'}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: currentFontPrimary, color: '#0f172a' }}>{nombre} {apellido}</h1>
                {puesto && <p className="text-xs font-bold uppercase mt-1" style={{ color: color_primario }}>{puesto}</p>}
                {empresa && <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{empresa}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── LAYOUT: GLASSMORPHISM ──────────────────────────────────
            Glassmorphism con desenfoque e iridiscencia          */}
        {theme === 'glassmorphism' && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 30%, ${color_primario}30, transparent 60%), radial-gradient(circle at 80% 70%, ${color_secundario}20, transparent 60%)` }} />
            <div className="relative p-6 flex flex-col items-center text-center gap-3 backdrop-blur-sm">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: `0 0 30px ${color_primario}40` }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">{nombre?.charAt(0) || '🔮'}</div>}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: currentFontPrimary }}>{nombre} {apellido}</h1>
                {puesto && <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: color_primario }}>{puesto}</p>}
                {empresa && <p className="text-xs text-white/50 font-mono mt-0.5">{empresa}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── LAYOUT: SUNSET GRADIENT ────────────────────────────────
            Gradiente cálido violeta-rosa-naranja de fondo       */}
        {theme === 'sunset_gradient' && (
          <div className="relative">
            <div className="h-40 w-full relative overflow-hidden flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color_primario} 0%, #7c3aed 40%, #f43f5e 70%, #fb923c 100%)` }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="w-20 h-20 rounded-2xl border-4 border-white/30 overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm">
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">{nombre?.charAt(0) || '🌅'}</div>}
              </div>
            </div>
            <div className="px-5 pt-4 pb-2 text-center">
              <h1 className="text-2xl font-bold" style={{ fontFamily: currentFontPrimary, color: activeThemeConfig.textColor || '#FFF1F2' }}>{nombre} {apellido}</h1>
              {puesto && <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: color_primario }}>{puesto}</p>}
              {empresa && <p className="text-xs opacity-60 font-mono mt-0.5" style={{ color: activeThemeConfig.subTextColor || '#FDA4AF' }}>{empresa}</p>}
            </div>
          </div>
        )}

        {/* ── LAYOUT: COVER FLOAT (modern/default) ───────────────────
            Cover → logo flotante → nombre (original)            */}
        {(theme === 'modern' || theme === 'cover_float' || !['split_hero','neon_cyber','midnight_gold','avatar_focus','sidebar_stripe','glassmorphism','sunset_gradient','classic','minimal'].includes(theme)) && (
          <>
            {!layout.hideBanner && (
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/60">
                {activeCover ? (
                  <img src={activeCover} alt="Portada" className="w-full h-full object-cover transition-all"
                    style={{ objectPosition: `center ${cover_position_y}%`, transform: `scale(${cover_zoom / 100})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${color_primario}40 0%, ${color_secundario}20 50%, #000000 100%)` }}>
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <span className="font-bruno text-4xl opacity-20 tracking-widest text-white">
                      {empresa ? empresa.substring(0, 3).toUpperCase() : 'NFC'}
                    </span>
                  </div>
                )}
                {plan_tier !== 'free' && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bruno font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg flex items-center gap-1"
                    style={{ backgroundColor: `${color_primario}30`, borderColor: color_primario, color: '#FFFFFF' }}>
                    <span>⭐</span> {plan_tier === 'elite' ? 'Business Elite' : plan_tier === 'business' ? 'Business' : 'Pro'}
                  </div>
                )}
              </div>
            )}
            
            <div className={`relative px-6 ${layout.logoPosition === 'left' ? 'text-left' : layout.logoPosition === 'right' ? 'text-right' : 'text-center'} ${!layout.hideBanner ? '-mt-14' : 'pt-8'} mb-4 z-10`}>
              {layout.logoPosition !== 'hidden' && (
                <div className="inline-block relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 shadow-2xl flex items-center justify-center overflow-hidden border-2 bg-[#0a0a10]"
                    style={{ borderColor: color_primario, boxShadow: `0 0 24px ${color_primario}40` }}>
                    {activeLogo ? (
                      <img src={activeLogo} alt={nombre} className="w-full h-full object-contain rounded-xl" style={{ transform: `scale(${logo_scale / 100})` }} />
                    ) : (
                      <div className="w-full h-full rounded-xl flex items-center justify-center font-bruno text-2xl font-bold text-white" style={{ backgroundColor: color_primario }}>
                        {nombre ? nombre.charAt(0).toUpperCase() : '★'}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: currentFontPrimary }}>{nombre} {apellido}</h1>
                {puesto && <p className="text-sm font-semibold tracking-wide mt-1 uppercase" style={{ color: color_primario }}>{puesto}</p>}
                {empresa && <p className="text-xs font-mono tracking-wider opacity-80 mt-0.5">{empresa}</p>}
              </div>
            </div>
          </>
        )}

<<<<<<< HEAD
              {nota && (
                <p className="text-xs mt-4 p-3 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-4 w-full text-slate-700" style={{ borderColor: color_cta }}>
                  "{nota}"
                </p>
=======
        {/* ── LAYOUT: CLÁSICO CORPORATIVO ────────────────────────────
            Header color sólido → logo centrado en marco blanco  */}
        {theme === 'classic' && (
          <>
            <div className="h-36 w-full relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: color_secundario }}>
              {activeCover ? (
                <img src={activeCover} alt="Cover" className="w-full h-full object-cover"
                  style={{ objectPosition: `center ${cover_position_y}%`, transform: `scale(${cover_zoom/100})`, transformOrigin: `center ${cover_position_y}%` }} />
              ) : (
                <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
              )}
            </div>
            <div className="px-6 -mt-14 relative z-20 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-xl bg-white flex items-center justify-center"
                style={{ boxShadow: `0 4px 20px ${color_primario}30` }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '🏢'}</div>}
              </div>
              <div className="mt-4 w-full">
                <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: currentFontPrimary, color: '#1E293B' }}>{nombre} {apellido}</h1>
                <div className="h-1.5 w-16 my-2.5 mx-auto rounded-full" style={{ backgroundColor: color_secundario }} />
                <p className="text-base font-bold" style={{ color: color_primario }}>{puesto}</p>
                {empresa && <p className="text-xs text-gray-500 font-mono mt-1">{empresa}</p>}
              </div>
            </div>
          </>
        )}

        {/* ── LAYOUT: MINIMALISTA EJECUTIVO ──────────────────────────
            Sin cover · línea geométrica · editorial centrado     */}
        {theme === 'minimal' && (
          <div className="px-8 pt-8 pb-4 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3 w-full justify-center">
              <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: color_primario }} />
              <div className="w-20 h-20 rounded-xl overflow-hidden border flex items-center justify-center bg-gray-50"
                style={{ borderColor: `${color_primario}40` }}>
                {activeLogo ? <img src={activeLogo} alt={nombre} className="w-full h-full object-contain" style={{ transform: `scale(${logo_scale/100})` }} />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: color_primario }}>{nombre?.charAt(0) || '◻'}</div>}
              </div>
              <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: color_primario }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: currentFontPrimary, color: '#0F172A' }}>{nombre} {apellido}</h1>
              {puesto && <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: color_primario }}>{puesto}</p>}
              {empresa && <p className="text-xs text-gray-400 font-mono mt-0.5">{empresa}</p>}
            </div>
          </div>
        )}

<<<<<<< HEAD
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
=======
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42


<<<<<<< HEAD
            <h1 className="text-2xl font-bold tracking-tight mt-2 text-white" style={{ fontFamily: currentFontPrimary }}>
              {nombre} {apellido}
            </h1>
            <div className="h-1.5 w-16 my-2 mx-auto rounded-full" style={{ backgroundColor: color_secundario }}></div>
            <p className="text-sm font-bold mt-1" style={{ color: color_primario }}>{puesto}</p>
=======
        {/* CONTENIDO Y SECCIONES */}
        <div className="px-5 sm:px-6 space-y-4">
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42

          {/* BIO / NOTA */}
          {(!layout.hideBio && nota) && (
            <div className="space-y-2.5">
              {layout.customLabels?.bio && (
                <h3 className="text-[11px] font-bruno uppercase tracking-wider pl-1" style={{ color: color_primario }}>
                  {layout.customLabels.bio}
                </h3>
              )}
              <div
                className="p-3.5 rounded-2xl text-xs leading-relaxed border backdrop-blur-md"
                style={{
                  backgroundColor: `${color_secundario}08`,
                  borderColor: `${color_secundario}25`,
                  color: activeThemeConfig.textColor
                }}
              >
                <p>{nota}</p>
              </div>
            </div>
          )}

<<<<<<< HEAD
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
=======
          {/* ACCIÓN PRINCIPAL RÁPIDA: AGENDAR CITA EN GOOGLE CALENDAR / CALENDLY */}
          {google_calendar_url && (
            <a
              href={google_calendar_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('calendar_click')}
              className="w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bruno font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] border"
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
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
            </div>
          )}

          {/* CANALES DE CONTACTO DIRECTO */}
          {!layout.hideContact && (telefono || whatsapp || correo || url) && (
            <div className="space-y-2.5">
              {layout.customLabels?.contact && (
                <h3 className="text-[11px] font-bruno uppercase tracking-wider pl-1 mt-2" style={{ color: color_primario }}>
                  {layout.customLabels.contact}
                </h3>
              )}
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

<<<<<<< HEAD
            {nota && (
              <p className="text-xs mt-4 opacity-75 leading-relaxed italic max-w-[90%] text-slate-700">
                "{nota}"
              </p>
=======
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
            </div>
          )}

          {/* REDES SOCIALES */}
          {!layout.hideSocial && (fbUrl || igUrl || inUrl) && (
            <div className="space-y-2.5">
              {layout.customLabels?.social && (
                <h3 className="text-[11px] font-bruno uppercase tracking-wider pl-1 mt-2" style={{ color: color_primario }}>
                  {layout.customLabels.social}
                </h3>
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
            </div>
          )}

          <div className="space-y-2.5">
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

            {!layout.hideMap && effectiveMapsUrl && (
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
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
            )}

            {!layout.hideVideo && video_youtube_url && (
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
        {/* 4. TEMA GLASSMORPHISM FROST */}
        {theme === 'glassmorphism' && (
          <div className="p-6 flex flex-col items-center relative">
            <div className="absolute top-6 -left-10 w-44 h-44 rounded-full bg-[#ff0003]/25 blur-3xl pointer-events-none"></div>
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
              className="w-full h-1 rounded-full mb-4 shadow-[0_0_15px_rgba(255,0,3,0.5)]"
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
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,0,3,0.6)]"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono text-gray-400 hover:text-white bg-black/40 hover:bg-black/80 border border-white/10 hover:border-[#ff0003]/50 transition-all group"
          >
            <span className="text-[#ff0003] group-hover:scale-110 transition-transform">⚡</span>
            <span>{t('card_powered')}</span>
            <span className="text-gray-500 group-hover:text-[#ff0003]">↗</span>
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
=======
>>>>>>> ad321a99201f8668eb913641d027052b4eecda42
      </div>
    </div>
  );
}
