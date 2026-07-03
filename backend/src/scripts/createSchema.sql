-- Aalto Engineers Admin Panel - Database Schema
-- Database: aalto_admin
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci

USE aalto_admin;

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'customer_admin', 'editor', 'hr', 'viewer') NOT NULL DEFAULT 'viewer',
    website_id INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login DATETIME NULL,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_website_id (website_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at DATETIME NULL,
    revoked_by INT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    service_type ENUM('consulting', 'engineering', 'construction', 'maintenance', 'other') NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT,
    enquiry_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_to INT NULL,
    status ENUM('new', 'start_working', 'on_hold', 'spam', 'closed') NOT NULL DEFAULT 'new',
    hold_reason TEXT NULL,
    closing_remarks TEXT NULL,
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_status (status),
    INDEX idx_service_type (service_type),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_enquiry_date (enquiry_date),
    INDEX idx_website_id (website_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    featured_image VARCHAR(500),
    short_description TEXT,
    blog_content LONGTEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    tags VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    status ENUM('draft', 'published', 'unpublished') NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    publish_date DATETIME NULL,
    views INT NOT NULL DEFAULT 0,
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_publish_date (publish_date),
    INDEX idx_website_id (website_id),
    INDEX idx_author (author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. careers table
CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_code VARCHAR(50) NOT NULL UNIQUE,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role_category VARCHAR(100),
    industry_type VARCHAR(100),
    employment_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance') NOT NULL,
    work_mode ENUM('on_site', 'remote', 'hybrid') NOT NULL,
    location VARCHAR(255) NOT NULL,
    number_of_openings INT NOT NULL DEFAULT 1,
    experience_required VARCHAR(100),
    education_qualification TEXT,
    key_skills TEXT,
    description LONGTEXT,
    roles_and_responsibilities LONGTEXT,
    benefits TEXT,
    application_deadline DATE,
    status ENUM('draft', 'open', 'closed', 'on_hold', 'expired') NOT NULL DEFAULT 'draft',
    posted_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_job_code (job_code),
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_employment_type (employment_type),
    INDEX idx_location (location),
    INDEX idx_application_deadline (application_deadline),
    INDEX idx_website_id (website_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. applicants table
CREATE TABLE IF NOT EXISTS applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    applied_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_location VARCHAR(255),
    experience VARCHAR(100),
    current_company VARCHAR(255),
    current_ctc DECIMAL(10, 2),
    expected_ctc DECIMAL(10, 2),
    notice_period VARCHAR(50),
    resume_path VARCHAR(500) NOT NULL,
    status ENUM('new', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'offered', 'joined', 'rejected', 'on_hold') NOT NULL DEFAULT 'new',
    rejection_reason TEXT NULL,
    hold_reason TEXT NULL,
    interview_date DATETIME NULL,
    interview_feedback TEXT NULL,
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_career_id (career_id),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_applied_date (applied_date),
    INDEX idx_website_id (website_id),
    INDEX idx_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. gallery table
CREATE TABLE IF NOT EXISTS galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_website_id (website_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    image_title VARCHAR(255),
    alt_text VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gallery_id (gallery_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    service_type ENUM('consulting', 'engineering', 'construction', 'maintenance', 'other') NOT NULL,
    industry VARCHAR(100),
    featured_image VARCHAR(500),
    description TEXT,
    challenge LONGTEXT,
    solution LONGTEXT,
    results TEXT,
    technologies_used TEXT,
    project_duration VARCHAR(100),
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
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

-- 10. websites table
CREATE TABLE IF NOT EXISTS websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints after all tables are created
ALTER TABLE refresh_tokens
ADD CONSTRAINT fk_refresh_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_refresh_tokens_revoked_by FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE enquiries
ADD CONSTRAINT fk_enquiries_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_enquiries_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_enquiries_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE blogs
ADD CONSTRAINT fk_blogs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_blogs_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE careers
ADD CONSTRAINT fk_careers_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_careers_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE applicants
ADD CONSTRAINT fk_applicants_career_id FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_applicants_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_applicants_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE galleries
ADD CONSTRAINT fk_galleries_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_galleries_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE gallery_images
ADD CONSTRAINT fk_gallery_images_gallery_id FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE;

ALTER TABLE case_studies
ADD CONSTRAINT fk_case_studies_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_case_studies_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE users
ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_users_website_id FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE SET NULL;

SELECT 'Schema created successfully!' as Status;
