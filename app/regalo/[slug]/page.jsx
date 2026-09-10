'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Gift, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import brandConfig from '../../../brand.config';

export default function RegaloPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    async function loadAgent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/agents/${slug}`);
        const data = await res.json();
        if (!data.success || !data.agent) {
          if (isMounted) setError(data.error || 'Enlace de regalo inválido o agente no encontrado.');
        } else {
          if (isMounted) setAgent(data.agent);
        }
      } catch (err) {
        if (isMounted) setError('Error al cargar la información del regalo.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAgent();
    return () => { isMounted = false; };
  }, [slug]);

  const handleStartBuilder = () => {
    router.push(`/builder?ref=${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Resplandor Cyber Rose */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#EE334E]/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-xl relative z-10">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/30 to-transparent rounded-2xl pointer-events-none" />
            <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-xs font-mono tracking-widest text-[#EE334E] uppercase font-bold">
            {brandConfig.companyName} • PROGRAMA DE EMBAJADORES
          </span>
        </div>

        {/* TARJETA DE REGALO */}
        <div className="bg-[#0A0A10]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EE334E] via-[#00E5FF] to-[#EE334E]" />

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#EE334E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-mono">Preparando tu invitación de regalo...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Enlace no disponible</h2>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
              >
                Ir a la Página Principal
              </button>
            </div>
          ) : (
            <div>
              {/* BADGE DE REGALO */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EE334E]/20 border border-[#EE334E]/40 text-[#EE334E] text-xs font-bold uppercase tracking-wider mb-6">
                <Gift className="w-4 h-4" /> Obsequio Corporativo Exclusivo
              </div>

              {/* TÍTULO Y AGENTE */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                ¡Tienes una Tarjeta Digital de Regalo!
              </h1>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Cortesía de <strong className="text-white text-base">{agent.name}</strong> ({agent.company}). Has sido invitado(a) a diseñar y desplegar tu propia identidad digital interactiva sin ningún costo.
              </p>

              {/* DISPONIBILIDAD */}
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">Disponibilidad del Lote</p>
                  <p className="text-base font-bold text-white">
                    {agent.remaining > 0 ? `${agent.remaining} de ${agent.giftQuota} disponibles` : 'Lote agotado'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  agent.remaining > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {agent.remaining > 0 ? '● Cupo Activo' : 'Agotado'}
                </span>
              </div>

              {/* BENEFICIOS DESBLOQUEADOS */}
              <div className="space-y-3 mb-8 text-sm text-slate-300 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span><strong>Código QR Dinámico</strong> y enlace interactivo personalizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00E5FF] shrink-0" />
                  <span><strong>Todos los Temas Visuales</strong> desbloqueados sin costo</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" />
                  <span><strong>Botones de Contacto Directo:</strong> WhatsApp, Llamada, Correo y Maps</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <span><strong>Alojamiento en Google Cloud SQL</strong> con disponibilidad 24/7</span>
                </div>
              </div>

              {/* BOTÓN DE ACCIÓN */}
              {agent.remaining > 0 ? (
                <button
                  onClick={handleStartBuilder}
                  className="w-full py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_25px_rgba(238,51,78,0.5)] flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <span>Crear mi Tarjeta Gratis Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-sm text-red-300">
                  Este lote de 50 tarjetas de obsequio ha sido completado. Contacta a {agent.name} para solicitar un nuevo cupo.
                </div>
              )}
            </div>
          )}
        </div>

        {/* PIE */}
        <p className="mt-8 text-xs text-slate-500 font-mono text-center">
          POWERED BY GOOGLE CLOUD PLATFORM • HARDWARE NFC & IDENTIDAD DIGITAL
        </p>
      </div>
    </div>
  );
}
