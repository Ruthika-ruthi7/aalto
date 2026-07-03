const { pool } = require('./src/config/database');

async function checkData() {
  try {
    console.log('Checking enquiries table...');
    const [enquiries] = await pool.query('SELECT COUNT(*) as count FROM enquiries');
    console.log(`Enquiries count: ${enquiries[0].count}`);
    
    if (enquiries[0].count > 0) {
      const [sample] = await pool.query('SELECT * FROM enquiries LIMIT 1');
      console.log('Sample enquiry:', sample[0]);
    }
    
    console.log('\nChecking blogs table...');
    const [blogs] = await pool.query('SELECT COUNT(*) as count FROM blogs');
    console.log(`Blogs count: ${blogs[0].count}`);
    
    console.log('\nChecking careers table...');
    const [careers] = await pool.query('SELECT COUNT(*) as count FROM careers');
    console.log(`Careers count: ${careers[0].count}`);
    
    console.log('\nChecking applicants table...');
    const [applicants] = await pool.query('SELECT COUNT(*) as count FROM applicants');
    console.log(`Applicants count: ${applicants[0].count}`);
    
    console.log('\nChecking galleries table...');
    const [galleries] = await pool.query('SELECT COUNT(*) as count FROM galleries');
    console.log(`Galleries count: ${galleries[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
