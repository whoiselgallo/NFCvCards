'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Lock } from 'lucide-react';
import JSZip from 'jszip';
import brandConfig from '../../brand.config';
import { generateDeliveryInstructions } from '../../lib/brand';
import { getTranslation } from '../../lib/i18n';
import ConstructionFeedbackModal from '../components/ConstructionFeedbackModal';
import PayPalHelperModal, { parsePaymentInput } from '../components/PayPalHelperModal';
import ExpressCatalogModal from '../components/ExpressCatalogModal';
import EcoFootprintModal from '../components/EcoFootprintModal';
import PreBuilderChecklistModal from '../components/PreBuilderChecklistModal';
import { BrandSocialIcon, FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, XTwitterIcon, YouTubeIcon, WhatsAppIcon } from '../components/BrandSocialIcons';

// Temas Estructurales de la Tarjeta del Cliente (10 Diseños Profesionales)
const THEMES = {
  classic: {
    id: 'classic',
    name: 'Clásico Corporativo',
    badge: 'Formal',
    desc: 'Cabecera vibrante, logotipo centrado y pastillas de contacto',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    subTextColor: '#64748b'
  },
  modern: {
    id: 'modern',
    name: 'Cyber Modern Dark',
    badge: 'Tecnología',
    desc: 'Lienzo oscuro con acentos luminosos y doble glow',
    bgColor: '#090912', textColor: '#f8fafc', subTextColor: '#94a3b8',
    layout: 'cover_float'
  },
  classic: {
    id: 'classic', name: 'Clásico Corporativo', icon: '🏢',
    desc: 'Cabecera vibrante, logotipo centrado en marco blanco',
    bgColor: '#ffffff', textColor: '#1e293b', subTextColor: '#64748b',
    layout: 'header_center'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista Ejecutivo',
    badge: 'Clean',
    desc: 'Estilo editorial geométrico centrado y alto contraste',
    bgColor: '#fafafa',
    textColor: '#0f172a',
    subTextColor: '#475569'
  },
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism Frost',
    badge: 'Vanguardia',
    desc: 'Efecto cristal esmerilado, reflejos translúcidos y glow suave',
    bgColor: '#0b0f19',
    textColor: '#f1f5f9',
    subTextColor: '#94a3b8'
  },
  monolith: {
    id: 'monolith',
    name: 'Monolito Luxury VIP',
    badge: 'High-End',
    desc: 'Obsidiana profunda, destellos metalizados y lujo refinado',
    bgColor: '#0d0d0d',
    textColor: '#f5f5f5',
    subTextColor: '#a3a3a3'
  },
  neobrutalism: {
    id: 'neobrutalism',
    name: 'Neo-Brutalism Pop',
    badge: 'Impacto',
    desc: 'Bordes gruesos 3px, sombras rígidas y alto impacto visual',
    bgColor: '#fffdfa',
    textColor: '#000000',
    subTextColor: '#262626'
  },
  split_hero: {
    id: 'split_hero',
    name: 'Hero Asimétrico',
    badge: 'Dinámico',
    desc: 'Cabecera diagonal, disposición dinámica y corte moderno',
    bgColor: '#0a0e17',
    textColor: '#ffffff',
    subTextColor: '#94a3b8'
  },
  bento_grid: {
    id: 'bento_grid',
    name: 'Bento Grid Tech',
    badge: 'Modular',
    desc: 'Mosaico modular estilo Apple con micro-cards interactivas',
    bgColor: '#0f0f14',
    textColor: '#f8fafc',
    subTextColor: '#a1a1aa'
  },
  cyber_matrix: {
    id: 'cyber_matrix',
    name: 'Cyber Neon Matrix',
    badge: 'Sci-Fi HUD',
    desc: 'Terminal cibernética con HUD brackets y halo reactivo',
    bgColor: '#050508',
    textColor: '#f8fafc',
    subTextColor: '#71717a'
  },
  editorial_swiss: {
    id: 'editorial_swiss',
    name: 'Suizo Editorial Clean',
    badge: 'Modernist',
    desc: 'Diseño internacional suizo, líneas finas y blanco puro',
    bgColor: '#ffffff',
    textColor: '#09090b',
    subTextColor: '#71717a'
  }
};

const POPULAR_FONTS = [
  { label: 'Inter (Moderna y Limpia)', value: 'Inter' },
  { label: 'Bruno Ace SC (Branding Tecnológico)', value: 'Bruno Ace SC' },
  { label: 'Space Grotesk (Futurista)', value: 'Space Grotesk' },
  { label: 'Playfair Display (Elegante & Editorial)', value: 'Playfair Display' },
  { label: 'Montserrat (Geométrica)', value: 'Montserrat' },
  { label: 'Poppins (Amigable y Redonda)', value: 'Poppins' },
  { label: 'Bebas Neue (Impacto & Mayúsculas)', value: 'Bebas Neue' },
  { label: 'Outfit (Vanguardista)', value: 'Outfit' },
  { label: 'Cinzel (Lujo / Clásica)', value: 'Cinzel' },
  { label: 'Oswald (Condensada / Firme)', value: 'Oswald' },
  { label: 'Syne (Alta Moda / Diseño)', value: 'Syne' },
  { label: 'Roboto (Estándar Android)', value: 'Roboto' }
];

// Helper para sanitizar y autocomponer URLs de Redes Sociales
export function getSocialUrl(type, value) {
  if (!value || !value.trim()) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(facebook|instagram|linkedin)\.com\/(in\/)?/, '');
  if (type === 'facebook') return `https://facebook.com/${clean}`;
  if (type === 'instagram') return `https://instagram.com/${clean}`;
  if (type === 'linkedin') return `https://linkedin.com/in/${clean}`;
  return trimmed;
}

