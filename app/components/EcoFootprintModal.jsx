'use client';

import React, { useState } from 'react';
import { X, Leaf, Truck, CheckCircle2, Gift, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function EcoFootprintModal({
  isOpen,
  onClose,
  slug,
  onContinueShipping,
  shippingLocation = 'mexicali',
  setShippingLocation
}) {
  const [step, setStep] = useState('question'); // 'question' | 'calc' | 'desisted' | 'shipping'
  const [couponCode, setCouponCode] = useState('ECO-VITALICIO-2026');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Formulario de Envío
  const [shippingData, setShippingData] = useState({
    destinatario: '',
    calleNumero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    telefonoContacto: '',
    instrucciones: ''
  });

  if (!isOpen) return null;

  const handleDesist = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`eco_coupon_${slug || 'general'}`, 'ECO-VITALICIO-2026');
    }
    setStep('desisted');
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#09090F] border border-gray-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#0F0F1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <span>Iniciativa Huella Ecológica Cero</span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Compromiso Ambiental y Tarjeta Física Inteligente NFC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-300">
          
          {/* PASO 1: PREGUNTA INICIAL */}
          {step === 'question' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                🌍
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wider">
                  ¿Deseas solicitar tu Tarjeta Física NFC?
                </h4>
                <p className="text-xs text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Tu tarjeta digital interactiva ya vive al 100% en la nube y puede compartirse vía código QR HD, enlace directo, WhatsApp, Apple Wallet y descarga .VCF sin generar ningún residuo físico.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleDesist}
                  className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-emerald-900/30 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all group shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                >
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-xs uppercase font-mono mb-1">
                    <span>🌱 100% Digital</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">Premio Eco</span>
                  </div>
                  <p className="text-white font-bold text-xs">NO, prefiero cuidar el planeta</p>
                  <p className="text-[10px] text-emerald-300/80 mt-1">Recibe un cupón vitalicio de ediciones ilimitadas sin costo.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('calc')}
                  className="p-4 rounded-2xl bg-white/5 border border-gray-800 hover:border-gray-700 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-gray-400 font-bold text-xs uppercase font-mono mb-1">
                    <span>📦 Tarjeta Física</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">Evaluar</span>
                  </div>
                  <p className="text-white font-bold text-xs">SÍ, quiero evaluar la física</p>
                  <p className="text-[10px] text-gray-400 mt-1">Conoce el cálculo de huella de carbono antes de confirmar.</p>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: CÁLCULO DE HUELLA Y DECISIÓN CONSCIENTE */}
          {step === 'calc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-[#EE334E]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#EE334E] uppercase flex items-center gap-1.5">
                    <span>⚠️</span> Estimación de Huella de Carbono
                  </span>
                  <span className="text-xs font-mono bg-black/60 px-2.5 py-1 rounded text-[#EE334E] font-bold border border-[#EE334E]/30">
                    ~2.80 kg CO2e
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  La manufactura, grabado por láser, empaquetado plástico y traslado logístico de una tarjeta física genera en promedio:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 bg-black/40 rounded-xl border border-gray-800">
                    <span className="text-gray-400 block">PVC / Aleación & Chip:</span>
                    <span className="text-white font-bold">1.35 kg CO2e</span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-gray-800">
                    <span className="text-gray-400 block">Empaque & Plásticos:</span>
                    <span className="text-white font-bold">0.30 kg CO2e</span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-gray-800 col-span-2">
                    <span className="text-gray-400 block">Logística de Envío y Última Milla:</span>
                    <span className="text-white font-bold">1.15 kg CO2e</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
                <div className="text-2xl">🌱</div>
                <div>
                  <h5 className="font-bold text-white text-xs">Tu Tarjeta Digital Interactivo: 0.001 kg CO2e</h5>
                  <p className="text-[11px] text-emerald-300/90 mt-0.5">
                    Al utilizar tu identidad digital en tu teléfono, ahorras el 99.9% de emisiones y evitas la tala de árboles de tarjetas de papel tradicionales.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="font-bold text-white uppercase font-mono text-[11px] text-center">
                  ¿Deseas desistir para cuidar el planeta o continuar con el envío?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleDesist}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
                  >
                    <span>🌱</span> Desistir (Obtener Premio)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📦</span> Continuar con Envío
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: PANTALLA FESTIVA AL DESISTIR (CUPÓN VITALICIO) */}
          {step === 'desisted' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/40">
                  ¡Héroe Ambiental Verificado!
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wider mt-3">
                  ¡Gracias por Cuidar Nuestro Planeta!
                </h4>
                <p className="text-xs text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Has elegido una huella ecológica cero. Como agradecimiento exclusivo de nuestra plataforma de identidad digital, te otorgamos tu:
                </p>
              </div>

              {/* Box de Cupón */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-[#10101A] to-emerald-950/60 border border-emerald-500/60 rounded-2xl space-y-2 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block tracking-wider">
                  CUPÓN VITALICIO DE EDICIONES ILIMITADAS
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-mono font-extrabold text-white tracking-widest bg-black/60 px-4 py-1.5 rounded-xl border border-emerald-500/40">
                    {couponCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all"
                  >
                    {copiedCoupon ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Válido de por vida para actualizar datos de contacto, enlaces y diseño de tu perfil sin costo.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                Continuar con mi Tarjeta Digital
              </button>
            </div>
          )}

          {/* PASO 4: FORMULARIO DE ENVÍO FÍSICO */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h4 className="font-bold text-white uppercase font-mono text-xs flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#EE334E]" /> Orquestación de Envío Físico
                </h4>
                <button
                  type="button"
                  onClick={() => setStep('calc')}
                  className="text-[11px] text-[#00E5FF] hover:underline"
                >
                  ← Volver
                </button>
              </div>

              {/* Selector de Cobertura */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-mono font-bold">Zona de Entrega:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingLocation && setShippingLocation('mexicali')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      shippingLocation === 'mexicali'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="text-xs">Mexicali, B.C.</div>
                    <div className="text-[10px] text-emerald-400 font-bold font-mono">100% GRATIS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingLocation && setShippingLocation('mexico_dhl')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      shippingLocation === 'mexico_dhl'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="text-xs">México (DHL)</div>
                    <div className="text-[10px] text-amber-400 font-bold font-mono">+$149 MXN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingLocation && setShippingLocation('world_ups')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      shippingLocation === 'world_ups'
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300 font-bold'
                        : 'bg-black/40 border-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="text-xs">Mundo (UPS)</div>
                    <div className="text-[10px] text-purple-400 font-bold font-mono">+$450 MXN</div>
                  </button>
                </div>
              </div>

              {/* Inputs de Dirección */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre de la persona que recibe"
                  value={shippingData.destinatario}
                  onChange={(e) => setShippingData({ ...shippingData, destinatario: e.target.value })}
                  className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Calle y Número Exterior / Interior"
                    value={shippingData.calleNumero}
                    onChange={(e) => setShippingData({ ...shippingData, calleNumero: e.target.value })}
                    className="bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Colonia / Fraccionamiento"
                    value={shippingData.colonia}
                    onChange={(e) => setShippingData({ ...shippingData, colonia: e.target.value })}
                    className="bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={shippingData.ciudad}
                    onChange={(e) => setShippingData({ ...shippingData, ciudad: e.target.value })}
                    className="bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={shippingData.estado}
                    onChange={(e) => setShippingData({ ...shippingData, estado: e.target.value })}
                    className="bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="C.P."
                    value={shippingData.codigoPostal}
                    onChange={(e) => setShippingData({ ...shippingData, codigoPostal: e.target.value })}
                    className="bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Teléfono móvil de contacto para paquetería"
                  value={shippingData.telefonoContacto}
                  onChange={(e) => setShippingData({ ...shippingData, telefonoContacto: e.target.value })}
                  className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white text-xs focus:border-[#EE334E] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs transition-all"
                >
                  Guardar Datos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('¡Datos de entrega guardados exitosamente!\nTu pedido físico ha sido orquestado.');
                    onClose();
                  }}
                  className="w-1/2 py-2.5 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)]"
                >
                  Confirmar Envío
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
