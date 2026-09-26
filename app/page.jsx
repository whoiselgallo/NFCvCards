'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Star,
  Zap,
  ArrowRight,
  MonitorSmartphone,
  Layers,
  Mail,
  BookOpen,
  Wallet,
  Smartphone,
  QrCode,
  WifiOff,
  Users,
  ScanLine,
  Share2,
  Building2,
  Database,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  Cpu,
  Globe,
  Check,
  Award,
  Flame,
  ExternalLink,
  HelpCircle,
  ArrowUpRight,
  Radio,
  FileCheck2,
  Webhook
} from 'lucide-react';
import MasterAdminDrawer from './components/MasterAdminDrawer';
import CreationGuideModal from './components/CreationGuideModal';

const WORDS = [
  "Cierre de alto Impacto",
  "Socio Estratégico",
  "Alianza Inmediata",
  "Cliente Calificado",
  "Experiencia interactiva"
];

function PayPalButton({ planId }) {
  const containerId = 'paypal-container-' + planId;

  React.useEffect(() => {
    let interval;
    const renderBtn = () => {
      if (window.paypal && document.getElementById(containerId) && !document.getElementById(containerId).hasChildNodes()) {
        window.paypal.Buttons({
          style: { shape: 'pill', color: 'silver', layout: 'horizontal', label: 'subscribe' },
          createSubscription: function (data, actions) {
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: function (data, actions) {
            alert('¡Suscripción exitosa! Redirigiendo...');
            window.location.href = '/login?payment=success&plan=' + planId;
          }
        }).render('#' + containerId);
      }
    };

    if (window.paypal) {
      renderBtn();
    } else {
      interval = setInterval(() => {
        if (window.paypal) {
          clearInterval(interval);
          renderBtn();
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [planId, containerId]);

  return <div id={containerId} className="w-full mt-3 min-h-[45px] z-20 relative"></div>;
}

export default function LandingPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'

  const handleCheckout = async (planId, forcedInterval) => {
    const interval = forcedInterval || billingCycle;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingInterval: interval })
      });
      const data = await res.json();
      if (data.freeAccess) {
        window.location.href = '/builder';
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error al procesar el pago');
      }
    } catch (e) {
      alert('Error de conexión');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <>
      <MasterAdminDrawer />
      <Script src="https://www.paypal.com/sdk/js?client-id=BAAVBTkbyfhfvSv-LwMOAjKhD4cWmr2himsyOcDfmT_oBblFqSZ5LdvTLDibQfmSi6mSrgCtYcA0YsoMoI&vault=true&intent=subscription" strategy="lazyOnload" />
      
      <div className="min-h-screen bg-[#05050D] text-slate-200 font-sans selection:bg-[#EE334E] selection:text-white overflow-x-hidden">

        {/* HEADER / NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#05050D]/85 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/roselogo_120x120.png"
                alt="Rose VCards"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-bruno">
                Rose VCards
              </span>
            </Link>

            {/* Menú Móvil Rápido */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-xs text-[#00E5FF] hover:text-white px-2 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Guía</span>
              </button>
              <Link
                href="/builder"
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                Editor
              </Link>
              <Link
                href="/login"
                className="text-white bg-gradient-to-r from-[#EE334E] to-[#ff0003] hover:brightness-110 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(238,51,78,0.4)] flex items-center gap-1"
              >
                <span>Acceder</span>
              </Link>
            </div>

            {/* Menú Desktop Completo */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#how-it-works" className="hover:text-white transition-colors">Flujo de Conexión</a>
              <a href="#features" className="hover:text-white transition-colors">Nuevas Funciones</a>
              <a href="#use-cases" className="hover:text-white transition-colors">Casos de Uso</a>
              <a href="#white-label" className="hover:text-white transition-colors">B2B & Marca Blanca</a>
              <a href="#pricing" className="hover:text-white transition-colors">Planes y Precios</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-[#00E5FF] hover:text-white bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
              >
                <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                <span>Instructivo</span>
              </button>
              <Link href="/login" className="text-white bg-[#EE334E] hover:bg-[#ff0003] px-4 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(238,51,78,0.3)]">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-28 min-h-screen flex items-center overflow-hidden">
          {/* VIDEO DE FONDO */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
            >
              <source src="/Crear_comercial_con_imagen_202609060353.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#05050D] via-transparent to-[#05050D]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050D] via-transparent to-[#05050D]" />
          </div>

          {/* Círculo de resplandor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#EE334E]/20 rounded-full blur-[140px] pointer-events-none z-0" />

          <motion.div
            className="max-w-7xl mx-auto px-6 relative z-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm mb-6 text-slate-300 backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#EE334E]" />
              <span className="font-semibold text-white">Ecosistema NFC & vCard Engine 2026</span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-emerald-400 font-mono text-xs">PWA Offline & Wallets</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight text-center" style={{ fontFamily: 'Plaster, sans-serif', fontWeight: 400 }}>
              Convierte ese primer contacto en un...
              <div className="block w-full h-[70px] sm:h-[90px] md:h-[120px] relative my-3 text-[#EE334E] text-[9vw] sm:text-5xl md:text-7xl flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -35 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed backdrop-blur-sm bg-black/30 p-4 sm:p-6 rounded-2xl border border-white/5">
              Tarjetas inteligentes con tecnología <strong>NFC Contactless</strong>, pases oficiales para <strong>Apple Wallet & Google Wallet</strong>, captura de prospectos con <strong>CRM bidireccional</strong> y arquitectura <strong>PWA Offline</strong> con alta disponibilidad en <strong>Google Cloud Platform</strong>.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-full font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(238,51,78,0.4)] flex items-center justify-center gap-2">
                <span>Ver Planes y Precios</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/builder" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Diseñar en Editor</span>
              </Link>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="w-full sm:w-auto px-7 py-4 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 backdrop-blur-md rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                <span>Instructivo de Creación</span>
              </button>
            </motion.div>

            {/* BARRA DE HIGHLIGHTS TECNOLÓGICOS */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto pt-4 border-t border-white/10 text-left"
            >
              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Apple & Google</p>
                  <p className="text-[10px] text-slate-400">Pases de Cartera</p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">PWA Offline</p>
                  <p className="text-[10px] text-slate-400">Funciona sin señal</p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Lead Capture</p>
                  <p className="text-[10px] text-slate-400">Intercambio 1-Tap</p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Escáner OCR</p>
                  <p className="text-[10px] text-slate-400">Tarjetas de papel a CRM</p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EE334E]/20 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">SaaS B2B Multi-Org</p>
                  <p className="text-[10px] text-slate-400">Equipos & Branding</p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Normativa & Cédula</p>
                  <p className="text-[10px] text-slate-400">Salud, Leyes & Seguros</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* NUEVA SECCIÓN: FLUJO DE CONEXIÓN EN 4 PASOS */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#05050D] via-[#090913] to-[#05050D] border-y border-white/5 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 inline-block mb-3">
                EXPERIENCIA INTERACTIVA SIN FRICCIÓN
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                El Nuevo Flujo Inteligente de Networking
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
                Olvídate de tarjetas de papel que terminan en la basura. Diseñamos un flujo de 4 pasos que transforma un apretón de manos en una relación comercial permanente.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Paso 1 */}
              <motion.div
                variants={scaleIn}
                className="bg-[#0a0a14] border border-white/10 hover:border-[#EE334E]/50 rounded-3xl p-7 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EE334E]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-[#EE334E] font-mono">01</span>
                    <div className="w-11 h-11 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E]">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">1. Toca o Escanea</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Aproxima tu tarjeta física inteligente o sticker a cualquier iPhone o Android. También puedes proyectar tu <strong>QR Dinámico</strong> en pantalla o reloj <strong>Apple Watch / Wear OS</strong>. Cero aplicaciones que descargar.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-500">
                  ✓ Compatible con 100% de smartphones
                </div>
              </motion.div>

              {/* Paso 2 */}
              <motion.div
                variants={scaleIn}
                className="bg-[#0a0a14] border border-white/10 hover:border-[#00E5FF]/50 rounded-3xl p-7 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-[#00E5FF] font-mono">02</span>
                    <div className="w-11 h-11 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                      <Smartphone className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">2. Despliegue Inmediato</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    En milisegundos se despliega tu perfil digital personalizado con tu portafolio, videos, catálogo comercial, redes oficiales, botón de WhatsApp, credenciales profesionales y enlace de agenda (Google Calendar / Calendly).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-cyan-400/80">
                  ⚡ Velocidad ultra en Google Cloud & PWA
                </div>
              </motion.div>

              {/* Paso 3 */}
              <motion.div
                variants={scaleIn}
                className="bg-[#0a0a14] border border-white/10 hover:border-purple-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-purple-400 font-mono">03</span>
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">3. Guardado Multicanal</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Tu prospecto guarda tu contacto directo (.vcf) en su agenda telefónica con 1 solo toque, o añade tu tarjeta oficial como <strong>pase digital permanente en Apple Wallet o Google Wallet</strong> para tenerte en su pantalla de bloqueo.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-purple-400/80">
                   Apple Wallet + 💳 Google Wallet
                </div>
              </motion.div>

              {/* Paso 4 */}
              <motion.div
                variants={scaleIn}
                className="bg-[#0a0a14] border border-white/10 hover:border-emerald-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-emerald-400 font-mono">04</span>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">4. Lead Capture & CRM</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Networking en dos direcciones: tu cliente te devuelve sus datos (Nombre, Teléfono, Correo, Empresa y Nota) en 5 segundos. Todo se registra al instante en tu <strong>panel CRM</strong> y se sincroniza mediante webhooks con tu software comercial.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400/80">
                  🤝 Intercambio bidireccional + Webhooks
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* NUEVA SECCIÓN: ECOSISTEMA TECNOLÓGICO & NUEVAS FUNCIONES */}
        <section id="features" className="py-24 bg-black/40 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#EE334E] font-bold px-3 py-1 rounded-full bg-[#EE334E]/10 border border-[#EE334E]/20 inline-block mb-3">
                INNOVACIÓN CONTINUA
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Nuevas Funciones y Potencia Tecnológica
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
                Hemos evolucionado más allá de una tarjeta estática. Descubre las herramientas de última generación incorporadas a nuestra plataforma hasta el día de hoy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Función 1: Apple & Google Wallet */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-purple-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pases Oficiales en Apple Wallet & Google Wallet</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Tus clientes y colaboradores pueden añadir tu vCard directamente a la cartera digital nativa de su iPhone o Android. Permite mostrar tu Código QR dinámico desde la pantalla de bloqueo o reloj inteligente sin abrir el explorador.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-purple-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Integración .pkpass y Google Wallet Pass
                </div>
              </motion.div>

              {/* Función 2: Lead Capture Bidireccional */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-cyan-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Intercambio Bidireccional de Contactos (Lead Capture)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    No solo compartes tus datos: tu interlocutor presiona el botón "Intercambiar Contacto" en tu perfil y te envía su nombre, WhatsApp, email, empresa y notas de la reunión en 5 segundos, guardándose en tu panel comercial.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Captura 1-Tap con confirmación instantánea
                </div>
              </motion.div>

              {/* Función 3: Escáner Inteligente OCR de Tarjetas */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-amber-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Escáner OCR Inteligente de Tarjetas de Papel</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    ¿Alguien te entregó una tarjeta tradicional impresa? Tómale una fotografía con la cámara de tu smartphone y nuestro motor OCR con Visión Computacional extraerá nombre, cargo, teléfono y correo para agregarlo a tu CRM en segundos.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Extracción automática con IA y Visión Óptica
                </div>
              </motion.div>

              {/* Función 4: CRM Integrado & Gestión de Prospectos */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-[#EE334E]/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] mb-5 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">CRM de Contactos, Notas y Campañas</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Panel centralizado para administrar todos tus prospectos capturados. Asigna notas privadas, clasifica el origen de tus contactos, gestiona autorizaciones de privacidad y descarga reportes en Excel/CSV con un solo clic.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#EE334E] font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Exportación CSV / Excel y control de consentimiento
                </div>
              </motion.div>

              {/* Función 5: Arquitectura Offline PWA */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-emerald-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                    <WifiOff className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Modo Offline PWA (Sin Cobertura ni WiFi)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    ¿Te encuentras en una expo masiva con redes saturadas, en un sótano o en un vuelo? El Service Worker de nuestra Progressive Web App almacena en caché tu tarjeta y genera tu QR dinámico aún sin internet.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Service Worker local con caché inteligente
                </div>
              </motion.div>

              {/* Función 6: Programación Web NFC (Provisioning) */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-blue-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Programación Web NFC Directa (Provisioning)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Graba y reprograma chips NFC físicos (NTAG213, NTAG215, NTAG216) y stickers inteligentes directamente desde el navegador Google Chrome sin aplicaciones externas ni equipo especializado.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-blue-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Escritura NDEF nativa vía Web NFC API
                </div>
              </motion.div>

              {/* Función 7: Cédula Profesional y Permisos Oficiales */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-slate-300 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cédula Profesional & Permisos de Gobernación</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Módulo de validación para profesionistas del sector médico, legal, fiscal, inmobiliario y asegurador. Muestra de forma destacada tu Cédula Profesional y folio de permisos oficiales (Segob) con verificación visual inmediata.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Cumplimiento normativo y máxima certeza jurídica
                </div>
              </motion.div>

              {/* Función 8: SaaS B2B Organizaciones */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-[#EE334E]/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] mb-5 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Arquitectura SaaS B2B Multi-Organización</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Panel corporativo para administrar equipos enteros. Activa o desactiva colaboradores, asigna cuotas de tarjetas, centraliza la facturación y fija la identidad visual institucional con colores y logo corporativos protegidos.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#EE334E] font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Enforce Branding y gestión de miembros corporativos
                </div>
              </motion.div>

              {/* Función 9: Webhooks & Automatizaciones */}
              <motion.div variants={scaleIn} className="bg-[#0a0a12] border border-white/10 hover:border-pink-500/50 rounded-3xl p-7 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
                    <Webhook className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Webhooks en Vivo & Automatizaciones</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Sincroniza cada contacto generado en tiempo real con tus plataformas externas favoritas: Zapier, Make, HubSpot, Salesforce o Google Sheets a través de webhooks seguros con firma de autenticación.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-pink-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Despacho instantáneo de eventos lead.created
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* USE CASES SECTION */}
        <section id="use-cases" className="py-24 bg-black/60 border-y border-white/5 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-block mb-3">
                CASOS DE ÉXITO Y VERTICALES
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Diseñado para cada etapa de tu negocio</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Soluciones escalables que se adaptan desde el emprendedor individual hasta el corporativo transnacional.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Opción 1: Emprendedor & Startup Tech */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/design1.jpeg" alt="Diseño Innovación Tech" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                    <Zap className="w-6 h-6 text-[#EE334E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Diseño Innovación Tech</h3>
                  <p className="text-xs text-[#EE334E] font-bold mb-3 tracking-wide uppercase">Emprendedores, Founders & Startups</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    En el ecosistema de startups eliminamos toda la fricción. Comparte tu pitch deck, demo interactiva y pase a Apple/Google Wallet en un solo toque, con soporte PWA offline para eventos de inversión.
                  </p>
                </div>
              </motion.div>

              {/* Opción 2: Ejecutivo Comercial & Pymes */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/design2.jpeg" alt="Diseño Ejecutivo Comercial" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                    <BarChart3 className="w-6 h-6 text-[#EE334E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Ejecutivo Comercial & Ventas</h3>
                  <p className="text-xs text-[#EE334E] font-bold mb-3 tracking-wide uppercase">Pymes & Equipos de Ventas</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Moderniza tu fuerza de ventas. Captura los datos del cliente al instante con el módulo Lead Capture, escanea tarjetas físicas de papel con OCR y centraliza todos los prospectos en tu CRM en tiempo real.
                  </p>
                </div>
              </motion.div>

              {/* Opción 3: Corporativo Élite C-Level */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/design3.jpeg" alt="Corporativo Élite C-Level" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-[#EE334E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Corporativo Élite C-Level</h3>
                  <p className="text-xs text-[#EE334E] font-bold mb-3 tracking-wide uppercase">Direcciones, Firmas & Transnacionales</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Control total y consistencia de marca. Administra colaboradores con nuestra arquitectura B2B Multi-Organización, con branding corporativo forzado, 2FA de seguridad y sincronización con sistemas internos.
                  </p>
                </div>
              </motion.div>

              {/* Opción 4: Sector Salud & Médicos */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#00E5FF]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/medical_schedule.jpeg" alt="Sector Salud & Citas Médicas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#00E5FF]/30 backdrop-blur-md">
                    <span className="text-xl">🩺</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Sector Salud & Especialistas</h3>
                  <p className="text-xs text-[#00E5FF] font-bold mb-3 tracking-wide uppercase">Médicos, Clínicas & Cirujanos</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Cédula Profesional médica verificable visible en tu perfil, agenda directa con Calendly/Google Calendar, enlace a ubicación de consultorio en Google Maps y botón de llamada directa de urgencias.
                  </p>
                </div>
              </motion.div>

              {/* Opción 5: Educación & Mentores */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#10B981]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/teachers_networking.jpeg" alt="Educación & Networking Académico" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#10B981]/30 backdrop-blur-md">
                    <span className="text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Académico & Conferencistas</h3>
                  <p className="text-xs text-[#10B981] font-bold mb-3 tracking-wide uppercase">Profesores, Mentores & Ponentes</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Comparte temarios, artículos de investigación y canales oficiales con alumnos y colegas en simposios internacionales proyectando tu QR interactivo en tu Apple Watch o Smartwatch.
                  </p>
                </div>
              </motion.div>

              {/* Opción 6: Freelancers & Servicios Profesionales */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#F59E0B]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/freelancer_payed.jpeg" alt="Freelancers & Pagos Directos" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#F59E0B]/30 backdrop-blur-md">
                    <span className="text-xl">💼</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Freelancers & Despachos</h3>
                  <p className="text-xs text-[#F59E0B] font-bold mb-3 tracking-wide uppercase">Consultores, Abogados & Creativos</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Muestra tu portafolio de proyectos en alta definición, recibe transferencias bancarias SPEI / PayPal directas y entrega tus cotizaciones digitales en 1 clic mientras recopilas prospectos en tu CRM.
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* WHITE LABEL & SAAS B2B BUSINESS MODEL */}
        <section id="white-label" className="py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[600px] bg-[#EE334E]/10 blur-[150px] pointer-events-none" />

          <motion.div
            className="max-w-7xl mx-auto px-6 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">

              <motion.div variants={fadeIn} className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EE334E]/10 border border-[#EE334E]/30 text-xs font-bold uppercase tracking-wider mb-6 text-[#EE334E]">
                  <Building2 className="w-4 h-4" /> SaaS B2B Multi-Organización
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Modelo de Marca Blanca & Solución Corporativa
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Diseñado para agencias y corporativos que desean operar su propio negocio de tarjetas digitales inteligentes o controlar de forma centralizada la identidad de cientos de colaboradores bajo su propio dominio.
                </p>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Panel de Organizaciones & Enforce Branding</h4>
                      <p className="text-sm text-slate-400">Crea subcuentas para clientes o departamentos con límites de miembros y bloquea el color primario y logotipo institucional para garantizar consistencia absoluta.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">CRM Centralizado & Webhooks</h4>
                      <p className="text-sm text-slate-400">Recibe y canaliza los prospectos de todo el equipo de ventas hacia tu CRM corporativo o servicios externos vía Webhooks seguros.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Aprovisionamiento Web NFC & Dominio Propio</h4>
                      <p className="text-sm text-slate-400">Escribe chips NFC desde el navegador y opera con tu propio dominio personalizado y código fuente descargable bajo infraestructura escalable de Google Cloud.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} className="flex-1 w-full">
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-8 group">
                  <div className="absolute inset-0 bg-[#EE334E]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                  <img src="/presentacion.jpeg" alt="Panel Administrativo B2B" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="bg-[#0a0a10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl relative">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                    <span>Opinión de Líderes Comerciales</span>
                    <span className="text-xs text-[#00E5FF] font-mono">Verificado ★★★★★</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Carlos Mendoza', role: 'Director Comercial Inmobiliario', text: 'El intercambio bidireccional de leads y la integración con Apple Wallet redujo nuestros costos de papelería a cero y duplicó la conversión en ferias.' },
                      { name: 'Ana Sofía Garza', role: 'Chief Marketing Officer', text: 'Con el panel B2B pudimos desplegar las tarjetas de 45 ejecutivos con el branding corporativo blindado en menos de 24 horas.' }
                    ].map((review, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                        </div>
                        <p className="text-sm text-slate-300 italic mb-2">"{review.text}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#EE334E]/20 flex items-center justify-center text-[#EE334E] font-bold text-xs">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs text-white font-bold leading-none">{review.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{review.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 bg-black/40 border-t border-white/5 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#EE334E] font-bold px-3 py-1 rounded-full bg-[#EE334E]/10 border border-[#EE334E]/20 inline-block mb-3">
                TARIFAS TRANSPARENTES
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Planes y Paquetes</h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-4">Elige la solución que mejor se adapte al volumen de tu equipo, tus metas de prospección o tu modelo de agencia.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-semibold mb-8">
                <ShieldCheck className="w-4 h-4" /> Sin letras chiquitas. Sin cargos ocultos. Transparencia total garantizada.
              </div>

              {/* SELECTOR INTERACTIVO: FACTURACIÓN ANUAL VS MENSUAL */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="bg-[#0c0c16] p-1.5 rounded-2xl border border-white/10 flex items-center shadow-xl">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      billingCycle === 'annual'
                        ? 'bg-gradient-to-r from-[#EE334E] to-[#ff0003] text-white shadow-[0_0_20px_rgba(238,51,78,0.45)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Facturación Anual</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase">
                      Ahorra hasta 28%
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white/15 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Facturación Mensual
                  </button>
                </div>

                {/* Banner dinámico de recomendación */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {billingCycle === 'annual'
                    ? '¡Recomendado! Obtienes hasta un 28% de descuento y casi 4 meses gratis con el pago anual.'
                    : '💡 Consejo: Al elegir el pago anual te ahorras hasta $229 USD al año en el Plan Elite Business.'}
                </div>
              </div>
            </motion.div>

            {/* BANNER DESTACADO DE PAQUETE FÍSICO ALL-IN-ONE ($199 MXN) */}
            <motion.div
              variants={fadeIn}
              className="mb-12 bg-gradient-to-r from-[#120a16] via-[#1a0f1b] to-[#0d161d] border border-cyan-400/30 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(0,229,255,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="flex-1 space-y-2 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold font-mono">
                  ✨ PACK DE HARDWARE FÍSICO DE ENTREGA INMEDIATA
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-bruno">
                  Paquete Completo All-in-One (4 Entregables)
                </h3>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Incluye: <strong>1 Tarjeta Inteligente PVC con chip NFC</strong> + <strong>1 Sticker NFC</strong> para el reverso de tu smartphone + <strong>1 Llavero Inteligente</strong> + <strong>1 Tarjeta de Respaldo con QR HD</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400 pt-2">
                  <span className="text-emerald-400 font-bold">✓ Entrega Local en Mexicali, B.C. GRATIS</span>
                  <span>•</span>
                  <span>Envíos nacionales a todo México vía DHL Express</span>
                </div>
              </div>

              <div className="text-center shrink-0 z-10 bg-black/50 p-6 rounded-2xl border border-white/10 min-w-[240px]">
                <span className="text-xs uppercase text-slate-400 font-mono block">Precio de Introducción</span>
                <div className="my-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-cyan-400 font-mono">$199</span>
                  <span className="text-slate-400 ml-1.5 text-sm font-bold">MXN</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">Pago único · Hardware listo para programar</p>
                <Link
                  href="/builder"
                  className="block w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  Configurar mi Paquete
                </Link>
              </div>
            </motion.div>

            {/* GRID DE PLANES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. ESTUDIANTE */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-2">Estudiante</h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-white">Gratis</span>
                </div>
                <p className="text-xs text-[#EE334E] font-semibold mb-6 pb-6 border-b border-white/10">
                  *Requiere correo educativo (.edu) activo.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> 1 Tarjeta digital interactiva
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> 2 Temas básicos de perfil
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> Código QR dinámico descargable
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> Opción de tarjeta física desde $15 USD
                  </li>
                </ul>
                <Link href="/login" className="block text-center w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                  Solicitar Acceso Estudiantil
                </Link>
              </motion.div>

              {/* 2. MEET ME */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Meet Me</h3>
                  {billingCycle === 'annual' && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ahorra 32%
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  {billingCycle === 'annual' ? (
                    <>
                      <span className="text-4xl font-extrabold text-white">$49</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / año</span>
                      <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                        Equivale a solo ~$4.08 USD / mes
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-white">$6</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / mes</span>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        $72 USD al año facturado mensual
                      </p>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  {billingCycle === 'annual'
                    ? 'Tarjeta prémium individual. Pagas anual y ahorras $23 USD.'
                    : 'Suscripción mensual flexible sin contratos forzosos.'}
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>1 Tarjeta Prémium</strong> con hosting en Google Cloud
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Pases Oficiales</strong> Apple & Google Wallet
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Todos los Temas</strong> y estilos desbloqueados
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Tarjeta física PVC + Sticker NFC</strong> gratis
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Modo <strong>Offline PWA</strong> (funciona sin internet)
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes asistidos: $15 USD por revisión.
                  </li>
                </ul>

                {billingCycle === 'annual' && <PayPalButton planId="P-1VJ73284XP012835MNKQJDLI" />}
                <button
                  onClick={() => handleCheckout('meetme', billingCycle)}
                  className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/15 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2"
                >
                  Pagar {billingCycle === 'annual' ? 'Anual ($49 USD)' : 'Mensual ($6 USD/mes)'} con Tarjeta / Apple Pay
                </button>
              </motion.div>

              {/* 3. PROFESIONAL */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Profesional</h3>
                  {billingCycle === 'annual' && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ahorra $89 USD
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  {billingCycle === 'annual' ? (
                    <>
                      <span className="text-4xl font-extrabold text-white">$199</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / año</span>
                      <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                        Equivale a solo ~$16.58 USD / mes
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-white">$24</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / mes</span>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        $288 USD al año facturado mensual
                      </p>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  {billingCycle === 'annual'
                    ? 'Ideal para freelancers y pequeños equipos. Ahorras 31% anual.'
                    : 'Flexibilidad mensual para freelancers y equipos ágiles.'}
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>15 Tarjetas</strong> de presentación digitales
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Módulo <strong>Lead Capture</strong> bidireccional
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Pases <strong>Apple & Google Wallet</strong> en cada perfil
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>5 Temas visuales</strong> abiertos y editables
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Analíticas de visualizaciones y clics
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes asistidos: $12 USD por revisión.
                  </li>
                </ul>

                {billingCycle === 'annual' && <PayPalButton planId="P-9KP25231PY224692PNKQJG6Q" />}
                <button
                  onClick={() => handleCheckout('pro', billingCycle)}
                  className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/15 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2"
                >
                  Pagar {billingCycle === 'annual' ? 'Anual ($199 USD)' : 'Mensual ($24 USD/mes)'} con Tarjeta / Apple Pay
                </button>
              </motion.div>

              {/* 4. EMPRESA BUSINESS (MÁS POPULAR) */}
              <motion.div variants={fadeIn} className="bg-gradient-to-b from-[#1a1114] to-[#0a0a10] border border-[#EE334E]/40 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/70 transition-colors group relative shadow-[0_0_30px_rgba(238,51,78,0.15)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EE334E] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  MÁS POPULAR
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Empresa Business</h3>
                  {billingCycle === 'annual' && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ahorra $99 USD
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  {billingCycle === 'annual' ? (
                    <>
                      <span className="text-4xl font-extrabold text-white">$249</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / año</span>
                      <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                        Equivale a solo ~$20.75 USD / mes
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-white">$29</span>
                      <span className="text-slate-400 ml-1 text-sm font-semibold">USD / mes</span>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        $348 USD al año facturado mensual
                      </p>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  {billingCycle === 'annual'
                    ? 'Solución para fuerzas comerciales estructuradas. Ahorras 28% anual.'
                    : 'Acceso corporativo con facturación mes a mes.'}
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>25 Tarjetas</strong> corporativas disponibles
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Módulo <strong>CRM Centralizado</strong> de prospectos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Pases <strong>Apple & Google Wallet</strong> incluidos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>10 Temas</strong> de diseño corporativo
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Consulta y auditoría de datos</strong> en Admin
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes asistidos: $10 USD por revisión.
                  </li>
                </ul>

                {billingCycle === 'annual' && <PayPalButton planId="P-2PW08512L5046373DNKQI2EY" />}
                <button
                  onClick={() => handleCheckout('business', billingCycle)}
                  className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/20 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/40 text-sm flex items-center justify-center gap-2"
                >
                  Pagar {billingCycle === 'annual' ? 'Anual ($249 USD)' : 'Mensual ($29 USD/mes)'} con Tarjeta / Apple Pay
                </button>
              </motion.div>

              {/* 5. ELITE BUSINESS (ÉNFASIS EN SUSCRIPCIÓN ANUAL Y AHORRO DE $229 USD) */}
              <motion.div variants={fadeIn} className="bg-gradient-to-b from-[#1c1228] via-[#150d1e] to-[#0a0a10] border-2 border-purple-500/50 rounded-3xl p-8 flex flex-col hover:border-purple-400 transition-all group relative shadow-[0_0_35px_rgba(168,85,247,0.25)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-[#EE334E]">
                    Elite Business
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    {billingCycle === 'annual' ? 'Suscripción Anual' : 'Suscripción Mensual'}
                  </span>
                </div>

                <div className="mb-2">
                  {billingCycle === 'annual' ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">$599</span>
                        <span className="text-slate-400 text-sm font-semibold">USD / año</span>
                      </div>
                      <p className="text-xs text-purple-300 font-mono mt-1 font-bold">
                        Equivale a solo ~$49.92 USD / mes
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">$69</span>
                        <span className="text-slate-400 text-sm font-semibold">USD / mes</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        $828 USD al año pagando mes a mes
                      </p>
                    </>
                  )}
                </div>

                {/* DESTACADO ESPECIAL: COMPARATIVA Y AHORRO ANUAL */}
                {billingCycle === 'annual' ? (
                  <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-purple-950/50 border border-emerald-500/40 text-left">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs mb-1">
                      <Flame className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span>¡AHORRAS $229 USD AL AÑO!</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      Obtienes prácticamente <strong>4 meses de servicio gratis</strong> pagando anualmente frente a la tarifa mensual acumulada de $828 USD.
                    </p>
                  </div>
                ) : (
                  <div className="my-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-left">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Ahorra $229 USD con Pago Anual</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      La suscripción anual cuesta solo $599 USD/año ($49.90 USD/mes). ¡Te ahorras $229 USD netos al año!
                    </p>
                  </div>
                )}

                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  {billingCycle === 'annual'
                    ? 'Suscripción anual corporativa para directivos, firmas y empresas en alta expansión.'
                    : 'Suscripción mensual recurrente con capacidad completa para 50 tarjetas y CRM.'}
                </p>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>50 Tarjetas</strong> libres
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Acceso Total</strong> al Panel CRM y exportación CSV
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Escáner OCR</strong> de tarjetas físicas de papel
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Layers className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Editor Libre</strong> (Desbloqueo total de Layout)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Pases <strong>Apple & Google Wallet</strong> incluidos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Soporte prémium prioritario VIP
                  </li>
                </ul>

                {billingCycle === 'annual' && <PayPalButton planId="P-73J83679GV554154TNKQJFMQ" />}
                <button
                  onClick={() => handleCheckout('elite', billingCycle)}
                  className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#EE334E] hover:brightness-110 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] text-sm flex items-center justify-center gap-2"
                >
                  Pagar {billingCycle === 'annual' ? 'Suscripción Anual ($599 USD)' : 'Suscripción Mensual ($69 USD/mes)'}
                </button>
              </motion.div>

              {/* 6. MARCA BLANCA */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/20 rounded-3xl p-8 flex flex-col hover:border-white/50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Marca Blanca</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                    Para Agencias
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-white">$1,499</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1 text-xs block font-mono">Setup Inicial</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Tu propia plataforma SaaS de tarjetas bajo tu dominio e identidad.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <strong>Creación Ilimitada</strong> de tarjetas
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <strong>Identidad y Dominio Propio</strong> (cards.tudominio.com)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <strong>Panel SaaS B2B</strong> de Organizaciones y Empresas
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <strong>Webhooks</strong> y Aprovisionamiento Web NFC
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <strong>Código Fuente</strong> descargable
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Mantenimiento de infraestructura GCP: $159 USD/mes a partir del 2º mes (30 días de prueba sin costo incluidos).
                  </li>
                </ul>

                <PayPalButton planId="P-64483344X0450694PNKQJQYI" />
                <button onClick={() => handleCheckout('marcablanca')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/15 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">
                  Pagar Setup con Tarjeta / Apple Pay
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 bg-black/60 border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#EE334E] font-bold">
                RESOLVEMOS TUS DUDAS
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 font-bruno">Preguntas Frecuentes</h2>
              <p className="text-slate-400">Todo lo que necesitas saber sobre tu tarjeta digital interactiva, hardware NFC y nuevas funciones.</p>
            </div>

            <div className="space-y-4">

              {/* FAQ — QUIÉNES SOMOS */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Quiénes somos?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Somos <span className="text-white font-semibold">TSolutions IPIDD</span>, una empresa mexicana especializada en soluciones de identidad digital y networking empresarial. Nacimos con la misión de modernizar la manera en que profesionales, emprendedores y empresas se presentan al mundo. Diseñamos y fabricamos <span className="text-[#EE334E] font-semibold">ROSE Card</span> — la tarjeta de presentación inteligente que combina tecnología NFC, diseño de alto impacto y una plataforma digital poderosa para que cada presentación sea memorable, efectiva y rastreable.
                </div>
              </details>

              {/* FAQ — QUÉ ES UNA VCARD */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
                    ¿Qué es una vCard?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Una <span className="text-white font-semibold">vCard</span> es tu tarjeta de presentación digital inteligente, alojada en la nube y accesible desde cualquier smartphone con solo un toque NFC o un escaneo de QR. A diferencia de una tarjeta física tradicional que se pierde, se ensucia o queda desactualizada, tu vCard siempre muestra tu información más reciente en tiempo real. Incluye todos tus datos de contacto, redes sociales, portafolio de proyectos, galería de productos, videos, agenda para citas y mucho más — todo en una experiencia visual interactiva y personalizada con tus colores y logotipo.
                </div>
              </details>

              {/* FAQ — PARA QUÉ SIRVE MI VCARD */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Para qué sirve mi vCard?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Tu vCard es tu herramienta de networking más poderosa. Con ella puedes: <span className="text-white font-semibold">compartir todos tus datos de contacto</span> al instante sin que la otra persona escriba nada — solo acerca la tarjeta o muestra el QR y en segundos te tienen guardado en su agenda. Puedes <span className="text-white font-semibold">mostrar tu portafolio</span> de proyectos o productos, <span className="text-white font-semibold">recibir citas en tu calendario</span> directamente, <span className="text-white font-semibold">capturar los datos de tus contactos</span> con el módulo de intercambio bidireccional, y ver en tiempo real cuántas personas visitaron tu tarjeta, desde dónde y qué acciones tomaron. Es tu marca personal siempre activa, 24/7, en el bolsillo de cada cliente que te conoce.
                </div>
              </details>

              {/* NUEVA FAQ: APPLE WALLET & GOOGLE WALLET */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 open:border-purple-500/70 open:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-purple-400 transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    ¿Cómo funcionan los pases oficiales de Apple Wallet y Google Wallet?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Tanto tú como las personas que guardan tu tarjeta pueden descargar tu pase digital con formato oficial <span className="text-white font-semibold">.pkpass para Apple Wallet (iOS)</span> o añadirlo en 1 clic a <span className="text-white font-semibold">Google Wallet (Android)</span>. El pase muestra tu fotografía, nombre, cargo, teléfono y un Código QR dinámico de alta resolución accesible directamente desde la pantalla de bloqueo o dos toques al botón lateral del iPhone, incluso sin conexión a internet.
                </div>
              </details>

              {/* NUEVA FAQ: INTERCAMBIO DE CONTACTOS (LEAD CAPTURE) */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 open:border-cyan-500/70 open:shadow-[0_0_25px_rgba(0,229,255,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-cyan-400 transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    ¿Cómo capturo los datos de la otra persona con el Intercambio de Leads y CRM?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  El networking tradicional es unidireccional (entregas tu tarjeta y esperas que te llamen). En tu vCard inteligente, tu nuevo contacto encuentra el botón destacado <span className="text-cyan-400 font-semibold">"🤝 Intercambiar Contacto"</span>. Al presionarlo se despliega un formulario ágil donde ingresa su nombre, WhatsApp, correo, empresa y notas. Estos datos viajan directamente a tu panel comercial CRM y a tus webhooks de automatización (Zapier / Make / HubSpot), permitiéndote dar seguimiento de inmediato.
                </div>
              </details>

              {/* NUEVA FAQ: MODO OFFLINE */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 open:border-emerald-500/70 open:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-emerald-400 transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    ¿Puedo compartir mi tarjeta si no hay señal celular ni internet (Modo Offline PWA)?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Sí. Nuestra plataforma integra tecnología <span className="text-emerald-400 font-semibold">Progressive Web App (PWA) con Service Worker</span>. Cuando abres tu tarjeta una vez, el navegador almacena de forma segura tu perfil, estilos y código QR en el dispositivo. Si estás en el sótano de una convención, en un túnel o en un avión sin datos, puedes abrir la tarjeta y mostrar el QR o aproximar el NFC para que el receptor descargue tu contacto (.vcf) de inmediato.
                </div>
              </details>

              {/* NUEVA FAQ: SAAS B2B CORPORATIVO */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Cómo funciona para empresas y corporativos con varios colaboradores (SaaS B2B)?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  En los planes Empresa, Elite y Marca Blanca dispones de la consola de administración multi-organización. Puedes crear departamentos o empresas filiales, invitar colaboradores masivamente por correo, controlar la cantidad de tarjetas activas y activar la opción <span className="text-white font-semibold">Enforce Branding</span> para que ningún empleado pueda alterar el logotipo ni el color institucional de la marca.
                </div>
              </details>

              {/* FAQ: SMART WATCH */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Cómo funciona la descarga en Smart Watch?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Tu tarjeta digital genera automáticamente un Código QR dinámico de alto contraste optimizado para pantallas pequeñas. Puedes descargar este QR a la galería de tu Apple Watch, Wear OS o cualquier Smart Watch, permitiendo que compartas tu perfil girando la muñeca, sin necesidad de sacar tu teléfono.
                </div>
              </details>

              {/* FAQ: TRANSPARENCIA Y CUOTAS */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
                    ¿Existen cuotas o letras chiquitas ocultas?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Absolutamente no. La transparencia es nuestro estandarte. El costo cubre estrictamente el mantenimiento de tus datos en servidores en la nube de alta disponibilidad de Google Cloud, garantizando cargas ultrarrápidas y que tu tarjeta jamás se caerá. Si deseas actualizar tus datos, puedes hacerlo directamente desde tu panel de control o consultar nuestros <Link href="/terminos" className="text-[#EE334E] hover:underline">Términos y Condiciones</Link>.
                </div>
              </details>

              {/* FAQ: QUÉ OBTENGO FÍSICAMENTE */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Qué obtengo físicamente al comprar un paquete?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Los paquetes anuales de pago incluyen gratis una (1) Tarjeta Física Inteligente de PVC y un (1) Sticker NFC para el celular con nuestra identidad visual. También puedes adquirir el Paquete Físico All-in-One por solo $199 MXN (4 piezas físicas). Si requieres un lote personalizado con tu diseño corporativo, manufacturamos en PVC Negro Mate, Blanco o Madera Bamboo ecológica.
                </div>
              </details>

              {/* FAQ: COMPATIBILIDAD */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
                    ¿Qué teléfonos son compatibles y qué pasa si el cliente no tiene NFC?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  El 100% de los smartphones actuales (iPhone modelo XR en adelante y casi la totalidad de teléfonos Android) cuentan con lector NFC integrado y leen la tarjeta al instante con solo aproximarla, sin instalar nada. Si el dispositivo de tu cliente es un modelo antiguo sin NFC, la tarjeta física incluye en el reverso tu Código QR dinámico de alta definición para escanear con la cámara y acceder exactamente a la misma experiencia interactiva.
                </div>
              </details>

              {/* FAQ: ACTUALIZAR DATOS */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE334E] shrink-0" />
                    ¿Puedo actualizar mis datos después de tener mi tarjeta física fabricada?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  Sí, de forma ilimitada y en tiempo real. Tu tarjeta física se conecta con tu perfil digital alojado en la nube. Si cambias de número de teléfono, añades un nuevo catálogo de productos, modificas tu puesto o actualizas tus fotos de portada y logotipo desde tu panel de control, los cambios se reflejan inmediatamente en la próxima lectura sin necesidad de reprogramar ni reimprimir el chip físico.
                </div>
              </details>

              {/* FAQ: NO REQUIERE APP */}
              <details className="group bg-[#0a0a10] border border-white/10 hover:border-[#EE334E]/50 rounded-2xl p-6 transition-all duration-300 open:border-[#EE334E]/70 open:shadow-[0_0_25px_rgba(238,51,78,0.15)]">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-base sm:text-lg text-white group-hover:text-[#EE334E] transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
                    ¿La otra persona necesita descargar alguna aplicación para recibir mis datos?
                  </span>
                  <span className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-open:rotate-180 transition-transform duration-300">
                    ▾
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-sans">
                  No. Cero aplicaciones necesarias ni para ti ni para quien recibe tus datos. Al acercar la tarjeta física o escanear el QR, tu tarjeta interactiva se despliega al instante en el navegador nativo del smartphone (Safari, Chrome) y con un solo toque en el botón "Guardar Contacto" descarga tu archivo vCard (.vcf) directamente en la agenda nativa del celular con tu nombre, teléfono, WhatsApp, correo y redes.
                </div>
              </details>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 border-t border-white/10 bg-[#030308] text-center relative z-10">
          <div className="max-w-7xl mx-auto px-6">

            {/* Logo y Nombre */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <img
                src="/roselogo_120x120.png"
                alt="Rose VCards"
                className="w-9 h-9 object-contain"
              />
              <span className="text-2xl font-extrabold tracking-tight text-white font-bruno">
                Rose VCards
              </span>
            </div>

            {/* Bloque de Contacto Directo */}
            <div className="mb-8">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 font-bold">
                ¿Tienes dudas o requieres atención corporativa personalizada?
              </p>
              <a
                href="mailto:contacto@tsolutionsipidd.com"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 hover:bg-[#EE334E]/10 border border-white/10 hover:border-[#EE334E]/50 text-slate-200 hover:text-[#EE334E] text-sm font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(238,51,78,0.25)] group"
              >
                <Mail className="w-4 h-4 text-[#EE334E] group-hover:scale-110 transition-transform" />
                <span>contacto@tsolutionsipidd.com</span>
              </a>
            </div>

            {/* Enlaces Legales & Ecosistema */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-400 mb-6">
              <button onClick={() => setIsGuideOpen(true)} className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                <span>Instructivo de Creación</span>
              </button>
              <span className="hidden sm:inline text-slate-700">•</span>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
              <span className="hidden sm:inline text-slate-700">•</span>
              <Link href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
              <span className="hidden sm:inline text-slate-700">•</span>
              <Link href="/login" className="hover:text-[#EE334E] transition-colors">Acceso a Clientes</Link>
            </div>

            {/* Copyright */}
            <p className="text-slate-500 text-xs font-sans">
              © {new Date().getFullYear()} TSOLUTIONS IPIDD · Rose VCards. Todos los derechos reservados.
            </p>
            <p className="text-[11px] text-slate-600 font-mono mt-1 uppercase tracking-wider">
              Tecnología NFC Contactless · Apple & Google Wallet Engine · Cloud Architecture
            </p>
          </div>
        </footer>
      </div>

      <CreationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
}
