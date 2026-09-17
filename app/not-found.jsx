'use client';

import Link from 'next/link';
import brandConfig from '../brand.config';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#EE334E]/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5FF]/8 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <div className="w-20 h-20 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/20 to-transparent rounded-2xl" />
          <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
        </div>

        {/* 404 */}
        <div className="relative mb-4">
          <span className="text-[120px] font-extrabold leading-none bg-gradient-to-b from-[#EE334E] via-[#ff0003]/60 to-transparent bg-clip-text text-transparent select-none font-bruno">
            404
          </span>
          <div className="absolute inset-0 bg-[#EE334E]/10 blur-3xl rounded-full -z-10" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3 font-bruno tracking-wide uppercase">
          Página No Encontrada
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-mono">
          La URL que buscas no existe o fue removida del servidor.<br />
          Verifica el enlace o regresa al inicio.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EE334E]/30 to-transparent mb-8" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href="/"
            className="flex-1 py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(238,51,78,0.4)] text-center"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/login"
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#EE334E]/40 rounded-xl font-bold uppercase tracking-wider text-sm transition-all text-center"
          >
            Ingresar
          </Link>
        </div>

        <p className="mt-10 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          {brandConfig.companyName} · Error 404 · Recurso no encontrado
        </p>
      </div>
    </div>
  );
}
