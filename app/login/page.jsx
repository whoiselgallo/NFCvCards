'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Globe, Briefcase } from 'lucide-react';
import brandConfig from '../../brand.config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: '/builder',
    });

    if (res?.error) setError(res.error);
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/50 border border-white/10 shadow-[0_0_30px_rgba(255,42,84,0.3)] mb-6">
            <img src={brandConfig.assets.logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,42,84,0.8)]" />
          </div>
          <h1 className="text-3xl font-bruno text-white mb-2 tracking-wider">
            {brandConfig.brandName}
          </h1>
          <p className="text-slate-400">
            {isRegistering ? 'Crea tu cuenta para comenzar' : 'Bienvenido de vuelta'}
          </p>
        </div>

        <div className="bg-[#0A0A10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Tabs: Login / Registro */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsRegistering(false)}
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRegistering ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegistering ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" required className="w-4 h-4 rounded border-white/20 bg-black/50 text-rose-500 focus:ring-rose-500" />
                <span className="text-xs text-slate-400">He leído y acepto los Términos y Condiciones</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 mt-2"
            >
              {isRegistering ? 'Crear Cuenta' : 'Entrar'} &rarr;
            </button>

            {/* Separador */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0A0A10] text-slate-500">O entra con</span>
              </div>
            </div>

            {/* Boton Neo-Futurista Google */}
            <div className="flex flex-col gap-3">
              <button 
                type="button" 
                onClick={() => signIn('google')} 
                className="relative overflow-hidden group flex items-center justify-center gap-3 py-3.5 bg-black/40 hover:bg-[#ff0003]/10 border border-white/10 hover:border-[#ff0003]/50 rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,3,0.3)]"
              >
                {/* Efecto Cyber Glare */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] group-hover:animate-[glare_1s_ease-in-out_infinite] -translate-x-[150%] group-hover:translate-x-[250%] transition-all"></div>
                
                <svg viewBox="0 0 48 48" className="w-5 h-5 z-10">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="text-sm font-bold text-white tracking-wide z-10 font-mono group-hover:text-[#ff0003] transition-colors">ACCESO SEGURO CON GOOGLE</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Definicion de animacion de Glare (resplandor ciber) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glare {
          0% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(250%) skewX(-30deg); }
        }
      `}} />
    </div>
  );
}
