# Aalto Engineers Admin Panel - Database Schema

## Database Overview

- **Database Name**: `aalto_admin`
- **Database Type**: MySQL 8.0+
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## Tables

### 1. users

User accounts and authentication data.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'customer_admin', 'editor', 'hr', 'viewer') NOT NULL DEFAULT 'viewer',
    website_id INT NULL,  -- For customer_admin - links to their website
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
    INDEX idx_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. refresh_tokens

JWT refresh tokens for authentication.

```sql
CREATE TABLE refresh_tokens (
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
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. enquiries

Customer enquiry management.

```sql
CREATE TABLE enquiries (
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
    website_id INT NULL,  -- For multi-tenancy
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_status (status),
    INDEX idx_service_type (service_type),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_enquiry_date (enquiry_date),
    INDEX idx_website_id (website_id),
    INDEX idx_email (email),
    FULLTEXT idx_search (full_name, email, company_name, subject),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. blogs

Blog content management.

```sql
CREATE TABLE blogs (
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
    INDEX idx_author (author),
    FULLTEXT idx_search (blog_title, short_description),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. careers

Job posting management.

```sql
CREATE TABLE careers (
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
    INDEX idx_website_id (website_id),
    FULLTEXT idx_search (job_title, department, key_skills),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. applicants

Job applicant management.

```sql
CREATE TABLE applicants (
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
    INDEX idx_mobile (mobile),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. gallery

Gallery image management.

```sql
CREATE TABLE gallery (
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
    INDEX idx_website_id (website_id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. gallery_images

Individual images within a gallery.

```sql
CREATE TABLE gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    image_title VARCHAR(255),
    alt_text VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gallery_id (gallery_id),
    INDEX idx_display_order (display_order),
    FOREIGN KEY (gallery_id) REFERENCES gallery(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. case_studies

Case study management.

```sql
CREATE TABLE case_studies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_study_title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    service_type ENUM('consulting', 'engineering', 'construction', 'maintenance', 'other') NOT NULL,
    industry VARCHAR(100),
    featured_image VARCHAR(500),
    short_description TEXT,
    challenge LONGTEXT,
    solution LONGTEXT,
    impact TEXT,
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
    INDEX idx_client_name (client_name),
    FULLTEXT idx_search (case_study_title, client_name),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. activity_logs

Audit trail for all user actions.

```sql
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_values JSON NULL,
    new_values JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 11. notifications

User notifications.

```sql
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
    link VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 12. websites

Multi-tenancy support for customer admins.

```sql
CREATE TABLE websites (
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
```

## Indexes Summary

### Performance Indexes
- All foreign keys have indexes
- Frequently queried fields (status, dates, emails) have indexes
- Full-text search indexes on text fields
- Composite indexes for common query patterns

### Index Strategy
- **Primary Keys**: All tables have auto-increment primary keys
- **Unique Indexes**: Email, username, slugs, job codes
- **Foreign Key Indexes**: All foreign keys are indexed
- **Search Indexes**: Full-text indexes on searchable text fields
- **Date Indexes**: All date/datetime fields for filtering and sorting

## Data Types

### Common Patterns
- **IDs**: INT AUTO_INCREMENT
- **Names/Emails**: VARCHAR with appropriate length
- **Descriptions/Content**: TEXT or LONGTEXT
- **Status/Enums**: ENUM for fixed values
- **Dates**: DATETIME or DATE
- **Booleans**: BOOLEAN
- **JSON**: JSON for flexible data (old_values, new_values)
- **Decimals**: DECIMAL for monetary values (CTC)

## Relationships

### User Relationships
- users → refresh_tokens (1:N)
- users → enquiries (1:N, as assigned_to)
- users → blogs (1:N, as created_by/updated_by)
- users → careers (1:N, as created_by/updated_by)
- users → applicants (1:N, as created_by/updated_by)
- users → gallery (1:N, as created_by/updated_by)
- users → case_studies (1:N, as created_by/updated_by)
- users → activity_logs (1:N)
- users → notifications (1:N)

### Content Relationships
- careers → applicants (1:N)
- gallery → gallery_images (1:N)

### Multi-tenancy
- websites → users (1:N, via website_id)
- websites → enquiries (1:N, via website_id)
- websites → blogs (1:N, via website_id)
- websites → careers (1:N, via website_id)
- websites → applicants (1:N, via website_id)
- websites → gallery (1:N, via website_id)
- websites → case_studies (1:N, via website_id)

## Constraints

### Foreign Key Constraints
- ON DELETE CASCADE for dependent data (refresh_tokens, gallery_images, applicants)
- ON DELETE SET NULL for optional relationships (created_by, updated_by, assigned_to)

### Unique Constraints
- users.email
- users.username
- blogs.slug
- careers.job_code
- case_studies.slug
- websites.domain
- refresh_tokens.token

### Check Constraints (Application Level)
- Status transitions must follow defined workflows
- Application deadline cannot be in the past for open positions
- Notice period must be valid
- Phone numbers must follow format

## Data Integrity

### Timestamps
- created_at: Set on record creation
- updated_at: Auto-updated on record modification
- Soft deletes: Use is_active flag instead of hard deletes

### Audit Trail
- All major tables track created_by and updated_by
- activity_logs table tracks all changes
- JSON fields store old and new values for change tracking

## Security Considerations

### Password Storage
- Passwords stored as bcrypt hash
- Never store plain text passwords
- Salt included in hash

### Sensitive Data
- Consider encryption for PII (phone, address)
- Resume files stored securely with access controls
- IP addresses logged for security auditing

## Migration Notes

### From PHP Legacy
- Map existing PHP tables to new schema
- Transform data to match new structure
- Preserve existing IDs if possible
- Create migration scripts for data transfer
- Validate data integrity after migration

## Backup Strategy

### Backup Schedule
- Daily full backups
- Hourly incremental backups
- Retention policy: 30 days

### Backup Contents
- Full database dump
- Upload files directory
- Configuration files

## Performance Optimization

### Query Optimization
- Use EXPLAIN to analyze slow queries
- Add composite indexes for complex queries
- Consider partitioning for large tables (activity_logs)
- Use read replicas for reporting queries

### Caching Strategy
- Cache frequently accessed data (users, settings)
- Implement query result caching
- Consider Redis for session storage
