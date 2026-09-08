'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Nfc, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    
    if (res?.ok) {
      router.push('/builder');
    } else {
      alert('Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050D] flex items-center justify-center p-6 selection:bg-[#EE334E] selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Nfc className="text-[#EE334E] w-10 h-10" />
            <span className="text-3xl font-bold tracking-tight text-white">Rose VCards</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-slate-400">Inicia sesión para gestionar tus tarjetas y plan.</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EE334E] to-purple-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-colors"
                  placeholder="tu@empresa.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                <a href="#" className="text-xs text-[#EE334E] hover:text-[#ff6b81] transition-colors">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

                        <div className="flex items-start gap-3 mt-4 mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 bg-white/5 border-white/10 rounded focus:ring-[#EE334E] text-[#EE334E]"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-slate-400 leading-tight cursor-pointer">
                He leído y acepto los <Link href="/terminos" target="_blank" className="text-[#EE334E] hover:underline">Términos y Condiciones</Link> y el Aviso de Privacidad.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="px-4 text-sm text-slate-500">O entra con</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button onClick={() => signIn('google')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-semibold transition-colors">
              <Globe className="w-5 h-5 text-slate-300" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-semibold transition-colors">
              <Globe className="w-5 h-5 text-slate-300" /> Github
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-slate-400">
          ¿Aún no tienes una cuenta? <Link href="/#pricing" className="text-[#EE334E] font-bold hover:underline">Ver Planes</Link>
        </p>
      </div>
    </div>
  );
}
