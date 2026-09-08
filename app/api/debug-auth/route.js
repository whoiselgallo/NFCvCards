import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export async function GET() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    const res = await client.query('SELECT 1 as test');
    client.release();
    return NextResponse.json({ 
      success: true, 
      db: !!process.env.DATABASE_URL,
      googleId: !!process.env.GOOGLE_CLIENT_ID,
      nextauthUrl: process.env.NEXTAUTH_URL
    });
  } catch (err) {
    return NextResponse.json({ 
      error: err.message, 
      stack: err.stack, 
      db: !!process.env.DATABASE_URL 
    }, { status: 500 });
  }
}
