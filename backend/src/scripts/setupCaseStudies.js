const { pool } = require('../config/database');

async function setupCaseStudies() {
  try {
    console.log('Creating case_studies table...');
    
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_studies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        client_name VARCHAR(255) NOT NULL,
        service_type ENUM('consulting', 'engineering', 'construction', 'maintenance', 'automation', 'lifts_elevators', 'material_handling', 'warehouse_solutions', 'other') NOT NULL,
        industry ENUM('manufacturing', 'construction', 'pharmaceutical', 'logistics', 'automotive', 'aerospace', 'food_beverage', 'textile', 'chemical', 'energy', 'other') NOT NULL,
        featured_image VARCHAR(500),
        short_description TEXT,
        challenge LONGTEXT,
        solution LONGTEXT,
        results LONGTEXT,
        technologies_used TEXT,
        project_duration VARCHAR(100),
        status ENUM('draft', 'published', 'unpublished') NOT NULL DEFAULT 'draft',
        website_id INT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT NULL,
        updated_by INT NULL,
        INDEX idx_slug (slug),
        INDEX idx_service_type (service_type),
        INDEX idx_status (status),
        INDEX idx_website_id (website_id),
        INDEX idx_client_name (client_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('Table created successfully!');

    // Check if table has data
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM case_studies');
    console.log(`Existing case studies: ${existing[0].count}`);

    if (existing[0].count > 0) {
      console.log('Case studies table already has data. Skipping seed.');
      return;
    }

    console.log('Seeding case studies data...');

    const sampleCaseStudies = [
      {
        title: 'Automated Warehouse System for Pharma Logistics',
        slug: 'automated-warehouse-system-pharma-logistics',
        client_name: 'PharmaCorp Industries',
        service_type: 'automation',
        industry: 'pharmaceutical',
        short_description: 'Complete automation of warehouse operations for pharmaceutical logistics with real-time tracking.',
        challenge: 'PharmaCorp faced significant challenges with manual inventory management, leading to errors in drug tracking and compliance issues. Their existing system lacked real-time visibility and was prone to human errors.',
        solution: 'Implemented a comprehensive automated warehouse system including IoT sensors, automated guided vehicles (AGVs), and a centralized WMS. The solution integrated with their existing ERP system and provided real-time tracking of all inventory movements.',
        results: 'Reduced inventory errors by 95%, improved order fulfillment speed by 60%, and achieved full regulatory compliance. The system now handles 10,000+ SKUs with 99.9% accuracy.',
        technologies_used: 'IoT Sensors, AGVs, WMS, ERP Integration, RFID',
        project_duration: '18 months',
        status: 'published'
      },
      {
        title: 'High-Speed Elevator Installation for Commercial Tower',
        slug: 'high-speed-elevator-commercial-tower',
        client_name: 'Skyline Developers',
        service_type: 'lifts_elevators',
        industry: 'construction',
        short_description: 'Installation of 12 high-speed elevators in a 45-story commercial building with smart destination control.',
        challenge: 'The 45-story commercial tower required an efficient vertical transportation system capable of handling peak hour traffic of 5,000+ people per hour. Space constraints and energy efficiency were major concerns.',
        solution: 'Designed and installed 12 high-speed elevators with destination control system, regenerative drives for energy recovery, and smart dispatching algorithms. The system uses AI to predict traffic patterns and optimize elevator allocation.',
        results: 'Reduced average wait time by 40%, achieved energy savings of 35% through regenerative drives, and successfully handles peak hour traffic with minimal congestion.',
        technologies_used: 'Destination Control, AI Dispatching, Regenerative Drives, IoT Monitoring',
        project_duration: '24 months',
        status: 'published'
      },
      {
        title: 'Material Handling System for Automotive Manufacturing',
        slug: 'material-handling-automotive-manufacturing',
        client_name: 'AutoMax Manufacturing',
        service_type: 'material_handling',
        industry: 'automotive',
        short_description: 'End-to-end material handling system for automotive assembly line with robotic integration.',
        challenge: 'AutoMax needed to streamline their material flow from raw materials to finished vehicles. Manual handling caused bottlenecks, increased labor costs, and quality issues due to material damage.',
        solution: 'Implemented a fully automated material handling system including conveyor systems, robotic arms for component placement, automated guided vehicles for inter-line transport, and real-time tracking throughout the production line.',
        results: 'Increased production throughput by 45%, reduced material damage by 80%, and lowered labor costs by 30%. The system now supports 200 vehicles per day production capacity.',
        technologies_used: 'Conveyor Systems, Robotic Arms, AGVs, Real-time Tracking, PLC',
        project_duration: '15 months',
        status: 'published'
      },
      {
        title: 'Smart Factory Automation for Textile Production',
        slug: 'smart-factory-automation-textile-production',
        client_name: 'TexFab Industries',
        service_type: 'automation',
        industry: 'textile',
        short_description: 'Complete smart factory transformation with IoT-enabled machines and predictive maintenance.',
        challenge: 'TexFab faced high equipment downtime, inconsistent product quality, and rising energy costs. Their legacy machinery lacked modern monitoring and control capabilities.',
        solution: 'Transformed the facility into a smart factory by retrofitting machines with IoT sensors, implementing predictive maintenance algorithms, installing energy management systems, and creating a centralized digital twin for real-time monitoring.',
        results: 'Reduced unplanned downtime by 70%, improved product quality consistency by 50%, and achieved 25% energy savings. The facility now operates with 40% higher efficiency.',
        technologies_used: 'IoT Sensors, Predictive Maintenance, Digital Twin, Energy Management, SCADA',
        project_duration: '20 months',
        status: 'published'
      },
      {
        title: 'Industrial Lift System for Chemical Plant',
        slug: 'industrial-lift-system-chemical-plant',
        client_name: 'ChemPro Solutions',
        service_type: 'lifts_elevators',
        industry: 'chemical',
        short_description: 'Explosion-proof industrial lift system for hazardous chemical environment.',
        challenge: 'ChemPro required safe vertical transportation of materials and personnel in a hazardous chemical plant. The lifts needed to be explosion-proof, corrosion-resistant, and capable of handling heavy chemical containers.',
        solution: 'Designed and installed custom explosion-proof lifts with stainless steel construction, specialized sealing systems, and integrated gas detection. The lifts included emergency descent systems and redundant safety controls.',
        results: 'Achieved full compliance with safety regulations, improved material handling efficiency by 55%, and maintained zero safety incidents over 2 years of operation.',
        technologies_used: 'Explosion-proof Motors, Stainless Steel, Gas Detection, Emergency Systems',
        project_duration: '12 months',
        status: 'published'
      },
      {
        title: 'Cold Storage Warehouse for Food Distribution',
        slug: 'cold-storage-warehouse-food-distribution',
        client_name: 'FreshFood Logistics',
        service_type: 'warehouse_solutions',
        industry: 'food_beverage',
        short_description: 'Automated cold storage warehouse with temperature control and inventory management.',
        challenge: 'FreshFood needed a modern cold storage facility to maintain product quality while improving efficiency. Their existing facility had temperature inconsistencies and manual inventory processes leading to spoilage.',
        solution: 'Built a new automated cold storage warehouse with zone-based temperature control, automated inventory management, real-time temperature monitoring, and automated retrieval systems. The facility integrated with their distribution network.',
        results: 'Reduced product spoilage by 90%, improved inventory accuracy to 99.5%, and increased storage capacity by 60%. The facility maintains precise temperature control across all zones.',
        technologies_used: 'Temperature Control, Automated Storage, Real-time Monitoring, WMS',
        project_duration: '18 months',
        status: 'published'
      },
      {
        title: 'Engineering Consulting for Power Plant Expansion',
        slug: 'engineering-consulting-power-plant-expansion',
        client_name: 'PowerGen Corp',
        service_type: 'engineering',
        industry: 'energy',
        short_description: 'Complete engineering design and project management for 500MW power plant expansion.',
        challenge: 'PowerGen needed to expand their capacity by 500MW to meet growing demand. The project required complex engineering design, regulatory approvals, and coordination with multiple stakeholders within tight deadlines.',
        solution: 'Provided end-to-end engineering consulting including feasibility studies, detailed design, regulatory compliance support, project management, and construction supervision. The team used advanced simulation tools for optimization.',
        results: 'Completed the project 3 months ahead of schedule, achieved 15% cost savings through design optimization, and the plant now operates at 98% efficiency.',
        technologies_used: 'Simulation Tools, CAD, Project Management Software, SCADA Design',
        project_duration: '36 months',
        status: 'published'
      },
      {
        title: 'Construction of Aerospace Manufacturing Facility',
        slug: 'construction-aerospace-manufacturing-facility',
        client_name: 'AeroTech Manufacturing',
        service_type: 'construction',
        industry: 'aerospace',
        short_description: 'Turnkey construction of precision manufacturing facility for aerospace components.',
        challenge: 'AeroTech required a specialized manufacturing facility with strict environmental controls, vibration isolation, and clean room capabilities. The project demanded precision construction and integration of complex systems.',
        solution: 'Managed complete construction including foundation work with vibration isolation, clean room construction, HVAC systems with HEPA filtration, and integration of manufacturing equipment. The project followed aerospace industry standards.',
        results: 'Achieved ISO 14644 clean room certification, completed within budget, and the facility now produces components with 99.99% quality rate.',
        technologies_used: 'Clean Room Technology, Vibration Isolation, HVAC Systems, Precision Construction',
        project_duration: '28 months',
        status: 'published'
      },
      {
        title: 'Maintenance Optimization System for Steel Plant',
        slug: 'maintenance-optimization-steel-plant',
        client_name: 'SteelWorks Industries',
        service_type: 'maintenance',
        industry: 'manufacturing',
        short_description: 'Predictive maintenance system implementation for steel production equipment.',
        challenge: 'SteelWorks faced frequent equipment failures leading to production losses and high maintenance costs. Their reactive maintenance approach was inefficient and costly.',
        solution: 'Implemented a predictive maintenance system using vibration analysis, thermal imaging, and AI-based failure prediction. The system included mobile inspection tools and a centralized maintenance management platform.',
        results: 'Reduced unplanned downtime by 65%, lowered maintenance costs by 40%, and extended equipment life by 30%. The system now predicts failures with 85% accuracy.',
        technologies_used: 'Vibration Analysis, Thermal Imaging, AI Prediction, Mobile Inspection, CMMS',
        project_duration: '14 months',
        status: 'published'
      },
      {
        title: 'Logistics Automation for E-commerce Fulfillment',
        slug: 'logistics-automation-ecommerce-fulfillment',
        client_name: 'QuickShip Logistics',
        service_type: 'automation',
        industry: 'logistics',
        short_description: 'Automated sorting and fulfillment system for high-volume e-commerce operations.',
        challenge: 'QuickShip needed to handle increasing e-commerce volumes during peak seasons. Their manual sorting process was too slow, error-prone, and could not scale with demand.',
        solution: 'Implemented an automated sorting system with conveyor belts, barcode scanners, automated diverters, and integrated packing stations. The system included real-time order tracking and dynamic routing optimization.',
        results: 'Increased sorting capacity by 300%, reduced sorting errors to 0.1%, and improved order fulfillment speed by 70%. The system handles 50,000+ packages daily during peak season.',
        technologies_used: 'Automated Sorting, Barcode Scanning, Dynamic Routing, Real-time Tracking, WMS',
        project_duration: '16 months',
        status: 'published'
      },
      {
        title: 'Custom Lift System for Hospital Complex',
        slug: 'custom-lift-system-hospital-complex',
        client_name: 'City Hospital Group',
        service_type: 'lifts_elevators',
        industry: 'pharmaceutical',
        short_description: 'Specialized elevator system for hospital with bed-size capacity and emergency features.',
        challenge: 'The hospital complex needed elevators capable of transporting hospital beds, medical equipment, and patients safely. The system required emergency power backup, smooth operation for patient comfort, and infection control features.',
        solution: 'Designed and installed 8 specialized hospital elevators with bed-size capacity, emergency power backup, smooth acceleration profiles, and antimicrobial surfaces. The system included priority dispatch for emergencies.',
        results: 'Improved patient transport efficiency by 50%, reduced wait times during emergencies by 60%, and achieved full healthcare facility compliance. The system handles 2,000+ trips daily.',
        technologies_used: 'Hospital-grade Elevators, Emergency Power, Antimicrobial Surfaces, Priority Dispatch',
        project_duration: '22 months',
        status: 'draft'
      },
      {
        title: 'Engineering Design for Solar Power Plant',
        slug: 'engineering-design-solar-power-plant',
        client_name: 'SolarEnergy Corp',
        service_type: 'engineering',
        industry: 'energy',
        short_description: 'Complete engineering design for 100MW solar power plant installation.',
        challenge: 'SolarEnergy needed detailed engineering design for a large-scale solar installation. The project required site optimization, structural design, electrical system design, and grid integration planning.',
        solution: 'Provided comprehensive engineering services including site survey, solar array optimization, structural design for mounting systems, electrical system design, and grid connection planning. Used advanced solar modeling software.',
        results: 'Achieved 15% higher energy yield through optimized design, completed engineering 2 months ahead of schedule, and the plant operates at 97% of projected capacity.',
        technologies_used: 'Solar Modeling, Structural Analysis, Electrical Design, Grid Integration',
        project_duration: '8 months',
        status: 'draft'
      }
    ];

    for (const caseStudy of sampleCaseStudies) {
      await pool.query(
        `INSERT INTO case_studies 
         (title, slug, client_name, service_type, industry, short_description, challenge, solution, results, technologies_used, project_duration, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseStudy.title,
          caseStudy.slug,
          caseStudy.client_name,
          caseStudy.service_type,
          caseStudy.industry,
          caseStudy.short_description,
          caseStudy.challenge,
          caseStudy.solution,
          caseStudy.results,
          caseStudy.technologies_used,
          caseStudy.project_duration,
          caseStudy.status,
          1
        ]
      );
      console.log(`Inserted: ${caseStudy.title}`);
    }

    console.log('Case studies seeded successfully!');
  } catch (error) {
    console.error('Error setting up case studies:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupCaseStudies();
