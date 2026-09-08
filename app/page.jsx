'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Nfc, 
  ShieldCheck, 
  BarChart3,
  Star,
  Zap,
  ArrowRight,
  MonitorSmartphone,
  Layers
} from 'lucide-react';

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
          createSubscription: function(data, actions) {
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: function(data, actions) {
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
      if (data.url) {
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
      <Script src="https://www.paypal.com/sdk/js?client-id=BAAVBTkbyfhfvSv-LwMOAjKhD4cWmr2himsyOcDfmT_oBblFqSZ5LdvTLDibQfmSi6mSrgCtYcA0YsoMoI&vault=true&intent=subscription" strategy="lazyOnload" />
    <div className="min-h-screen bg-[#05050D] text-slate-200 font-sans selection:bg-[#EE334E] selection:text-white overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05050D]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Nfc className="text-[#EE334E] w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight text-white">Rose VCards</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#use-cases" className="hover:text-white transition-colors">Casos de Uso</a>
            <a href="#white-label" className="hover:text-white transition-colors">Marca Blanca</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
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

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Opción 1 */}
            <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src="/design1.jpeg" alt="Emprendedor NFC" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-5 -mt-14 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                  <Zap className="w-6 h-6 text-[#EE334E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Formal Casual</h3>
                <p className="text-xs text-[#EE334E] font-bold mb-4 tracking-wide uppercase">Emprendedores y Startups</p>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  En el ecosistema de startups nos obsesiona eliminar la fricción. En <strong>Rose VCards</strong> transformamos el primer punto de contacto en un activo de conversión inmediata. Unimos hardware NFC con <strong>Google Cloud</strong>, permitiendo guardar tu perfil con un solo toque, sin apps.
                </p>
              </div>
            </motion.div>

            {/* Opción 2 */}
            <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src="/design2.jpeg" alt="Ejecutivo Ventas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-5 -mt-14 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                  <BarChart3 className="w-6 h-6 text-[#EE334E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Ejecutivo Comercial</h3>
                <p className="text-xs text-[#EE334E] font-bold mb-4 tracking-wide uppercase">Pymes y Dir. de Ventas</p>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  El networking tradicional arrastra un costo oculto: prospectos que se enfrían y tarjetas descartadas. Modernizamos la prospección fusionando NFC prémium con la alta disponibilidad de <strong>Google Cloud</strong>. Centralizamos la identidad de tu fuerza comercial con tecnología de vanguardia.
                </p>
              </div>
            </motion.div>

            {/* Opción 3 */}
            <motion.div variants={scaleIn} className="bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden hover:border-[#EE334E]/50 transition-colors group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src="/design3.jpeg" alt="Corporativo Elite" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-12 h-12 bg-[#EE334E]/10 rounded-xl flex items-center justify-center mb-5 -mt-14 relative z-20 border border-[#EE334E]/30 backdrop-blur-md">
                  <ShieldCheck className="w-6 h-6 text-[#EE334E]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Profesional Élite</h3>
                <p className="text-xs text-[#EE334E] font-bold mb-4 tracking-wide uppercase">C-Level Transnacionales</p>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  La consistencia de marca y la seguridad no son negociables. Redefinimos el intercambio corporativo mediante una infraestructura de grado empresarial en <strong>Google Cloud Platform</strong>. Proveemos una solución que refuerza la soberanía de datos y proyecta liderazgo.
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
              <button onClick={() => handleCheckout('meetme')} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold group-hover:bg-[#EE334E] transition-all">
                Obtener Meet Me
              </button>
                <PayPalButton planId="P-1VJ73284XP012835MNKQJDLI" />
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
              <button onClick={() => handleCheckout('pro')} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold group-hover:bg-[#EE334E] transition-all">
                Contratar Pro
              </button>
                <PayPalButton planId="P-9KP25231PY224692PNKQJG6Q" />
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
              <button onClick={() => handleCheckout('business')} className="w-full py-3 rounded-xl bg-[#EE334E] text-white font-bold hover:bg-[#ff0003] transition-colors shadow-lg">
                Contratar Empresa
              </button>
                <PayPalButton planId="P-2PW08512L5046373DNKQI2EY" />
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
              <button onClick={() => handleCheckout('elite')} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#EE334E] text-white font-bold hover:opacity-90 transition-opacity">
                  Contratar Elite
              </button>
                <PayPalButton planId="P-73J83679GV554154TNKQJFMQ" />
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
              <button onClick={() => handleCheckout('marcablanca')} className="w-full text-center w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                Contratar Marca Blanca
                </button>
                <PayPalButton planId="P-64483344X0450694PNKQJQYI" />
            </motion.div>
          </div>
          </motion.div>
        </section>

              {/* FAQ SECTION */}
        <section className="py-24 bg-black/60 border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
              <p className="text-slate-400">Todo lo que necesitas saber, con total transparencia.</p>
            </div>
            <div className="space-y-4">
              
              <div className="bg-[#0a0a10] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">¿Cómo funciona la descarga en Smart Watch?</h3>
                <p className="text-slate-400 text-sm">Tu tarjeta digital genera automáticamente un Código QR dinámico de alto contraste optimizado para pantallas pequeñas. Puedes descargar este QR a la galería de tu Apple Watch, Wear OS o cualquier Smart Watch, permitiendo que compartas tu perfil girando la muñeca, sin necesidad de sacar tu teléfono.</p>
              </div>

              <div className="bg-[#0a0a10] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">¿Existen cuotas o letras chiquitas ocultas?</h3>
                <p className="text-slate-400 text-sm">Absolutamente no. La transparencia es nuestro estandarte. El costo anual que pagas cubre estrictamente el mantenimiento de tus datos en servidores de Google Cloud, garantizando cargas ultrarrápidas y que tu tarjeta jamás se caerá. Si deseas actualizar tus datos (cambiar tu número, correo, etc.), se aplica un costo de revisión transparente y predecible detallado en nuestros <Link href="/terminos" className="text-[#EE334E] hover:underline">Términos y Condiciones</Link>.</p>
              </div>

              <div className="bg-[#0a0a10] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">¿Qué obtengo físicamente al comprar un paquete?</h3>
                <p className="text-slate-400 text-sm">Todos los paquetes de pago incluyen gratis una (1) Tarjeta Física Inteligente de PVC y un (1) Sticker NFC para el celular con nuestra identidad visual. Si prefieres un diseño con tu propio logotipo corporativo, puedes solicitar la manufactura personalizada en PVC Blanco, Negro o Bamboo por  USD adicionales.</p>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#030308] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Nfc className="text-slate-500 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-slate-400">Rose VCards</span>
          </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500 mb-6">
            <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <span className="hidden md:block">•</span>
            <Link href="/terminos" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
          </div>
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Rose VCards. Todos los derechos reservados. <br className="md:hidden" />
            Potenciado por Google Cloud Platform.
          </p>
        </div>
      </footer>
    </div>
    </>

  );
}
