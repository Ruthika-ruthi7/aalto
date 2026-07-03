const { pool } = require('../config/database');

async function fixBlogFeatured() {
  console.log('Fixing is_featured column...');

  try {
    // First, set all NULL values to 0
    const [result] = await pool.query(`
      UPDATE blog 
      SET is_featured = 0 
      WHERE is_featured IS NULL
    `);
    console.log(`✓ Fixed ${result.affectedRows} NULL is_featured values`);

    // Verify the fix
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

fixBlogFeatured();
