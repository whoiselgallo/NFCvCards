'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, MessageSquare, 
  Activity, Truck, Search, RefreshCw, Star, 
  Smartphone, Share2, ExternalLink, Mail, Phone, MapPin, 
  Calendar, Download, CheckCircle2, Award, DollarSign, 
  TrendingUp, BarChart3, AlertCircle, ArrowUpRight, Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } else {
        setError(json.error || 'Error al cargar analítica');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000); // Refresco automático cada 30 segundos
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const summary = data?.summary || {
    total_profiles: 0,
    total_views: 0,
    total_companies: 0,
    elite_profiles: 0,
    business_profiles: 0,
    pro_profiles: 0,
    free_profiles: 0,
    totalUsers: 0,
    totalInteractions: 0,
    conversionRate: '0.0',
    vcfSaveRate: '0.0',
    totalRevenue: 0,
    mrr: 0,
    pendingHardwareCount: 0,
    totalOrdersCount: 0
  };

  const clicks = data?.clicks || {
    total_vcf: 0,
    total_whatsapp: 0,
    total_calls: 0,
    total_maps: 0,
    total_calendar: 0,
    total_social: 0,
    total_custom: 0
  };

  const leads = data?.leads || [];
  const orders = data?.orders || [];
  const topProfiles = data?.topProfiles || [];
  const feedback = data?.feedback || { list: [], avgRating: '5.0', npsScore: 100, total: 0 };
  const agents = data?.agents || [];
  const devices = data?.devices || [];
  const recentEvents = data?.recentEvents || [];

  // Filtrado general de leads
  const filteredLeads = leads.filter(l => {
    const term = searchTerm.toLowerCase();
    return (
      (l.nombre && l.nombre.toLowerCase().includes(term)) ||
      (l.apellido && l.apellido.toLowerCase().includes(term)) ||
      (l.empresa && l.empresa.toLowerCase().includes(term)) ||
      (l.correo && l.correo.toLowerCase().includes(term)) ||
      (l.telefono && l.telefono.toLowerCase().includes(term)) ||
      (l.slug && l.slug.toLowerCase().includes(term)) ||
      (l.referred_by && l.referred_by.toLowerCase().includes(term))
    );
  });

  // Exportar CRM a CSV
  const handleExportCSV = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Nombre', 'Apellido', 'Empresa', 'Puesto', 'Telefono', 'WhatsApp', 'Correo', 'Plan', 'Vistas', 'Interacciones', 'Embajador', 'Slug', 'Fecha'];
    const rows = leads.map(l => [
      l.id,
      `"${l.nombre || ''}"`,
      `"${l.apellido || ''}"`,
      `"${l.empresa || ''}"`,
      `"${l.puesto || ''}"`,
      `"${l.telefono || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.correo || ''}"`,
      `"${l.plan_tier || 'elite'}"`,
      l.views_count || 0,
      l.total_engagements || 0,
      `"${l.referred_by || 'Directo'}"`,
      `"${l.slug}"`,
      `"${l.created_at}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tsolutions_crm_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030308] text-slate-300 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a10] border-r border-white/5 flex flex-col hidden lg:flex shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight">
            <div className="w-9 h-9 bg-gradient-to-br from-[#EE334E] to-[#ff0003] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(238,51,78,0.4)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>TSolutions</span>
              <span className="text-[10px] block font-mono text-[#EE334E] uppercase tracking-widest font-semibold">Mission Control</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'overview' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <LayoutDashboard className={'w-4 h-4 ' + (activeTab === 'overview' ? 'text-[#EE334E]' : '')} /> Resumen & KPIs
          </button>

          <button 
            onClick={() => setActiveTab('leads')} 
            className={'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'leads' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <div className="flex items-center gap-3">
              <Users className={'w-4 h-4 ' + (activeTab === 'leads' ? 'text-[#EE334E]' : '')} /> Leads & CRM
            </div>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white">{leads.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')} 
            className={'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'orders' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={'w-4 h-4 ' + (activeTab === 'orders' ? 'text-[#EE334E]' : '')} /> Pedidos & Ingresos
            </div>
            {summary.pendingHardwareCount > 0 && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">{summary.pendingHardwareCount}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('feedback')} 
            className={'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'feedback' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={'w-4 h-4 ' + (activeTab === 'feedback' ? 'text-[#EE334E]' : '')} /> Feedback & NPS
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">⭐ {feedback.avgRating}</span>
          </button>

          <button 
            onClick={() => setActiveTab('telemetry')} 
            className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'telemetry' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <Activity className={'w-4 h-4 ' + (activeTab === 'telemetry' ? 'text-[#EE334E]' : '')} /> Telemetría en Vivo
          </button>

          <button 
            onClick={() => setActiveTab('agents')} 
            className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (activeTab === 'agents' ? 'bg-[#EE334E]/15 text-white border border-[#EE334E]/30 font-semibold shadow-lg shadow-[#EE334E]/10' : 'hover:bg-white/5 text-slate-400')}
          >
            <Award className={'w-4 h-4 ' + (activeTab === 'agents' ? 'text-[#EE334E]' : '')} /> Red de Embajadores
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Base de Datos
            </span>
            <span className="font-mono text-[11px] text-slate-500">Cloud SQL</span>
          </div>
          {lastUpdated && (
            <p className="text-[10px] text-slate-500 font-mono">Actualizado: {lastUpdated}</p>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a10]/70 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex lg:hidden w-8 h-8 bg-[#EE334E] rounded-lg items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Panel Central de Operaciones
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">LIVE TELEMETRY</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Control integral de tarjetas digitales, métricas de impacto, prospectos e ingresos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchAnalytics()}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (loading ? 'animate-spin text-[#EE334E]' : 'text-slate-300')} />
              <span className="hidden sm:inline">Refrescar</span>
            </button>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EE334E] hover:bg-[#ff0003] text-white text-xs font-bold shadow-lg shadow-[#EE334E]/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CRM</span>
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION PILLS */}
        <div className="flex lg:hidden overflow-x-auto gap-2 p-3 bg-[#0a0a10] border-b border-white/5 shrink-0">
          {['overview', 'leads', 'orders', 'feedback', 'telemetry', 'agents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={'px-3 py-1.5 rounded-lg text-xs font-medium uppercase whitespace-nowrap ' + (activeTab === tab ? 'bg-[#EE334E] text-white' : 'bg-white/5 text-slate-400')}
            >
              {tab === 'overview' ? 'Resumen' : tab === 'leads' ? 'Leads' : tab === 'orders' ? 'Pedidos' : tab === 'feedback' ? 'Feedback' : tab === 'telemetry' ? 'Telemetría' : 'Agentes'}
            </button>
          ))}
        </div>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SCROLLABLE VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* ===================== TAB: OVERVIEW ===================== */}
          {activeTab === 'overview' && (
            <>
              {/* 4 GRANDES KPIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* KPI 1: INGRESOS */}
                <div className="bg-[#0a0a10] border border-white/5 hover:border-emerald-500/30 transition-all rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                      MRR ${summary.mrr.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                    ${summary.totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MXN</span>
                  </h3>
                  <p className="text-xs text-slate-400">Ingresos Totales Registrados ({summary.totalOrdersCount} órdenes)</p>
                </div>

                {/* KPI 2: PERFILES & LEADS */}
                <div className="bg-[#0a0a10] border border-white/5 hover:border-blue-500/30 transition-all rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                      {summary.elite_profiles} Elite
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                    {summary.total_profiles.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-400">Tarjetas Activas en Red ({summary.total_companies} empresas)</p>
                </div>

                {/* KPI 3: VISTAS & IMPACTO */}
                <div className="bg-[#0a0a10] border border-white/5 hover:border-purple-500/30 transition-all rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">
                      Scans NFC & QR
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                    {summary.total_views.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-400">Impactos & Visualizaciones Totales</p>
                </div>

                {/* KPI 4: CONVERSIÓN & INTERACCIONES */}
                <div className="bg-[#0a0a10] border border-white/5 hover:border-[#EE334E]/30 transition-all rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EE334E]/5 rounded-full blur-2xl group-hover:bg-[#EE334E]/10 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-[#EE334E]/10 border border-[#EE334E]/20 flex items-center justify-center text-[#EE334E]">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EE334E]/10 text-[#EE334E] font-bold">
                      {summary.conversionRate}% Conv.
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                    {summary.totalInteractions.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-400">Acciones de Negocio Realizadas ({summary.vcfSaveRate}% vCard Save)</p>
                </div>

              </div>

              {/* DESGLOSE DE INTERACCIONES REALES */}
              <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#EE334E]" /> Embudo de Conversión & Puntos de Contacto
                    </h3>
                    <p className="text-xs text-slate-400">Distribución de clics e interacciones de alto valor comercial de todos los perfiles</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    Total: {summary.totalInteractions} eventos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                      <Download className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_vcf}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Guardar vCard</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_whatsapp}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">WhatsApp</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_calls}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Llamadas</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_maps}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Google Maps</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_calendar}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Citas / Agenda</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_social}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Redes Sociales</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-white">{clicks.total_custom}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Enlaces Web/PDF</p>
                  </div>
                </div>
              </div>

              {/* GRID: TOP PERFILES Y DISTRIBUCION DE PAQUETES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* TOP PERFILES RANKING */}
                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" /> Tarjetas con Mayor Impacto y Conversión
                      </h3>
                      <p className="text-xs text-slate-400">Ranking en tiempo real de perfiles más consultados</p>
                    </div>
                    <button onClick={() => setActiveTab('leads')} className="text-xs text-[#EE334E] hover:underline font-semibold">
                      Ver todas ({leads.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-[11px] text-slate-500 uppercase font-mono">
                          <th className="pb-3 font-semibold">Titular / Empresa</th>
                          <th className="pb-3 font-semibold text-center">Plan</th>
                          <th className="pb-3 font-semibold text-center">Vistas</th>
                          <th className="pb-3 font-semibold text-center">vCards</th>
                          <th className="pb-3 font-semibold text-center">WhatsApp</th>
                          <th className="pb-3 font-semibold text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {topProfiles.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{p.nombre} {p.apellido}</p>
                                  <p className="text-xs text-slate-400">{p.empresa || 'Independiente'} {p.puesto ? `• ${p.puesto}` : ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {p.plan_tier || 'elite'}
                              </span>
                            </td>
                            <td className="py-3.5 text-center font-mono font-bold text-white">
                              {p.views_count}
                            </td>
                            <td className="py-3.5 text-center font-mono text-emerald-400 font-bold">
                              {p.vcf_downloads}
                            </td>
                            <td className="py-3.5 text-center font-mono text-green-400 font-bold">
                              {p.whatsapp_clicks}
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a 
                                  href={`/p/${p.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                  title="Ver vCard pública"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a 
                                  href={`/portal?slug=${p.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-[#EE334E]/10 hover:bg-[#EE334E]/20 text-[#EE334E] transition-colors"
                                  title="Portal de Gestión"
                                >
                                  <SettingsIcon className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* DISTRIBUCION DE PRODUCTOS & SERVICIOS */}
                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#EE334E]" /> Distribución de Membresías
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-white font-medium flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                          Plan Elite Total ($1,499 MXN)
                        </span>
                        <span className="text-white font-mono font-bold">{summary.elite_profiles}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${summary.total_profiles > 0 ? (summary.elite_profiles / summary.total_profiles) * 100 : 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          Plan Corporativo Business
                        </span>
                        <span className="text-white font-mono font-bold">{summary.business_profiles}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${summary.total_profiles > 0 ? (summary.business_profiles / summary.total_profiles) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          Paquete All-in-One ($199 MXN)
                        </span>
                        <span className="text-white font-mono font-bold">{summary.pro_profiles}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${summary.total_profiles > 0 ? (summary.pro_profiles / summary.total_profiles) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Hardware Físico NFC</p>
                          <p className="text-sm font-bold text-white">Tarjetas & Stickers</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 font-bold">
                          {summary.pendingHardwareCount} Pendientes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ===================== TAB: LEADS & CRM ===================== */}
          {activeTab === 'leads' && (
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#EE334E]" /> Directorio Central de Prospectos & Clientes (CRM)
                  </h3>
                  <p className="text-xs text-slate-400">Base de datos de todos los contactos registrados en la plataforma</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, empresa, email, teléfono..." 
                      className="bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#EE334E] w-72"
                    />
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
                      <th className="pb-3 font-semibold">Cliente / Titular</th>
                      <th className="pb-3 font-semibold">Empresa / Cargo</th>
                      <th className="pb-3 font-semibold">Contacto Directo</th>
                      <th className="pb-3 font-semibold text-center">Plan</th>
                      <th className="pb-3 font-semibold text-center">Vistas / Clics</th>
                      <th className="pb-3 font-semibold">Embajador</th>
                      <th className="pb-3 font-semibold text-right">Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-500 text-sm">
                          No se encontraron contactos con el término de búsqueda "{searchTerm}"
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const cleanPhone = lead.whatsapp || lead.telefono || '';
                        const waNumber = cleanPhone.replace(/\D/g, '');
                        return (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">
                              <p className="font-bold text-white">{lead.nombre} {lead.apellido}</p>
                              <span className="text-[11px] text-slate-500 font-mono">/p/{lead.slug}</span>
                            </td>
                            <td className="py-4">
                              <p className="text-slate-300 font-medium">{lead.empresa || 'Independiente'}</p>
                              <p className="text-xs text-slate-500">{lead.puesto || 'Contacto Comercial'}</p>
                            </td>
                            <td className="py-4">
                              <div className="space-y-1">
                                {lead.correo && (
                                  <a href={`mailto:${lead.correo}`} className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
                                    <Mail className="w-3 h-3 text-slate-500" /> {lead.correo}
                                  </a>
                                )}
                                {cleanPhone && (
                                  <a href={`tel:${cleanPhone}`} className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
                                    <Phone className="w-3 h-3 text-slate-500" /> {cleanPhone}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {lead.plan_tier || 'elite'}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <p className="font-mono font-bold text-white">{lead.views_count || 0}</p>
                              <p className="text-[10px] text-emerald-400 font-mono">{lead.total_engagements || 0} clics</p>
                            </td>
                            <td className="py-4">
                              <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 font-mono text-slate-300">
                                {lead.referred_by || 'Orgánico'}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {waNumber && (
                                  <a 
                                    href={`https://wa.me/${waNumber}?text=Hola%20${encodeURIComponent(lead.nombre || '')},%20te%20contactamos%20de%20TSolutions`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                                    title="WhatsApp directo"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <a 
                                  href={`/p/${lead.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                  title="Abrir vCard pública"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a 
                                  href={`/portal?slug=${lead.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#EE334E]/10 hover:bg-[#EE334E]/20 text-[#EE334E] transition-colors"
                                  title="Abrir portal de cliente"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB: ORDERS & REVENUE ===================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">Volumen Total Facturado</p>
                  <h3 className="text-3xl font-black text-white">${summary.totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span></h3>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> 100% Pagos confirmados</p>
                </div>

                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">Hardware & Entregables Físicos</p>
                  <h3 className="text-3xl font-black text-white">{summary.pendingHardwareCount} <span className="text-xs font-normal text-slate-400">en preparación</span></h3>
                  <p className="text-xs text-amber-400 mt-2 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Logística de envío</p>
                </div>

                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">Suscripciones Recurrentes (MRR)</p>
                  <h3 className="text-3xl font-black text-white">${summary.mrr.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN/mes</span></h3>
                  <p className="text-xs text-purple-400 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Renovaciones automáticas</p>
                </div>
              </div>

              <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#EE334E]" /> Registro de Pedidos & Folios
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm">Las compras realizadas vía Stripe y transferencias se reflejan automáticamente aquí.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-[11px] text-slate-500 uppercase font-mono">
                          <th className="pb-3 font-semibold">Folio</th>
                          <th className="pb-3 font-semibold">Cliente</th>
                          <th className="pb-3 font-semibold">Producto / Servicio</th>
                          <th className="pb-3 font-semibold">Monto</th>
                          <th className="pb-3 font-semibold text-center">Estado</th>
                          <th className="pb-3 font-semibold text-right">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 font-mono text-xs text-slate-300">{o.order_number}</td>
                            <td className="py-3.5 font-bold text-white">{o.client_name || o.client_email}</td>
                            <td className="py-3.5 text-slate-300">{o.product_name}</td>
                            <td className="py-3.5 font-mono font-bold text-white">${Number(o.amount).toLocaleString()} {o.currency}</td>
                            <td className="py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-mono text-xs text-slate-500">
                              {new Date(o.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB: FEEDBACK & NPS ===================== */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">Satisfacción Promedio</p>
                  <h3 className="text-3xl font-black text-amber-400 flex items-center gap-2">
                    ⭐ {feedback.avgRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">Basado en {feedback.total} evaluaciones</p>
                </div>

                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">NPS (Net Promoter Score)</p>
                  <h3 className="text-3xl font-black text-emerald-400">+{feedback.npsScore}</h3>
                  <p className="text-xs text-slate-400 mt-2">Índice de recomendación neta</p>
                </div>

                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 mb-1">Encuestas de Calidad</p>
                  <h3 className="text-3xl font-black text-white">{feedback.total}</h3>
                  <p className="text-xs text-slate-400 mt-2">Construcción y experiencia 10 usos</p>
                </div>
              </div>

              <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#EE334E]" /> Encuestas Recibidas & Puntos de Fricción
                </h3>

                {feedback.list.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm">Aún no se han registrado encuestas de retroalimentación.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedback.list.map((f) => (
                      <div key={f.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {f.feedback_type === 'construction' ? 'Construcción' : 'Experiencia de Uso'}
                            </span>
                            <p className="text-xs font-mono text-slate-400 mt-1">/p/{f.profile_slug}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={'w-3.5 h-3.5 ' + (star <= (f.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-700')} />
                            ))}
                          </div>
                        </div>

                        {f.issues_reported && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                            <strong>Dificultad reportada:</strong> {f.issues_reported}
                          </div>
                        )}

                        {f.recommendations && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                            <strong>Sugerencia / Recomendación:</strong> {f.recommendations}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-white/5">
                          <span>{f.client_email || 'Anónimo'}</span>
                          <span>{new Date(f.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB: TELEMETRY & DEVICES ===================== */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6 md:col-span-1">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#EE334E]" /> Distribución por Dispositivo
                  </h3>
                  <div className="space-y-4">
                    {devices.length === 0 ? (
                      <p className="text-xs text-slate-500">Esperando primeras conexiones...</p>
                    ) : (
                      devices.map((d, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-white capitalize font-medium">{d.device_type}</span>
                            <span className="text-white font-mono font-bold">{d.count} eventos</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className="bg-[#EE334E] h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#EE334E]" /> Feed de Interacciones en Tiempo Real
                  </h3>

                  <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-2">
                    {recentEvents.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">Sin actividad reciente registrada.</p>
                    ) : (
                      recentEvents.map((ev) => (
                        <div key={ev.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <div>
                              <p className="text-white font-bold">
                                {ev.nombre ? `${ev.nombre} ${ev.apellido || ''}` : ev.profile_slug}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Evento: <strong className="text-slate-300">{ev.event_type}</strong> • Dispositivo: {ev.device_type}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(ev.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: AGENTS & AMBASSADORS ===================== */}
          {activeTab === 'agents' && (
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#EE334E]" /> Rendimiento de la Red de Embajadores & Agentes
                  </h3>
                  <p className="text-xs text-slate-400">Métricas de conversión y generación de tarjetas por código de referido</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[11px] text-slate-500 uppercase font-mono">
                      <th className="pb-3 font-semibold">Agente / Código de Afiliado</th>
                      <th className="pb-3 font-semibold text-center">Tarjetas Creadas</th>
                      <th className="pb-3 font-semibold text-center">Vistas Totales</th>
                      <th className="pb-3 font-semibold text-center">Interacciones Generadas</th>
                      <th className="pb-3 font-semibold text-right">Tasa de Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {agents.map((ag, i) => {
                      const conv = ag.total_views > 0 
                        ? ((ag.total_interactions / ag.total_views) * 100).toFixed(1) 
                        : '0.0';
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-xs text-purple-400">
                                #{i + 1}
                              </div>
                              <span className="font-bold text-white">{ag.agent_name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-center font-mono font-bold text-white">{ag.total_cards}</td>
                          <td className="py-4 text-center font-mono text-slate-300">{ag.total_views}</td>
                          <td className="py-4 text-center font-mono text-emerald-400 font-bold">{ag.total_interactions}</td>
                          <td className="py-4 text-right font-mono font-bold text-[#EE334E]">{conv}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function SettingsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}