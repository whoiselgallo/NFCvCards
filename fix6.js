const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

const regex = /style=\{\{[\s\S]*?background: linear-gradient[\s\S]*?\}\}/g;
const replacement = `style={{
              background: \`linear-gradient(135deg, \${color_cta} 0%, #BE123C 100%)\`,
              boxShadow: \`0 8px 30px \${color_cta}60\`
            }}`;

content = content.replace(regex, replacement);
fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
