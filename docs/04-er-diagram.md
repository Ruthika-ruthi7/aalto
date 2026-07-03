# Aalto Engineers Admin Panel - ER Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              websites                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                                                                       │
│    name                                                                      │
│    domain (UNIQUE)                                                           │
│    description                                                               │
│    is_active                                                                 │
│    created_at                                                                │
│    updated_at                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│      users        │    │    enquiries      │    │      blogs         │
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│ PK id             │    │ PK id             │    │ PK id             │
│    email (UNIQUE) │    │    full_name      │    │    blog_title     │
│    username       │    │    email          │    │    slug (UNIQUE)  │
│    password_hash  │    │    phone          │    │    category       │
│    first_name     │    │    company_name   │    │    featured_image │
│    last_name      │    │    service_type   │    │    short_desc     │
│    role (ENUM)    │    │    subject        │    │    blog_content   │
│ FK website_id     │───▶│    description    │    │    author         │
│    is_active      │    │    enquiry_date   │    │    tags           │
│    email_verified │    │ FK assigned_to    │───▶│    meta_title     │
│    last_login     │    │    status (ENUM)  │    │    meta_desc      │
│    failed_attempts│    │    hold_reason    │    │    status (ENUM)  │
│    locked_until   │    │    closing_remarks│    │    is_featured    │
│ FK website_id     │───▶│ FK website_id     │───▶│    publish_date   │
│    created_at     │    │    created_at     │    │    views          │
│    updated_at     │    │    updated_at     │    │ FK website_id     │───▶
│ FK created_by     │───▶│ FK created_by     │───▶│    created_at     │
│ FK updated_by     │───▶│ FK updated_by     │───▶│    updated_at     │
└───────────────────┘    └───────────────────┘    │ FK created_by     │───▶
        │                                       │ FK updated_by     │───▶
        │                                       └───────────────────┘
        │
        │ 1:N
        │
        ▼
┌───────────────────┐
│  refresh_tokens   │
├───────────────────┤
│ PK id             │
│ FK user_id        │───▶
│    token (UNIQUE) │
│    expires_at     │
│    created_at     │
│    revoked_at     │
│ FK revoked_by     │───▶
│    is_revoked     │
└───────────────────┘

┌───────────────────┐
│     careers       │
├───────────────────┤
│ PK id             │
│    job_code (UNIQ)│
│    job_title      │
│    department     │
│    role_category  │
│    industry_type  │
│    employment_type│
│    work_mode      │
│    location       │
│    openings       │
│    experience     │
│    education      │
│    key_skills     │
│    description    │
│    responsibilities│
│    benefits       │
│    deadline       │
│    status (ENUM)  │
│    posted_date    │
│ FK website_id     │───▶
│    created_at     │
│    updated_at     │
│ FK created_by     │───▶
│ FK updated_by     │───▶
└───────────────────┘
        │
        │ 1:N
        │
        ▼
┌───────────────────┐
│    applicants     │
├───────────────────┤
│ PK id             │
│ FK career_id      │───▶
│    applicant_name │
│    mobile         │
│    email          │
│    applied_date   │
│    current_loc    │
│    experience     │
│    current_company│
│    current_ctc    │
│    expected_ctc   │
│    notice_period  │
│    resume_path    │
│    status (ENUM)  │
│    rejection_reason│
│    hold_reason    │
│    interview_date │
│    interview_feedback│
│ FK website_id     │───▶
│    created_at     │
│    updated_at     │
│ FK created_by     │───▶
│ FK updated_by     │───▶
└───────────────────┘

┌───────────────────┐
│     gallery       │
├───────────────────┤
│ PK id             │
│    gallery_title  │
│    category       │
│    description    │
│    status (ENUM)  │
│ FK website_id     │───▶
│    created_at     │
│    updated_at     │
│ FK created_by     │───▶
│ FK updated_by     │───▶
└───────────────────┘
        │
        │ 1:N
        │
        ▼
┌───────────────────┐
│  gallery_images    │
├───────────────────┤
│ PK id             │
│ FK gallery_id     │───▶
│    image_path     │
│    image_title    │
│    alt_text       │
│    display_order  │
│    created_at     │
└───────────────────┘

┌───────────────────┐
│   case_studies    │
├───────────────────┤
│ PK id             │
│    case_title     │
│    slug (UNIQUE)  │
│    client_name    │
│    service_type   │
│    industry       │
│    featured_image │
│    short_desc     │
│    challenge      │
│    solution       │
│    impact         │
│    technologies   │
│    project_duration│
│    status (ENUM)  │
│ FK website_id     │───▶
│    created_at     │
│    updated_at     │
│ FK created_by     │───▶
│ FK updated_by     │───▶
└───────────────────┘

