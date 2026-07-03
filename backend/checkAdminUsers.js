const { pool } = require('./src/config/database');

async function checkAdminUsers() {
  try {
    console.log('Checking admin_users table schema...');
    const [schema] = await pool.query('DESCRIBE admin_users');
    console.log('Admin users columns:', schema);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdminUsers();
