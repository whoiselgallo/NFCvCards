const fs = require('fs');
let code = fs.readFileSync('app/page.jsx', 'utf8');

const regexes = [
  /<button onClick=\{\(\) => handleCheckout\('meetme'\)\}[\s\S]*?<\/button>/g,
  /<button onClick=\{\(\) => handleCheckout\('pro'\)\}[\s\S]*?<\/button>/g,
  /<button onClick=\{\(\) => handleCheckout\('business'\)\}[\s\S]*?<\/button>/g,
  /<button onClick=\{\(\) => handleCheckout\('elite'\)\}[\s\S]*?<\/button>/g,
  /<button onClick=\{\(\) => handleCheckout\('marcablanca'\)\}[\s\S]*?<\/button>/g
];

regexes.forEach(regex => {
  code = code.replace(regex, '');
});

fs.writeFileSync('app/page.jsx', code);
console.log('Removed old Stripe buttons');
