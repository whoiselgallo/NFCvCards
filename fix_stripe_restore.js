const fs = require('fs');
let code = fs.readFileSync('app/page.jsx', 'utf8');

const getBtn = (id) => `<button onClick={() => handleCheckout('${id}')} className="w-full py-3 mt-3 rounded-xl bg-[#635BFF]/10 text-white font-bold hover:bg-[#635BFF] transition-all border border-[#635BFF]/30 text-sm flex items-center justify-center gap-2">Pagar con Tarjeta / Apple Pay</button>`;

code = code.replace(/(<PayPalButton planId="P-1VJ73284XP012835MNKQJDLI" \/>)/, '$1\n                ' + getBtn('meetme'));
code = code.replace(/(<PayPalButton planId="P-9KP25231PY224692PNKQJG6Q" \/>)/, '$1\n                ' + getBtn('pro'));
code = code.replace(/(<PayPalButton planId="P-2PW08512L5046373DNKQI2EY" \/>)/, '$1\n                ' + getBtn('business'));
code = code.replace(/(<PayPalButton planId="P-73J83679GV554154TNKQJFMQ" \/>)/, '$1\n                ' + getBtn('elite'));
code = code.replace(/(<PayPalButton planId="P-64483344X0450694PNKQJQYI" \/>)/, '$1\n                ' + getBtn('marcablanca'));

fs.writeFileSync('app/page.jsx', code);
console.log('Restored Stripe buttons');
