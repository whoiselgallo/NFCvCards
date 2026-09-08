const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

content = content.replace(/boxShadow:\s+8px 30px 60/g, 'boxShadow: `0 8px 30px ${color_cta}60`');

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
