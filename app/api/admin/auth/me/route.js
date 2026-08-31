import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../../lib/auth';

export async function GET(request) {
  const token = request.cookies.get('tsolutions_admin_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role
    }
  });
}
