USE aalto_admin;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Case studies table created successfully!' as Status;
