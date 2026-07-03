# Database Schema Comparison Report

## Database Information

**Database Name**: `aalto_admin` (from provided credentials)
**Schema Source**: `docs/03-database-schema.md`
**Analysis Date**: June 2026

## Requested Tables vs Actual Schema

### Table Comparison

| Requested Table | Actual Table | Status | Notes |
|-----------------|--------------|--------|-------|
| admin_users | users | ⚠️ Name Mismatch | Schema uses `users`, not `admin_users` |
| contacts | enquiries | ⚠️ Name Mismatch | Schema uses `enquiries` for contact management |
| blog | blogs | ✅ Match | Table exists as `blogs` |
| careers | careers | ✅ Match | Table exists as `careers` |
| applicants | applicants | ✅ Match | Table exists as `applicants` |
| gallery | gallery | ✅ Match | Table exists as `gallery` |
| business_unit | - | ❌ Not Found | Table does not exist in schema |
| email_queue | - | ❌ Not Found | Table does not exist in schema |

### Additional Tables in Schema

The following tables exist in the schema but were not requested:
- `users` (admin_users equivalent)
- `refresh_tokens` - JWT refresh tokens
- `gallery_images` - Individual images within galleries
- `case_studies` - Case study management
- `activity_logs` - Audit trail
- `notifications` - User notifications
- `websites` - Multi-tenancy support

## Detailed Table Analysis

### 1. users (Requested as admin_users)

**Database Schema**:
```sql
CREATE TABLE users (
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

**Frontend Type** (`auth.types.ts`):
```typescript
export interface AuthResponse {
  user: {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    role: string
    permissions: string[]
  }
}
```

**Frontend Type** (`common.types.ts`):
```typescript
export interface User {
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

**Status**: ✅ Frontend types match database schema
**Note**: Frontend uses `User` interface which matches the `users` table

---

### 2. enquiries (Requested as contacts)

**Database Schema**:
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
    website_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL
)
```

**Frontend Type** (`enquiry.types.ts`):
```typescript
export interface Enquiry {
  id: number
  full_name: string
  email: string
  phone: string
  company_name?: string
  service_type: ServiceType
  subject: string
  description?: string
  enquiry_date: string
  assigned_to?: { id: number; first_name: string; last_name: string }
  status: EnquiryStatus
  hold_reason?: string
  closing_remarks?: string
  website_id?: number
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}
```

**Status**: ✅ Frontend types match database schema
**Note**: Schema uses `enquiries` table for contact management (not a separate `contacts` table)

---

### 3. blogs

**Database Schema**:
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
    updated_by INT NULL
)
```

**Frontend Type** (`blog.types.ts`):
```typescript
export interface Blog {
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
  status: BlogStatus
  is_featured: boolean
  publish_date?: string
  views: number
  website_id?: number
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}
```

**Status**: ✅ Frontend types match database schema

---

### 4. careers

**Database Schema**:
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
    updated_by INT NULL
)
```

**Frontend Type** (`career.types.ts`):
```typescript
export interface Career {
  id: number
  job_code: string
  job_title: string
  department: string
  role_category?: string
  industry_type?: string
  employment_type: EmploymentType
  work_mode: WorkMode
  location: string
  number_of_openings: number
  experience_required?: string
  education_qualification?: string
  key_skills?: string
  description?: string
  roles_and_responsibilities?: string
  benefits?: string
  application_deadline?: string
  status: CareerStatus
  posted_date: string
  website_id?: number
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}
```

**Status**: ✅ Frontend types match database schema

---

### 5. applicants

**Database Schema**:
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
    updated_by INT NULL
)
```

**Frontend Type** (`applicant.types.ts`):
```typescript
export interface Applicant {
  id: number
  career_id: number
  career?: { id: number; job_title: string; job_code: string }
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
  status: ApplicantStatus
  rejection_reason?: string
  hold_reason?: string
  interview_date?: string
  interview_feedback?: string
  website_id?: number
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}
```

**Status**: ✅ Frontend types match database schema

---

### 6. gallery

