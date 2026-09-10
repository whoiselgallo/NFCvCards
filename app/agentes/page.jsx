'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Gift, Copy, Check, Share2, ExternalLink, Activity, 
  ArrowRight, ShieldCheck, Sparkles, RefreshCw 
} from 'lucide-react';
import brandConfig from '../../brand.config';

export default function AllAgentesDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vc.tsolutionsipidd.com';

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/agents');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error cargando panel de agentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = (slug) => {
    const url = `${origin}/regalo/${slug}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleShareWhatsApp = (agent) => {
    const url = `${origin}/regalo/${agent.slug}`;
    const text = `¡Hola! Te comparto un obsequio especial: una Tarjeta de Presentación Digital Inteligente NFC con todas las funciones desbloqueadas cortesía de ${agent.name} (TSOLUTIONS IPIDD). Puedes crear la tuya aquí: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-4 sm:p-8 md:p-12 font-sans relative overflow-hidden">
      {/* Resplandor decorativo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EE334E]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/30 to-transparent rounded-2xl pointer-events-none" />
              <img src={brandConfig.assets.logo} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EE334E]/20 text-[#EE334E] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                Panel General de Control
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Seguimiento de Agentes Embajadores
              </h1>
              <p className="text-slate-400 text-xs font-mono">
                {brandConfig.companyName} • 200 Tarjetas en Campaña (50 por Agente)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Datos
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-black/40 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-all border border-white/5"
            >
              Inicio
            </button>
          </div>
        </header>

        {/* MÉTRICAS GLOBALES DE LA CAMPAÑA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <span className="text-xs font-mono uppercase text-slate-400">Total Obsequiadas</span>
            <div className="text-4xl font-extrabold text-white mt-2 mb-1">
              {loading ? '...' : (data?.totals?.totalGifted || 0)}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Tarjetas creadas por los invitados
            </p>
          </div>

          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <span className="text-xs font-mono uppercase text-slate-400">Cupos Restantes</span>
            <div className="text-4xl font-extrabold text-green-400 mt-2 mb-1">
              {loading ? '...' : (data?.totals?.totalRemaining || 200)}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Disponibles para obsequiar del total (200)
            </p>
          </div>

          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <span className="text-xs font-mono uppercase text-slate-400">Agentes Activos</span>
            <div className="text-4xl font-extrabold text-[#00E5FF] mt-2 mb-1">
              4 Embajadores
            </div>
            <p className="text-xs text-slate-500 font-mono">
              50 tarjetas asignadas a cada uno
            </p>
          </div>
        </div>

        {/* TARJETAS INDIVIDUALES DE CADA AGENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.agents || [
            { slug: 'ariel-higera', name: 'Ariel Higera', giftQuota: 50, giftedCount: 0, remaining: 50, percent: 0 },
            { slug: 'michelle-hernandez', name: 'Michelle Hernandez', giftQuota: 50, giftedCount: 0, remaining: 50, percent: 0 },
            { slug: 'fatima-itxel-hernandez', name: 'Fatima Itxel Hernandez', giftQuota: 50, giftedCount: 0, remaining: 50, percent: 0 },
            { slug: 'osclari-marlene', name: 'Osclari Marlene', giftQuota: 50, giftedCount: 0, remaining: 50, percent: 0 }
          ]).map((ag) => (
            <div
              key={ag.slug}
              className="bg-[#0A0A10]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl hover:border-[#EE334E]/50 transition-all flex flex-col justify-between relative overflow-hidden group shadow-xl"
            >
              <div>
                {/* Header del Agente */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE334E] font-bold">
                      Agente Embajador
                    </span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#EE334E] transition-colors">
                      {ag.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Cuota: {ag.giftQuota} tarjetas
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                    {ag.remaining} disponibles
                  </span>
                </div>

                {/* Métricas del Agente */}
                <div className="grid grid-cols-2 gap-4 my-5 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Obsequiadas</span>
                    <p className="text-2xl font-extrabold text-white">{ag.giftedCount} / {ag.giftQuota}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Progreso</span>
                    <p className="text-2xl font-extrabold text-[#00E5FF]">{ag.percent}%</p>
                  </div>
                  <div className="col-span-2">
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#EE334E] to-[#00E5FF] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, ag.percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Enlace de Regalo del Agente */}
                <div className="mb-6">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
                    Enlace de Obsequio para Invitados:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${origin}/regalo/${ag.slug}`}
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-slate-300 truncate select-all focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(ag.slug)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-[#EE334E] text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                    >
                      {copiedSlug === ag.slug ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSlug === ag.slug ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(ag)}
                      className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-all shrink-0"
                      title="Compartir por WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón para ver el panel individual */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => router.push(`/agente/${ag.slug}`)}
                  className="w-full py-3 bg-white/10 hover:bg-[#EE334E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Abrir Panel de {ag.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
