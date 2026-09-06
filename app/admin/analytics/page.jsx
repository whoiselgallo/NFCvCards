'use client';

import React, { useState, useEffect } from 'react';
import brandConfig from '../../../brand.config';

export default function CentralizedAnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000); // Refresco automático cada 15 seg
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'No se pudo cargar la analítica');
      }
    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060509] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#FF2A54] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bruno text-sm text-gray-400">Cargando Métricas y KPIs Centralizados...</p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const clicks = data?.clicks || {};
  const topProfiles = data?.topProfiles || [];
  const recentEvents = data?.recentEvents || [];
  const devices = data?.devices || [];

  return (
    <div className="min-h-screen bg-[#060509] text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* HEADER ANALYTICS */}
      <header className="max-w-[1920px] mx-auto w-full mb-8 pb-6 border-b border-rose-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              DASHBOARD DE <span className="text-[#FF2A54] drop-shadow-[0_0_12px_rgba(255,42,84,0.6)]">ANALÍTICA CENTRALIZADA</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Monitor en tiempo real de conversión, efectividad y KPIs de interacción en tarjetas NFC & vCards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            className="px-3.5 py-2 rounded-xl text-xs font-bruno bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-800 transition-colors flex items-center gap-1.5"
          >
            <span>🔄</span> Actualizar Datos
          </button>
          <a
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs font-bruno bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 transition-colors"
          >
            ← Volver a Gestión
          </a>
        </div>
      </header>

      {/* KPI CARDS MAESTRAS */}
      <section className="max-w-[1920px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KPI 1: TASA DE CONVERSIÓN GLOBAL */}
        <div className="p-5 rounded-2xl bg-[#0F0B15] border border-rose-500/30 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bruno uppercase text-gray-400 tracking-wider">Tasa de Conversión Global</span>
            <span className="text-xl">🎯</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bruno font-bold text-[#FF2A54]">
            {summary.conversionRate}%
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Visitantes que ejecutaron al menos una acción directa en la tarjeta.
          </p>
        </div>

        {/* KPI 2: GUARDADOS EN AGENDA (VCF RATE) */}
        <div className="p-5 rounded-2xl bg-[#0F0B15] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bruno uppercase text-gray-400 tracking-wider">Guardado en Contactos</span>
            <span className="text-xl">💾</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bruno font-bold text-[#00F0FF]">
            {clicks.total_vcf} <span className="text-sm font-normal text-gray-400">({summary.vcfSaveRate}%)</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Descargas exitosas de vCard directo a la agenda de iOS/Android.
          </p>
        </div>

        {/* KPI 3: TOTAL DE VISUALIZACIONES */}
        <div className="p-5 rounded-2xl bg-[#0F0B15] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bruno uppercase text-gray-400 tracking-wider">Impactos / Visualizaciones</span>
            <span className="text-xl">👁️</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bruno font-bold text-purple-300">
            {summary.total_views}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Lecturas acumuladas vía NFC y escaneos de código QR físico.
          </p>
        </div>

        {/* KPI 4: ENGAGEMENTS TOTALES */}
        <div className="p-5 rounded-2xl bg-[#0F0B15] border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bruno uppercase text-gray-400 tracking-wider">Interacciones Totales</span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bruno font-bold text-emerald-400">
            {summary.totalInteractions}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Clics en WhatsApp, Llamadas, Agenda, Maps y Redes.
          </p>
        </div>

      </section>

      {/* DESGLOSE DE ACCIONES DE CONVERSIÓN */}
      <section className="max-w-[1920px] mx-auto w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
        {[
          { label: 'WhatsApp', value: clicks.total_whatsapp, icon: '💬', color: '#25D366' },
          { label: 'Llamadas Directas', value: clicks.total_calls, icon: '📞', color: '#38BDF8' },
          { label: 'Google Maps', value: clicks.total_maps, icon: '📍', color: '#FBBF24' },
          { label: 'Google Calendar / Citas', value: clicks.total_calendar, icon: '📅', color: '#A855F7' },
          { label: 'Redes Sociales', value: clicks.total_social, icon: '🌐', color: '#E11D48' },
          { label: 'Enlaces Personalizados', value: clicks.total_custom, icon: '🔗', color: '#00F0FF' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-gray-800 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xl font-bold font-bruno text-white">{item.value}</span>
            <span className="text-[10px] text-gray-400 uppercase font-mono mt-0.5">{item.label}</span>
          </div>
        ))}
      </section>

      {/* TABLA DE TOP PERFILES Y ACTIVIDAD EN VIVO */}
      <section className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA 1: TOP PERFILES MÁS EXITOSOS (8 COLUMNAS) */}
        <div className="lg:col-span-8 panel-glass p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bruno text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏆</span> Ranking de Perfiles con Mayor Rendimiento
            </h3>
            <span className="text-[11px] font-mono text-gray-400">Top 10 Activos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase text-[10px] font-bruno border-b border-gray-800/60 pb-2">
                  <th className="py-2.5 px-3">Titular / Empresa</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3 text-center">Vistas</th>
                  <th className="py-2.5 px-3 text-center">vCard</th>
                  <th className="py-2.5 px-3 text-center">WhatsApp</th>
                  <th className="py-2.5 px-3 text-center">Citas</th>
                  <th className="py-2.5 px-3 text-right">Efectividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {topProfiles.map((p, idx) => {
                  const eff = p.views_count > 0 ? ((p.total_engagements / p.views_count) * 100).toFixed(0) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{p.nombre} {p.apellido}</div>
                        <div className="text-[10px] text-gray-400">{p.empresa || 'Independiente'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          p.plan_tier === 'elite' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' :
                          p.plan_tier === 'business' ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/30' :
                          p.plan_tier === 'pro' ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {p.plan_tier || 'Free'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-white">{p.views_count}</td>
                      <td className="py-3 px-3 text-center font-mono text-[#00F0FF]">{p.vcf_downloads}</td>
                      <td className="py-3 px-3 text-center font-mono text-[#25D366]">{p.whatsapp_clicks}</td>
                      <td className="py-3 px-3 text-center font-mono text-purple-300">{p.calendar_clicks}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#FF2A54]">{eff}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA 2: ACTIVIDAD RECIENTE EN VIVO (4 COLUMNAS) */}
        <div className="lg:col-span-4 panel-glass p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bruno text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Eventos en Tiempo Real</span>
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {recentEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-xl bg-black/40 border border-gray-800 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>
                      {e.event_type === 'vcf_download' ? '💾' :
                       e.event_type === 'whatsapp_click' ? '💬' :
                       e.event_type === 'call_click' ? '📞' :
                       e.event_type === 'calendar_click' ? '📅' :
                       e.event_type === 'maps_click' ? '📍' : '⚡'}
                    </span>
                    <span>{e.event_type.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    /p/{e.profile_slug}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                    {e.device_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
