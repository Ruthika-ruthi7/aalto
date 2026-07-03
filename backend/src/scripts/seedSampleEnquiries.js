const { pool } = require('../config/database');

const sampleEnquiries = [
  {
    name: 'Michael Anderson',
    mobile: '+1-555-0101',
    email: 'michael.anderson@techcorp.com',
    subject: 'Structural Engineering Consultation',
    message: 'We are looking for structural engineering consultation for our new office building project in downtown Chicago. The building is 15 stories high and requires comprehensive structural analysis and design recommendations.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Sarah Mitchell',
    mobile: '+1-555-0102',
    email: 'sarah.mitchell@constructionfirm.com',
    subject: 'Construction Project Management',
    message: 'Interested in your construction project management services for a large-scale residential development. We have 200 units planned and need experienced oversight.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'David Thompson',
    mobile: '+1-555-0103',
    email: 'david.thompson@industrial.com',
    subject: 'Industrial Facility Design',
    message: 'Need engineering design services for a new manufacturing facility. The project includes heavy machinery installation and requires specialized structural support systems.',
    assigned_to: 'John Smith',
    status: 'IN PROGRESS'
  },
  {
    name: 'Emily Rodriguez',
    mobile: '+1-555-0104',
    email: 'emily.rodriguez@realestate.com',
    subject: 'Building Renovation Project',
    message: 'We have a historic building that needs structural reinforcement and renovation engineering. The building is from the 1920s and requires careful preservation work.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'James Wilson',
    mobile: '+1-555-0105',
    email: 'james.wilson@energy.com',
    subject: 'Energy Efficiency Audit',
    message: 'Requesting an energy efficiency audit and engineering recommendations for our commercial property portfolio. We have 5 buildings that need assessment.',
    assigned_to: 'John Smith',
    status: 'IN PROGRESS'
  },
  {
    name: 'Amanda Foster',
    mobile: '+1-555-0106',
    email: 'amanda.foster@hospital.com',
    subject: 'Healthcare Facility Engineering',
    message: 'Need specialized engineering services for hospital expansion project. Requirements include HVAC system design, medical gas systems, and infection control considerations.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Robert Chen',
    mobile: '+1-555-0107',
    email: 'robert.chen@techstartup.com',
    subject: 'Office Space Fit-out',
    message: 'Looking for engineering consultation for office space renovation. Need MEP design, fire safety systems, and space optimization for our growing tech company.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Lisa Martinez',
    mobile: '+1-555-0108',
    email: 'lisa.martinez@school.edu',
    subject: 'Educational Facility Design',
    message: 'We are planning a new school building and need comprehensive engineering services. The project includes classrooms, laboratories, and sports facilities.',
    assigned_to: 'Jane Doe',
    status: 'IN PROGRESS'
  },
  {
    name: 'Kevin Park',
    mobile: '+1-555-0109',
    email: 'kevin.park@retail.com',
    subject: 'Retail Store Construction',
    message: 'Need engineering services for a new retail store chain. Multiple locations planned across the Midwest. Standardized design approach preferred.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Jennifer Lee',
    mobile: '+1-555-0110',
    email: 'jennifer.lee@logistics.com',
    subject: 'Warehouse Structural Design',
    message: 'Require structural engineering for a large distribution center. High ceiling clearance, heavy load requirements, and automated storage systems to be accommodated.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Mark Johnson',
    mobile: '+1-555-0111',
    email: 'mark.johnson@hotel.com',
    subject: 'Hotel Renovation Engineering',
    message: 'Historic hotel renovation project requiring structural assessment, MEP upgrades, and compliance with modern building codes while preserving architectural integrity.',
    assigned_to: 'John Smith',
    status: 'IN PROGRESS'
  },
  {
    name: 'Rachel Green',
    mobile: '+1-555-0112',
    email: 'rachel.green@airport.com',
    subject: 'Airport Terminal Engineering',
    message: 'Need engineering services for airport terminal expansion. Complex requirements include security systems, passenger flow optimization, and aircraft support infrastructure.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Steven Brown',
    mobile: '+1-555-0113',
    email: 'steven.brown@bridge.com',
    subject: 'Bridge Inspection Services',
    message: 'Requesting comprehensive bridge inspection and structural assessment services. We have 5 bridges in our transportation network that need evaluation.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Michelle Taylor',
    mobile: '+1-555-0114',
    email: 'michelle.taylor@stadium.com',
    subject: 'Sports Facility Engineering',
    message: 'Planning a new sports stadium and need engineering expertise. Requirements include structural design, crowd safety systems, and specialized lighting and sound infrastructure.',
    assigned_to: 'Jane Doe',
    status: 'IN PROGRESS'
  },
  {
    name: 'Daniel White',
    mobile: '+1-555-0115',
    email: 'daniel.white@datacenter.com',
    subject: 'Data Center Infrastructure',
    message: 'Need engineering design for a new data center facility. Critical requirements include precision cooling, redundant power systems, and seismic considerations.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Laura Harris',
    mobile: '+1-555-0116',
    email: 'laura.harris@marina.com',
    subject: 'Marina Engineering Services',
    message: 'Require engineering services for marina development project. Includes dock design, waterfront structural considerations, and environmental compliance requirements.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Christopher Clark',
    mobile: '+1-555-0117',
    email: 'christopher.clark@manufacturing.com',
    subject: 'Factory Automation Engineering',
    message: 'Looking for engineering support for factory automation project. Need structural modifications, utility upgrades, and integration of automated manufacturing systems.',
    assigned_to: 'John Smith',
    status: 'IN PROGRESS'
  },
  {
    name: 'Patricia Lewis',
    mobile: '+1-555-0118',
    email: 'patricia.lewis@parking.com',
    subject: 'Parking Structure Design',
    message: 'Need design and engineering services for a multi-level parking structure. Requirements include traffic flow optimization, safety systems, and integration with existing infrastructure.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Thomas Young',
    mobile: '+1-555-0119',
    email: 'thomas.young@telecom.com',
    subject: 'Telecommunications Tower',
    message: 'Require engineering services for telecommunications tower installation. Site assessment, structural design, and foundation engineering needed for multiple locations.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Nancy Hall',
    mobile: '+1-555-0120',
    email: 'nancy.hall@water.com',
    subject: 'Water Treatment Plant',
    message: 'Need engineering services for water treatment facility upgrade. Process engineering, structural modifications, and environmental compliance requirements.',
    assigned_to: 'Jane Doe',
    status: 'IN PROGRESS'
  },
  {
    name: 'George Allen',
    mobile: '+1-555-0121',
    email: 'george.allen@solar.com',
    subject: 'Solar Panel Installation',
    message: 'Requesting engineering assessment for large-scale solar panel installation on commercial rooftops. Structural capacity evaluation and mounting system design needed.',
    assigned_to: 'John Smith',
    status: 'NEW'
  },
  {
    name: 'Diana Scott',
    mobile: '+1-555-0122',
    email: 'diana.scott@restaurant.com',
    subject: 'Restaurant Build-out',
    message: 'Need engineering services for restaurant construction. Kitchen ventilation, grease management systems, and compliance with health and safety codes required.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Richard King',
    mobile: '+1-555-0123',
    email: 'richard.king@mining.com',
    subject: 'Mining Facility Engineering',
    message: 'Require engineering services for mining facility expansion. Heavy equipment foundations, processing plant structures, and safety systems needed.',
    assigned_to: 'John Smith',
    status: 'IN PROGRESS'
  },
  {
    name: 'Barbara Wright',
    mobile: '+1-555-0124',
    email: 'barbara.wright@pharmaceutical.com',
    subject: 'Pharmaceutical Facility',
    message: 'Need specialized engineering for pharmaceutical manufacturing facility. Clean room design, HVAC systems, and regulatory compliance requirements.',
    assigned_to: 'Jane Doe',
    status: 'NEW'
  },
  {
    name: 'Edward Lopez',
    mobile: '+1-555-0125',
    email: 'edward.lopez@government.com',
    subject: 'Government Building Project',
    message: 'Requesting engineering services for government office building. Security requirements, accessibility compliance, and sustainable design features needed.',
    assigned_to: 'John Smith',
    status: 'NEW'
  }
];

async function seedSampleEnquiries() {
  console.log('Starting to seed sample enquiries...');

  try {
    let inserted = 0;
    let skipped = 0;

    for (const enquiry of sampleEnquiries) {
      try {
        const [result] = await pool.query(
          `INSERT INTO contacts (name, mobile, email, subject, message, assigned_to, status, is_deleted, query_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
          [enquiry.name, enquiry.mobile, enquiry.email, enquiry.subject, enquiry.message, enquiry.assigned_to, enquiry.status]
        );
        inserted++;
        console.log(`✓ Inserted: ${enquiry.name} - ${enquiry.subject}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          skipped++;
          console.log(`⊘ Skipped (duplicate): ${enquiry.name}`);
        } else {
          console.error(`✗ Failed to insert ${enquiry.name}:`, error.message);
        }
      }
    }

    console.log(`\nSeeding completed!`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total processed: ${sampleEnquiries.length}`);

    // Show total count
    const [count] = await pool.query('SELECT COUNT(*) as total FROM contacts WHERE is_deleted = 0');
    console.log(`\nTotal enquiries in database: ${count[0].total}`);

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seeding
seedSampleEnquiries()
  .then(() => {
    console.log('\n✓ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  });
