import { getPool, initDb } from '../../../lib/db';
import { notFound, redirect } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pool = getPool();
  try {
    const res = await pool.query('SELECT nombre, apellido, empresa, puesto, nota FROM vcard_profiles WHERE slug = $1', [slug]);
    if (res.rows.length === 0) return { title: 'Perfil no encontrado - TSOLUTIONS IPIDD' };
    const p = res.rows[0];
    const name = `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.empresa || 'Contacto';
    return {
      title: `${name} | ${p.puesto || 'Tarjeta Digital'}`,
      description: p.nota || `Perfil digital y datos de contacto de ${name}`
    };
  } catch {
    return { title: 'vCard Profile - TSOLUTIONS IPIDD' };
  }
}

export default async function PublicProfilePage({ params }) {
  const { slug } = await params;
  await initDb();
  const pool = getPool();

  let profile = null;
  try {
    const res = await pool.query('SELECT * FROM vcard_profiles WHERE slug = $1', [slug]);
    if (res.rows.length === 0) {
      notFound();
    }
    profile = res.rows[0];

    // Incrementar contador de visitas en segundo plano
    pool.query('UPDATE vcard_profiles SET views_count = views_count + 1 WHERE id = $1', [profile.id]).catch(() => {});
  } catch (err) {
    console.error('Error fetching profile from Cloud SQL:', err);
    notFound();
  }

  // Si es modo Tap to Review y tiene URL de Google Maps, redirigir automáticamente
  if (profile.mode === 'review' && profile.google_maps_url) {
    redirect(profile.google_maps_url);
  }

  return <PublicProfileClient profile={profile} />;
}
