'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Nfc, 
  Cloud, 
  Smartphone, 
  ShieldCheck, 
  BarChart3,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import brandConfig from '../brand.config';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05050D] text-slate-200 font-sans selection:bg-[#EE334E] selection:text-white">
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
            <Link href="/builder" className="text-[#EE334E] hover:text-white transition-colors">Entrar al Editor</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#EE334E]/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-8 text-slate-300">
            <Zap className="w-4 h-4 text-[#EE334E]" />
            <span>El Futuro del Networking Corporativo</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Transforma cada contacto <br className="hidden md:block" /> en una <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE334E] to-[#ff6b81]">Máquina de Ventas</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Unimos hardware NFC de alta gama con la velocidad y robustez de Google Cloud. Escala la presencia de tu negocio y dale autonomía completa a tus clientes con nuestra solución de Marca Blanca.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(238,51,78,0.4)]">
              Ver Planes y Precios
            </a>
            <Link href="/builder" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
              Probar Editor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* USE CASES SECTION (The 3 Options provided by User) */}
      <section id="use-cases" className="py-24 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Diseñado para cada etapa de tu negocio</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Soluciones escalables que se adaptan desde el emprendedor individual hasta el corporativo transnacional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opción 1 */}
            <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 hover:border-[#EE334E]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#EE334E]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-[#EE334E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Formal Casual</h3>
              <p className="text-sm text-[#EE334E] font-semibold mb-6">Para Emprendedores, Startups y Fundadores</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                En el ecosistema de startups nos obsesiona eliminar la fricción: optimizamos embudos, automatizamos procesos y medimos cada conversión. Sin embargo, seguimos yendo a eventos entregando cartón olvidado.
                En <strong>Rose VCards</strong> transformamos ese primer punto de contacto en un activo de conversión inmediata. Unimos hardware NFC con <strong>Google Cloud</strong>, permitiendo guardar tu perfil con un solo toque, sin apps y con compatibilidad .vcf.
              </p>
            </div>

            {/* Opción 2 */}
            <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 hover:border-[#EE334E]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#EE334E]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-[#EE334E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ejecutivo Comercial</h3>
              <p className="text-sm text-[#EE334E] font-semibold mb-6">Para Directores de Ventas y Pymes</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                El networking tradicional arrastra un costo oculto: prospectos que se enfrían y un 88% de tarjetas impresas descartadas. <strong>Rose VCards</strong> moderniza la prospección fusionando NFC prémium con la arquitectura de alta disponibilidad de <strong>Google Cloud</strong>.
                La información se transfiere de forma nativa e inmediata vía .vcf. Centralizamos la identidad de su fuerza comercial, garantizando vanguardia, agilidad en ventas y cero costes de reimpresión.
              </p>
            </div>

            {/* Opción 3 */}
            <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 hover:border-[#EE334E]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#EE334E]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-[#EE334E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Profesional Élite</h3>
              <p className="text-sm text-[#EE334E] font-semibold mb-6">Para Directores y C-Level Transnacionales</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                La consistencia de marca y la seguridad son no negociables. <strong>Rose VCards</strong> redefine el intercambio corporativo mediante una infraestructura de grado empresarial en <strong>Google Cloud Platform</strong>, garantizando disponibilidad 24/7 y latencias mínimas.
                Proveemos una solución centralizada que mitiga la fricción operativa, refuerza la soberanía de datos comerciales y proyecta el liderazgo tecnológico que sus socios globales exigen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHITE LABEL & BUSINESS MODEL */}
      <section id="white-label" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Modelo de Marca Blanca (SaaS)</h2>
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
                    <p className="text-sm text-slate-400">Soporte técnico dedicado y actualizaciones continuas basadas en las sugerencias y necesidades reales de los clientes.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EE334E]/20 to-transparent rounded-3xl blur-3xl"></div>
              <div className="relative bg-[#0a0a10] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Valoración y Reseñas del Producto</h3>
                
                <div className="space-y-6">
                  {[
                    { name: 'Carlos Mendoza', role: 'Director Comercial', text: 'La adopción de Rose VCards redujo nuestros costos de impresión a cero y aumentó la retención de prospectos en un 40%.' },
                    { name: 'Ana Sofía', role: 'Startup Founder', text: 'Tener autonomía completa sobre el diseño de mi tarjeta y ver las analíticas en tiempo real es un game-changer absoluto.' },
                    { name: 'Roberto Garza', role: 'CEO Transnacional', text: 'La infraestructura en Google Cloud nos da la tranquilidad de que nuestra fuerza de ventas siempre estará conectada y segura.' }
                  ].map((review, i) => (
                    <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                      </div>
                      <p className="text-sm text-slate-300 italic mb-4">"{review.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EE334E]/20 flex items-center justify-center text-[#EE334E] font-bold text-xs">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold leading-none">{review.name}</p>
                          <p className="text-xs text-slate-500">{review.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Planes y Paquetes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Elige el paquete que mejor se adapte al volumen de tu equipo o tu modelo de agencia. Todos incluyen soporte en Google Cloud.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. ESTUDIANTE */}
            <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">Estudiante</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Gratis</span>
              </div>
              <p className="text-xs text-[#EE334E] font-semibold mb-6 pb-6 border-b border-white/10">
                *Requiere correo educativo (.edu) activo de cualquier parte del mundo.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> Tarjeta digital básica
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" /> Uso estrictamente académico
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                Solicitar Acceso
              </button>
            </div>

            {/* 2. PROFESIONAL */}
            <div className="bg-[#0a0a10] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">Profesional</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Pro</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                Ideal para freelancers, consultores y pequeños equipos.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>5 Temas</strong> abiertos
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Hasta <strong>15 Tarjetas</strong> de presentación
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Soporte estándar
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                Contratar Pro
              </button>
            </div>

            {/* 3. EMPRESA */}
            <div className="bg-[#0a0a10] border border-[#EE334E]/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(238,51,78,0.15)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EE334E] text-white text-xs font-bold px-4 py-1 rounded-full">
                MÁS POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Empresa</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Business</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                Para corporativos en crecimiento con equipos de ventas estructurados.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>10 Temas</strong> estáticos
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> <strong>25 Tarjetas</strong> disponibles
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Acceso a <strong>Consulta de Datos</strong> en el Admin
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#EE334E] shrink-0" /> Soporte Premium
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-[#EE334E] text-white font-bold hover:bg-[#ff0003] transition-colors shadow-lg">
                Contratar Empresa
              </button>
            </div>

            {/* 4. ELITE BUSINESS PLUS */}
            <div className="bg-gradient-to-b from-[#1a1525] to-[#0a0a10] border border-purple-500/30 rounded-3xl p-8 flex flex-col hover:border-purple-500/60 transition-colors">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#EE334E] mb-2">Elite Business Plus</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Elite</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-white/10">
                Control absoluto, expansión sin límites y máxima personalización.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Todo lo anterior</strong>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>50 Tarjetas</strong> libres incluidas
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> <strong>Acceso Total</strong> al Panel Admin
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Editor Libre <strong>(Módulo de Diseño)</strong>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Compra de espacio/tarjetas adicionales
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#EE334E] text-white font-bold hover:opacity-90 transition-opacity">
                Contactar Ventas
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#030308] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Nfc className="text-slate-500 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-slate-400">Rose VCards</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Rose VCards. Todos los derechos reservados. <br className="md:hidden" />
            Potenciado por Google Cloud Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
