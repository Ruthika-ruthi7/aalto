const { pool } = require('./src/config/database');

async function checkGalleryData() {
  try {
    console.log('Checking gallery data...');
    const [count] = await pool.query('SELECT COUNT(*) as count FROM gallery');
    console.log(`Gallery count: ${count[0].count}`);
    
    if (count[0].count > 0) {
      const [sample] = await pool.query('SELECT * FROM gallery LIMIT 1');
      console.log('Sample gallery:', sample[0]);
    } else {
      console.log('Gallery table is empty. Inserting sample data...');
      
      const [result] = await pool.query(
        `INSERT INTO gallery (Bu_id, gallery_title, category, image_paths, description, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [1, 'Sample Gallery', 'Events', JSON.stringify(['/uploads/gallery/sample.jpg']), 'A sample gallery entry', 'active']
      );
      
      console.log(`Inserted sample gallery with ID: ${result.insertId}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGalleryData();
