'use client';

import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock } from 'lucide-react';

export default function TwoFactorGuard({ children, email }) {
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Validación 2FA
  const handleVerify = (e) => {
    e.preventDefault();
    // TODO: Conectar con otplib para validar token TOTP real
    if (code === '000000') { // PIN de seguridad maestro temporal
      setIsVerified(true);
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

        <div className="w-20 h-20 bg-[#EE334E]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EE334E]/20">
          <ShieldAlert className="w-10 h-10 text-[#EE334E]" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h1>
        <p className="text-sm text-slate-400 mb-6">
          Hola Javier. Por protocolos de seguridad, confirma tu identidad corporativa para acceder a la torre de control de TSolutions.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-[0.5em] font-mono bg-black/50 border border-white/10 rounded-xl py-4 text-white focus:outline-none focus:border-[#EE334E] transition-colors"
            />
          </div>
          {error && <p className="text-xs text-[#EE334E] font-bold">{error}</p>}
          
          <button type="submit" className="w-full py-4 rounded-xl bg-[#EE334E] hover:bg-[#ff0003] text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" /> Verificar Acceso
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <button className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
            <Fingerprint className="w-4 h-4" /> Usar Dato Biométrico (FaceID / TouchID)
          </button>
          <button className="text-[10px] text-slate-600 hover:text-slate-400 underline">
            Enviar código de recuperación a mi correo alterno
          </button>
        </div>
      </div>
    </div>
  );
}
