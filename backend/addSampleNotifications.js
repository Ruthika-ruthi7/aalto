const { pool } = require('./src/config/database');

async function addSampleNotifications() {
  try {
    console.log('Adding sample notifications...');
    
    const userId = 12; // Aalto user ID
    
    const notifications = [
      {
        user_id: userId,
        title: 'New Enquiry Received',
        module_name: 'Enquiries',
        description: 'John Smith has submitted a new enquiry regarding engineering services.',
        is_read: false
      },
      {
        user_id: userId,
        title: 'New Job Application',
        module_name: 'Careers',
        description: 'Robert Chen has applied for the Senior Engineer position.',
        is_read: false
      },
      {
        user_id: userId,
        title: 'Blog Published',
        module_name: 'Blogs',
        description: 'The article "Sustainable Engineering Practices" has been published successfully.',
        is_read: true
      },
      {
        user_id: userId,
        title: 'Gallery Updated',
        module_name: 'Gallery',
        description: 'New project images have been added to the gallery.',
        is_read: true
      },
      {
        user_id: userId,
        title: 'System Backup Complete',
        module_name: 'Settings',
        description: 'Daily database backup has been completed successfully.',
        is_read: false
      }
    ];
    
    for (const notification of notifications) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, module_name, description, is_read, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [notification.user_id, notification.title, notification.module_name, notification.description, notification.is_read]
      );
      console.log(`Added: ${notification.title}`);
    }
    
    console.log('Sample notifications added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample notifications:', error);
    process.exit(1);
  }
}

addSampleNotifications();
