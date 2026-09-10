'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';
import { Download, CheckCircle2, ArrowRight, ShieldCheck, QrCode, FileText, Package, ExternalLink, Sparkles, UserCheck } from 'lucide-react';
import brandConfig from '../../../brand.config';
import { generateDeliveryInstructions } from '../../../lib/brand';

export default function DeliverablesClient({ initialProfile, slug }) {
  const [profile, setProfile] = useState(initialProfile || {});
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    // Si no vino de la BD o faltan datos, intentar cargar del localStorage
    if (!initialProfile || !initialProfile.nombre) {
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(`vcard_draft_${slug}`) || localStorage.getItem('vcard_last_created_profile');
          if (cached) {
            const parsed = JSON.parse(cached);
            setProfile(prev => ({ ...prev, ...parsed }));
          }
        } catch {
          // Ignorar fallback
        }
      }
    }
  }, [initialProfile, slug]);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : (brandConfig.website || 'https://rosecard.io');
  const cardProfileUrl = `${originUrl}/p/${slug}`;
  const portalUrl = `${originUrl}/portal?slug=${slug}`;

  const titular = `${profile.nombre || 'Contacto'} ${profile.apellido || ''}`.trim() || 'Titular';
  const empresa = profile.empresa || 'Tu Empresa';

  // Generación de string vCard 3.0
  const buildVCardString = () => {
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vcard += `N:${profile.apellido || ''};${profile.nombre || ''};;;\r\n`;
    vcard += `FN:${titular}\r\n`;
    if (profile.empresa) vcard += `ORG:${profile.empresa}\r\n`;
    if (profile.puesto) vcard += `TITLE:${profile.puesto}\r\n`;
    if (profile.telefono) vcard += `TEL;TYPE=CELL,VOICE:${profile.telefono}\r\n`;
    if (profile.whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${profile.whatsapp}\r\n`;
    if (profile.correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${profile.correo}\r\n`;
    if (profile.url) vcard += `URL;TYPE=WORK:${profile.url}\r\n`;
    if (profile.linkedin) vcard += `URL;TYPE=LinkedIn:${profile.linkedin}\r\n`;
    if (profile.instagram) vcard += `URL;TYPE=Instagram:${profile.instagram}\r\n`;
    if (profile.facebook) vcard += `URL;TYPE=Facebook:${profile.facebook}\r\n`;
    if (profile.calle || profile.ciudad || profile.estado || profile.cp || profile.pais) {
      vcard += `ADR;TYPE=WORK:;;${profile.calle || ''};${profile.ciudad || ''};${profile.estado || ''};${profile.cp || ''};${profile.pais || ''}\r\n`;
    }
    vcard += `NOTE:Tarjeta Digital Oficial: ${cardProfileUrl}\r\n`;
    vcard += `END:VCARD`;
    return vcard;
  };

  // Generador garantizado de PNG de alta resolución (1200x1200px)
  const getQRPNGBlob = () => {
    return new Promise((resolve) => {
      const svg = document.getElementById('deliverables-qr-svg');
      if (!svg) {
        resolve(null);
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      canvas.width = 1200;
      canvas.height = 1200;

      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 60, 60, 1080, 1080);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  // Descarga 1: Archivo .VCF
  const downloadVCF = () => {
    const vcardString = buildVCardString();
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titular.replace(/\s+/g, '_')}_Contacto.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice('¡Ficha de contacto .VCF descargada!');
  };

  // Descarga 2: Código QR HD (.PNG)
  const downloadQR = async () => {
    const blob = await getQRPNGBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Codigo_QR_Alta_Definicion_${titular.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice('¡Código QR HD descargado!');
  };

  // Descarga 3: Enlace Cloud e Instructivo (.TXT)
  const downloadInstructions = () => {
    const content = generateDeliveryInstructions({
      nombre: profile.nombre,
      apellido: profile.apellido,
      empresa: profile.empresa,
      slug: slug,
      originUrl: originUrl
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Enlace_Cloud_e_Instructivo_de_Uso_General.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice('¡Instructivo de Uso y Enlace Cloud descargado!');
  };

  // Descarga 4: Paquete Completo ZIP (All-in-One)
  const downloadFullPackage = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const safeTitular = titular.replace(/\s+/g, '_');
      const vcardString = buildVCardString();
      const qrBlob = await getQRPNGBlob();

      const instrucciones = generateDeliveryInstructions({
        nombre: profile.nombre,
        apellido: profile.apellido,
        empresa: profile.empresa,
        slug: slug,
        originUrl: originUrl
      });

      // 1. Archivo .vcf
      zip.file(`${safeTitular}_Contacto.vcf`, vcardString);

      // 2. Archivo QR HD .png
      if (qrBlob) {
        zip.file(`Codigo_QR_Alta_Definicion.png`, qrBlob);
      }

      // 3. Documento de instrucciones con enlace cloud en encabezado
      zip.file('Enlace_Cloud_e_Instructivo_de_Uso_General.txt', instrucciones);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Paquete_Identidad_Digital_${safeTitular}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotice('¡Paquete completo .ZIP descargado con éxito!');
    } catch (err) {
      alert('Error al generar el paquete .ZIP: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const showNotice = (msg) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EE334E]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* QR Oculto / Renderizado para generación de imagen 1200x1200px */}
      <div className="sr-only" aria-hidden="true">
        <QRCodeSVG
          id="deliverables-qr-svg"
          value={cardProfileUrl}
          size={1200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">

        {/* AVISO DE CONSTRUCTOR BLOQUEADO */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-[#0A0A14] to-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-sm">
              🔒
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Tarjeta Desplegada y Asegurada en Google Cloud
              </p>
              <p className="text-[11px] text-gray-300">
                El constructor se ha cerrado para esta versión. Administra métricas y solicita actualizaciones desde tu portal personal.
              </p>
            </div>
          </div>
          <Link
            href={portalUrl}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shrink-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Ir al Portal →
          </Link>
        </div>

        {/* ENCABEZADO DE AGRADECIMIENTO */}
        <div className="bg-[#0C0C16] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center shadow-xl">
          <span className="text-[10px] font-mono uppercase bg-[#EE334E]/20 text-[#EE334E] px-3 py-1 rounded-full font-extrabold tracking-wider border border-[#EE334E]/40 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Despliegue Oficial en Producción
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¡Felicidades, {titular}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Tu Identidad Digital Interactiva y Tarjeta NFC de <strong className="text-white">{empresa}</strong> está lista para compartir con clientes, prospectos y socios de negocio en todo el mundo.
          </p>

          {/* Enlace Cloud Destacado */}
          <div className="p-4 bg-black/60 border border-gray-700/80 rounded-2xl max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[10px] uppercase">Tu Enlace Cloud Oficial:</span>
              <a
                href={cardProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E5FF] hover:underline font-mono text-xs flex items-center gap-1"
              >
                Abrir Tarjeta ↗
              </a>
            </div>
            <div className="p-2.5 bg-[#05050A] rounded-xl text-[#00E5FF] font-mono text-xs font-bold select-all break-all border border-gray-800">
              {cardProfileUrl}
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold animate-fadeIn">
              {downloadSuccess}
            </div>
          )}
        </div>

        {/* SUITE DE ENTREGABLES COMERCIALES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Centro Oficial de Entregables Digitales
              </h2>
              <p className="text-[11px] text-gray-400">
                Descarga los activos individuales o el paquete completo todo en uno
              </p>
            </div>
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-400">
              Descargas Activas
            </span>
          </div>

          {/* PAQUETE COMPLETO ALL-IN-ONE (RECOMENDADO) */}
          <div className="p-6 bg-gradient-to-r from-rose-950/40 via-[#180D12] to-rose-950/40 border-2 border-[#ff0003] rounded-3xl shadow-[0_0_30px_rgba(255,0,3,0.2)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#ff0003] text-white px-2.5 py-0.5 rounded font-extrabold tracking-wider">
                  TODO EN UNO (RECOMENDADO)
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Paquete Completo All-in-One (.ZIP)</h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Incluye la Ficha de Contacto (.vcf), el Código QR HD (.png 1200x1200px) y el documento Enlace Cloud e Instructivo de Uso General (.txt).
                </p>
              </div>
              <button
                type="button"
                onClick={downloadFullPackage}
                disabled={isZipping}
                className="px-6 py-3.5 bg-[#ff0003] hover:bg-[#EE334E] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,3,0.4)] transition-all shrink-0 flex items-center justify-center gap-2"
              >
                {isZipping ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Empaquetando...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>Descargar Paquete ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MÓDULOS INDIVIDUALES DESGLOSADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Entregable 1: Ficha .VCF */}
            <div className="p-5 bg-[#0C0C16] border border-gray-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-gray-700 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Entregable 1</span>
                  <h4 className="text-sm font-bold text-white">Ficha de Contacto (.VCF)</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Formato universal vCard 3.0. Al abrirse en iPhone o Android, agrega al instante tu nombre, teléfonos, WhatsApp, correo y cargo a la libreta de contactos sin teclear.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadVCF}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Ficha (.VCF)
              </button>
            </div>

            {/* Entregable 2: Código QR HD */}
            <div className="p-5 bg-[#0C0C16] border border-gray-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-gray-700 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EE334E]/20 border border-[#EE334E]/40 flex items-center justify-center text-[#EE334E]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#EE334E] uppercase font-bold">Entregable 2</span>
                  <h4 className="text-sm font-bold text-white">Código QR HD (.PNG)</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Fotografía en ultra alta definición (1200x1200px). Lista para imprenta en tarjetas físicas, rollups, carpetas de presentación, firmas o fondo de pantalla de bloqueo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadQR}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Descargar QR HD (.PNG)
              </button>
            </div>

            {/* Entregable 3: Enlace Cloud e Instructivo */}
            <div className="p-5 bg-[#0C0C16] border border-gray-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-gray-700 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Entregable 3</span>
                  <h4 className="text-sm font-bold text-white">Instructivo & Enlace (.TXT)</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Archivo <code className="text-purple-300">Enlace_Cloud_e_Instructivo_de_Uso_General.txt</code> con el enlace cloud oficial al inicio y la guía para programar chips NFC (NTAG213/215).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadInstructions}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Instructivo (.TXT)
              </button>
            </div>

          </div>
        </div>

        {/* CTA HACIA EL PORTAL PERSONAL DE GESTIÓN Y TELEMETRÍA */}
        <div className="p-6 bg-[#0E0E1B] border border-gray-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 justify-center sm:justify-start">
              <span>📊</span> Monitorea tu Retorno de Inversión y Telemetría
            </h3>
            <p className="text-xs text-gray-400">
              Consulta en tiempo real visitas, transferencias vCard, pagos recibidos y exporta reportes en PDF para juntas directivas.
            </p>
          </div>
          <Link
            href={portalUrl}
            className="px-6 py-3 bg-[#00E5FF] hover:bg-[#38bdf8] text-black font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0 flex items-center gap-2"
          >
            <span>Ir a mi Portal Personal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
