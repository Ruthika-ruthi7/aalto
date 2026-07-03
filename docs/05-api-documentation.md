# Aalto Engineers Admin Panel - API Documentation

## Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.aaltoengineers.com/api/v1`

## Authentication

All protected endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 100,
      "total_pages": 5,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content returned
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "viewer"
}
```

### POST /auth/login
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

### POST /auth/logout
Logout user and invalidate refresh token.

### POST /auth/forgot-password
Initiate password reset process.

### POST /auth/reset-password
Reset password using reset token.

### POST /auth/change-password
Change authenticated user's password.

---

## Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics.

### GET /dashboard/analytics/enquiries
Get monthly enquiry trend analytics.

---

## Enquiry Endpoints

### GET /enquiries
Get list of enquiries with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `status`: Filter by status (new, start_working, on_hold, spam, closed)
- `service_type`: Filter by service type
- `assigned_to`: Filter by assigned user ID
- `search`: Search in name, email, company, subject
- `sort_by`: Sort field (enquiry_date, updated_at, status)
- `sort_order`: asc or desc (default: desc)
- `start_date`: Filter by start date
- `end_date`: Filter by end date

### GET /enquiries/:id
Get single enquiry by ID.

### POST /enquiries
Create a new enquiry.

### PUT /enquiries/:id
Update an existing enquiry.

### DELETE /enquiries/:id
Delete an enquiry.

### PATCH /enquiries/:id/status
Update enquiry status with conditional fields.

---

## Blog Endpoints

### GET /blogs
Get list of blogs with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `status`: Filter by status (draft, published, unpublished)
- `category`: Filter by category
- `is_featured`: Filter featured blogs (true/false)
- `search`: Search in title and description
- `sort_by`: Sort field (publish_date, created_at, views)
- `sort_order`: asc or desc (default: desc)

### GET /blogs/:id
Get single blog by ID.

### POST /blogs
Create a new blog.

### PUT /blogs/:id
Update an existing blog.

### DELETE /blogs/:id
Delete a blog.

### PATCH /blogs/:id/status
Update blog status.

---

## Career Endpoints

### GET /careers
Get list of career postings with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `status`: Filter by status (draft, open, closed, on_hold, expired)
- `department`: Filter by department
- `employment_type`: Filter by employment type
- `work_mode`: Filter by work mode
- `location`: Filter by location
- `search`: Search in title, department, skills
- `sort_by`: Sort field (posted_date, application_deadline)
- `sort_order`: asc or desc (default: desc)

### GET /careers/:id
Get single career posting by ID.

### POST /careers
Create a new career posting.

### PUT /careers/:id
Update an existing career posting.

### DELETE /careers/:id
Delete a career posting.

### PATCH /careers/:id/status
Update career status.

---

## Applicant Endpoints

### GET /applicants
Get list of applicants with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `career_id`: Filter by career ID
- `status`: Filter by status (new, under_review, shortlisted, interview_scheduled, etc.)
- `search`: Search in name, email, mobile
- `sort_by`: Sort field (applied_date, updated_at)
- `sort_order`: asc or desc (default: desc)

### GET /applicants/:id
Get single applicant by ID.

### POST /applicants
Create a new applicant record.

### PUT /applicants/:id
Update an existing applicant record.

### DELETE /applicants/:id
Delete an applicant record.

### PATCH /applicants/:id/status
Update applicant status with conditional fields.

### GET /applicants/:id/resume
Download applicant resume.

---

## Gallery Endpoints

### GET /gallery
Get list of gallery entries with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `category`: Filter by category
- `status`: Filter by status (active, inactive)
- `search`: Search in title, description
- `sort_by`: Sort field (created_at)
- `sort_order`: asc or desc (default: desc)

### GET /gallery/:id
Get single gallery entry by ID with images.

### POST /gallery
Create a new gallery entry with images.

### PUT /gallery/:id
Update an existing gallery entry.

### DELETE /gallery/:id
Delete a gallery entry.

### POST /gallery/:id/images
Upload images to a gallery.

### DELETE /gallery/:id/images/:image_id
Delete an image from a gallery.

---

## Case Study Endpoints

### GET /case-studies
Get list of case studies with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `status`: Filter by status (draft, published, unpublished)
- `service_type`: Filter by service type
- `industry`: Filter by industry
- `search`: Search in title, client name
- `sort_by`: Sort field (created_at)
- `sort_order`: asc or desc (default: desc)

### GET /case-studies/:id
Get single case study by ID.

### POST /case-studies
Create a new case study.

### PUT /case-studies/:id
Update an existing case study.

### DELETE /case-studies/:id
Delete a case study.

### PATCH /case-studies/:id/status
Update case study status.

---

## Settings Endpoints

### User Management

### GET /settings/users
Get list of users with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `role`: Filter by role
- `is_active`: Filter by active status
- `search`: Search in name, email, username
- `sort_by`: Sort field (created_at, last_name)
- `sort_order`: asc or desc (default: desc)

### GET /settings/users/:id
Get single user by ID.

### POST /settings/users
Create a new user.

### PUT /settings/users/:id
Update an existing user.

### DELETE /settings/users/:id
Delete a user.

### PATCH /settings/users/:id/activate
Activate a user account.

### PATCH /settings/users/:id/deactivate
Deactivate a user account.

### PATCH /settings/users/:id/role
Update user role.

### GET /settings/permissions
Get permission matrix for all roles.

### GET /settings/profile
Get current user profile.

### PUT /settings/profile
Update current user profile.

### POST /settings/upload-avatar
Upload user avatar.

---

## Notification Endpoints

### GET /notifications
Get list of notifications for current user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `is_read`: Filter by read status

### PATCH /notifications/:id/read
Mark notification as read.

### PATCH /notifications/read-all
Mark all notifications as read.

### DELETE /notifications/:id
Delete a notification.

---

## Activity Log Endpoints

### GET /activity-logs
Get activity logs with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `user_id`: Filter by user ID
- `action`: Filter by action
- `entity_type`: Filter by entity type
- `start_date`: Filter by start date
- `end_date`: Filter by end date
- `sort_by`: Sort field (created_at)
- `sort_order`: asc or desc (default: desc)

---

## File Upload Endpoints

### POST /upload
Upload a file.

**Request:** multipart/form-data
- `file`: File to upload
- `type`: File type (blog, career, applicant, gallery, case_study, avatar)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "file_path": "/uploads/blog/image123.jpg",
    "file_url": "http://localhost:5000/uploads/blog/image123.jpg",
    "file_size": 123456,
    "file_name": "image123.jpg"
  }
}
```

