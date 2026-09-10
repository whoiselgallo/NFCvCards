'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, X, Sparkles, Send, Award, Smartphone, Zap } from 'lucide-react';

export default function UsageExperienceModal({
  isOpen,
  onClose,
  profileSlug,
  viewsCount = 10,
  referredBy = null
}) {
  const [sharingExp, setSharingExp] = useState('impacto');
  const [channelsUsed, setChannelsUsed] = useState(['📡 Contactless NFC (tarjeta/sticker)', '📷 Código QR']);
  const [clientEase, setClientEase] = useState('inmediato');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [salesFeatureRequest, setSalesFeatureRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const experienceOptions = [
    { id: 'impacto', label: '🔥 Sorprendente (genera impacto inmediato)' },
    { id: 'profesional', label: '💼 Práctica, rápida y profesional' },
    { id: 'buena', label: '👌 Buena, cumple su función' },
    { id: 'regular', label: '😐 Algunos clientes dudan cómo usarla' }
  ];

  const channelOptions = [
    '📡 Contactless NFC (tarjeta/sticker)',
    '📷 Escaneo de Código QR',
    '💬 Enlace directo por WhatsApp',
    '📥 Archivo de contacto .VCF',
    '⌚ Apple Watch / Wallet'
  ];

  const clientEaseOptions = [
    { id: 'inmediato', label: '✅ Sí, guardan mi contacto al instante' },
    { id: 'mayoria', label: '👍 A la gran mayoría se les facilita' },
    { id: 'dificil', label: '🤔 A algunos se les complica o preguntan' }
  ];

  const toggleChannel = (ch) => {
    if (channelsUsed.includes(ch)) {
      const next = channelsUsed.filter(c => c !== ch);
      setChannelsUsed(next.length ? next : [ch]);
    } else {
      setChannelsUsed([...channelsUsed, ch]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        profile_slug: profileSlug,
        referred_by: referredBy,
        feedback_type: 'usage_experience',
        ease_level: clientEase,
        friendly_ui: sharingExp,
        fields_feedback: channelsUsed,
        recommendations: salesFeatureRequest.trim(),
        rating,
        nps_score: rating >= 4 ? 10 : 7,
        usage_highlights: [`views_milestone_${viewsCount}`]
      };

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (typeof window !== 'undefined' && profileSlug) {
        localStorage.setItem(`vcard_usage_feedback_done_${profileSlug}`, 'true');
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error enviando feedback de uso:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0B0B14] border border-[#00E5FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.25)] my-8 text-white">
        
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">¡Gracias por tu Opinión!</h3>
            <p className="text-sm text-slate-300">
              Tus respuestas nos permiten seguir optimizando el rendimiento comercial de tu tarjeta digital.
            </p>
          </div>
        ) : (
          <div>
            {/* BADGE */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              Hito Alcanzado: +{viewsCount} Consultas Registradas
            </div>

            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              ¿Cómo ha sido la experiencia con tus clientes? 🚀
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Tu tarjeta ya está generando impacto real en el mercado. Ayúdanos a evaluar el resultado con estas breves preguntas:
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              
              {/* 1. EXPERIENCIA COMPARTIENDO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  1. ¿Qué reacción causa al presentar tu tarjeta?
                </label>
                <div className="space-y-1.5">
                  {experienceOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSharingExp(opt.id)}
                      className={`w-full p-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                        sharingExp === opt.id
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. MÉTODOS MÁS USADOS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  2. ¿Por qué medios la compartes más? <span className="text-slate-400 font-normal lowercase">(selecciona los que apliquen)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {channelOptions.map((ch) => {
                    const isSel = channelsUsed.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`p-2 rounded-xl text-[11px] font-medium text-left transition-all border ${
                          isSel
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isSel ? '✓ ' : '+ '} {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. FACILIDAD DE GUARDADO DEL CONTACTO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  3. ¿A tus clientes se les facilita guardar tu contacto?
                </label>
                <div className="space-y-1.5">
                  {clientEaseOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setClientEase(opt.id)}
                      className={`w-full p-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                        clientEase === opt.id
                          ? 'bg-purple-500/20 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. CALIFICACIÓN */}
              <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Calificación de tu Tarjeta:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-yellow-400 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-yellow-400 ml-1.5">{rating}/5</span>
                </div>
              </div>

              {/* 5. SUGERENCIA PARA CERRAR VENTAS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  4. ¿Qué función adicional te ayudaría a cerrar más prospectos?
                </label>
                <input
                  type="text"
                  value={salesFeatureRequest}
                  onChange={(e) => setSalesFeatureRequest(e.target.value)}
                  placeholder="Ej: Botón de cotización automática, catálogo con precios..."
                  className="w-full bg-black/50 border border-white/10 focus:border-[#00E5FF] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* BOTÓN SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#00E5FF] to-cyan-500 hover:opacity-95 text-black rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>ENVIANDO CALIFICACIÓN...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Calificación de Experiencia</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
