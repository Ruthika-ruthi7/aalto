const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Checking for refresh_tokens table...\n');
    
    const [tables] = await connection.query('SHOW TABLES LIKE "refresh_tokens"');
    
    if (tables.length > 0) {
      console.log('✅ refresh_tokens table exists');
      
      const [columns] = await connection.query('DESCRIBE refresh_tokens');
      console.log('\nColumns:');
      columns.forEach(col => {
        console.log('  -', col.Field, '|', col.Type, '|', col.Null, '|', col.Key);
      });
      
      const [count] = await connection.query('SELECT COUNT(*) as total FROM refresh_tokens');
      console.log('\nTotal records:', count[0].total);
    } else {
      console.log('❌ refresh_tokens table does NOT exist');
      console.log('\nAvailable tables:');
      const [allTables] = await connection.query('SHOW TABLES');
      allTables.forEach(t => {
        console.log('  -', Object.values(t)[0]);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTable();
