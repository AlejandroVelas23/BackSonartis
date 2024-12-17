import dotenv from 'dotenv';
import app from './app.js'
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

console.log('Environment variables:');
console.log('Database Host:', process.env.DB_HOST);
console.log('Database Port:', process.env.DB_PORT);
console.log('Database User:', process.env.DB_USER);
console.log('Database Name:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'No configurado');
console.log('FrontUrl:', process.env.FrontUrl);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Database connected successfully. Server time:', res.rows[0].now);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});

