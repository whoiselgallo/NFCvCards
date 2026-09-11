import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/nextAuthOptions";
import TwoFactorGuard from "./TwoFactorGuard";

export const metadata = {
  title: 'TSolutions | Mission Control',
  description: 'Panel de Administración Global',
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 🛡️ REGLA 1: EL CANDADO MAESTRO (Lista Blanca de Administradores)
  const allowedAdminEmails = [
    'javier.gallardo@tsolutionsipidd.com',
    'whoiselgallo@gmail.com',
    'contacto@tsolutionsipidd.com',
    'admin@tsolutionsipidd.com'
  ];

  const userEmail = session?.user?.email?.toLowerCase() || '';
  const isAuthorized = userEmail && (
    allowedAdminEmails.includes(userEmail) || 
    userEmail.endsWith('@tsolutionsipidd.com')
  );

  if (!session || !isAuthorized) {
    redirect('/api/auth/signin'); 
  }

  // 🛡️ REGLA 2: EL DOBLE FACTOR (2FA)
  // Renderiza el Guard 2FA, que internamente muestra {children} solo si el PIN es correcto
  return (
    <TwoFactorGuard email={session.user.email}>
      {children}
    </TwoFactorGuard>
  );
}
