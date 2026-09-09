const fs = require('fs');
let code = fs.readFileSync('app/page.jsx', 'utf8');
code = code.replace(
  '<Link href="/terminos" className="hover:text-white transition-colors">Aviso de Privacidad</Link>',
  '<Link href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>'
);
fs.writeFileSync('app/page.jsx', code);
console.log('Fixed Privacy link');
