import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    const rawConnectionString = process.env.DATABASE_URL || '';
    // Limpiar 'sslmode' y 'channel_binding' de la URL para evitar que sobreescriban la configuración SSL de 'pg'
    const cleanConnectionString = rawConnectionString
      .replace(/[\?&](sslmode|channel_binding)=[^&]+/g, '')
      .replace(/\?&/, '?')
      .replace(/\?$/, '');

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
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS construction_feedback_completed BOOLEAN DEFAULT false;
      ALTER TABLE vcard_profiles ADD COLUMN IF NOT EXISTS usage_feedback_completed BOOLEAN DEFAULT false;

      -- Migración y actualización automática a Plan Elite de tarjetas existentes en base de datos
      UPDATE vcard_profiles SET plan_tier = 'elite' WHERE plan_tier = 'free' OR plan_tier IS NULL OR plan_tier = '';
      UPDATE vcard_profiles SET custom_layout = '{"logoPosition":"center","infoBoxStyle":"floating","showBadges":true,"sectionsOrder":["contact","portfolio","calendar","gallery","marketing","reviews"]}'::jsonb WHERE custom_layout IS NULL;
      UPDATE vcard_profiles SET custom_fields = '[]'::jsonb WHERE custom_fields IS NULL;
      UPDATE vcard_profiles SET portfolio = '[]'::jsonb WHERE portfolio IS NULL;
      UPDATE vcard_profiles SET gallery = '[]'::jsonb WHERE gallery IS NULL;
      UPDATE vcard_profiles SET marketing_carousel = '[]'::jsonb WHERE marketing_carousel IS NULL;
      UPDATE vcard_profiles SET customer_reviews = '[]'::jsonb WHERE customer_reviews IS NULL;

      -- Tabla de Feedback de Construcción & Experiencia de Uso (10 usos)
      CREATE TABLE IF NOT EXISTS card_feedback (
        id SERIAL PRIMARY KEY,
        profile_id INT REFERENCES vcard_profiles(id) ON DELETE SET NULL,
        profile_slug VARCHAR(255),
        referred_by VARCHAR(100),
        feedback_type VARCHAR(50) NOT NULL, -- 'construction' | 'usage_experience'
        ease_level VARCHAR(50),
        friendly_ui VARCHAR(50),
        fields_feedback JSONB DEFAULT '[]'::jsonb,
        issues_reported TEXT,
        recommendations TEXT,
        rating INT DEFAULT 5,
        nps_score INT,
        usage_highlights JSONB DEFAULT '[]'::jsonb,
        client_email VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS platform_access_config (
        id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        free_access_domains TEXT NOT NULL DEFAULT 'tsolutionsipidd.com',
        organization_card_limit INT NOT NULL DEFAULT 50 CHECK (organization_card_limit > 0),
        agent_free_pass_limit INT NOT NULL DEFAULT 250 CHECK (agent_free_pass_limit >= 0),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO platform_access_config (id)
      VALUES (1)
      ON CONFLICT (id) DO NOTHING;

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

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        profile_slug VARCHAR(100),
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        client_phone VARCHAR(50),
        plan_tier VARCHAR(50) DEFAULT 'elite',
        product_name VARCHAR(255) NOT NULL,
        product_type VARCHAR(50) DEFAULT 'digital_card', -- 'digital_card', 'cloud_hosting', 'physical_nfc_card', 'elite_bundle'
        amount NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
        currency VARCHAR(10) DEFAULT 'MXN',
        status VARCHAR(50) DEFAULT 'paid', -- 'paid', 'pending', 'shipped', 'delivered', 'refunded'
        payment_method VARCHAR(50) DEFAULT 'stripe',
        payment_id VARCHAR(255),
        shipping_address JSONB DEFAULT '{}'::jsonb,
        referred_by VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crm_contacts (
        id BIGSERIAL PRIMARY KEY,
        external_id VARCHAR(120),
        source VARCHAR(80) NOT NULL DEFAULT 'manual',
        company_name TEXT NOT NULL DEFAULT '',
        legal_name TEXT NOT NULL DEFAULT '',
        display_name TEXT NOT NULL DEFAULT '',
        industry TEXT NOT NULL DEFAULT '',
        phone_number VARCHAR(40) NOT NULL DEFAULT '',
        email VARCHAR(255) NOT NULL DEFAULT '',
        website TEXT NOT NULL DEFAULT '',
        street_address TEXT NOT NULL DEFAULT '',
        neighborhood TEXT NOT NULL DEFAULT '',
        city VARCHAR(120) NOT NULL DEFAULT '',
        state VARCHAR(120) NOT NULL DEFAULT '',
        postal_code VARCHAR(10) NOT NULL DEFAULT '',
        latitude NUMERIC(10, 7),
        longitude NUMERIC(10, 7),
        status VARCHAR(30) NOT NULL DEFAULT 'new',
        lead_score INT NOT NULL DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
        do_not_contact BOOLEAN NOT NULL DEFAULT false,
        notes TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (source, external_id)
      );

      CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts (LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_crm_contacts_phone ON crm_contacts (phone_number);
      CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts (status);
      CREATE INDEX IF NOT EXISTS idx_crm_contacts_location ON crm_contacts (state, city);

      CREATE TABLE IF NOT EXISTS crm_import_batches (
        id BIGSERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        source VARCHAR(80) NOT NULL DEFAULT 'DENUE_INEGI',
        imported_count INT NOT NULL DEFAULT 0,
        updated_count INT NOT NULL DEFAULT 0,
        rejected_count INT NOT NULL DEFAULT 0,
        errors JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crm_campaigns (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(180) NOT NULL,
        channel VARCHAR(40) NOT NULL DEFAULT 'email',
        status VARCHAR(30) NOT NULL DEFAULT 'draft',
        subject TEXT NOT NULL DEFAULT '',
        body TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crm_contact_campaigns (
        contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
        campaign_id BIGINT NOT NULL REFERENCES crm_campaigns(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL DEFAULT 'queued',
        contacted_at TIMESTAMP WITH TIME ZONE,
        responded_at TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (contact_id, campaign_id)
      );

      CREATE TABLE IF NOT EXISTS crm_consent_log (
        id BIGSERIAL PRIMARY KEY,
        contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
        consent_type VARCHAR(40) NOT NULL,
        source TEXT NOT NULL DEFAULT '',
        captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        revoked_at TIMESTAMP WITH TIME ZONE
      );

      CREATE INDEX IF NOT EXISTS idx_crm_consent_contact ON crm_consent_log (contact_id, consent_type);
    `);
  } catch (err) {
    console.error('Error during initDb execution:', err);
  }
}
