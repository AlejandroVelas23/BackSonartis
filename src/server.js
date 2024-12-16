import app from './app.js';
import { pool } from './config/database.js';

const PORT = process.env.PORT || 3000;

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

