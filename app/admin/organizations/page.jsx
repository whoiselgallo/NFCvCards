'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Edit2, Trash2, ShieldCheck, Users, Smartphone,
  Globe, Palette, Lock, Unlock, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Search
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    custom_domain: '',
    primary_color: '#EE334E',
    logo_url: '',
    enforce_branding: false,
    max_members: 50
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/organizations');
      const json = await res.json();
      if (json.success) {
        setOrganizations(json.organizations || []);
        setError(null);
      } else {
        setError(json.error || 'Error al cargar organizaciones');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const openCreateModal = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      slug: '',
      custom_domain: '',
      primary_color: '#EE334E',
      logo_url: '',
      enforce_branding: false,
      max_members: 50
    });
    setIsModalOpen(true);
  };

  const openEditModal = (org) => {
    setEditingOrg(org);
    setFormData({
      name: org.name || '',
      slug: org.slug || '',
      custom_domain: org.custom_domain || '',
      primary_color: org.primary_color || '#EE334E',
      logo_url: org.logo_url || '',
      enforce_branding: org.enforce_branding || false,
      max_members: org.max_members || 50
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const url = '/api/admin/organizations';
      const method = editingOrg ? 'PUT' : 'POST';
      const body = editingOrg ? { id: editingOrg.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Error al guardar la organización');

      setSuccessMsg(editingOrg ? 'Organización actualizada' : 'Organización creada exitosamente');
      setIsModalOpen(false);
      fetchOrganizations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Estás seguro de eliminar la organización "${name}"? Esta acción desvinculará sus tarjetas asociadas.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/organizations?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrgs = organizations.filter(o => {
    const term = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(term) ||
      o.slug.toLowerCase().includes(term) ||
      (o.custom_domain && o.custom_domain.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#030308] text-slate-300 p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
              title="Volver a Mission Control"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#EE334E]" /> Gestión Multi-Tenant B2B
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Administra empresas, dominios corporativos, límites de miembros y control de branding empresarial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrganizations}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className={'w-4 h-4 ' + (loading ? 'animate-spin text-[#EE334E]' : 'text-slate-300')} />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EE334E] hover:bg-[#ff0003] text-white text-sm font-bold shadow-lg shadow-[#EE334E]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Empresa</span>
            </button>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* BARRA DE BÚSQUEDA */}
        <div className="flex justify-between items-center bg-[#0a0a10] border border-white/5 p-4 rounded-2xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa, slug o dominio personalizado..."
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#EE334E]"
            />
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Total: {filteredOrgs.length} organizaciones
          </span>
        </div>

        {/* GRID DE ORGANIZACIONES */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#EE334E]" />
            <p className="text-sm">Cargando organizaciones corporativas...</p>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="py-16 text-center bg-[#0a0a10] border border-white/5 rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Sin organizaciones registradas</h3>
            <p className="text-xs text-slate-400 mb-4">Empieza agregando tu primera empresa B2B para habilitar multi-tenancy.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-[#EE334E] text-white text-xs font-bold"
            >
              + Crear Empresa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-[#0a0a10] border border-white/5 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {org.logo_url ? (
                        <img src={org.logo_url} alt={org.name} className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1 border border-white/10" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: org.primary_color || '#EE334E' }}
                        >
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{org.name}</h3>
                        <span className="text-[11px] font-mono text-slate-400">/{org.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(org)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Editar organización"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(org.id, org.name)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Eliminar organización"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                    {org.custom_domain && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span className="font-mono text-[11px]">{org.custom_domain}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" /> Color Institucional:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: org.primary_color }} />
                        <span className="font-mono text-[11px] text-white">{org.primary_color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        {org.enforce_branding ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
                        Branding Estricto:
                      </span>
                      <span className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (org.enforce_branding ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400')}>
                        {org.enforce_branding ? 'FORZADO' : 'LIBRE'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> {org.member_count || 0} / {org.max_members}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Smartphone className="w-3.5 h-3.5 text-purple-400" /> {org.profile_count || 0} tarjetas
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">ID #{org.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a10] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#EE334E]" />
                {editingOrg ? 'Editar Organización B2B' : 'Nueva Organización B2B'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Empresa *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Banco Santander, TechCorp"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#EE334E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug Corporativo *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ej: santander-corp"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#EE334E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dominio Personalizado</label>
                  <input
                    type="text"
                    value={formData.custom_domain}
                    onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                    placeholder="cards.empresa.com"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#EE334E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Color Primario Institucional</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-[#EE334E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Límite de Miembros</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_members}
                    onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#EE334E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Logotipo Corporativo</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://empresa.com/logo.png"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#EE334E]"
                />
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Forzar Branding Corporativo</span>
                  <span className="text-[11px] text-slate-400">Bloquea el color y logo empresarial en los perfiles de todos los colaboradores.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enforce_branding}
                  onChange={(e) => setFormData({ ...formData, enforce_branding: e.target.checked })}
                  className="w-5 h-5 accent-[#EE334E] rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#EE334E] hover:bg-[#ff0003] text-white text-xs font-bold shadow-lg shadow-[#EE334E]/20"
                >
                  {saving ? 'Guardando...' : editingOrg ? 'Actualizar Empresa' : 'Crear Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
