import app from './app.js';
import { Pool } from 'pg'; // Asegúrate de estar usando Pool de 'pg' para gestionar conexiones

const PORT = process.env.PORT || 3000;

// Configuración de la base de datos usando las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Necesario para las conexiones seguras de Railway
  }
});

// Verificar conexión a la base de datos antes de iniciar el servidor
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
