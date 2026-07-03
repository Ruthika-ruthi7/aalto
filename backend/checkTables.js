const { pool } = require('./src/config/database');

async function checkTables() {
  try {
    console.log('Checking all tables in database...');
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTables();