### DELETE /upload/:path
Delete a file.

---

## Export Endpoints

### GET /export/enquiries
Export enquiries as CSV.

**Query Parameters:**
- `status`: Filter by status
- `start_date`: Filter by start date
- `end_date`: Filter by end date

### GET /export/applicants
Export applicants as CSV.

### GET /export/blogs
Export blogs as CSV.

---

## Search Endpoints

### GET /search/global
Global search across all entities.

**Query Parameters:**
- `q`: Search query
- `entity_type`: Filter by entity type (enquiries, blogs, careers, etc.)
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "enquiry",
        "id": 1,
        "title": "Project Inquiry",
        "description": "Need consultation for new project",
        "url": "/enquiries/1"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_INVALID_CREDENTIALS | Invalid email or password |
| AUTH_TOKEN_EXPIRED | Access token has expired |
| AUTH_TOKEN_INVALID | Invalid or malformed token |
| AUTH_USER_INACTIVE | User account is inactive |
| AUTH_USER_LOCKED | User account is locked |
| VALIDATION_ERROR | Request validation failed |
| RESOURCE_NOT_FOUND | Requested resource does not exist |
| RESOURCE_ALREADY_EXISTS | Resource with given identifier already exists |
| PERMISSION_DENIED | Insufficient permissions |
| RATE_LIMIT_EXCEEDED | Too many requests |
| INTERNAL_ERROR | Internal server error |
