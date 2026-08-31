import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { isCorporateEmail, verifyPassword, createSessionToken } from '../../../../../lib/auth';

export async function POST(request) {
  try {
    await initDb();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Correo corporativo y contraseña requeridos' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificación de dominio corporativo
    if (!isCorporateEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acceso restringido: Solo cuentas corporativas @tsolutionsipidd.com pueden ingresar al panel.'
        },
        { status: 403 }
      );
    }

    const pool = getPool();
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [cleanEmail]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas o usuario no registrado.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isValid = verifyPassword(password, user.password_hash, user.salt);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set('tsolutions_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en login de administrador:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
