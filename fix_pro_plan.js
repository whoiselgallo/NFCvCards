const fs = require('fs');

let code = fs.readFileSync('app/page.jsx', 'utf8');

// I need to replace the old Pro ID (P-1VJ73284XP012835MNKQJDLI) with the new one (P-9KP25231PY224692PNKQJG6Q)
code = code.replace('planId="P-1VJ73284XP012835MNKQJDLI"', 'planId="P-9KP25231PY224692PNKQJG6Q"');

// The Marca Blanca package currently has the new Pro ID because it was the 5th ID sent.
// Let's find the LAST instance of 'planId="P-9KP25231PY224692PNKQJG6Q"' and remove it or set it to 'PENDING_MARCA_BLANCA'
const lastIndex = code.lastIndexOf('planId="P-9KP25231PY224692PNKQJG6Q"');
if (lastIndex !== -1) {
    code = code.substring(0, lastIndex) + 'planId="PENDING_MARCA_BLANCA"' + code.substring(lastIndex + 'planId="P-9KP25231PY224692PNKQJG6Q"'.length);
}

fs.writeFileSync('app/page.jsx', code);
console.log('Fixed Professional plan ID successfully.');
