const fs = require('fs');

let code = fs.readFileSync('app/page.jsx', 'utf8');

// The image confirms:
// Meet Me: P-1VJ73284XP012835MNKQJDLI (already correct in code)
// Pro: P-9KP25231PY224692PNKQJG6Q (already correct in code)
// Elite: P-73J83679GV554154TNKQJFMQ (already correct in code)

// We need to fix Empresa:
code = code.replace('planId="P-9HE59487TV546734SNKQJEMQ"', 'planId="P-2PW08512L5046373DNKQI2EY"');

// We need to fix Marca Blanca:
code = code.replace('planId="PENDING_MARCA_BLANCA"', 'planId="P-64483344X0450694PNKQJQYI"');

fs.writeFileSync('app/page.jsx', code);
console.log('Fixed IDs from Image successfully.');
