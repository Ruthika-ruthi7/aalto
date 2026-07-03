# Database Field Mappings - Frontend Integration

## Overview

This document maps the MySQL database schema to frontend TypeScript types, form fields, and validation rules.

---

## Users Table

### Database Schema
```sql
users (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role: 'super_admin' | 'customer_admin' | 'editor' | 'hr' | 'viewer'
  website_id?: number
  is_active: boolean
  email_verified: boolean
  last_login?: string
  permissions?: string[]
}
```

### Form Fields (User Management)
- **email**: text input, required, email validation
- **username**: text input, required, min 3 chars, alphanumeric
- **first_name**: text input, required, min 2 chars
- **last_name**: text input, required, min 2 chars
- **role**: select dropdown, required
- **website_id**: select dropdown (for customer_admin), optional
- **is_active**: boolean toggle

### Validation Rules
- email: valid email format, unique
- username: 3-50 chars, alphanumeric + underscore, unique
- first_name: 2-100 chars, letters only
- last_name: 2-100 chars, letters only
- password (create): min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special

---

## Enquiries Table

### Database Schema
```sql
enquiries (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface Enquiry {
  id: number
  full_name: string
  email: string
  phone: string
  company_name?: string
  service_type: 'consulting' | 'engineering' | 'construction' | 'maintenance' | 'other'
  subject: string
  description?: string
  enquiry_date: string
  assigned_to?: {
    id: number
    first_name: string
    last_name: string
  }
  status: 'new' | 'start_working' | 'on_hold' | 'spam' | 'closed'
  hold_reason?: string
  closing_remarks?: string
  website_id?: number
  created_at: string
  updated_at: string
}
```

### Form Fields (Create/Edit)
- **full_name**: text input, required, min 2 chars
- **email**: text input, required, email validation
- **phone**: text input, required, phone format
- **company_name**: text input, optional
- **service_type**: select dropdown, required
- **subject**: text input, required, max 500 chars
- **description**: textarea, optional
- **assigned_to**: select dropdown (users), optional
- **status**: select dropdown, required

### Conditional Fields
- **hold_reason**: textarea, required when status = 'on_hold'
- **closing_remarks**: textarea, required when status = 'closed'

### Validation Rules
- full_name: 2-255 chars
- email: valid email format
- phone: valid phone format (international)
- subject: 5-500 chars
- description: max 5000 chars
- hold_reason: required if status = on_hold, max 1000 chars
- closing_remarks: required if status = closed, max 1000 chars

### Table Columns (List View)
- full_name
- service_type (badge)
- subject
- phone
- assigned_to
- enquiry_date
- last_updated
- status (badge)
- actions (edit, view, delete)

---

## Blogs Table

### Database Schema
```sql
blogs (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface Blog {
  id: number
  blog_title: string
  slug: string
  category: string
  featured_image?: string
  short_description?: string
  blog_content: string
  author: string
  tags?: string
  meta_title?: string
  meta_description?: string
  status: 'draft' | 'published' | 'unpublished'
  is_featured: boolean
  publish_date?: string
  views: number
  website_id?: number
  created_at: string
  updated_at: string
}
```

### Form Fields (Create/Edit)
- **blog_title**: text input, required, max 500 chars
- **slug**: text input, auto-generated from title, editable, unique
- **category**: text input, required, max 100 chars
- **featured_image**: file upload (image), optional
- **short_description**: textarea, optional, max 500 chars
- **blog_content**: rich text editor, required
- **author**: text input, required, max 255 chars
- **tags**: text input (comma-separated), optional
- **meta_title**: text input, optional, max 255 chars
- **meta_description**: textarea, optional, max 500 chars
- **status**: select dropdown, required
- **is_featured**: boolean toggle
- **publish_date**: datetime picker, required if status = 'published'

### Validation Rules
- blog_title: 5-500 chars
- slug: 5-500 chars, alphanumeric + hyphen, unique
- category: 2-100 chars
- short_description: max 500 chars
- blog_content: min 50 chars
- author: 2-255 chars
- tags: max 500 chars
- meta_title: max 255 chars
- meta_description: max 500 chars

