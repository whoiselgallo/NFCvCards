const fs = require('fs');
let code = fs.readFileSync('app/login/page.jsx', 'utf8');
code = code.replace(/callbackUrl: '\/builder'/g, "callbackUrl: '/dashboard'");
fs.writeFileSync('app/login/page.jsx', code);
