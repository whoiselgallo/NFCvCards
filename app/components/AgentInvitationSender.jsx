'use client';

import React, { useState, useMemo } from 'react';
import { Mail, MessageSquare, Send, Copy, Check, Sparkles, User, AtSign, Phone, ExternalLink } from 'lucide-react';

export default function AgentInvitationSender({
  agentName = 'Agente Embajador',
  agentCompany = 'TSOLUTIONS IPIDD',
  giftUrl = 'https://vc.tsolutionsipidd.com'
}) {
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectPhone, setProspectPhone] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'whatsapp'
  const [copied, setCopied] = useState(false);

  const cleanName = prospectName.trim() || 'Estimado(a) Profesional';
  const cleanFirst = prospectName.trim() ? prospectName.trim().split(' ')[0] : 'amigo(a)';

  // Plantilla oficial para Correo Electrónico
  const emailSubject = `🎁 Tienes una Tarjeta Digital Interactiva de Regalo de ${agentName} – ${agentCompany}`;

  const emailBody = useMemo(() => {
    return `Hola, ${cleanName}:

Espero que te encuentres excelente. Te contacto porque desde ${agentCompany} hemos estado siguiendo tu trayectoria profesional y el crecimiento de tu negocio, y como parte de nuestro Programa de Embajadores Oficiales, he seleccionado tu perfil para obsequiarte una Tarjeta de Presentación Digital Interactiva de Nivel Elite, completamente libre de costo.

🌟 ¿QUÉ ES ESTE PROYECTO Y POR QUÉ TE LO OBSEQUIAMOS?
Estamos transformando la manera en que los profesionales y empresarios en México comparten su identidad y cierran negocios. Las tarjetas de papel tradicionales se pierden, se tiran o quedan obsoletas con cualquier cambio.

Tu tarjeta digital opera sobre la infraestructura de Google Cloud y hardware NFC Contactless, permitiéndote transmitir al instante:
• Tus datos de contacto directos con guardado automático en la agenda telefónica.
• Accesos rápidos a tu WhatsApp, llamada telefónica y correo.
• Enlace con navegación asistida en Google Maps hacia tus oficinas o negocio.
• Tus redes sociales corporativas, sitio web y portafolio interactivo.

🛠️ ¿CÓMO CONSTRUIR TU TARJETA? (TOMA MENOS DE 3 MINUTOS)
1. Ingresa a tu enlace de regalo exclusivo:
👉 ${giftUrl}
2. Haz clic en "Crear mi Tarjeta Gratis Ahora".
3. Llena los campos esenciales: tu nombre, empresa, puesto, teléfono, WhatsApp y correo.
4. Sube tu fotografía o el logotipo de tu empresa.
5. Elige entre los 10 temas visuales profesionales y personaliza tus colores.

🔒 CLÁUSULA DE RETROALIMENTACIÓN (FEEDBACK DE 1 MINUTO)
Tu tarjeta incluye el Paquete Completo All-in-One (valorado comercialmente en $288 MXN) 100% bonificado. El único requisito para activar tus botones de descarga (.ZIP, QR, .VCF) y tu enlace permanente en la nube es responder una breve encuesta de 1 minuto al finalizar el armado. En cuanto envíes tus respuestas, todas tus descargas quedarán liberadas de inmediato.

📲 ¿CÓMO UTILIZAR Y TRANSFERIR TU TARJETA DIGITAL? (GUÍA MAESTRA)
Una vez completada tu tarjeta, dispones de 6 métodos de alta tecnología para transferir tu información a cualquier cliente:
1. Contactless por Tecnología NFC (Tarjeta física o Sticker): Solo acerca el chip a la parte superior de un iPhone o al centro de un Android (a menos de 3 cm). El perfil se abrirá al instante sin necesidad de aplicaciones.
2. Código QR HD para Pantalla y Medios Impresos: Descarga tu QR (.PNG) para ponerlo en el fondo de pantalla de tu móvil, volantes, firmas de correo o folletos.
3. Archivo .VCF (Descarga directa en Teléfono u Ordenador): Envía tu archivo .VCF adjunto para que tu cliente lo abra y guarde tu contacto con 1 clic en su agenda telefónica o computadora (Outlook / Mac Contacts).
4. Enlace Directo por Mensaje: Comparte tu link público por WhatsApp, Telegram, SMS o en la bio de tus redes sociales.
5. En Apple Watch: Guarda tu QR en fotos sincronizadas para que lo escaneen directamente desde tu muñeca en eventos de networking.
6. En Apple Wallet y Google Wallet: Añade tu tarjeta a la cartera digital de tu teléfono para tener tu pase disponible aun sin conexión a internet.

🚀 SOPORTE Y ACOMPAÑAMIENTO
Si requieres apoyo durante el llenado o deseas enlazar tu tarjeta a un chip físico NFC o sticker, respóndeme a este mensaje y con gusto te asistiré paso a paso.

Atentamente,
${agentName}
Agente Embajador Oficial
${agentCompany}
Plataforma: https://vc.tsolutionsipidd.com`;
  }, [cleanName, agentName, agentCompany, giftUrl]);

  // Plantilla oficial para WhatsApp
  const whatsappBody = useMemo(() => {
    return `¡Hola, ${cleanFirst}! 👋 Te saludo con gusto.

Como parte del *Programa de Embajadores Oficiales de ${agentCompany}*, he seleccionado tu perfil para obsequiarte una *Tarjeta de Presentación Digital Interactiva de Nivel Elite* 🎁, 100% libre de costo.

🌟 *¿Qué incluye tu tarjeta?*
✅ Chip Contactless NFC y Código QR HD
✅ Botones directos a tu WhatsApp, llamada, correo y Google Maps
✅ Guardado automático de contacto en la agenda del cliente (archivo .VCF)
✅ Compatible con Apple Watch, Apple Wallet y Google Wallet
✅ Alojamiento permanente 24/7 en Google Cloud

🛠️ *¿Cómo crearla en menos de 3 minutos?*
1. Entra a tu enlace de regalo exclusivo:
👉 ${giftUrl}
2. Da clic en *"Crear mi Tarjeta Gratis Ahora"*
3. Llena tus datos, sube tu foto/logo y elige tu diseño favorito.

🔒 *Nota:* Para activar tus descargas gratuitas (.ZIP, QR, .VCF) y enlace cloud, solo te pedirá responder un breve feedback de 1 minuto al terminar.

Cualquier duda que tengas para configurarla o vincularla a un chip NFC físico, escríbeme y te apoyo con gusto.

Saludos,
*${agentName}*
Agente Embajador Oficial | ${agentCompany}`;
  }, [cleanFirst, agentName, agentCompany, giftUrl]);

  const handleSendEmail = () => {
    const targetEmail = prospectEmail.trim();
    if (!targetEmail) {
      alert('Por favor escribe la dirección de correo electrónico del prospecto para preparar el envío.');
      return;
    }
    const mailto = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  };

  const handleSendWhatsApp = () => {
    let phoneClean = prospectPhone.replace(/[^0-9]/g, '');
    if (phoneClean && phoneClean.length === 10) {
      phoneClean = `52${phoneClean}`; // Prefijo México por defecto si tiene 10 dígitos
    }
    const url = phoneClean 
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(whatsappBody)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappBody)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const textToCopy = activeTab === 'email' ? emailBody : whatsappBody;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0A0A10]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
      {/* GLOW DECORATIVO */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#EE334E]/10 via-[#00E5FF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Centro de Envío de Invitaciones de Regalo
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Envío Personalizado de Tarjetas de Obsequio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Escribe el nombre y correo del prospecto. La plantilla insertará tus datos y tu enlace de regalo automáticamente lista para enviar con 1 clic por Correo o WhatsApp.
          </p>
        </div>

        {/* SELECTOR DE CANAL */}
        <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'email'
                ? 'bg-[#EE334E] text-white shadow-[0_0_15px_rgba(238,51,78,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Plantilla Correo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'bg-[#25D366] text-white shadow-[0_0_15px_rgba(37,211,102,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Plantilla WhatsApp</span>
          </button>
        </div>
      </div>

      {/* FORMULARIO DE DATOS DEL PROSPECTO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Nombre del Prospecto */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#00E5FF]" />
            Nombre del Prospecto
          </label>
          <input
            type="text"
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            placeholder="Ej: Lic. Carlos Mendoza"
            className="w-full px-4 py-2.5 bg-black/50 border border-white/10 focus:border-[#00E5FF] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Correo Electrónico de Envío */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5 text-[#EE334E]" />
            Correo de Envío
          </label>
          <input
            type="email"
            value={prospectEmail}
            onChange={(e) => setProspectEmail(e.target.value)}
            placeholder="carlos@empresa.com"
            className="w-full px-4 py-2.5 bg-black/50 border border-white/10 focus:border-[#EE334E] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Teléfono / WhatsApp (Opcional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-green-400" />
            WhatsApp del Prospecto <span className="text-[10px] text-slate-500 lowercase">(opcional)</span>
          </label>
          <input
            type="tel"
            value={prospectPhone}
            onChange={(e) => setProspectPhone(e.target.value)}
            placeholder="6861234567"
            className="w-full px-4 py-2.5 bg-black/50 border border-white/10 focus:border-green-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ÁREA DE PREVISUALIZACIÓN DEL MENSAJE */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono uppercase text-[11px] flex items-center gap-1.5">
            {activeTab === 'email' ? '✉️ Previsualización del Correo' : '💬 Previsualización de WhatsApp'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Se actualiza en tiempo real con el nombre ingresado
          </span>
        </div>

        {activeTab === 'email' && (
          <div className="p-3 bg-black/70 border border-white/10 rounded-t-xl text-xs font-mono space-y-1">
            <p><span className="text-[#EE334E] font-bold">Para:</span> {prospectEmail.trim() || 'correo@prospecto.com'}</p>
            <p><span className="text-[#00E5FF] font-bold">Asunto:</span> {emailSubject}</p>
          </div>
        )}

        <textarea
          readOnly
          value={activeTab === 'email' ? emailBody : whatsappBody}
          rows={activeTab === 'email' ? 12 : 10}
          className={`w-full bg-[#05050C] border border-white/10 p-4 text-xs font-mono text-slate-200 focus:outline-none select-all leading-relaxed ${
            activeTab === 'email' ? 'rounded-b-xl border-t-0' : 'rounded-xl'
          }`}
        />
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-slate-500 font-mono text-center sm:text-left">
          Tu enlace de regalo está integrado: <span className="text-[#00E5FF]">{giftUrl}</span>
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex-1 sm:flex-initial px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          {activeTab === 'email' ? (
            <button
              type="button"
              onClick={handleSendEmail}
              className="flex-1 sm:flex-initial px-6 py-3 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(238,51,78,0.4)]"
            >
              <Send className="w-4 h-4" />
              <span>Abrir en Correo</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-initial px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
