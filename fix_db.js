const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/DATABASE_URL=([^\n\r]+)/);
if(!match) {
  console.log('No DATABASE_URL found');
  process.exit(1);
}
let dbUrl = match[1].replace(/['"]/g, '');
dbUrl = dbUrl.split('?')[0]; // strip query params
const { Pool } = require('pg');
const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
pool.query('ALTER TABLE users ADD COLUMN password_hash TEXT;')
  .then(() => console.log('Added password_hash column'))
  .catch(e => console.log('Error:', e.message))
  .finally(() => pool.end());
