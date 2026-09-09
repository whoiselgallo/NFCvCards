import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}
import GoogleProvider from "next-auth/providers/google";
import { getPool } from "./db";

const pool = getPool();

export const authOptions = {
  providers: [
    CredentialsProvider({
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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "FALTA_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "FALTA_CLIENT_SECRET",
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // 🚀 AQUÍ ESTÁ EL CALLBACK DE GOOGLE 🚀
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;
      if (account.provider === "google") {
        let client;
        try {
          client = await pool.connect();
          // Buscamos si el correo de Google ya existe en tu tabla
          const res = await client.query('SELECT * FROM users WHERE email = $1', [user.email]);
          
          if (res.rows.length > 0) {
            // Ya es cliente: le cargamos su plan actual
            user.id = res.rows[0].id.toString();
            user.plan_id = res.rows[0].plan_id;
          } else {
            // Es nuevo: lo registramos automáticamente en tu BD con plan 'free'
            const insertRes = await client.query(
              'INSERT INTO users (email, name, plan_id) VALUES ($1, $2, $3) RETURNING *',
              [user.email, user.name || user.email.split('@')[0], 'free']
            );
            user.id = insertRes.rows[0].id.toString();
            user.plan_id = insertRes.rows[0].plan_id;
          }
          return true; // Autorizamos la entrada
        } catch (error) {
          console.error("Error vinculando Google con la BD:", error);
          return false; // Bloqueamos si hay error en BD
        } finally {
          if (client) client.release();
        }
      }
      
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan_id = user.plan_id;
      }
      if (trigger === "update" && session?.plan_id) {
        token.plan_id = session.plan_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.plan_id = token.plan_id;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET || "secreto_de_emergencia_2026",
};
