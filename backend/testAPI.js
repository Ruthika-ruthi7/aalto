const { pool } = require('./src/config/database');

async function testAPI() {
  try {
    console.log('Testing enquiries endpoint...');
    const [enquiries] = await pool.query('SELECT COUNT(*) as count FROM contacts');
    console.log(`Contacts count: ${enquiries[0].count}`);
    
    if (enquiries[0].count > 0) {
      const [sample] = await pool.query('SELECT id, full_name as name, email, phone as mobile, description as message, status, created_at FROM contacts LIMIT 1');
      console.log('Sample contact:', sample[0]);
    }
    
    console.log('\nTesting blogs endpoint...');
    const [blogs] = await pool.query('SELECT COUNT(*) as count FROM blog');
    console.log(`Blog count: ${blogs[0].count}`);
    
    if (blogs[0].count > 0) {
      const [sample] = await pool.query('SELECT id, blog_title as title, short_description as description, blog_content, author, tags, status as job_status, created_at, updated_at FROM blog LIMIT 1');
      console.log('Sample blog:', sample[0]);
    }
    
    console.log('\nTesting careers endpoint...');
    const [careers] = await pool.query('SELECT COUNT(*) as count FROM careers');
    console.log(`Careers count: ${careers[0].count}`);
    
    if (careers[0].count > 0) {
      const [sample] = await pool.query('SELECT id, job_title as job_titles, department, employment_type as EmploymentType, work_mode, location as Locations, experience_required as Experience, education_qualification as Education, key_skills as KeySkills, description as jobDescription, roles_and_responsibilities as Roles, benefits, status as job_status, posted_date, created_at, updated_at FROM careers LIMIT 1');
      console.log('Sample career:', sample[0]);
    }
    
    console.log('\nTesting gallery endpoint...');
    const [gallery] = await pool.query('SELECT COUNT(*) as count FROM gallery');
    console.log(`Gallery count: ${gallery[0].count}`);
    
    if (gallery[0].count > 0) {
      const [sample] = await pool.query('SELECT id, gallery_title as image_path, category, description, status, created_at, updated_at FROM gallery LIMIT 1');
      console.log('Sample gallery:', sample[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAPI();
