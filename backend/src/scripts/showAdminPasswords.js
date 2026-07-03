const mysql = require('mysql2/promise');
require('dotenv').config();

async function showAdminPasswords() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'aalto_admin'
    });

    console.log('Admin users with passwords:\n');
    
    const [users] = await connection.query('SELECT User_id, User_name, User_password, role FROM admin_users');
    
    users.forEach(user => {
      console.log('  - Username:', user.User_name);
      console.log('    Password:', user.User_password);
      console.log('    Role:', user.role);
      console.log('    ID:', user.User_id);
      console.log('');
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

showAdminPasswords();
