const { pool } = require('./src/config/database');

async function testGalleryAPI() {
  try {
    console.log('Testing gallery API directly...');
    
    const { page = 1, limit = 20 } = { page: 1, limit: 20 };
    const offset = (page - 1) * limit;

    let query = 'SELECT id, Bu_id, gallery_title, category, image_paths, description, status, uploaded_date, last_updated FROM gallery WHERE 1=1';
    const params = [];

    query += ' ORDER BY uploaded_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [galleries] = await pool.query(query, params);

    console.log('Raw galleries:', galleries);

    // Parse JSON image_paths for each gallery
    const galleriesWithImages = galleries.map(gallery => ({
      ...gallery,
      image_paths: JSON.parse(gallery.image_paths || '[]')
    }));

    console.log('Parsed galleries with images:', galleriesWithImages);

    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM gallery WHERE 1=1');
    const total = countResult[0].total;

    const response = {
      items: galleriesWithImages,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };

    console.log('Final API response structure:', JSON.stringify(response, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testGalleryAPI();
