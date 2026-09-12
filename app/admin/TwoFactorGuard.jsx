'use client';

import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock, ArrowLeft, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';

export default function TwoFactorGuard({ children, email }) {
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Validación 2FA Estricta con PIN Maestro
  const handleVerify = (e) => {
    e.preventDefault();
    if (code === '020410') { // 🔑 PIN MAESTRO ACTUALIZADO
      setIsVerified(true);
      setError('');
    } else {
      setError('Código 2FA incorrecto. Acceso denegado.');
    }
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0a0a10] border border-[#EE334E]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(238,51,78,0.15)] text-center relative overflow-hidden">
        
        {/* Efecto visual de barrido láser */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EE334E] to-transparent animate-pulse"></div>

        {/* Botón de regreso a la Landing */}
        <div className="flex justify-start mb-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Inicio
          </Link>
        </div>

        <div className="w-20 h-20 bg-[#EE334E]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#EE334E]/20 shadow-[0_0_20px_rgba(238,51,78,0.2)]">
          <ShieldAlert className="w-10 h-10 text-[#EE334E]" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Torre de Control Admin</h1>
        <p className="text-xs text-slate-400 mb-6">
          Hola Javier. Por protocolo de seguridad, ingresa tu clave maestra de 6 dígitos para acceder al Mission Control.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoFocus
              className="w-full text-center text-4xl tracking-[0.5em] font-mono bg-black/50 border border-white/10 rounded-xl py-4 text-white focus:outline-none focus:border-[#EE334E] transition-colors"
            />
          </div>
          {error && <p className="text-xs text-[#EE334E] font-bold">{error}</p>}
          
          <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#EE334E] to-[#ff0003] hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-[#EE334E]/30 flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
            <Lock className="w-4 h-4" /> Verificar y Acceder
          </button>
        </form>

        {/* Accesos rápidos alternativos para Javier */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-2.5 text-xs text-slate-400">
          <Link href="/p/javier-gallardo" className="hover:text-[#00E5FF] flex items-center justify-center gap-1.5 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-[#00E5FF]" /> Mi Tarjeta Personal (/p/javier-gallardo)
          </Link>
          <Link href="/dashboard" className="hover:text-white flex items-center justify-center gap-1.5 transition-colors">
            <User className="w-3.5 h-3.5 text-slate-400" /> Mi Panel de Usuario (/dashboard)
          </Link>
        </div>
      </div>
    </div>
  );
}
