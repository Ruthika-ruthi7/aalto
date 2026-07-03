# Validation Rules and Form Schemas

This document outlines all validation rules and form schemas used across the Aalto Engineers Admin Panel.

## Overview

All forms use client-side validation with real-time error feedback. Validation is performed using React Hook Form with custom validation functions. Each module has specific validation rules based on business requirements.

## Common Validation Rules

### Email Validation
- **Pattern**: Standard email format
- **Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Error**: "Invalid email format"

### Phone Validation
- **Pattern**: 10-20 characters, digits and special characters allowed
- **Regex**: `/^[\d\s\+\-\(\)]{10,20}$/`
- **Error**: "Invalid phone number format"

### Required Fields
- **Rule**: Field cannot be empty or whitespace only
- **Error**: "{Field name} is required"

### Length Validation
- **Min Length**: "{Field name} must be at least {n} characters"
- **Max Length**: "{Field name} must be less than {n} characters"

### Date Validation
- **Future Date**: For deadlines, must be future date when status is active/open
- **Error**: "{Field name} must be a future date"

### File Upload Validation
- **Max Size**: 5MB for resumes, 10MB for images
- **Allowed Types**: 
  - Resumes: PDF, DOC, DOCX
  - Images: JPG, PNG, WEBP, GIF
- **Error**: "File size must be less than {n}MB" or "Only {types} are allowed"

## Module-Specific Validation Rules

### Enquiries Module

#### EnquiryFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| full_name | Yes | 2 | 255 | Required, length check |
| email | Yes | - | - | Required, email format |
| phone | Yes | - | - | Required, phone format |
| company_name | No | - | 255 | Optional, length check |
| service_type | Yes | - | - | Required, enum validation |
| subject | Yes | 5 | 500 | Required, length check |
| description | No | - | 5000 | Optional, length check |
| status | Yes | - | - | Required, enum validation |
| hold_reason | Conditional | - | 1000 | Required when status = 'on_hold' |
| closing_remarks | Conditional | - | 1000 | Required when status = 'closed' |

**Status Options**: new, start_working, on_hold, spam, closed

**Service Type Options**: consulting, engineering, construction, maintenance, other

**Conditional Validation**:
- `hold_reason` required when `status === 'on_hold'`
- `closing_remarks` required when `status === 'closed'`

---

### Blogs Module

#### BlogFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| blog_title | Yes | 5 | 500 | Required, length check |
| slug | Yes | 5 | 500 | Required, auto-generated from title |
| category | Yes | 2 | 100 | Required, length check |
| featured_image | No | - | - | Optional, image file validation |
| short_description | No | - | 500 | Optional, length check |
| blog_content | Yes | 50 | - | Required, minimum length |
| author | Yes | 2 | 255 | Required, length check |
| tags | No | - | 500 | Optional, comma-separated |
| meta_title | No | - | 255 | Optional, length check |
| meta_description | No | - | 500 | Optional, length check |
| status | Yes | - | - | Required, enum validation |
| publish_date | Conditional | - | - | Required when status = 'published' |
| is_featured | No | - | - | Optional, boolean |

**Status Options**: draft, published, unpublished

**Conditional Validation**:
- `publish_date` required when `status === 'published'`

**File Upload**:
- Featured image: Max 10MB, JPG/PNG/WEBP/GIF

---

### Careers Module

#### CareerFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| job_code | Yes | - | 50 | Required, auto-generated |
| job_title | Yes | 5 | 255 | Required, length check |
| department | Yes | 2 | 100 | Required, length check |
| role_category | No | - | 100 | Optional, length check |
| industry_type | No | - | 100 | Optional, length check |
| employment_type | Yes | - | - | Required, enum validation |
| work_mode | Yes | - | - | Required, enum validation |
| location | Yes | 2 | 255 | Required, length check |
| number_of_openings | Yes | 1 | 100 | Required, numeric, min 1 |
| experience_required | No | - | 100 | Optional, length check |
| education_qualification | No | - | 500 | Optional, length check |
| key_skills | No | - | 1000 | Optional, length check |
| description | No | - | - | Optional, text area |
| roles_and_responsibilities | No | - | - | Optional, text area |
| benefits | No | - | - | Optional, text area |
| application_deadline | No | - | - | Optional, future date when open |
| status | Yes | - | - | Required, enum validation |

**Employment Type Options**: full_time, part_time, contract, internship, freelance

**Work Mode Options**: on_site, remote, hybrid

**Status Options**: draft, open, closed, on_hold, expired

**Conditional Validation**:
- `application_deadline` must be future date when `status === 'open'`

---

### Applicants Module

#### ApplicantFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| career_id | Yes | - | - | Required, foreign key |
| applicant_name | Yes | 2 | 255 | Required, length check |
| email | Yes | - | - | Required, email format |
| mobile | Yes | - | - | Required, phone format |
| current_location | No | - | 255 | Optional, length check |
| experience | No | - | 100 | Optional, length check |
| current_company | No | - | 255 | Optional, length check |
| current_ctc | No | 0 | 10000000 | Optional, numeric |
| expected_ctc | No | 0 | 10000000 | Optional, numeric |
| notice_period | No | - | 50 | Optional, length check |
| resume_path | Yes (new) | - | - | Required for new applicants |
| status | Yes | - | - | Required, enum validation |
| rejection_reason | Conditional | - | 1000 | Required when status = 'rejected' |
| hold_reason | Conditional | - | 1000 | Required when status = 'on_hold' |
| interview_date | Conditional | - | - | Required when status = 'interview_scheduled' |
| interview_feedback | Conditional | - | - | Optional for interview statuses |

