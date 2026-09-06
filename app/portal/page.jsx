'use client';

import React, { useState, useEffect } from 'react';
import brandConfig from '../../brand.config';
import { THEMES, SUBSCRIPTION_PLANS } from '../../lib/themes';
import PublicProfileClient from '../p/[slug]/PublicProfileClient';

export default function BusinessElitePortalPage() {
  const [selectedSlug, setSelectedSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'fields', 'layout', 'modules', 'themes'

  // Perfil Cargado en Edición
  const [profile, setProfile] = useState({
    slug: '',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    empresa: 'Mendoza & Co. International',
    puesto: 'Managing Director & Partner',
    telefono: '+52 55 1234 5678',
    whatsapp: '525512345678',
    correo: 'carlos@mendozaco.com',
    url: 'https://mendozaco.com',
    linkedin: 'carlos-mendoza-exec',
    instagram: 'carlos_mendoza',
    facebook: 'carlosmendozaco',
    calle: 'Paseo de la Reforma 400',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    cp: '06600',
    pais: 'México',
    nota: 'Asesoría ejecutiva y estructuración patrimonial de alto impacto.',
    google_maps_url: 'https://maps.google.com/?q=Paseo+de+la+Reforma+400',
    video_youtube_url: '',
    theme: 'royal_amethyst',
    font_primary: 'Inter',
    font_secondary: 'Inter',
    color_primario: '#A855F7',
    color_secundario: '#00F0FF',
    color_cta: '#A855F7',
    logo_scale: 100,
    cover_position_y: 50,
    cover_zoom: 100,
    logo_img: null,
    cover_photo: null,
    plan_tier: 'elite',
    custom_fields: [
      { label: 'Telegram VIP', icon: '✈️', value: 'https://t.me/carlosmendoza' },
      { label: 'Pago Directo Stripe', icon: '💳', value: 'https://buy.stripe.com/demo' }
    ],
    custom_layout: {
      logoPosition: 'center',
      infoBoxStyle: 'floating',
      showBadges: true
    },
    portfolio: [
      { title: 'Expansión Fintech 2026', description: 'Levantamiento de capital de $12M USD', url: 'https://mendozaco.com', image: '' }
    ],
    google_calendar_url: 'https://calendar.google.com',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
    ],
    marketing_carousel: [
      { title: 'Conferencia Wealth Summit 2026', description: 'Reserva tu pase exclusivo con 20% de descuento.', link: 'https://mendozaco.com', image: '' }
    ],
    customer_reviews: [
      { name: 'Lic. Roberto Garza', stars: 5, comment: 'La mejor experiencia en consultoría patrimonial.' }
    ]
  });

  // Cargar lista de perfiles si es necesario
  useEffect(() => {
    // Si viene por parámetro ?slug=
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSlug = params.get('slug');
      if (urlSlug) {
        setSelectedSlug(urlSlug);
        loadProfile(urlSlug);
      }
    }
  }, []);

  const loadProfile = async (slugToFetch) => {
    if (!slugToFetch) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/profile?slug=${encodeURIComponent(slugToFetch)}`);
      const json = await res.json();
      if (json.success && json.profile) {
        setProfile({
          ...json.profile,
          custom_fields: json.profile.custom_fields || [],
          custom_layout: json.profile.custom_layout || { logoPosition: 'center', infoBoxStyle: 'floating' },
          portfolio: json.profile.portfolio || [],
          gallery: json.profile.gallery || [],
          marketing_carousel: json.profile.marketing_carousel || [],
          customer_reviews: json.profile.customer_reviews || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleLayoutChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      custom_layout: {
        ...(prev.custom_layout || {}),
        [field]: value
      }
    }));
  };

  // Guardar Cambios en Cloud SQL
  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/portal/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('✅ ¡Cambios guardados con éxito en la nube!');
        setTimeout(() => setSaveMessage(''), 4000);
      } else {
        setSaveMessage('❌ Error: ' + (data.error || 'No se pudo guardar'));
      }
    } catch (err) {
      setSaveMessage('❌ Error de conexión: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Gestor de Campos Personalizados
  const addCustomField = () => {
    setProfile(prev => ({
      ...prev,
      custom_fields: [
        ...(prev.custom_fields || []),
        { label: 'Nuevo Enlace', icon: '🔗', value: 'https://' }
      ]
    }));
  };

  const updateCustomField = (index, field, val) => {
    const next = [...(profile.custom_fields || [])];
    next[index] = { ...next[index], [field]: val };
    setProfile(prev => ({ ...prev, custom_fields: next }));
  };

  const removeCustomField = (index) => {
    setProfile(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, i) => i !== index)
    }));
  };

  // Gestor de Portafolio
  const addPortfolioItem = () => {
    setProfile(prev => ({
      ...prev,
      portfolio: [
        ...(prev.portfolio || []),
        { title: 'Nuevo Proyecto', description: 'Descripción breve', url: '', image: '' }
      ]
    }));
  };

  const updatePortfolioItem = (index, field, val) => {
    const next = [...(profile.portfolio || [])];
    next[index] = { ...next[index], [field]: val };
    setProfile(prev => ({ ...prev, portfolio: next }));
  };

  const removePortfolioItem = (index) => {
    setProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  // Gestor de Reseñas
  const addReview = () => {
    setProfile(prev => ({
      ...prev,
      customer_reviews: [
        ...(prev.customer_reviews || []),
        { name: 'Cliente Satisfecho', stars: 5, comment: 'Excelente servicio y atención profesional.' }
      ]
    }));
  };

  const updateReview = (index, field, val) => {
    const next = [...(profile.customer_reviews || [])];
    next[index] = { ...next[index], [field]: val };
    setProfile(prev => ({ ...prev, customer_reviews: next }));
  };

  const removeReview = (index) => {
    setProfile(prev => ({
      ...prev,
      customer_reviews: prev.customer_reviews.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-[#060509] text-[#F8FAFC] p-3 sm:p-6 lg:p-8 font-sans">
      
      {/* HEADER DEL PORTAL PERSONAL BUSINESS ELITE */}
      <header className="max-w-[1920px] mx-auto w-full mb-6 pb-4 border-b border-rose-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="rose-logo-container shrink-0">
            <img
              src={brandConfig.assets.logo || "/brand/logo.png"}
              alt={brandConfig.brandName}
              className="rose-logo-img shadow-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bruno text-white tracking-wide">
                PORTAL PERSONAL <span className="text-[#FF2A54]">BUSINESS ELITE</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bruno font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                VIP MEMBER
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">
              Edita tu información, cambia temas, modifica el layout visual y gestiona módulos interactivos sin costo adicional.
            </p>
          </div>
        </div>

        {/* CONTROLES Y BUSCADOR DE SLUG */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#0F0B15] border border-rose-900/40 rounded-xl p-1">
            <input
              type="text"
              placeholder="Cargar por slug (ej. marcos-thorne...)"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="bg-transparent text-xs px-3 py-1.5 focus:outline-none text-white font-mono w-48"
            />
            <button
              onClick={() => loadProfile(selectedSlug)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bruno transition-all"
            >
              Cargar
            </button>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="btn-primary px-5 py-2.5 text-xs shadow-lg"
          >
            {saving ? 'GUARDANDO...' : '💾 GUARDAR CAMBIOS'}
          </button>

          <a
            href={`/p/${profile.slug || 'demo'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl text-xs font-bruno bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-800 transition-colors flex items-center gap-1.5"
          >
            <span>👁️</span> Ver Tarjeta en Vivo
          </a>
        </div>
      </header>

      {saveMessage && (
        <div className="max-w-[1920px] mx-auto mb-4 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-bold animate-fadeIn flex items-center justify-between">
          <span>{saveMessage}</span>
          <button onClick={() => setSaveMessage('')} className="text-white">✕</button>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL: PANEL DE EDICIÓN + SIMULADOR MÓVIL EN VIVO */}
      <main className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: CONTROLES DE EDICIÓN & LAYOUT (7 COLUMNAS) */}
        <section className="lg:col-span-7 panel-glass p-5 sm:p-7 space-y-6">
          
          {/* NAVEGACIÓN POR PESTAÑAS */}
          <div className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-800">
            {[
              { id: 'info', label: 'Datos Generales', icon: '📝' },
              { id: 'themes', label: '14+ Temas Visuales', icon: '🎨' },
              { id: 'layout', label: 'Diseño de Layout', icon: '📐' },
              { id: 'fields', label: 'Campos Personalizados', icon: '➕' },
              { id: 'modules', label: 'Módulos & Portafolio', icon: '💼' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bruno whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#E11D48] text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: DATOS GENERALES */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bruno text-[#FF2A54] uppercase tracking-wider flex items-center gap-1.5">
                <span>👤</span> Identidad Personal y Corporativa
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={profile.nombre || ''}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={profile.apellido || ''}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={profile.empresa || ''}
                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Puesto / Cargo</label>
                  <input
                    type="text"
                    value={profile.puesto || ''}
                    onChange={(e) => handleInputChange('puesto', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Teléfono Directo</label>
                  <input
                    type="tel"
                    value={profile.telefono || ''}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={profile.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={profile.correo || ''}
                    onChange={(e) => handleInputChange('correo', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bruno text-gray-300 mb-1">Sitio Web</label>
                  <input
                    type="url"
                    value={profile.url || ''}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1">Biografía / Mensaje de Presentación</label>
                <textarea
                  rows={3}
                  value={profile.nota || ''}
                  onChange={(e) => handleInputChange('nota', e.target.value)}
                  className="input-dark w-full py-2"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SELECTOR DE 14+ TEMAS VISUALES */}
          {activeTab === 'themes' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bruno text-[#FF2A54] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎨</span> Galería de 14 Temas Visuales
                </h3>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30">
                  Acceso Total Desbloqueado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {Object.values(THEMES).map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleInputChange('theme', t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      profile.theme === t.id
                        ? 'border-[#FF2A54] bg-[#E11D48]/15 shadow-[0_0_20px_rgba(255,42,84,0.35)]'
                        : 'border-gray-800 bg-black/40 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border shadow" style={{ backgroundColor: t.accentColor }} />
                        <span className="font-bruno text-xs font-bold text-white">{t.name}</span>
                      </div>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-white/10 text-gray-300">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DISEÑO DE LAYOUT Y POSICIONAMIENTO */}
          {activeTab === 'layout' && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-sm font-bruno text-[#FF2A54] uppercase tracking-wider flex items-center gap-1.5">
                <span>📐</span> Editor de Estructura y Posición de Elementos
              </h3>

              {/* Posición del Logotipo */}
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-2 uppercase">Posición y Alineación del Logo</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'center', label: 'Centrado', icon: '🎯' },
                    { id: 'left', label: 'Izquierda', icon: '⬅️' },
                    { id: 'floating', label: 'Flotante', icon: '✨' },
                    { id: 'compact', label: 'Compacto', icon: '🔍' }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => handleLayoutChange('logoPosition', pos.id)}
                      className={`p-3 rounded-xl border text-xs font-bruno transition-all flex flex-col items-center gap-1 ${
                        (profile.custom_layout?.logoPosition || 'center') === pos.id
                          ? 'bg-[#E11D48] text-white border-rose-400 shadow-md font-bold'
                          : 'bg-black/40 text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{pos.icon}</span>
                      <span>{pos.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo del Recuadro de Información */}
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-2 uppercase">Estilo del Recuadro de Contacto</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'floating', label: 'Elevado / Glow', icon: '💫' },
                    { id: 'glass', label: 'Glassmorphism', icon: '🪟' },
                    { id: 'flat', label: 'Flat Modern', icon: '📄' },
                    { id: 'minimal', label: 'Ultra Minimal', icon: '⚡' }
                  ].map(box => (
                    <button
                      key={box.id}
                      type="button"
                      onClick={() => handleLayoutChange('infoBoxStyle', box.id)}
                      className={`p-3 rounded-xl border text-xs font-bruno transition-all flex flex-col items-center gap-1 ${
                        (profile.custom_layout?.infoBoxStyle || 'floating') === box.id
                          ? 'bg-[#E11D48] text-white border-rose-400 shadow-md font-bold'
                          : 'bg-black/40 text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{box.icon}</span>
                      <span>{box.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enlace Directo de Google Calendar / Calendly */}
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase">📅 Enlace de Agenda / Google Calendar / Calendly</label>
                <input
                  type="url"
                  placeholder="https://calendar.google.com/calendar/appointments/schedules/... o https://calendly.com/tu-usuario"
                  value={profile.google_calendar_url || ''}
                  onChange={(e) => handleInputChange('google_calendar_url', e.target.value)}
                  className="input-dark w-full font-mono text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Muestra un botón destacado en la tarjeta para que tus clientes agenden reuniones o citas de inmediato.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: GESTOR DE CAMPOS DINÁMICOS */}
          {activeTab === 'fields' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bruno text-[#FF2A54] uppercase tracking-wider flex items-center gap-1.5">
                  <span>➕</span> Agregar o Quitar Campos de Información
                </h3>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bruno transition-all flex items-center gap-1 shadow"
                >
                  <span>➕</span> Nuevo Campo
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Agrega enlaces personalizados, métodos de pago (Stripe, PayPal), Telegram, Discord, TikTok, catálogo PDF o cualquier información a medida.
              </p>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {(profile.custom_fields || []).map((field, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-black/50 border border-gray-800 flex flex-col sm:flex-row gap-2.5 items-center">
                    <input
                      type="text"
                      placeholder="Icono (ej. 💳, ✈️, 🎵)"
                      value={field.icon || ''}
                      onChange={(e) => updateCustomField(idx, 'icon', e.target.value)}
                      className="input-dark w-20 text-center text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Etiqueta (ej. Pago Stripe, TikTok)"
                      value={field.label || ''}
                      onChange={(e) => updateCustomField(idx, 'label', e.target.value)}
                      className="input-dark flex-1 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Enlace o Valor (https://...)"
                      value={field.value || ''}
                      onChange={(e) => updateCustomField(idx, 'value', e.target.value)}
                      className="input-dark flex-1 w-full font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomField(idx)}
                      className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 text-xs transition-colors shrink-0"
                      title="Eliminar Campo"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MÓDULOS ELITE (PORTAFOLIO, FOTOTECA, MARKETING, RESEÑAS) */}
          {activeTab === 'modules' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Sección 1: Portafolio de Trabajos */}
              <div className="p-4 rounded-2xl bg-black/40 border border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bruno font-bold text-white uppercase flex items-center gap-1.5">
                    <span>💼</span> Portafolio de Proyectos / Trabajos
                  </h4>
                  <button
                    type="button"
                    onClick={addPortfolioItem}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bruno"
                  >
                    + Agregar Proyecto
                  </button>
                </div>
                
                <div className="space-y-2.5">
                  {(profile.portfolio || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0a0a14] border border-gray-800 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Título del Proyecto"
                          value={item.title || ''}
                          onChange={(e) => updatePortfolioItem(idx, 'title', e.target.value)}
                          className="input-dark flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removePortfolioItem(idx)}
                          className="px-2.5 rounded-lg bg-red-950/50 text-red-400 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Descripción breve del logro o servicio"
                        value={item.description || ''}
                        onChange={(e) => updatePortfolioItem(idx, 'description', e.target.value)}
                        className="input-dark w-full text-xs"
                      />
                      <input
                        type="url"
                        placeholder="URL de enlace al proyecto (opcional)"
                        value={item.url || ''}
                        onChange={(e) => updatePortfolioItem(idx, 'url', e.target.value)}
                        className="input-dark w-full font-mono text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección 2: Reseñas de Clientes */}
              <div className="p-4 rounded-2xl bg-black/40 border border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bruno font-bold text-white uppercase flex items-center gap-1.5">
                    <span>⭐</span> Reseñas y Testimonios de Clientes
                  </h4>
                  <button
                    type="button"
                    onClick={addReview}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bruno"
                  >
                    + Agregar Reseña
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(profile.customer_reviews || []).map((rev, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0a0a14] border border-gray-800 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del Cliente o Empresa"
                          value={rev.name || ''}
                          onChange={(e) => updateReview(idx, 'name', e.target.value)}
                          className="input-dark flex-1"
                        />
                        <select
                          value={rev.stars || 5}
                          onChange={(e) => updateReview(idx, 'stars', parseInt(e.target.value))}
                          className="input-dark w-24 text-xs font-bold text-yellow-400"
                        >
                          <option value="5">⭐⭐⭐⭐⭐</option>
                          <option value="4">⭐⭐⭐⭐</option>
                          <option value="3">⭐⭐⭐</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeReview(idx)}
                          className="px-2.5 rounded-lg bg-red-950/50 text-red-400 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Testimonio o comentario de satisfacción"
                        value={rev.comment || ''}
                        onChange={(e) => updateReview(idx, 'comment', e.target.value)}
                        className="input-dark w-full text-xs italic"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

        {/* COLUMNA DERECHA: PREVISUALIZACIÓN EN VIVO (MOCKUP SMARTPHONE 5 COLUMNAS) */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-6 w-full flex flex-col items-center space-y-3">
            <div className="flex items-center gap-2 text-xs font-bruno text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Simulador de Tarjeta NFC en Tiempo Real</span>
            </div>

            {/* Renderizador de Tarjeta en Vivo */}
            <div className="w-full max-w-[420px] rounded-[36px] p-2 bg-[#12121e] border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <PublicProfileClient profile={profile} />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
