const { pool } = require('../config/database');

async function checkApplicantTable() {
  console.log('Checking applicants table structure...');

  try {
    const [structure] = await pool.query('DESCRIBE applicants');
    console.log('\nCurrent table structure:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    const [sample] = await pool.query('SELECT * FROM applicants LIMIT 1');
    console.log('\nSample data:');
    console.log(sample[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkApplicantTable();
