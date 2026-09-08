const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

// Use string literals carefully
content = content.replace('backgroundColor: ${color_primario}15', 'backgroundColor: ' + '${color_primario}15'); // Already ok if exists
content = content.replace('backgroundColor: 15', 'backgroundColor: ${color_primario}15');
content = content.replace('backgroundColor: #4285F415', 'backgroundColor: \"#4285F415\"');
content = content.replace('backgroundColor: #FFFFFF15', 'backgroundColor: \"#FFFFFF15\"');
content = content.replace('backgroundColor: #10b98115', 'backgroundColor: \"#10b98115\"');
content = content.replace('backgroundColor: #8b5cf615', 'backgroundColor: \"#8b5cf615\"');

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
