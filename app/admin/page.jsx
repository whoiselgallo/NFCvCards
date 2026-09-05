'use client';

import React, { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import { QRCodeSVG } from 'qrcode.react';
import brandConfig from '../../brand.config';
import { generateDeliveryInstructions } from '../../lib/brand';

const POPULAR_FONTS = [
  { label: 'Inter (Moderna y Limpia)', value: 'Inter' },
  { label: 'Bruno Ace SC (Branding Tecnológico)', value: 'Bruno Ace SC' },
  { label: 'Space Grotesk (Futurista)', value: 'Space Grotesk' },
  { label: 'Playfair Display (Elegante & Editorial)', value: 'Playfair Display' },
  { label: 'Montserrat (Geométrica)', value: 'Montserrat' },
  { label: 'Poppins (Amigable y Redonda)', value: 'Poppins' },
  { label: 'Bebas Neue (Impacto & Mayúsculas)', value: 'Bebas Neue' },
  { label: 'Outfit (Vanguardista)', value: 'Outfit' },
  { label: 'Cinzel (Lujo / Clásica)', value: 'Cinzel' },
  { label: 'Oswald (Condensada / Firme)', value: 'Oswald' },
  { label: 'Syne (Alta Moda / Diseño)', value: 'Syne' },
  { label: 'Roboto (Estándar Android)', value: 'Roboto' }
];

export default function AdminDashboardPage() {
  // Estado de Autenticación
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Datos del Dashboard
  const [profiles, setProfiles] = useState([]);
  const [metrics, setMetrics] = useState({
    total_profiles: 0,
    total_views: 0,
    total_companies: 0,
    validated_count: 0,
    pending_count: 0,
    active_count: 0
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modales
  const [editingProfile, setEditingProfile] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [emailModalProfile, setEmailModalProfile] = useState(null);
  const [deleteModalProfile, setDeleteModalProfile] = useState(null);
  const [isZippingId, setIsZippingId] = useState(null);

  // Comprobar sesión activa al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/admin/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        loadProfiles();
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);

    try {
      const endpoint = authMode === 'register' ? '/api/admin/auth/register' : '/api/admin/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      const data = await res.json();
      if (!data.success) {
        setAuthError(data.error || 'Error al procesar la solicitud');
        setAuthSubmitting(false);
        return;
      }

      setCurrentUser(data.user);
      setAuthForm({ email: '', password: '', name: '' });
      loadProfiles();
    } catch (err) {
      setAuthError('Error de conexión con el servidor: ' + err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setProfiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar Perfiles con Filtros
  const loadProfiles = async (query = searchQuery, tag = selectedTag, status = selectedStatus) => {
    setLoadingProfiles(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (tag) params.append('tag', tag);
      if (status && status !== 'all') params.append('status', status);

      const res = await fetch(`/api/admin/profiles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        if (data.metrics) setMetrics(data.metrics);
        if (data.availableTags) setAvailableTags(data.availableTags);
      }
    } catch (err) {
      console.error('Error al cargar perfiles:', err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Actualizar filtros reactivamente
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    loadProfiles(val, selectedTag, selectedStatus);
  };

  const handleTagFilter = (tag) => {
    const nextTag = selectedTag === tag ? '' : tag;
    setSelectedTag(nextTag);
    loadProfiles(searchQuery, nextTag, selectedStatus);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    loadProfiles(searchQuery, selectedTag, status);
  };

  // Cambio rápido de Estado / Validación
  const handleQuickStatusChange = async (profileId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: newStatus } : p));
        // actualizar métricas locales
        loadProfiles();
      }
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  // Guardar Cambios en Edición Completa
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProfile) return;
    setEditSaving(true);

    try {
      const res = await fetch(`/api/admin/profiles/${editingProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProfile)
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(prev => prev.map(p => p.id === editingProfile.id ? data.profile : p));
        setEditingProfile(null);
        alert('✅ Perfil actualizado exitosamente en Google Cloud SQL');
      } else {
        alert('Error al guardar: ' + (data.error || 'No se pudo actualizar'));
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // Eliminar Perfil
  const handleDeleteConfirm = async () => {
    if (!deleteModalProfile) return;
    try {
      const res = await fetch(`/api/admin/profiles/${deleteModalProfile.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(prev => prev.filter(p => p.id !== deleteModalProfile.id));
        setDeleteModalProfile(null);
        loadProfiles();
      } else {
        alert('Error al eliminar: ' + (data.error || 'No se pudo eliminar'));
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  // Generador de Carta Oficial de Entrega para el modal de reenvío
  const generateEmailText = (p) => {
    const subject = brandConfig.delivery.emailSubject(p.empresa);
    const body = generateDeliveryInstructions({
      nombre: p.nombre,
      apellido: p.apellido,
      empresa: p.empresa,
      slug: p.slug,
      originUrl: typeof window !== 'undefined' ? window.location.origin : (brandConfig.website || 'https://rosecard.io')
    });

    return { subject, body };
  };

  // Descarga rápida de ZIP por perfil desde la fila del usuario
  const downloadProfileZip = async (p) => {
    setIsZippingId(p.id);
    try {
      const zip = new JSZip();
      const titular = `${p.nombre || 'Contacto'}_${p.apellido || 'Card'}`.trim();
      const { body: instrucciones } = generateEmailText(p);

      // 1. vCard
      let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
      vcard += `N:${p.apellido || ''};${p.nombre || ''};;;\r\n`;
      vcard += `FN:${(p.nombre + ' ' + p.apellido).trim()}\r\n`;
      if (p.empresa) vcard += `ORG:${p.empresa}\r\n`;
      if (p.puesto) vcard += `TITLE:${p.puesto}\r\n`;
      if (p.telefono) vcard += `TEL;TYPE=CELL,VOICE:${p.telefono}\r\n`;
      if (p.whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${p.whatsapp}\r\n`;
      if (p.correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${p.correo}\r\n`;
      if (p.url) vcard += `URL;TYPE=WORK:${p.url}\r\n`;
      if (p.calle || p.ciudad || p.estado || p.cp || p.pais) {
        vcard += `ADR;TYPE=WORK:;;${p.calle || ''};${p.ciudad || ''};${p.estado || ''};${p.cp || ''};${p.pais || ''}\r\n`;
      }
      if (p.google_maps_url) vcard += `NOTE:Google Maps: ${p.google_maps_url}\\n${p.nota || ''}\r\n`;
      else if (p.nota) vcard += `NOTE:${p.nota}\r\n`;
      vcard += `END:VCARD`;

      zip.file(`${titular}_Contacto.vcf`, vcard);
      zip.file(brandConfig.delivery.instructionsFilename(titular), instrucciones);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Paquete_${titular}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al descargar .zip: ' + err.message);
    } finally {
      setIsZippingId(null);
    }
  };

  // Si está cargando verificación de sesión
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#04040A] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bruno text-sm text-gray-400">Verificando Credenciales de Acceso...</p>
      </div>
    );
  }

  // PANTALLA DE ACCESO SI NO ESTÁ AUTENTICADO
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#060509] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F0B15] border border-rose-600/40 p-8 rounded-3xl shadow-[0_0_60px_rgba(225,29,72,0.3)] space-y-6 animate-scaleIn backdrop-blur-xl">
          
          {/* Logo y Cabecera */}
          <div className="text-center space-y-3">
            <div className="inline-flex rose-logo-container mb-1 shadow-2xl">
              <img
                src={brandConfig.assets.logo || "/brand/logo.png"}
                alt={brandConfig.brandName}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            </div>
            <h1 className="text-2xl font-bruno text-white tracking-wide">
              {brandConfig.brandHeading.prefix} <span className="text-[#FF2A54] drop-shadow-[0_0_12px_rgba(255,42,84,0.6)]">{brandConfig.brandHeading.highlight}</span> ADMIN
            </h1>
            <p className="text-xs text-gray-400">Panel Centralizado de Control de Identidades Digitales</p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-rose-500/10 border border-rose-500/30 text-rose-400">
              {brandConfig.adminAuth.allowedDomains === '*' ? '🔒 Panel Administrativo Seguro' : `🔒 Exclusivo para ${brandConfig.adminAuth.allowedDomains}`}
            </div>
          </div>

          {/* Formulario de Login / Registro */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <span className="text-sm">⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase">Nombre del Administrador</label>
                <input
                  type="text"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej. Administrador"
                  className="input-dark w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase">Correo Electrónico</label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@tudominio.com"
                className="input-dark w-full font-mono text-xs"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {brandConfig.adminAuth.allowedDomains === '*' ? 'Introduce tu correo autorizado' : `Debe terminar en: ${brandConfig.adminAuth.allowedDomains}`}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase">Contraseña</label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="input-dark w-full"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3.5 rounded-xl text-xs font-bruno font-bold uppercase tracking-wider bg-[#E11D48] text-white hover:bg-rose-700 transition-all shadow-[0_0_20px_rgba(225,29,72,0.35)] flex items-center justify-center gap-2"
            >
              {authSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>VERIFICANDO ACCESO...</span>
                </>
              ) : (
                <span>{authMode === 'login' ? 'INICIAR SESIÓN' : 'REGISTRARME COMO ADMINISTRADOR'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login / Registro */}
          <div className="text-center pt-2 border-t border-gray-800">
            {authMode === 'login' ? (
              <p className="text-xs text-gray-400">
                ¿Es tu primera vez?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className="text-[#E11D48] hover:underline font-bold"
                >
                  Registrar mi cuenta
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className="text-[#E11D48] hover:underline font-bold"
                >
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>

          <div className="text-center">
            <a href="/" className="text-[11px] text-gray-500 hover:text-gray-300">
              ← Volver al Generador Público
            </a>
          </div>

        </div>
      </div>
    );
  }

  // DASHBOARD PRINCIPAL ADMINISTRATIVO
  return (
    <div className="min-h-screen bg-[#060509] text-[#F8FAFC] p-4 md:p-8 flex flex-col font-sans">
      
      {/* HEADER DEL PANEL */}
      <header className="max-w-[1920px] mx-auto w-full mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-900/30">
        <div className="flex items-center gap-3.5">
          <div className="rose-logo-container shrink-0">
            <img
              src={brandConfig.assets.logo || "/brand/logo.png"}
              alt={brandConfig.brandName}
              className="rose-logo-img shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bruno text-white tracking-wide flex items-center gap-2">
              {brandConfig.brandHeading.prefix} <span className="text-[#FF2A54] drop-shadow-[0_0_12px_rgba(255,42,84,0.6)]">{brandConfig.brandHeading.highlight}</span> ADMIN ENGINE
            </h1>
            <p className="text-xs text-gray-400">Centro de Control y Gestión de Identidades Digitales NFC</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{currentUser.name || currentUser.email}</p>
            <p className="text-[10px] font-mono text-[#00E5FF]">{currentUser.email}</p>
          </div>
          
          <a
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-bruno bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-800 transition-colors flex items-center gap-1.5"
          >
            <span>➕</span> Nuevo Perfil
          </a>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-bruno bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 transition-colors flex items-center gap-1.5"
          >
            <span>🚪</span> Salir
          </button>
        </div>
      </header>

      {/* METRICS ROW */}
      <section className="max-w-[1920px] mx-auto w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Total Perfiles</p>
          <p className="text-2xl font-bruno font-bold text-[#F97316] mt-1">{metrics.total_profiles}</p>
        </div>

        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Empresas</p>
          <p className="text-2xl font-bruno font-bold text-[#00E5FF] mt-1">{metrics.total_companies}</p>
        </div>

        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Vistas Totales</p>
          <p className="text-2xl font-bruno font-bold text-green-400 mt-1">{metrics.total_views}</p>
        </div>

        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Validados</p>
          <p className="text-2xl font-bruno font-bold text-emerald-400 mt-1">{metrics.validated_count}</p>
        </div>

        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Pendientes</p>
          <p className="text-2xl font-bruno font-bold text-yellow-400 mt-1">{metrics.pending_count}</p>
        </div>

        <div className="bg-[#0c0c16] border border-gray-800 p-4 rounded-2xl">
          <p className="text-[11px] font-bruno text-gray-400 uppercase">Activos</p>
          <p className="text-2xl font-bruno font-bold text-purple-400 mt-1">{metrics.active_count}</p>
        </div>
      </section>

      {/* BARRA DE HERRAMIENTAS: BÚSQUEDA UNIVERSAL + FILTRO POR ETIQUETAS + ESTADO */}
      <section className="max-w-[1920px] mx-auto w-full bg-[#0c0c16] border border-gray-800 p-5 rounded-2xl mb-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Buscador Universal en Tiempo Real */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar por Empresa, Nombre, Correo, Teléfono, Slug o Etiquetas..."
              className="w-full bg-[#06060c] border border-gray-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); loadProfiles('', selectedTag, selectedStatus); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por Estado */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bruno text-gray-400">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="bg-[#06060c] border border-gray-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#F97316]"
            >
              <option value="all">Todos los Estados</option>
              <option value="active">Activo</option>
              <option value="validated">Validado</option>
              <option value="pending">Pendiente</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

        </div>

        {/* CHIPS DE ETIQUETAS (TAGS) DISPONIBLES */}
        {availableTags.length > 0 && (
          <div className="pt-3 border-t border-gray-800/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bruno text-gray-400 flex items-center gap-1">
              <span>🏷️</span> Etiquetas:
            </span>
            <button
              onClick={() => handleTagFilter('')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                selectedTag === ''
                  ? 'bg-[#F97316] text-black font-extrabold shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Todas
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  selectedTag === tag
                    ? 'bg-[#00E5FF] text-black font-extrabold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-[#12121c] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* DISPLAY PRINCIPAL DE PERFILES (FILA 1: NOMBRE DE LA EMPRESA) */}
      <section className="max-w-[1920px] mx-auto w-full flex-1">
        {loadingProfiles ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-3 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bruno">Cargando base de datos de Google Cloud SQL...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📇</p>
            <h3 className="text-lg font-bruno text-white">No se encontraron perfiles con estos criterios</h3>
            <p className="text-xs mt-1 text-gray-500">Prueba ajustando el término de búsqueda o seleccionando otra etiqueta.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((p) => {
              const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${p.slug}`;
              const tagsArray = p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

              return (
                <div
                  key={p.id}
                  className="bg-[#090914] border border-gray-800 hover:border-[#F97316]/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.12)] space-y-4"
                >
                  {/* FILA 1: NOMBRE DE LA EMPRESA (PROMINENTE) & ESTADO & MODO */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black border border-[#F97316]/40 flex items-center justify-center text-base shrink-0 overflow-hidden shadow-inner">
                        {p.logo_img ? (
                          <img src={p.logo_img} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          <span>🏢</span>
                        )}
                      </div>
                      <div>
                        {/* FILA 1: EMPRESA */}
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bruno text-white font-bold tracking-wide">
                            {p.empresa || 'EMPRESA INDEPENDIENTE'}
                          </h2>
                          {p.mode === 'review' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bruno bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                              ⭐ Review Mode
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bruno bg-orange-500/10 border border-orange-500/30 text-orange-400">
                              📇 vCard 3.0
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">
                          ID: #{p.id} • Creado: {new Date(p.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* SELECTOR RÁPIDO DE ESTADO (VALIDACIÓN EN 1 TOQUE) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-bruno">Estado:</span>
                      <select
                        value={p.status || 'active'}
                        onChange={(e) => handleQuickStatusChange(p.id, e.target.value)}
                        className={`text-xs font-bruno px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-colors ${
                          p.status === 'validated'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : p.status === 'pending'
                            ? 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300'
                            : p.status === 'archived'
                            ? 'bg-gray-800 border-gray-700 text-gray-400'
                            : 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                        }`}
                      >
                        <option value="active" className="bg-[#090914] text-orange-400">● Activo</option>
                        <option value="validated" className="bg-[#090914] text-emerald-400">✓ Validado</option>
                        <option value="pending" className="bg-[#090914] text-yellow-400">⏳ Pendiente</option>
                        <option value="archived" className="bg-[#090914] text-gray-400">🛑 Archivado</option>
                      </select>
                    </div>
                  </div>

                  {/* FILA 2: DATOS DEL TITULAR, PUESTO Y CONTACTO */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                    
                    {/* Titular y Puesto */}
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bruno">Titular & Cargo</p>
                      <p className="font-bold text-white text-sm mt-0.5">{p.nombre} {p.apellido || ''}</p>
                      <p className="text-gray-300 text-xs">{p.puesto || 'Sin puesto asignado'}</p>
                    </div>

                    {/* Contacto Directo */}
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bruno">Contacto</p>
                      <div className="mt-0.5 space-y-0.5 text-[11px] font-mono">
                        {p.telefono && (
                          <p className="text-gray-300">📞 <a href={`tel:${p.telefono}`} className="hover:text-[#F97316]">{p.telefono}</a></p>
                        )}
                        {p.correo && (
                          <p className="text-gray-300 truncate">✉️ <a href={`mailto:${p.correo}`} className="hover:text-[#F97316]">{p.correo}</a></p>
                        )}
                        {p.whatsapp && (
                          <p className="text-green-400">💬 <a href={`https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">WA: {p.whatsapp}</a></p>
                        )}
                      </div>
                    </div>

                    {/* Enlace Permanente y Telemetría */}
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bruno">Enlace & Telemetría</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#00E5FF] truncate select-all">{p.slug}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(fullUrl); alert('¡Enlace copiado!'); }}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[10px] font-bruno rounded text-white"
                          title="Copiar URL"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        👁️ Vistas: <span className="font-bold text-white">{p.views_count || 0}</span>
                      </p>
                    </div>

                    {/* Etiquetas (Tags) */}
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bruno">Etiquetas / Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tagsArray.length > 0 ? (
                          tagsArray.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-[#12121c] border border-gray-800 text-[10px] rounded-md font-mono text-gray-300">
                              #{t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-500 italic">Sin etiquetas</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* BARRA DE ACCIONES DE LA TARJETA */}
                  <div className="pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#12121c] hover:bg-white/10 text-white rounded-lg text-xs font-bruno border border-gray-800 flex items-center gap-1.5 transition-colors"
                      >
                        <span>🔗</span> Ver en Vivo
                      </a>

                      <button
                        onClick={() => downloadProfileZip(p)}
                        disabled={isZippingId === p.id}
                        className="px-3 py-1.5 bg-[#F97316]/10 hover:bg-[#F97316] text-[#F97316] hover:text-black font-bold rounded-lg text-xs font-bruno border border-[#F97316]/30 transition-all flex items-center gap-1.5"
                      >
                        {isZippingId === p.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span>📦</span>
                        )}
                        <span>Descargar .ZIP</span>
                      </button>

                      <button
                        onClick={() => setEmailModalProfile(p)}
                        className="px-3 py-1.5 bg-[#00E5FF]/10 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black font-bold rounded-lg text-xs font-bruno border border-[#00E5FF]/30 transition-all flex items-center gap-1.5"
                      >
                        <span>✉️</span> Carta de Entrega
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProfile({ ...p })}
                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs font-bruno transition-colors flex items-center gap-1.5"
                      >
                        <span>✏️</span> Editar Completo
                      </button>

                      <button
                        onClick={() => setDeleteModalProfile(p)}
                        className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 text-red-300 font-bold rounded-lg text-xs font-bruno border border-red-900/50 transition-colors flex items-center gap-1"
                      >
                        <span>🗑️</span> Borrar
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DE EDICIÓN INTEGRAL (TODOS LOS CAMPOS DE CREACIÓN DE LA PLATAFORMA) */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c16] border border-[#F97316]/50 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-[0_0_50px_rgba(249,115,22,0.3)] flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Header Modal Edición */}
            <div className="p-4 bg-[#12121c] border-b border-gray-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-[#F97316]">
                <span className="text-xl">✏️</span>
                <div>
                  <h3 className="font-bruno text-sm font-bold text-white">
                    Editando Perfil: {editingProfile.empresa || 'Empresa'} • {editingProfile.nombre} {editingProfile.apellido}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">Slug: /p/{editingProfile.slug}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Formulario con TODOS los campos disponibles */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* SECCIÓN 1: DATOS PERSONALES & EMPRESA */}
              <div className="space-y-3 bg-[#080810] p-4 rounded-xl border border-gray-800">
                <h4 className="font-bruno text-[#F97316] text-xs uppercase flex items-center gap-1.5">
                  <span>🏢</span> Datos Principales & Empresa
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Empresa (Fila 1)</label>
                    <input
                      type="text"
                      value={editingProfile.empresa || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, empresa: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Puesto / Cargo</label>
                    <input
                      type="text"
                      value={editingProfile.puesto || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, puesto: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Nombre</label>
                    <input
                      type="text"
                      value={editingProfile.nombre || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, nombre: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Apellido</label>
                    <input
                      type="text"
                      value={editingProfile.apellido || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, apellido: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Teléfono</label>
                    <input
                      type="tel"
                      value={editingProfile.telefono || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, telefono: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">WhatsApp</label>
                    <input
                      type="tel"
                      value={editingProfile.whatsapp || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, whatsapp: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Correo</label>
                    <input
                      type="email"
                      value={editingProfile.correo || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, correo: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Sitio Web</label>
                  <input
                    type="url"
                    value={editingProfile.url || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, url: e.target.value })}
                    className="input-dark w-full font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Bio / Nota / Propuesta de Valor</label>
                  <textarea
                    value={editingProfile.nota || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, nota: e.target.value })}
                    className="input-dark w-full h-16 py-2"
                  />
                </div>
              </div>

              {/* SECCIÓN 2: REDES SOCIALES & MULTIMEDIA */}
              <div className="space-y-3 bg-[#080810] p-4 rounded-xl border border-gray-800">
                <h4 className="font-bruno text-[#00E5FF] text-xs uppercase flex items-center gap-1.5">
                  <span>🌐</span> Redes Sociales & Video
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Facebook</label>
                    <input
                      type="text"
                      value={editingProfile.facebook || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, facebook: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                      placeholder="usuario o url"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Instagram</label>
                    <input
                      type="text"
                      value={editingProfile.instagram || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, instagram: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                      placeholder="usuario o url"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">LinkedIn</label>
                    <input
                      type="text"
                      value={editingProfile.linkedin || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, linkedin: e.target.value })}
                      className="input-dark w-full font-mono text-xs"
                      placeholder="perfil o url"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Video YouTube</label>
                  <input
                    type="url"
                    value={editingProfile.video_youtube_url || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, video_youtube_url: e.target.value })}
                    className="input-dark w-full font-mono text-xs"
                    placeholder="https://youtu.be/..."
                  />
                </div>
              </div>

              {/* SECCIÓN 3: DIRECCIÓN & MAPS */}
              <div className="space-y-3 bg-[#080810] p-4 rounded-xl border border-gray-800">
                <h4 className="font-bruno text-green-400 text-xs uppercase flex items-center gap-1.5">
                  <span>📍</span> Ubicación & Google Maps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingProfile.calle || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, calle: e.target.value })}
                    placeholder="Calle y Número, Colonia"
                    className="input-dark w-full"
                  />
                  <input
                    type="text"
                    value={editingProfile.ciudad || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, ciudad: e.target.value })}
                    placeholder="Ciudad"
                    className="input-dark w-full"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={editingProfile.estado || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, estado: e.target.value })}
                    placeholder="Estado"
                    className="input-dark w-full"
                  />
                  <input
                    type="text"
                    value={editingProfile.cp || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, cp: e.target.value })}
                    placeholder="CP"
                    className="input-dark w-full"
                  />
                  <input
                    type="text"
                    value={editingProfile.pais || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, pais: e.target.value })}
                    placeholder="País"
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">URL Personalizado de Google Maps (Opcional)</label>
                  <input
                    type="url"
                    value={editingProfile.google_maps_url || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, google_maps_url: e.target.value })}
                    className="input-dark w-full font-mono text-xs"
                    placeholder="Dejar vacío para vincular automáticamente por empresa/ciudad"
                  />
                </div>
              </div>

              {/* SECCIÓN 4: BRANDING, TIPOGRAFÍAS, TEMAS Y ENCUADRES */}
              <div className="space-y-3 bg-[#080810] p-4 rounded-xl border border-gray-800">
                <h4 className="font-bruno text-purple-400 text-xs uppercase flex items-center gap-1.5">
                  <span>🎨</span> Branding, Tipografías & Tema
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tema */}
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Tema Estructural</label>
                    <select
                      value={editingProfile.theme || 'modern'}
                      onChange={(e) => setEditingProfile({ ...editingProfile, theme: e.target.value })}
                      className="input-dark w-full"
                    >
                      <option value="modern" className="bg-[#090914]">Cyber Modern / Dark</option>
                      <option value="classic" className="bg-[#090914]">Clásico Corporativo</option>
                      <option value="minimal" className="bg-[#090914]">Minimalista Ejecutivo</option>
                    </select>
                  </div>

                  {/* Tipografía Primaria */}
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Tipografía Primaria (Nombre & CTA)</label>
                    <select
                      value={editingProfile.font_primary || editingProfile.font_family || 'Inter'}
                      onChange={(e) => setEditingProfile({ ...editingProfile, font_primary: e.target.value })}
                      className="input-dark w-full"
                    >
                      {POPULAR_FONTS.map(f => (
                        <option key={f.value} value={f.value} className="bg-[#090914]">{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipografía Secundaria */}
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Tipografía Secundaria (Cuerpo)</label>
                    <select
                      value={editingProfile.font_secondary || editingProfile.font_family || 'Inter'}
                      onChange={(e) => setEditingProfile({ ...editingProfile, font_secondary: e.target.value })}
                      className="input-dark w-full"
                    >
                      {POPULAR_FONTS.map(f => (
                        <option key={f.value} value={f.value} className="bg-[#090914]">{f.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3 Colores del Cliente */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Color 1 (Primario)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editingProfile.color_primario || '#F97316'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_primario: e.target.value })}
                        className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingProfile.color_primario || '#F97316'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_primario: e.target.value })}
                        className="input-dark w-full font-mono text-[11px] uppercase h-7 px-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Color 2 (Secundario)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editingProfile.color_secundario || '#00E5FF'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_secundario: e.target.value })}
                        className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingProfile.color_secundario || '#00E5FF'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_secundario: e.target.value })}
                        className="input-dark w-full font-mono text-[11px] uppercase h-7 px-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Color 3 (CTA)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editingProfile.color_cta || '#F97316'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_cta: e.target.value })}
                        className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingProfile.color_cta || '#F97316'}
                        onChange={(e) => setEditingProfile({ ...editingProfile, color_cta: e.target.value })}
                        className="input-dark w-full font-mono text-[11px] uppercase h-7 px-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders de Logo y Portada */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Escala Logo: {editingProfile.logo_scale || 100}px</label>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={editingProfile.logo_scale || 100}
                      onChange={(e) => setEditingProfile({ ...editingProfile, logo_scale: parseInt(e.target.value) })}
                      className="w-full accent-[#F97316]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Posición Banner Y: {editingProfile.cover_position_y || 50}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingProfile.cover_position_y || 50}
                      onChange={(e) => setEditingProfile({ ...editingProfile, cover_position_y: parseInt(e.target.value) })}
                      className="w-full accent-[#F97316]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1">Zoom Banner: {editingProfile.cover_zoom || 100}%</label>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      value={editingProfile.cover_zoom || 100}
                      onChange={(e) => setEditingProfile({ ...editingProfile, cover_zoom: parseInt(e.target.value) })}
                      className="w-full accent-[#F97316]"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 5: ETIQUETAS & CONTROL ADMINISTRATIVO */}
              <div className="space-y-3 bg-[#080810] p-4 rounded-xl border border-gray-800">
                <h4 className="font-bruno text-yellow-400 text-xs uppercase flex items-center gap-1.5">
                  <span>🏷️</span> Etiquetas & Estado Administrativo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">
                      Etiquetas / Tags (Separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={editingProfile.tags || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, tags: e.target.value })}
                      placeholder="VIP, Directivo, Ventas, Mexicali"
                      className="input-dark w-full font-mono text-xs"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Facilitará encontrar este perfil entre miles de registros.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bruno text-gray-400 mb-1 uppercase">Estado del Perfil</label>
                    <select
                      value={editingProfile.status || 'active'}
                      onChange={(e) => setEditingProfile({ ...editingProfile, status: e.target.value })}
                      className="input-dark w-full font-bruno font-bold"
                    >
                      <option value="active" className="bg-[#090914] text-orange-400">● Activo</option>
                      <option value="validated" className="bg-[#090914] text-emerald-400">✓ Validado</option>
                      <option value="pending" className="bg-[#090914] text-yellow-400">⏳ Pendiente</option>
                      <option value="archived" className="bg-[#090914] text-gray-400">🛑 Archivado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Modal Edición */}
              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-[#0c0c16] py-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bruno rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-6 py-2 bg-[#F97316] text-black font-bruno font-bold rounded-xl text-xs hover:bg-orange-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  {editSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>GUARDANDO...</span>
                    </>
                  ) : (
                    <span>💾 GUARDAR CAMBIOS EN CLOUD SQL</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL PARA REENVIAR / VER CARTA OFICIAL DE ENTREGA */}
      {emailModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c16] border border-[#00E5FF]/50 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-[0_0_40px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden animate-scaleIn">
            
            <div className="p-4 bg-[#12121c] border-b border-gray-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-[#00E5FF]">
                <span>✉️</span>
                <h3 className="font-bruno text-sm font-bold text-white">
                  Carta Oficial de Entrega: {emailModalProfile.empresa}
                </h3>
              </div>
              <button
                onClick={() => setEmailModalProfile(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-300 font-sans leading-relaxed">
              <div className="p-3 bg-black/60 border border-gray-800 rounded-xl font-mono text-[11px] space-y-1">
                <p><span className="text-[#00E5FF] font-bold">Destinatario:</span> {emailModalProfile.correo || 'correo@cliente.com'}</p>
                <p><span className="text-[#00E5FF] font-bold">Asunto:</span> {generateEmailText(emailModalProfile).subject}</p>
              </div>

              <textarea
                readOnly
                value={generateEmailText(emailModalProfile).body}
                rows={15}
                className="w-full bg-[#06060c] border border-gray-800 p-4 rounded-xl text-xs font-mono text-gray-200 focus:outline-none select-all"
              />
            </div>

            <div className="p-4 bg-[#12121c] border-t border-gray-800 flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateEmailText(emailModalProfile).body);
                  alert('¡Carta de entrega copiada al portapapeles!');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bruno rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> Copiar al Portapapeles
              </button>

              <button
                type="button"
                onClick={() => {
                  const { subject, body } = generateEmailText(emailModalProfile);
                  window.location.href = `mailto:${encodeURIComponent(emailModalProfile.correo || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  setEmailModalProfile(null);
                }}
                className="px-4 py-2 bg-[#00E5FF] text-black text-xs font-bruno font-bold rounded-xl hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                <span>✉️</span> Abrir en Cliente de Correo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c16] border border-red-500/50 w-full max-w-md p-6 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-red-400">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bruno text-sm font-bold text-white">¿Eliminar Perfil Permanentemente?</h3>
                <p className="text-xs text-gray-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-gray-800 rounded-xl text-xs space-y-1">
              <p className="text-white font-bold">{deleteModalProfile.nombre} {deleteModalProfile.apellido}</p>
              <p className="text-[#F97316] font-mono text-[11px]">{deleteModalProfile.empresa}</p>
              <p className="text-gray-500 font-mono text-[10px]">Slug: /p/{deleteModalProfile.slug}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProfile(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bruno rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bruno font-bold rounded-xl text-xs transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Sí, Eliminar de Cloud SQL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
