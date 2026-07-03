const { pool } = require('../config/database');

async function migrateApplicantTable() {
  console.log('Starting applicants table migration...');

  try {
    // Get existing columns
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'applicants'
      AND TABLE_SCHEMA = DATABASE()
    `);
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);

    // Add experience column if it doesn't exist
    if (!columnNames.includes('experience')) {
      console.log('Adding experience column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN experience VARCHAR(100) NULL
      `);
      console.log('✓ experience column added');
    } else {
      console.log('✓ experience column already exists');
    }

    // Add current_company column if it doesn't exist
    if (!columnNames.includes('current_company')) {
      console.log('Adding current_company column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN current_company VARCHAR(255) NULL
      `);
      console.log('✓ current_company column added');
    } else {
      console.log('✓ current_company column already exists');
    }

    // Add current_ctc column if it doesn't exist
    if (!columnNames.includes('current_ctc')) {
      console.log('Adding current_ctc column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN current_ctc DECIMAL(10,2) NULL
      `);
      console.log('✓ current_ctc column added');
    } else {
      console.log('✓ current_ctc column already exists');
    }

    // Add expected_ctc column if it doesn't exist
    if (!columnNames.includes('expected_ctc')) {
      console.log('Adding expected_ctc column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN expected_ctc DECIMAL(10,2) NULL
      `);
      console.log('✓ expected_ctc column added');
    } else {
      console.log('✓ expected_ctc column already exists');
    }

    // Add notice_period column if it doesn't exist
    if (!columnNames.includes('notice_period')) {
      console.log('Adding notice_period column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN notice_period VARCHAR(50) NULL
      `);
      console.log('✓ notice_period column added');
    } else {
      console.log('✓ notice_period column already exists');
    }

    // Add rejection_reason column if it doesn't exist
    if (!columnNames.includes('rejection_reason')) {
      console.log('Adding rejection_reason column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN rejection_reason TEXT NULL
      `);
      console.log('✓ rejection_reason column added');
    } else {
      console.log('✓ rejection_reason column already exists');
    }

    // Add hold_reason column if it doesn't exist
    if (!columnNames.includes('hold_reason')) {
      console.log('Adding hold_reason column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN hold_reason TEXT NULL
      `);
      console.log('✓ hold_reason column added');
    } else {
      console.log('✓ hold_reason column already exists');
    }

    // Add interview_date column if it doesn't exist
    if (!columnNames.includes('interview_date')) {
      console.log('Adding interview_date column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN interview_date DATETIME NULL
      `);
      console.log('✓ interview_date column added');
    } else {
      console.log('✓ interview_date column already exists');
    }

    // Add interview_feedback column if it doesn't exist
    if (!columnNames.includes('interview_feedback')) {
      console.log('Adding interview_feedback column...');
      await pool.query(`
        ALTER TABLE applicants 
        ADD COLUMN interview_feedback TEXT NULL
      `);
      console.log('✓ interview_feedback column added');
    } else {
      console.log('✓ interview_feedback column already exists');
    }

    console.log('Migration completed successfully!');
    
    // Show updated table structure
    const [structure] = await pool.query('DESCRIBE applicants');
    console.log('\nUpdated table structure:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateApplicantTable();
