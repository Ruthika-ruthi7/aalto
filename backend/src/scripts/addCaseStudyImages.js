const { pool } = require('../config/database');

async function addCaseStudyImages() {
  try {
    console.log('Adding featured images to case studies...');

    const placeholderImages = [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop', // Warehouse
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop', // Elevator
      'https://images.unsplash.com/photo-1565043569764-4a7019b43696?w=800&h=600&fit=crop', // Manufacturing
      'https://images.unsplash.com/photo-1565514020176-6b4696a8a3e2?w=800&h=600&fit=crop', // Factory
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop', // Industrial
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop', // Cold storage
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop', // Power plant
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop', // Aerospace
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop', // Steel plant
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop', // Logistics
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop', // Hospital
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop'  // Solar
    ];

    const [caseStudies] = await pool.query('SELECT id FROM case_studies ORDER BY id');

    for (let i = 0; i < caseStudies.length; i++) {
      const caseStudy = caseStudies[i];
      const imageUrl = placeholderImages[i % placeholderImages.length];
      
      await pool.query(
        'UPDATE case_studies SET featured_image = ? WHERE id = ?',
        [imageUrl, caseStudy.id]
      );
      console.log(`Updated case study ${caseStudy.id} with image`);
    }

    console.log('All case studies updated with featured images!');
  } catch (error) {
    console.error('Error adding images:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addCaseStudyImages();
