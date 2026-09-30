'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Download, Megaphone, Search, ShieldOff, Upload, Zap, Bell, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react';
import VCardBatchApprovalModal from './components/VCardBatchApprovalModal';

const STATUS_LABELS = {
     new: 'Nuevo',
     qualified: 'Calificado',
     contacted: 'Contactado',
     interested: 'Interesado',
     customer: 'Cliente',
     not_interested: 'No interesado',
     do_not_contact: 'No contactar'
};

export default function CrmPage() {
     const [contacts, setContacts] = useState([]);
     const [total, setTotal] = useState(0);
     const [search, setSearch] = useState('');
     const [status, setStatus] = useState('');
     const [loading, setLoading] = useState(true);
     const [message, setMessage] = useState('');
     const [importing, setImporting] = useState(false);
     const [campaignName, setCampaignName] = useState('');
     const [campaignSubject, setCampaignSubject] = useState('');
     const [campaignMessage, setCampaignMessage] = useState('');

     // ── ROSE SALES ENGINE STATE ──────────────────────────────────────────
     const [salesBatches, setSalesBatches] = useState([]);
     const [selectedBatch, setSelectedBatch] = useState(null);
     const [batchLeads, setBatchLeads] = useState([]);
     const [showBatchModal, setShowBatchModal] = useState(false);
     const [salesAlert, setSalesAlert] = useState(null);
     const sseRef = useRef(null);

     // Conectar al canal SSE de notificaciones del Rose Sales Engine
     useEffect(() => {
       const connect = () => {
         try {
           const es = new EventSource('/api/v1/vcard/events');
           sseRef.current = es;

           es.addEventListener('BATCH_READY_FOR_APPROVAL', (e) => {
             const data = JSON.parse(e.data);
             setSalesAlert({ type: 'batch', ...data });
             loadSalesBatches();
           });

           es.addEventListener('HIGH_CONVERSION_ALERT', (e) => {
             const data = JSON.parse(e.data);
             setSalesAlert({ type: 'conversion', ...data });
           });

           es.addEventListener('DISPATCH_PROGRESS', (e) => {
             const data = JSON.parse(e.data);
             setSalesAlert({ type: 'progress', ...data });
           });

           es.addEventListener('WHATSAPP_LEAD_REPLIED', (e) => {
             const data = JSON.parse(e.data);
             setSalesAlert({ type: 'whatsapp_reply', ...data });
             loadContacts();
             loadSalesBatches();
           });

           es.onerror = () => {
             es.close();
             // Reconectar tras 10s si se pierde la conexión
             setTimeout(connect, 10000);
           };
         } catch (_err) { /* SSE no soportado, silencioso */ }
       };

       connect();
       return () => sseRef.current?.close();
     }, []);

     const loadSalesBatches = async () => {
       try {
         const res = await fetch('/api/v1/vcard/batches?limit=5');
         const data = await res.json();
         if (data.success) setSalesBatches(data.batches || []);
       } catch (_err) { /* silencioso */ }
     };

     useEffect(() => { loadSalesBatches(); }, []);

     const openBatch = async (batch) => {
       setSelectedBatch(batch);
       // Cargar los leads del lote
       const leads = batch.generated_content?.lead_snapshot || [];
       if (!leads.length) {
         try {
           const res = await fetch(`/api/v1/vcard/batches?limit=1`);
           const data = await res.json();
           setBatchLeads(data.batches?.[0]?.leads || []);
         } catch (_err) { setBatchLeads([]); }
       } else {
         setBatchLeads(leads);
       }
       setShowBatchModal(true);
     };

     const getStatusColor = (s) => ({
       PENDING_APPROVAL: '#F59E0B', APPROVED: '#22C55E',
       DISPATCHING: '#3B82F6', COMPLETED: '#6B7280', REJECTED: '#EF4444'
     }[s] || '#94A3B8');
     // ─────────────────────────────────────────────────────────────────────

     const loadContacts = async () => {
          setLoading(true);
          try {
               const params = new URLSearchParams({ search, status, limit: '200' });
               const response = await fetch(`/api/admin/crm/contacts?${params}`);
               const data = await response.json();
               if (!data.success) throw new Error(data.error || 'No se pudieron cargar los contactos');
               setContacts(data.contacts);
               setTotal(data.total);
          } catch (error) {
               setMessage(error.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => { loadContacts(); }, [status]);

     const handleImport = async (event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          setImporting(true);
          setMessage('Importando y deduplicando registros...');
          try {
               const body = new FormData();
               body.append('file', file);
               const response = await fetch('/api/admin/crm/import', { method: 'POST', body });
               const data = await response.json();
               if (!data.success) throw new Error(data.error || 'No se pudo importar el CSV');
               setMessage(`Importación completa: ${data.importedCount} nuevos, ${data.updatedCount} actualizados, ${data.rejectedCount} rechazados.`);
               await loadContacts();
          } catch (error) {
               setMessage(error.message);
          } finally {
               setImporting(false);
          }
     };

     const updateContact = async (contact, patch) => {
          const response = await fetch('/api/admin/crm/contacts', {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ id: contact.id, ...patch })
          });
          const data = await response.json();
          if (!data.success) throw new Error(data.error || 'No se pudo actualizar');
          setContacts(current => current.map(item => item.id === contact.id ? data.contact : item));
     };

     const revokeContact = async (contact) => {
          try {
               await updateContact(contact, { doNotContact: true, status: 'do_not_contact' });
               await fetch('/api/admin/crm/consent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contactId: contact.id, revoked: true, source: 'crm_panel' })
               });
               setMessage(`Contacto excluido de futuras campañas: ${contact.display_name || contact.company_name}.`);
          } catch (error) {
               setMessage(error.message);
          }
     };

     const createCampaign = async (event) => {
          event.preventDefault();
          try {
               const response = await fetch('/api/admin/crm/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: campaignName, subject: campaignSubject, body: campaignMessage })
               });
               const data = await response.json();
               if (!data.success) throw new Error(data.error || 'No se pudo crear la campaña');
               setCampaignName('');
               setCampaignSubject('');
               setCampaignMessage('');
               setMessage('Campaña guardada como borrador.');
          } catch (error) {
               setMessage(error.message);
          }
     };

     return (
          <div className="min-h-screen bg-[#030308] text-slate-300 p-4 sm:p-6 lg:p-8">
               <header className="max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                         <Link href="/admin" className="text-xs text-slate-500 hover:text-white inline-flex items-center gap-1 mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Panel administrativo</Link>
                         <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Database className="w-7 h-7 text-[#EE334E]" /> CRM de Prospectos</h1>
                         <p className="text-sm text-slate-400 mt-1">Base comercial independiente para DENUE y contactos propios. Total: {total}</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#EE334E] hover:bg-[#ff0003] text-white text-xs font-bold">
                         <Upload className="w-4 h-4" /> {importing ? 'Importando...' : 'Importar CSV DENUE'}
                         <input type="file" accept=".csv,text/csv" onChange={handleImport} disabled={importing} className="hidden" />
                    </label>
                    <div className="flex gap-2">
                         <a href="/api/admin/crm/export?format=csv" className="inline-flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold"><Download className="w-4 h-4" /> CSV</a>
                         <a href="/api/admin/crm/export?format=vcf" className="inline-flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold"><Download className="w-4 h-4" /> VCF</a>
                    </div>
               </header>

               {message && <div className="max-w-[1800px] mx-auto mb-5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">{message}</div>}

               <main className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
                    <section className="bg-[#0a0a10] border border-white/10 rounded-2xl overflow-hidden">
                         <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-3">
                              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => event.key === 'Enter' && loadContacts()} placeholder="Buscar empresa, correo, teléfono, ciudad..." className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#EE334E]" /></div>
                              <select value={status} onChange={event => setStatus(event.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"><option value="">Todos los estados</option>{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
                              <button onClick={loadContacts} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white">Buscar</button>
                         </div>
                         <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                   <thead className="bg-black/30 text-[10px] uppercase text-slate-500"><tr><th className="p-3">Empresa</th><th className="p-3">Giro</th><th className="p-3">Contacto</th><th className="p-3">Ubicación</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead>
                                   <tbody className="divide-y divide-white/5">
                                        {loading ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Cargando contactos...</td></tr> : contacts.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Sin contactos. Importa tu primer CSV DENUE.</td></tr> : contacts.map(contact => <tr key={contact.id} className="hover:bg-white/[0.03] align-top"><td className="p-3"><p className="font-bold text-white">{contact.display_name || contact.company_name || 'Sin nombre'}</p><p className="text-[10px] text-slate-500">{contact.legal_name}</p></td><td className="p-3 text-slate-400 max-w-[180px]">{contact.industry || '-'}</td><td className="p-3"><p className="text-slate-300">{contact.phone_number || '-'}</p><p className="text-slate-500 break-all">{contact.email || '-'}</p></td><td className="p-3 text-slate-400">{[contact.city, contact.state].filter(Boolean).join(', ') || '-'}</td><td className="p-3"><select value={contact.status} onChange={event => updateContact(contact, { status: event.target.value }).catch(error => setMessage(error.message))} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white">{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></td><td className="p-3"><button onClick={() => revokeContact(contact)} title="Excluir de campañas" className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300"><ShieldOff className="w-3.5 h-3.5" /></button></td></tr>)}
                                   </tbody>
                              </table>
                         </div>
                    </section>

                    <aside className="space-y-6">
                          {/* ROSE SALES ENGINE WIDGET */}
                          <section style={{ background: "#0A0D14", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 16, overflow: "hidden" }}>
                            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,107,0,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
                              <Zap size={16} color="#FF6B00" />
                              <span style={{ fontFamily: "Bruno Ace, monospace", color: "#F8FAFC", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Rose Sales Engine</span>
                              {salesBatches.filter(b => b.status === "PENDING_APPROVAL").length > 0 && (
                                <span style={{ marginLeft: "auto", background: "#FF6B00", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
                                  {salesBatches.filter(b => b.status === "PENDING_APPROVAL").length}
                                </span>
                              )}
                            </div>
                            <div style={{ padding: 14 }}>
                              {salesBatches.length === 0 ? (
                                <p style={{ color: "#475569", fontSize: 11, fontFamily: "Space Grotesk", textAlign: "center", padding: "12px 0" }}>Sin lotes. Trigger: 50 prospectos nuevos.</p>
                              ) : salesBatches.slice(0, 5).map(batch => (
                                <button key={batch.id} onClick={() => openBatch(batch)} style={{ background: "#121722", border: "1px solid " + (batch.status === "PENDING_APPROVAL" ? "rgba(255,107,0,0.5)" : "rgba(255,255,255,0.06)"), borderRadius: 10, padding: "9px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 6 }}>
                                  <div>
                                    <p style={{ color: "#F8FAFC", fontFamily: "Bruno Ace, monospace", fontSize: 11, margin: 0 }}>Lote #{batch.batch_number}</p>
                                    <p style={{ color: "#64748B", fontFamily: "Inter", fontSize: 9, margin: "2px 0 0" }}>{batch.lead_count || 50} prospectos</p>
                                  </div>
                                  <span style={{ background: getStatusColor(batch.status) + "22", color: getStatusColor(batch.status), borderRadius: 4, padding: "2px 7px", fontSize: 9, fontFamily: "Space Grotesk", fontWeight: 700 }}>{(batch.status || "").replace("_", " ")}</span>
                                </button>
                              ))}
                              <button onClick={loadSalesBatches} style={{ marginTop: 8, width: "100%", padding: "7px", background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 6, color: "#FF6B00", fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Actualizar lotes</button>
                            </div>
                          </section>
                         <section className="bg-[#0a0a10] border border-white/10 rounded-2xl p-5"><h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><Download className="w-4 h-4 text-[#00E5FF]" /> Importación DENUE</h2><p className="text-xs text-slate-400 leading-relaxed">El sistema conserva `external_id` y actualiza registros repetidos por fuente. Solo importa contactos con teléfono, correo o sitio web.</p></section>
                         <section className="bg-[#0a0a10] border border-white/10 rounded-2xl p-5"><h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Megaphone className="w-4 h-4 text-[#EE334E]" /> Nueva campaña</h2><form onSubmit={createCampaign} className="space-y-3"><input required value={campaignName} onChange={event => setCampaignName(event.target.value)} placeholder="Nombre interno" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" /><input value={campaignSubject} onChange={event => setCampaignSubject(event.target.value)} placeholder="Asunto" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" /><textarea value={campaignMessage} onChange={event => setCampaignMessage(event.target.value)} placeholder="Borrador del mensaje" rows="5" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none" /><button className="w-full py-2.5 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold">Guardar borrador</button></form></section>
                         <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5"><h2 className="text-sm font-bold text-amber-300 mb-2">Control publicitario</h2><p className="text-xs text-slate-400 leading-relaxed">Los datos DENUE conservan su fuente. La exclusión de un contacto bloquea campañas futuras y queda registrada en el historial de consentimiento.</p></section>
                    </aside>
               </main>
                {/* NOTIFICACION SSE EN TIEMPO REAL */}
                {salesAlert && (
                  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9000, background: salesAlert.type === "batch" ? "#FF6B00" : salesAlert.type === "whatsapp_reply" ? "#16A34A" : "#22C55E", color: "#fff", borderRadius: 14, padding: "14px 20px", maxWidth: 360, boxShadow: "0 0 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 12 }}>
                    {salesAlert.type === "whatsapp_reply" ? <MessageSquare size={20} /> : salesAlert.type === "batch" ? <Bell size={20} /> : <TrendingUp size={20} />}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Bruno Ace, monospace", fontSize: 11, fontWeight: 700, margin: 0 }}>
                        {salesAlert.type === "whatsapp_reply" ? "RESPUESTA WHATSAPP" : salesAlert.type === "batch" ? "LOTE PENDIENTE" : "CONVERSION"}
                      </p>
                      <p style={{ fontFamily: "Space Grotesk", fontSize: 11, margin: "3px 0 0" }}>{salesAlert.message}</p>
                    </div>
                    <button onClick={() => setSalesAlert(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#fff", cursor: "pointer" }}>x</button>
                  </div>
                )}

                {/* MODAL DE APROBACION DE JAVIER GALLARDO */}
                {showBatchModal && selectedBatch && (
                  <VCardBatchApprovalModal
                    batch={selectedBatch}
                    leads={batchLeads}
                    onClose={() => { setShowBatchModal(false); setSelectedBatch(null); setBatchLeads([]); }}
                    onApproved={() => { loadSalesBatches(); setSalesAlert(null); }}
                    onRejected={() => { loadSalesBatches(); setSalesAlert(null); }}
                  />
                )}
          </div>
     );
}
