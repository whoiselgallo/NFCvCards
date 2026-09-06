const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Cargar variables de .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

async function runSeed() {
  const rawConnectionString = process.env.DATABASE_URL || '';
  const cleanConnectionString = rawConnectionString.replace(/[\?&]sslmode=[^&]+/g, '');

  console.log('🔌 Conectando a Google Cloud SQL...');
  const pool = new Pool({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const sqlPath = path.join(__dirname, 'local', 'seed_iron_anchor.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    console.log('🚀 Ejecutando migración de perfiles para Iron & Anchor Barber Co...');
    await pool.query(sqlContent);

    console.log('✅ ¡Los 6 perfiles de Iron & Anchor Barber Co. fueron creados/actualizados exitosamente en PostgreSQL Cloud SQL!');

    const res = await pool.query(`
      SELECT id, slug, nombre, apellido, puesto, tags, status, updated_at
      FROM vcard_profiles
      WHERE slug LIKE '%iron-anchor%'
      ORDER BY id ASC;
    `);

    console.log('\n📋 Registros verificados en Base de Datos:');
    console.table(res.rows);

  } catch (err) {
    console.error('❌ Error al ejecutar el seed:', err);
  } finally {
    await pool.end();
  }
}

runSeed();