**Status Options**: new, under_review, shortlisted, interview_scheduled, interview_completed, selected, offered, joined, rejected, on_hold

**Conditional Validation**:
- `rejection_reason` required when `status === 'rejected'`
- `hold_reason` required when `status === 'on_hold'`
- `interview_date` required when `status === 'interview_scheduled'`
- `interview_feedback` optional when `status === 'interview_scheduled'` or `interview_completed'`

**File Upload**:
- Resume: Max 5MB, PDF/DOC/DOCX only

---

### Gallery Module

#### GalleryFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| gallery_title | Yes | 5 | 255 | Required, length check |
| category | Yes | 2 | 100 | Required, length check |
| description | No | - | 2000 | Optional, length check |
| status | Yes | - | - | Required, enum validation |
| images | Yes (new) | 1 | 50 | Required, min 1, max 50 |
| image_titles | No | - | 255 | Optional, per image |
| alt_texts | No | - | 255 | Optional, per image |

**Status Options**: active, inactive

**File Upload**:
- Images: Max 10MB per image, JPG/PNG/WEBP/GIF
- Maximum 50 images per gallery

---

### Case Studies Module

#### CaseStudyFormPage Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| case_study_title | Yes | 5 | 500 | Required, length check |
| slug | Yes | 5 | 500 | Required, auto-generated |
| client_name | Yes | 2 | 255 | Required, length check |
| service_type | Yes | - | - | Required, enum validation |
| industry | Yes | 2 | 100 | Required, length check |
| featured_image | No | - | - | Optional, image file validation |
| short_description | Yes | 10 | 500 | Required, length check |
| challenge | Yes | 10 | - | Required, minimum length |
| solution | Yes | 10 | - | Required, minimum length |
| impact | Yes | 10 | - | Required, minimum length |
| technologies_used | No | - | 500 | Optional, length check |
| project_duration | No | - | 100 | Optional, length check |
| status | Yes | - | - | Required, enum validation |

**Service Type Options**: consulting, engineering, construction, maintenance, other

**Status Options**: draft, published, unpublished

**File Upload**:
- Featured image: Max 10MB, JPG/PNG/WEBP/GIF

---

### Settings Module

#### Profile Form Validation

| Field | Required | Min Length | Max Length | Validation Rules |
|-------|----------|------------|------------|------------------|
| first_name | Yes | 2 | 100 | Required, length check |
| last_name | Yes | 2 | 100 | Required, length check |
| email | Yes | - | - | Required, email format |
| phone | No | - | - | Optional, phone format |
| role | No | - | - | Read-only |

#### Password Change Validation

| Field | Required | Min Length | Validation Rules |
|-------|----------|------------|------------------|
| current_password | Yes | - | Required |
| new_password | Yes | 8 | Required, minimum 8 characters |
| confirm_password | Yes | - | Required, must match new_password |

**Password Rules**:
- Minimum 8 characters
- Must match confirmation
- Current password must be provided

---

## Form State Management

### Error Handling

Errors are displayed in real-time as users type:

```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
  // Clear error for this field when user starts typing
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }))
  }
}
```

### Validation Flow

1. **On Change**: Clear field-specific errors when user modifies field
2. **On Submit**: Validate entire form before submission
3. **Conditional Validation**: Check dependent fields (e.g., status-based fields)
4. **Error Display**: Show error messages below affected fields

### Loading States

Forms show loading states during API calls:

```typescript
const [submitting, setSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  setSubmitting(true)
  try {
    await apiCall()
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setSubmitting(false)
  }
}
```

## Common Validation Functions

### String Length Validation
```typescript
if (value.length < min) {
  return `${label} must be at least ${min} characters`
}
if (value.length > max) {
  return `${label} must be less than ${max} characters`
}
```

### Email Validation
```typescript
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
  return 'Invalid email format'
}
```

### Phone Validation
```typescript
if (!/^[\d\s\+\-\(\)]{10,20}$/.test(value)) {
  return 'Invalid phone number format'
}
```

### Date Validation
```typescript
const date = new Date(value)
if (date <= new Date()) {
  return 'Date must be in the future'
}
```

### File Size Validation
```typescript
if (file.size > maxSize) {
  return `File size must be less than ${maxSize / (1024 * 1024)}MB`
}
```

### File Type Validation
```typescript
if (!allowedTypes.includes(file.type)) {
  return `Only ${allowedTypes.join(', ')} files are allowed`
}
```

## Best Practices

### 1. Validate Early and Often
- Show errors as user types for better UX
- Validate on blur for less intrusive feedback
- Always validate on submit before API call

### 2. Clear Error Messages
- Use specific error messages
- Tell users what's wrong and how to fix it
- Avoid technical jargon

### 3. Conditional Validation
- Only validate fields that are relevant
- Use status-based field requirements
- Hide/show fields based on context

### 4. File Upload Safety
- Validate file size before upload
- Check file types on client side
- Provide clear upload instructions

### 5. Accessibility
- Associate error messages with form fields
- Use ARIA attributes for screen readers
- Ensure keyboard navigation works

## Future Enhancements

### Planned Improvements
- [ ] Zod schema integration for declarative validation
- [ ] Async validation (e.g., check email uniqueness)
- [ ] Custom validation rules library
- [ ] Validation rule configuration file
- [ ] Internationalized error messages

### Advanced Features
- [ ] Field-level validation rules
- [ ] Cross-field validation (e.g., end date > start date)
- [ ] Validation rule inheritance
- [ ] Dynamic form validation
- [ ] Validation analytics

---

**Last Updated**: June 2026
**Version**: 1.0.0
