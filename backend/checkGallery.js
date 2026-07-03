const { pool } = require('./src/config/database');

async function checkGallery() {
  try {
    console.log('Checking gallery table schema...');
    const [schema] = await pool.query('DESCRIBE gallery');
    console.log('Gallery columns:', schema);
    
    console.log('\nChecking gallery count...');
    const [count] = await pool.query('SELECT COUNT(*) as count FROM gallery');
    console.log(`Gallery count: ${count[0].count}`);
    
    if (count[0].count > 0) {
      console.log('\nSample gallery data:');
      const [sample] = await pool.query('SELECT * FROM gallery LIMIT 1');
      console.log(sample[0]);
    }
    
    console.log('\nChecking for settings table...');
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log('All tables:', tableNames);
    
    if (tableNames.includes('settings')) {
      console.log('\nSettings table exists. Checking schema...');
      const [settingsSchema] = await pool.query('DESCRIBE settings');
      console.log('Settings columns:', settingsSchema);
      
      const [settingsCount] = await pool.query('SELECT COUNT(*) as count FROM settings');
      console.log(`Settings count: ${settingsCount[0].count}`);
      
      if (settingsCount[0].count > 0) {
        const [settingsSample] = await pool.query('SELECT * FROM settings LIMIT 1');
        console.log('Sample settings:', settingsSample[0]);
      }
    } else {
      console.log('Settings table does not exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGallery();
