import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/nextAuthOptions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings, CreditCard, Star, Calendar, ExternalLink, Activity } from 'lucide-react';
import brandConfig from '../../brand.config';

export const metadata = {
  title: `Mi Panel | ${brandConfig.companyName}`,
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const userPlan = session.user?.plan_id || 'free';
  const planNames = {
    free: 'Plan Gratuito',
    student: 'Plan Estudiante',
    meetme: 'Plan Meet Me',
    pro: 'Plan Profesional',
    business: 'Plan Empresa',
    elite: 'Elite Business',
    marcablanca: 'Marca Blanca'
  };

  const getTier = (plan) => {
    switch(plan) {
      case 'student':
      case 'meetme': return 1;
      case 'pro': return 2;
      case 'business': return 3;
      case 'elite':
      case 'marcablanca': return 4;
      default: return 0;
    }
  };

  const tier = getTier(userPlan);

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <img src={brandConfig.assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-bruno font-bold tracking-wider uppercase">Panel de Control</h1>
              <p className="text-slate-400 font-mono text-sm">Bienvenido(a), {session.user.name}</p>
            </div>
          </div>
          <Link href="/builder" className="px-6 py-3 bg-[#EE334E] hover:bg-[#ff0003] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)] flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Ir al Constructor de Tarjetas
          </Link>
        </header>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 text-[#00E5FF]">
              <Star className="w-6 h-6" />
              <h3 className="text-lg font-bold">Tu Plan Actual</h3>
            </div>
            <div className="text-4xl font-extrabold mb-2 text-white">
              {planNames[userPlan] || 'Plan Gratuito'}
            </div>
            <p className="text-slate-400 text-sm">
              Nivel de Desbloqueo: Tier {tier}
            </p>
          </div>

          <div className="bg-[#0A0A10]/80 border border-white/10 rounded-3xl p-8 backdrop-blur-sm col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 blur-[50px]" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#00E5FF]" /> Novedades y Anuncios</h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="text-[#EE334E] text-xs font-bold uppercase tracking-wider mb-1 block">NUEVO</span>
                <p className="text-sm text-slate-300">¡Hemos eliminado los cobros individuales por descarga! Ahora todos los entregables están incluidos en tu plan sin costo extra.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-1 block">PRÓXIMAMENTE</span>
                <p className="text-sm text-slate-300">Vinculación nativa con herramientas de productividad (Notion, Zapier, etc.). ¡Mantente al tanto de estas actualizaciones aquí mismo!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="w-6 h-6" /> Módulos Desbloqueados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className={`p-6 rounded-2xl border ${tier >= 0 ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
            <h4 className="font-bold mb-2">Constructor Básico</h4>
            <p className="text-xs text-slate-400">Edición de perfil, contacto e imagen de portada.</p>
          </div>

          <div className={`p-6 rounded-2xl border ${tier >= 1 ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
            <h4 className="font-bold mb-2">Temas Premium</h4>
            <p className="text-xs text-slate-400">Acceso a todos los diseños y layouts estéticos.</p>
          </div>

          <div className={`p-6 rounded-2xl border ${tier >= 2 ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
            <h4 className="font-bold mb-2">Integraciones Pro</h4>
            <p className="text-xs text-slate-400">Vinculación directa con Google Calendar y PayPal.</p>
          </div>

          <div className={`p-6 rounded-2xl border ${tier >= 3 ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
            <h4 className="font-bold mb-2">Métricas y Equipos</h4>
            <p className="text-xs text-slate-400">Control total del administrador corporativo.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
