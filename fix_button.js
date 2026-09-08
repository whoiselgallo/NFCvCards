const fs = require('fs');
let content = fs.readFileSync('app/builder/page.jsx', 'utf8');

content = content.replace('const { data: session, status } = useSession();', 'const { data: session, status, update } = useSession();');

const newFunc = `
  const handleFreePass = async () => {
    try {
      const res = await fetch('/api/hack/meet-me');
      const data = await res.json();
      if(data.success) {
        await update(); 
        alert('¡Pase Libre Activado! Ya tienes los beneficios del plan Meet Me.');
        window.location.reload();
      } else {
        alert('Error: ' + data.error);
      }
    } catch(err) {
      alert('Error activando pase libre');
    }
  };
`;

content = content.replace('useEffect(() => {', newFunc + '\n  useEffect(() => {');

const buttonCode = `
          {!isPremium && userPlan !== 'meet_me' && (
            <button 
              onClick={handleFreePass}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all active:scale-95"
            >
              🎁 Usar Pase Libre Meet Me
            </button>
          )}
`;

content = content.replace('{/* CONTROLES DE CABECERA: SELECTOR DE MODO, IDIOMA & ENLACE ADMIN */}', '{/* CONTROLES DE CABECERA: SELECTOR DE MODO, IDIOMA & ENLACE ADMIN */}\n' + buttonCode);

fs.writeFileSync('app/builder/page.jsx', content);
