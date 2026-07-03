const { pool } = require('./src/config/database');

async function createNotificationsTable() {
  try {
    console.log('Creating notifications table...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        module_name VARCHAR(100) NOT NULL,
        description TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users(User_id) ON DELETE CASCADE
      )
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Notifications table created successfully');
    
    // Insert sample notifications
    const sampleNotifications = [
      {
        user_id: 1,
        title: 'New Enquiry Received',
        module_name: 'Enquiries',
        description: 'A new enquiry has been submitted by John Doe regarding engineering services.',
        is_read: false
      },
      {
        user_id: 1,
        title: 'Career Application',
        module_name: 'Careers',
        description: 'Jane Smith has applied for the Senior Structural Engineer position.',
        is_read: false
      },
      {
        user_id: 1,
        title: 'Blog Published',
        module_name: 'Blogs',
        description: 'The blog post "Sustainable Engineering Practices" has been published successfully.',
        is_read: true
      },
      {
        user_id: 1,
        title: 'Gallery Updated',
        module_name: 'Gallery',
        description: 'New images have been added to the "Office Events" gallery.',
        is_read: true
      }
    ];
    
    for (const notification of sampleNotifications) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, module_name, description, is_read) VALUES (?, ?, ?, ?, ?)',
        [notification.user_id, notification.title, notification.module_name, notification.description, notification.is_read]
      );
    }
    
    console.log('✅ Sample notifications inserted');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating notifications table:', error);
    process.exit(1);
  }
}

createNotificationsTable();
