const { pool } = require('./src/config/database');

async function checkApplicants() {
  try {
    console.log('Checking applicants table schema...');
    const [schema] = await pool.query('DESCRIBE applicants');
    console.log('Applicants columns:', schema);
    
    console.log('\nChecking applicants count...');
    const [count] = await pool.query('SELECT COUNT(*) as count FROM applicants');
    console.log(`Applicants count: ${count[0].count}`);
    
    if (count[0].count > 0) {
      console.log('\nSample applicant data:');
      const [sample] = await pool.query('SELECT * FROM applicants LIMIT 1');
      console.log(sample[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkApplicants();
