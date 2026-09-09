const fs = require('fs');
let code = fs.readFileSync('lib/nextAuthOptions.js', 'utf8');

code = code.replace(/import CredentialsProvider from "next-auth\/providers\/credentials";\n?/, '');

const newProviders = `providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "FALTA_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "FALTA_CLIENT_SECRET",
    })
  ]`;

// Using regex to replace the providers array
code = code.replace(/providers:\s*\[[\s\S]*?\}\)\n\s*\]/, newProviders);

// Also remove `return true; // Autoriza el login por contraseña de prueba`
code = code.replace(/return true; \/\/ Autoriza el login por contraseña de prueba/g, '');

fs.writeFileSync('lib/nextAuthOptions.js', code);
