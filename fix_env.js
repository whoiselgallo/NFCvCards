const fs = require('fs');
const files = ['.env', '.env.local'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Corregir NEXTAUTH_URL
    content = content.replace(/NEXTAUTH_URL=["']?VC\.TSOLUTIONSIPIDD\.COM["']?/gi, 'NEXTAUTH_URL="https://vc.tsolutionsipidd.com"');
    
    // Si tenían auth_secret en vez de nextauth_secret, lo renombramos también
    content = content.replace(/AUTH_SECRET=/g, 'NEXTAUTH_SECRET=');
    
    fs.writeFileSync(file, content);
    console.log('Corregido en ' + file);
  }
});
