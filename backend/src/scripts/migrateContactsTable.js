const { pool } = require('../config/database');

async function migrateContactsTable() {
  console.log('Starting contacts table migration...');

  try {
    // Check if columns already exist
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'contacts' 
      AND TABLE_SCHEMA = DATABASE()
    `);

    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);

    // Add subject column if it doesn't exist
    if (!columnNames.includes('subject')) {
      console.log('Adding subject column...');
      await pool.query(`
        ALTER TABLE contacts 
        ADD COLUMN subject VARCHAR(255) DEFAULT NULL
      `);
      console.log('✓ Subject column added');
    } else {
      console.log('✓ Subject column already exists');
    }

    // Add assigned_to column if it doesn't exist
    if (!columnNames.includes('assigned_to')) {
      console.log('Adding assigned_to column...');
      await pool.query(`
        ALTER TABLE contacts 
        ADD COLUMN assigned_to VARCHAR(100) DEFAULT NULL
      `);
      console.log('✓ assigned_to column added');
    } else {
      console.log('✓ assigned_to column already exists');
    }

    // Add last_updated column if it doesn't exist
    if (!columnNames.includes('last_updated')) {
      console.log('Adding last_updated column...');
      await pool.query(`
        ALTER TABLE contacts 
        ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✓ last_updated column added');
    } else {
      console.log('✓ last_updated column already exists');
    }

    console.log('Migration completed successfully!');
    
    // Show updated table structure
    const [structure] = await pool.query('DESCRIBE contacts');
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
migrateContactsTable()
  .then(() => {
    console.log('\n✓ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });
