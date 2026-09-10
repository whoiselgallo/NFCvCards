import { getPool, initDb } from '../../../lib/db';
import DeliverablesClient from './DeliverablesClient';
import brandConfig from '../../../brand.config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Entrega Oficial de Identidad Digital | ${brandConfig.brandName}`,
    description: 'Descarga de entregables oficiales, ficha de contacto .VCF, código QR HD y suite de telemetría.'
  };
}

export default async function ThankYouDeliverablesPage({ params }) {
  const { slug } = await params;
  await initDb();
  const pool = getPool();

  let profile = null;
  try {
    const res = await pool.query('SELECT * FROM vcard_profiles WHERE slug = $1', [slug]);
    if (res.rows.length > 0) {
      profile = res.rows[0];
    }
  } catch (err) {
    console.error('Error fetching profile for thank you page:', err);
  }

  return <DeliverablesClient initialProfile={profile} slug={slug} />;
}
