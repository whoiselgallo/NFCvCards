const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://nfcards:_*p0C:dBr}h^(KaZ@35.238.255.28:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log(res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    client.end();
  });
