const fs = require('fs');

let code = fs.readFileSync('app/page.jsx', 'utf8');
code = code.replace('planId="P-2PW08512L5046373DNKQI2EY"', 'planId="P-1VJ73284XP012835MNKQJDLI"');
fs.writeFileSync('app/page.jsx', code);
console.log('Meet Me ID updated.');
