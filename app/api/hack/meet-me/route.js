import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/nextAuthOptions";
import { getPool } from "../../../../lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Debes iniciar sesión primero para usar el pase libre.' }, { status: 401 });
    }

    const pool = getPool();
    const client = await pool.connect();
    
    try {
      await client.query(
        'UPDATE users SET plan_id = $1 WHERE email = $2',
        ['meet_me', session.user.email]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: '¡Pase libre activado! Tu cuenta ha sido actualizada al plan Meet Me. Por favor, cierra sesión y vuelve a entrar para que los cambios surtan efecto en el panel.' 
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in hack route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
