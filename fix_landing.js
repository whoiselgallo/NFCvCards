const fs = require('fs');
let code = fs.readFileSync('app/page.jsx', 'utf8');

// Fix empty email
code = code.replace(/body: JSON\.stringify\(\{ planId, userEmail: '' \}\)/g, 'body: JSON.stringify({ planId })');

// Change Marca Blanca link to button
code = code.replace(
  /<Link href="\/terminos" className="block text-center/g, 
  '<button onClick={() => handleCheckout(\'marcablanca\')} className="w-full text-center'
);
code = code.replace(/Ver Detalles\s+<\/Link>/g, 'Contratar Marca Blanca\n                </button>');

// Change 'elite' to Contratar Elite (currently says Contactar Ventas)
code = code.replace(
  /onClick=\{\(\) => handleCheckout\('elite'\)\}.+>\s+Contactar Ventas/g,
  'onClick={() => handleCheckout(\'elite\')} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#EE334E] text-white font-bold hover:opacity-90 transition-opacity">\n                  Contratar Elite'
);

fs.writeFileSync('app/page.jsx', code);
