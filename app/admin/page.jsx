'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Ticket, MessageSquare, 
  Activity, Truck, Search, Bell, Settings, LogOut, PackageOpen, Star
} from 'lucide-react';

const KPIS = [
  { label: 'MRR (Ingreso Mensual)', value: '$12,450', trend: '+14%', isGood: true, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Usuarios Activos', value: '1,248', trend: '+5%', isGood: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Tickets Pendientes', value: '14', trend: '-2', isGood: true, icon: Ticket, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { label: 'Hardware Pendiente', value: '38', trend: '+12', isGood: false, icon: Truck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const SUBSCRIPTIONS = [
  { id: 1, user: 'Agencia XYZ', plan: 'Marca Blanca', status: 'Active', amount: '$299/mo', date: '2023-10-15' },
  { id: 2, user: 'Dr. Roberto M.', plan: 'Meet Me', status: 'Active', amount: '$49/yr', date: '2023-10-14' },
  { id: 3, user: 'Tech Solutions Corp', plan: 'Elite Business', status: 'Canceled', amount: '$599/yr', date: '2023-10-12' },
  { id: 4, user: 'Maria G. Freelance', plan: 'Profesional', status: 'Active', amount: '$199/yr', date: '2023-10-10' },
];

const TICKETS = [
  { id: 'TCK-102', user: 'Agencia XYZ', issue: 'Configuración DNS Dominio', priority: 'High', status: 'Open' },
  { id: 'TCK-103', user: 'Juan Pérez', issue: 'Problema al escanear sticker', priority: 'Medium', status: 'In Progress' },
  { id: 'TCK-104', user: 'Tech Solutions', issue: 'Solicitud de reembolso', priority: 'High', status: 'Open' },
];

const REVIEWS = [
  { id: 1, user: 'Ana Lopez', rating: 5, type: 'Reseña', text: 'El hardware de Bamboo es increíble, mis clientes lo aman.' },
  { id: 2, user: 'Carlos D.', rating: 2, type: 'Queja', text: 'El envío de mi sticker tardó 2 semanas en llegar.' },
  { id: 3, user: 'Agencia Digital', rating: 4, type: 'Sugerencia', text: 'Sería genial tener integración con HubSpot.' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#030308] text-slate-300 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a10] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-[#EE334E] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            TSolutions
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">Mission Control</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('overview')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'overview' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <LayoutDashboard className="w-4 h-4" /> Resumen Global
          </button>
          <button onClick={() => setActiveTab('subscriptions')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'subscriptions' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <CreditCard className="w-4 h-4" /> Pagos y Suscripciones
          </button>
          <button onClick={() => setActiveTab('hardware')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'hardware' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <Truck className="w-4 h-4" /> Envíos Hardware
          </button>
          <button onClick={() => setActiveTab('tickets')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'tickets' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <Ticket className="w-4 h-4" /> Tickets de Soporte
          </button>
          <button onClick={() => setActiveTab('feedback')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'feedback' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <MessageSquare className="w-4 h-4" /> Evaluaciones y Quejas
          </button>
          <button onClick={() => setActiveTab('logs')} className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ' + (activeTab === 'logs' ? 'bg-[#EE334E]/10 text-[#EE334E]' : 'hover:bg-white/5 text-slate-400')}>
            <Activity className="w-4 h-4" /> Registro de Actividad
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 text-slate-400 transition-colors">
            <Settings className="w-4 h-4" /> Configuración
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-500/10 text-red-400 transition-colors mt-1">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a10]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Centro de Mando</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Buscar cliente, ticket, folio..." className="bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#EE334E] text-white w-64" />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {KPIS.map((kpi, i) => (
              <div key={i} className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' + kpi.bg}>
                    <kpi.icon className={'w-5 h-5 ' + kpi.color} />
                  </div>
                  <span className={'text-xs font-bold px-2 py-1 rounded-full ' + (kpi.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>
                    {kpi.trend}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{kpi.value}</h3>
                <p className="text-sm text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* DISTRIBUCIÓN DE PAQUETES */}
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6 lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><PackageOpen className="w-5 h-5 text-[#EE334E]" /> Clientes por Paquete</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Estudiante (Gratis)</span><span className="text-white font-bold">540</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-slate-500 h-2 rounded-full" style={{width: '45%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Meet Me</span><span className="text-white font-bold">320</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Profesional</span><span className="text-white font-bold">215</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{width: '20%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Empresa</span><span className="text-white font-bold">142</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{width: '15%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Elite Business</span><span className="text-white font-bold">22</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Marca Blanca (Agencias)</span><span className="text-white font-bold">9</span></div>
                  <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-[#EE334E] h-2 rounded-full" style={{width: '3%'}}></div></div>
                </div>
              </div>
            </div>

            {/* TICKETS DE SOPORTE Y SEGUIMIENTO */}
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Ticket className="w-5 h-5 text-[#EE334E]" /> Seguimiento de Tickets</h3>
                <button className="text-xs text-[#EE334E] hover:underline">Ver todos</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Cliente</th>
                      <th className="pb-3 font-medium">Problema</th>
                      <th className="pb-3 font-medium">Prioridad</th>
                      <th className="pb-3 font-medium">Estado</th>
                      <th className="pb-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {TICKETS.map((t) => (
                      <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-mono text-slate-400">{t.id}</td>
                        <td className="py-4 text-white font-medium">{t.user}</td>
                        <td className="py-4 text-slate-300">{t.issue}</td>
                        <td className="py-4">
                          <span className={'px-2 py-1 rounded-md text-[10px] font-bold uppercase ' + (t.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500')}>{t.priority}</span>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500">{t.status}</span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-slate-400 hover:text-white transition-colors">Gestionar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FLUJO DE SUSCRIPCIONES (STRIPE) */}
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#EE334E]" /> Suscripciones y Cancelaciones</h3>
              </div>
              <div className="space-y-4">
                {SUBSCRIPTIONS.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.user}</h4>
                      <p className="text-xs text-slate-400">{s.plan} • {s.amount}</p>
                    </div>
                    <div className="text-right">
                      <span className={'text-xs font-bold px-2 py-1 rounded-md uppercase ' + (s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>{s.status}</span>
                      <p className="text-[10px] text-slate-500 mt-1">{s.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EVALUACIONES Y QUEJAS */}
            <div className="bg-[#0a0a10] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#EE334E]" /> Evaluaciones y Quejas</h3>
              </div>
              <div className="space-y-4">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ' + (r.type === 'Queja' ? 'bg-rose-500/20 text-rose-400' : r.type === 'Sugerencia' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400')}>{r.type}</span>
                        <h4 className="text-xs font-bold text-white">{r.user}</h4>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={'w-3 h-3 ' + (star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700')} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}