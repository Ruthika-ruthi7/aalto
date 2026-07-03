const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Connected to aalto_admin database');
    
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nExisting tables:');
    tables.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log('  -', tableName);
    });
    
    // Check if users table exists
    const usersExists = tables.some(t => Object.values(t)[0] === 'users');
    console.log('\nusers table exists:', usersExists ? 'YES' : 'NO');
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTables();
