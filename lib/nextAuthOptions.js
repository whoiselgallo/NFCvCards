import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Modo Pruebas (Sin Seguridad)",
      credentials: {
        email: { label: "Cualquier Email", type: "email" },
        password: { label: "Cualquier Contraseña", type: "password" }
      },
      async authorize(credentials) {
        return {
          id: "tester-999",
          email: credentials?.email || "prueba@tsolutions.com",
          name: "Usuario de Pruebas",
          plan_id: "free"
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
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
