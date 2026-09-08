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

            {/* Botones Sociales */}
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => signIn('google')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                <Globe className="w-5 h-5 text-slate-300" />
              </button>
              <button type="button" onClick={() => signIn('github')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                <Briefcase className="w-5 h-5 text-slate-300" />
              </button>
              <button type="button" onClick={() => signIn('apple')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-300"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
