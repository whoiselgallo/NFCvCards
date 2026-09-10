'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Smartphone, 
  Nfc, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Globe2, 
  Award,
  Wallet,
  Check
} from 'lucide-react';
import brandConfig from '../../brand.config';

function BienvenidaContent() {
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get('from') || '';
  const fromName = searchParams.get('name') || '';

  // Determinar destino del CTA
  const ctaUrl = fromSlug ? `/builder?ref=${fromSlug}` : '/builder';

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative overflow-x-hidden selection:bg-[#EE334E] selection:text-white">
      
      {/* RESPLANDORES DE FONDO CYBER ROSE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#EE334E]/15 via-[#00E5FF]/5 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#EE334E]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* NAVBAR MINIMALISTA */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#0A0A12] border border-white/10 rounded-xl flex items-center justify-center p-2 shadow-lg group-hover:border-[#EE334E]/50 transition-all">
            <img src={brandConfig.assets.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-white flex items-center gap-1 font-mono">
              TSOLUTIONS <span className="text-[#EE334E]">ROSE</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono tracking-widest block uppercase">
              Identidad Digital Interactiva
            </span>
          </div>
        </Link>

        <Link
          href={ctaUrl}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:border-[#EE334E]/40"
        >
          <span>Crear Mi Tarjeta</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#EE334E]" />
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        {fromName ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            Vienes de la tarjeta interactiva de {fromName}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EE334E]/15 border border-[#EE334E]/40 text-[#EE334E] text-xs font-mono font-bold uppercase tracking-wider mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            Tecnología NFC & Identidad Digital Inteligente
          </div>
        )}

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Acabas de vivir el futuro del <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-slate-200 to-[#EE334E] bg-clip-text text-transparent">
            Networking Profesional
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Sin tarjetas de papel que se tiran ni contactos que se olvidan. Acabas de interactuar con una identidad digital construida sobre <strong className="text-white">Google Cloud</strong> y <strong className="text-[#00E5FF]">Hardware NFC Contactless</strong>.
        </p>

        {/* BOTÓN CTA PRINCIPAL */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href={ctaUrl}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#EE334E] via-[#ff0003] to-[#EE334E] hover:opacity-95 text-white rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_30px_rgba(238,51,78,0.5)] flex items-center justify-center gap-3 transform active:scale-95"
          >
            <span>Crear Mi Tarjeta Digital Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#como-funciona"
            className="w-full sm:w-auto px-6 py-4 bg-black/50 hover:bg-white/5 text-slate-300 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 text-center"
          >
            ¿Cómo se Construye?
          </a>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10 text-left">
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-2xl font-extrabold text-[#EE334E]">1-Tap</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Contactless NFC instantáneo</p>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-2xl font-extrabold text-[#00E5FF]">100%</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Compatible con iPhone y Android</p>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-2xl font-extrabold text-white">&lt; 3 min</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Tiempo de armado y despliegue</p>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-2xl font-extrabold text-green-400">24/7</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Alojamiento Google Cloud SQL</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN: CÓMO SE CONSTRUYE LA TARJETA */}
      <section id="como-funciona" className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#EE334E] font-bold">
            ARQUITECTURA DE IDENTIDAD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            ¿Cómo se construye una Tarjeta Digital Interactiva?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Cada tarjeta que ves en nuestra plataforma está optimizada para transmitir confianza profesional y facilitar el cierre comercial inmediato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MÓDULO 1: DATOS Y CANALES DIRECTOS */}
          <div className="p-6 sm:p-8 bg-[#0A0A12]/90 border border-white/10 hover:border-[#EE334E]/40 rounded-3xl transition-all shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#EE334E]/15 text-[#EE334E] border border-[#EE334E]/30 flex items-center justify-center font-extrabold text-xl group-hover:scale-110 transition-transform">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Canales de Contacto Directo y Geolocalización
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                La tarjeta integra botones de acción con 1 toque para abrir una conversación de WhatsApp sin necesidad de que el cliente registre tu número previamente, realizar llamadas telefónicas directas, redactar correos o abrir la navegación asistida en Google Maps directo a la ubicación de tu oficina o negocio.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">WhatsApp 1-Click</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Llamada Telefónica</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Google Maps</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Redes Sociales</span>
            </div>
          </div>

          {/* MÓDULO 2: MULTI-TECNOLOGÍA */}
          <div className="p-6 sm:p-8 bg-[#0A0A12]/90 border border-white/10 hover:border-[#00E5FF]/40 rounded-3xl transition-all shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center font-extrabold text-xl group-hover:scale-110 transition-transform">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                6 Métodos de Transmisión Multidispositivo
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Diseñada para cualquier situación de networking: comparte mediante <strong>Contactless NFC</strong> con un toque físico, por <strong>Código QR HD</strong> para cámara de fotos, por <strong>archivo .VCF</strong> para autoguardado en agenda, enlace directo por mensaje, en <strong>Apple Watch</strong> o directo en <strong>Apple Wallet y Google Wallet</strong>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">NFC NTAG213</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Código QR HD</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">vCard 3.0</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Apple/Google Wallet</span>
            </div>
          </div>

          {/* MÓDULO 3: DISEÑO EDITORIAL */}
          <div className="p-6 sm:p-8 bg-[#0A0A12]/90 border border-white/10 hover:border-purple-500/40 rounded-3xl transition-all shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center font-extrabold text-xl group-hover:scale-110 transition-transform">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                10 Diseños Profesionales y Personalización Total
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Elige entre estilos visuales de alto impacto: Cyber Modern Dark, Clásico Corporativo, Minimalista Ejecutivo, Glassmorphism, Monolito Luxury, entre otros. Sube tu fotografía personal o el logotipo corporativo de tu marca con extracción automática de color dominante.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">10 Temas Visuales</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Subida de Logo y Portada</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Filtros de Color Hex</span>
            </div>
          </div>

          {/* MÓDULO 4: CLOUD SQL & ANALÍTICA */}
          <div className="p-6 sm:p-8 bg-[#0A0A12]/90 border border-white/10 hover:border-emerald-500/40 rounded-3xl transition-all shadow-xl space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xl group-hover:scale-110 transition-transform">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Nube Google Cloud SQL & Telemetría en Tiempo Real
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Tu perfil digital está alojado permanentemente con alta disponibilidad 24/7 en servidores de Google Cloud. Cada vez que alguien consulta tu tarjeta o interactúa con tus botones, se registran métricas de telemetría para que conozcas el alcance real de tu networking.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Google Cloud SQL</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Contador de Visitas</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono">Telemetría de Clics</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN COMPARATIVA: PAPEL VS DIGITAL */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#0A0A12]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h3 className="text-2xl font-extrabold text-white text-center mb-8">
            ¿Por qué los mejores profesionales ya no usan papel?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tarjeta tradicional */}
            <div className="p-5 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-3 text-xs">
              <span className="font-mono text-red-400 uppercase font-bold text-[11px] block">
                ❌ Tarjetas de Papel Tradicionales
              </span>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✕</span> El 88% se tira a la basura en menos de una semana.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✕</span> El cliente tiene que escribir tu número a mano.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✕</span> Si cambias de teléfono o puesto, pierdes todo el tiraje.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✕</span> No puedes saber cuántas personas la vieron.
                </li>
              </ul>
            </div>

            {/* Tarjeta Digital */}
            <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3 text-xs">
              <span className="font-mono text-emerald-400 uppercase font-bold text-[11px] block">
                ✓ Tarjeta Digital Interactiva ROSE
              </span>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Se guarda directamente en la agenda del teléfono con 1 clic.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Puedes actualizar tus datos en tiempo real sin reimprimir.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Abre chats de WhatsApp y rutas de Maps al instante.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Mide en tiempo real cuántas veces ha sido consultada.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER CTA FINAL */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-[#180c0f] via-[#240d12] to-[#180c0f] border border-[#EE334E]/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(238,51,78,0.25)] space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE334E]/20 text-[#EE334E] text-xs font-mono font-bold uppercase tracking-wider">
            Comienza Hoy Mismo
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Diseña tu Tarjeta Digital en menos de 3 minutos
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Personaliza tus datos, elige tu tema visual favorito y descarga tu Código QR y archivo de contacto de inmediato.
          </p>

          <div className="pt-2">
            <Link
              href={ctaUrl}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_30px_rgba(238,51,78,0.6)] transform active:scale-95"
            >
              <span>Comenzar Ahora — Es Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            No requiere instalación de aplicaciones • Compatible con todos los dispositivos
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} {brandConfig.companyName}. Todos los derechos reservados.</p>
        <p>POWERED BY GOOGLE CLOUD PLATFORM • NFC & VCARD ENGINE</p>
      </footer>

    </div>
  );
}

export default function BienvenidaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05050A] text-white flex items-center justify-center font-mono text-xs">Cargando experiencia...</div>}>
      <BienvenidaContent />
    </Suspense>
  );
}