**Database Schema**:
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
    updated_by INT NULL
)
```

**Frontend Type** (`gallery.types.ts`):
```typescript
export interface Gallery {
  id: number
  gallery_title: string
  category: string
  description?: string
  status: GalleryStatus
  images: GalleryImage[]
  website_id?: number
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}
```

**Status**: ✅ Frontend types match database schema
**Note**: Frontend includes nested `images` array from `gallery_images` table

---

### 7. business_unit

**Status**: ❌ Table does not exist in database schema
**Recommendation**: This table is not part of the current schema. If needed, it must be created separately.

---

### 8. email_queue

**Status**: ❌ Table does not exist in database schema
**Recommendation**: This table is not part of the current schema. Email queue functionality would need to be implemented separately.

---

## Status Enum Validation

### enquiries.status
- Database: `'new', 'start_working', 'on_hold', 'spam', 'closed'`
- Frontend: `'new', 'start_working', 'on_hold', 'spam', 'closed'`
- **Status**: ✅ Match

### blogs.status
- Database: `'draft', 'published', 'unpublished'`
- Frontend: `'draft', 'published', 'unpublished'`
- **Status**: ✅ Match

### careers.status
- Database: `'draft', 'open', 'closed', 'on_hold', 'expired'`
- Frontend: `'draft', 'open', 'closed', 'on_hold', 'expired'`
- **Status**: ✅ Match

### applicants.status
- Database: `'new', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'offered', 'joined', 'rejected', 'on_hold'`
- Frontend: `'new', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'offered', 'joined', 'rejected', 'on_hold'`
- **Status**: ✅ Match

### gallery.status
- Database: `'active', 'inactive'`
- Frontend: `'active', 'inactive'`
- **Status**: ✅ Match

### case_studies.status
- Database: `'draft', 'published', 'unpublished'`
- Frontend: `'draft', 'published', 'unpublished'`
- **Status**: ✅ Match

## Service Type Enum Validation

### enquiries.service_type
- Database: `'consulting', 'engineering', 'construction', 'maintenance', 'other'`
- Frontend: `'consulting', 'engineering', 'construction', 'maintenance', 'other'`
- **Status**: ✅ Match

### case_studies.service_type
- Database: `'consulting', 'engineering', 'construction', 'maintenance', 'other'`
- Frontend: `'consulting', 'engineering', 'construction', 'maintenance', 'other'`
- **Status**: ✅ Match

## Employment Type Enum Validation

### careers.employment_type
- Database: `'full_time', 'part_time', 'contract', 'internship', 'freelance'`
- Frontend: `'full_time', 'part_time', 'contract', 'internship', 'freelance'`
- **Status**: ✅ Match

## Work Mode Enum Validation

### careers.work_mode
- Database: `'on_site', 'remote', 'hybrid'`
- Frontend: `'on_site', 'remote', 'hybrid'`
- **Status**: ✅ Match

## Summary

### ✅ Matching Tables (6)
1. users (admin_users) - Frontend types match
2. enquiries (contacts) - Frontend types match
3. blogs - Frontend types match
4. careers - Frontend types match
5. applicants - Frontend types match
6. gallery - Frontend types match

### ❌ Missing Tables (2)
1. business_unit - Not in schema
2. email_queue - Not in schema

### ⚠️ Name Mismatches (2)
1. admin_users → users (schema uses users)
2. contacts → enquiries (schema uses enquiries for contact management)

### ✅ All Status Enums Match
All status enums in frontend match database constraints exactly.

### ✅ All Service Type Enums Match
All service type enums in frontend match database constraints exactly.

### ✅ All Employment/Work Mode Enums Match
All employment and work mode enums in frontend match database constraints exactly.

## Recommendations

1. **No frontend type changes required** - All existing frontend types match the database schema
2. **Document table name mappings** - Clarify that `admin_users` maps to `users` and `contacts` maps to `enquiries`
3. **Address missing tables** - If `business_unit` or `email_queue` are required, they need to be added to the database schema
4. **Proceed with integration** - Frontend is ready for backend API integration with the existing schema

---

**Report Generated**: June 2026
**Database**: aalto_admin
**Schema Version**: From docs/03-database-schema.md
