'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, X, Home, LayoutDashboard, User, CreditCard, 
  Award, Gift, ExternalLink, LogOut, ShieldCheck, Sparkles,
  BarChart3, Settings
} from 'lucide-react';

export default function MasterAdminDrawer() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Verificamos si la sesión corresponde a Javier Gallardo o administradores autorizados
  const userEmail = session?.user?.email?.toLowerCase() || '';
  const isJavier = userEmail === 'javier.gallardo@tsolutionsipidd.com' ||
                   userEmail === 'whoiselgallo@gmail.com' ||
                   userEmail === 'contacto@tsolutionsipidd.com' ||
                   userEmail.endsWith('@tsolutionsipidd.com');

  if (!isJavier) return null;

  const navLinks = [
    { label: 'Página Principal (Landing)', href: '/', icon: Home, color: 'text-slate-300' },
    { label: 'Torre de Control (Mission Control)', href: '/admin', icon: LayoutDashboard, color: 'text-[#EE334E]', highlight: true, note: 'Requiere 2FA 020410' },
    { label: 'Mi Panel de Usuario (Mis Tarjetas)', href: '/dashboard', icon: User, color: 'text-blue-400' },
    { label: 'Mi Tarjeta Digital Personal', href: '/p/javier-gallardo', icon: ExternalLink, color: 'text-[#00E5FF]' },
    { label: 'Constructor VIP de Tarjetas', href: '/builder?owner=javier-gallardo&vip=javier-gallardo', icon: CreditCard, color: 'text-purple-400' },
    { label: 'Mi Panel de Agente Embajador', href: '/agente/javier-gallardo', icon: Award, color: 'text-amber-400' },
    { label: 'Directorio General de Agentes', href: '/agentes', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Mi Enlace de Obsequio (50 cupos)', href: '/regalo/javier-gallardo', icon: Gift, color: 'text-pink-400' },
  ];

  return (
    <>
      {/* BOTÓN FLOTANTE DE HAMBURGUESA MAESTRO (Siempre accesible en la esquina superior) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 px-3.5 py-2.5 rounded-2xl bg-[#0A0A12]/95 hover:bg-[#12111A] text-white border border-[#EE334E]/60 shadow-[0_0_30px_rgba(238,51,78,0.45)] backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 group cursor-pointer"
        title="Centro de Mando Maestro - Javier Gallardo"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#EE334E] animate-pulse"></div>
        <Menu className="w-4 h-4 text-white group-hover:text-[#EE334E] transition-colors" />
        <span className="text-[11px] font-bold font-mono hidden md:inline tracking-wider uppercase">Centro de Mando</span>
      </button>

      {/* DRAWER LATERAL DESLIZABLE */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end animate-fadeIn">
          <div 
            className="w-full max-w-sm sm:max-w-md bg-[#07070D] border-l border-[#EE334E]/30 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del Drawer */}
            <div>
              <div className="flex justify-between items-center pb-5 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] shadow-[0_0_15px_rgba(238,51,78,0.3)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Javier Gallardo</h3>
                    <p className="text-[11px] text-[#EE334E] font-mono">Master Administrator</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista Centralizada de Enlaces */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 px-2">
                  Ecosistema Completo de Plataforma
                </p>
                {navLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                        item.highlight 
                          ? 'bg-gradient-to-r from-[#EE334E]/20 to-transparent border border-[#EE334E]/40 text-white shadow-[0_0_20px_rgba(238,51,78,0.2)]' 
                          : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.note && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EE334E]/20 text-[#EE334E] border border-[#EE334E]/30">
                          2FA
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer con Cierre de Sesión */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="text-[11px] text-slate-500 font-mono text-center">
                Conectado como {userEmail}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}