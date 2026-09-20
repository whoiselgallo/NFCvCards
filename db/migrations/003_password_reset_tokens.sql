-- Tabla para tokens de recuperación de contraseña
-- Ejecutar una sola vez en Google Cloud SQL (PostgreSQL)

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Índice para búsqueda por token (la API consulta por token, no por user_id)
CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens (token);

-- Comentario
COMMENT ON TABLE password_reset_tokens IS 'Tokens temporales de recuperación de contraseña — expiran a los 30 minutos.';
