const fs = require('fs');

let code = fs.readFileSync('app/builder/page.jsx', 'utf8');

// 1. TIER LOGIC
// Currently it is:
// const userPlan = session?.user?.plan_id || 'free';
// const isPremium = userPlan === 'business' || userPlan === 'elite';
// const isPro = userPlan === 'pro' || isPremium;

const newTierLogic = `
  const userPlan = session?.user?.plan_id || 'free';
  
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
`;

code = code.replace(
  /const userPlan = session\?.user\?.plan_id \|\| 'free';\s*const isPremium = userPlan === 'business' \|\| userPlan === 'elite';\s*const isPro = userPlan === 'pro' \|\| isPremium;/g,
  newTierLogic
);

// 2. Fix Themes Logic
// Old: const isLocked = (!isPro && index >= 2) || (!isPremium && index >= 5);
// New: Meet Me / Estudiante gets ALL themes (as per description "Todos los Temas desbloqueados")
// Wait, if Meet Me gets all themes, then tier >= 1 unlocks all themes!
code = code.replace(
  /const isLocked = \(!isPro && index >= 2\) \|\| \(!isPremium && index >= 5\);/g,
  `const isLocked = tier < 1 && index >= 2; // Tier 1+ has all themes unlocked`
);

// 3. Downloads (Remove COMPRAR PAQUETE ($199 MXN) and just make it Descargar)
// The user says "elimina los costos en las descargas individuales, ya estan en los paquetes cada descarga de entregable incluido"
// We will just change the text of the buttons.
code = code.replace(/\{isPaid \|\| unlockedItems\.bundle \? 'DESCARGAR PAQUETE COMPLETO \(\.ZIP\)' : 'COMPRAR PAQUETE COMPLETO \(\$199 MXN\)'\}/g, `'DESCARGAR PAQUETE COMPLETO (.ZIP)'`);
code = code.replace(/\{isPaid \|\| unlockedItems\.qr \|\| unlockedItems\.bundle \? 'Descargar QR \(\.PNG\)' : 'Comprar QR \(\$69 MXN\)'\}/g, `'Descargar QR (.PNG)'`);
code = code.replace(/\{isPaid \|\| unlockedItems\.vcf \|\| unlockedItems\.bundle \? 'Descargar \.VCF' : 'Comprar \.VCF \(\$69 MXN\)'\}/g, `'Descargar .VCF'`);

code = code.replace(/\{isPaid \|\| unlockedItems\.bundle \? '🔓' : '🔒'\}/g, `'⬇️'`);
code = code.replace(/\{isPaid \|\| unlockedItems\.qr \|\| unlockedItems\.bundle \? '🔲' : '🔒'\}/g, `'🔲'`);
code = code.replace(/\{isPaid \|\| unlockedItems\.vcf \|\| unlockedItems\.bundle \? '📇' : '🔒'\}/g, `'📇'`);


// Let's also remove `onClick={() => !isPaid && !unlockedItems.bundle && handleModuleLocked('bundle')}`
// from the download buttons so they just call the download function instead of blocking.
code = code.replace(/onClick=\{.*?handleModuleLocked\('bundle'\).*?\}/g, "onClick={downloadFullPackage}");
code = code.replace(/onClick=\{.*?handleModuleLocked\('qr'\).*?\}/g, "onClick={downloadQR}");
code = code.replace(/onClick=\{.*?handleModuleLocked\('vcf'\).*?\}/g, "onClick={downloadVCF}");

// 4. Integrations (PayPal, Google Calendar) - Change text inputs to buttons
// Look for Calendly, Google Calendar, and PayPal inputs.
const calendarInputRegex = /<input[^>]*placeholder="Ej: https:\/\/calendly\.com\/.*?"[^>]*>/g;
const paypalInputRegex = /<input[^>]*placeholder="Ej: https:\/\/paypal\.me\/.*?"[^>]*>/g;

// We will replace them with buttons that simulate linking, or just prompt them.
const calendarBtn = `
  <div className="flex flex-col gap-2">
    <button type="button" onClick={() => alert('Para conectar tu calendario al instante, primero necesitas configurar las credenciales API de Google/Calendly en tu panel de administrador. Esta función estará lista en la próxima actualización.')} className="px-4 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
      Vincular Google Calendar
    </button>
    <button type="button" onClick={() => alert('Para conectar tu calendario al instante, primero necesitas configurar las credenciales API de Google/Calendly en tu panel de administrador. Esta función estará lista en la próxima actualización.')} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
      Vincular Calendly
    </button>
  </div>
`;

const paypalBtn = `
  <button type="button" onClick={() => alert('Para permitir cobros directos al instante, necesitamos conectar tu cuenta de PayPal Developer (Client ID y Secret). Lo configuraremos en la próxima fase.')} className="w-full px-4 py-3 bg-[#003087] hover:bg-[#001C64] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
    Iniciar Sesión con PayPal
  </button>
`;

// Replace inputs
code = code.replace(calendarInputRegex, calendarBtn);
code = code.replace(paypalInputRegex, paypalBtn);

// Save
fs.writeFileSync('app/builder/page.jsx', code);
console.log('Builder modifications applied successfully!');
