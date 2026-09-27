import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = null;

  try {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const dbStart = Date.now();
      const res = await client.query('SELECT 1 AS alive, NOW() AS db_time');
      dbLatencyMs = Date.now() - dbStart;
      if (res.rows?.[0]?.alive === 1) {
        dbStatus = 'connected';
      }
    } finally {
      client.release();
    }
  } catch (err) {
    dbStatus = 'error: ' + (err.message || 'Error de conexión');
  }

  const isHealthy = dbStatus === 'connected';
  const totalResponseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      api: {
        status: 'online',
        responseTimeMs: totalResponseTimeMs
      }
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': isHealthy ? 'PASS' : 'FAIL'
      }
    }
  );
}
