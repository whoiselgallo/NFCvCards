'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, X, Sparkles, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';

export default function ConstructionFeedbackModal({
  isOpen,
  onClose,
  onSuccess,
  profileSlug,
  referredBy,
  clientEmail
}) {
  const [easeLevel, setEaseLevel] = useState('muy_facil');
  const [friendlyUi, setFriendlyUi] = useState('excelente');
  const [fieldsFeedback, setFieldsFeedback] = useState(['Todo perfecto como está']);
  const [issuesReported, setIssuesReported] = useState('Todo funcionó a la perfección');
  const [recommendations, setRecommendations] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const easeOptions = [
    { id: 'muy_facil', label: '⚡ Súper fácil y rápido' },
    { id: 'facil', label: '👍 Fácil de armar' },
    { id: 'normal', label: '👌 Normal' },
    { id: 'dificil', label: '🤔 Algo confuso' }
  ];

  const friendlyOptions = [
    { id: 'excelente', label: '🤩 Excelente y moderna' },
    { id: 'buena', label: '👌 Bastante amigable' },
    { id: 'regular', label: '😐 Regular' },
    { id: 'mejorable', label: '👎 Difícil de entender' }
  ];

  const dataSuggestions = [
    'Catálogo o menú digital',
    'Agendamiento de citas / Calendario',
    'Botón directo de cobro / transferencia',
    'Galería de fotos más grande',
    'Más redes sociales',
    'Quitar campos que no uso',
    'Todo perfecto como está'
  ];

  const issueOptions = [
    'Todo funcionó a la perfección',
    'Dificultad subiendo logotipo o portada',
    'Visualización en pantalla móvil',
    'Generación de enlaces o QR',
    'Otro detalle menor'
  ];

  const toggleFieldSuggestion = (item) => {
    if (item === 'Todo perfecto como está') {
      setFieldsFeedback(['Todo perfecto como está']);
      return;
    }
    const filtered = fieldsFeedback.filter(f => f !== 'Todo perfecto como está');
    if (filtered.includes(item)) {
      const next = filtered.filter(f => f !== item);
      setFieldsFeedback(next.length ? next : ['Todo perfecto como está']);
    } else {
      setFieldsFeedback([...filtered, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        profile_slug: profileSlug,
        referred_by: referredBy,
        feedback_type: 'construction',
        ease_level: easeLevel,
        friendly_ui: friendlyUi,
        fields_feedback: fieldsFeedback,
        issues_reported: issuesReported,
        recommendations: recommendations.trim(),
        rating,
        client_email: clientEmail
      };

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (typeof window !== 'undefined' && profileSlug) {
        localStorage.setItem(`vcard_feedback_done_${profileSlug}`, 'true');
      }

      onSuccess();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      // Aun si falla la red, permitir continuar para no bloquear al usuario
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0B0B14] border border-[#EE334E]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(238,51,78,0.3)] my-8 text-white">
        
        {/* ENCABEZADO */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EE334E]/20 border border-[#EE334E]/40 text-[#EE334E] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pase de Obsequio • Activación de Descargas
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
              ¡Tu Tarjeta de Obsequio está Lista! 🎉
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Como beneficiario de este lote exclusivo, ayúdanos con <strong>1 minuto de feedback</strong> para perfeccionar la plataforma y desbloquear al instante todos tus botones de descarga (.ZIP, QR, .VCF y Enlace Cloud).
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* 1. FACILIDAD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              1. ¿Qué tan fácil fue construir tu tarjeta?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {easeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEaseLevel(opt.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                    easeLevel === opt.id
                      ? 'bg-[#EE334E]/20 border-[#EE334E] text-white shadow-[0_0_15px_rgba(238,51,78,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. AMIGABILIDAD DE LA INTERFAZ */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              2. ¿La interfaz fue amigable e intuitiva?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {friendlyOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFriendlyUi(opt.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                    friendlyUi === opt.id
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. DATOS A AGREGAR O QUITAR */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              3. ¿Qué datos o funciones te gustaría agregar o quitar? <span className="text-slate-400 font-normal lowercase">(selección rápida)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {dataSuggestions.map((item) => {
                const isSelected = fieldsFeedback.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleFieldSuggestion(item)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. FALLAS O PROBLEMAS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              4. ¿Tuviste algún problema o algo no funcionó bien?
            </label>
            <div className="space-y-1.5">
              {issueOptions.map((iss) => (
                <label
                  key={iss}
                  onClick={() => setIssuesReported(iss)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    issuesReported === iss
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="issue"
                    checked={issuesReported === iss}
                    onChange={() => setIssuesReported(iss)}
                    className="accent-[#EE334E]"
                  />
                  <span>{iss}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. SUGERENCIA LIBRE (OPCIONAL) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              5. Recomendación o sugerencia personal <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="¿Qué podríamos mejorar para que tu tarjeta sea aún más útil para tu negocio?"
              className="w-full bg-black/50 border border-white/10 focus:border-[#EE334E] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* 6. CALIFICACIÓN EN ESTRELLAS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-black/40 border border-white/10 rounded-2xl">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Calificación general de la experiencia:
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

          {/* BOTÓN DE ACCIÓN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#EE334E] via-[#ff0003] to-[#EE334E] hover:opacity-95 text-white rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(238,51,78,0.5)] flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>ACTIVANDO ENTREGABLES GRATIS...</span>
              </>
            ) : (
              <>
                <span>Guardar Feedback y Activar Descargas Gratuitas</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 font-mono text-center mt-4">
          Tus respuestas nos ayudan a construir la mejor tecnología de presentación profesional.
        </p>
      </div>
    </div>
  );
}
