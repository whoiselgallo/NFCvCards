-- CRM independiente para contactos comerciales DENUE/INEGI y campañas.
-- Ejecutar en Google Cloud SQL PostgreSQL.

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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_campaigns (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  channel VARCHAR(40) NOT NULL DEFAULT 'email',
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_contact_campaigns (
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  campaign_id BIGINT NOT NULL REFERENCES crm_campaigns(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  contacted_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  PRIMARY KEY (contact_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS crm_consent_log (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  consent_type VARCHAR(40) NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  captured_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_crm_consent_contact ON crm_consent_log (contact_id, consent_type);
