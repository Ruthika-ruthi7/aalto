# Aalto Engineers Admin Panel - Architecture Document

## Overview

This document outlines the complete architecture for rebuilding the Aalto Engineers Admin Panel from PHP to a modern, scalable web application using React (frontend) and Flask (backend).

## Technology Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Routing**: React Router v6
- **Form Management**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Rich Text Editor**: Tiptap or Quill
- **Icons**: Lucide React

### Backend
- **Framework**: Flask (Python)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (PyJWT)
- **Database Migrations**: Flask-Migrate
- **API Documentation**: Flask-RESTX or Swagger
- **CORS**: Flask-CORS
- **File Upload**: Flask-Uploads
- **Environment Config**: python-dotenv

### Database
- **Database**: MySQL 8.0+
- **Connection**: PyMySQL or mysql-connector-python

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│                    (React + Vite + TypeScript)              │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      Nginx / Reverse Proxy                   │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    Flask Application Server                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Layer (REST Endpoints)                           │  │
│  │  - Authentication Routes                              │  │
│  │  - Enquiry Routes                                      │  │
│  │  - Blog Routes                                         │  │
│  │  - Career Routes                                       │  │
│  │  - Applicant Routes                                    │  │
│  │  - Gallery Routes                                      │  │
│  │  - Case Study Routes                                   │  │
│  │  - Settings Routes                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer (Services)                       │  │
│  │  - AuthService                                         │  │
│  │  - EnquiryService                                      │  │
│  │  - BlogService                                         │  │
│  │  - CareerService                                       │  │
│  │  - ApplicantService                                    │  │
│  │  - GalleryService                                      │  │
│  │  - CaseStudyService                                    │  │
│  │  - UserService                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                     │  │
│  │  - JWT Authentication                                 │  │
│  │  - RBAC Authorization                                  │  │
│  │  - Request Validation                                  │  │
│  │  - Error Handling                                      │  │
│  │  - Logging                                             │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │ SQLAlchemy ORM
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    MySQL Database                            │
│  - users                                                    │
│  - enquiries                                                │
│  - blogs                                                    │
│  - careers                                                  │
│  - applicants                                               │
│  - gallery                                                   │
│  - case_studies                                             │
│  - activity_logs                                            │
│  - notifications                                            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── QueryProvider (TanStack Query)
├── ThemeProvider (Dark Mode)
├── Router
│   ├── Public Routes
│   │   └── LoginPage
│   └── Protected Routes
│       ├── DashboardLayout
│       │   ├── Sidebar
│       │   ├── Header
│       │   └── Main Content
│       │       ├── Dashboard
│       │       ├── Enquiries
│       │       ├── Blogs
│       │       ├── Careers
│       │       ├── Applicants
│       │       ├── Gallery
│       │       ├── CaseStudies
│       │       └── Settings
│       └── ErrorBoundary
```

### State Management Strategy

1. **Server State**: TanStack Query for API data (caching, refetching, optimistic updates)
2. **Client State**: React Context for auth, theme, notifications
3. **Form State**: React Hook Form for form management
4. **URL State**: React Router for navigation and query params

### Component Design Patterns

1. **Container/Presentational Pattern**: Separate logic from UI
2. **Compound Components**: For complex UI components (like DataTable)
3. **Render Props**: For flexible component composition
4. **Custom Hooks**: Reusable logic extraction

## Backend Architecture

### Layered Architecture

1. **Routes Layer**: HTTP endpoint definitions
2. **Controller Layer**: Request handling and response formatting
3. **Service Layer**: Business logic implementation
4. **Repository Layer**: Database operations (optional, can use SQLAlchemy directly)
5. **Model Layer**: Database schema definitions

### Request Flow

```
HTTP Request
    ↓
Middleware (CORS, Logging, Error Handler)
    ↓
JWT Authentication Middleware
    ↓
RBAC Authorization Middleware
    ↓
Route Handler
    ↓
Request Validation (Pydantic/Schema)
    ↓
Service Layer (Business Logic)
    ↓
