import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { getPool } from "../../../../lib/db";

const pool = getPool();

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "test-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "test-client-secret",
    }),
    CredentialsProvider({
      name: "Email y Contraseña",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // En un entorno de produccion, aqui se verifica el password_hash
        // Por ahora, simularemos un login automatico para el demo local
        // Si el usuario existe, lo retorna, sino lo crea (mock basico)
        if (!credentials?.email) return null;
        
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            // Auto-create for testing
            const insertResult = await client.query(
              'INSERT INTO users (email, name, plan_id) VALUES ($1, $2, $3) RETURNING *',
              [credentials.email, credentials.email.split('@')[0], 'free']
            );
            return insertResult.rows[0];
          }
        } finally {
          client.release();
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan_id = user.plan_id;
        token.stripe_customer_id = user.stripe_customer_id;
      }
      
      // Update token if session is updated (e.g. after a webhook triggers plan change)
      if (trigger === "update" && session?.plan_id) {
        token.plan_id = session.plan_id;
      }

      // Re-fetch user plan_id from db to ensure token is always fresh
      if (token.id) {
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT plan_id FROM users WHERE id = $1', [token.id]);
          if (result.rows.length > 0) {
            token.plan_id = result.rows[0].plan_id;
          }
        } finally {
          client.release();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.plan_id = token.plan_id;
        session.user.stripe_customer_id = token.stripe_customer_id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // We will build a custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
