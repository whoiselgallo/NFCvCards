'use client';

/**
 * ROSE SALES ENGINE - VCARDS BATCH APPROVAL MODAL
 * Panel de Aprobación de Javier Gallardo
 * 
 * Design Tokens TSolutions IPIDD:
 *   Background: #0A0D14 + Deep Grid (rgba(255,255,255,0.03))
 *   Cards: Midnight Panel #121722 + Border rgba(255,255,255,0.10)
 *   Accent: Naranja Energy #FF6B00 + Aqua Turquesa #00E5FF
 *   Tipografías: font-bruno (Bruno Ace) | font-heading (Space Grotesk) | font-sans
 */

import { useState, useEffect, useRef } from 'react';
import {
  X, CheckCircle, XCircle, Mail, MessageSquare, Megaphone, Video,
  Users, BarChart3, Clock, AlertTriangle, ChevronRight, Loader2,
  Zap, TrendingUp, Shield
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TOKENS DE DISEÑO CORPORATIVOS TSOLUTIONS IPIDD
// ──────────────────────────────────────────────────────────────
const T = {
  bg: '#0A0D14',
  panel: '#121722',
  border: 'rgba(255,255,255,0.10)',
  naranja: '#FF6B00',
  aqua: '#00E5FF',
  text: '#F8FAFC',
  muted: '#94A3B8',
  success: '#22C55E',
  danger: '#EF4444',
};

const TABS = [
  { id: 'email_wa',    label: 'Email & WhatsApp',    icon: Mail,      color: T.naranja },
  { id: 'meta',        label: 'Facebook & Instagram', icon: Megaphone, color: '#1877F2' },
  { id: 'tiktok',      label: 'TikTok & Shorts',      icon: Video,     color: T.aqua },
  { id: 'prospects',   label: 'Prospectos del Lote',  icon: Users,     color: '#A855F7' },
];

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ──────────────────────────────────────────────────────────────

function StatBadge({ label, value, color = T.naranja }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 18px', minWidth: 90 }}>
      <p style={{ color: T.muted, fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{label}</p>
      <p style={{ color, fontSize: 22, fontWeight: 800, fontFamily: 'Bruno Ace, monospace', margin: '4px 0 0' }}>{value}</p>
    </div>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={() => onClick(tab.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
        background: active ? `${tab.color}20` : 'transparent',
        color: active ? tab.color : T.muted,
        borderBottom: active ? `2px solid ${tab.color}` : '2px solid transparent',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={15} />
      {tab.label}
    </button>
  );
}

function EmailWATab({ content }) {
  if (!content) return <EmptyState />;
  const email = content.email || {};
  const wa = content.whatsapp || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Email Preview */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mail size={15} color={T.naranja} />
          <span style={{ fontFamily: 'Bruno Ace, monospace', color: T.text, fontSize: 13, letterSpacing: 1 }}>EMAIL CORPORATIVO</span>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Asunto</p>
            <p style={{ color: T.naranja, fontWeight: 700, fontSize: 14, margin: '4px 0 0', fontFamily: 'Space Grotesk' }}>{email.subject || '—'}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Preheader</p>
            <p style={{ color: T.text, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk' }}>{email.preheader || '—'}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Texto Plano</p>
            <p style={{ color: '#CBD5E1', fontSize: 12, margin: '4px 0 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto' }}>{email.plain_text || '—'}</p>
          </div>
          {email.html_template && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ color: T.naranja, cursor: 'pointer', fontSize: 12, fontFamily: 'Space Grotesk' }}>Ver HTML Template</summary>
              <textarea
                readOnly value={email.html_template}
                style={{ marginTop: 8, width: '100%', height: 120, background: '#0A0A12', color: '#94A3B8', fontSize: 10, fontFamily: 'monospace', border: `1px solid ${T.border}`, borderRadius: 6, padding: 8, resize: 'vertical' }}
              />
            </details>
          )}
        </div>
      </div>

      {/* WhatsApp Preview */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={15} color='#25D366' />
          <span style={{ fontFamily: 'Bruno Ace, monospace', color: T.text, fontSize: 13, letterSpacing: 1 }}>WHATSAPP CLOUD API</span>
        </div>
        <div style={{ padding: 18 }}>
          {/* Burbuja simulada de WA */}
          <div style={{ background: '#1A3C2A', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', marginBottom: 16, maxWidth: '90%' }}>
            <p style={{ color: '#E8F5E9', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
              {wa.message || '—'}
            </p>
          </div>
          {/* Quick Replies */}
          <div>
            <p style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Botones de Respuesta Rápida</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(wa.quick_replies || []).map((reply, i) => (
                <span key={i} style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontFamily: 'Space Grotesk' }}>
                  {reply}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaAdsTab({ content }) {
  if (!content) return <EmptyState />;
  const { tofu, mofu, bofu } = content;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* TOFU */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ background: 'rgba(24,119,242,0.2)', color: '#1877F2', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontFamily: 'Bruno Ace, monospace', letterSpacing: 1 }}>TOFU</span>
          <span style={{ color: T.muted, fontSize: 12, fontFamily: 'Space Grotesk' }}>{tofu?.format || 'Reel/Video 9:16'} · CTA: {tofu?.cta}</span>
        </div>
        <p style={{ color: T.naranja, fontWeight: 700, fontSize: 15, fontFamily: 'Bruno Ace, monospace', margin: '0 0 6px', letterSpacing: 1 }}>{tofu?.headline}</p>
        <p style={{ color: '#CBD5E1', fontSize: 13, fontFamily: 'Inter', lineHeight: 1.6, margin: 0 }}>{tofu?.primary_text}</p>
        {tofu?.video_script_summary && <p style={{ color: T.aqua, fontSize: 12, fontFamily: 'Space Grotesk', marginTop: 10, fontStyle: 'italic' }}>📹 {tofu.video_script_summary}</p>}
      </div>

      {/* MOFU - Carrusel */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ background: 'rgba(168,85,247,0.2)', color: '#A855F7', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontFamily: 'Bruno Ace, monospace', letterSpacing: 1 }}>MOFU</span>
          <span style={{ color: T.muted, fontSize: 12, fontFamily: 'Space Grotesk' }}>{mofu?.format || 'Carrusel'} · CTA: {mofu?.cta}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {(mofu?.slides || []).map((slide, i) => (
            <div key={i} style={{ background: '#0E1117', border: `1px solid ${T.border}`, borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ color: T.naranja, fontWeight: 700, fontSize: 12, fontFamily: 'Bruno Ace, monospace', margin: '0 0 6px', letterSpacing: 1 }}>
                Tarjeta {i + 1}: {slide.headline}
              </p>
              <p style={{ color: '#94A3B8', fontSize: 11, fontFamily: 'Inter', lineHeight: 1.6, margin: 0 }}>{slide.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOFU */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontFamily: 'Bruno Ace, monospace', letterSpacing: 1 }}>BOFU</span>
          <span style={{ color: T.muted, fontSize: 12, fontFamily: 'Space Grotesk' }}>Retargeting · CTA: {bofu?.cta}</span>
        </div>
        <p style={{ color: T.naranja, fontWeight: 700, fontSize: 15, fontFamily: 'Bruno Ace, monospace', margin: '0 0 6px', letterSpacing: 1 }}>{bofu?.headline}</p>
        <p style={{ color: '#CBD5E1', fontSize: 13, fontFamily: 'Inter', lineHeight: 1.6, margin: 0 }}>{bofu?.primary_text}</p>
        <p style={{ color: T.aqua, fontSize: 11, fontFamily: 'Space Grotesk', marginTop: 10 }}>📊 {bofu?.audience_note}</p>
      </div>
    </div>
  );
}

function TikTokTab({ content }) {
  if (!content) return <EmptyState />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hook */}
      <div style={{ background: T.panel, border: `1px solid rgba(0,229,255,0.3)`, borderRadius: 12, padding: 18 }}>
        <p style={{ color: T.aqua, fontSize: 11, fontFamily: 'Bruno Ace, monospace', letterSpacing: 2, margin: '0 0 8px', textTransform: 'uppercase' }}>Hook Principal · {content.duration}</p>
        <p style={{ color: T.text, fontSize: 18, fontWeight: 800, fontFamily: 'Bruno Ace, monospace', margin: 0 }}>"{content.hook}"</p>
      </div>

      {/* Storyboard Table */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,229,255,0.05)' }}>
              {['Tiempo', 'Video en Pantalla', 'Audio / Voz', 'Overlay', 'Color'].map(h => (
                <th key={h} style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: 1, padding: '10px 14px', textAlign: 'left', borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(content.scenes || []).map((scene, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '10px 14px', color: T.aqua, fontFamily: 'Bruno Ace, monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{scene.time_range}s</td>
                <td style={{ padding: '10px 14px', color: '#CBD5E1', fontFamily: 'Inter', fontSize: 12, lineHeight: 1.5 }}>{scene.video}</td>
                <td style={{ padding: '10px 14px', color: T.muted, fontFamily: 'Inter', fontSize: 11, lineHeight: 1.5, fontStyle: 'italic' }}>{scene.audio}</td>
                <td style={{ padding: '10px 14px', color: scene.overlay_color || T.naranja, fontFamily: 'Bruno Ace, monospace', fontSize: 12, fontWeight: 700 }}>{scene.overlay_text}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: scene.overlay_color || T.naranja, border: `2px solid ${T.border}` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Caption */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <p style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Caption TikTok / Instagram</p>
        <p style={{ color: T.text, fontSize: 13, fontFamily: 'Inter', lineHeight: 1.7, margin: 0 }}>{content.caption}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {(content.hashtags || []).map((tag, i) => (
            <span key={i} style={{ color: T.aqua, fontSize: 11, fontFamily: 'Space Grotesk', background: 'rgba(0,229,255,0.08)', borderRadius: 4, padding: '2px 8px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProspectsTab({ leads }) {
  const [search, setSearch] = useState('');
  const filtered = (leads || []).filter(l =>
    !search || [l.first_name, l.last_name, l.email, l.company_name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, email o empresa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 16px', background: T.panel, border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.text, fontFamily: 'Inter, sans-serif', fontSize: 13,
            outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,107,0,0.05)' }}>
              {['#', 'Nombre', 'Email', 'WhatsApp', 'Empresa', 'Giro', 'Fuente'].map(h => (
                <th key={h} style={{ color: T.muted, fontSize: 10, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: 1, padding: '10px 14px', textAlign: 'left', borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <td style={{ padding: '9px 14px', color: T.muted, fontFamily: 'monospace', fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: '9px 14px', color: T.text, fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600 }}>{lead.first_name} {lead.last_name || ''}</td>
                <td style={{ padding: '9px 14px', color: T.aqua, fontFamily: 'Inter', fontSize: 12 }}>{lead.email}</td>
                <td style={{ padding: '9px 14px', color: '#25D366', fontFamily: 'Inter', fontSize: 12 }}>{lead.phone_whatsapp}</td>
                <td style={{ padding: '9px 14px', color: T.muted, fontFamily: 'Inter', fontSize: 12 }}>{lead.company_name || '—'}</td>
                <td style={{ padding: '9px 14px', color: T.muted, fontFamily: 'Inter', fontSize: 12 }}>{lead.industry || '—'}</td>
                <td style={{ padding: '9px 14px' }}>
                  <span style={{ background: 'rgba(255,107,0,0.15)', color: T.naranja, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontFamily: 'Space Grotesk', textTransform: 'uppercase' }}>{lead.source || 'web_form'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: T.muted, padding: '30px 0', fontFamily: 'Space Grotesk', fontSize: 13 }}>Sin resultados</p>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <Loader2 size={32} color={T.naranja} style={{ margin: '0 auto 16px' }} className="animate-spin" />
      <p style={{ color: T.muted, fontFamily: 'Space Grotesk', fontSize: 14 }}>Cargando contenido generado por Nexus IA...</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────

export default function VCardBatchApprovalModal({ batch, leads, onClose, onApproved, onRejected }) {
  const [activeTab, setActiveTab] = useState('email_wa');
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [message, setMessage] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const content = batch?.generated_content?.modalities;
  const batchNumber = batch?.batch_number;
  const batchId = batch?.id;

  const handleApprove = async () => {
    setApproving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/vcard/batches/${batchId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMessage({ type: 'success', text: data.message });
      setTimeout(() => {
        onApproved?.(batchId);
        onClose?.();
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      const res = await fetch(`/api/v1/vcard/batches/${batchId}/approve`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: rejectNotes })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMessage({ type: 'info', text: data.message });
      setTimeout(() => {
        onRejected?.(batchId);
        onClose?.();
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRejecting(false);
      setShowRejectConfirm(false);
    }
  };

  return (
    // Overlay
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      {/* Modal Container */}
      <div style={{
        background: T.bg,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        border: `1px solid ${T.border}`,
        borderRadius: 20, maxWidth: 1100, width: '100%',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        boxShadow: `0 0 60px rgba(255,107,0,0.12), 0 0 120px rgba(0,0,0,0.5)`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ padding: '20px 28px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.naranja}20`, border: `1px solid ${T.naranja}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color={T.naranja} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Bruno Ace, monospace', color: T.text, fontSize: 18, letterSpacing: 1, margin: 0, textTransform: 'uppercase' }}>
                Compuerta de Aprobación · <span style={{ color: T.naranja }}>Lote #{batchNumber}</span>
              </h2>
              <p style={{ color: T.muted, fontSize: 12, fontFamily: 'Space Grotesk', margin: '3px 0 0' }}>
                Rose Sales Engine · TSolutions IPIDD · Javier Gallardo
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: T.muted }}>
            <X size={18} />
          </button>
        </div>

        {/* ── STATS BAR ── */}
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 14, flexWrap: 'wrap', flexShrink: 0 }}>
          <StatBadge label="Prospectos" value={leads?.length || 50} color={T.naranja} />
          <StatBadge label="Lote #" value={`#${batchNumber || '—'}`} color={T.aqua} />
          <StatBadge label="Estado" value="PENDIENTE" color="#F59E0B" />
          <StatBadge label="Canales" value="3" color="#A855F7" />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            <Zap size={14} color={T.naranja} />
            <span style={{ color: T.muted, fontSize: 12, fontFamily: 'Space Grotesk' }}>Al aprobar, el despacho inicia en &lt; 3 segundos</span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ padding: '0 28px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 4, overflowX: 'auto', flexShrink: 0 }}>
          {TABS.map(tab => (
            <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={setActiveTab} />
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: '24px 28px', overflow: 'auto', flex: 1 }}>
          {activeTab === 'email_wa'  && <EmailWATab  content={content?.email_whatsapp} />}
          {activeTab === 'meta'      && <MetaAdsTab  content={content?.meta_ads} />}
          {activeTab === 'tiktok'    && <TikTokTab   content={content?.tiktok_shorts} />}
          {activeTab === 'prospects' && <ProspectsTab leads={leads} />}
        </div>

        {/* ── REJECT CONFIRM ── */}
        {showRejectConfirm && (
          <div style={{ padding: '16px 28px', background: 'rgba(239,68,68,0.08)', borderTop: `1px solid rgba(239,68,68,0.3)` }}>
            <p style={{ color: '#FCA5A5', fontFamily: 'Space Grotesk', fontSize: 13, margin: '0 0 10px' }}>
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} />
              Escribe el motivo del rechazo (opcional). Los prospectos volverán al estado "Nuevo".
            </p>
            <textarea
              value={rejectNotes}
              onChange={e => setRejectNotes(e.target.value)}
              placeholder="Ej: Ajustar el tono del email, revisar el guión del short..."
              style={{ width: '100%', padding: '10px 14px', background: '#0E1117', border: `1px solid rgba(239,68,68,0.4)`, borderRadius: 8, color: T.text, fontFamily: 'Inter', fontSize: 13, resize: 'vertical', minHeight: 70, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={handleReject} disabled={rejecting}
                style={{ padding: '8px 20px', background: T.danger, border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {rejecting ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
              <button onClick={() => setShowRejectConfirm(false)}
                style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontFamily: 'Space Grotesk', fontSize: 13, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ── STATUS MESSAGE ── */}
        {message && (
          <div style={{
            padding: '12px 28px',
            background: message.type === 'success' ? 'rgba(34,197,94,0.12)' : message.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(0,229,255,0.10)',
            borderTop: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: message.type === 'success' ? T.success : message.type === 'error' ? T.danger : T.aqua,
            fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600
          }}>
            {message.type === 'success' ? <CheckCircle size={15} style={{ marginRight: 8 }} /> : <AlertTriangle size={15} style={{ marginRight: 8 }} />}
            {message.text}
          </div>
        )}

        {/* ── FOOTER ACTIONS ── */}
        <div style={{ padding: '18px 28px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={() => setShowRejectConfirm(v => !v)} disabled={rejecting || approving}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.3)`,
              borderRadius: 10, color: T.danger, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <XCircle size={18} />
            Solicitar Ajuste a Nexus
          </button>

          {/* BOTÓN PRINCIPAL: Aprobar y Desplegar Lote */}
          <button
            onClick={handleApprove}
            disabled={approving || rejecting}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 36px',
              background: approving ? 'rgba(255,107,0,0.5)' : T.naranja,
              border: 'none', borderRadius: 12,
              color: '#fff',
              fontFamily: 'Bruno Ace, monospace',
              fontWeight: 700, fontSize: 16, letterSpacing: 1,
              cursor: approving ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              boxShadow: approving ? 'none' : '0 0 25px rgba(255,107,0,0.6), 0 0 50px rgba(255,107,0,0.25)',
              transition: 'all 0.2s',
              transform: approving ? 'none' : undefined,
            }}
            onMouseEnter={e => { if (!approving) e.target.style.boxShadow = '0 0 40px rgba(255,107,0,0.9), 0 0 70px rgba(255,107,0,0.4)'; }}
            onMouseLeave={e => { if (!approving) e.target.style.boxShadow = '0 0 25px rgba(255,107,0,0.6), 0 0 50px rgba(255,107,0,0.25)'; }}
          >
            {approving ? (
              <><Loader2 size={20} className="animate-spin" /> Desplegando...</>
            ) : (
              <><CheckCircle size={20} /> Aprobar y Desplegar Lote</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
