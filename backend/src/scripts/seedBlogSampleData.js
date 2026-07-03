const { pool } = require('../config/database');

async function seedBlogSampleData() {
  console.log('Starting to seed blog sample data...');

  try {
    // Fix NULL is_featured values first
    await pool.query(`
      UPDATE blog 
      SET is_featured = 0 
      WHERE is_featured IS NULL
    `);
    console.log('✓ Fixed NULL is_featured values');

    // Get all blogs to update with professional images
    const [blogs] = await pool.query(`
      SELECT id, title, author 
      FROM blog
    `);

    if (blogs.length === 0) {
      console.log('No blogs need sample data.');
      return;
    }

    console.log(`Found ${blogs.length} blogs to update...`);

    const categories = [
      'Engineering',
      'Construction',
      'Technology',
      'Industry News',
      'Project Updates',
      'Sustainability',
      'Innovation',
      'Safety'
    ];

    // Professional placeholder images related to engineering/construction (using reliable sources)
    const sampleImages = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&h=400&fit=crop'
    ];

    let updated = 0;

    for (const blog of blogs) {
      // Generate random category
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate publish date (random date within last 6 months)
      const now = new Date();
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      const publishDate = new Date(sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime()));
      
      // Generate featured image URL from professional sample images
      const featuredImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      // Generate random is_featured value (30% chance of being featured)
      const isFeatured = Math.random() < 0.3 ? 1 : 0;

      try {
        await pool.query(
          `UPDATE blog 
           SET category = ?, publish_date = ?, featured_image = ?, is_featured = ?
           WHERE id = ?`,
          [category, publishDate, featuredImage, isFeatured, blog.id]
        );
        updated++;
        console.log(`✓ Updated: ${blog.title} - Category: ${category}, Featured: ${isFeatured ? 'Yes' : 'No'}`);
      } catch (error) {
        console.error(`✗ Failed to update ${blog.title}:`, error.message);
      }
    }

    console.log(`\nSeeding completed!`);
    console.log(`Updated: ${updated}`);
    console.log(`Total processed: ${blogs.length}`);

    // Show sample of updated data
    const [sample] = await pool.query(`
      SELECT id, title, category, publish_date, featured_image 
      FROM blog 
      WHERE category IS NOT NULL 
      LIMIT 5
    `);
    console.log('\nSample updated blogs:');
    sample.forEach(blog => {
      console.log(`  - ${blog.title}: ${blog.category} | ${blog.publish_date?.toISOString().split('T')[0]}`);
    });

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seeding
seedBlogSampleData()
  .then(() => {
    console.log('\n✓ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  });
