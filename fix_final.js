const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

// 1. Fix icons
content = content.replace('Facebook, Instagram, Linkedin', 'MessageCircle, Camera, Briefcase');
content = content.replace(/<Facebook/g, '<MessageCircle');
content = content.replace(/<Instagram/g, '<Camera');
content = content.replace(/<Linkedin/g, '<Briefcase');

// 2. Remove the duplicate google_calendar_url = ''
const duplicateLine = '    google_calendar_url = \'\',\n    gallery = [],';
content = content.replace(duplicateLine, '    gallery = [],');

// 3. Fix the Wallet Button background syntax which was messed up by PowerShell previously
const regex = /style=\{\{\n\s*background: \`linear-gradient\(135deg, \$\{color_cta\} 0%, #BE123C 100%\)\`,\n\s*boxShadow: \`0 8px 30px \$\{color_cta\}60\`\n\s*\}\}/g;
// Actually I don't need to fix the Wallet Button because in HEAD it is already fixed! Wait, in HEAD (27a583d) it was NOT fixed!
// In 27a583d, it had the spaces or broken template strings. Let me just replace the entire style block for the button.
const badWalletStyle = /style=\{\{\s*background: linear-gradient\(135deg,\s*0%,\s*#BE123C 100%\)[\s\S]*?\}\}/g;
const badWalletStyle2 = /style=\{\{\s*background: `linear-gradient\(135deg,\s*\$\{color_cta\}\s*0%,\s*#BE123C 100%\)`,\s*boxShadow:\s*8px 30px 60\s*\}\}/g;

const goodWalletStyle = `style={{
              background: \`linear-gradient(135deg, \${color_cta} 0%, #BE123C 100%)\`,
              boxShadow: \`0 8px 30px \${color_cta}60\`
            }}`;

content = content.replace(badWalletStyle, goodWalletStyle);
content = content.replace(badWalletStyle2, goodWalletStyle);

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
