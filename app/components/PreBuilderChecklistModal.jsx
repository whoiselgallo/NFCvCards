'use client';

import React from 'react';
import { 
  AlertTriangle, CheckCircle, FileText, Image, Video, 
  MapPin, Calendar, CreditCard, ArrowRight, X, Phone, 
  Sparkles, ShieldCheck, Download
} from 'lucide-react';

export default function PreBuilderChecklistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="max-w-3xl w-full bg-[#0a0a12] border border-[#EE334E]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(238,51,78,0.25)] text-white relative my-8">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Cerrar advertencia"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado con Advertencia */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EE334E]/10 border border-[#EE334E]/30 flex items-center justify-center text-[#EE334E] shrink-0 mt-1 shadow-[0_0_20px_rgba(238,51,78,0.2)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EE334E]/20 text-[#EE334E] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              Paso Previo Obligatorio • Checklist de Construcción
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Antes de Comenzar a Construir tu vCard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Para garantizar que tu tarjeta digital quede <strong className="text-white">100% operativa en el primer intento y sin errores</strong>, es indispensable que tengas listos los siguientes archivos, documentos y datos de tu empresa.
            </p>
          </div>
        </div>

        {/* Resumen de Requisitos y Archivos */}
        <div className="space-y-4 my-6 max-h-[50vh] overflow-y-auto pr-1">
          
          {/* GRUPO 1: ARCHIVOS Y MEDIOS DIGITALES */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#EE334E] font-bold flex items-center gap-1.5 mb-2.5">
              <span>📁</span> Archivos y Documentos Digitales Requeridos:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-[#EE334E]/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#EE334E]/10 text-[#EE334E] flex items-center justify-center shrink-0 mt-0.5">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Logotipo o Foto de Perfil</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Archivo <strong className="text-slate-200">PNG transparente</strong> o JPG de alta resolución (mínimo 500x500 px).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-purple-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Foto de Portada / Banner</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Imagen panorámica horizontal (16:9 o 1200x600 px) de tu oficina, equipo o publicidad.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-blue-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Catálogo o Menú en PDF</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enlace web o archivo PDF descargable con tu lista de precios, portafolio o brochure corporativo.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-red-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Video Corporativo de YouTube</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enlace de YouTube de tu pitch comercial o video institucional para reproducir en la tarjeta.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* GRUPO 2: CONVERSIÓN Y CONTACTO DIRECTO */}
          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold flex items-center gap-1.5 mb-2.5">
              <span>⚡</span> Puntos de Conversión, Enlaces y Datos Comerciales:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-green-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">WhatsApp & Teléfono Directo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Número telefónico con clave internacional (ej: <span className="font-mono text-slate-300">+52 55...</span>) para enlace directo de chat.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-emerald-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Ubicación Google Maps</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enlace de Google Maps de tu sucursal o dirección para abrir la ruta en Waze y Apple Maps.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-amber-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Agenda Calendly o Google Calendar</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enlace a tu calendario en línea para que tus clientes agenden citas automáticamente.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Pasarela de Cobro y Cuentas</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enlace de PayPal.me o datos bancarios (CLABE / Banco / Beneficiario) para recibir pagos inmediatos.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Alerta de Recomendación */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-slate-300 mb-6">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p>
            <strong className="text-white">Tip Profesional:</strong> Si te falta algún archivo, puedes comenzar con tus datos básicos y regresar a subir tus imágenes y catálogos en cualquier momento desde tu portal de gestión.
          </p>
        </div>

        {/* Botón CTA de Continuar */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EE334E] via-[#ff0003] to-[#EE334E] hover:brightness-125 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(238,51,78,0.5)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Tengo todo listo — Comenzar a Construir mi Tarjeta</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}