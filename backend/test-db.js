const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_P3Hwn6utXyNo@ep-silent-grass-amivqtlo-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'", (err, res) => {
  if (err) console.error(err);
  else console.log(res.rows);
  process.exit();
});