### Table Columns (List View)
- featured_image (thumbnail)
- blog_title
- category (badge)
- author
- publish_date
- views
- status (badge)
- last_updated
- actions (edit, view, delete)

---

## Careers Table

### Database Schema
```sql
careers (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface Career {
  id: number
  job_code: string
  job_title: string
  department: string
  role_category?: string
  industry_type?: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
  work_mode: 'on_site' | 'remote' | 'hybrid'
  location: string
  number_of_openings: number
  experience_required?: string
  education_qualification?: string
  key_skills?: string
  description?: string
  roles_and_responsibilities?: string
  benefits?: string
  application_deadline?: string
  status: 'draft' | 'open' | 'closed' | 'on_hold' | 'expired'
  posted_date: string
  website_id?: number
  created_at: string
  updated_at: string
}
```

### Form Fields (Create/Edit)
- **job_code**: text input, required, auto-generated, unique
- **job_title**: text input, required, max 255 chars
- **department**: text input, required, max 100 chars
- **role_category**: text input, optional, max 100 chars
- **industry_type**: text input, optional, max 100 chars
- **employment_type**: select dropdown, required
- **work_mode**: select dropdown, required
- **location**: text input, required, max 255 chars
- **number_of_openings**: number input, required, min 1
- **experience_required**: text input, optional, max 100 chars
- **education_qualification**: textarea, optional
- **key_skills**: textarea, optional
- **description**: rich text editor, optional
- **roles_and_responsibilities**: rich text editor, optional
- **benefits**: textarea, optional
- **application_deadline**: date picker, optional
- **status**: select dropdown, required

### Validation Rules
- job_code: 3-50 chars, alphanumeric, unique
- job_title: 5-255 chars
- department: 2-100 chars
- location: 2-255 chars
- number_of_openings: min 1, max 100
- experience_required: max 100 chars
- key_skills: max 1000 chars
- application_deadline: must be future date for open status

### Table Columns (List View)
- job_code
- job_title
- department
- location
- experience
- employment_type (badge)
- openings
- posted_date
- last_updated
- status (badge)
- actions (edit, view, delete)

---

## Applicants Table

### Database Schema
```sql
applicants (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface Applicant {
  id: number
  career_id: number
  career?: {
    id: number
    job_title: string
    job_code: string
  }
  applicant_name: string
  mobile: string
  email: string
  applied_date: string
  current_location?: string
  experience?: string
  current_company?: string
  current_ctc?: number
  expected_ctc?: number
  notice_period?: string
  resume_path: string
  status: 'new' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'interview_completed' | 'selected' | 'offered' | 'joined' | 'rejected' | 'on_hold'
  rejection_reason?: string
  hold_reason?: string
  interview_date?: string
  interview_feedback?: string
  website_id?: number
  created_at: string
  updated_at: string
}
```

### Form Fields (Create/Edit)
- **career_id**: select dropdown (careers), required
- **applicant_name**: text input, required, min 2 chars
- **mobile**: text input, required, phone format
- **email**: text input, required, email validation
- **current_location**: text input, optional, max 255 chars
- **experience**: text input, optional, max 100 chars
- **current_company**: text input, optional, max 255 chars
- **current_ctc**: number input, optional, min 0
- **expected_ctc**: number input, optional, min 0
- **notice_period**: text input, optional, max 50 chars
- **resume_path**: file upload (PDF/DOC), required
- **status**: select dropdown, required
- **interview_date**: datetime picker, optional
- **interview_feedback**: textarea, optional

### Conditional Fields
- **rejection_reason**: textarea, required when status = 'rejected'
- **hold_reason**: textarea, required when status = 'on_hold'
- **interview_date**: required when status = 'interview_scheduled'

### Validation Rules
- applicant_name: 2-255 chars
- mobile: valid phone format
- email: valid email format
- current_ctc: min 0, max 10000000
- expected_ctc: min 0, max 10000000
- notice_period: max 50 chars
- resume: PDF/DOC, max 5MB
- rejection_reason: required if status = rejected, max 1000 chars
- hold_reason: required if status = on_hold, max 1000 chars

