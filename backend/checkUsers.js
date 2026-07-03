const { pool } = require('./src/config/database');

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    const [users] = await pool.query('SELECT * FROM admin_users');
    
    console.log('Users found:');
    users.forEach(user => {
      console.log(`ID: ${user.User_id}, Name: ${user.User_name}, Username: ${user.username}, Role: ${user.Role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
