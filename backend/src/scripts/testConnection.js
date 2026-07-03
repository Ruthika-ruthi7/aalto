const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('='.repeat(60));
  console.log('MySQL Connection Diagnostic Tool');
  console.log('='.repeat(60));
  console.log('Host:', process.env.DB_HOST || 'localhost');
  console.log('Port:', process.env.DB_PORT || 3306);
  console.log('User:', process.env.DB_USER || 'root');
  console.log('Database:', process.env.DB_NAME || 'aalto_admin');
  console.log('Password from .env:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
  console.log('='.repeat(60));

  // Test 1: Try connecting without database first
  console.log('\n[TEST 1] Connecting to MySQL server (no database)...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('✅ SUCCESS: Connected to MySQL server');
    
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Available databases:');
    rows.forEach(row => console.log('  -', row.Database));
    
    // Check if aalto_admin exists
    const dbExists = rows.some(r => r.Database === 'aalto_admin');
    console.log('\nDatabase "aalto_admin" exists:', dbExists ? 'YES' : 'NO');
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ FAILED: Could not connect to MySQL server');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }

  // Test 2: Try with empty password
  console.log('\n[TEST 2] Trying with empty password...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: ''
    });

    console.log('✅ SUCCESS: Connected with empty password!');
    
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Available databases:', rows.map(r => r.Database));
    
    await connection.end();
    console.log('\n⚠️  RECOMMENDATION: Set DB_PASSWORD= in .env file');
    return true;
  } catch (error) {
    console.error('❌ FAILED: Empty password did not work');
    console.error('Error:', error.message);
  }

  // Test 3: Try with 'root' as password
  console.log('\n[TEST 3] Trying with "root" as password...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: 'root'
    });

    console.log('✅ SUCCESS: Connected with password "root"!');
    await connection.end();
    console.log('\n⚠️  RECOMMENDATION: Set DB_PASSWORD=root in .env file');
    return true;
  } catch (error) {
    console.error('❌ FAILED: Password "root" did not work');
  }

  // Test 4: Try with '123456' as password
  console.log('\n[TEST 4] Trying with "123456" as password...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: '123456'
    });

    console.log('✅ SUCCESS: Connected with password "123456"!');
    await connection.end();
    console.log('\n⚠️  RECOMMENDATION: Set DB_PASSWORD=123456 in .env file');
    return true;
  } catch (error) {
    console.error('❌ FAILED: Password "123456" did not work');
  }

  console.log('\n' + '='.repeat(60));
  console.log('CONCLUSION: All password attempts failed');
  console.log('Please verify:');
  console.log('  1. MySQL is running on localhost:3306');
  console.log('  2. The correct root password for MySQL');
  console.log('  3. Update DB_PASSWORD in backend/.env file');
  console.log('='.repeat(60));
  return false;
}

testConnection();