SQLAlchemy ORM
    ↓
MySQL Database
    ↓
Response
```

## Security Architecture

### Authentication
- JWT Access Tokens (15-minute expiry)
- JWT Refresh Tokens (7-day expiry)
- Secure password hashing (bcrypt)
- Token storage in HTTP-only cookies

### Authorization
- Role-Based Access Control (RBAC)
- Permission-based route protection
- API-level permission checks
- Data-level filtering (Customer Admin sees only their data)

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

### Data Validation
- Input validation on both frontend and backend
- SQL injection prevention (ORM parameterized queries)
- XSS prevention (React auto-escaping)
- CSRF protection (token-based)

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Route-based chunking
- Image optimization (WebP, lazy loading)
- Memoization (React.memo, useMemo, useCallback)
- Virtual scrolling for large lists
- Debounced search inputs

### Backend
- Database indexing on frequently queried fields
- Query optimization (select specific fields, limit results)
- Caching with Redis (optional)
- Connection pooling
- Gzip compression

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT auth)
- Load balancer ready
- Session storage in Redis (if needed)

### Database Scaling
- Read replicas for reporting queries
- Database connection pooling
- Query optimization and indexing

## Deployment Architecture

### Development Environment
- Frontend: Vite dev server (port 5173)
- Backend: Flask dev server (port 5000)
- Database: Local MySQL instance

### Production Environment
- Frontend: Nginx serving static files
- Backend: Gunicorn/Waitress WSGI server
- Database: Managed MySQL (AWS RDS or similar)
- Reverse Proxy: Nginx
- SSL: Let's Encrypt

## Monitoring & Logging

### Frontend
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- Console logging in development

### Backend
- Application logging (Python logging)
- Error tracking (Sentry)
- API response time monitoring
- Database query logging

## Development Workflow

### Git Workflow
- Main branch for production
- Develop branch for integration
- Feature branches for new features
- Pull request code review

### Code Quality
- ESLint + Prettier for frontend
- Black + Flake8 for backend
- TypeScript strict mode
- Pre-commit hooks

### Testing Strategy
- Unit tests (Jest for frontend, pytest for backend)
- Integration tests (API endpoints)
- E2E tests (Playwright)
- Manual testing for critical flows

## API Design Principles

1. **RESTful Design**: Proper HTTP methods and status codes
2. **Consistent Response Format**: Standardized success/error responses
3. **Versioning**: URL-based versioning (/api/v1/)
4. **Pagination**: Cursor-based or offset-based
5. **Filtering**: Query parameters for filtering and sorting
6. **Rate Limiting**: Prevent abuse (optional)

## File Upload Architecture

### Storage Strategy
- Local filesystem storage (uploads/ directory)
- Organized by module (uploads/blog/, uploads/career/, etc.)
- Unique filename generation (UUID + timestamp)
- File type validation
- Size limits (configurable)

### Image Processing
- Thumbnail generation for gallery
- Image compression
- WebP conversion (optional)

## Error Handling Strategy

### Frontend
- Error boundaries for React components
- Global error handler
- User-friendly error messages
- Toast notifications for errors

### Backend
- Global exception handler
- Custom exception classes
- Detailed error logging
- Sanitized error responses to client

## Internationalization (i18n)

- Support for multiple languages (future enhancement)
- Date/time localization
- Number formatting
- Currency formatting (if needed)

## Accessibility (a11y)

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance (WCAG AA)
- Semantic HTML

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Aalto Engineers Admin
```

### Backend (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=mysql+pymysql://user:password@localhost/aalto_admin
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_EXPIRES=900
JWT_REFRESH_TOKEN_EXPIRES=604800
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

## Migration Strategy from PHP

### Data Migration
- Export existing MySQL data
- Transform to new schema
- Import to new database
- Data validation and cleanup

### Feature Parity
- Implement all existing features
- Maintain same functionality
- Improve UX where possible

### URL Structure
- Maintain compatible URLs where possible
- Implement redirects for changed routes