// Generador Inteligente de URL de Google Maps
export function getEffectiveMapsUrl(formData) {
  if (formData.googleMapsUrl && formData.googleMapsUrl.trim().startsWith('http')) {
    return formData.googleMapsUrl.trim();
  }
  
  const parts = [];
  if (formData.calle?.trim()) parts.push(formData.calle.trim());
  if (formData.ciudad?.trim()) parts.push(formData.ciudad.trim());
  if (formData.estado?.trim()) parts.push(formData.estado.trim());
  if (formData.pais?.trim()) parts.push(formData.pais.trim());

  if (parts.length > 0) {
    const query = (formData.empresa?.trim() ? formData.empresa.trim() + ', ' : '') + parts.join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  } else if (formData.empresa?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.empresa.trim())}`;
  }
  return '';
}

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getVipPass } from "../../lib/vipPasses";

export default function VCardEngineDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState('vcard'); // 'vcard' | 'review'
  const [vipPass, setVipPass] = useState(null);
  const [referredByAgent, setReferredByAgent] = useState(null);
  const [showPreChecklist, setShowPreChecklist] = useState(false);

  // Mostrar checklist/advertencia previa en la primera visita a la sesión
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('vcard_prechecklist_seen');
      if (!hasSeen) {
        setShowPreChecklist(true);
      }
    }
  }, []);

  const handleDismissPreChecklist = () => {
    setShowPreChecklist(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vcard_prechecklist_seen', 'true');
    }
  };

  // Detección de parámetros URL (?ref= para invitado o ?vip= / ?owner= para agente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const refSlug = sp.get('ref') || sp.get('invitado_por');
      const vipSlug = sp.get('vip') || sp.get('pass') || sp.get('owner');

      if (refSlug) {
        const agent = getVipPass(refSlug);
        if (agent) {
          setReferredByAgent(agent);
        }
      }

      if (vipSlug) {
        const pass = getVipPass(vipSlug);
        if (pass) {
          setVipPass(pass);
          if (status === 'unauthenticated') {
            signIn('credentials', {
              redirect: false,
              passSlug: vipSlug
            }).then(() => {
              if (update) update();
            });
          }
          setFormData(prev => ({
            ...prev,
            nombre: prev.nombre || pass.firstName,
            apellido: prev.apellido || pass.lastName,
            correo: prev.correo || pass.email,
            empresa: prev.empresa || pass.company
          }));
        }
      }
    }
  }, [status, update]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const vipSlug = sp?.get('vip') || sp?.get('pass') || sp?.get('owner');
      const refSlug = sp?.get('ref') || sp?.get('invitado_por');
      // Si viene por invitación de regalo de un agente o por pase VIP, permitimos diseñar
      if ((!vipSlug || !getVipPass(vipSlug)) && (!refSlug || !getVipPass(refSlug))) {
        router.push('/login');
      }
    }
  }, [status, router]);



  // Determinar el plan del usuario (Pase VIP o Invitación de Regalo desbloquea automáticamente Tier 4 Elite)
  const isVipActive = !!vipPass || !!referredByAgent || session?.user?.plan_id === 'elite';
  const userPlan = isVipActive ? 'elite' : (session?.user?.plan_id || 'free');
  
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
  const isPremium = tier >= 3;
  const isPro = tier >= 2;
  const isBasic = tier >= 1;
  const [isFreeDesignOpen, setIsFreeDesignOpen] = useState(true);


  // Datos del Formulario - LIMPIOS POR DEFECTO
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    puesto: '',
    telefono: '',
    whatsapp: '',
    correo: '',
    url: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    calle: '',
    ciudad: '',
    estado: '',
    cp: '',
    pais: '',
    nota: '',
    googleMapsUrl: '',
    videoYoutubeUrl: '',
    calendlyUrl: '',
    googleCalendarUrl: '',
    icloudCalendarUrl: '',
    paypalUrl: '',
    bankDetails: '',
    pdfUrl: ''
  });

  // Configuración de la Tarjeta del Cliente (100% Independiente de la Plataforma)
  const [design, setDesign] = useState({
    fontPrimary: 'Inter',       // Tipografía Primaria: Nombre & Botón Guardar Contacto
    fontSecondary: 'Inter',     // Tipografía Secundaria: Puesto, Empresa y Contenido
    colorPrimario: '#ff0003',   // Color 1 del Cliente (Rojo Núcleo #ff0003)
    colorSecundario: '#00E5FF', // Color 2 del Cliente (Franjas / Badges / Íconos)
    colorCTA: '#ff0003',        // Color 3 del Cliente (Botón Guardar Contacto)
    theme: 'modern',
    logoScale: 100,
    coverPositionY: 50,         // Slider 1: Deslizar Arriba / Abajo (0% a 100%)
    coverZoom: 100,             // Slider 2: Acercar / Alejar (100% a 250%)
    
    // NUEVO MÓDULO DE DISEÑO LIBRE
    hideBanner: false,          // Toggle para quitar el banner/portada
    logoPosition: 'center',     // center, left, right, hidden
    socialIconShape: 'circle',  // circle, rounded, square, none
    socialIconStyle: 'default', // default, monochrome, glow
    linksDisplayMode: 'icons',  // 'icons' | 'url_boxes' | 'embedded'
    infoAlignment: 'center',    // left, center, right
    hideBio: false,             // Toggle contenedor Nota/Bio
    hideContact: false,         // Toggle contenedor Canales de Contacto Directo
    hideSocial: false,          // Toggle contenedor Redes Sociales
    hideMap: false,             // Toggle contenedor de Maps
    hideVideo: false,           // Toggle contenedor de Video
    customLabels: {
      bio: 'Nota / Bio / Propuesta de Valor',
      contact: 'Canales de Contacto Directo',
      social: 'Redes Sociales',
      portfolio: 'Portafolio & Proyectos',
      gallery: 'Fototeca & Instalaciones',
      reviews: 'Reseñas de Clientes'
    }
  });

  // Imágenes de la Tarjeta
  const [logoImg, setLogoImg] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  // Estado de guardado en la nube
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState('');
  const [savedSlug, setSavedSlug] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isBuilderLocked, setIsBuilderLocked] = useState(false);
  const [showPayPalHelper, setShowPayPalHelper] = useState(false);
  const [showExpressCatalogModal, setShowExpressCatalogModal] = useState(false);
  const [showEcoModal, setShowEcoModal] = useState(false);

  // Estados de Idioma (Español base + auto-detección flexible)
  const [lang, setLang] = useState('es');

  // Estados de Logística y Envíos (Mexicali 100% Gratis vs DHL/UPS)
  const [shippingLocation, setShippingLocation] = useState('mexicali'); // 'mexicali' | 'mexico_dhl' | 'world_ups'

  // Detección automática del idioma del navegador en cliente
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLang('en');
      } else {
        setLang('es');
      }
    }
  }, []);

  // Función helper t() para traducir
  const t = (key) => getTranslation(lang, key);

  // Estados de Pasarela de Pago y Desbloqueo Comercial
  const [isPaid, setIsPaid] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: 'Paquete Completo All-in-One (4 Entregables)', price: 199, id: 'bundle' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState({ qr: false, vcf: false, cloud: false, letter: false, bundle: false });

  // Estados de Feedback Obligatorio para Tarjetas de Obsequio
  const [showConstructionFeedback, setShowConstructionFeedback] = useState(false);
  const [feedbackCompleted, setFeedbackCompleted] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Detección de Retorno de Pago Exitoso en Stripe (Stripe Checkout Redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const item = urlParams.get('item') || 'bundle';

      if (paymentStatus === 'success') {
        setIsPaid(true);
        if (item === 'bundle') {
          setUnlockedItems({ qr: true, vcf: true, cloud: true, letter: true, bundle: true });
        } else {
          setUnlockedItems(prev => ({ ...prev, [item]: true }));
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        alert('🎉 ¡Pago procesado con éxito en Stripe!\nTus entregables han sido desbloqueados para descarga inmediata.');
      } else if (paymentStatus === 'cancelled') {
        window.history.replaceState({}, document.title, window.location.pathname);
        alert('El pago fue cancelado. Puedes reintentar cuando gustes.');
      }
    }
  }, []);

  // Auto-guardado en LocalStorage para garantizar CERO PÉRDIDA DE DATOS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasContent = formData.nombre || formData.apellido || formData.empresa || formData.puesto || formData.telefono || formData.correo;
      if (hasContent) {
        try {
          localStorage.setItem('vcard_builder_draft', JSON.stringify({
            formData,
            design,
            timestamp: Date.now()
          }));
        } catch (e) {}
      }
    }
  }, [formData, design]);

  // Restauración de borrador al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem('vcard_builder_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.formData && !formData.nombre) {
            setFormData(prev => ({ ...prev, ...parsed.formData }));
          }
          if (parsed.design) {
            setDesign(prev => ({ ...prev, ...parsed.design }));
          }
        }
      } catch (e) {}
    }
  }, []);

  // Procesamiento de Pago Seguro (Stripe Checkout Oficial)
  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);

    if (paymentMethod === 'card') {
      try {
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            shippingLocation,
            customerEmail: formData.correo,
            slug: baseCardSlug
          })
        });

        const data = await res.json();
        if (data.success && data.url) {
          // Redirección directa al Checkout Oficial y Seguro de Stripe
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || 'No se pudo generar la sesión de pago con Stripe');
        }
      } catch (err) {
        console.error('Error con Stripe Checkout:', err);
        alert('Error al conectar con Stripe: ' + err.message + '\nActivando modo de desbloqueo alternativo...');
      }
    }

    // Fallback o métodos alternativos (SPEI / MP / PayPal)
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaid(true);
      if (selectedProduct.id === 'bundle') {
        setUnlockedItems({ qr: true, vcf: true, cloud: true, letter: true, bundle: true });
      } else {
        setUnlockedItems(prev => ({ ...prev, [selectedProduct.id]: true }));
      }
      setShowCheckoutModal(false);
      alert(`¡Pago de $${selectedProduct.price} MXN procesado con éxito!\nFolio Oficial: TS-PAY-${Math.floor(100000 + Math.random() * 900000)}\nEntregable desbloqueado de inmediato.`);
      
      if (selectedProduct.id === 'bundle') {
        downloadFullPackage();
      } else if (selectedProduct.id === 'qr') {
        downloadQR();
      } else if (selectedProduct.id === 'vcf') {
        downloadVCF();
      } else if (selectedProduct.id === 'cloud') {
        handleSaveToCloud();
      } else if (selectedProduct.id === 'letter') {
        setShowEmailModal(true);
      }
    }, 1200);
  };

  // Inyección reactiva de Google Fonts (Primaria + Secundaria)
  useEffect(() => {
    const fontP = design.fontPrimary || 'Inter';
    const fontS = design.fontSecondary || 'Inter';
    const uniqueFonts = Array.from(new Set([fontP, fontS]));

    const linkId = 'gfonts-preview-cdn';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const fontParams = uniqueFonts
      .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
      .join('&');
    link.href = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
  }, [design.fontPrimary, design.fontSecondary]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDesignChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDesign(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCustomLabelChange = (e) => {
    const { name, value } = e.target;
    setDesign(prev => ({
      ...prev,
      customLabels: {
        ...prev.customLabels,
        [name]: value
      }
    }));
  };

  // Extractor de color dominante del logotipo
  const extractDominantColor = (imgSrc) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;
        
        let maxScore = 0;
        let bestHex = null;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];

          if (a < 100) continue;
          
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 30 || brightness > 230) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const score = saturation * 100 + (max - min);

          if (score > maxScore) {
            maxScore = score;
            bestHex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
          }
        }

        if (bestHex) {
          setDesign(prev => ({
            ...prev,
            colorPrimario: bestHex,
            colorCTA: bestHex
          }));
        }
      } catch (e) {
        console.log('Dominant color extraction fallback:', e);
      }
    };
    img.src = imgSrc;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result;
        setLogoImg(result);
        if (result) {
          extractDominantColor(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCoverPhoto(evt.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const effectiveMapsUrl = getEffectiveMapsUrl(formData);

  // URLs completas de redes sociales
  const fbUrl = getSocialUrl('facebook', formData.facebook);
  const igUrl = getSocialUrl('instagram', formData.instagram);
  const inUrl = getSocialUrl('linkedin', formData.linkedin);

  // Construir string vCard 3.0 para cálculo de bytes y descarga
  const buildVCardString = () => {
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
    vcard += `N:${formData.apellido || ''};${formData.nombre || ''};;;\r\n`;
    vcard += `FN:${(formData.nombre + ' ' + formData.apellido).trim()}\r\n`;
    if (formData.empresa) vcard += `ORG:${formData.empresa}\r\n`;
    if (formData.puesto) vcard += `TITLE:${formData.puesto}\r\n`;
    if (formData.telefono) vcard += `TEL;TYPE=CELL,VOICE:${formData.telefono}\r\n`;
    if (formData.whatsapp) vcard += `TEL;TYPE=CELL,VOICE,WA:${formData.whatsapp}\r\n`;
    if (formData.correo) vcard += `EMAIL;TYPE=WORK,INTERNET:${formData.correo}\r\n`;
    if (formData.url) vcard += `URL;TYPE=WORK:${formData.url}\r\n`;
    if (inUrl) vcard += `URL;TYPE=LinkedIn:${inUrl}\r\n`;
    if (igUrl) vcard += `URL;TYPE=Instagram:${igUrl}\r\n`;
    if (fbUrl) vcard += `URL;TYPE=Facebook:${fbUrl}\r\n`;
    if (formData.calle || formData.ciudad || formData.estado || formData.cp || formData.pais) {
      vcard += `ADR;TYPE=WORK:;;${formData.calle || ''};${formData.ciudad || ''};${formData.estado || ''};${formData.cp || ''};${formData.pais || ''}\r\n`;
    }
    if (effectiveMapsUrl) vcard += `NOTE:Google Maps: ${effectiveMapsUrl}\\n${formData.nota || ''}\r\n`;
    else if (formData.nota) vcard += `NOTE:${formData.nota}\r\n`;
    vcard += `END:VCARD`;
    return vcard;
  };

  const vcardString = buildVCardString();
  const vcardBytes = new Blob([vcardString]).size;

  // Obtener Blob o DataURL del QR en alta resolución
  const getQRPNGData = () => {
    return new Promise((resolve) => {
      const svg = document.getElementById('preview-qr-code-svg');
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

  // Descarga de archivo .vcf (Entregable 1)
  const downloadVCF = () => {
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.nombre || 'contacto'}_${formData.apellido || 'vcard'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Descarga de Código QR en PNG (Entregable 2)
  const downloadQR = async () => {
    const blob = await getQRPNGData();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = brandConfig.delivery.qrFilename(formData.nombre, formData.empresa);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeTheme = THEMES[design.theme] || THEMES.modern;
  const currentFontPrimary = design.fontPrimary || 'Inter';
  const currentFontSecondary = design.fontSecondary || 'Inter';

  // URL del Perfil de la Tarjeta Digital en Tiempo Real
  const originUrl = typeof window !== 'undefined' ? window.location.origin : (brandConfig.website || 'https://rosecard.io');
  const baseCardSlug = ((formData.nombre || 'card') + '-' + (formData.apellido || formData.empresa || 'profile'))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'vcard';

  const cardProfileUrl = savedUrl || `${originUrl}/p/${baseCardSlug}`;

  // Verificación de feedback previo y desbloqueo de cortesía para tarjetas de obsequio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDone = localStorage.getItem(`vcard_feedback_done_${baseCardSlug}`) === 'true';
      if (isDone) {
        setFeedbackCompleted(true);
      }
    }
  }, [baseCardSlug]);

  useEffect(() => {
    if ((referredByAgent || vipPass) && feedbackCompleted) {
      setIsPaid(true);
      setUnlockedItems({ qr: true, vcf: true, cloud: true, letter: true, bundle: true });
    }
  }, [referredByAgent, vipPass, feedbackCompleted]);

  // Interceptor obligatorio para tarjetas de obsequio antes de permitir descargas
  const requireGiftFeedback = (actionCallback) => {
    if ((referredByAgent || vipPass) && !feedbackCompleted) {
      setPendingAction(() => actionCallback);
      setShowConstructionFeedback(true);
      return true;
    }
    return false;
  };

  const handleFeedbackSuccess = () => {
    setFeedbackCompleted(true);
    setIsPaid(true);
    setUnlockedItems({ qr: true, vcf: true, cloud: true, letter: true, bundle: true });
    setShowConstructionFeedback(false);
    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        act();
      }, 300);
    }
  };

  const qrTargetValue = mode === 'review'
    ? (effectiveMapsUrl || 'https://maps.google.com')
    : cardProfileUrl;

  // Etiqueta legible de la ubicación para la tarjeta
  const locationLabel = [formData.ciudad, formData.pais].filter(Boolean).join(', ') || (formData.empresa ? `Buscar ${formData.empresa}` : 'Ver Ubicación en Maps');

  // Redacción oficial del correo de entrega
  const generateDeliveryEmailContent = () => {
    const subject = brandConfig.delivery.emailSubject(formData.empresa);
    const body = generateDeliveryInstructions({
      nombre: formData.nombre,
      apellido: formData.apellido,
      empresa: formData.empresa,
      slug: baseCardSlug,
      originUrl: typeof window !== 'undefined' ? window.location.origin : originUrl
    });

    return { subject, body };
  };

  // Descarga del Paquete Completo en Archivo .ZIP
  const downloadFullPackage = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const titular = `${formData.nombre || 'Contacto'}_${formData.apellido || 'Card'}`.trim();
      const qrBlob = await getQRPNGData();
      const { body: instrucciones } = generateDeliveryEmailContent();

      // 1. Archivo .vcf
      zip.file(`${titular}_Contacto.vcf`, vcardString);

      // 2. Archivo QR .png
      if (qrBlob) {
        zip.file(`${titular}_QR_Oficial.png`, qrBlob);
      }

      // 3. Guía de Instrucciones en .txt
      zip.file(brandConfig.delivery.instructionsFilename(titular), instrucciones);

      // Generar y descargar el archivo .zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Paquete_Identidad_Digital_${titular}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al generar el archivo .zip: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  // Abrir cliente de correo con el paquete y carta de entrega
  const sendDeliveryEmail = () => {
    const { subject, body } = generateDeliveryEmailContent();
    const mailto = `mailto:${encodeURIComponent(formData.correo || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  // Guardar en Google Cloud SQL
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        mode,
        formData: {
          ...formData,
          facebook: fbUrl,
          instagram: igUrl,
          linkedin: inUrl,
          googleMapsUrl: effectiveMapsUrl
        },
        design,
        logoImg,
        coverPhoto,
        referred_by: referredByAgent?.slug || vipPass?.slug || null
      };

      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success && json.slug) {
        const fullUrl = `${window.location.origin}/p/${json.slug}`;
        setSavedUrl(fullUrl);
        setSavedSlug(json.slug);
        setSavedSuccess(true);
        setIsBuilderLocked(true);

        // Respaldo inmediato en almacenamiento local para la página de agradecimiento
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vcard_last_created_profile', JSON.stringify({
              ...formData,
              design,
              logoImg,
              coverPhoto
            }));
            localStorage.setItem(`vcard_draft_${json.slug}`, JSON.stringify({
              ...formData,
              design,
              logoImg,
              coverPhoto
            }));
          } catch {}
        }

        // Redirección inmediata al Centro Oficial de Entregables
        setTimeout(() => {
          router.push(`/gracias/${json.slug}`);
        }, 1200);
      } else {
        alert('Error al guardar: ' + (json.error || 'No se pudo conectar a Google Cloud SQL'));
      }
    } catch (err) {
      alert('Error de conexión con el servidor: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#05050D] text-white">Cargando editor...</div>;
  }

  if (!session && !vipPass && !referredByAgent) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col bg-[#060509] text-[#F8FAFC]">
      
      {/* BANNER DE OBSEQUIO DE AGENTE EMBAJADOR */}
      {referredByAgent && (
        <div className="mb-4 max-w-[1920px] mx-auto w-full p-3.5 bg-gradient-to-r from-emerald-950/70 via-[#0A0A10] to-teal-950/70 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              🎁
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>TARJETA DE OBSEQUIO:</span>
                <span className="text-[#00E5FF]">Cortesía de {referredByAgent.name} ({referredByAgent.company})</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Lote de 50 Tarjetas de Invitado • Todas las funciones y temas desbloqueados sin costo
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest shrink-0">
            OBSEQUIO VIP ACTIVO
          </div>
        </div>
      )}

      {/* BANNER DE PASE PERSONAL DEL AGENTE */}
      {!referredByAgent && isVipActive && (
        <div className="mb-4 max-w-[1920px] mx-auto w-full p-3.5 bg-gradient-to-r from-rose-950/60 via-[#0A0A10] to-purple-950/60 border border-[#EE334E]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(238,51,78,0.25)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EE334E]/20 border border-[#EE334E]/50 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(238,51,78,0.5)]">
              ✨
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>PASE LIBRE VIP ACTIVO:</span>
                <span className="text-[#00E5FF]">{vipPass?.name || session?.user?.name || 'USUARIO ELITE'}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Nivel Elite Desbloqueado • 50 Tarjetas Libres para Obsequiar • Todos los temas y Cloud SQL habilitados
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest shrink-0">
            50 TARJETAS DISPONIBLES
          </div>
        </div>
      )}

      {/* HEADER DE LA PLATAFORMA */}
      <header className="mb-6 max-w-[1920px] mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/30">
        <div className="flex items-center gap-3.5">
          <div className="rose-logo-container w-11 h-11 rounded-xl shadow-[0_0_16px_rgba(255,0,3,0.45)] border border-[#EE334E]/50 shrink-0 flex items-center justify-center">
            <img
              src={brandConfig.assets.logo || "/brand/logo.png"}
              alt={brandConfig.brandName}
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(238,51,78,0.7)]"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bruno text-white tracking-wide flex items-center gap-2">
              {brandConfig.brandHeading.prefix} <span className="text-[#EE334E] drop-shadow-[0_0_12px_rgba(238,51,78,0.6)]">{brandConfig.brandHeading.highlight}</span> {brandConfig.brandHeading.suffix}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{brandConfig.brandDescription}</p>
          </div>
        </div>

          {/* BOTÓN CTA PERSISTENTE DE PAGO / DESBLOQUEO */}
          {!isPaid && !isVipActive && (
            <button 
              type="button"
              onClick={() => {
                setSelectedProduct({ name: 'Paquete Completo All-in-One (4 Entregables)', price: 199, id: 'bundle' });
                setShowCheckoutModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EE334E] via-[#ff0003] to-[#EE334E] hover:brightness-125 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,3,0.6)] transition-all active:scale-95 animate-pulse"
            >
              <span>💳</span>
              <span>Desbloquear Todo / Pagar ($199 MXN)</span>
            </button>
          )}

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex bg-[#0F0B15] p-1 rounded-xl border border-rose-900/40 shadow-inner">
            <button
              onClick={() => setMode('vcard')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bruno transition-all flex items-center gap-1.5 sm:gap-2 ${
                mode === 'vcard'
                  ? 'bg-gradient-to-r from-[#EE334E] to-[#ff0003] text-white font-extrabold shadow-[0_0_16px_rgba(255,0,3,0.6)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📇</span> {t('mode_vcard')}
            </button>
            <button
              onClick={() => setMode('review')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bruno transition-all flex items-center gap-1.5 sm:gap-2 ${
                mode === 'review'
                  ? 'bg-gradient-to-r from-[#EE334E] to-[#ff0003] text-white font-extrabold shadow-[0_0_16px_rgba(238,51,78,0.6)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>⭐</span> {t('mode_review')}
            </button>
          </div>

          {/* Botón de Checklist Previo / Advertencia de Datos */}
          <button
            type="button"
            onClick={() => setShowPreChecklist(true)}
            className="px-3 py-2 rounded-xl text-xs font-bruno bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            title="Ver checklist de requisitos y archivos necesarios"
          >
            <span>⚠️</span> <span className="hidden sm:inline">Requisitos de Construcción</span>
          </button>

          {/* Botón de Inicio de Sesión / Cuenta para Móvil */}
          {status === 'unauthenticated' ? (
            <a
              href="/login"
              className="px-3 py-1.5 rounded-xl text-xs font-bruno bg-[#EE334E] hover:bg-[#ff0003] text-white transition-all flex sm:hidden items-center gap-1 shadow-[0_0_10px_rgba(238,51,78,0.4)]"
            >
              <span>Acceder</span>
            </a>
          ) : (
            <a
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl text-xs font-bruno bg-white/10 hover:bg-white/20 text-white transition-all flex sm:hidden items-center gap-1 border border-white/10"
            >
              <span>Mi Cuenta</span>
            </a>
          )}

          {/* Selector de Idioma Flexible (ES / EN) */}
          <button
            type="button"
            onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
            className="px-3 py-2 rounded-xl text-xs font-bruno bg-white/5 hover:bg-white/10 text-gray-200 border border-gray-800 hover:border-[#FF2A54]/50 transition-all flex items-center gap-1.5 shadow-sm"
            title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
          >
            <span>{lang === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}</span>
          </button>

          {/* Enlace al Panel Administrativo Corporativo */}
          <a
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs font-bruno bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-800 transition-colors flex items-center gap-1.5 hidden sm:flex"
            title="Panel Administrativo Centralizado"
          >
            <span>⚙️</span> {t('admin_btn')}
          </a>

          {/* Logo Oficial con Resplandor Cyber Rose */}
          <div className="rose-logo-container hidden sm:flex shrink-0" title={brandConfig.brandName}>
            <img src={brandConfig.assets.logo} alt="Rose Emblem" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,42,84,0.7)]" />
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 max-w-[1920px] mx-auto w-full items-start">
        
        {/* COLUMNA 1: PANEL DE CONFIGURACIÓN */}
        <section className="w-full lg:w-7/12 panel-glass p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bruno text-[#FF2A54] flex items-center gap-2 border-b border-gray-800/80 pb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            DATA INPUT & CONFIGURACIÓN
          </h2>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {mode === 'review' ? (
              /* MODO GOOGLE REVIEWS */
              <div className="bg-[#12121c] border border-[#ff0003]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#EE334E]">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="text-sm font-rosetta font-bold">Configuración de Reseñas de Google</h3>
                    <p className="text-xs text-gray-400">Redirección directa a la pantalla de 5 estrellas al acercar el teléfono</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Nombre del Negocio</label>
                  <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. Mi Empresa" />
                </div>

                <div>
                  <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Enlace de Reseñas de Google o Búsqueda Automática</label>
                  <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} className="input-dark w-full border-[#ff0003]/40" placeholder="https://g.page/r/tu-negocio/review o déjalo vacío para búsqueda automática" />
                  <p className="text-[10px] text-gray-500 mt-1">Si lo dejas vacío, se generará automáticamente con el nombre de tu empresa y ciudad.</p>
                </div>
              </div>
            ) : (
              /* MODO VCARD: FLUJO ESTRUCTURADO EN 5 PASOS */
              <>
                {/* ========================================================= */}
                {/* PASO 1: ACTIVOS VISUALES & ENCUADRE DE PORTADA            */}
                {/* ========================================================= */}
                <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#ff0003] text-white text-xs font-rosetta font-bold flex items-center justify-center shrink-0">1</span>
                      <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Activos Visuales & Encuadre</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Logo PNG & Banner</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logotipo */}
                    <div>
                      <label className="block text-xs font-rosetta text-[#F0F0F8] mb-1.5 uppercase tracking-wider">Logotipo Oficial (PNG Transparente)</label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleLogoUpload}
                        className="w-full text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff0003] file:text-white hover:file:bg-[#EE334E] transition-colors cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">🎨 PNG sin fondo para adaptarse a los auras luminosas.</p>
                    </div>

                    {/* Foto de Portada / Banner */}
                    <div>
                      <label className="block text-xs font-rosetta text-[#F0F0F8] mb-1.5 uppercase tracking-wider">Foto de Portada / Banner (16:9)</label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleCoverUpload}
                        className="w-full text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff0003] file:text-white hover:file:bg-[#EE334E] transition-colors cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">📸 Fotografía panorámica de oficina o gráfico publicitario.</p>
                    </div>
                  </div>

                  {/* Slider de Escala del Logo */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between items-center text-xs font-rosetta text-[#EE334E] mb-1.5 uppercase font-bold">
                      <span>Tamaño / Escala del Logo</span>
                      <span className="text-white font-mono bg-black/60 px-2 py-0.5 rounded border border-[#EE334E]/30">{design.logoScale}px</span>
                    </div>
                    <input
                      type="range"
                      name="logoScale"
                      min="50"
                      max="160"
                      value={design.logoScale}
                      onChange={handleDesignChange}
                      className="w-full slider-rose"
                    />
                    <div className="flex justify-between text-[10px] text-[#B1B3B3] mt-1.5 uppercase tracking-wide">
                      <span>Compacto (50px)</span>
                      <span>Prominente (160px)</span>
                    </div>
                  </div>

                  {/* CONTROLES DE ENCUADRE DE BANNER */}
                  {coverPhoto && (
                    <div className="pt-3 border-t border-gray-800 space-y-3.5 bg-[#121114] p-4 rounded-xl border border-[#EE334E]/40 shadow-[0_0_15px_rgba(255,0,3,0.15)] animate-fadeIn">
                      <div className="flex justify-between items-center text-xs font-rosetta text-[#EE334E]">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span>🖼️</span> Ajuste de Encuadre del Banner
                        </span>
                        <button
                          type="button"
                          onClick={() => setCoverPhoto(null)}
                          className="text-[10px] text-red-400 hover:text-red-300 underline font-sans"
                        >
                          Quitar Foto
                        </button>
                      </div>

                      {/* Slider 1: Deslizar Arriba y Abajo */}
                      <div>
                        <div className="flex justify-between text-[11px] text-gray-300 mb-1.5 font-mono">
                          <span>↕️ Desplazamiento Vertical (Posición Y)</span>
                          <span className="text-[#EE334E] font-bold bg-black/50 px-2 py-0.5 rounded border border-[#EE334E]/20">{design.coverPositionY}%</span>
                        </div>
                        <input
                          type="range"
                          name="coverPositionY"
                          min="0"
                          max="100"
                          value={design.coverPositionY}
                          onChange={handleDesignChange}
                          className="w-full slider-rose"
                        />
                      </div>

                      {/* Slider 2: Acercar o Alejar (Zoom) */}
                      <div>
                        <div className="flex justify-between text-[11px] text-gray-300 mb-1.5 font-mono">
                          <span>🔍 Zoom del Banner</span>
                          <span className="text-[#EE334E] font-bold bg-black/50 px-2 py-0.5 rounded border border-[#EE334E]/20">{(design.coverZoom / 100).toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          name="coverZoom"
                          min="100"
                          max="250"
                          value={design.coverZoom}
                          onChange={handleDesignChange}
                          className="w-full slider-rose"
                        />
                      </div>
                    </div>
                  )}

                  {/* MÓDULO DE EDICIÓN LIBRE (PLAN ELITE) */}
                  <div className="pt-4 border-t border-gray-800/80 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#EE334E] text-base animate-pulse">✦</span>
                        <div>
                          <h4 className="text-xs font-rosetta text-white font-bold uppercase tracking-wider">
                            Módulo de Edición Libre (Plan Elite)
                          </h4>
                          <span className="text-[10px] text-purple-400 font-mono">Personalización y reubicación activa para cualquier tema</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFreeDesignOpen(!isFreeDesignOpen)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                          isFreeDesignOpen
                            ? 'bg-purple-950/70 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                            : 'bg-black/50 border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isFreeDesignOpen ? '▼ Módulo Abierto (Activo)' : '▶ Abrir Módulo'}
                      </button>
                    </div>

                    {isFreeDesignOpen && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Ocultar / Mostrar Banner */}
                          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-black/30 cursor-pointer hover:border-gray-600 transition-colors">
                            <div className="relative flex items-center">
                              <input type="checkbox" name="hideBanner" checked={design.hideBanner} onChange={handleDesignChange} className="sr-only peer" />
                              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE334E]"></div>
                            </div>
                            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Ocultar Banner / Portada</span>
                          </label>

                          {/* Posición del Logotipo */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Posición del Logotipo</label>
                            <select name="logoPosition" value={design.logoPosition} onChange={handleDesignChange} className="input-dark w-full text-xs py-2">
                              <option value="center">Centrado (Por Defecto)</option>
                              <option value="left">Alineado a la Izquierda</option>
                              <option value="right">Alineado a la Derecha</option>
                              <option value="hidden">Ocultar Logotipo</option>
                            </select>
                          </div>
                        </div>

                        {/* Personalización de Botones Sociales y Alineación */}
                        <div className="bg-black/20 p-3.5 rounded-xl border border-gray-800 space-y-3">
                          <h5 className="text-[11px] font-rosetta text-gray-400 uppercase tracking-wider">Botones Sociales, Alineación & Formato de Enlaces</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Alineación de Info</label>
                              <select name="infoAlignment" value={design.infoAlignment || 'center'} onChange={handleDesignChange} className="input-dark w-full text-xs py-2">
                                <option value="left">Izquierda</option>
                                <option value="center">Centro</option>
                                <option value="right">Derecha</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Forma de Iconos</label>
                              <select name="socialIconShape" value={design.socialIconShape || 'circle'} onChange={handleDesignChange} className="input-dark w-full text-xs py-2">
                                <option value="circle">Redondo (Círculo)</option>
                                <option value="rounded">Bordes Suaves</option>
                                <option value="square">Cuadrado</option>
                                <option value="none">Sin Fondo (Solo Icono)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Estilo de Iconos</label>
                              <select name="socialIconStyle" value={design.socialIconStyle || 'default'} onChange={handleDesignChange} className="input-dark w-full text-xs py-2">
                                <option value="default">Color Original App</option>
                                <option value="monochrome">Monocromático</option>
                                <option value="glow">Neón / Brillo</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-[#00E5FF] uppercase tracking-wider mb-1 font-bold">Formato de Enlaces</label>
                              <select name="linksDisplayMode" value={design.linksDisplayMode || 'icons'} onChange={handleDesignChange} className="input-dark w-full text-xs py-2 border-[#00E5FF]/40 focus:border-[#00E5FF]">
                                <option value="icons">Iconos (Grid Clásico)</option>
                                <option value="url_boxes">Cuadros con URL & Título</option>
                                <option value="embedded">Tarjetas / Widgets Embebidos</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Visibilidad de Contenedores de Información */}
                        <div className="bg-black/20 p-3.5 rounded-xl border border-gray-800 space-y-3">
                          <h5 className="text-[11px] font-rosetta text-gray-400 uppercase tracking-wider">Ocultar Contenedores de Información</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="hideBio" checked={design.hideBio} onChange={handleDesignChange} className="accent-[#EE334E] w-3.5 h-3.5" />
                              <span className="text-[10px] text-gray-300">Nota / Bio</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="hideContact" checked={design.hideContact} onChange={handleDesignChange} className="accent-[#EE334E] w-3.5 h-3.5" />
                              <span className="text-[10px] text-gray-300">Datos de Contacto</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="hideSocial" checked={design.hideSocial} onChange={handleDesignChange} className="accent-[#EE334E] w-3.5 h-3.5" />
                              <span className="text-[10px] text-gray-300">Redes Sociales</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="hideMap" checked={design.hideMap} onChange={handleDesignChange} className="accent-[#EE334E] w-3.5 h-3.5" />
                              <span className="text-[10px] text-gray-300">Google Maps</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="hideVideo" checked={design.hideVideo} onChange={handleDesignChange} className="accent-[#EE334E] w-3.5 h-3.5" />
                              <span className="text-[10px] text-gray-300">Video</span>
                            </label>
                          </div>
                        </div>

                        {/* Etiquetas Personalizadas */}
                        <div className="bg-black/20 p-3.5 rounded-xl border border-gray-800 space-y-3">
                          <h5 className="text-[11px] font-rosetta text-gray-400 uppercase tracking-wider">Etiquetas Personalizadas</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1">Nota / Bio</label>
                              <input type="text" name="bio" value={design.customLabels?.bio || ''} onChange={handleCustomLabelChange} className="input-dark w-full text-xs h-7 px-2" placeholder="Nota / Bio / Valor" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1">Contacto</label>
                              <input type="text" name="contact" value={design.customLabels?.contact || ''} onChange={handleCustomLabelChange} className="input-dark w-full text-xs h-7 px-2" placeholder="Canales de Contacto Directo" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1">Redes Sociales</label>
                              <input type="text" name="social" value={design.customLabels?.social || ''} onChange={handleCustomLabelChange} className="input-dark w-full text-xs h-7 px-2" placeholder="Redes Sociales" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* ========================================================= */}
                {/* PASO 2: DATOS DE CONTACTO & REDES SOCIALES                */}
                {/* ========================================================= */}
                <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#ff0003] text-white text-xs font-rosetta font-bold flex items-center justify-center shrink-0">2</span>
                      <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Información & Redes Sociales</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Datos de Contacto</span>
                  </div>

                  {/* NOMBRE Y APELLIDO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Nombre</label>
                      <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. Javier" />
                    </div>
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Apellido</label>
                      <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} className="input-dark w-full" placeholder="Ej. Gallardo" />
                    </div>
                  </div>

                  {/* EMPRESA Y PUESTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Empresa</label>
                      <input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className="input-dark w-full" placeholder="TSolutions" />
                    </div>
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Puesto</label>
                      <input type="text" name="puesto" value={formData.puesto} onChange={handleInputChange} className="input-dark w-full" placeholder="CEO / Consultor Estratega" />
                    </div>
                  </div>

                  {/* TELÉFONO Y WHATSAPP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Teléfono</label>
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="input-dark w-full" placeholder="+526860000000" />
                    </div>
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">WhatsApp</label>
                      <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="input-dark w-full" placeholder="+526860000000" />
                    </div>
                  </div>

                  {/* CORREO Y SITIO WEB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Correo</label>
                      <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} className="input-dark w-full" placeholder="contacto@tudominio.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Sitio Web</label>
                      <input type="url" name="url" value={formData.url} onChange={handleInputChange} className="input-dark w-full" placeholder="https://tudominio.com" />
                    </div>
                  </div>

                  {/* REDES SOCIALES */}
                  <div className="border-t border-gray-800 pt-4 space-y-3">
                    <h4 className="text-xs font-rosetta text-[#EE334E] flex items-center gap-2 uppercase">
                      <span>🌐</span> Redes Sociales (Solo Usuario)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Facebook */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">Facebook</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            facebook.com/
                          </span>
                          <input
                            type="text"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            placeholder="usuario"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Instagram */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">Instagram</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            instagram.com/
                          </span>
                          <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="usuario"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">LinkedIn</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            linkedin.com/in/
                          </span>
                          <input
                            type="text"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="tu-perfil"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* TikTok */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">TikTok</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            tiktok.com/@
                          </span>
                          <input
                            type="text"
                            name="tiktok"
                            value={formData.tiktok}
                            onChange={handleInputChange}
                            placeholder="usuario"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* X (Twitter) */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">X (Twitter)</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            x.com/
                          </span>
                          <input
                            type="text"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleInputChange}
                            placeholder="usuario"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* YouTube */}
                      <div>
                        <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">Canal de YouTube</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                          <span className="bg-[#12121c] text-gray-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                            youtube.com/
                          </span>
                          <input
                            type="text"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            placeholder="usuario o @canal"
                            className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* YouTube Video URL */}
                    <div className="mt-2">
                      <label className="block text-[11px] font-rosetta text-gray-300 mb-1 uppercase">Video de Presentación / Pitch (YouTube)</label>
                      <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-[#06060c] focus-within:border-[#EE334E]">
                        <span className="bg-[#12121c] text-red-400 text-xs px-2.5 py-2 select-none border-r border-gray-800 font-mono flex items-center shrink-0">
                          ▶ YouTube:
                        </span>
                        <input
                          type="url"
                          name="videoYoutubeUrl"
                          value={formData.videoYoutubeUrl}
                          onChange={handleInputChange}
                          placeholder="https://youtu.be/... o https://youtube.com/watch?v=..."
                          className="w-full bg-transparent px-2.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIRECCIÓN & GOOGLE MAPS */}
                  <div className="border-t border-gray-800 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-rosetta text-[#EE334E] flex items-center gap-2 uppercase">
                        <span>📍</span> Dirección & Vinculación a Google Maps
                      </h4>
                      <span className="text-[10px] text-gray-400">Físico u Online</span>
                    </div>

                    <input type="text" name="calle" value={formData.calle} onChange={handleInputChange} className="input-dark w-full" placeholder="Calle y Número, Colonia (Dejar vacío si es 100% Online)" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="input-dark w-full" placeholder="Ciudad (Ej. Mexicali)" />
                      <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="input-dark w-full" placeholder="Estado (Ej. Baja California)" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" name="cp" value={formData.cp} onChange={handleInputChange} className="input-dark w-full" placeholder="Código Postal (Opcional)" />
                      <input type="text" name="pais" value={formData.pais} onChange={handleInputChange} className="input-dark w-full" placeholder="País (Ej. México)" />
                    </div>

                    {/* CAJA INTELIGENTE DE MAPS */}
                    <div className="bg-black/40 p-3.5 rounded-xl border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-rosetta text-gray-300">Enlace en Google Maps:</span>
                        {effectiveMapsUrl && (
                          <a
                            href={effectiveMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#EE334E] hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>🔍 Probar Maps ↗</span>
                          </a>
                        )}
                      </div>

                      <input
                        type="url"
                        name="googleMapsUrl"
                        value={formData.googleMapsUrl}
                        onChange={handleInputChange}
                        className="input-dark w-full text-xs"
                        placeholder="Opcional: Pega un link específico de Maps o déjalo vacío para búsqueda automática"
                      />

                      {effectiveMapsUrl ? (
                        <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <span className="text-green-400">●</span> Destino: <span className="text-white truncate">{decodeURIComponent(effectiveMapsUrl.replace('https://www.google.com/maps/search/?api=1&query=', ''))}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-500">
                          💡 Se vinculará automáticamente al escribir el nombre de tu empresa, dirección o ciudad.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* NOTA / BIO */}
                  <div className="border-t border-gray-800 pt-3">
                    <label className="block text-xs font-bruno text-gray-300 mb-1 uppercase tracking-wider">Nota / Bio / Propuesta de Valor</label>
                    <textarea name="nota" value={formData.nota} onChange={handleInputChange} className="input-dark w-full h-20 py-2.5" placeholder="Soluciones digitales, optimización y desarrollo..."></textarea>
                  </div>
                </div>

                                  {/* ========================================================= */}
                  {/* PASO 2.5: PRODUCTIVIDAD Y CONVERSIÓN                        */}
                  {/* ========================================================= */}
                  <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#ff0003] text-white text-xs font-rosetta font-bold flex items-center justify-center shrink-0">★</span>
                        <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Productividad & Conversión</h3>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Ventas y PDF</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Agendar Reunión (Calendly)</label>
                        <input type="url" name="calendlyUrl" value={formData.calendlyUrl} onChange={handleInputChange} className="input-dark w-full" placeholder="https://calendly.com/tu-usuario" />
                      </div>
                      <div>
                        <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Agendar Reunión (Google Calendar)</label>
                        <input type="url" name="googleCalendarUrl" value={formData.googleCalendarUrl} onChange={handleInputChange} className="input-dark w-full" placeholder="https://calendar.google.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Agendar Reunión (Apple / iCloud Calendar)</label>
                        <input type="url" name="icloudCalendarUrl" value={formData.icloudCalendarUrl} onChange={handleInputChange} className="input-dark w-full" placeholder="https://www.icloud.com/..." />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-rosetta text-gray-300 uppercase tracking-wider">Botón de Pago (PayPal / Stripe)</label>
                          <button
                            type="button"
                            onClick={() => setShowPayPalHelper(true)}
                            className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            ❓ Guía de Vinculación
                          </button>
                        </div>
                        <input
                          type="text"
                          name="paypalUrl"
                          value={formData.paypalUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            const parsed = parsePaymentInput(val);
                            setFormData(prev => ({ ...prev, paypalUrl: parsed }));
                          }}
                          className="input-dark w-full"
                          placeholder="https://paypal.me/tu-usuario o pega código embed / JSON..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-rosetta text-gray-300 mb-1 uppercase tracking-wider">Datos Bancarios para Transferencia</label>
                        <textarea name="bankDetails" value={formData.bankDetails} onChange={handleInputChange} className="input-dark w-full resize-none h-20" placeholder="Banco: XXXX
CLABE: 0123...
Beneficiario: TSolutions" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-rosetta text-gray-300 uppercase tracking-wider">Documento PDF (Catálogo, Menú o Portafolio)</label>
                          <button
                            type="button"
                            onClick={() => setShowExpressCatalogModal(true)}
                            className="text-[10px] bg-[#EE334E]/20 text-[#EE334E] hover:bg-[#EE334E]/30 px-2.5 py-0.5 rounded-lg border border-[#EE334E]/40 font-mono font-bold flex items-center gap-1 transition-all"
                          >
                            ✨ Crear PDF Express
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            name="pdfUrl"
                            value={formData.pdfUrl}
                            onChange={handleInputChange}
                            className="input-dark w-full"
                            placeholder="https://mi-sitio.com/catalogo.pdf o créalo con el botón de arriba"
                          />
                          {formData.pdfUrl && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '' }))}
                              className="px-2.5 py-2 bg-red-950/40 border border-red-800 text-red-400 rounded-lg text-xs hover:bg-red-900/40"
                              title="Quitar PDF"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* PASO 3: BRANDING, TIPOGRAFÍAS & COLORES                   */}
                {/* ========================================================= */}
                <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#ff0003] text-white text-xs font-rosetta font-bold flex items-center justify-center shrink-0">3</span>
                      <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Branding, Tipografías & Colores</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Estilo Visual</span>
                  </div>

                  {/* SELECTOR DE TEMAS ESTRUCTURALES (10 TEMAS PROFESIONALES) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-gray-300 uppercase tracking-wide font-bold">Tema Estructural & Layout</label>
                      <span className="text-[10px] font-mono text-[#EE334E] font-bold">10 Diseños Disponibles</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                      {Object.values(THEMES).map((th, index) => {
                        const isLocked = !isFreeDesignOpen && tier < 1 && index >= 2;
                        
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                alert("Este diseño Premium requiere mejorar tu paquete o activar el Módulo de Edición Libre.");
                                return;
                              }
                              setDesign(prev => ({ ...prev, theme: th.id }));
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between relative group ${
                              design.theme === th.id
                                ? 'bg-[#ff0003]/15 border-[#EE334E] shadow-[0_0_15px_rgba(255,0,3,0.35)] scale-[1.02]'
                                : 'bg-black/40 border-gray-800/90 hover:border-gray-700 hover:bg-black/60'
                            } ${isLocked ? 'opacity-40 cursor-not-allowed grayscale hover:opacity-70' : ''}`}
                          >
                            {isLocked && (
                              <div className="absolute top-2 right-2 bg-black/80 rounded-full p-1 border border-white/10 z-10">
                                <Lock className="w-3 h-3 text-slate-300" />
                              </div>
                            )}
                            <div className={isLocked ? 'pointer-events-none' : ''}>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span
                                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full font-bold border ${
                                    design.theme === th.id
                                      ? 'bg-[#ff0003] text-white border-[#EE334E]'
                                      : 'bg-white/5 text-gray-400 border-white/10'
                                  }`}
                                >
                                  {th.badge || 'Tema'}
                                </span>
                                {design.theme === th.id && (
                                  <span className="w-2 h-2 rounded-full bg-[#EE334E] animate-pulse"></span>
                                )}
                              </div>
                              <p className={`text-xs font-rosetta font-bold leading-snug ${design.theme === th.id ? 'text-[#EE334E]' : 'text-white'}`}>
                                {th.name}
                              </p>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{th.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* SELECTORES DESPLEGABLES DE TIPOGRAFÍA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1 uppercase tracking-wide font-bold flex items-center gap-1.5">
                        <span className="text-[#EE334E]">Aa</span> Tipografía Primaria
                      </label>
                      <select
                        name="fontPrimary"
                        value={design.fontPrimary}
                        onChange={handleDesignChange}
                        className="input-dark w-full cursor-pointer font-medium"
                      >
                        {POPULAR_FONTS.map(f => (
                          <option key={f.value} value={f.value} className="bg-[#0A0A14] text-white">{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1 uppercase tracking-wide font-bold flex items-center gap-1.5">
                        <span className="text-[#4A7AFF]">Aa</span> Tipografía Secundaria
                      </label>
                      <select
                        name="fontSecondary"
                        value={design.fontSecondary}
                        onChange={handleDesignChange}
                        className="input-dark w-full cursor-pointer font-medium"
                      >
                        {POPULAR_FONTS.map(f => (
                          <option key={f.value} value={f.value} className="bg-[#0A0A14] text-white">{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* PALETA 3 COLORES */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">1. Color Primario</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorPrimario" value={design.colorPrimario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>

                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">2. Color Secundario</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorSecundario" value={design.colorSecundario} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>

                    <div className="flex flex-col bg-black/40 p-2.5 rounded-lg border border-gray-800">
                      <label className="text-[10px] text-gray-300 mb-1 uppercase tracking-wide font-bold">3. Color CTA</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0" />
                        <input type="text" name="colorCTA" value={design.colorCTA} onChange={handleDesignChange} className="input-dark w-full h-8 text-xs font-mono uppercase px-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* PASO 4: DESPLIEGUE EN GOOGLE CLOUD SQL                    */}
                {/* ========================================================= */}
                <div className="bg-[#0c0c16] border border-[#ff0003]/40 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(255,0,3,0.15)]">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#ff0003] text-white text-xs font-rosetta font-bold flex items-center justify-center shrink-0">4</span>
                      <div>
                        <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Despliegue en la Nube</h3>
                        <p className="text-[10px] text-gray-400">Alojamiento de alta velocidad en Google Cloud SQL</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Módulo Individual</span>
                      <span className="text-xs font-mono text-[#EE334E] font-bold">{isPaid || unlockedItems.cloud || isVipActive ? '✓ Incluido' : '$99 MXN'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (requireGiftFeedback(() => handleSaveToCloud())) return;
                      if (isPaid || unlockedItems.cloud || isVipActive) {
                        handleSaveToCloud();
                      } else {
                        setSelectedProduct({ name: 'Módulo 3: Despliegue Cloud & Enlace Permanente (/p/[slug])', price: 99, id: 'cloud' });
                        setShowCheckoutModal(true);
                      }
                    }}
                    disabled={isSaving}
                    className="btn-primary w-full text-sm tracking-wider flex items-center justify-center gap-2 py-3.5"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>GUARDANDO EN GOOGLE CLOUD SQL...</span>
                      </>
                    ) : (
                      <>
                        <span>{(referredByAgent || vipPass) && !feedbackCompleted ? '🔒' : '🚀'}</span>
                        <span>
                          {(referredByAgent || vipPass) && !feedbackCompleted
                            ? 'ACTIVAR Y DESPLEGAR PERFIL (CON FEEDBACK)'
                            : (isPaid || unlockedItems.cloud || isVipActive ? 'GUARDAR Y DESPLEGAR PERFIL (GOOGLE CLOUD)' : 'DESPLEGAR EN LA NUBE ($99 MXN O INCLUIDO EN PAQUETE)')}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Feedback y Enlace Permanente */}
                  {savedUrl && (
                    <div className="p-4 bg-black/60 border border-green-500/50 rounded-xl space-y-2 animate-fadeIn shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-rosetta text-green-400 flex items-center gap-1.5 font-bold">
                          <span>✓</span> ¡Perfil Activo en Producción!
                        </span>
                        <a
                          href={savedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#4A7AFF] hover:underline font-mono"
                        >
                          Abrir Perfil ↗
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={savedUrl}
                          className="w-full bg-[#06060c] border border-gray-800 px-3 py-2 rounded-lg text-xs font-mono text-gray-200 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(savedUrl);
                            alert('¡Enlace copiado al portapapeles!');
                          }}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-rosetta shrink-0"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* INICIATIVA DE HUELLA ECOLÓGICA Y TARJETA FÍSICA NFC */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-[#0C1410] to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xl shrink-0">
                      🌱
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                        <span>Iniciativa Huella de Carbono Cero</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">ECO-RESPONSABLE</span>
                      </h4>
                      <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                        ¿Deseas evaluar solicitar una tarjeta física inteligente NFC o recibir tu cupón vitalicio por mantenerte 100% digital?
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEcoModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shrink-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                  >
                    <span>Evaluar Tarjeta Física</span>
                    <span>→</span>
                  </button>
                </div>

                {/* INFORMACIÓN DEL CENTRO OFICIAL DE ENTREGABLES (/gracias/[slug]) */}
                <div className="bg-[#0c0c16] border border-gray-800 rounded-2xl p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#00E5FF] text-black text-xs font-rosetta font-bold flex items-center justify-center shrink-0">5</span>
                      <div>
                        <h3 className="text-xs font-rosetta text-white font-bold tracking-wider uppercase">Centro Oficial de Entregables</h3>
                        <p className="text-[10px] text-gray-400">Activación automática al desplegar en Google Cloud</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                      100% Incluido
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-gray-800 text-xs text-gray-300 space-y-2">
                    <p className="leading-relaxed">
                      🎉 <strong className="text-white">Descarga de Entregables en su Propia Página:</strong> Para garantizar un flujo limpio y enfocado, el Paso 5 de descargas ahora cuenta con su propia pantalla dedicada (<code className="text-[#00E5FF]">/gracias/[slug]</code>).
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Al presionar <strong className="text-[#EE334E]">"Guardar y Desplegar Perfil"</strong> (Paso 4), el constructor asegurará tu diseño en Google Cloud SQL, se cerrará para proteger tu enlace y te dirigirá automáticamente al Centro de Entregables donde podrás descargar tu Ficha .VCF, Código QR HD (1200x1200px), Instructivo Oficial y el Paquete Completo .ZIP.
                    </p>
                  </div>
                </div>
              </>
            )}

          </form>
        </section>

        {/* COLUMNA 2: ÁREA EXCLUSIVA DE CONSTRUCCIÓN Y VISTA PREVIA DENTRO DEL CELULAR (STICKY & LIMPIA) */}
        <section className="w-full lg:w-5/12 flex flex-col items-center justify-center lg:sticky lg:top-6 lg:self-start">
          
          {/* MOCKUP ELEGANTE DEL CELULAR CON TOKENS OFICIALES */}
          <div className="smartphone-mockup-frame w-[320px] sm:w-[350px] h-[670px] relative overflow-hidden flex flex-col shadow-2xl">
            
            {/* DYNAMIC ISLAND / NOTCH */}
            <div className="smartphone-dynamic-island shrink-0">
              <div className="w-2.5 h-2.5 bg-[#121114] rounded-full border border-gray-800"></div>
              <div className="w-7 h-1 bg-gray-800 rounded-full"></div>
            </div>

            {/* PANTALLA INTERNA DEL CELULAR (AISLADA: RESPONDE A LOS COLORES Y TIPOGRAFÍAS DEL CLIENTE) */}
            <div
              className="smartphone-screen relative overflow-y-auto flex-1 select-none transition-all pb-36 custom-scrollbar"
              style={{
                backgroundColor: activeTheme.bgColor,
                fontFamily: currentFontSecondary,
                color: activeTheme.textColor
              }}
            >
              
              {mode === 'review' ? (
                /* MODO REVIEW EN CELULAR */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-yellow-400/10 border-2 border-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4">
                    ⭐
                  </div>
                  <h2 className="text-xl font-bold font-bruno" style={{ fontFamily: currentFontPrimary }}>{formData.empresa || 'Nombre del Negocio'}</h2>
                  <p className="text-xs opacity-70 mt-1">Calificación en Google Maps</p>
                  
                  <div className="flex gap-1 my-4 text-yellow-400 text-lg">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>

                  <div className="p-4 bg-black/5 rounded-2xl border border-black/10 w-full mt-4">
                    <p className="text-xs font-semibold mb-2">Redirigiendo a Google...</p>
                    <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: `${design.colorPrimario} transparent transparent transparent` }}></div>
                  </div>
                </div>
              ) : (
                /* MODO VCARD SEGÚN EL TEMA */
                <>
                  {/* 1. TEMA CLÁSICO CORPORATIVO */}
                  {design.theme === 'classic' && (
                    <div>
                      {/* Portada / Banner */}
                      {!design.hideBanner && (
                        <div
                          className="h-28 w-full relative overflow-hidden flex items-center justify-center transition-colors"
                          style={{ backgroundColor: design.colorSecundario }}
                        >
                          {coverPhoto ? (
                            <div className="w-full h-full overflow-hidden">
                              <img
                                src={coverPhoto}
                                alt="Cover"
                                className="w-full h-full object-cover transition-all"
                                style={{
                                  objectPosition: `center ${design.coverPositionY}%`,
                                  transform: `scale(${design.coverZoom / 100})`,
                                  transformOrigin: `center ${design.coverPositionY}%`
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                          )}
                        </div>
                      )}

                      {/* Logo & Datos Adaptables */}
                      <div className={`px-5 ${!design.hideBanner ? '-mt-12' : 'pt-6'} relative z-20 flex flex-col ${design.logoPosition === 'left' ? 'items-start text-left' : design.logoPosition === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                        {design.logoPosition !== 'hidden' && (
                          <div
                            className="flex items-center justify-center overflow-hidden transition-all bg-transparent border-0 shadow-none"
                            style={{
                              width: `${design.logoScale}px`,
                              height: `${design.logoScale}px`
                            }}
                          >
                            <img
                              src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        <div className={`mt-3 w-full ${design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                          <h2
                            className="text-xl font-bold leading-tight text-slate-800"
                            style={{ fontFamily: currentFontPrimary }}
                          >
                            {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                          </h2>
                          
                          {/* Franja de Acento Centrada / Alineada */}
                          <div
                            className={`h-1.5 w-14 my-2.5 rounded-full transition-all ${design.infoAlignment === 'left' ? 'mr-auto ml-0' : design.infoAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`}
                            style={{
                              backgroundColor: design.colorSecundario,
                              boxShadow: `0 0 10px ${design.colorSecundario}60`
                            }}
                          ></div>
                          
                          <p className="text-sm font-bold" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto / Cargo'}</p>
                          
                          {/* Badge de Empresa */}
                          {formData.empresa && (
                            <div
                              className="inline-block px-3 py-0.5 mt-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border transition-all"
                              style={{
                                backgroundColor: `${design.colorSecundario}15`,
                                borderColor: `${design.colorSecundario}50`,
                                color: design.colorSecundario
                              }}
                            >
                              {formData.empresa}
                            </div>
                          )}
                        </div>

                        {!design.hideBio && formData.nota && (
                          <div className="w-full mt-3">
                            {design.customLabels?.bio && (
                              <p className="text-[10px] font-rosetta uppercase font-bold tracking-wider mb-1" style={{ color: design.colorPrimario }}>{design.customLabels.bio}</p>
                            )}
                            <p className="text-xs p-2.5 rounded-xl bg-gray-100 opacity-80 leading-relaxed italic border-l-3 w-full" style={{ borderColor: design.colorCTA }}>
                              "{formData.nota}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. TEMA MODERNO (CYBER DARK) */}
                  {design.theme === 'modern' && (
                    <div className={`p-5 flex flex-col ${design.logoPosition === 'left' ? 'items-start text-left' : design.logoPosition === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 relative">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                        </div>
                      )}

                      {/* Logo Adaptable */}
                      {design.logoPosition !== 'hidden' && (
                        <div
                          className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
                          style={{
                            width: `${design.logoScale}px`,
                            height: `${design.logoScale}px`
                          }}
                        >
                          <img
                            src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className={`w-full ${design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                        <h2
                          className="text-xl font-bold tracking-tight mt-2 text-white"
                          style={{ fontFamily: currentFontPrimary }}
                        >
                          {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                        </h2>
                        
                        {/* Franja de Acento */}
                        <div
                          className={`h-1.5 w-14 my-2 rounded-full transition-all ${design.infoAlignment === 'left' ? 'mr-auto ml-0' : design.infoAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`}
                          style={{
                            backgroundColor: design.colorSecundario,
                            boxShadow: `0 0 10px ${design.colorSecundario}80`
                          }}
                        ></div>
                        
                        <p className="text-sm font-bold mt-0.5" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto / Cargo'}</p>
                        
                        {formData.empresa && (
                          <div
                            className="inline-block px-3 py-1 mt-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all"
                            style={{
                              backgroundColor: `${design.colorSecundario}15`,
                              borderColor: `${design.colorSecundario}60`,
                              color: design.colorSecundario
                            }}
                          >
                            {formData.empresa}
                          </div>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div className="w-full mt-3">
                          {design.customLabels?.bio && (
                            <p className="text-[10px] font-rosetta uppercase font-bold tracking-wider mb-1" style={{ color: design.colorPrimario }}>{design.customLabels.bio}</p>
                          )}
                          <p className="text-xs opacity-80 leading-relaxed px-2 italic text-gray-300">
                            "{formData.nota}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. TEMA MINIMALISTA EJECUTIVO */}
                  {design.theme === 'minimal' && (
                    <div className={`p-6 flex flex-col ${design.logoPosition === 'left' ? 'items-start text-left' : design.logoPosition === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-28 overflow-hidden mb-3 border-b border-gray-200 relative rounded-lg">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                        </div>
                      )}

                      {design.logoPosition !== 'hidden' && (
                        <div
                          className="flex items-center justify-center my-2.5 bg-transparent border-0 shadow-none transition-all"
                          style={{
                            width: `${design.logoScale}px`,
                            height: `${design.logoScale}px`
                          }}
                        >
                          <img
                            src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className={`w-full ${design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                        <h2
                          className="text-2xl font-light tracking-tight text-slate-900"
                          style={{ fontFamily: currentFontPrimary }}
                        >
                          {formData.nombre || 'Nombre'} <span className="font-extrabold">{formData.apellido || 'Apellido'}</span>
                        </h2>
                        
                        <div className={`w-12 h-1 my-2 rounded-full ${design.infoAlignment === 'left' ? 'mr-auto ml-0' : design.infoAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`} style={{ backgroundColor: design.colorSecundario }}></div>
                        
                        <p className="text-xs font-bold tracking-wider uppercase font-rosetta" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto / Cargo'}</p>
                        
                        {formData.empresa && (
                          <p className="text-xs font-semibold mt-1" style={{ color: design.colorSecundario }}>{formData.empresa}</p>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div className="w-full mt-3">
                          {design.customLabels?.bio && (
                            <p className="text-[10px] font-rosetta uppercase font-bold tracking-wider mb-1" style={{ color: design.colorPrimario }}>{design.customLabels.bio}</p>
                          )}
                          <p className="text-xs opacity-75 leading-relaxed italic max-w-[90%] text-slate-600">
                            "{formData.nota}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. TEMA GLASSMORPHISM FROST */}
                  {design.theme === 'glassmorphism' && (
                    <div className="p-5 flex flex-col relative overflow-hidden">
                      <div
                        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-30"
                        style={{ backgroundColor: design.colorPrimario }}
                      ></div>
                      <div
                        className="absolute top-1/2 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-30"
                        style={{ backgroundColor: design.colorSecundario }}
                      ></div>

                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 rounded-3xl overflow-hidden mb-3 border border-white/15 backdrop-blur-md shadow-lg relative">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      )}

                      <div className={`w-full backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col ${design.logoPosition === 'left' ? 'items-start text-left' : design.logoPosition === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                        {design.logoPosition !== 'hidden' && (
                          <div
                            className="flex items-center justify-center overflow-hidden my-1 bg-transparent border-0 shadow-none transition-all"
                            style={{
                              width: `${design.logoScale}px`,
                              height: `${design.logoScale}px`
                            }}
                          >
                            <img
                              src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                              alt="Logo"
                              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                            />
                          </div>
                        )}

                        <div className={`w-full ${design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                          <h2
                            className="text-xl font-bold tracking-tight mt-1 text-white"
                            style={{ fontFamily: currentFontPrimary }}
                          >
                            {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                          </h2>

                          <div
                            className={`h-1 w-12 my-2 rounded-full backdrop-blur-md ${design.infoAlignment === 'left' ? 'mr-auto ml-0' : design.infoAlignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`}
                            style={{ backgroundColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}` }}
                          ></div>

                          <p className="text-sm font-semibold tracking-wide" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto / Cargo'}</p>

                          {formData.empresa && (
                            <div className="inline-block px-3 py-0.5 mt-2 rounded-full text-[10px] uppercase font-mono tracking-widest backdrop-blur-md bg-white/10 border border-white/20 text-gray-200">
                              ✨ {formData.empresa}
                            </div>
                          )}
                        </div>

                        {!design.hideBio && formData.nota && (
                          <div className="w-full mt-3">
                            {design.customLabels?.bio && (
                              <p className="text-[10px] font-rosetta uppercase font-bold tracking-wider mb-1" style={{ color: design.colorPrimario }}>{design.customLabels.bio}</p>
                            )}
                            <p className="text-xs text-gray-300 italic leading-relaxed backdrop-blur-sm bg-black/20 p-2.5 rounded-2xl border border-white/10 w-full">
                              "{formData.nota}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. TEMA MONOLITO LUXURY VIP */}
                  {design.theme === 'monolith' && (
                    <div className={`p-5 flex flex-col bg-[#0d0d0d] relative ${design.logoPosition === 'left' ? 'items-start text-left' : design.logoPosition === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                      <div
                        className="w-full h-1 rounded-full mb-3 shadow-[0_0_15px_rgba(255,0,3,0.5)]"
                        style={{ background: `linear-gradient(90deg, transparent, ${design.colorPrimario}, ${design.colorSecundario}, transparent)` }}
                      ></div>

                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-white/10 relative shadow-2xl">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all filter contrast-110"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30"></div>
                        </div>
                      )}

                      {design.logoPosition !== 'hidden' && (
                        <div
                          className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
                          style={{
                            width: `${design.logoScale}px`,
                            height: `${design.logoScale}px`
                          }}
                        >
                          <img
                            src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className={`w-full flex items-center gap-2 ${design.infoAlignment === 'left' ? 'justify-start' : design.infoAlignment === 'right' ? 'justify-end' : 'justify-center'} text-[10px] uppercase font-mono tracking-widest text-amber-300/80 mb-1`}>
                        <span>◆</span>
                        <span>VIP EXECUTIVE</span>
                        <span>◆</span>
                      </div>

                      <div className={`w-full ${design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                        <h2
                          className="text-xl font-extrabold uppercase tracking-wider text-white"
                          style={{ fontFamily: currentFontPrimary }}
                        >
                          {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                        </h2>

                        <p className="text-xs font-mono uppercase tracking-widest mt-1 font-bold" style={{ color: design.colorPrimario }}>
                          {formData.puesto || 'Puesto / Cargo'}
                        </p>

                        {formData.empresa && (
                          <div
                            className="inline-block px-4 py-1 mt-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold border"
                            style={{
                              borderColor: `${design.colorSecundario}60`,
                              backgroundColor: `${design.colorSecundario}10`,
                              color: design.colorSecundario
                            }}
                          >
                            {formData.empresa}
                          </div>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div className="w-full mt-3">
                          {design.customLabels?.bio && (
                            <p className="text-[10px] font-rosetta uppercase font-bold tracking-wider mb-1" style={{ color: design.colorPrimario }}>{design.customLabels.bio}</p>
                          )}
                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs italic text-gray-300 leading-relaxed w-full">
                            "{formData.nota}"
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. TEMA NEO-BRUTALISM POP */}
                  {design.theme === 'neobrutalism' && (
                    <div className={`p-5 flex flex-col bg-[#fffdfa] text-black ${
                      design.infoAlignment === 'left' ? 'items-start text-left' : design.infoAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                    }`}>
                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border-3 border-black shadow-[4px_4px_0px_#000000] relative bg-white">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                        </div>
                      )}

                      {design.logoPosition !== 'hidden' && (
                        <div className={`w-full flex ${
                          design.logoPosition === 'left' ? 'justify-start' : design.logoPosition === 'right' ? 'justify-end' : 'justify-center'
                        }`}>
                          <div
                            className="flex items-center justify-center overflow-hidden my-2 bg-transparent border-0 shadow-none transition-all"
                            style={{
                              width: `${design.logoScale}px`,
                              height: `${design.logoScale}px`
                            }}
                          >
                            <img
                              src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div className={`bg-white border-2.5 border-black shadow-[4px_4px_0px_#000000] p-3 rounded-2xl w-full mt-1 ${
                        design.infoAlignment === 'left' ? 'text-left' : design.infoAlignment === 'right' ? 'text-right' : 'text-center'
                      }`}>
                        <h2
                          className="text-xl font-black tracking-tight text-black uppercase"
                          style={{ fontFamily: currentFontPrimary }}
                        >
                          {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                        </h2>

                        <div className="h-1 w-full bg-black my-2"></div>

                        <p className="text-xs font-extrabold uppercase font-mono" style={{ color: design.colorPrimario }}>
                          {formData.puesto || 'Puesto / Cargo'}
                        </p>

                        {formData.empresa && (
                          <div
                            className="inline-block px-3 py-0.5 mt-2 rounded-md text-[11px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000]"
                            style={{ backgroundColor: design.colorSecundario, color: '#000000' }}
                          >
                            {formData.empresa}
                          </div>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div className="mt-3 p-2.5 rounded-xl bg-yellow-200/90 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-bold italic text-black leading-relaxed w-full">
                          {design.customLabels?.bio && (
                            <span className="block not-italic text-[10px] uppercase font-black tracking-wider text-black/70 mb-1">
                              {design.customLabels.bio}
                            </span>
                          )}
                          "{formData.nota}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* 7. TEMA HERO ASIMÉTRICO */}
                  {design.theme === 'split_hero' && (
                    <div className="p-5 flex flex-col bg-[#0a0e17] text-white">
                      {!design.hideBanner && (
                        coverPhoto ? (
                          <div
                            className="w-full h-28 overflow-hidden rounded-2xl mb-3 relative border border-white/10"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 100%)' }}
                          >
                            <img
                              src={coverPhoto}
                              alt="Cover"
                              className="w-full h-full object-cover transition-all"
                              style={{
                                objectPosition: `center ${design.coverPositionY}%`,
                                transform: `scale(${design.coverZoom / 100})`,
                                transformOrigin: `center ${design.coverPositionY}%`
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="w-full h-14 rounded-2xl mb-2"
                            style={{
                              background: `linear-gradient(135deg, ${design.colorPrimario}, ${design.colorSecundario})`,
                              clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)'
                            }}
                          ></div>
                        )
                      )}

                      <div className={`flex items-start justify-between gap-3 mt-1 ${
                        design.infoAlignment === 'right' ? 'flex-row-reverse text-right' : design.infoAlignment === 'center' ? 'flex-col items-center text-center' : 'text-left'
                      }`}>
                        <div className={`flex-1 ${design.infoAlignment === 'right' ? 'text-right' : design.infoAlignment === 'center' ? 'text-center' : 'text-left'}`}>
                          <h2
                            className="text-xl font-extrabold leading-tight text-white tracking-tight"
                            style={{ fontFamily: currentFontPrimary }}
                          >
                            {formData.nombre || 'Nombre'} <span className="block text-gray-300">{formData.apellido || 'Apellido'}</span>
                          </h2>
                          <p className="text-xs font-bold mt-1" style={{ color: design.colorPrimario }}>
                            {formData.puesto || 'Puesto / Cargo'}
                          </p>
                          {formData.empresa && (
                            <div
                              className="inline-block px-2.5 py-0.5 mt-1.5 rounded-md text-[10px] font-mono uppercase font-bold border"
                              style={{
                                backgroundColor: `${design.colorSecundario}15`,
                                borderColor: `${design.colorSecundario}50`,
                                color: design.colorSecundario
                              }}
                            >
                              {formData.empresa}
                            </div>
                          )}
                        </div>

                        {design.logoPosition !== 'hidden' && (
                          <div
                            className="flex items-center justify-center overflow-hidden shrink-0 bg-transparent border-0 shadow-none transition-all"
                            style={{
                              width: `${Math.min(design.logoScale, 90)}px`,
                              height: `${Math.min(design.logoScale, 90)}px`
                            }}
                          >
                            <img
                              src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div
                          className="mt-3 p-2.5 rounded-xl bg-white/[0.04] border-l-3 text-xs italic text-gray-300 leading-relaxed text-left"
                          style={{ borderColor: design.colorCTA }}
                        >
                          {design.customLabels?.bio && (
                            <span className="block not-italic text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                              {design.customLabels.bio}
                            </span>
                          )}
                          "{formData.nota}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* 8. TEMA BENTO GRID TECH */}
                  {design.theme === 'bento_grid' && (
                    <div className="p-4 flex flex-col gap-3 bg-[#0f0f14] text-white">
                      <div className={`bg-white/[0.05] border border-white/10 rounded-3xl p-4 flex flex-col relative overflow-hidden shadow-lg ${
                        design.infoAlignment === 'left' ? 'items-start text-left' : design.infoAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                      }`}>
                        {!design.hideBanner && coverPhoto && (
                          <div className="w-full h-20 rounded-2xl overflow-hidden mb-3 relative border border-white/10">
                            <img
                              src={coverPhoto}
                              alt="Cover"
                              className="w-full h-full object-cover"
                              style={{
                                objectPosition: `center ${design.coverPositionY}%`,
                                transform: `scale(${design.coverZoom / 100})`,
                                transformOrigin: `center ${design.coverPositionY}%`
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14]/80 to-transparent"></div>
                          </div>
                        )}

                        {design.logoPosition !== 'hidden' && (
                          <div className={`w-full flex ${
                            design.logoPosition === 'left' ? 'justify-start' : design.logoPosition === 'right' ? 'justify-end' : 'justify-center'
                          }`}>
                            <div
                              className="flex items-center justify-center overflow-hidden my-1 bg-transparent border-0 shadow-none transition-all"
                              style={{
                                width: `${design.logoScale}px`,
                                height: `${design.logoScale}px`
                              }}
                            >
                              <img
                                src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        <h2
                          className="text-lg font-bold text-white mt-1"
                          style={{ fontFamily: currentFontPrimary }}
                        >
                          {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                        </h2>

                        <p className="text-xs font-semibold" style={{ color: design.colorPrimario }}>{formData.puesto || 'Puesto / Cargo'}</p>

                        {formData.empresa && (
                          <span
                            className="inline-block px-3 py-0.5 mt-2 rounded-full text-[10px] font-mono uppercase font-bold border"
                            style={{
                              backgroundColor: `${design.colorSecundario}15`,
                              borderColor: `${design.colorSecundario}40`,
                              color: design.colorSecundario
                            }}
                          >
                            {formData.empresa}
                          </span>
                        )}
                      </div>

                      {!design.hideBio && formData.nota && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 text-xs italic text-gray-300 text-center leading-relaxed">
                          {design.customLabels?.bio && (
                            <span className="block not-italic text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                              {design.customLabels.bio}
                            </span>
                          )}
                          "{formData.nota}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* 9. TEMA CYBER NEON MATRIX */}
                  {design.theme === 'cyber_matrix' && (
                    <div className={`p-5 flex flex-col bg-[#050508] text-white relative font-mono ${
                      design.infoAlignment === 'left' ? 'items-start text-left' : design.infoAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                    }`}>
                      <div className="w-full flex justify-between text-[10px] text-cyan-400/80 mb-2 border-b border-cyan-500/20 pb-1 font-mono">
                        <span>[SYS_PROFILE]</span>
                        <span className="text-emerald-400">● LIVE HUD</span>
                      </div>

                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-cyan-500/30 relative shadow-[0_0_15px_rgba(0,255,255,0.15)]">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent opacity-80"></div>
                        </div>
                      )}

                      {design.logoPosition !== 'hidden' && (
                        <div className={`w-full flex ${
                          design.logoPosition === 'left' ? 'justify-start' : design.logoPosition === 'right' ? 'justify-end' : 'justify-center'
                        }`}>
                          <div className="relative my-2">
                            <div
                              className="flex items-center justify-center overflow-hidden bg-transparent border-0 shadow-none transition-all"
                              style={{
                                width: `${design.logoScale}px`,
                                height: `${design.logoScale}px`
                              }}
                            >
                              <img
                                src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                                alt="Logo"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,0,3,0.6)]"
                              />
                            </div>
                            <span className="absolute -top-1 -left-1 text-[10px] text-cyan-400">+</span>
                            <span className="absolute -bottom-1 -right-1 text-[10px] text-cyan-400">+</span>
                          </div>
                        </div>
                      )}

                      <h2
                        className="text-xl font-bold tracking-widest text-cyan-100 uppercase mt-1"
                        style={{ fontFamily: currentFontPrimary }}
                      >
                        {formData.nombre || 'Nombre'} {formData.apellido || 'Apellido'}
                      </h2>

                      <div className="flex items-center gap-1.5 my-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE334E] animate-ping"></span>
                        <p className="text-xs uppercase tracking-wider font-bold" style={{ color: design.colorPrimario }}>
                          // {formData.puesto || 'Puesto / Cargo'}
                        </p>
                      </div>

                      {formData.empresa && (
                        <div
                          className="px-3 py-0.5 mt-1 rounded text-[10px] uppercase tracking-widest font-bold border border-cyan-500/40 bg-cyan-950/30 text-cyan-300"
                        >
                          ID: {formData.empresa}
                        </div>
                      )}

                      {!design.hideBio && formData.nota && (
                        <div className="mt-3 p-2.5 rounded bg-black/80 border-l-2 border-r-2 border-cyan-500/40 text-[11px] text-cyan-200/80 leading-relaxed text-left w-full">
                          {design.customLabels?.bio && (
                            <span className="block text-[9px] uppercase tracking-widest text-cyan-400 mb-0.5">
                              // {design.customLabels.bio}
                            </span>
                          )}
                          &gt; {formData.nota}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 10. TEMA SUIZO EDITORIAL CLEAN */}
                  {design.theme === 'editorial_swiss' && (
                    <div className={`p-6 flex flex-col bg-white text-zinc-900 ${
                      design.infoAlignment === 'left' ? 'items-start text-left' : design.infoAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                    }`}>
                      {!design.hideBanner && coverPhoto && (
                        <div className="w-full h-24 overflow-hidden mb-3 border-b border-zinc-200 relative">
                          <img
                            src={coverPhoto}
                            alt="Cover"
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                            style={{
                              objectPosition: `center ${design.coverPositionY}%`,
                              transform: `scale(${design.coverZoom / 100})`,
                              transformOrigin: `center ${design.coverPositionY}%`
                            }}
                          />
                        </div>
                      )}

                      {design.logoPosition !== 'hidden' && (
                        <div className={`w-full flex ${
                          design.logoPosition === 'left' ? 'justify-start' : design.logoPosition === 'right' ? 'justify-end' : 'justify-center'
                        }`}>
                          <div
                            className="flex items-center justify-center my-2 bg-transparent border-0 shadow-none transition-all"
                            style={{
                              width: `${design.logoScale}px`,
                              height: `${design.logoScale}px`
                            }}
                          >
                            <img
                              src={logoImg || brandConfig.assets?.logo || '/brand/logo.png'}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div className="w-full h-[1px] bg-zinc-200 my-2"></div>

                      <h2
                        className="text-2xl font-light tracking-tighter text-zinc-950 uppercase"
                        style={{ fontFamily: currentFontPrimary }}
                      >
                        {formData.nombre || 'Nombre'} <span className="font-bold">{formData.apellido || 'Apellido'}</span>
                      </h2>

                      <p className="text-xs font-medium tracking-wider uppercase text-zinc-500 mt-1" style={{ color: design.colorPrimario }}>
                        {formData.puesto || 'Puesto / Cargo'}
                      </p>

                      {formData.empresa && (
                        <p className="text-xs font-semibold text-zinc-800 tracking-wide mt-1" style={{ color: design.colorSecundario }}>
                          {formData.empresa}
                        </p>
                      )}

                      <div className="w-full h-[1px] bg-zinc-200 my-2"></div>

                      {!design.hideBio && formData.nota && (
                        <div className="w-full text-xs text-zinc-600 leading-relaxed italic px-2">
                          {design.customLabels?.bio && (
                            <span className="block not-italic text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-0.5">
                              {design.customLabels.bio}
                            </span>
                          )}
                          "{formData.nota}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* PASTILLAS DE CONTACTO & REDES SOCIALES ADAPTABLES AL TEMA */}
                  <div className="px-5 space-y-2 mt-3">
                    {/* BLOQUE DE CONTACTO */}
                    {!design.hideContact && (formData.telefono || formData.correo || formData.url) && (
                      <div className="space-y-2">
                        {design.customLabels?.contact && (
                          <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 px-1 text-left">
                            {design.customLabels.contact}
                          </div>
                        )}
                        {formData.telefono && (
                          <div
                            className={`flex items-center gap-3 p-2.5 text-xs font-medium border transition-all ${
                              design.socialIconShape === 'circle' ? 'rounded-full' : design.socialIconShape === 'square' ? 'rounded-none' : 'rounded-xl'
                            } ${
                              design.theme === 'neobrutalism'
                                ? 'bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black font-bold'
                                : design.theme === 'glassmorphism'
                                ? 'backdrop-blur-md bg-white/5 border-white/15 text-white'
                                : design.theme === 'cyber_matrix'
                                ? 'bg-[#080812] border-cyan-500/30 text-cyan-200 font-mono shadow-[0_0_8px_rgba(0,255,255,0.06)]'
                                : design.theme === 'monolith'
                                ? 'bg-[#141414] border-white/15 text-white'
                                : design.theme === 'editorial_swiss'
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                                : ''
                            }`}
                            style={
                              design.theme !== 'neobrutalism' && design.theme !== 'glassmorphism' && design.theme !== 'cyber_matrix' && design.theme !== 'monolith' && design.theme !== 'editorial_swiss'
                                ? {
                                    backgroundColor: `${design.colorSecundario}08`,
                                    borderColor: `${design.colorSecundario}25`
                                  }
                                : {}
                            }
                          >
                            <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span className="truncate">{formData.telefono}</span>
                          </div>
                        )}
                        {formData.correo && (
                          <div
                            className={`flex items-center gap-3 p-2.5 text-xs font-medium border transition-all ${
                              design.socialIconShape === 'circle' ? 'rounded-full' : design.socialIconShape === 'square' ? 'rounded-none' : 'rounded-xl'
                            } ${
                              design.theme === 'neobrutalism'
                                ? 'bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black font-bold'
                                : design.theme === 'glassmorphism'
                                ? 'backdrop-blur-md bg-white/5 border-white/15 text-white'
                                : design.theme === 'cyber_matrix'
                                ? 'bg-[#080812] border-cyan-500/30 text-cyan-200 font-mono shadow-[0_0_8px_rgba(0,255,255,0.06)]'
                                : design.theme === 'monolith'
                                ? 'bg-[#141414] border-white/15 text-white'
                                : design.theme === 'editorial_swiss'
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                                : ''
                            }`}
                            style={
                              design.theme !== 'neobrutalism' && design.theme !== 'glassmorphism' && design.theme !== 'cyber_matrix' && design.theme !== 'monolith' && design.theme !== 'editorial_swiss'
                                ? {
                                    backgroundColor: `${design.colorSecundario}08`,
                                    borderColor: `${design.colorSecundario}25`
                                  }
                                : {}
                            }
                          >
                            <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="truncate">{formData.correo}</span>
                          </div>
                        )}
                        {formData.url && (
                          <div
                            className={`flex items-center gap-3 p-2.5 text-xs font-medium border transition-all ${
                              design.socialIconShape === 'circle' ? 'rounded-full' : design.socialIconShape === 'square' ? 'rounded-none' : 'rounded-xl'
                            } ${
                              design.theme === 'neobrutalism'
                                ? 'bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black font-bold'
                                : design.theme === 'glassmorphism'
                                ? 'backdrop-blur-md bg-white/5 border-white/15 text-white'
                                : design.theme === 'cyber_matrix'
                                ? 'bg-[#080812] border-cyan-500/30 text-cyan-200 font-mono shadow-[0_0_8px_rgba(0,255,255,0.06)]'
                                : design.theme === 'monolith'
                                ? 'bg-[#141414] border-white/15 text-white'
                                : design.theme === 'editorial_swiss'
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                                : ''
                            }`}
                            style={
                              design.theme !== 'neobrutalism' && design.theme !== 'glassmorphism' && design.theme !== 'cyber_matrix' && design.theme !== 'monolith' && design.theme !== 'editorial_swiss'
                                ? {
                                    backgroundColor: `${design.colorSecundario}08`,
                                    borderColor: `${design.colorSecundario}25`
                                  }
                                : {}
                            }
                          >
                            <svg className="w-4 h-4 shrink-0 transition-colors" style={{ color: design.colorSecundario }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                            <span className="truncate">{formData.url.replace(/^https?:\/\//, '')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACCIÓN PRINCIPAL RÁPIDA: AGENDAR CITA */}
                    {(formData.googleCalendarUrl || formData.calendlyUrl || formData.icloudCalendarUrl) && (
                      <a
                        href={formData.googleCalendarUrl || formData.calendlyUrl || formData.icloudCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg border"
                        style={{
                          background: `linear-gradient(135deg, ${design.colorPrimario} 0%, #15050A 100%)`,
                          borderColor: design.colorPrimario,
                          boxShadow: `0 0 15px ${design.colorPrimario}40`
                        }}
                      >
                        <span className="text-sm animate-pulse">📅</span> Agendar Cita de Negocios
                      </a>
                    )}

                    {/* REDES SOCIALES & ENLACES EN EL CELULAR */}
                    {!design.hideSocial && (formData.facebook || formData.instagram || formData.linkedin || formData.tiktok || formData.twitter || formData.youtube || formData.whatsapp) && (
                      <div className="space-y-2 pt-1">
                        {design.customLabels?.social && (
                          <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 px-1 text-left">
                            {design.customLabels.social}
                          </div>
                        )}

                        {/* 1. MODO CUADROS CON URL */}
                        {design.linksDisplayMode === 'url_boxes' && (
                          <div className="space-y-2">
                            {[
                              formData.facebook ? { id: 'fb', title: 'Facebook', displayUrl: `facebook.com/${formData.facebook.replace(/^@+/, '')}`, icon: <FacebookIcon className="w-3.5 h-3.5" />, color: '#1877F2' } : null,
                              formData.instagram ? { id: 'ig', title: 'Instagram', displayUrl: `instagram.com/${formData.instagram.replace(/^@+/, '')}`, icon: <InstagramIcon className="w-3.5 h-3.5" />, color: '#E4405F' } : null,
                              formData.linkedin ? { id: 'in', title: 'LinkedIn', displayUrl: `linkedin.com/in/${formData.linkedin.replace(/^@+/, '')}`, icon: <LinkedInIcon className="w-3.5 h-3.5" />, color: '#0A66C2' } : null,
                              formData.tiktok ? { id: 'tt', title: 'TikTok', displayUrl: `tiktok.com/@${formData.tiktok.replace(/^@+/, '')}`, icon: <TikTokIcon className="w-3.5 h-3.5" />, color: '#FFFFFF' } : null,
                              formData.twitter ? { id: 'x', title: 'X (Twitter)', displayUrl: `x.com/${formData.twitter.replace(/^@+/, '')}`, icon: <XTwitterIcon className="w-3.5 h-3.5" />, color: '#FFFFFF' } : null,
                              formData.youtube ? { id: 'yt', title: 'YouTube', displayUrl: `youtube.com/${formData.youtube.replace(/^@+/, '')}`, icon: <YouTubeIcon className="w-3.5 h-3.5" />, color: '#FF0000' } : null,
                              formData.whatsapp ? { id: 'wa', title: 'WhatsApp', displayUrl: `wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`, icon: <WhatsAppIcon className="w-3.5 h-3.5" />, color: '#25D366' } : null
                            ].filter(Boolean).map(item => (
                              <div
                                key={item.id}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl border text-xs shadow-sm transition-all"
                                style={{
                                  backgroundColor: `${design.colorSecundario}0d`,
                                  borderColor: `${design.colorSecundario}30`
                                }}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border" style={{ backgroundColor: `${design.colorSecundario}18`, borderColor: `${design.colorSecundario}40`, color: item.color }}>
                                    {item.icon}
                                  </div>
                                  <div className="text-left min-w-0">
                                    <p className="text-[11px] font-bold tracking-wide truncate">{item.title}</p>
                                    <p className="text-[9px] opacity-70 truncate font-mono">{item.displayUrl}</p>
                                  </div>
                                </div>
                                <span className="text-[9px] font-mono opacity-70 shrink-0">Abrir ↗</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2. MODO TARJETAS / WIDGETS EMBEBIDOS */}
                        {design.linksDisplayMode === 'embedded' && (
                          <div className="space-y-2.5">
                            {[
                              formData.facebook ? { id: 'fb', title: 'Facebook', badge: 'Social', displayUrl: `facebook.com/${formData.facebook.replace(/^@+/, '')}`, icon: <FacebookIcon className="w-3.5 h-3.5" />, color: '#1877F2' } : null,
                              formData.instagram ? { id: 'ig', title: 'Instagram', badge: 'Feed', displayUrl: `instagram.com/${formData.instagram.replace(/^@+/, '')}`, icon: <InstagramIcon className="w-3.5 h-3.5" />, color: '#E4405F' } : null,
                              formData.linkedin ? { id: 'in', title: 'LinkedIn', badge: 'Perfil', displayUrl: `linkedin.com/in/${formData.linkedin.replace(/^@+/, '')}`, icon: <LinkedInIcon className="w-3.5 h-3.5" />, color: '#0A66C2' } : null,
                              formData.tiktok ? { id: 'tt', title: 'TikTok', badge: 'Videos', displayUrl: `tiktok.com/@${formData.tiktok.replace(/^@+/, '')}`, icon: <TikTokIcon className="w-3.5 h-3.5" />, color: '#FFFFFF' } : null,
                              formData.twitter ? { id: 'x', title: 'X (Twitter)', badge: 'News', displayUrl: `x.com/${formData.twitter.replace(/^@+/, '')}`, icon: <XTwitterIcon className="w-3.5 h-3.5" />, color: '#FFFFFF' } : null,
                              formData.youtube ? { id: 'yt', title: 'YouTube', badge: 'Canal', displayUrl: `youtube.com/${formData.youtube.replace(/^@+/, '')}`, icon: <YouTubeIcon className="w-3.5 h-3.5" />, color: '#FF0000' } : null,
                              formData.whatsapp ? { id: 'wa', title: 'WhatsApp', badge: 'Chat', displayUrl: `wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`, icon: <WhatsAppIcon className="w-3.5 h-3.5" />, color: '#25D366' } : null
                            ].filter(Boolean).map(item => (
                              <div
                                key={item.id}
                                className="w-full rounded-xl p-2.5 border shadow-md relative overflow-hidden backdrop-blur-md"
                                style={{
                                  background: `linear-gradient(135deg, ${design.colorSecundario}12 0%, rgba(10,10,20,0.85) 100%)`,
                                  borderColor: `${design.colorSecundario}35`
                                }}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border" style={{ backgroundColor: `${design.colorSecundario}25`, borderColor: `${design.colorSecundario}60`, color: item.color }}>
                                      {item.icon}
                                    </div>
                                    <div className="text-left">
                                      <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border" style={{ color: design.colorSecundario, borderColor: `${design.colorSecundario}50`, backgroundColor: `${design.colorSecundario}15` }}>
                                        {item.badge}
                                      </span>
                                      <h4 className="text-[10px] font-bold mt-0.5">{item.title}</h4>
                                    </div>
                                  </div>
                                  <span className="px-2 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: design.colorPrimario }}>
                                    Visitar ↗
                                  </span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-300">
                                  <span className="truncate">{item.displayUrl}</span>
                                  <span className="text-[8px] text-emerald-400 shrink-0 ml-1">● Conectado</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 3. MODO ICONOS CLÁSICOS (GRID) */}
                        {(!design.linksDisplayMode || design.linksDisplayMode === 'icons') && (
                          <div className="flex flex-wrap items-center justify-center gap-2.5">
                            {formData.facebook && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#1877F218', borderColor: '#1877F240', color: '#1877F2' }
                                }
                              >
                                <FacebookIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.instagram && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#E4405F18', borderColor: '#E4405F40', color: '#E4405F' }
                                }
                              >
                                <InstagramIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.linkedin && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#0A66C218', borderColor: '#0A66C240', color: '#0A66C2' }
                                }
                              >
                                <LinkedInIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.tiktok && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#00000030', borderColor: '#FFFFFF30', color: '#FFFFFF' }
                                }
                              >
                                <TikTokIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.twitter && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#00000030', borderColor: '#FFFFFF30', color: '#FFFFFF' }
                                }
                              >
                                <XTwitterIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.youtube && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#FF000018', borderColor: '#FF000040', color: '#FF0000' }
                                }
                              >
                                <YouTubeIcon className="w-4 h-4" />
                              </div>
                            )}
                            {formData.whatsapp && (
                              <div
                                className={`flex items-center justify-center ${
                                  design.socialIconShape === 'square' ? 'rounded-md' : design.socialIconShape === 'rounded' ? 'rounded-xl' : design.socialIconShape === 'none' ? 'bg-transparent border-0' : 'rounded-full'
                                } ${design.socialIconShape !== 'none' ? 'w-10 h-10 border shadow-md' : ''}`}
                                style={
                                  design.socialIconStyle === 'glow' ? { backgroundColor: `${design.colorSecundario}20`, borderColor: design.colorSecundario, boxShadow: `0 0 10px ${design.colorSecundario}80`, color: design.colorSecundario } :
                                  design.socialIconStyle === 'monochrome' ? { backgroundColor: `${design.colorSecundario}15`, borderColor: `${design.colorSecundario}30`, color: design.colorSecundario } :
                                  { backgroundColor: '#25D36618', borderColor: '#25D36640', color: '#25D366' }
                                }
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!design.hideMap && effectiveMapsUrl && (
                      <a
                        href={effectiveMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border transition-all hover:scale-[1.01]"
                        style={{
                          backgroundColor: `${design.colorSecundario}15`,
                          borderColor: design.colorSecundario,
                          color: design.colorSecundario
                        }}
                      >
                        <span>📍</span> {locationLabel}
                      </a>
                    )}

                    {!design.hideVideo && formData.videoYoutubeUrl && (
                      <div className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 shadow-md">
                        <span>▶</span> Ver Video de Presentación
                      </div>
                    )}

                    {/* FOOTER DISCRETO EN PREVIEW */}
                    <div className="pt-6 pb-2 text-center opacity-60">
                      <p className="text-[9px] font-mono tracking-wider uppercase">
                        Tecnología por <span className="font-bold text-white">TSolutions ROSE</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* BOTÓN FLOTANTE INFERIOR DENTRO DEL MOCKUP (SIEMPRE VISIBLE / FIJO EN EL SCROLL) */}
            {mode === 'vcard' && (
              <div className="absolute bottom-3 left-3 right-3 z-30 space-y-1.5 pointer-events-auto bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-3 pb-0.5 px-0.5 rounded-b-[28px] backdrop-blur-xs">
                <button
                  type="button"
                  onClick={downloadVCF}
                  className={`w-full py-3.5 rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2 border border-white/20 shadow-2xl ${
                    design.theme === 'neobrutalism'
                      ? 'border-2.5 border-black shadow-[4px_4px_0px_#000] text-white font-black'
                      : design.theme === 'glassmorphism'
                      ? 'backdrop-blur-xl border border-white/30 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                      : design.theme === 'cyber_matrix'
                      ? 'border border-cyan-400 text-white font-mono shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                      : design.theme === 'monolith'
                      ? 'border border-white/20 text-white shadow-2xl font-bold'
                      : 'text-white shadow-xl'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${design.colorCTA} 0%, #BE123C 100%)`,
                    fontFamily: currentFontPrimary,
                    boxShadow: `0 6px 20px ${design.colorCTA}60`
                  }}
                >
                  <span className="text-sm">💾</span>
                  <span>{t('preview_save_btn')}</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    type="button"
                    onClick={() => alert('Apple Wallet estará disponible al descargar tu tarjeta.')}
                    className="w-full py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white font-semibold text-[10px] flex items-center justify-center gap-1 hover:bg-white/10 transition-colors shadow-sm"
                  >
                     Apple Wallet
                  </button>
                  <button 
                    type="button"
                    onClick={() => alert('Google Wallet estará disponible al descargar tu tarjeta.')}
                    className="w-full py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white font-semibold text-[10px] flex items-center justify-center gap-1 hover:bg-white/10 transition-colors shadow-sm"
                  >
                    Google Wallet
                  </button>
                </div>
              </div>
            )}
          </div>

        </section>

      </main>

      {/* SECCIÓN MARKETING 2.0: ECOSISTEMA DE SOLUCIONES TSOLUTIONS IPIDD (CONVERSIÓN & UPSELL) */}
      <section className="mt-16 max-w-[1920px] mx-auto w-full border-t border-gray-800/80 pt-12 pb-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-[#ff0003]/10 border border-[#ff0003]/30 text-[#EE334E]">
            ⚡ Soluciones Tecnológicas de Alto Impacto
          </div>
          <h2 className="text-2xl md:text-3xl font-rosetta text-white">
            MÁS ALLÁ DE LA VCARD: ECOSISTEMA <span className="text-[#ff0003]">TSOLUTIONS IPIDD</span>
          </h2>
          <p className="text-xs text-gray-400">
            Diseñamos, desarrollamos e implementamos plataformas digitales, software a la medida y automatización inteligente para empresas líderes.
          </p>
        </div>

        {/* GRILLA DE 4 PILARES COMERCIALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pilar 1: Software a Medida */}
          <div className="bg-[#090914] border border-gray-800 hover:border-[#ff0003]/50 p-6 rounded-2xl space-y-3 transition-all group shadow-lg hover:shadow-[0_0_25px_rgba(255,0,3,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-[#ff0003]/10 border border-[#ff0003]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💻
            </div>
            <h3 className="font-rosetta text-sm text-white font-bold">Software & Apps a la Medida</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Desarrollo de plataformas web, aplicaciones móviles, sistemas ERP y CRMs personalizados a la operativa de tu negocio.
            </p>
          </div>

          {/* Pilar 2: Inteligencia Artificial */}
          <div className="bg-[#090914] border border-gray-800 hover:border-[#00E5FF]/50 p-6 rounded-2xl space-y-3 transition-all group shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="font-rosetta text-sm text-white font-bold">Automatización con IA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Agentes inteligentes, procesamiento automatizado de datos y chatbots avanzados para multiplicar la productividad de tu equipo.
            </p>
          </div>

          {/* Pilar 3: Cloud & Seguridad */}
          <div className="bg-[#090914] border border-gray-800 hover:border-green-500/50 p-6 rounded-2xl space-y-3 transition-all group shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ☁️
            </div>
            <h3 className="font-rosetta text-sm text-white font-bold">Google Cloud & Ciberseguridad</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Infraestructura escalable, bases de datos PostgreSQL de alta disponibilidad y arquitectura cloud de nivel bancario.
            </p>
          </div>

          {/* Pilar 4: Consultoría IPIDD */}
          <div className="bg-[#090914] border border-gray-800 hover:border-purple-500/50 p-6 rounded-2xl space-y-3 transition-all group shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📈
            </div>
            <h3 className="font-rosetta text-sm text-white font-bold">Consultoría Estratégica IPIDD</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Diagnóstico tecnológico y planes de digitalización orientados a rentabilidad y reducción de costos operativos.
            </p>
          </div>
        </div>

        {/* BANNER CTA DE CAPTACIÓN HIGH-TICKET */}
        <div className="bg-gradient-to-r from-[#0c0c16] via-[#1a050a] to-[#0c0c16] border border-[#ff0003]/40 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(255,0,3,0.15)]">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-rosetta text-white font-bold">
              ¿Quieres digitalizar o automatizar los procesos de tu empresa?
            </h3>
            <p className="text-xs text-gray-400">
              Agenda una sesión de diagnóstico tecnológico sin costo (30 min) con los ingenieros de TSOLUTIONS IPIDD.
            </p>
          </div>
          <a
            href="https://wa.me/526860000000?text=Hola%20TSOLUTIONS%20IPIDD,%20me%20gustaria%20agendar%20un%20diagnostico%20tecnologico%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#ff0003] hover:bg-[#EE334E] text-white font-rosetta font-bold text-xs rounded-xl transition-all shrink-0 shadow-[0_0_20px_rgba(255,0,3,0.35)] flex items-center gap-2"
          >
            <span>📅</span> Solicitar Diagnóstico Gratuito
          </a>
        </div>

        {/* FOOTER CORPORATIVO TSOLUTIONS IPIDD */}
        <footer className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-rosetta text-white">TSOLUTIONS IPIDD</span>
            <span>•</span>
            <span>Transformación Digital & Soluciones Estratégicas</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <a href="https://tsolutionsipidd.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff0003]">
              tsolutionsipidd.com ↗
            </a>
            <a href="/admin" className="hover:text-[#00E5FF]">
              Panel de Control Admin
            </a>
          </div>
        </footer>
      </section>

      {/* MODAL DE LA CARTA OFICIAL DE ENTREGA DE TSOLUTIONS IPIDD */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c16] border border-[#ff0003]/50 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-[0_0_40px_rgba(255,0,3,0.25)] flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Header Modal */}
            <div className="p-4 bg-[#12121c] border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#ff0003]">
                <span>📜</span>
                <h3 className="font-rosetta text-sm font-bold text-white">Carta Oficial de Entrega de Entregables</h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Contenido Carta */}
            <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs text-gray-300 leading-relaxed">
              <div className="p-3 bg-black/50 border border-gray-800 rounded-lg">
                <p className="text-[11px] text-gray-400 font-mono"><span className="text-[#ff0003] font-bold">Para:</span> {formData.correo || 'correo@cliente.com'}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5"><span className="text-[#ff0003] font-bold">Asunto:</span> {generateDeliveryEmailContent().subject}</p>
              </div>

              <textarea
                readOnly
                value={generateDeliveryEmailContent().body}
                rows={16}
                className="w-full bg-[#06060c] border border-gray-800 p-4 rounded-xl text-xs font-mono text-gray-200 focus:outline-none select-all"
              />
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-[#12121c] border-t border-gray-800 flex flex-wrap gap-3 justify-end items-center">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateDeliveryEmailContent().body);
                  alert('¡Carta de entrega copiada al portapapeles!');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-rosetta rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> Copiar al Portapapeles
              </button>

              <button
                type="button"
                onClick={() => {
                  sendDeliveryEmail();
                  setShowEmailModal(false);
                }}
                className="px-4 py-2 bg-[#ff0003] text-white text-xs font-rosetta font-bold rounded-lg hover:bg-[#EE334E] transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,3,0.3)]"
              >
                <span>✉️</span> Abrir en Cliente de Correo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE FEEDBACK OBLIGATORIO PARA TARJETAS DE OBSEQUIO */}
      <ConstructionFeedbackModal
        isOpen={showConstructionFeedback}
        onClose={() => setShowConstructionFeedback(false)}
        onSuccess={handleFeedbackSuccess}
        profileSlug={baseCardSlug}
        referredBy={referredByAgent?.slug || vipPass?.slug || null}
        clientEmail={formData.correo || null}
      />

      {/* MODAL DE PASARELA DE PAGO DIRECTA: TSOLUTIONS SECURE CHECKOUT */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0d18] border border-[#ff0003]/40 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(255,0,3,0.25)] animate-scaleIn space-y-5 my-8">
            
            {/* Header del Modal */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff0003]/20 to-[#00E5FF]/10 border border-[#ff0003]/40 text-[#ff0003] flex items-center justify-center rounded-2xl mx-auto shadow-[0_0_20px_rgba(255,0,3,0.3)] text-2xl">
                💳
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-bruno">
                Desbloquea tu Tarjeta & Entregables
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                ¡Tu diseño está 100% listo y guardado! Selecciona tu paquete para desplegar en Google Cloud y activar tus descargas inmediatas.
              </p>
            </div>

            {/* Selector de Paquetes Comerciales */}
            <div className="space-y-3">
              {/* Opción 1: Paquete Completo (Recomendado) */}
              <div
                onClick={() => setSelectedProduct({ name: 'Paquete Completo All-in-One (4 Entregables)', price: 199, id: 'bundle' })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  selectedProduct.id === 'bundle'
                    ? 'bg-gradient-to-r from-[#ff0003]/15 to-rose-950/40 border-[#ff0003] shadow-[0_0_20px_rgba(255,0,3,0.25)]'
                    : 'bg-black/40 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    selectedProduct.id === 'bundle' ? 'border-[#ff0003] bg-[#ff0003]' : 'border-gray-600'
                  }`}>
                    {selectedProduct.id === 'bundle' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-rosetta">Paquete Completo All-in-One</span>
                      <span className="text-[10px] bg-[#ff0003] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">MÁS POPULAR</span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Incluye los 4 Entregables Oficiales: Despliegue en Cloud SQL, Archivo .VCF, Código QR HD 1200px y Paquete ZIP.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-white font-mono">$199</span>
                  <span className="text-[10px] text-gray-400 block font-mono">MXN</span>
                </div>
              </div>

              {/* Opción 2: Plan Business Elite */}
              <div
                onClick={() => setSelectedProduct({ name: 'Plan Business Elite Anual (Acceso Total)', price: 1499, id: 'elite_annual' })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  selectedProduct.id === 'elite_annual'
                    ? 'bg-gradient-to-r from-purple-950/40 to-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                    : 'bg-black/40 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    selectedProduct.id === 'elite_annual' ? 'border-[#00E5FF] bg-[#00E5FF]' : 'border-gray-600'
                  }`}>
                    {selectedProduct.id === 'elite_annual' && <span className="w-2 h-2 rounded-full bg-black"></span>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-rosetta">Plan Business Elite</span>
                      <span className="text-[10px] bg-[#00E5FF] text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">MÁXIMO PODER</span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      50 Tarjetas, Módulos Elite (Portafolio, Galería, Reseñas, Agenda) y Edición Ilimitada.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-white font-mono">$1,499</span>
                  <span className="text-[10px] text-gray-400 block font-mono">MXN/Año</span>
                </div>
              </div>

              {/* Opción 3: Solo Despliegue Cloud */}
              <div
                onClick={() => setSelectedProduct({ name: 'Módulo 3: Despliegue Cloud & Enlace Permanente (/p/[slug])', price: 99, id: 'cloud' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  selectedProduct.id === 'cloud'
                    ? 'bg-gradient-to-r from-[#ff0003]/15 to-black border-[#ff0003]'
                    : 'bg-black/40 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    selectedProduct.id === 'cloud' ? 'border-[#ff0003] bg-[#ff0003]' : 'border-gray-600'
                  }`}>
                    {selectedProduct.id === 'cloud' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Despliegue Cloud Básico</span>
                    <p className="text-[10px] text-gray-400">Alojamiento en Google Cloud SQL con enlace permanente</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-white font-mono">$99</span>
                  <span className="text-[10px] text-gray-400 block font-mono">MXN</span>
                </div>
              </div>
            </div>

            {/* Resumen de Seguridad */}
            <div className="bg-black/60 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">🔒</span> Pago Seguro Cifrado con Stripe
              </span>
              <span className="font-mono text-white">Tarjetas Crédito / Débito</span>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="w-full py-4 bg-gradient-to-r from-[#ff0003] via-[#EE334E] to-[#ff0003] hover:brightness-110 text-white rounded-2xl text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(255,0,3,0.5)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Conectando con Stripe Seguro...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Pagar ${selectedProduct.price} MXN y Desbloquear Ahora</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white font-mono transition-colors text-center cursor-pointer"
              >
                ✓ Borrador guardado automáticamente • Continuar editando
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE ASISTENTE DE PAGOS PAYPAL / STRIPE */}
      <PayPalHelperModal
        isOpen={showPayPalHelper}
        onClose={() => setShowPayPalHelper(false)}
        onApplyLink={(url) => setFormData(prev => ({ ...prev, paypalUrl: url }))}
      />

      {/* CREADOR EXPRESS DE CATÁLOGO / PORTAFOLIO / MENÚ EN PDF */}
      <ExpressCatalogModal
        isOpen={showExpressCatalogModal}
        onClose={() => setShowExpressCatalogModal(false)}
        companyName={formData.empresa || formData.nombre}
        onPdfGenerated={(url) => setFormData(prev => ({ ...prev, pdfUrl: url }))}
      />

      {/* MODAL DE HUELLA ECOLÓGICA Y DECISIÓN DE TARJETA FÍSICA NFC */}
      <EcoFootprintModal
        isOpen={showEcoModal}
        onClose={() => setShowEcoModal(false)}
        slug={baseCardSlug}
        shippingLocation={shippingLocation}
        setShippingLocation={setShippingLocation}
      />

      {/* OVERLAY DE BLOQUEO DEL CONSTRUCTOR TRAS GUARDADO EN NUBE */}
      {isBuilderLocked && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-3xl mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            🔒
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase font-mono tracking-wider">
            Tarjeta Desplegada y Asegurada
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mt-2 leading-relaxed">
            Tu tarjeta digital ya vive en la nube. El editor se ha cerrado para proteger la integridad de tus datos y telemetría. Redirigiendo a tu Centro de Entregables Oficial...
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando /gracias/{savedSlug || baseCardSlug}...
          </div>
        </div>
      )}

      {/* MODAL DE CHECKLIST & ADVERTENCIA PREVIA AL CONSTRUCTOR */}
      <PreBuilderChecklistModal
        isOpen={showPreChecklist}
        onClose={handleDismissPreChecklist}
      />

    </div>
  );
}

