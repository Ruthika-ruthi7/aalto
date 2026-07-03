const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDataCounts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Checking data counts in database...\n');
    
    const tables = ['contacts', 'blog', 'careers', 'applicants', 'gallery'];
    
    for (const table of tables) {
      const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${result[0].count} records`);
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDataCounts();
