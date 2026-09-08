const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');
content = content.replace('backgroundColor:  15 ', 'backgroundColor: ' + '${color_primario}15');
fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
