const fs = require('fs');
let code = fs.readFileSync('app/builder/page.jsx', 'utf8');

const startStr = '{showCheckoutModal && (';
const startIdx = code.indexOf(startStr);

if (startIdx !== -1) {
  let endIdx = -1;
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = startIdx; i < code.length; i++) {
    const char = code[i];
    
    if ((char === "'" || char === '"' || char === "`") && code[i-1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }
  
  if (endIdx !== -1) {
    const newModal = `{showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c16] border border-rose-600/30 w-full max-w-sm rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(255,0,3,0.15)] animate-scaleIn">
            <div className="w-16 h-16 bg-rose-600/10 border border-rose-600/20 text-[#ff0003] flex items-center justify-center rounded-full mx-auto mb-4 text-2xl">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-bruno">Módulo Bloqueado</h3>
            <p className="text-sm text-gray-400 mb-6 font-mono">
              Esta función no está incluida en tu paquete actual. Los bloqueos visuales protegen las características exclusivas de los paquetes superiores.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}`;
      
    code = code.substring(0, startIdx) + newModal + code.substring(endIdx);
    
    // Also strip the "100% GRATIS ($0)" text from the shipping options to hide ALL prices.
    code = code.replace(/<span className="text-\[10px\] text-green-400">100% GRATIS \(\$0\)<\/span>/g, '');

    fs.writeFileSync('app/builder/page.jsx', code);
    console.log('REEMPLAZO EXITOSO');
  }
}