┌───────────────────┐
│  activity_logs    │
├───────────────────┤
│ PK id             │
│ FK user_id        │───▶
│    action         │
│    entity_type    │
│    entity_id      │
│    description    │
│    ip_address     │
│    user_agent     │
│    old_values     │
│    new_values     │
│    created_at     │
└───────────────────┘

┌───────────────────┐
│  notifications    │
├───────────────────┤
│ PK id             │
│ FK user_id        │───▶
│    title          │
│    message        │
│    type (ENUM)    │
│    link           │
│    is_read        │
│    created_at     │
│    read_at        │
└───────────────────┘
```

## Relationship Details

### Core User Relationships

**users → refresh_tokens**
- Type: One-to-Many
- Description: Each user can have multiple refresh tokens
- Cardinality: 1 user : N refresh_tokens
- Foreign Key: refresh_tokens.user_id → users.id
- Delete Rule: CASCADE (delete tokens when user is deleted)

**users → enquiries (as assigned_to)**
- Type: One-to-Many
- Description: Users can be assigned to multiple enquiries
- Cardinality: 1 user : N enquiries
- Foreign Key: enquiries.assigned_to → users.id
- Delete Rule: SET NULL (unassign if user deleted)

**users → activity_logs**
- Type: One-to-Many
- Description: Each user generates multiple activity logs
- Cardinality: 1 user : N activity_logs
- Foreign Key: activity_logs.user_id → users.id
- Delete Rule: SET NULL (preserve logs if user deleted)

**users → notifications**
- Type: One-to-Many
- Description: Each user receives multiple notifications
- Cardinality: 1 user : N notifications
- Foreign Key: notifications.user_id → users.id
- Delete Rule: CASCADE (delete notifications when user deleted)

### Audit Trail Relationships

**users → enquiries (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update enquiries
- Cardinality: 1 user : N enquiries
- Foreign Keys: enquiries.created_by → users.id, enquiries.updated_by → users.id
- Delete Rule: SET NULL (preserve record if user deleted)

**users → blogs (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update blogs
- Cardinality: 1 user : N blogs
- Foreign Keys: blogs.created_by → users.id, blogs.updated_by → users.id
- Delete Rule: SET NULL

**users → careers (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update career postings
- Cardinality: 1 user : N careers
- Foreign Keys: careers.created_by → users.id, careers.updated_by → users.id
- Delete Rule: SET NULL

**users → applicants (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update applicant records
- Cardinality: 1 user : N applicants
- Foreign Keys: applicants.created_by → users.id, applicants.updated_by → users.id
- Delete Rule: SET NULL

**users → gallery (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update gallery entries
- Cardinality: 1 user : N gallery
- Foreign Keys: gallery.created_by → users.id, gallery.updated_by → users.id
- Delete Rule: SET NULL

**users → case_studies (as created_by/updated_by)**
- Type: One-to-Many (self-referencing)
- Description: Users create and update case studies
- Cardinality: 1 user : N case_studies
- Foreign Keys: case_studies.created_by → users.id, case_studies.updated_by → users.id
- Delete Rule: SET NULL

### Content Relationships

**careers → applicants**
- Type: One-to-Many
- Description: Each career posting can have multiple applicants
- Cardinality: 1 career : N applicants
- Foreign Key: applicants.career_id → careers.id
- Delete Rule: CASCADE (delete applicants if career deleted)

**gallery → gallery_images**
- Type: One-to-Many
- Description: Each gallery contains multiple images
- Cardinality: 1 gallery : N gallery_images
- Foreign Key: gallery_images.gallery_id → gallery.id
- Delete Rule: CASCADE (delete images if gallery deleted)

### Multi-Tenancy Relationships

**websites → users**
- Type: One-to-Many
- Description: Each website can have multiple users (customer admins)
- Cardinality: 1 website : N users
- Foreign Key: users.website_id → websites.id
- Delete Rule: SET NULL

**websites → enquiries**
- Type: One-to-Many
- Description: Each website receives multiple enquiries
- Cardinality: 1 website : N enquiries
- Foreign Key: enquiries.website_id → websites.id
- Delete Rule: SET NULL

**websites → blogs**
- Type: One-to-Many
- Description: Each website has multiple blogs
- Cardinality: 1 website : N blogs
- Foreign Key: blogs.website_id → websites.id
- Delete Rule: SET NULL

**websites → careers**
- Type: One-to-Many
- Description: Each website posts multiple careers
- Cardinality: 1 website : N careers
- Foreign Key: careers.website_id → websites.id
- Delete Rule: SET NULL

**websites → applicants**
- Type: One-to-Many
- Description: Each website receives multiple applicants
- Cardinality: 1 website : N applicants
- Foreign Key: applicants.website_id → websites.id
- Delete Rule: SET NULL

**websites → gallery**
- Type: One-to-Many
- Description: Each website has multiple galleries
- Cardinality: 1 website : N gallery
- Foreign Key: gallery.website_id → websites.id
- Delete Rule: SET NULL

**websites → case_studies**
- Type: One-to-Many
- Description: Each website has multiple case studies
- Cardinality: 1 website : N case_studies
- Foreign Key: case_studies.website_id → websites.id
- Delete Rule: SET NULL

## Entity Attributes Summary

### users
- **Primary Key**: id
- **Unique**: email, username
- **Foreign Keys**: website_id, created_by, updated_by
- **Enums**: role (super_admin, customer_admin, editor, hr, viewer)

### refresh_tokens
- **Primary Key**: id
- **Unique**: token
- **Foreign Keys**: user_id, revoked_by
- **Indexes**: user_id, token, expires_at

### enquiries
- **Primary Key**: id
- **Foreign Keys**: assigned_to, website_id, created_by, updated_by
- **Enums**: service_type, status
- **Full-text Search**: full_name, email, company_name, subject

### blogs
- **Primary Key**: id
- **Unique**: slug
- **Foreign Keys**: website_id, created_by, updated_by
- **Enums**: status
- **Full-text Search**: blog_title, short_description

### careers
- **Primary Key**: id
- **Unique**: job_code
- **Foreign Keys**: website_id, created_by, updated_by
- **Enums**: employment_type, work_mode, status
- **Full-text Search**: job_title, department, key_skills

### applicants
- **Primary Key**: id
- **Foreign Keys**: career_id, website_id, created_by, updated_by
- **Enums**: status
- **Indexes**: career_id, status, email, applied_date

### gallery
- **Primary Key**: id
- **Foreign Keys**: website_id, created_by, updated_by
- **Enums**: status

### gallery_images
- **Primary Key**: id
- **Foreign Keys**: gallery_id
- **Indexes**: gallery_id, display_order

### case_studies
- **Primary Key**: id
- **Unique**: slug
- **Foreign Keys**: website_id, created_by, updated_by
- **Enums**: service_type, status
- **Full-text Search**: case_study_title, client_name

### activity_logs
- **Primary Key**: id
- **Foreign Keys**: user_id
- **JSON Fields**: old_values, new_values
- **Indexes**: user_id, action, entity_type, entity_id, created_at

### notifications
- **Primary Key**: id
- **Foreign Keys**: user_id
- **Enums**: type (info, success, warning, error)
- **Indexes**: user_id, is_read, created_at

### websites
- **Primary Key**: id
- **Unique**: domain
- **Indexes**: domain, is_active

## Normalization

### First Normal Form (1NF)
- All tables have primary keys
- All columns are atomic (no repeating groups)
- No multi-valued attributes

### Second Normal Form (2NF)
- All non-key attributes are fully dependent on the primary key
- No partial dependencies
- gallery_images separated from gallery to handle 1:N relationship

### Third Normal Form (3NF)
- No transitive dependencies
- All non-key attributes depend only on the primary key
- Audit fields (created_by, updated_by) reference users table

## Data Integrity Rules

### Referential Integrity
- All foreign keys must reference existing primary keys
- CASCADE deletes for dependent data
- SET NULL for optional relationships

### Domain Integrity
- ENUM values restrict status fields
- VARCHAR lengths enforce data limits
- DATETIME fields ensure valid dates

### Entity Integrity
- Primary keys are unique and not null
- Unique constraints on email, username, slugs, job codes

## Performance Considerations

### Indexing Strategy
- All foreign keys indexed
- Frequently filtered fields indexed (status, dates)
- Full-text search indexes on text fields
- Unique indexes on unique constraints

### Query Optimization
- Composite indexes for common query patterns
- Covering indexes for frequent queries
- Consider partitioning for large tables (activity_logs)

## Security Considerations

### Data Access
- Row-level security via website_id for multi-tenancy
- Role-based access control enforced at application level
- Sensitive fields (password_hash) never exposed in queries

### Audit Trail
- All modifications tracked via activity_logs
- JSON fields store complete change history
- IP addresses and user agents logged for security
