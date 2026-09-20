'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, QrCode, Wallet, ShieldCheck, 
  ArrowRight, ArrowLeft, Smartphone, Zap, Save, Lock, Layers,
  ExternalLink, Eye, Award
} from 'lucide-react';
import brandConfig from '../../brand.config';

export default function CreationGuideModal({ isOpen, onClose, agentInfo = null, onStartBuilder }) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: 'Ingreso & Selección de Estilo',
      icon: Sparkles,
      color: 'from-[#EE334E] to-red-500',
      badge: 'Paso 1'
    },
    {
      step: 2,
      title: 'Datos & Auto-Guardado',
      icon: Save,
      color: 'from-[#00E5FF] to-cyan-500',
      badge: 'Paso 2'
    },
    {
      step: 3,
      title: 'QR HD & Enlace Neón',
      icon: QrCode,
      color: 'from-[#10B981] to-emerald-500',
      badge: 'Paso 3'
    },
    {
      step: 4,
      title: 'Apple & Google Wallet',
      icon: Wallet,
      color: 'from-purple-500 to-indigo-500',
      badge: 'Paso 4'
    },
    {
      step: 5,
      title: 'Privacidad & Portal Cliente',
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-500',
      badge: 'Paso 5'
    }
  ];

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleAction = () => {
    if (onStartBuilder) {
      onStartBuilder();
    } else {
      if (typeof window !== 'undefined') window.location.href = '/builder';
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05050D]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="max-w-4xl w-full bg-[#0B0914]/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(238,51,78,0.3)] text-white relative my-8 overflow-hidden">
        
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EE334E]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00E5FF]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all z-20"
          title="Cerrar Instructivo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* BANNER DE BIENVENIDA PERSONALIZADO SI ES INVITADO POR AGENTE */}
        {agentInfo && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EE334E]/20 via-purple-600/20 to-[#00E5FF]/20 border border-[#EE334E]/40 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EE334E] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(238,51,78,0.5)]">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  ✨ Obsequio de Embajador VIP
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  ¡Bienvenido/a! <span className="text-[#EE334E]">{agentInfo.name}</span> ({agentInfo.company || brandConfig.companyName}) te regaló una Tarjeta Digital NFC Élite
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Has sido invitado/a a crear e instalar tu propia tarjeta interactiva con todas las funciones desbloqueadas. Sigue este instructivo para tener tu vCard lista en 3 minutos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ENCABEZADO PRINCIPAL */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] shrink-0 shadow-[0_0_20px_rgba(238,51,78,0.25)]">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              Manual Interactivo paso a paso
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instructivo de Creación e Instalación de Tarjeta
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Desde el primer clic hasta la instalación en Apple Wallet, Google Wallet y Smart Watch.
            </p>
          </div>
        </div>

        {/* BARRA DE NAVEGACIÓN / STEPPER */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isPassed = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  isActive 
                    ? 'bg-white/10 border-[#EE334E] shadow-[0_0_20px_rgba(238,51,78,0.25)]' 
                    : isPassed
                      ? 'bg-white/5 border-emerald-500/40 text-emerald-300'
                      : 'bg-black/30 border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#EE334E]' : isPassed ? 'text-emerald-400' : 'text-slate-400'}`}>
                    0{s.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#EE334E]' : isPassed ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <p className="text-[11px] font-bold truncate hidden sm:block">
                  {s.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DEL PASO SELECCIONADO */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 sm:p-7 min-h-[300px] flex flex-col justify-between mb-6 relative">
          
          {/* PASO 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE334E]/20 text-[#EE334E] text-xs font-mono font-bold uppercase">
                <Sparkles className="w-4 h-4" /> Paso 1: Ingreso & Elección de Estilo
              </div>
              <h3 className="text-xl font-bold text-white">
                1. Ingresa a la Plataforma y Elige tu Plantilla Visual
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ingresas desde la página principal o a través de tu enlace personalizado de obsequio de agente embajador. Haz clic en <strong className="text-white">"Probar Editor"</strong> o <strong className="text-[#EE334E]">"Crear mi Tarjeta Gratis"</strong> para abrir el constructor visual.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-bold text-[#EE334E] block mb-1">🎨 10 Temas Élite</span>
                  Elige entre Cyber Modern Dark, Monolith Luxury VIP, Minimalista Ejecutivo, Bento Grid o Glassmorphism.
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-bold text-[#00E5FF] block mb-1">🔤 Tipografías de Marca</span>
                  Personaliza fuentes Google Fonts como Inter, Bruno Ace SC, Space Grotesk o Playfair Display.
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-bold text-green-400 block mb-1">📱 Vista Previa en Vivo</span>
                  Visualiza cómo lucirá tu tarjeta en pantallas de iPhone y Android en tiempo real mientras editas.
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-mono font-bold uppercase">
                <Save className="w-4 h-4" /> Paso 2: Edición & Auto-Guardado Instantáneo
              </div>
              <h3 className="text-xl font-bold text-white">
                2. Captura tus Datos Comerciales con Guardado Automático
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rellena tus datos de contacto: Nombre, Puesto, Empresa, WhatsApp, Teléfono directo, Sitio Web, Redes Sociales, Catálogo de Productos en PDF y Video de YouTube corporativo.
              </p>
              
              <div className="p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs space-y-2">
                <p className="font-bold text-[#00E5FF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  🟢 Sistema de Auto-Guardado en Tiempo Real (Auto-Save)
                </p>
                <p className="text-slate-300">
                  No te preocupes si se cierra el navegador o se interrumpe la conexión. <strong>Cada que modificas un campo de texto o subes una imagen, el avance se guarda automáticamente en la nube de Google Cloud</strong> y se sincroniza con tu borrador local.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="font-bold text-white block mb-1">🖼️ Recomendación para Logotipos:</span>
                Sube tu logotipo en formato <strong className="text-[#EE334E]">PNG Transparente sin fondo</strong> (o JPG de alta definición). El sistema lo procesará automáticamente para estamparlo limpio en la tarjeta digital y en el centro de tu código QR HD.
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
                <QrCode className="w-4 h-4" /> Paso 3: Código QR HD & Enlace Neón
              </div>
              <h3 className="text-xl font-bold text-white">
                3. Generación del QR HD Branded y Enlace de Alta Velocidad
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Una vez guardado, tu tarjeta genera automáticamente su enlace público en la nube y tu <strong className="text-white">Código QR Branded de Alta Definición (1200x1200px)</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Logotipo Limpio Sin Fondo Sólido
                  </span>
                  <p className="text-slate-300">
                    El QR incrusta tu logotipo en el centro exacto de forma impecable sin cuadros blancos sólidos que tapen la estética neón del código.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <span className="font-bold text-[#00E5FF] flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Descarga en 1-Click
                  </span>
                  <p className="text-slate-300">
                    Puedes descargar la imagen del QR a tu galería en resolución 4K para imprimir en tarjetas de PVC, folletos, presentaciones o fondo de pantalla.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase">
                <Wallet className="w-4 h-4" /> Paso 4: Instalación en Apple Wallet & Google Wallet
              </div>
              <h3 className="text-xl font-bold text-white">
                4. Instala tu Tarjeta en Apple Wallet, Google Wallet y Smart Watch
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Lleva tu tarjeta en la billetera nativa de tu teléfono celular y compártela sin necesidad de conexión a internet o aplicaciones de terceros.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 text-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-white">
                    <span className="text-base">🍏</span> Apple Wallet (.pkpass)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Al ver tu entregable en iPhone, haz clic en <strong className="text-white">"Añadir a Apple Wallet"</strong>. Se descargará el pase oficial firmando tu contacto con QR de acceso rápido.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 text-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-white">
                    <span className="text-base">🤖</span> Google Wallet (Android)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    En dispositivos Android, presiona <strong className="text-white">"Guardar en Google Wallet"</strong>. El pase digital se agregará a tu app nativa de billetera Google con botón de 1-tap.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 text-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-white">
                    <span className="text-base">⌚</span> Apple Watch & Smart Watch
                  </div>
                  <p className="text-slate-[#00E5FF] leading-relaxed">
                    Guarda la foto de tu QR HD en la app Fotos de tu reloj inteligente. Podrás compartir tu tarjeta simplemente girando la muñeca en cualquier reunión.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 5 */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-4 h-4" /> Paso 5: Privacidad Protegida & Acceso al Portal
              </div>
              <h3 className="text-xl font-bold text-white">
                5. Privacidad de tus Datos & Llave de Acceso a tu Portal
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Entiende cómo funciona la seguridad y privacidad de tu tarjeta digital inteligente:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-500/30 text-xs flex items-start gap-3">
                  <Eye className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block mb-0.5">El Código QR y Enlace son 100% Públicos para tus Clientes:</span>
                    <p className="text-slate-300">
                      Cualquier persona que escanee tu QR o toque tu tarjeta NFC podrá ver tu perfil comercial y guardar tu contacto en su agenda con 1 solo tap.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs flex items-start gap-3">
                  <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-400 block mb-0.5">🔒 El QR NO es una Llave de Acceso a tus Datos Privados:</span>
                    <p className="text-slate-300">
                      Para garantizar la máxima seguridad, <strong>nadie puede modificar tu información ni acceder a tu panel utilizando únicamente tu QR</strong>. Para editar tu tarjeta o gestionar tus documentos, debes ingresar con tu correo y contraseña en el <strong className="text-white font-mono">Portal de Cliente (/portal)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER CON BOTONES DE NAVEGACIÓN Y ACCIÓN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                currentStep === 1 
                  ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono text-slate-400 sm:px-2">
              Paso {currentStep} de {STEPS.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                currentStep === STEPS.length 
                  ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAction}
            className="w-full sm:w-auto px-6 py-3 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_25px_rgba(238,51,78,0.5)] flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span>🚀 Comenzar a Crear mi Tarjeta Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
