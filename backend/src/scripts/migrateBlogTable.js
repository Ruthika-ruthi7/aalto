const { pool } = require('../config/database');

async function migrateBlogTable() {
  console.log('Starting blog table migration...');

  try {
    // Check if columns already exist
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'blog' 
      AND TABLE_SCHEMA = DATABASE()
    `);

    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);

    // Add featured_image column if it doesn't exist
    if (!columnNames.includes('featured_image')) {
      console.log('Adding featured_image column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN featured_image VARCHAR(255) DEFAULT NULL
      `);
      console.log('✓ featured_image column added');
    } else {
      console.log('✓ featured_image column already exists');
    }

    // Add category column if it doesn't exist
    if (!columnNames.includes('category')) {
      console.log('Adding category column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN category VARCHAR(100) DEFAULT NULL
      `);
      console.log('✓ category column added');
    } else {
      console.log('✓ category column already exists');
    }

    // Add author column if it doesn't exist
    if (!columnNames.includes('author')) {
      console.log('Adding author column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN author VARCHAR(100) DEFAULT NULL
      `);
      console.log('✓ author column added');
    } else {
      console.log('✓ author column already exists');
    }

    // Add publish_date column if it doesn't exist
    if (!columnNames.includes('publish_date')) {
      console.log('Adding publish_date column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN publish_date DATETIME DEFAULT NULL
      `);
      console.log('✓ publish_date column added');
    } else {
      console.log('✓ publish_date column already exists');
    }

    // Add updated_at column if it doesn't exist
    if (!columnNames.includes('updated_at')) {
      console.log('Adding updated_at column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✓ updated_at column added');
    } else {
      console.log('✓ updated_at column already exists');
    }

    // Add is_featured column if it doesn't exist
    if (!columnNames.includes('is_featured')) {
      console.log('Adding is_featured column...');
      await pool.query(`
        ALTER TABLE blog 
        ADD COLUMN is_featured TINYINT(1) DEFAULT 0
      `);
      console.log('✓ is_featured column added');
    } else {
      console.log('✓ is_featured column already exists');
    }

    console.log('Migration completed successfully!');
    
    // Show updated table structure
    const [structure] = await pool.query('DESCRIBE blog');
    console.log('\nUpdated table structure:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration
migrateBlogTable()
  .then(() => {
    console.log('\n✓ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });
