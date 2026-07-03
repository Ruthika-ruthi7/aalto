const { pool } = require('../config/database');

async function seedApplicantExperience() {
  console.log('Starting to seed applicant experience data...');

  try {
    // Get all applicants without experience
    const [applicants] = await pool.query(`
      SELECT id, name 
      FROM applicants 
      WHERE experience IS NULL OR experience = ''
    `);

    if (applicants.length === 0) {
      console.log('No applicants need experience data.');
      return;
    }

    console.log(`Found ${applicants.length} applicants to update...`);

    const experienceOptions = [
      '0-1 years',
      '1-2 years',
      '2-3 years',
      '3-5 years',
      '5-7 years',
      '7-10 years',
      '10+ years'
    ];

    let updated = 0;

    for (const applicant of applicants) {
      // Generate random experience
      const experience = experienceOptions[Math.floor(Math.random() * experienceOptions.length)];

      try {
        await pool.query(
          `UPDATE applicants 
           SET experience = ?
           WHERE id = ?`,
          [experience, applicant.id]
        );
        updated++;
        console.log(`✓ Updated: ${applicant.name} - Experience: ${experience}`);
      } catch (error) {
        console.error(`✗ Failed to update ${applicant.name}:`, error.message);
      }
    }

    console.log(`\nSeeding completed!`);
    console.log(`Updated: ${updated}`);
    console.log(`Total processed: ${applicants.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

seedApplicantExperience();
