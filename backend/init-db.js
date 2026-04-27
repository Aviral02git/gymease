const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_P3Hwn6utXyNo@ep-silent-grass-amivqtlo-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        gym_id VARCHAR(255) NOT NULL,
        gym_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_name VARCHAR(255),
        slot VARCHAR(255) NOT NULL,
        visit_date VARCHAR(255),
        fee_amount NUMERIC,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_plans (
        user_email VARCHAR(255) PRIMARY KEY,
        tier VARCHAR(50) NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS workout_logs (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        type VARCHAR(255),
        duration INTEGER,
        notes TEXT,
        gym_name VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
}

initDB();
