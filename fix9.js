const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

const regex = /style=\{\{\s*background: \`linear-gradient[^\}]*\}\}/g;
const regex2 = /style=\{\{\s*background: linear-gradient[^\}]*\}\}/g;

const repl = `style={{
              background: \`linear-gradient(135deg, \${color_cta} 0%, #BE123C 100%)\`,
              boxShadow: \`0 8px 30px \${color_cta}60\`
            }}`;

content = content.replace(regex, repl);
content = content.replace(regex2, repl);

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
