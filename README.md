# 🌹 ROSE Card - Plataforma de Marca Blanca para Identidad Digital & NFC vCards

Sistema integral de **Marca Blanca (*White-Label*)** para el diseño, generación, gestión y despliegue de **Tarjetas de Presentación Digitales Inteligentes, Identidad Corporativa NFC y Códigos QR Dinámicos**.

Basado en la arquitectura desacoplada de [NFCvCards](https://github.com/whoiselgallo/NFCvCards) y optimizado para ser adaptado a cualquier empresa, agencia o cliente sin referencias al autor original.

---

## ✨ Características Principales

- 📇 **Generador Visual en Tiempo Real**: Crea tarjetas digitales interactivas con previsualización instantánea (Mobile-First).
- 📲 **Soporte NFC con 1 Toque**: Compatible con cualquier chip NFC estándar (**NTAG213, NTAG215, NTAG216**) para abrir la tarjeta sin apps adicionales.
- 💾 **Descarga Inteligente de Contactos (.vcf)**: Generación de archivos vCard 3.0 para guardar contactos en iOS (Apple Contacts) y Android (Google Contacts) con un solo clic.
- 🖼️ **Códigos QR de Alta Definición**: Descarga del código QR en formato PNG nítido listo para impresión en tarjetas físicas, volantes o firmas de correo.
- 📦 **Exportador de Paquetes de Entrega (.ZIP)**: Empaqueta automáticamente el archivo `.vcf`, el código `.png` y la **Carta de Instrucciones Oficial** personalizada para el cliente final.
- 🔒 **Panel Administrativo Multiusuario**:
  - Métricas en tiempo real: total de perfiles, vistas acumuladas, empresas registradas y estados de validación.
  - Gestión integral de perfiles (crear, editar en vivo, cambiar estado, eliminar).
  - Control de acceso por dominio corporativo o abierto.
- ⭐ **Modo "Tap to Review" (Google Maps)**: Redirección instantánea a la pantalla de 5 estrellas de Google Business al acercar el teléfono.
- 🎨 **Temas y Tipografías Dinámicas**: Soporte para temas Oscuro (*Cyber Modern*), Claro (*Clásico Corporativo*) y Minimalista, con inyección dinámica de fuentes desde Google Fonts.

---

## 🚀 Inicio Rápido

### 1. Prerrequisitos
- **Node.js** >= 18.x
- **PostgreSQL** (Local, Google Cloud SQL, Supabase, Neon, Railway, etc.)

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configura tus variables en `.env.local`:
```env
# Conexión a la base de datos PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/nfc_vcards

# Clave secreta para la sesión del panel administrativo
AUTH_SECRET=tu-clave-secreta-aleatoria-2026

# Restricción de dominios permitidos para el admin ('*' para todos, o lista de dominios)
ALLOWED_ADMIN_DOMAINS=*

# Datos públicos de tu marca (Sobrescriben brand.config.js)
NEXT_PUBLIC_BRAND_NAME=ROSE Card
NEXT_PUBLIC_COMPANY_NAME=ROSE Card Digital
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_EMAIL=contacto@rosecard.io
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
Abre en tu navegador [http://localhost:3000](http://localhost:3000).

---

## 🎨 Personalización de la Marca Blanca (*White-Label*)

Toda la identidad de la plataforma se controla desde un único archivo central: **`brand.config.js`**.

```javascript
const brandConfig = {
  // Identidad
  brandName: 'Mi Empresa Card',
  brandTagline: 'Identidad Digital NFC & vCard',
  brandHeading: {
    prefix: 'MI EMPRESA',
    highlight: 'CARD',
    suffix: 'ENGINE'
  },
  
  // Datos Corporativos
  companyName: 'Mi Empresa Digital S.A.',
  website: 'https://miempresa.com',
  supportEmail: 'contacto@miempresa.com',
  
  // Colores del Tema
  theme: {
    primaryColor: '#E11D48',
    secondaryColor: '#00E5FF',
    accentColor: '#F43F5E',
  },
  
  // Restricción de acceso para Administradores
  adminAuth: {
    allowedDomains: '*', // o '@miempresa.com,@agencia.com'
  }
};
```

---

## 📱 Cómo Grabar los Chips NFC para los Clientes

1. Descarga la aplicación gratuita **NFC Tools** en el smartphone ([iOS App Store](https://apps.apple.com/app/nfc-tools/id1252962749) / [Android Google Play](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc)).
2. Abre la app y dirígete a la pestaña **Escribir** (*Write*).
3. Selecciona **Agregar un registro** (*Add a record*) ➔ **URL / Enlace Web**.
4. Pega el enlace público del perfil del cliente (ej. `https://tu-dominio.com/p/nombre-empresa-12345`).
5. Presiona **Escribir** y acerca la tarjeta física o sticker con chip NFC al teléfono.
6. ¡Listo! Al tocar la tarjeta con cualquier smartphone compatible, abrirá directamente el perfil sin necesidad de instalar apps.

---

## 🌐 Despliegue en Producción

### Despliegue en Vercel
1. Conecta este repositorio en [Vercel](https://vercel.com).
2. Configura las **Environment Variables** (`DATABASE_URL`, `AUTH_SECRET`, `ALLOWED_ADMIN_DOMAINS`, `NEXT_PUBLIC_APP_URL`, etc.).
3. Haz clic en **Deploy**. El esquema de base de datos se inicializa automáticamente en la primera petición (`initDb`).

---

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT. Puedes usarlo comercialmente para tu propia agencia o clientes.
