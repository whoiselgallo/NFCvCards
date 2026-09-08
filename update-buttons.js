const fs = require('fs');
let code = fs.readFileSync('app/login/page.jsx', 'utf8');

const regex = /<div className="grid grid-cols-3 gap-3">[\s\S]*?<\/form>/;
const replacement = \<div className="flex flex-col gap-3">
              <button 
                type="button" 
                onClick={() => signIn('google')} 
                className="relative overflow-hidden group flex items-center justify-center gap-3 py-3.5 bg-black/40 hover:bg-[#ff0003]/10 border border-white/10 hover:border-[#ff0003]/50 rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,3,0.3)]"
              >
                {/* Efecto Cyber Glare */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] group-hover:animate-[glare_1s_ease-in-out_infinite] -translate-x-[150%] group-hover:translate-x-[250%] transition-all"></div>
                
                <svg viewBox="0 0 48 48" className="w-5 h-5 z-10">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="text-sm font-bold text-white tracking-wide z-10 font-mono group-hover:text-[#ff0003] transition-colors">ACCESO SEGURO CON GOOGLE</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Definicion de animacion de Glare (resplandor ciber) */}
      <style dangerouslySetInnerHTML={{__html: \\\
        @keyframes glare {
          0% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(250%) skewX(-30deg); }
        }
      \\\}} />
    </div>
  );
}\;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('app/login/page.jsx', code);
  console.log('REEMPLAZO EXITOSO');
} else {
  console.log('NO SE ENCONTRO EL PATRON');
}
