const { pool } = require('./src/config/database');

async function checkTableStructure() {
  try {
    console.log('Checking admin_users table structure...');
    
    const [columns] = await pool.query('DESCRIBE admin_users');
    
    console.log('Table columns:');
    columns.forEach(col => {
      console.log(`Field: ${col.Field}, Type: ${col.Type}, Null: ${col.Null}, Key: ${col.Key}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking table structure:', error);
    process.exit(1);
  }
}

checkTableStructure();
