# API Contracts Documentation

## Overview

This document defines the API contracts between the frontend and backend for the Aalto Engineers Admin Panel. All endpoints follow RESTful conventions and return standardized responses.

## Base URL

```
http://localhost:5000/api/v1
```

## Standard Response Format

### Success Response
```typescript
{
  success: true,
  data: T,
  message?: string
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    message: string,
    code?: string,
    status?: number,
    details?: any
  }
}
```

### Paginated Response
```typescript
{
  success: true,
  data: {
    items: T[],
    pagination: {
      page: number,
      page_size: number,
      total_items: number,
      total_pages: number,
      has_next: boolean,
      has_previous: boolean
    }
  }
}
```

## Authentication Endpoints

### POST /auth/login
Login user and return access token.

**Request Body:**
```typescript
{
  email: string,
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    access_token: string,
    refresh_token: string,
    token_type: string,
    expires_in: number,
    user: {
      id: number,
      email: string,
      username: string,
      first_name: string,
      last_name: string,
      role: string,
      permissions: string[]
    }
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```typescript
{
  refresh_token: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    access_token: string,
    expires_in: number
  }
}
```

### POST /auth/change-password
Change user password.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  current_password: string,
  new_password: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Password changed successfully"
}
```

## Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: {
    total_enquiries: number,
    total_blogs: number,
    total_careers: number,
    total_applicants: number,
    pending_enquiries: number,
    published_blogs: number,
    open_careers: number,
    new_applicants: number
  }
}
```

### GET /dashboard/analytics
Get monthly analytics data.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `year`: number (optional, default: current year)

**Response:**
```typescript
{
  success: true,
  data: {
    monthly_enquiries: { month: string, count: number }[],
    monthly_applicants: { month: string, count: number }[]
  }
}
```

## Enquiries Endpoints

### GET /enquiries
Get paginated list of enquiries.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: 'new' | 'start_working' | 'on_hold' | 'spam' | 'closed'
- `service_type`: 'consulting' | 'engineering' | 'construction' | 'maintenance' | 'other'
- `assigned_to`: number
- `search`: string
- `start_date`: string (ISO date)
- `end_date`: string (ISO date)

**Response:**
```typescript
{
  success: true,
  data: {
    items: Enquiry[],
    pagination: PaginationInfo
  }
}
```

### GET /enquiries/:id
Get enquiry by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: Enquiry
}
```

### POST /enquiries
Create new enquiry.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  full_name: string,
  email: string,
  phone: string,
  company_name?: string,
  service_type: ServiceType,
  subject: string,
  description?: string,
  assigned_to?: number,
  status: EnquiryStatus,
  hold_reason?: string,
  closing_remarks?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: Enquiry
}
```

### PUT /enquiries/:id
Update enquiry.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: Enquiry
}
```

### DELETE /enquiries/:id
Delete enquiry.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Blogs Endpoints

### GET /blogs
Get paginated list of blogs.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: 'draft' | 'published' | 'unpublished'
- `category`: string
- `is_featured`: boolean
- `search`: string

**Response:**
```typescript
{
  success: true,
  data: {
    items: Blog[],
    pagination: PaginationInfo
  }
}
```

### GET /blogs/:id
Get blog by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: Blog
}
```

### POST /blogs
Create new blog.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `blog_title`: string
- `slug`: string
- `category`: string
- `featured_image`: File (optional)
- `short_description`: string (optional)
- `blog_content`: string
- `author`: string
- `tags`: string (optional)
- `meta_title`: string (optional)
- `meta_description`: string (optional)
- `status`: BlogStatus
- `is_featured`: boolean
- `publish_date`: string (optional, ISO datetime)

**Response:**
```typescript
{
  success: true,
  data: Blog
}
```

### PUT /blogs/:id
Update blog.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: Blog
}
```

### DELETE /blogs/:id
Delete blog.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Careers Endpoints

### GET /careers
Get paginated list of careers.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: 'draft' | 'open' | 'closed' | 'on_hold' | 'expired'
- `department`: string
- `employment_type`: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
- `work_mode`: 'on_site' | 'remote' | 'hybrid'
- `location`: string
- `search`: string

**Response:**
```typescript
{
  success: true,
  data: {
    items: Career[],
    pagination: PaginationInfo
  }
}
```

### GET /careers/:id
Get career by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: Career
}
```

### POST /careers
Create new career.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  job_code: string,
  job_title: string,
  department: string,
  role_category?: string,
  industry_type?: string,
  employment_type: EmploymentType,
  work_mode: WorkMode,
  location: string,
  number_of_openings: number,
  experience_required?: string,
  education_qualification?: string,
  key_skills?: string,
  description?: string,
  roles_and_responsibilities?: string,
  benefits?: string,
  application_deadline?: string (ISO date),
  status: CareerStatus
}
```

