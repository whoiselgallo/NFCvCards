import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { isCorporateEmail, hashPassword, createSessionToken } from '../../../../../lib/auth';

export async function POST(request) {
  try {
    await initDb();
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Correo corporativo y contraseña requeridos' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // VALIDACIÓN ESTRICTA: SOLO DOMINIO @tsolutionsipidd.com
    if (!isCorporateEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acceso denegado: El registro en el panel administrativo está reservado exclusivamente para cuentas corporativas @tsolutionsipidd.com'
        },
        { status: 403 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Verificar si ya existe el usuario
    const existing = await pool.query('SELECT id FROM admin_users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Este correo corporativo ya está registrado. Por favor inicia sesión.' },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);
    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash, salt, name, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id, email, name, role, created_at`,
      [cleanEmail, hash, salt, name?.trim() || 'Admin TSolutions']
    );

    const newUser = result.rows[0];
    const token = createSessionToken(newUser);

    const response = NextResponse.json({
      success: true,
      message: 'Administrador corporativo registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

    // Guardar cookie HTTP-Only segura
    response.cookies.set('tsolutions_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error al registrar administrador:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
