'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User } from 'lucide-react';
import brandConfig from '../../brand.config';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegistering) {
      // Flujo de Registro
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Error al registrar la cuenta.');
          setLoading(false);
          return;
        }
        // Si el registro fue exitoso, hacemos login automticamente
        const signInRes = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });
        if (signInRes?.error) {
          setError('Error al iniciar sesin tras registro.');
          setLoading(false);
        } else {
          window.location.href = '/dashboard';
        }
      } catch(err) {
        setError('Error de red.');
        setLoading(false);
      }
    } else {
      // Flujo de Login Tradicional
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (res?.error) {
        setError('Credenciales invlidas o no registradas.');
        setLoading(false);
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-[#0A0A10] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-transparent rounded-2xl pointer-events-none" />
          <img src={brandConfig.assets.logo} alt="Logo" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bruno text-white mb-2 tracking-wide text-center uppercase">{brandConfig.companyName}</h1>
        <p className="text-slate-400 mb-10 text-center text-sm">{isRegistering ? 'Crea una cuenta nueva' : 'Bienvenido de vuelta'}</p>

        <div className="w-full bg-[#0A0A10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {isRegistering && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu Nombre Completo"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Correo Electrnico"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Contrasea"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#EE334E] focus:ring-1 focus:ring-[#EE334E] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#EE334E] hover:bg-[#ff0003] disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(238,51,78,0.4)]"
            >
              {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Ingresar')}
            </button>
          </form>

          <div className="text-center mb-6">
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isRegistering ? 'Ya tengo una cuenta, iniciar sesin' : 'No tengo cuenta, quiero registrarme'}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#0A0A10] text-slate-500">O INGRESA CON</span>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              type="button" 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })} 
              className="w-full relative overflow-hidden group flex items-center justify-center gap-3 py-4 bg-black/40 hover:bg-[#ff0003]/10 border border-white/10 hover:border-[#ff0003]/50 rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,3,0.3)]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-mono text-sm tracking-widest text-slate-300 group-hover:text-[#ff0003] font-bold transition-colors">
                ACCESO SEGURO CON GOOGLE
              </span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500 font-mono text-center">
          PROTEGIDO POR CIFRADO DE GRADO MILITAR
        </p>
      </div>
    </div>
  );
}
