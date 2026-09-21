const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const { Pool } = require('pg');

function readEnv() {
     const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
     const content = fs.readFileSync(envPath, 'utf8');
     const match = content.match(/^DATABASE_URL=(.*)$/m);
     if (!match) throw new Error(`DATABASE_URL no encontrado en ${envPath}`);
     return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function hashLoginPassword(password) {
     return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}

function hashAdminPassword(password) {
     const salt = crypto.randomBytes(16).toString('hex');
     const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
     return { salt, hash };
}

function askPassword() {
     return new Promise((resolve) => {
          const input = readline.createInterface({ input: process.stdin, output: process.stdout });
          input.question('Escribe la contraseña nueva de Javier: ', (answer) => {
               input.close();
               resolve(answer);
          });
     });
}

async function run() {
     const password = await askPassword();
     if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

     const pool = new Pool({ connectionString: readEnv(), ssl: { rejectUnauthorized: false } });
     const client = await pool.connect();
     const email = 'javier.gallardo@tsolutionsipidd.com';

     try {
          await client.query('BEGIN');

          await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
          await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');

          const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
          let userId;
          if (existing.rows.length > 0) {
               userId = existing.rows[0].id;
               await client.query(
                    `UPDATE users
         SET name = $1, password_hash = $2, plan_id = 'elite', card_limit = 50, is_active = true
         WHERE id = $3`,
                    ['Javier Gallardo', hashLoginPassword(password), userId]
               );
          } else {
               const inserted = await client.query(
                    `INSERT INTO users (name, email, password_hash, plan_id, card_limit, is_active)
         VALUES ($1, $2, $3, 'elite', 50, true)
         RETURNING id`,
                    ['Javier Gallardo', email, hashLoginPassword(password)]
               );
               userId = inserted.rows[0].id;
          }

          // Preserve business data before removing other login identities.
          await client.query('UPDATE vcard_profiles SET user_id = NULL WHERE user_id <> $1', [userId]);
          await client.query('DELETE FROM password_reset_tokens WHERE user_id <> $1', [userId]).catch(() => { });
          await client.query('DELETE FROM accounts WHERE "userId" <> $1', [userId]);
          await client.query('DELETE FROM sessions WHERE "userId" <> $1', [userId]);
          await client.query('DELETE FROM users WHERE id <> $1', [userId]);
          await client.query('DELETE FROM admin_users WHERE email <> $1', [email]);

          const adminPassword = hashAdminPassword(password);
          const admin = await client.query('SELECT id FROM admin_users WHERE email = $1', [email]);
          if (admin.rows.length > 0) {
               await client.query(
                    'UPDATE admin_users SET password_hash = $1, salt = $2, name = $3, role = $4 WHERE email = $5',
                    [adminPassword.hash, adminPassword.salt, 'Javier Gallardo', 'admin', email]
               );
          } else {
               await client.query(
                    `INSERT INTO admin_users (email, password_hash, salt, name, role)
         VALUES ($1, $2, $3, $4, 'admin')`,
                    [email, adminPassword.hash, adminPassword.salt, 'Javier Gallardo']
               );
          }

          await client.query('COMMIT');
          console.log('Cuenta de Javier configurada y cuentas de autenticación anteriores eliminadas.');
          console.log('Perfiles y tarjetas de negocio fueron conservados.');
     } catch (error) {
          await client.query('ROLLBACK');
          throw error;
     } finally {
          client.release();
          await pool.end();
     }
}

run().catch((error) => {
     console.error('No se pudo completar la operación:', error.message);
     process.exitCode = 1;
});