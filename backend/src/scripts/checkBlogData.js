const { pool } = require('../config/database');

async function checkBlogData() {
  console.log('Checking blog data...');

  try {
    const [blogs] = await pool.query(`
      SELECT id, title, featured_image, is_featured, category, author, publish_date, job_status, updated_at 
      FROM blog 
      LIMIT 5
    `);

    console.log('\nCurrent blog data:');
    blogs.forEach(blog => {
      console.log(`ID: ${blog.id}`);
      console.log(`Title: ${blog.title}`);
      console.log(`Featured Image: ${blog.featured_image || 'NULL'}`);
      console.log(`Is Featured: ${blog.is_featured || 'NULL'}`);
      console.log(`Category: ${blog.category || 'NULL'}`);
      console.log(`Author: ${blog.author || 'NULL'}`);
      console.log(`Publish Date: ${blog.publish_date || 'NULL'}`);
      console.log(`Status: ${blog.job_status || 'NULL'}`);
      console.log(`Updated At: ${blog.updated_at || 'NULL'}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkBlogData();
