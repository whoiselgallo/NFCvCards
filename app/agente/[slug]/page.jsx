'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, Gift, Copy, Check, Share2, CreditCard, ExternalLink, 
  Activity, ArrowUpRight, Search, Calendar, ShieldCheck, Trash2, AlertTriangle 
} from 'lucide-react';
import brandConfig from '../../../brand.config';
import AgentInvitationSender from '../../components/AgentInvitationSender';

export default function AgenteTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [agentData, setAgentData] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCard, setDeletingCard] = useState(null); // Tarjeta seleccionada para borrar
  const [deleteReason, setDeleteReason] = useState('inactiva'); // 'inactiva', 'duplicada', 'error', 'otro'
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vc.tsolutionsipidd.com';
  const giftUrl = `${origin}/regalo/${slug}`;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/agents/${slug}`);
      const data = await res.json();
      if (data.success) {
        setAgentData(data.agent);
        setCards(data.cards || []);
      }
    } catch (err) {
      console.error('Error cargando métricas de agente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchStats();
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

  // Función para confirmar y ejecutar la eliminación de la tarjeta
  const confirmDeleteCard = async () => {
    if (!deletingCard) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/agents/${slug}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: deletingCard.id,
          cardSlug: deletingCard.slug,
          reason: deleteReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setDeleteMessage({
          type: 'success',
          text: `Tarjeta de "${deletingCard.nombre || deletingCard.slug}" eliminada exitosamente. ¡Cupo liberado!`
        });
        setDeletingCard(null);
        // Actualizar datos locales
        setCards(prev => prev.filter(c => c.id !== deletingCard.id));
        if (data.stats) {
          setAgentData(prev => ({
            ...prev,
            giftedCount: data.stats.giftedCount,
            remaining: data.stats.remaining
          }));
        } else {
          fetchStats();
        }
      } else {
        alert(`Error al eliminar: ${data.error || 'No se pudo procesar'}`);
      }
    } catch (err) {
      alert(`Error de red al eliminar tarjeta: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setDeleteMessage(null), 6000);
    }
  };

  // Identificar posibles duplicados por nombre o correo
  const nameCounts = {};
  const emailCounts = {};
  cards.forEach(c => {
    const full = `${(c.nombre || '').trim()} ${(c.apellido || '').trim()}`.toLowerCase();
    if (full.length > 2) nameCounts[full] = (nameCounts[full] || 0) + 1;
    if (c.correo) emailCounts[c.correo.toLowerCase()] = (emailCounts[c.correo.toLowerCase()] || 0) + 1;
  });

  const filteredCards = cards.map(c => {
    const full = `${(c.nombre || '').trim()} ${(c.apellido || '').trim()}`.toLowerCase();
    const isDup = (nameCounts[full] > 1) || (c.correo && emailCounts[c.correo.toLowerCase()] > 1);
    const views = parseInt(c.views_count || 0, 10);
    const createdDaysAgo = c.created_at ? (new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24) : 0;
    const isInactive = views === 0 && createdDaysAgo >= 1; // Sin uso tras más de 24 horas

    return {
      ...c,
      isDuplicateCandidate: isDup,
      isInactiveCandidate: isInactive
    };
  }).filter(c => {
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
            <a
              href={`/p/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-[#EE334E] to-[#ff0003] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#EE334E]/20"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Mi Tarjeta en Vivo
            </a>
            <button
              onClick={() => router.push(`/builder?owner=${slug}&vip=${slug}`)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
            >
              <CreditCard className="w-4 h-4 text-[#00E5FF]" />
              Editar Mi Tarjeta
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

        {/* CENTRO DE ENVÍO DE INVITACIONES CON PLANTILLA */}
        <AgentInvitationSender
          agentName={agentData?.name || 'Agente Embajador'}
          agentCompany={agentData?.company || brandConfig.companyName}
          giftUrl={giftUrl}
        />

        {/* MENSAJE DE ÉXITO TRAS ELIMINAR */}
        {deleteMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fadeIn">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {deleteMessage.text}
            </span>
            <button
              onClick={() => setDeleteMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* TABLA DE TARJETAS REGISTRADAS */}
        <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#EE334E]" />
                Invitados que han creado su tarjeta ({cards.length})
              </h3>
              <p className="text-slate-400 text-xs">
                Seguimiento en tiempo real de los prospectos y clientes que activaron su tarjeta con tu enlace. Puedes depurar tarjetas inactivas o duplicadas para liberar cupos.
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
                    <th className="pb-3 px-3">Estado / Uso</th>
                    <th className="pb-3 px-3">Fecha de Creación</th>
                    <th className="pb-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCards.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{c.nombre || ''} {c.apellido || ''}</span>
                          {c.isDuplicateCandidate && (
                            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-mono font-bold flex items-center gap-1" title="Posible tarjeta duplicada">
                              <AlertTriangle className="w-3 h-3" /> Duplicado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-slate-300">
                        {c.empresa || 'Particular'} {c.puesto ? `• ${c.puesto}` : ''}
                      </td>
                      <td className="py-4 px-3 text-slate-400">
                        {c.telefono || c.correo || '—'}
                      </td>
                      <td className="py-4 px-3">
                        {c.isInactiveCandidate ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Sin uso (0 vistas)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {parseInt(c.views_count || 0, 10)} vistas
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-slate-500 font-mono">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Reciente'}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`/p/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-[#EE334E] text-white rounded-lg font-semibold transition-colors"
                            title="Abrir tarjeta digital"
                          >
                            <span>Ver</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingCard(c);
                              if (c.isDuplicateCandidate) setDeleteReason('duplicada');
                              else if (c.isInactiveCandidate) setDeleteReason('inactiva');
                              else setDeleteReason('inactiva');
                            }}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                            title="Eliminar tarjeta y recuperar cupo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DE CONFIRMACIÓN PARA BORRAR TARJETA */}
      {deletingCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0c0c16] border border-red-500/30 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_rgba(238,51,78,0.25)] relative">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              ¿Eliminar esta tarjeta?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Estás a punto de borrar la tarjeta de <strong className="text-white">{deletingCard.nombre} {deletingCard.apellido}</strong> ({deletingCard.empresa || 'Particular'}). Al eliminarla, <strong className="text-emerald-400">recuperarás 1 cupo de regalo</strong> en tu lote de 50 tarjetas.
            </p>

            <div className="mb-5 space-y-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase font-bold">
                Motivo de la baja:
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${deleteReason === 'inactiva' ? 'bg-red-950/40 border-red-500 text-white' : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'}`}>
                  <input
                    type="radio"
                    name="deleteReason"
                    value="inactiva"
                    checked={deleteReason === 'inactiva'}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="accent-red-500"
                  />
                  <span>No la está utilizando / Cero actividad</span>
                </label>

                <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${deleteReason === 'duplicada' ? 'bg-red-950/40 border-red-500 text-white' : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'}`}>
                  <input
                    type="radio"
                    name="deleteReason"
                    value="duplicada"
                    checked={deleteReason === 'duplicada'}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="accent-red-500"
                  />
                  <span>Tarjeta duplicada por el mismo usuario</span>
                </label>

                <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${deleteReason === 'error' ? 'bg-red-950/40 border-red-500 text-white' : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'}`}>
                  <input
                    type="radio"
                    name="deleteReason"
                    value="error"
                    checked={deleteReason === 'error'}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="accent-red-500"
                  />
                  <span>Error en captura de datos / Prueba descartada</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingCard(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteCard}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

