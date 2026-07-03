const { pool } = require('./src/config/database');

async function updateSchema() {
  try {
    console.log('Updating gallery table schema...');
    
    // Check if gallery table exists
    const [tables] = await pool.query('SHOW TABLES LIKE "gallery"');
    
    if (tables.length > 0) {
      // Get current structure
      const [gallerySchema] = await pool.query('DESCRIBE gallery');
      console.log('Current gallery columns:', gallerySchema.map(c => c.Field));
      
      // Drop existing gallery table
      await pool.query('DROP TABLE gallery');
      console.log('Dropped existing gallery table');
    } else {
      console.log('Gallery table does not exist, creating new one');
    }
    
    await pool.query(`
      CREATE TABLE gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Bu_id INT NOT NULL,
        gallery_title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_paths JSON NOT NULL,
        description TEXT,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (Bu_id) REFERENCES admin_users(User_id)
      )
    `);
    
    console.log('Gallery table updated successfully');
    
    // Create users table
    console.log('\nCreating users table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('Super Admin', 'Admin', 'Editor', 'HR', 'Viewer') NOT NULL DEFAULT 'Viewer',
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        last_login TIMESTAMP NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES admin_users(User_id)
      )
    `);
    
    console.log('Users table created successfully');
    
    // Insert default super admin if not exists
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT IGNORE INTO users (full_name, username, email, password, role, status)
      VALUES ('Super Admin', 'superadmin', 'superadmin@aalto.com', ?, 'Super Admin', 'active')
    `, [hashedPassword]);
    
    console.log('Default super admin created (username: superadmin, password: admin123)');
    
    console.log('\nSchema update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
