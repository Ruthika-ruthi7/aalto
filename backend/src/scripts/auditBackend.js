const mysql = require('mysql2/promise');
require('dotenv').config();

async function auditBackend() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('=== BACKEND DATABASE AUDIT ===\n');
    console.log('✅ Database connected successfully');
    console.log(`   Database: ${process.env.DB_NAME || 'aalto_admin'}`);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    
    console.log('\n=== TABLE STRUCTURES AND COUNTS ===\n');
    
    const tables = ['admin_users', 'contacts', 'blog', 'careers', 'applicants', 'gallery', 'business_unit', 'email_queue'];
    
    for (const table of tables) {
      try {
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        const [count] = await connection.query(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`\n${table.toUpperCase()}:`);
        console.log(`  Records: ${count[0].total}`);
        console.log(`  Columns: ${columns.length}`);
        columns.slice(0, 5).forEach(col => {
          console.log(`    - ${col.Field} (${col.Type})`);
        });
        if (columns.length > 5) {
          console.log(`    ... and ${columns.length - 5} more`);
        }
      } catch (error) {
        console.log(`\n${table.toUpperCase()}:`);
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

auditBackend();
