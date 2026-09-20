'use client';

import React, { useState } from 'react';
import { HelpCircle, ExternalLink, Check, Copy, AlertCircle, X } from 'lucide-react';

/**
 * Función inteligente para extraer el link de pago desde:
 * - URL directa: https://paypal.me/usuario/100 o https://buy.stripe.com/...
 * - Código Embed / HTML: <form action="https://www.paypal.com/cgi-bin/webscr"... o <a href="..."
 * - JSON de Checkout: {"checkout_url":"https://...","token":"..."}
 * - Handle @usuario
 */
export function parsePaymentInput(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();

  // 1. Si es JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.checkout_url) return parsed.checkout_url;
      if (parsed.url) return parsed.url;
      if (parsed.link) return parsed.link;
      if (parsed.payment_url) return parsed.payment_url;
      if (parsed.hosted_button_id) {
        return `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${parsed.hosted_button_id}`;
      }
    } catch {
      // Continuar con regex si falló el parseo JSON
    }
  }

  // 2. Si es código HTML / Formulario Embed de PayPal
  if (trimmed.includes('<form') || trimmed.includes('<a') || trimmed.includes('hosted_button_id')) {
    const buttonIdMatch = trimmed.match(/name="hosted_button_id"\s+value="([^"]+)"/i) ||
                          trimmed.match(/value="([^"]+)"\s+name="hosted_button_id"/i);
    if (buttonIdMatch && buttonIdMatch[1]) {
      return `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${buttonIdMatch[1]}`;
    }

    const hrefMatch = trimmed.match(/href="([^"]+)"/i);
    if (hrefMatch && hrefMatch[1] && hrefMatch[1].startsWith('http')) {
      return hrefMatch[1];
    }

    const actionMatch = trimmed.match(/action="([^"]+)"/i);
    if (actionMatch && actionMatch[1] && actionMatch[1].startsWith('http')) {
      return actionMatch[1];
    }
  }

  // 3. Si es URL estándar
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 4. Si es handle @usuario o paypal.me/usuario
  if (trimmed.startsWith('@')) {
    return `https://paypal.me/${trimmed.slice(1)}`;
  }
  if (trimmed.startsWith('paypal.me/')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export default function PayPalHelperModal({ isOpen, onClose, onApplyLink }) {
  const [activeTab, setActiveTab] = useState('paypalme');
  const [testInput, setTestInput] = useState('');
  const [extractedUrl, setExtractedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestParse = (val) => {
    setTestInput(val);
    const parsed = parsePaymentInput(val);
    setExtractedUrl(parsed);
  };

  const handleApply = () => {
    if (extractedUrl && onApplyLink) {
      onApplyLink(extractedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0D14] border border-gray-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#12121D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0079C1]/20 border border-[#0079C1]/40 flex items-center justify-center text-lg text-[#00457C]">
              💳
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Guía de Vinculación de Pagos
              </h3>
              <p className="text-[11px] text-gray-400">
                Soporte para Enlaces Directos, Embed HTML y JSON de PayPal / Stripe
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

        {/* Navigation tabs */}
        <div className="flex border-b border-gray-800 bg-[#0A0A10] text-xs">
          <button
            onClick={() => setActiveTab('paypalme')}
            className={`flex-1 py-3 font-semibold text-center border-b-2 transition-all ${
              activeTab === 'paypalme'
                ? 'border-[#0079C1] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            1. Enlace PayPal.me (Recomendado)
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-3 font-semibold text-center border-b-2 transition-all ${
              activeTab === 'embed'
                ? 'border-[#0079C1] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            2. Código Embed / Botón PayPal
          </button>
          <button
            onClick={() => setActiveTab('stripe')}
            className={`flex-1 py-3 font-semibold text-center border-b-2 transition-all ${
              activeTab === 'stripe'
                ? 'border-[#635BFF] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            3. Stripe Payment Links
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-300">
          {activeTab === 'paypalme' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0079C1]/10 border border-[#0079C1]/30">
                <h4 className="font-bold text-white text-sm mb-1">¿Cómo crear o copiar tu PayPal.me?</h4>
                <p className="text-gray-300 leading-relaxed">
                  PayPal.me es la forma más rápida y moderna para recibir pagos en tu tarjeta NFC con 1 solo clic.
                </p>
                <ol className="list-decimal list-inside space-y-1.5 mt-3 text-gray-200 font-mono text-[11px]">
                  <li>Inicia sesión en <a href="https://www.paypal.com/paypalme" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] underline">paypal.com/paypalme</a>.</li>
                  <li>Crea o copia tu enlace personal (ejemplo: <span className="text-amber-400">paypal.me/tu-nombre</span>).</li>
                  <li>Puedes agregar un monto predeterminado al final: <span className="text-amber-400">paypal.me/tu-nombre/250</span> ($250 MXN).</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <h4 className="font-bold text-amber-300 text-sm mb-1">Botón de Cobro / Código Embed de PayPal</h4>
                <p className="text-gray-300 leading-relaxed">
                  Si creaste un botón en el panel de vendedor de PayPal y copiaste el código HTML o JSON, puedes pegarlo directamente en la casilla de tu tarjeta.
                </p>
                <p className="mt-2 text-gray-400 text-[11px]">
                  Nuestro motor extraerá automáticamente el identificador de botón seguro (<code className="text-amber-300">hosted_button_id</code>) para que tus clientes paguen sin fricción.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'stripe' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#635BFF]/10 border border-[#635BFF]/30">
                <h4 className="font-bold text-[#A594FD] text-sm mb-1">Stripe Payment Links</h4>
                <p className="text-gray-300 leading-relaxed">
                  Si cobras con Stripe, dirígete a tu Dashboard de Stripe &gt; "Payment Links" &gt; "Crear enlace de pago".
                </p>
                <p className="mt-2 text-gray-200 font-mono text-[11px]">
                  Copia el enlace generado (ejemplo: <span className="text-emerald-400">https://buy.stripe.com/abc123xyz</span>) y pégalo en la casilla de pagos.
                </p>
              </div>
            </div>
          )}

          {/* Test & Conversion Box */}
          <div className="border border-gray-800 rounded-2xl p-4 bg-[#12121C] space-y-3">
            <label className="font-bold text-white uppercase font-mono text-[11px] block">
              Prueba o Pega tu Enlace / JSON / Código aquí:
            </label>
            <textarea
              rows={3}
              value={testInput}
              onChange={(e) => handleTestParse(e.target.value)}
              placeholder="Ejemplo: https://paypal.me/usuario, o pega el código <form... o JSON..."
              className="w-full bg-black/60 border border-gray-700 p-2.5 rounded-xl text-xs text-white font-mono placeholder:text-gray-600 focus:border-[#0079C1] focus:outline-none"
            />

            {extractedUrl && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                  <span>✓ Enlace Extraído con Éxito:</span>
                </div>
                <div className="p-2 bg-black/50 rounded-lg text-emerald-300 font-mono text-[11px] break-all border border-emerald-900/50 select-all">
                  {extractedUrl}
                </div>
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Asignar a mi Casilla de Pago
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#12121D] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
