import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/nextAuthOptions';
import { getPool, initDb } from '../../../../lib/db';
import { getPlatformAccessConfig, normalizeDomains } from '../../../../lib/accessConfig';

const ADMIN_EMAILS = new Set([
     'javier.gallardo@tsolutionsipidd.com',
     'whoiselgallo@gmail.com',
     'contacto@tsolutionsipidd.com',
     'admin@tsolutionsipidd.com'
]);

function isAdmin(session) {
     const email = session?.user?.email?.toLowerCase() || '';
     return ADMIN_EMAILS.has(email) || email.endsWith('@tsolutionsipidd.com');
}

async function requireAdmin() {
     const session = await getServerSession(authOptions);
     return isAdmin(session) ? session : null;
}

export async function GET() {
     try {
          if (!await requireAdmin()) {
               return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          }

          await initDb();
          const config = await getPlatformAccessConfig();
          return NextResponse.json({ success: true, config });
     } catch (error) {
          console.error('Error al cargar configuración de acceso:', error);
          return NextResponse.json({ success: false, error: 'No se pudo cargar la configuración' }, { status: 500 });
     }
}

export async function PUT(request) {
     try {
          if (!await requireAdmin()) {
               return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          }

          const body = await request.json();
          const freeDomains = normalizeDomains(body.freeDomains);
          const organizationCardLimit = Number(body.organizationCardLimit);
          const agentFreePassLimit = Number(body.agentFreePassLimit);

          if (!freeDomains.length) {
               return NextResponse.json({ success: false, error: 'Agrega al menos un dominio válido.' }, { status: 400 });
          }
          if (!Number.isInteger(organizationCardLimit) || organizationCardLimit < 1 || organizationCardLimit > 10000) {
               return NextResponse.json({ success: false, error: 'El límite Elite debe estar entre 1 y 10,000 tarjetas.' }, { status: 400 });
          }
          if (!Number.isInteger(agentFreePassLimit) || agentFreePassLimit < 0 || agentFreePassLimit > 10000) {
               return NextResponse.json({ success: false, error: 'El límite global de pases debe estar entre 0 y 10,000.' }, { status: 400 });
          }

          await initDb();
          const pool = getPool();
          await pool.query(`
      UPDATE platform_access_config
      SET free_access_domains = $1,
          organization_card_limit = $2,
          agent_free_pass_limit = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [freeDomains.join(','), organizationCardLimit, agentFreePassLimit]);

          const config = await getPlatformAccessConfig(pool);
          return NextResponse.json({ success: true, config });
     } catch (error) {
          console.error('Error al guardar configuración de acceso:', error);
          return NextResponse.json({ success: false, error: 'No se pudo guardar la configuración' }, { status: 500 });
     }
}
