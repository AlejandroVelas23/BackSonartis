import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

console.log('Database Host:', process.env.DB_HOST); // Debería mostrar 'junction.proxy.rlwy.net'

const pool = new Pool({
  user: process.env.DB_USER,       // "postgres"
  host: process.env.DB_HOST,       // "junction.proxy.rlwy.net"
  database: process.env.DB_NAME,   // "railway"
  password: process.env.DB_PASSWORD, // tu contraseña de Railway
  port: process.env.DB_PORT,       // "50992"
});

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
