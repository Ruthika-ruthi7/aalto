const { pool } = require('./src/config/database');

async function checkSchema() {
  try {
    console.log('Checking contacts table schema...');
    const [contacts] = await pool.query('DESCRIBE contacts');
    console.log('Contacts columns:', contacts);
    
    console.log('\nChecking blog table schema...');
    const [blog] = await pool.query('DESCRIBE blog');
    console.log('Blog columns:', blog);
    
    console.log('\nChecking careers table schema...');
    const [careers] = await pool.query('DESCRIBE careers');
    console.log('Careers columns:', careers);
    
    console.log('\nChecking gallery table schema...');
    const [gallery] = await pool.query('DESCRIBE gallery');
    console.log('Gallery columns:', gallery);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSchema();
