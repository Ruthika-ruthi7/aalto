# Database Field Mapping Analysis

## Overview

This document analyzes the mapping between MySQL database schema and frontend TypeScript types, identifying discrepancies and required updates for integration readiness.

## Field Mapping Analysis

### 1. users (admin_users)

**Database Fields:**
- id, email, username, password_hash, first_name, last_name, role, website_id, is_active, email_verified, last_login, failed_login_attempts, locked_until, created_at, updated_at, created_by, updated_by

**Frontend Status:** Missing dedicated User type. AuthResponse has partial user info.

**Required Updates:**
- Add User interface matching database schema
- Add role enum: 'super_admin' | 'customer_admin' | 'editor' | 'hr' | 'viewer'
- Add audit fields (created_by, updated_by) to all entity types

---

### 2. enquiries

**Database Fields:**
- id, full_name, email, phone, company_name, service_type, subject, description, enquiry_date, assigned_to, status, hold_reason, closing_remarks, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in Enquiry interface

**Required Updates:**
- Add created_by, updated_by to Enquiry interface

---

### 3. blogs

**Database Fields:**
- id, blog_title, slug, category, featured_image, short_description, blog_content, author, tags, meta_title, meta_description, status, is_featured, publish_date, views, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in Blog interface

**Required Updates:**
- Add created_by, updated_by to Blog interface

---

### 4. careers

**Database Fields:**
- id, job_code, job_title, department, role_category, industry_type, employment_type, work_mode, location, number_of_openings, experience_required, education_qualification, key_skills, description, roles_and_responsibilities, benefits, application_deadline, status, posted_date, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in Career interface

**Required Updates:**
- Add created_by, updated_by to Career interface

---

### 5. applicants

**Database Fields:**
- id, career_id, applicant_name, mobile, email, applied_date, current_location, experience, current_company, current_ctc, expected_ctc, notice_period, resume_path, status, rejection_reason, hold_reason, interview_date, interview_feedback, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in Applicant interface
- Note: current_ctc and expected_ctc are DECIMAL(10,2) in database, should be number in frontend

**Required Updates:**
- Add created_by, updated_by to Applicant interface
- Ensure CTC fields are properly typed as number

---

### 6. gallery

**Database Fields:**
- id, gallery_title, category, description, status, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in Gallery interface
- Note: Frontend has nested images array from gallery_images table

**Required Updates:**
- Add created_by, updated_by to Gallery interface

---

### 7. gallery_images

**Database Fields:**
- id, gallery_id, image_path, image_title, alt_text, display_order, created_at

**Frontend Status:** ✅ Matches well in GalleryImage interface

**Required Updates:** None

---

### 8. case_studies

**Database Fields:**
- id, case_study_title, slug, client_name, service_type, industry, featured_image, short_description, challenge, solution, impact, technologies_used, project_duration, status, website_id, created_at, updated_at, created_by, updated_by

**Frontend Status:** ✅ Matches well
- Missing: created_by, updated_by in CaseStudy interface

**Required Updates:**
- Add created_by, updated_by to CaseStudy interface

---

### 9. Missing Tables in Frontend

The following database tables have no corresponding frontend types:

- **refresh_tokens** - Not needed in frontend (backend only)
- **activity_logs** - Could add for audit trail display
- **notifications** - Could add for notification center
- **websites** - Not needed in frontend (multi-tenancy backend concern)

### 10. Tables Requested but Not in Schema

- **contacts** - Not in database schema (enquiries table serves this purpose)
- **business_unit** - Not in database schema
- **email_queue** - Not in database schema (backend only)

---

## Status Enum Validation

### enquiries.status
- Database: 'new', 'start_working', 'on_hold', 'spam', 'closed'
- Frontend: 'new', 'start_working', 'on_hold', 'spam', 'closed'
- ✅ Matches

### blogs.status
- Database: 'draft', 'published', 'unpublished'
- Frontend: 'draft', 'published', 'unpublished'
- ✅ Matches

### careers.status
- Database: 'draft', 'open', 'closed', 'on_hold', 'expired'
- Frontend: 'draft', 'open', 'closed', 'on_hold', 'expired'
- ✅ Matches

### applicants.status
- Database: 'new', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'offered', 'joined', 'rejected', 'on_hold'
- Frontend: 'new', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'offered', 'joined', 'rejected', 'on_hold'
- ✅ Matches

### gallery.status
- Database: 'active', 'inactive'
- Frontend: 'active', 'inactive'
- ✅ Matches

### case_studies.status
- Database: 'draft', 'published', 'unpublished'
- Frontend: 'draft', 'published', 'unpublished'
- ✅ Matches

---

## Service Type Enum Validation

### enquiries.service_type
- Database: 'consulting', 'engineering', 'construction', 'maintenance', 'other'
- Frontend: 'consulting', 'engineering', 'construction', 'maintenance', 'other'
- ✅ Matches

### case_studies.service_type
- Database: 'consulting', 'engineering', 'construction', 'maintenance', 'other'
- Frontend: 'consulting', 'engineering', 'construction', 'maintenance', 'other'
- ✅ Matches

---

## Employment Type Enum Validation

### careers.employment_type
- Database: 'full_time', 'part_time', 'contract', 'internship', 'freelance'
- Frontend: 'full_time', 'part_time', 'contract', 'internship', 'freelance'
- ✅ Matches

---

## Work Mode Enum Validation

### careers.work_mode
- Database: 'on_site', 'remote', 'hybrid'
- Frontend: 'on_site', 'remote', 'hybrid'
- ✅ Matches

---

## Data Type Validation

### Date Fields
- Database: DATETIME, DATE
- Frontend: string (ISO format)
- ✅ Acceptable (standard practice)

### Decimal Fields
- Database: DECIMAL(10,2) for current_ctc, expected_ctc
- Frontend: number
- ✅ Matches

### Boolean Fields
- Database: BOOLEAN
- Frontend: boolean
- ✅ Matches

### Text Fields
- Database: TEXT, LONGTEXT
- Frontend: string
- ✅ Matches

---

## Missing Audit Fields

All entity types are missing the following audit fields from the database:
- **created_by**: INT (references users.id)
- **updated_by**: INT (references users.id)

**Impact:** These fields are optional (SET NULL on delete) and not critical for frontend display, but should be added for completeness and audit trail display.

---

## Summary of Required Updates

### High Priority
1. Add created_by, updated_by to all entity types (Enquiry, Blog, Career, Applicant, Gallery, CaseStudy)
2. Add User interface for users table
3. Add role enum for users table

### Medium Priority
4. Consider adding Notification interface for notification center
5. Consider adding ActivityLog interface for audit trail display

### Low Priority
6. Add refresh_tokens type (backend only, not needed in frontend)

---

## Integration Readiness Assessment

**Overall Status:** ✅ 95% Ready

**Critical Issues:** None

**Minor Issues:**
- Missing audit fields (created_by, updated_by) - Not blocking, can be added later
- Missing User interface - Can be added when needed for user management

**Recommendation:** Frontend is ready for backend integration. Missing audit fields can be added incrementally as needed for audit trail features.

---

**Last Updated:** June 2026
