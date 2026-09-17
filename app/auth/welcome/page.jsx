'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, ArrowRight, LayoutDashboard, CreditCard, ShieldCheck } from 'lucide-react';
import brandConfig from '../../../brand.config';

function AuthWelcomeContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  // Determine if this is a new user (passed via query param from signIn callback)
  const isNew = searchParams.get('new') === '1';

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const displayName =
    session?.user?.name ||
    searchParams.get('name') ||
    'Usuario';

  const displayEmail = session?.user?.email || '';

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EE334E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-b from-[#EE334E]/15 via-[#00E5FF]/5 to-transparent rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EE334E]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5FF]/8 rounded-full blur-[120px] pointer-events-none z-0" />

      <div
        className={`relative z-10 flex flex-col items-center text-center max-w-lg transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/20 to-transparent rounded-2xl" />
          <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EE334E]/15 border border-[#EE334E]/40 text-[#EE334E] text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4" />
          {isNew ? 'Cuenta Verificada · Acceso Concedido' : 'Sesión Iniciada · Google OAuth'}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-bruno">
          {isNew ? (
            <>Bienvenido,<br /><span className="text-[#EE334E]">{displayName.split(' ')[0]}</span> 👋</>
          ) : (
            <>De vuelta,<br /><span className="text-[#EE334E]">{displayName.split(' ')[0]}</span></>
          )}
        </h1>

        {/* Email pill */}
        {displayEmail && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {displayEmail}
          </div>
        )}

        <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-sm">
          {isNew
            ? 'Tu cuenta ha sido creada y vinculada con Google. Ahora puedes diseñar tu tarjeta digital interactiva.'
            : 'Tu identidad ha sido verificada por Google. Estás listo para gestionar tu tarjeta digital.'}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EE334E]/30 to-transparent mb-8" />

        {/* Action cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/dashboard"
            className="group flex flex-col gap-3 p-5 bg-[#EE334E]/10 border border-[#EE334E]/30 hover:border-[#EE334E]/60 rounded-2xl transition-all shadow-[0_0_20px_rgba(238,51,78,0.15)] hover:shadow-[0_0_30px_rgba(238,51,78,0.3)]"
          >
            <LayoutDashboard className="w-6 h-6 text-[#EE334E]" />
            <div className="text-left">
              <p className="text-white font-bold text-sm">Panel de Control</p>
              <p className="text-slate-400 text-xs mt-0.5">Ver estadísticas y métricas</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#EE334E] self-end group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/builder"
            className="group flex flex-col gap-3 p-5 bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 rounded-2xl transition-all"
          >
            <CreditCard className="w-6 h-6 text-[#00E5FF]" />
            <div className="text-left">
              <p className="text-white font-bold text-sm">Diseñar Tarjeta</p>
              <p className="text-slate-400 text-xs mt-0.5">Personalizar mi perfil digital</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00E5FF] self-end group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Features strip for new users */}
        {isNew && (
          <div className="w-full bg-[#0A0A10]/60 border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-3">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-[#EE334E]" />
              Tu plan incluye
            </p>
            {[
              'Tarjeta digital interactiva NFC + QR',
              'Analítica de visitas y clics en tiempo real',
              'Compatibilidad con Apple Wallet y Google Wallet',
              'Sincronización y actualización en tiempo real',
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-[#EE334E]/20 border border-[#EE334E]/40 flex items-center justify-center text-[#EE334E] text-[10px] shrink-0 mt-0.5">✓</span>
                <span className="text-slate-300 text-xs">{feat}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          {brandConfig.companyName} · Autenticado vía Google OAuth 2.0
        </p>
      </div>
    </div>
  );
}

export default function AuthWelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EE334E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthWelcomeContent />
    </Suspense>
  );
}
