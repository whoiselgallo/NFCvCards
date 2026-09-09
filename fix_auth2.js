const fs = require('fs');

let code = fs.readFileSync('lib/nextAuthOptions.js', 'utf8');

const cryptoImports = `import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}
`;

code = cryptoImports + code;

const credsProvider = `CredentialsProvider({
      name: "Correo",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        let client;
        try {
          client = await pool.connect();
          try { await client.query('ALTER TABLE users ADD COLUMN password_hash TEXT;'); } catch(e){}
          const res = await client.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
          if (res.rows.length === 0) return null;
          const user = res.rows[0];
          if (!user.password_hash) return null; 
          const hashed = hashPassword(credentials.password);
          if (user.password_hash === hashed) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              plan_id: user.plan_id
            };
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        } finally {
          if (client) client.release();
        }
      }
    }),`;

code = code.replace('providers: [', 'providers: [\n    ' + credsProvider);

code = code.replace('async signIn({ user, account, profile }) {', 'async signIn({ user, account, profile }) {\n      if (account?.provider === "credentials") return true;');

fs.writeFileSync('lib/nextAuthOptions.js', code);
console.log('Fixed nextAuthOptions');
