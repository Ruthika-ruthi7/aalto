const { pool } = require('./src/config/database');

async function checkUserPassword() {
  try {
    console.log('Checking user passwords...');
    
    const [users] = await pool.query('SELECT User_id, User_name, User_password, role FROM admin_users');
    
    console.log('Users and passwords:');
    users.forEach(user => {
      console.log(`ID: ${user.User_id}, Name: ${user.User_name}, Password: ${user.User_password}, Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking user passwords:', error);
    process.exit(1);
  }
}

checkUserPassword();
