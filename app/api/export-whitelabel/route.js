import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Solo permitir descargar a los usuarios con plan Elite
    if (!session || session.user?.plan_id !== 'elite') {
      return NextResponse.json({ error: 'Acceso Denegado. Solo cuentas Elite Plus pueden descargar el entregable Marca Blanca.' }, { status: 403 });
    }

    const zip = new JSZip();

    // 1. README Instrucciones
    zip.file('LEAME_INSTRUCCIONES.md', `# Plataforma Marca Blanca - Rose VCards (Elite Plus)

¡Bienvenido a tu nueva plataforma de Tarjetas Digitales!
Esta versión está lista para instalarse en tu ordenador o servidor y conectarse a la infraestructura global de TSolutions.

## Reglas del Servicio (Licencia Elite):
1. **Tarjetas Ilimitadas:** Puedes crear todas las tarjetas que desees.
2. **Personalización Absoluta:** Puedes cambiar el logo, colores y nombre de la marca editando el archivo \`brand.config.js\`.
3. **Mantenimiento en la Nube:** Tu plataforma se conecta a los servidores de Google Cloud de TSolutions. Se generará un cargo de mantenimiento mensual automático por cada perfil activo que alojes en nuestra nube segura.

## Instrucciones de Instalación:
### En Windows:
Haz doble clic en \`instalar_windows.bat\`. Esto descargará el cliente, instalará las dependencias e iniciará el servidor local.

### En Mac/Linux:
Abre tu terminal, navega a esta carpeta y ejecuta:
\`bash instalar_mac_linux.sh\`
`);

    // 2. brand.config.js Template
    zip.file('brand.config.js', `// Configuración de tu Agencia
export default {
  brandName: "Tu Marca Aquí",
  brandTagline: "Tarjetas Inteligentes NFC",
  brandDescription: "Plataforma de Networking impulsada por TSolutions",
  assets: {
    logo: "/logo.png",
    favicon: "/favicon.png"
  },
  colors: {
    primary: "#000000",
    secondary: "#FFFFFF"
  },
  // API Core de TSolutions
  apiEndpoint: process.env.NEXT_PUBLIC_ROSECARD_API_URL || "https://api.rosecard.io"
};
`);

    // 3. Script Windows (.bat)
    zip.file('instalar_windows.bat', `@echo off
echo ===================================================
echo Iniciando Instalador Marca Blanca - Rose VCards API
echo ===================================================
echo.
echo Paso 1: Clonando el motor cliente frontend...
git clone https://github.com/whoiselgallo/NFCvCards-Client-Core.git whitelabel-app
cd whitelabel-app
echo.
echo Paso 2: Copiando tu configuracion de marca...
copy ..\\brand.config.js .\\brand.config.js
echo NEXT_PUBLIC_ROSECARD_API_URL=https://api.rosecard.io > .env
echo.
echo Paso 3: Instalando dependencias (Requiere Node.js)...
npm install
echo.
echo ===================================================
echo ¡Listo! Iniciando Servidor en http://localhost:3000
echo ===================================================
npm run dev
pause
`);

    // 4. Script Mac/Linux (.sh)
    zip.file('instalar_mac_linux.sh', `#!/bin/bash
echo "==================================================="
echo "Iniciando Instalador Marca Blanca - Rose VCards API"
echo "==================================================="
echo ""
echo "Paso 1: Clonando el motor cliente frontend..."
git clone https://github.com/whoiselgallo/NFCvCards-Client-Core.git whitelabel-app
cd whitelabel-app
echo ""
echo "Paso 2: Copiando tu configuracion de marca..."
cp ../brand.config.js ./brand.config.js
echo "NEXT_PUBLIC_ROSECARD_API_URL=https://api.rosecard.io" > .env
echo ""
echo "Paso 3: Instalando dependencias (Requiere Node.js)..."
npm install
echo ""
echo "==================================================="
echo "¡Listo! Iniciando Servidor en http://localhost:3000"
echo "==================================================="
npm run dev
`);

    // Generar el Buffer del ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="plataforma_marca_blanca.zip"'
      }
    });

  } catch (error) {
    console.error('Error generando zip de Marca Blanca:', error);
    return NextResponse.json({ error: 'Fallo al generar empaquetado.' }, { status: 500 });
  }
}
