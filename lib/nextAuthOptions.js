import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}
import GoogleProvider from "next-auth/providers/google";
import { getPool } from "./db";
import { getVipPass } from "./vipPasses";
import { isOrganizationEmail } from "./brand";
import { getPlatformAccessConfig, isEmailInDomains } from "./accessConfig";

const pool = getPool();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Correo",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
        passSlug: { label: "Pase VIP", type: "text" }
      },
      async authorize(credentials) {
        // Flujo 1: Acceso Directo por Pase Libre VIP Personalizado
        if (credentials?.passSlug) {
          const vip = getVipPass(credentials.passSlug);
          if (vip) {
            let client;
            try {
              client = await pool.connect();
              const existing = await client.query('SELECT * FROM users WHERE email = $1', [vip.email]);
              let user;
              if (existing.rows.length > 0) {
                user = existing.rows[0];
                await client.query(
                  "UPDATE users SET plan_id = 'elite', card_limit = 50, name = $1 WHERE id = $2",
                  [vip.name, user.id]
                );
              } else {
                const insertRes = await client.query(
                  "INSERT INTO users (name, email, plan_id, card_limit) VALUES ($1, $2, 'elite', 50) RETURNING *",
                  [vip.name, vip.email]
                );
                user = insertRes.rows[0];
              }
              return {
                id: user.id.toString(),
                name: vip.name,
                email: vip.email,
                plan_id: 'elite',
                card_limit: 50
              };
            } catch (error) {
              console.error("Error en DB al autenticar pase VIP:", error);
              return {
                id: 'vip-' + vip.slug,
                name: vip.name,
                email: vip.email,
                plan_id: 'elite',
                card_limit: 50
              };
            } finally {
              if (client) client.release();
            }
          }
          return null;
        }

        // Flujo 2: Login Convencional con Correo y Contraseña
        if (!credentials?.email || !credentials?.password) return null;
        let client;
        try {
          client = await pool.connect();
          const res = await client.query('SELECT * FROM app_users WHERE email = $1', [credentials.email]);
          if (res.rows.length === 0) return null;
          const user = res.rows[0];
          // Usuario existe pero fue creado con Google OAuth — no tiene contraseña local
          if (!user.password_hash || user.password_hash === 'google_oauth_user') throw new Error('NO_PASSWORD');
          const hashed = hashPassword(credentials.password);
          if (user.password_hash === hashed) {
            const accessConfig = await getPlatformAccessConfig(pool);
            const hasFreeDomain = isOrganizationEmail(user.email) || isEmailInDomains(user.email, accessConfig.freeDomains);
            const effectivePlan = hasFreeDomain ? 'elite' : (user.plan_id || 'free');
            const effectiveLimit = hasFreeDomain ? accessConfig.organizationCardLimit : (user.card_limit || 1);
            if (effectivePlan !== user.plan_id || effectiveLimit !== user.card_limit) {
              await client.query(`
                INSERT INTO user_profiles (user_id, name, plan_id, card_limit)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id) DO UPDATE SET plan_id = EXCLUDED.plan_id, card_limit = EXCLUDED.card_limit;
              `, [user.id, user.name, effectivePlan, effectiveLimit]);
            }
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              plan_id: effectivePlan,
              card_limit: effectiveLimit
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
          const accessConfig = await getPlatformAccessConfig(pool);
          // Buscamos si el usuario ya existe en la vista unificada app_users
          const res = await client.query('SELECT * FROM app_users WHERE email = $1', [user.email]);

          const hasFreeDomain = isOrganizationEmail(user.email) || isEmailInDomains(user.email, accessConfig.freeDomains);
          const targetPlan = hasFreeDomain ? 'elite' : 'free';
          const targetLimit = hasFreeDomain ? accessConfig.organizationCardLimit : 1;
          const targetRole = hasFreeDomain ? 'admin' : 'member';

          if (res.rows.length > 0) {
            // Ya es cliente: le cargamos su plan actual
            user.id = res.rows[0].id.toString();
            user.plan_id = hasFreeDomain ? 'elite' : res.rows[0].plan_id;
            user.name = res.rows[0].name || user.name || user.email.split('@')[0];

            await client.query(`
              INSERT INTO user_profiles (user_id, name, plan_id, card_limit, role)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (user_id) DO UPDATE SET
                plan_id = CASE WHEN $3 = 'elite' THEN 'elite' ELSE user_profiles.plan_id END,
                card_limit = CASE WHEN $4 > user_profiles.card_limit THEN $4 ELSE user_profiles.card_limit END,
                name = COALESCE(NULLIF(user_profiles.name, ''), EXCLUDED.name);
            `, [res.rows[0].id, user.name, targetPlan, targetLimit, targetRole]);
          } else {
            // Usuario nuevo de Google: insertar en users y en user_profiles
            const insertUser = await client.query(
              'INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP RETURNING id',
              [user.email, 'google_oauth_user']
            );
            const newUserId = insertUser.rows[0].id;
            const userName = user.name || user.email.split('@')[0];

            await client.query(
              'INSERT INTO user_profiles (user_id, name, plan_id, card_limit, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO NOTHING',
              [newUserId, userName, targetPlan, targetLimit, targetRole]
            );

            user.id = newUserId.toString();
            user.plan_id = targetPlan;
            user.name = userName;
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
        token.card_limit = user.card_limit;
      }
      if (trigger === "update" && session?.plan_id) {
        token.plan_id = session.plan_id;
        token.card_limit = session.card_limit;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.plan_id = token.plan_id;
        session.user.card_limit = token.card_limit;
      }
      return session;
    }
  },
  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET || "secreto_de_emergencia_2026",
};
