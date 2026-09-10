'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, Gift, Copy, Check, Share2, CreditCard, ExternalLink, 
  Activity, ArrowUpRight, Search, Calendar, ShieldCheck 
} from 'lucide-react';
import brandConfig from '../../../brand.config';

export default function AgenteTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [agentData, setAgentData] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vc.tsolutionsipidd.com';
  const giftUrl = `${origin}/regalo/${slug}`;

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch(`/api/agents/${slug}`);
        const data = await res.json();
        if (data.success && isMounted) {
          setAgentData(data.agent);
          setCards(data.cards || []);
        }
      } catch (err) {
        console.error('Error cargando métricas de agente:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, [slug]);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Hola! Te comparto un obsequio especial: una Tarjeta de Presentación Digital Inteligente NFC con todas las funciones desbloqueadas cortesía de ${agentData?.name || 'TSOLUTIONS IPIDD'}. Puedes crear la tuya aquí: ${giftUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredCards = cards.filter(c => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.nombre || ''} ${c.apellido || ''}`.toLowerCase();
    const empresa = (c.empresa || '').toLowerCase();
    const correo = (c.correo || '').toLowerCase();
    return fullName.includes(term) || empresa.includes(term) || correo.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-4 sm:p-8 md:p-12 font-sans relative overflow-hidden">
      {/* Resplandor decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EE334E]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/30 to-transparent rounded-2xl pointer-events-none" />
              <img src={brandConfig.assets.logo} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EE334E]/20 text-[#EE334E] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                Panel de Agente Embajador
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {agentData ? agentData.name : 'Cargando Agente...'}
              </h1>
              <p className="text-slate-400 text-xs font-mono">
                {brandConfig.companyName} • Cuota de Obsequio: 50 Tarjetas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => router.push(`/builder?owner=${slug}&vip=${slug}`)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
            >
              <CreditCard className="w-4 h-4 text-[#00E5FF]" />
              Crear / Editar Mi Tarjeta Personal
            </button>
            <button
              onClick={() => router.push('/agentes')}
              className="px-4 py-2.5 bg-black/40 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-all border border-white/5"
            >
              Ver Todos los Agentes
            </button>
          </div>
        </header>

        {/* TARJETA DE ENLACE DE REGALO PARA COMPARTIR */}
        <div className="bg-[#0A0A10]/90 backdrop-blur-xl border border-[#EE334E]/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_0_30px_rgba(238,51,78,0.15)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-[#EE334E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4" /> Tu Enlace Personalizado de Obsequio
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Invita a tus prospectos y contactos
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Cualquier persona que entre por este enlace podrá crear su tarjeta digital gratis con las funciones completas desbloqueadas bajo tu cuota asignada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-slate-300 truncate max-w-xs select-all">
                {giftUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-5 py-3 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* MÉTRICAS DE SEGUIMIENTO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Obsequiadas */}
          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-slate-400">Tarjetas Obsequiadas</span>
              <div className="w-8 h-8 rounded-xl bg-[#EE334E]/20 text-[#EE334E] flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">
              {loading ? '...' : (agentData?.giftedCount || 0)}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Registradas por tus invitados
            </p>
          </div>

          {/* Disponibles */}
          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-slate-400">Cupos Disponibles</span>
              <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-green-400 mb-1">
              {loading ? '...' : (agentData?.remaining || 0)}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Restantes de tu lote de 50
            </p>
          </div>

          {/* Porcentaje de entrega */}
          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-slate-400">Progreso de Entrega</span>
              <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-[#00E5FF] mb-2">
              {loading ? '...' : `${Math.round(((agentData?.giftedCount || 0) / (agentData?.giftQuota || 50)) * 100)}%`}
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#EE334E] to-[#00E5FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((agentData?.giftedCount || 0) / (agentData?.giftQuota || 50)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* TABLA DE TARJETAS REGISTRADAS */}
        <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#EE334E]" />
                Invitados que han creado su tarjeta ({cards.length})
              </h3>
              <p className="text-slate-400 text-xs">
                Seguimiento en tiempo real de los prospectos y clientes que activaron su tarjeta con tu enlace.
              </p>
            </div>

            {/* BUSCADOR */}
            {cards.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E]"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              Cargando tarjetas obsequiadas...
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 p-8">
              <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Aún no has entregado tarjetas</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Comparte tu enlace personal por WhatsApp o correo para que tus invitados comiencen a crear sus tarjetas.
              </p>
              <button
                onClick={handleCopy}
                className="px-5 py-2.5 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl text-xs font-bold transition-all"
              >
                Copiar Mi Enlace de Obsequio
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase font-mono">
                    <th className="pb-3 px-3">Titular</th>
                    <th className="pb-3 px-3">Empresa / Puesto</th>
                    <th className="pb-3 px-3">Contacto</th>
                    <th className="pb-3 px-3">Fecha de Creación</th>
                    <th className="pb-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCards.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-white">
                        {c.nombre || ''} {c.apellido || ''}
                      </td>
                      <td className="py-4 px-3 text-slate-300">
                        {c.empresa || 'Particular'} {c.puesto ? `• ${c.puesto}` : ''}
                      </td>
                      <td className="py-4 px-3 text-slate-400">
                        {c.telefono || c.correo || '—'}
                      </td>
                      <td className="py-4 px-3 text-slate-500 font-mono">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Reciente'}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <a
                          href={`/p/${c.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-[#EE334E] text-white rounded-lg font-semibold transition-colors"
                        >
                          <span>Ver Tarjeta</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
