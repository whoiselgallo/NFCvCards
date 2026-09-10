'use client';

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Briefcase, Utensils, Plus, Trash2, CheckCircle2, Download, Eye } from 'lucide-react';

export default function ExpressCatalogModal({ isOpen, onClose, companyName, onPdfGenerated }) {
  const [template, setTemplate] = useState('catalogo'); // 'catalogo' | 'portafolio' | 'menu'
  const [title, setTitle] = useState(companyName || 'Catálogo Comercial 2026');
  const [subtitle, setSubtitle] = useState('Productos & Soluciones de Alta Calidad');
  const [intro, setIntro] = useState('Somos una empresa comprometida con la excelencia y la satisfacción de nuestros clientes, ofreciendo productos garantizados y servicio de primer nivel.');
  const [policies, setPolicies] = useState('Precios en Moneda Nacional más IVA donde aplique. Envíos garantizados a todo el país. Métodos de pago aceptados: Transferencia SPEI, Tarjeta de Crédito/Débito y PayPal.');
  const [contactInfo, setContactInfo] = useState('WhatsApp de Ventas: Directo desde mi Tarjeta NFC • Correo: contacto@empresa.com');

  // Items dinámicos
  const [items, setItems] = useState([
    {
      title: 'Producto / Servicio Estrella 01',
      description: 'Descripción detallada de especificaciones, características y beneficios clave.',
      price: '$990 MXN',
      category: 'Línea Premium',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Solución Avanzada 02',
      description: 'Ideal para proyectos ejecutivos de alta exigencia técnica y entrega inmediata.',
      price: '$1,850 MXN',
      category: 'Línea Especial',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Paquete Integral 03',
      description: 'Solución completa llave en mano con soporte personalizado y garantía extendida.',
      price: '$3,400 MXN',
      category: 'Paquetes Todo Incluido',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  if (!isOpen) return null;

  const handleTemplateChange = (tpl) => {
    setTemplate(tpl);
    if (tpl === 'catalogo') {
      setTitle(`${companyName || 'Nuestra Empresa'} - Catálogo de Ventas`);
      setSubtitle('Línea Oficial de Productos y Soluciones');
      setIntro('Descubre nuestra selección de productos destacados diseñados para elevar tus estándares.');
      setPolicies('Garantía de satisfacción de 30 días. Envíos express a toda la república.');
    } else if (tpl === 'portafolio') {
      setTitle(`${companyName || 'Nuestro Estudio'} - Portafolio de Proyectos`);
      setSubtitle('Proyectos Destacados, Casos de Éxito & Diseño');
      setIntro('Una muestra selecta de nuestras obras, transformaciones e iniciativas de alto impacto.');
      setPolicies('Cotizaciones a medida. Todos los proyectos incluyen seguimiento y soporte post-entrega.');
    } else if (tpl === 'menu') {
      setTitle(`${companyName || 'Nuestro Restaurante'} - Menú Ejecutivo & Bebidas`);
      setSubtitle('Experiencia Gastronómica & Especialidades');
      setIntro('Platillos e ingredientes seleccionados diariamente para brindar una experiencia sensorial única.');
      setPolicies('Servicio a mesa y para llevar. Aceptamos todas las tarjetas y pagos contactless.');
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        title: `Nuevo Elemento 0${items.length + 1}`,
        description: 'Breve descripción de las características principales.',
        price: '$0 MXN',
        category: 'General',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80'
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const next = [...items];
    next[index][field] = value;
    setItems(next);
  };

  // Generación del documento imprimible en PDF / HTML de alta fidelidad
  const handleGenerateAndAssign = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 25px; background: #ffffff; }
    .header { text-align: center; border-bottom: 3px solid #EE334E; padding-bottom: 20px; margin-bottom: 25px; }
    .badge { display: inline-block; background: #EE334E; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    h1 { font-size: 26px; margin: 10px 0 5px 0; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { font-size: 14px; color: #64748b; font-weight: 500; }
    .intro-box { background: #f8fafc; border-left: 4px solid #EE334E; padding: 15px; border-radius: 0 12px 12px 0; margin-bottom: 30px; font-size: 13px; color: #334155; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; page-break-inside: avoid; background: #ffffff; }
    .card img { width: 100%; height: 160px; object-fit: cover; background: #f1f5f9; }
    .card-body { padding: 15px; }
    .card-category { font-size: 10px; color: #EE334E; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .card-title { font-size: 15px; font-weight: bold; margin: 4px 0; color: #0f172a; }
    .card-desc { font-size: 12px; color: #64748b; margin-bottom: 12px; line-height: 1.4; }
    .card-price { font-size: 16px; font-weight: 800; color: #10b981; }
    .footer-box { border-top: 2px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #475569; }
    .footer-box h4 { margin: 0 0 5px 0; color: #0f172a; font-size: 13px; text-transform: uppercase; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">${template === 'catalogo' ? 'Catálogo Oficial' : template === 'portafolio' ? 'Portafolio Profesional' : 'Menú & Especialidades'}</span>
    <h1>${title}</h1>
    <div class="subtitle">${subtitle}</div>
  </div>

  <div class="intro-box">
    <strong>Presentación:</strong> ${intro}
  </div>

  <div class="grid">
    ${items.map(item => `
      <div class="card">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'" />` : ''}
        <div class="card-body">
          <div class="card-category">${item.category || 'General'}</div>
          <div class="card-title">${item.title}</div>
          <div class="card-desc">${item.description}</div>
          ${item.price ? `<div class="card-price">${item.price}</div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="footer-box">
    <h4>Términos & Políticas Comerciales</h4>
    <p>${policies}</p>
    <p><strong>Contacto Directo:</strong> ${contactInfo}</p>
  </div>
</body>
</html>
    `;

    // Convertir a Data URI accesible como PDF/HTML interactivo
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Notificar al constructor
    if (onPdfGenerated) {
      onPdfGenerated(url);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0B12] border border-gray-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#10101C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EE334E]/20 border border-[#EE334E]/40 flex items-center justify-center text-lg text-[#EE334E]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Creador Express de Catálogo, Portafolio o Menú
              </h3>
              <p className="text-[11px] text-gray-400">
                Diseña tu documento corporativo en 2 minutos y vincúlalo a tu Tarjeta NFC
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

        {/* Plantillas Selector */}
        <div className="p-4 bg-[#08080E] border-b border-gray-800/80">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleTemplateChange('catalogo')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                template === 'catalogo'
                  ? 'bg-[#EE334E]/15 border-[#EE334E] text-white shadow-[0_0_15px_rgba(238,51,78,0.2)]'
                  : 'bg-white/5 border-gray-800 text-gray-400 hover:bg-white/10'
              }`}
            >
              <BookOpen className={`w-5 h-5 ${template === 'catalogo' ? 'text-[#EE334E]' : 'text-gray-400'}`} />
              <div>
                <div className="text-xs font-bold font-mono uppercase">1. Catálogo de Ventas</div>
                <div className="text-[10px] text-gray-400">Productos, fotos y precios</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateChange('portafolio')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                template === 'portafolio'
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/5 border-gray-800 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Briefcase className={`w-5 h-5 ${template === 'portafolio' ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
              <div>
                <div className="text-xs font-bold font-mono uppercase">2. Portafolio Pro</div>
                <div className="text-[10px] text-gray-400">Proyectos y diseños</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateChange('menu')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                template === 'menu'
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 border-gray-800 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Utensils className={`w-5 h-5 ${template === 'menu' ? 'text-amber-400' : 'text-gray-400'}`} />
              <div>
                <div className="text-xs font-bold font-mono uppercase">3. Menú Ejecutivo</div>
                <div className="text-[10px] text-gray-400">Platillos y servicios</div>
              </div>
            </button>
          </div>
        </div>

        {/* Formulario de Contenido */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300">
          {/* Datos Generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase font-mono text-[10px] font-bold">Título del Documento</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white font-medium focus:border-[#EE334E] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase font-mono text-[10px] font-bold">Subtítulo / Especialidad</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white font-medium focus:border-[#EE334E] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase font-mono text-[10px] font-bold">Introducción Corporativa / Reseña</label>
            <textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white font-medium focus:border-[#EE334E] focus:outline-none"
            />
          </div>

          {/* Lista de Elementos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="font-bold text-white uppercase font-mono text-xs flex items-center gap-2">
                <span>📦</span> Artículos, Productos o Proyectos ({items.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Elemento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#12121D] border border-gray-800 rounded-2xl space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#EE334E] uppercase">Item #{idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Título del producto / proyecto"
                      value={item.title}
                      onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 px-2.5 py-1.5 rounded-lg text-white font-semibold text-xs focus:border-[#EE334E] focus:outline-none"
                    />

                    <textarea
                      rows={2}
                      placeholder="Descripción breve..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 px-2.5 py-1.5 rounded-lg text-white text-xs focus:border-[#EE334E] focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Precio (ej: $990 MXN)"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        className="bg-black/50 border border-gray-700 px-2.5 py-1.5 rounded-lg text-emerald-400 font-mono text-xs focus:border-[#EE334E] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Categoría (ej: Premium)"
                        value={item.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="bg-black/50 border border-gray-700 px-2.5 py-1.5 rounded-lg text-gray-300 text-xs focus:border-[#EE334E] focus:outline-none"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="URL de Fotografía (Unsplash o Enlace)"
                      value={item.image}
                      onChange={(e) => handleItemChange(idx, 'image', e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 px-2.5 py-1.5 rounded-lg text-gray-400 font-mono text-[11px] focus:border-[#EE334E] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Políticas & Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase font-mono text-[10px] font-bold">Políticas Comerciales / Garantías</label>
              <textarea
                rows={2}
                value={policies}
                onChange={(e) => setPolicies(e.target.value)}
                className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white font-medium focus:border-[#EE334E] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase font-mono text-[10px] font-bold">Datos de Contacto al Pie</label>
              <textarea
                rows={2}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full bg-[#12121D] border border-gray-700 px-3 py-2 rounded-xl text-white font-medium focus:border-[#EE334E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Acciones */}
        <div className="p-4 border-t border-gray-800 bg-[#10101C] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400 font-mono">
            ✨ Genera un archivo listo para visualización web y descarga instantánea.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs transition-all w-1/2 sm:w-auto text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGenerateAndAssign}
              className="px-6 py-2.5 bg-[#EE334E] hover:bg-[#ff0003] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(238,51,78,0.4)] w-1/2 sm:w-auto flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Generar & Asignar a Tarjeta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
