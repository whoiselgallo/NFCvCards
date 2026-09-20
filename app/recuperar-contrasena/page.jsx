'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import brandConfig from '../../brand.config';

function RecuperarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  // Phase: 'request' | 'sent' | 'reset' | 'done'
  const [phase, setPhase] = useState(token ? 'reset' : 'request');
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── STEP 1: Request reset link ──────────────────────────────────────────────
  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Ingresa tu correo electrónico.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se encontró una cuenta con ese correo.');
      } else {
        setPhase('sent');
      }
    } catch {
      setError('Error de red. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Submit new password ─────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'El enlace expiró o es inválido. Solicita uno nuevo.');
      } else {
        setPhase('done');
      }
    } catch {
      setError('Error de red. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-600/20 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/20 to-transparent rounded-2xl pointer-events-none" />
          <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
        </div>

        <h1 className="text-2xl font-bruno text-white mb-1 tracking-wide uppercase text-center">
          {phase === 'done' ? 'Contraseña Actualizada' : 'Recuperar Contraseña'}
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          {phase === 'request' && 'Te enviaremos un enlace de recuperación'}
          {phase === 'sent'    && 'Revisa tu bandeja de entrada'}
          {phase === 'reset'   && 'Crea una nueva contraseña segura'}
          {phase === 'done'    && 'Ya puedes iniciar sesión con tu nueva contraseña'}
        </p>

        <div className="w-full bg-[#0A0A10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* ── Error banner ── */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold">
              {error}
            </div>
          )}

          {/* ── PHASE: request ── */}
          {phase === 'request' && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#EE334E] hover:bg-[#ff0003] disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)]"
              >
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </button>
            </form>
          )}

          {/* ── PHASE: sent ── */}
          {phase === 'sent' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-bold text-lg">¡Correo enviado!</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Si <span className="text-white font-mono">{email}</span> está registrado, recibirás un enlace
                en los próximos minutos. Revisa también tu carpeta de spam.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">El enlace expira en 30 minutos.</p>
              <button
                onClick={() => { setPhase('request'); setError(''); }}
                className="text-sm text-[#EE334E] hover:text-white transition-colors font-bold"
              >
                Usar otro correo
              </button>
            </div>
          )}

          {/* ── PHASE: reset (with token) ── */}
          {phase === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Nueva contraseña (mín. 8 caracteres)"
                  className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Confirmar contraseña"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
                />
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="flex gap-1.5">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= i * 3
                          ? i <= 1 ? 'bg-red-500'
                            : i <= 2 ? 'bg-yellow-500'
                            : i <= 3 ? 'bg-blue-500'
                            : 'bg-emerald-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#EE334E] hover:bg-[#ff0003] disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)]"
              >
                {loading ? 'Guardando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          )}

          {/* ── PHASE: done ── */}
          {phase === 'done' && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-[#EE334E]/15 border border-[#EE334E]/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(238,51,78,0.3)]">
                <CheckCircle2 className="w-8 h-8 text-[#EE334E]" />
              </div>
              <p className="text-white font-bold">Contraseña actualizada correctamente</p>
              <Link
                href="/login"
                className="block w-full py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)] text-center text-sm"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>

        {/* Back to login */}
        {(phase === 'request' || phase === 'sent') && (
          <Link
            href="/login"
            className="mt-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        )}

        <p className="mt-6 text-[10px] text-slate-600 font-mono tracking-widest uppercase text-center">
          PROTEGIDO POR CIFRADO DE GRADO MILITAR
        </p>
      </div>
    </div>
  );
}

export default function RecuperarContrasenaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#05050A] text-white flex items-center justify-center font-mono text-xs">
        Cargando...
      </div>
    }>
      <RecuperarContent />
    </Suspense>
  );
}
