import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

// Inicializar esquema de la base de datos si no existe
export async function initDb() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS vcard_profiles (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      mode VARCHAR(20) DEFAULT 'vcard',
      nombre VARCHAR(100),
      apellido VARCHAR(100),
      empresa VARCHAR(150),
      puesto VARCHAR(150),
      telefono VARCHAR(50),
      whatsapp VARCHAR(50),
      correo VARCHAR(150),
      url VARCHAR(255),
      linkedin VARCHAR(255),
      instagram VARCHAR(255),
      facebook VARCHAR(255),
      calle VARCHAR(255),
      ciudad VARCHAR(100),
      estado VARCHAR(100),
      cp VARCHAR(20),
      pais VARCHAR(100),
      nota TEXT,
      google_maps_url TEXT,
      video_youtube_url TEXT,
      theme VARCHAR(50) DEFAULT 'modern',
      font_family VARCHAR(100) DEFAULT 'Inter',
      color_primario VARCHAR(20) DEFAULT '#F97316',
      color_secundario VARCHAR(20) DEFAULT '#00E5FF',
      color_cta VARCHAR(20) DEFAULT '#F97316',
      logo_scale INT DEFAULT 100,
      logo_img TEXT,
      cover_photo TEXT,
      views_count INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
