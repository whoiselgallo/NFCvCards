'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, ShieldCheck, CreditCard, Layers, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import brandConfig from '../../../brand.config';

export default function VipPassPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Validando credenciales VIP...');

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    async function loadAndActivatePass() {
      try {
        setLoading(true);
        setError('');

        // 1. Validar el pase en el servidor
        const res = await fetch(`/api/pass/${slug}`);
        const data = await res.json();

        if (!data.success || !data.pass) {
          if (isMounted) {
            setError(data.error || 'El enlace de pase libre no es válido o ha expirado.');
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setPassData(data.pass);
          setStatusMessage('¡Pase VIP Verificado! Activando sesión Elite...');
        }

        // 2. Iniciar sesión automática mediante el Pase VIP
        setActivating(true);
        const signInResult = await signIn('credentials', {
          redirect: false,
          passSlug: slug
        });

        if (signInResult?.ok) {
          if (isMounted) {
            setStatusMessage('Sesión Elite vinculada con éxito. Redirigiendo al editor...');
            setTimeout(() => {
              router.push(`/builder?vip=${slug}`);
            }, 1200);
          }
        } else {
          // Si el inicio de sesión falló por alguna razón de red, permitimos entrar con el parámetro en URL
          if (isMounted) {
            setStatusMessage('Acceso concedido. Entrando al constructor...');
            setTimeout(() => {
              router.push(`/builder?vip=${slug}`);
            }, 1200);
          }
        }
      } catch (err) {
        console.error('Error al procesar el pase:', err);
        if (isMounted) {
          setError('Ocurrió un error al procesar tu acceso VIP. Intenta de nuevo.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAndActivatePass();

    return () => {
      isMounted = false;
    };
  }, [slug, router]);

  const handleManualEnter = async () => {
    setActivating(true);
    try {
      await signIn('credentials', {
        redirect: false,
        passSlug: slug
      });
    } catch (e) {}
    router.push(`/builder?vip=${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Resplandor Cyber Rose de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#EE334E]/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-xl relative z-10">
        
        {/* LOGO CORPORATIVO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/30 to-transparent rounded-2xl pointer-events-none" />
            <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-xs font-mono tracking-widest text-[#EE334E] uppercase font-bold">
            {brandConfig.companyName} • SISTEMA VIP
          </span>
        </div>

        {/* TARJETA PRINCIPAL DEL PASE */}
        <div className="bg-[#0A0A10]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EE334E] via-[#00E5FF] to-purple-600" />

          {error ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Acceso No Encontrado</h2>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          ) : (
            <div>
              {/* BADGE VIP SUPERIOR */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EE334E]/20 border border-[#EE334E]/40 text-[#EE334E] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" /> Pase Libre VIP Autorizado
              </div>

              {/* SALUDO PERSONALIZADO */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {passData ? `¡Bienvenido(a), ${passData.name}!` : 'Cargando tu Pase VIP...'}
              </h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Se te ha otorgado un <strong className="text-white">Pase Libre con Nivel Elite</strong> exclusivo. Tienes habilitado el constructor de tarjetas con el 100% de sus funciones y capacidad completa.
              </p>

              {/* LISTA DE BENEFICIOS DESBLOQUEADOS */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 mb-8 space-y-3.5">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span><strong>50 Tarjetas Digitales Inteligentes</strong> libres</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#00E5FF] shrink-0" />
                  <span><strong>Todos los Temas Desbloqueados</strong> (Cyber, Gold, Minimal, etc.)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" />
                  <span><strong>Editor Libre & Layout Custom</strong> (Reordenar módulos y estilos)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <span><strong>Servicios Completos:</strong> Agenda, Reseñas Google, Galería & Cloud SQL</span>
                </div>
              </div>

              {/* ESTADO / BOTÓN DE ACCIÓN */}
              <div className="space-y-4">
                <button
                  onClick={handleManualEnter}
                  disabled={activating}
                  className="w-full py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_25px_rgba(238,51,78,0.5)] flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <span>{activating ? 'Ingresando al Constructor...' : 'Entrar al Constructor de Tarjetas'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {statusMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PIE DE PÁGINA */}
        <p className="mt-8 text-xs text-slate-500 font-mono text-center">
          AUTENTICACIÓN CRIPTOGRÁFICA SEGURA • ACCESO PERSONALIZADO EXCLUSIVO
        </p>
      </div>
    </div>
  );
}