### Table Columns (List View)
- applicant_name
- career (job_title)
- mobile
- email
- applied_date
- current_location
- experience
- status (badge)
- actions (edit, view, download resume, delete)

---

## Gallery Table

### Database Schema
```sql
gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gallery_title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  website_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL
)

gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gallery_id INT NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  image_title VARCHAR(255),
  alt_text VARCHAR(255),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### Frontend TypeScript Type
```typescript
interface Gallery {
  id: number
  gallery_title: string
  category: string
  description?: string
  status: 'active' | 'inactive'
  images: GalleryImage[]
  website_id?: number
  created_at: string
  updated_at: string
}

interface GalleryImage {
  id: number
  gallery_id: number
  image_path: string
  image_title?: string
  alt_text?: string
  display_order: number
  created_at: string
}
```

### Form Fields (Create/Edit)
- **gallery_title**: text input, required, max 255 chars
- **category**: text input, required, max 100 chars
- **description**: textarea, optional
- **status**: select dropdown, required
- **images**: file upload (multiple images), max 50 images
  - image_title: text input per image, optional
  - alt_text: text input per image, optional

### Validation Rules
- gallery_title: 5-255 chars
- category: 2-100 chars
- description: max 2000 chars
- images: max 50, each max 10MB, JPG/PNG/WEBP
- image_title: max 255 chars
- alt_text: max 255 chars

### Table Columns (List View)
- gallery_title
- category (badge)
- image_count
- status (badge)
- created_at
- actions (edit, view, delete)

---

## Case Studies Table

### Database Schema
```sql
case_studies (
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
  updated_by INT NULL
)
```

### Frontend TypeScript Type
```typescript
interface CaseStudy {
  id: number
  case_study_title: string
  slug: string
  client_name: string
  service_type: 'consulting' | 'engineering' | 'construction' | 'maintenance' | 'other'
  industry?: string
  featured_image?: string
  short_description?: string
  challenge?: string
  solution?: string
  impact?: string
  technologies_used?: string
  project_duration?: string
  status: 'draft' | 'published' | 'unpublished'
  website_id?: number
  created_at: string
  updated_at: string
}
```

### Form Fields (Create/Edit)
- **case_study_title**: text input, required, max 500 chars
- **slug**: text input, auto-generated, editable, unique
- **client_name**: text input, required, max 255 chars
- **service_type**: select dropdown, required
- **industry**: text input, optional, max 100 chars
- **featured_image**: file upload (image), optional
- **short_description**: textarea, optional, max 500 chars
- **challenge**: rich text editor, optional
- **solution**: rich text editor, optional
- **impact**: textarea, optional
- **technologies_used**: text input (comma-separated), optional
- **project_duration**: text input, optional, max 100 chars
- **status**: select dropdown, required

### Validation Rules
- case_study_title: 5-500 chars
- slug: 5-500 chars, alphanumeric + hyphen, unique
- client_name: 2-255 chars
- industry: max 100 chars
- short_description: max 500 chars
- technologies_used: max 500 chars
- project_duration: max 100 chars

### Table Columns (List View)
- featured_image (thumbnail)
- case_study_title
- client_name
- service_type (badge)
- industry
- status (badge)
- created_at
- actions (edit, view, delete)

---

## Activity Logs Table

### Database Schema
```sql
activity_logs (
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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### Frontend TypeScript Type
```typescript
interface ActivityLog {
  id: number
  user_id?: number
  user?: {
    id: number
    first_name: string
    last_name: string
  }
  action: string
  entity_type: string
  entity_id: number
  description?: string
  ip_address?: string
  user_agent?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  created_at: string
}
```

---

## Notifications Table

### Database Schema
```sql
notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
  link VARCHAR(500) NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL
)
```

### Frontend TypeScript Type
```typescript
interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  link?: string
  is_read: boolean
  created_at: string
  read_at?: string
}
```

---

## Websites Table (Multi-tenancy)

### Database Schema
```sql
websites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Frontend TypeScript Type
```typescript
interface Website {
  id: number
  name: string
  domain: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

---

## API Endpoint Mappings

### Authentication
- POST /api/v1/auth/login → Login
- POST /api/v1/auth/register → Register
- POST /api/v1/auth/refresh → Refresh Token
- POST /api/v1/auth/logout → Logout
- POST /api/v1/auth/forgot-password → Forgot Password
- POST /api/v1/auth/reset-password → Reset Password
- POST /api/v1/auth/change-password → Change Password

### Dashboard
- GET /api/v1/dashboard/stats → Dashboard Statistics
- GET /api/v1/dashboard/analytics/enquiries → Enquiry Analytics

### Enquiries
- GET /api/v1/enquiries → List Enquiries
- GET /api/v1/enquiries/:id → Get Enquiry
- POST /api/v1/enquiries → Create Enquiry
- PUT /api/v1/enquiries/:id → Update Enquiry
- DELETE /api/v1/enquiries/:id → Delete Enquiry
- PATCH /api/v1/enquiries/:id/status → Update Status

### Blogs
- GET /api/v1/blogs → List Blogs
- GET /api/v1/blogs/:id → Get Blog
- POST /api/v1/blogs → Create Blog
- PUT /api/v1/blogs/:id → Update Blog
- DELETE /api/v1/blogs/:id → Delete Blog
- PATCH /api/v1/blogs/:id/status → Update Status

### Careers
- GET /api/v1/careers → List Careers
- GET /api/v1/careers/:id → Get Career
- POST /api/v1/careers → Create Career
- PUT /api/v1/careers/:id → Update Career
- DELETE /api/v1/careers/:id → Delete Career
- PATCH /api/v1/careers/:id/status → Update Status

### Applicants
- GET /api/v1/applicants → List Applicants
- GET /api/v1/applicants/:id → Get Applicant
- POST /api/v1/applicants → Create Applicant
- PUT /api/v1/applicants/:id → Update Applicant
- DELETE /api/v1/applicants/:id → Delete Applicant
- PATCH /api/v1/applicants/:id/status → Update Status
- GET /api/v1/applicants/:id/resume → Download Resume

### Gallery
- GET /api/v1/gallery → List Gallery
- GET /api/v1/gallery/:id → Get Gallery
- POST /api/v1/gallery → Create Gallery
- PUT /api/v1/gallery/:id → Update Gallery
- DELETE /api/v1/gallery/:id → Delete Gallery
- POST /api/v1/gallery/:id/images → Upload Images
- DELETE /api/v1/gallery/:id/images/:image_id → Delete Image

### Case Studies
- GET /api/v1/case-studies → List Case Studies
- GET /api/v1/case-studies/:id → Get Case Study
- POST /api/v1/case-studies → Create Case Study
- PUT /api/v1/case-studies/:id → Update Case Study
- DELETE /api/v1/case-studies/:id → Delete Case Study
- PATCH /api/v1/case-studies/:id/status → Update Status

### Settings
- GET /api/v1/settings/users → List Users
- GET /api/v1/settings/users/:id → Get User
- POST /api/v1/settings/users → Create User
- PUT /api/v1/settings/users/:id → Update User
- DELETE /api/v1/settings/users/:id → Delete User
- PATCH /api/v1/settings/users/:id/activate → Activate User
- PATCH /api/v1/settings/users/:id/deactivate → Deactivate User
- PATCH /api/v1/settings/users/:id/role → Update Role
- GET /api/v1/settings/profile → Get Profile
- PUT /api/v1/settings/profile → Update Profile
- POST /api/v1/settings/upload-avatar → Upload Avatar

### Notifications
- GET /api/v1/notifications → List Notifications
- PATCH /api/v1/notifications/:id/read → Mark as Read
- PATCH /api/v1/notifications/read-all → Mark All as Read
- DELETE /api/v1/notifications/:id → Delete Notification

### Activity Logs
- GET /api/v1/activity-logs → List Activity Logs

### File Upload
- POST /api/v1/upload → Upload File
- DELETE /api/v1/upload/:path → Delete File

### Export
- GET /api/v1/export/enquiries → Export Enquiries CSV
- GET /api/v1/export/applicants → Export Applicants CSV
- GET /api/v1/export/blogs → Export Blogs CSV

### Search
- GET /api/v1/search/global → Global Search
