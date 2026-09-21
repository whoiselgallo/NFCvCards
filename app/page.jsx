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
  BookOpen
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
  const [isReady, setIsReady] = React.useState(false);
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
  const handleCheckout = async (planId) => {
    // Aquí puedes agregar validación de sesión para enviar el email del usuario logueado
    // Por ahora redirigimos al checkout donde Stripe pedirá el correo
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }) // Si está logueado, pasar email
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
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Variantes de animación comunes
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
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
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#05050D]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/roselogo_120x120.png"
                alt="Rose VCards"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">Rose VCards</span>
            </div>

            {/* Botón de Inicio de Sesión para Celulares (Visible en Móvil) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-xs text-[#00E5FF] hover:text-white px-2 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Instructivo</span>
              </button>
              <Link
                href="/builder"
                className="text-xs text-slate-300 hover:text-white px-2 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                Editor
              </Link>
              <Link
                href="/login"
                className="text-white bg-gradient-to-r from-[#EE334E] to-[#ff0003] hover:brightness-110 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(238,51,78,0.4)] flex items-center gap-1"
              >
                <span>Iniciar Sesión</span>
              </Link>
            </div>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#use-cases" className="hover:text-white transition-colors">Casos de Uso</a>
              <a href="#white-label" className="hover:text-white transition-colors">Marca Blanca</a>
              <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-[#00E5FF] hover:text-white bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
              >
                <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                <span>Instructivo</span>
              </button>
              <Link href="/login" className="text-white bg-[#EE334E] hover:bg-[#ff0003] px-4 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(238,51,78,0.3)]">Iniciar Sesión</Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center overflow-hidden">
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
            {/* Difuminado en los bordes para fusionar con el fondo */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05050D] via-transparent to-[#05050D]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050D] via-transparent to-[#05050D]" />
          </div>

          {/* Círculo de resplandor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#EE334E]/20 rounded-full blur-[120px] pointer-events-none z-0" />

          <motion.div
            className="max-w-7xl mx-auto px-6 relative z-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-8 text-slate-300 backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#EE334E]" />
              <span>El Futuro del Networking Corporativo</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight text-center" style={{ fontFamily: 'Plaster, sans-serif', fontWeight: 400 }}>
              Convierte ese primer contacto en un...
              <div className="block w-full h-[80px] md:h-[120px] relative my-4 text-[#EE334E] text-[10vw] sm:text-5xl md:text-7xl flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-2xl">
              Unimos hardware NFC de alta gama con la velocidad y robustez de Google Cloud. Escala la presencia de tu negocio y dale autonomía completa a tus clientes con nuestra solución de Marca Blanca.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(238,51,78,0.4)]">
                Ver Planes y Precios
              </a>
              <Link href="/builder" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                Probar Editor <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="w-full sm:w-auto px-7 py-4 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 backdrop-blur-md rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                <span>📖 Ver Instructivo</span>
              </button>
            </motion.div>
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
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Diseñado para cada etapa de tu negocio</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Soluciones escalables que se adaptan desde el emprendedor individual hasta el corporativo transnacional.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Opción 1: Design 1 - Emprendedor & Startup Tech */}
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
                    En el ecosistema de startups nos obsesiona eliminar la fricción. Transformamos el primer punto de contacto en un activo de conversión inmediata. Unimos hardware NFC con <strong>Google Cloud</strong>, permitiendo guardar tu perfil con un solo toque, sin instalar apps.
                  </p>
                </div>
              </motion.div>

              {/* Opción 2: Design 2 - Ejecutivo Ventas & Pymes */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/design2.jpeg" alt="Diseño Ejecutivo Comercial" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                    <BarChart3 className="w-6 h-6 text-[#EE334E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Ejecutivo Comercial</h3>
                  <p className="text-xs text-[#EE334E] font-bold mb-3 tracking-wide uppercase">Pymes & Directores de Ventas</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    El networking tradicional arrastra un costo oculto: prospectos que se enfrían. Modernizamos la prospección fusionando NFC prémium con la alta disponibilidad de <strong>Google Cloud</strong>. Centralizamos la identidad de tu fuerza comercial con tecnología de vanguardia.
                  </p>
                </div>
              </motion.div>

              {/* Opción 3: Design 3 - Corporativo Élite C-Level */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/design3.jpeg" alt="Corporativo Élite C-Level" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-[#EE334E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Corporativo Élite</h3>
                  <p className="text-xs text-[#EE334E] font-bold mb-3 tracking-wide uppercase">C-Level Transnacionales & Firmas</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    La consistencia de marca y la seguridad no son negociables. Redefinimos el intercambio corporativo mediante una infraestructura de grado empresarial en <strong>Google Cloud Platform</strong>. Proveemos una solución que refuerza la soberanía de datos y proyecta liderazgo.
                  </p>
                </div>
              </motion.div>

              {/* Opción 4: Sector Salud & Citas Médicas */}
              <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#00E5FF]/50 transition-colors group flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src="/medical_schedule.jpeg" alt="Sector Salud & Citas Médicas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-20 border border-[#00E5FF]/30 backdrop-blur-md">
                    <span className="text-xl">🩺</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Sector Salud & Médicos</h3>
                  <p className="text-xs text-[#00E5FF] font-bold mb-3 tracking-wide uppercase">Médicos, Clínicas & Especialistas</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Agendamiento inmediato de consultas mediante integración con Google Calendar y Calendly. Tus pacientes guardan tu contacto directo de urgencias y ubicación de consultorio en Google Maps con 1 tap.
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
                  <h3 className="text-xl font-bold text-white mb-1">Académico & Educación</h3>
                  <p className="text-xs text-[#10B981] font-bold mb-3 tracking-wide uppercase">Profesores, Mentores & Conferencistas</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Comparte programas de estudio, enlaces de investigación y canales de comunicación oficial con alumnos y colegas en ponencias internacionales con tecnología NFC sostenible sin papel.
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
                  <h3 className="text-xl font-bold text-white mb-1">Freelancers & Servicios</h3>
                  <p className="text-xs text-[#F59E0B] font-bold mb-3 tracking-wide uppercase">Consultores, Creadores & Despachos</p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    Muestra tu portafolio de proyectos en alta definición, recibe transferencias bancarias SPEI / PayPal directas y envía tus entregables digitales en 1-click a tus clientes.
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* WHITE LABEL & BUSINESS MODEL */}
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider mb-6 text-slate-300">
                  <MonitorSmartphone className="w-4 h-4 text-[#EE334E]" /> SaaS Inteligente
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Modelo de Marca Blanca</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Diseñado para agencias y empresas que desean revender nuestra tecnología. Le damos autonomía completa a tu cliente bajo tu propia marca, respaldado por un sistema robusto y escalable.
                </p>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Autonomía Completa al Cliente</h4>
                      <p className="text-sm text-slate-400">Tus clientes gestionan sus perfiles, tarjetas y métricas de forma 100% independiente en su propio panel.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Mantenimiento Mensual (Contrato Anual)</h4>
                      <p className="text-sm text-slate-400">Asegura ingresos recurrentes vendiendo suscripciones de mantenimiento y hosting con contratos de 1 año.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EE334E]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#EE334E]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Soporte Premium y Actualizaciones</h4>
                      <p className="text-sm text-slate-400">Soporte técnico dedicado y actualizaciones continuas basadas en las sugerencias y necesidades de los clientes.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} className="flex-1 w-full">
                {/* Imagen Integrada en la sección */}
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-8 group">
                  <div className="absolute inset-0 bg-[#EE334E]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                  <img src="/presentacion.jpeg" alt="Panel Administrativo" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Review Cards flotantes simulando interfaz */}
                <div className="bg-[#0a0a10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                  <h3 className="text-xl font-bold text-white mb-6">Valoración y Reseñas</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Carlos Mendoza', role: 'Director Comercial', text: 'Redujo nuestros costos de impresión a cero y aumentó la retención de prospectos en un 40%.' },
                      { name: 'Ana Sofía', role: 'Startup Founder', text: 'Tener autonomía completa sobre el diseño y ver las analíticas en tiempo real es increíble.' }
                    ].map((review, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                        </div>
                        <p className="text-sm text-slate-300 italic mb-3">"{review.text}"</p>
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
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Planes y Paquetes</h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-4">Elige el paquete que mejor se adapte al volumen de tu equipo o tu modelo de agencia.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" /> Sin letras chiquitas. Sin cargos ocultos. Transparencia total garantizada.
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. ESTUDIANTE */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-2">Estudiante</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">Gratis</span>
                </div>
                <p className="text-xs text-[#EE334E] font-semibold mb-6 pb-6 border-b border-white/10">
                  *Requiere correo educativo (.edu) activo.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> 1 Tarjeta digital básica
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> 2 Temas básicos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> Tarjeta física desde $15 USD
                  </li>
                </ul>
                <Link href="/login" className="block text-center w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">Solicitar Acceso</Link>
              </motion.div>

              {/* 2. MEET ME */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/50 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-2">Meet Me</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$49</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1">/año</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Tarjeta súper premium para el usuario individual.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> 1 Tarjeta Premium
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Todos los Temas</strong> desbloqueados
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Tarjeta física y sticker gratis
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes de datos: $15 USD por revisión.
                  </li>
                </ul>

                <PayPalButton planId="P-1VJ73284XP012835MNKQJDLI" />
                <button onClick={() => handleCheckout('meetme')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>
              </motion.div>

              {/* 3. PROFESIONAL */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/50 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-2">Profesional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$199</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1">/año</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Ideal para freelancers y pequeños equipos.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>15 Tarjetas</strong> de presentación
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>5 Temas</strong> abiertos
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes de datos: $12 USD por revisión.
                  </li>
                </ul>

                <PayPalButton planId="P-9KP25231PY224692PNKQJG6Q" />
                <button onClick={() => handleCheckout('pro')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>
              </motion.div>

              {/* 4. EMPRESA */}
              <motion.div variants={fadeIn} className="bg-gradient-to-b from-[#1a1114] to-[#0a0a10] border border-[#EE334E]/30 rounded-3xl p-8 flex flex-col hover:border-[#EE334E]/60 transition-colors group relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EE334E] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MÁS POPULAR
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Empresa</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$249</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1">/año</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Corporativos con equipos estructurados.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>25 Tarjetas</strong> disponibles
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>10 Temas</strong> estáticos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>Consulta de Datos</strong> en el Admin
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes de datos: $10 USD por revisión.
                  </li>
                </ul>

                <PayPalButton planId="P-2PW08512L5046373DNKQI2EY" />
                <button onClick={() => handleCheckout('business')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>
              </motion.div>

              {/* 5. ELITE BUSINESS */}
              <motion.div variants={fadeIn} className="bg-gradient-to-b from-[#1a1525] to-[#0a0a10] border border-purple-500/30 rounded-3xl p-8 flex flex-col hover:border-purple-500/60 transition-colors group">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#EE334E] mb-2">Elite Business</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$599</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1">/año</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Expansión sin límites y máxima personalización.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>50 Tarjetas</strong> libres
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Acceso Total</strong> al Panel Admin
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Layers className="w-5 h-5 text-purple-400 shrink-0" /> Editor Libre (Desbloqueo de Layout)
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Ajustes de datos: $8 USD por revisión.
                  </li>
                </ul>

                <PayPalButton planId="P-73J83679GV554154TNKQJFMQ" />
                <button onClick={() => handleCheckout('elite')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>
              </motion.div>

              {/* 6. MARCA BLANCA */}
              <motion.div variants={fadeIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/30 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-2">Marca Blanca</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$1,499</span><span className="text-slate-400 ml-1 text-sm">USD</span>
                  <span className="text-slate-400 ml-1">Setup</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                  Para Agencias. Tu propia plataforma y dominio.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Creación de Tarjetas Ilimitada
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Identidad y Dominio Propio
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" /> Código Fuente Descargable
                  </li>
                  <li className="flex items-start gap-3 text-xs text-slate-400">
                    *Mantenimiento Infraestructura GCP mensual.
                  </li>
                </ul>

                <PayPalButton planId="P-64483344X0450694PNKQJQYI" />
                <button onClick={() => handleCheckout('marcablanca')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-black/60 border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#EE334E] font-bold">
                RESOLVEMOS TUS DUDAS
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 font-bruno">Preguntas Frecuentes</h2>
              <p className="text-slate-400">Todo lo que necesitas saber sobre tu tarjeta digital interactiva y hardware NFC.</p>
            </div>

            <div className="space-y-4">

              {/* FAQ 1 */}
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

              {/* FAQ 2 */}
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
                  Absolutamente no. La transparencia es nuestro estandarte. El costo anual que pagas cubre estrictamente el mantenimiento de tus datos en servidores en la nube de alta disponibilidad, garantizando cargas ultrarrápidas y que tu tarjeta jamás se caerá. Si deseas actualizar tus datos, puedes hacerlo directamente desde tu panel de control o consultar nuestros <Link href="/terminos" className="text-[#EE334E] hover:underline">Términos y Condiciones</Link>.
                </div>
              </details>

              {/* FAQ 3 */}
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
                  Todos los paquetes de pago incluyen gratis una (1) Tarjeta Física Inteligente de PVC y un (1) Sticker NFC para el celular con nuestra identidad visual. Si prefieres un diseño con tu propio logotipo corporativo, puedes solicitar la manufactura personalizada en PVC Blanco, Negro Mate o Madera Bamboo ecológica.
                </div>
              </details>

              {/* NUEVA FAQ 4 */}
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

              {/* NUEVA FAQ 5 */}
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

              {/* NUEVA FAQ 6 */}
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

            {/* Enlaces Legales */}
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
              Tecnología NFC Contactless & Cloud Engine
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
