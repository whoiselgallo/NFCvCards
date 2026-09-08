const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

const badPart = 'background: linear-gradient(135deg,  0%, #BE123C 100%)';
const goodPart = 'background: `linear-gradient(135deg, ${color_cta} 0%, #BE123C 100%)`';

const badPart2 = 'boxShadow:   8px 30px 60';
const goodPart2 = 'boxShadow: `0 8px 30px ${color_cta}60`';

content = content.replace(badPart, goodPart);
content = content.replace(badPart2, goodPart2);
content = content.replace(badPart, goodPart);
content = content.replace(badPart2, goodPart2);

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
