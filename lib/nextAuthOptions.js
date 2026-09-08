import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AppleProvider from "next-auth/providers/apple";
import PostgresAdapter from "@auth/pg-adapter";
import { getPool } from "./db";

const pool = getPool();

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "test",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "test",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "test",
      clientSecret: process.env.GITHUB_SECRET || "test",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "test",
      clientSecret: process.env.APPLE_SECRET || "test",
    }),
    CredentialsProvider({
      name: "Email y Contraseña",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        if (credentials.password !== '000000') {
          throw new Error("Contraseña incorrecta. Usa 000000");
        }
        
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
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
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan_id = user.plan_id;
        token.stripe_customer_id = user.stripe_customer_id;
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
        session.user.stripe_customer_id = token.stripe_customer_id;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
