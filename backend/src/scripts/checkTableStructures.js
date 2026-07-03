const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkStructures() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Checking table structures...\n');
    
    const tables = ['blog', 'careers', 'applicants'];
    
    for (const table of tables) {
      console.log(`\n=== ${table.toUpperCase()} ===`);
      const [columns] = await connection.query(`DESCRIBE ${table}`);
      columns.forEach(col => {
        console.log(`  - ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStructures();
