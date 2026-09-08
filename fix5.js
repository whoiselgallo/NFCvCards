const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

const badStyle = `            style={{
              background: linear-gradient(135deg,  0%, #BE123C 100%),
              boxShadow:  0 8px 30px 60
            }}`;

const badStyle2 = `            style={{
              background: linear-gradient(135deg, 0%, #BE123C 100%),
              boxShadow: 0 8px 30px 60
            }}`;

const goodStyle = `            style={{
              background: \`linear-gradient(135deg, \${color_cta} 0%, #BE123C 100%)\`,
              boxShadow: \`0 8px 30px \${color_cta}60\`
            }}`;

content = content.replace(badStyle, goodStyle);
content = content.replace(badStyle2, goodStyle);
fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
