const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkStructure() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Checking admin_users table structure...\n');
    
    const [columns] = await connection.query('DESCRIBE admin_users');
    console.log('admin_users columns:');
    columns.forEach(col => {
      console.log('  -', col.Field, '|', col.Type, '|', col.Null, '|', col.Key, '|', col.Default);
    });
    
    // Check if there are any users
    const [users] = await connection.query('SELECT COUNT(*) as count FROM admin_users');
    console.log('\nTotal admin_users:', users[0].count);
    
    // Show existing users
    const [userList] = await connection.query('SELECT * FROM admin_users LIMIT 5');
    if (userList.length > 0) {
      console.log('\nExisting admin users:');
      userList.forEach(user => {
        console.log('  -', JSON.stringify(user));
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStructure();
