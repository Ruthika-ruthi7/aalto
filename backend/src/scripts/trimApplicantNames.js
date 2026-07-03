const { pool } = require('../config/database');

async function trimApplicantNames() {
  console.log('Starting to trim applicant names...');

  try {
    // Get all applicants
    const [applicants] = await pool.query(`
      SELECT id, name 
      FROM applicants
    `);

    console.log(`Found ${applicants.length} applicants...`);

    let updated = 0;

    for (const applicant of applicants) {
      const originalName = applicant.name;
      const trimmedName = originalName.trim().replace(/\s+/g, ' ');

      if (originalName !== trimmedName) {
        try {
          await pool.query(
            `UPDATE applicants 
             SET name = ?
             WHERE id = ?`,
            [trimmedName, applicant.id]
          );
          updated++;
          console.log(`✓ Updated ID ${applicant.id}: "${originalName}" -> "${trimmedName}"`);
        } catch (error) {
          console.error(`✗ Failed to update ID ${applicant.id}:`, error.message);
        }
      }
    }

    console.log(`\nTrimming completed!`);
    console.log(`Updated: ${updated}`);
    console.log(`Total processed: ${applicants.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

trimApplicantNames();
