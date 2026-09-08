const fs = require('fs');
let content = fs.readFileSync('app/login/page.jsx', 'utf8');

// Replace invalid imports
content = content.replace('Github, Chrome', 'Globe');
content = content.replace('<Github className=\"w-5 h-5\" />', '<Globe className=\"w-5 h-5\" />');
content = content.replace('<Chrome className=\"w-5 h-5\" />', '<Globe className=\"w-5 h-5\" />');

fs.writeFileSync('app/login/page.jsx', content);
