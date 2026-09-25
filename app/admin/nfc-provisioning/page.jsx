'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone, Cpu, QrCode, Search, CheckCircle2, AlertCircle,
  RefreshCw, Copy, ExternalLink, ArrowLeft, Zap, Download, Layers
} from 'lucide-react';
import Link from 'next/link';

export default function NFCProvisioningPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [writingStatus, setWritingStatus] = useState('idle'); // 'idle' | 'writing' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    // Comprobar si Web NFC API es soportada por el navegador (Android Chrome)
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
    }
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success && json.data?.leads) {
        setProfiles(json.data.leads);
      }
    } catch (err) {
      console.error('Error cargando perfiles para aprovisionamiento:', err);
    } fontFinally: {
      setLoading(false);
    }
  };

  const getTargetUrl = (slug) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tsolutions.com';
    return `${origin}/p/${slug}?src=nfc`;
  };

  const handleWriteNFC = async (profile) => {
    setSelectedProfile(profile);
    if (!nfcSupported) {
      setStatusMsg('Web NFC no está disponible en este dispositivo/navegador. (Se requiere Android + Chrome). Puedes copiar la URL del chip manualmente.');
      setWritingStatus('error');
      return;
    }

    try {
      setWritingStatus('writing');
      setStatusMsg('Acerque el chip NFC físico al dispositivo para programar...');

      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{
          recordType: 'url',
          data: getTargetUrl(profile.slug)
        }]
      });

      setWritingStatus('success');
      setStatusMsg(`¡Chip NFC grabado exitosamente para ${profile.nombre} ${profile.apellido}!`);
    } catch (err) {
      console.error('Error al escribir NDEF NFC:', err);
      setWritingStatus('error');
      setStatusMsg(`Error al escribir NFC: ${err.message || 'Escritura cancelada o interrumpida'}`);
    }
  };

  const handleCopyUrl = (slug) => {
    const url = getTargetUrl(slug);
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredProfiles = profiles.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.apellido && p.apellido.toLowerCase().includes(term)) ||
      (p.empresa && p.empresa.toLowerCase().includes(term)) ||
      (p.slug && p.slug.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#030308] text-slate-300 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Cpu className="w-8 h-8 text-[#00E5FF]" /> Aprovisionamiento NFC Veloz (Fast Hardware Sync)
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Programación de chips NDEF en tarjetas físicas, etiquetas de pvc, stickers y llaveros inteligentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={'px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ' + (nfcSupported ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')}>
              <span className={'w-2 h-2 rounded-full ' + (nfcSupported ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')} />
              {nfcSupported ? 'Web NFC Disponible' : 'NFC Emulado / Manual'}
            </span>
          </div>
        </div>

        {/* STATUS ALERT */}
        {statusMsg && (
          <div className={'p-4 rounded-xl border text-sm flex items-center justify-between ' + (writingStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : writingStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300')}>
            <div className="flex items-center gap-3">
              {writingStatus === 'writing' && <RefreshCw className="w-5 h-5 animate-spin shrink-0" />}
              {writingStatus === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {writingStatus === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-xs opacity-60 hover:opacity-100">Cerrar</button>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="bg-[#0a0a10] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarjeta por cliente, slug o empresa..."
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredProfiles.length} perfiles listos para codificar
          </span>
        </div>

        {/* LISTADO DE TARJETAS PARA APROVISIONAR */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00E5FF]" />
            <p className="text-sm">Cargando catálogo de tarjetas digitales...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => {
              const targetUrl = getTargetUrl(p.slug);
              return (
                <div
                  key={p.id}
                  className="bg-[#0a0a10] border border-white/5 hover:border-cyan-500/30 transition-all rounded-2xl p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-base">{p.nombre} {p.apellido}</h3>
                        <p className="text-xs text-slate-400">{p.empresa || 'Independiente'} {p.puesto ? `• ${p.puesto}` : ''}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        /p/{p.slug}
                      </span>
                    </div>

                    <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-1 font-mono text-[11px] text-slate-400 overflow-x-auto">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Payload URL NDEF:</div>
                      <div className="text-cyan-300 truncate">{targetUrl}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyUrl(p.slug)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      {copiedSlug === p.slug ? '¡Copiado!' : 'Copiar URL'}
                    </button>

                    <button
                      onClick={() => handleWriteNFC(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Escribir NFC
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
