const { pool } = require('../config/database');

async function forceUpdateFeatured() {
  console.log('Force updating is_featured column...');

  try {
    // Check column definition
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'blog' 
      AND COLUMN_NAME = 'is_featured'
    `);
    console.log('Column definition:', columns[0]);

    // Update all records to set is_featured to 0
    const [result] = await pool.query(`
      UPDATE blog 
      SET is_featured = 0
    `);
    console.log(`✓ Updated ${result.affectedRows} records to is_featured = 0`);

    // Set some random records to featured (30%)
    const [allBlogs] = await pool.query('SELECT id FROM blog');
    const featuredCount = Math.floor(allBlogs.length * 0.3);
    
    // Randomly select blogs to feature
    const shuffled = allBlogs.sort(() => 0.5 - Math.random());
    const featuredIds = shuffled.slice(0, featuredCount).map(b => b.id);
    
    if (featuredIds.length > 0) {
      const placeholders = featuredIds.map(() => '?').join(',');
      await pool.query(
        `UPDATE blog SET is_featured = 1 WHERE id IN (${placeholders})`,
        featuredIds
      );
      console.log(`✓ Set ${featuredIds.length} blogs as featured`);
    }

    // Verify
    const [blogs] = await pool.query(`
      SELECT id, title, is_featured 
      FROM blog 
      LIMIT 5
    `);

    console.log('\nVerified data:');
    blogs.forEach(blog => {
      console.log(`ID: ${blog.id}, Title: ${blog.title}, Is Featured: ${blog.is_featured}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

forceUpdateFeatured();
