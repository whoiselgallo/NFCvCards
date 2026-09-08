import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import TwoFactorGuard from "./TwoFactorGuard";

export const metadata = {
  title: 'TSolutions | Mission Control',
  description: 'Panel de Administración Global',
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 🛡️ REGLA 1: EL CANDADO MAESTRO (Lista Blanca)
  // Si no hay sesión o el correo NO es el tuyo, expulsa al usuario al login
  if (!session || session.user?.email !== 'javier.gallardo@tsolutionsipidd.com') {
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
