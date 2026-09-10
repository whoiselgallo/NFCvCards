import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    const rawConnectionString = process.env.DATABASE_URL || '';
    // Limpiar 'sslmode' de la URL para evitar que el parser interno de 'pg' sobreescriba rejectUnauthorized: false
    const cleanConnectionString = rawConnectionString.replace(/[\?&]sslmode=[^&]+/g, '');

    pool = new Pool({
      connectionString: cleanConnectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }
  return pool;
}

// Inicializar esquema de la base de datos si no existe
export async function initDb() {
  const p = getPool();
  try {
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
        font_primary VARCHAR(100) DEFAULT 'Inter',
        font_secondary VARCHAR(100) DEFAULT 'Inter',
        color_primario VARCHAR(20) DEFAULT '#ff0003',
        color_secundario VARCHAR(20) DEFAULT '#00E5FF',
        color_cta VARCHAR(20) DEFAULT '#ff0003',
        logo_scale INT DEFAULT 100,
        cover_position_y INT DEFAULT 50,
        cover_zoom INT DEFAULT 100,
        logo_img TEXT,
        cover_photo TEXT,
        tags TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'active',
        views_count INT DEFAULT 0,
        
        -- Campos de Membresías & Módulos Elite
        plan_tier VARCHAR(50) DEFAULT 'free',
        custom_fields JSONB DEFAULT '[]'::jsonb,
        custom_layout JSONB DEFAULT '{"logoPosition":"center","infoBoxStyle":"floating","showBadges":true,"sectionsOrder":["contact","portfolio","calendar","gallery","marketing","reviews"]}'::jsonb,
        portfolio JSONB DEFAULT '[]'::jsonb,
        google_calendar_url TEXT DEFAULT '',
        gallery JSONB DEFAULT '[]'::jsonb,
        marketing_carousel JSONB DEFAULT '[]'::jsonb,
        customer_reviews JSONB DEFAULT '[]'::jsonb,
        analytics_clicks JSONB DEFAULT '{"vcf_downloads":0,"whatsapp_clicks":0,"call_clicks":0,"maps_clicks":0,"calendar_clicks":0,"social_clicks":0,"custom_clicks":0}'::jsonb,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS cover_position_y INT DEFAULT 50;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS cover_zoom INT DEFAULT 100;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS font_primary VARCHAR(100) DEFAULT 'Inter';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS font_secondary VARCHAR(100) DEFAULT 'Inter';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
      
      -- Nuevas columnas Elite & Módulos
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS plan_tier VARCHAR(50) DEFAULT 'free';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS custom_layout JSONB DEFAULT '{"logoPosition":"center","infoBoxStyle":"floating","showBadges":true,"sectionsOrder":["contact","portfolio","calendar","gallery","marketing","reviews"]}'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS portfolio JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS google_calendar_url TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS calendly_url TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS icloud_calendar_url TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS paypal_url TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS bank_details TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS pdf_url TEXT DEFAULT '';
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS marketing_carousel JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS customer_reviews JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS analytics_clicks JSONB DEFAULT '{"vcf_downloads":0,"whatsapp_clicks":0,"call_clicks":0,"maps_clicks":0,"calendar_clicks":0,"social_clicks":0,"custom_clicks":0}'::jsonb;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS referred_by VARCHAR(100);

            -- NextAuth Users
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        "emailVerified" TIMESTAMP WITH TIME ZONE,
        image TEXT,
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        plan_id VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'business', 'elite'
        card_limit INT DEFAULT 1,
        cards_created INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- NextAuth Accounts
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE (provider, "providerAccountId")
      );

      -- NextAuth Sessions
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL
      );

      -- NextAuth Verification Tokens
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        PRIMARY KEY (identifier, token)
      );

      -- Add user_id to vcard_profiles to link cards to users
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        profile_id INT REFERENCES vcard_profiles(id) ON DELETE CASCADE,
        profile_slug VARCHAR(100) NOT NULL,
        event_type VARCHAR(50) NOT NULL, -- 'view', 'vcf_download', 'whatsapp_click', 'call_click', 'maps_click', 'calendar_click', 'social_click'
        user_agent TEXT,
        device_type VARCHAR(50) DEFAULT 'mobile', -- 'ios', 'android', 'desktop'
        country VARCHAR(100) DEFAULT 'Desconocido',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Error during initDb execution:', err);
  }
}
