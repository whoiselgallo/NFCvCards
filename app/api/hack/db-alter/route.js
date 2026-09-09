import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL
});

export async function GET() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN password_hash TEXT;');
    return NextResponse.json({ success: true, message: 'Column added' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