**Response:**
```typescript
{
  success: true,
  data: Career
}
```

### PUT /careers/:id
Update career.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: Career
}
```

### DELETE /careers/:id
Delete career.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Applicants Endpoints

### GET /applicants
Get paginated list of applicants.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `career_id`: number
- `status`: ApplicantStatus
- `search`: string

**Response:**
```typescript
{
  success: true,
  data: {
    items: Applicant[],
    pagination: PaginationInfo
  }
}
```

### GET /applicants/:id
Get applicant by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: Applicant
}
```

### POST /applicants
Create new applicant.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `career_id`: number
- `applicant_name`: string
- `mobile`: string
- `email`: string
- `current_location`: string (optional)
- `experience`: string (optional)
- `current_company`: string (optional)
- `current_ctc`: number (optional)
- `expected_ctc`: number (optional)
- `notice_period`: string (optional)
- `resume`: File
- `status`: ApplicantStatus
- `rejection_reason`: string (optional)
- `hold_reason`: string (optional)
- `interview_date`: string (optional, ISO datetime)
- `interview_feedback`: string (optional)

**Response:**
```typescript
{
  success: true,
  data: Applicant
}
```

### PUT /applicants/:id
Update applicant.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: Applicant
}
```

### DELETE /applicants/:id
Delete applicant.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Gallery Endpoints

### GET /gallery
Get paginated list of galleries.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `category`: string
- `status`: 'active' | 'inactive'
- `search`: string

**Response:**
```typescript
{
  success: true,
  data: {
    items: Gallery[],
    pagination: PaginationInfo
  }
}
```

### GET /gallery/:id
Get gallery by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: Gallery
}
```

### POST /gallery
Create new gallery.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `gallery_title`: string
- `category`: string
- `description`: string (optional)
- `status`: GalleryStatus
- `images`: File[] (multiple)
- `image_titles`: string[] (optional, per image)
- `alt_texts`: string[] (optional, per image)

**Response:**
```typescript
{
  success: true,
  data: Gallery
}
```

### PUT /gallery/:id
Update gallery.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: Gallery
}
```

### DELETE /gallery/:id
Delete gallery.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Case Studies Endpoints

### GET /case-studies
Get paginated list of case studies.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: 'draft' | 'published' | 'unpublished'
- `service_type`: ServiceType
- `industry`: string
- `search`: string

**Response:**
```typescript
{
  success: true,
  data: {
    items: CaseStudy[],
    pagination: PaginationInfo
  }
}
```

### GET /case-studies/:id
Get case study by ID.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: CaseStudy
}
```

### POST /case-studies
Create new case study.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `case_study_title`: string
- `slug`: string
- `client_name`: string
- `service_type`: ServiceType
- `industry`: string (optional)
- `featured_image`: File (optional)
- `short_description`: string (optional)
- `challenge`: string
- `solution`: string
- `impact`: string
- `technologies_used`: string (optional)
- `project_duration`: string (optional)
- `status`: CaseStudyStatus

**Response:**
```typescript
{
  success: true,
  data: CaseStudy
}
```

### PUT /case-studies/:id
Update case study.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:** Same as POST

**Response:**
```typescript
{
  success: true,
  data: CaseStudy
}
```

### DELETE /case-studies/:id
Delete case study.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: null
}
```

## Settings Endpoints

### GET /settings/profile
Get user profile.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: User
}
```

### PUT /settings/profile
Update user profile.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  first_name: string,
  last_name: string,
  phone?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: User
}
```

### GET /settings/notifications
Get notification preferences.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```typescript
{
  success: true,
  data: {
    email_notifications: boolean,
    push_notifications: boolean,
    enquiry_notifications: boolean,
    applicant_notifications: boolean,
    blog_notifications: boolean
  }
}
```

### PUT /settings/notifications
Update notification preferences.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:** Same as GET response

**Response:**
```typescript
{
  success: true,
  data: NotificationPreferences
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Invalid or expired token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Request validation failed |
| CONFLICT | 409 | Resource already exists |
| TOO_MANY_REQUESTS | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |
| NETWORK_ERROR | - | Network connection failed |
| REQUEST_ERROR | - | Request configuration error |

## Rate Limiting

- Default: 100 requests per minute per user
- Burst: 20 requests per second
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## File Upload Limits

- Resumes: Max 5MB, PDF/DOC/DOCX
- Images: Max 10MB per file, JPG/PNG/WEBP/GIF
- Gallery: Max 50 images per gallery

## Pagination

Default page size: 10
Maximum page size: 100

## Sorting

Supported sort fields vary by endpoint. Use `sort_by` and `sort_order` query parameters.

## Filtering

Filter parameters are additive. All filters are optional.

## Search

Full-text search is available on specific endpoints. Search matches multiple fields.

---

**Last Updated:** June 2026
**API Version:** v1
