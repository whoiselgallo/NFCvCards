'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Globe, Briefcase } from 'lucide-react';
import brandConfig from '../../brand.config';

export default function LoginPage() {
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-transparent rounded-2xl pointer-events-none" />
          <img src={brandConfig.assets.logo} alt="Logo" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bruno text-white mb-2 tracking-wide text-center uppercase">{brandConfig.companyName}</h1>
        <p className="text-slate-400 mb-10 text-center text-sm">Bienvenido de vuelta</p>

        <div className="w-full bg-[#0A0A10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              type="button" 
              onClick={() => signIn('google', { callbackUrl: '/builder' })} 
              className="w-full relative overflow-hidden group flex items-center justify-center gap-3 py-4 bg-black/40 hover:bg-[#ff0003]/10 border border-white/10 hover:border-[#ff0003]/50 rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,3,0.3)]"
            >
              <style jsx>{`
                @keyframes glare {
                  0% { transform: translateX(-100%) skewX(-15deg); }
                  100% { transform: translateX(200%) skewX(-15deg); }
                }
                .glare-effect {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 50%;
                  height: 100%;
                  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
                  animation: glare 3s infinite;
                }
              `}</style>
              <div className="glare-effect hidden group-hover:block" />
              
              <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-mono text-sm tracking-widest text-slate-300 group-hover:text-[#ff0003] font-bold transition-colors">
                ACCESO SEGURO CON GOOGLE
              </span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500 font-mono text-center">
          PROTEGIDO POR CIFRADO DE GRADO MILITAR
        </p>
      </div>
    </div>
  );
}
