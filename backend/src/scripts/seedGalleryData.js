const { pool } = require('../config/database');

async function seedGalleryData() {
  console.log('Checking gallery data...');

  try {
    const [count] = await pool.query('SELECT COUNT(*) as total FROM gallery');
    console.log(`Current gallery count: ${count[0].total}`);

    if (count[0].total > 0) {
      console.log('Gallery already has data. Clearing existing data...');
      await pool.query('DELETE FROM gallery');
      console.log('✓ Existing data cleared');
    }

    console.log('Adding sample gallery data...');

    const sampleGalleries = [
      {
        gallery_title: 'Chennai Metro Rail Project - Phase 2',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800', 'https://images.unsplash.com/photo-1555662365-5361a3e08d49?w=800']),
        description: 'Structural design and supervision for Chennai Metro Rail Phase 2 extension covering 52km with 43 stations.',
        status: 'active'
      },
      {
        gallery_title: 'Tata Steel Plant Expansion',
        category: 'Industrial',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800']),
        description: 'Complete structural engineering for Tata Steel plant expansion in Kalinganagar, Odisha - 5000MT capacity enhancement.',
        status: 'active'
      },
      {
        gallery_title: 'Bangalore International Airport Terminal 2',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=800', 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=800']),
        description: 'Structural design for Terminal 2 expansion - 255,000 sqm terminal building with advanced steel and glass structure.',
        status: 'active'
      },
      {
        gallery_title: 'L&T Smart World City - Residential Towers',
        category: 'Residential',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800']),
        description: 'Structural design for 4 high-rise residential towers (G+40) with earthquake-resistant design and advanced foundation systems.',
        status: 'active'
      },
      {
        gallery_title: 'Reliance Jamnagar Refinery Expansion',
        category: 'Industrial',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800']),
        description: 'Structural engineering for refinery expansion - world\'s largest refinery complex with 1.2 million barrels per day capacity.',
        status: 'active'
      },
      {
        gallery_title: 'Delhi-Mumbai Expressway Bridges',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1545424426-8764ff9a91b8?w=800', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
        description: 'Design of 12 major bridges along Delhi-Mumbai Expressway including cable-stayed and arch bridges.',
        status: 'active'
      },
      {
        gallery_title: 'Aalto Engineers Annual Meet 2024',
        category: 'Events',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800']),
        description: 'Annual company meet celebrating 15 years of excellence in structural engineering with team recognition and awards.',
        status: 'active'
      },
      {
        gallery_title: 'Hyderabad Pharma City - Industrial Complex',
        category: 'Industrial',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800']),
        description: 'Structural design for Asia\'s largest pharmaceutical industrial cluster - 19,000 acres with specialized facilities.',
        status: 'active'
      },
      {
        gallery_title: 'Mumbai Coastal Road Project',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800']),
        description: 'Structural engineering for 29.2km coastal road with sea link bridges and interchanges - Mumbai\'s largest infrastructure project.',
        status: 'active'
      },
      {
        gallery_title: 'Team Training Program - BIM Implementation',
        category: 'Training',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800']),
        description: 'Advanced BIM (Building Information Modeling) training program for 50 engineers across all business units.',
        status: 'active'
      },
      {
        gallery_title: 'Kolkata East-West Metro Tunnel',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1555662365-5361a3e08d49?w=800', 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800']),
        description: 'Structural design for underground metro tunnel section under Hooghly River - 520m immersed tube tunnel.',
        status: 'active'
      },
      {
        gallery_title: 'Godrej Properties - Commercial Complex',
        category: 'Commercial',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800']),
        description: 'Structural design for LEED Platinum certified commercial complex in Mumbai - 3 towers with 2 million sqft office space.',
        status: 'active'
      },
      {
        gallery_title: 'Safety Week Celebration 2024',
        category: 'Events',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800']),
        description: 'National Safety Week celebration with safety drills, training sessions, and safety excellence awards.',
        status: 'active'
      },
      {
        gallery_title: 'Navi Mumbai International Airport',
        category: 'Infrastructure',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=800', 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=800']),
        description: 'Structural design for passenger terminal building - 20 million passengers annual capacity with sustainable design features.',
        status: 'active'
      },
      {
        gallery_title: 'Vizag Steel Plant Modernization',
        category: 'Industrial',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800']),
        description: 'Structural modernization for Rashtriya Ispat Nigam Limited - blast furnace rebuild and rolling mill upgrades.',
        status: 'active'
      }
    ];

    for (const gallery of sampleGalleries) {
      await pool.query(
        `INSERT INTO gallery (Bu_id, gallery_title, category, image_paths, description, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [1, gallery.gallery_title, gallery.category, gallery.image_paths, gallery.description, gallery.status]
      );
      console.log(`✓ Added: ${gallery.gallery_title}`);
    }

    console.log('\nSample gallery data added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

seedGalleryData();
