const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM admin_users WHERE email = ? OR username = ?',
      ['admin@aaltoengineers.com', 'admin']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists');
      console.log('   Email: admin@aaltoengineers.com');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Insert admin user
    const [result] = await pool.query(
      `INSERT INTO admin_users 
       (email, username, password_hash, first_name, last_name, role, is_active, email_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['admin@aaltoengineers.com', 'admin', passwordHash, 'Admin', 'User', 'super_admin', true, true]
    );

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@aaltoengineers.com');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: super_admin');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedAdmin();
