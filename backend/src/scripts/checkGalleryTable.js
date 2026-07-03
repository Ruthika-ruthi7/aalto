const { pool } = require('../config/database');

async function checkGalleryTable() {
  console.log('Checking gallery table structure...');

  try {
    const [structure] = await pool.query('DESCRIBE gallery');
    console.log('\nCurrent table structure:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    const [sample] = await pool.query('SELECT * FROM gallery LIMIT 1');
    console.log('\nSample data:');
    console.log(sample[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkGalleryTable();
