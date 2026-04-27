const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to NeonDB PostgreSQL');
    client.release();
  } catch (err) {
    console.error('❌ NeonDB connection error:', err.stack);
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connectDB
};
