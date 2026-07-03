# Aalto Engineers Admin Panel - Folder Structure

## Project Root Structure

```
aalto-admin-panel/
├── frontend/                 # React + Vite + TypeScript frontend
├── backend/                  # Flask + SQLAlchemy backend
├── database/                 # Database scripts and migrations
├── docs/                     # Documentation
├── .gitignore
├── README.md
└── docker-compose.yml        # Optional: Docker setup
```

## Frontend Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── assets/              # Static assets (images, fonts)
│   │   ├── images/
│   │   └── fonts/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── form.tsx
│   │   │   ├── label.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ...
│   │   ├── layout/          # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── common/          # Common/shared components
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── data-table/      # Reusable data table component
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTableColumnHeader.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   └── DataTableToolbar.tsx
│   │   ├── charts/          # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── PieChart.tsx
│   │   └── forms/           # Form components
│   │       ├── RichTextEditor.tsx
│   │       ├── DatePicker.tsx
│   │       └── MultiSelect.tsx
│   ├── layouts/             # Page layouts
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ActivateAccountPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── enquiries/
│   │   │   ├── EnquiriesListPage.tsx
│   │   │   ├── EnquiryViewPage.tsx
│   │   │   └── EnquiryFormPage.tsx
│   │   ├── blogs/
│   │   │   ├── BlogsListPage.tsx
│   │   │   ├── BlogViewPage.tsx
│   │   │   └── BlogFormPage.tsx
│   │   ├── careers/
│   │   │   ├── CareersListPage.tsx
│   │   │   ├── CareerViewPage.tsx
│   │   │   └── CareerFormPage.tsx
│   │   ├── applicants/
│   │   │   ├── ApplicantsListPage.tsx
│   │   │   ├── ApplicantViewPage.tsx
│   │   │   └── ApplicantFormPage.tsx
│   │   ├── gallery/
│   │   │   ├── GalleryListPage.tsx
│   │   │   └── GalleryFormPage.tsx
│   │   ├── case-studies/
│   │   │   ├── CaseStudiesListPage.tsx
│   │   │   ├── CaseStudyViewPage.tsx
│   │   │   └── CaseStudyFormPage.tsx
│   │   ├── settings/
│   │   │   ├── UsersPage.tsx
│   │   │   ├── RolesPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   ├── useDebounce.ts
│   │   ├── useFileUpload.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDarkMode.ts
│   ├── services/            # API service layer
│   │   ├── api.ts           # Axios instance configuration
│   │   ├── auth.service.ts
│   │   ├── enquiry.service.ts
│   │   ├── blog.service.ts
│   │   ├── career.service.ts
│   │   ├── applicant.service.ts
│   │   ├── gallery.service.ts
│   │   ├── case-study.service.ts
│   │   ├── user.service.ts
│   │   └── dashboard.service.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── enquiry.types.ts
│   │   ├── blog.types.ts
│   │   ├── career.types.ts
│   │   ├── applicant.types.ts
│   │   ├── gallery.types.ts
│   │   ├── case-study.types.ts
│   │   ├── user.types.ts
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Date, number, string formatters
│   │   ├── validators.ts    # Custom validators
│   │   ├── helpers.ts       # Helper functions
│   │   ├── constants.ts     # App constants
│   │   └── cn.ts           # Class name utility (tailwind-merge)
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── config/              # Configuration files
│   │   └── routes.tsx       # Route configuration
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite type declarations
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript config for Node
└── vite.config.ts           # Vite configuration
```

## Backend Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration
│   ├── extensions.py        # Flask extensions (db, jwt, etc.)
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── enquiry.py
│   │   ├── blog.py
│   │   ├── career.py
│   │   ├── applicant.py
│   │   ├── gallery.py
│   │   ├── case_study.py
│   │   ├── activity_log.py
│   │   └── notification.py
│   ├── schemas/             # Request/Response schemas (Pydantic or Marshmallow)
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── enquiry.py
│   │   ├── blog.py
│   │   ├── career.py
│   │   ├── applicant.py
│   │   ├── gallery.py
│   │   ├── case_study.py
│   │   └── user.py
│   ├── routes/              # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── enquiries.py
│   │   ├── blogs.py
│   │   ├── careers.py
│   │   ├── applicants.py
│   │   ├── gallery.py
│   │   ├── case_studies.py
│   │   ├── dashboard.py
│   │   └── settings.py
│   ├── services/            # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── enquiry_service.py
│   │   ├── blog_service.py
│   │   ├── career_service.py
│   │   ├── applicant_service.py
│   │   ├── gallery_service.py
│   │   ├── case_study_service.py
│   │   ├── user_service.py
│   │   └── notification_service.py
│   ├── middleware/          # Custom middleware
│   │   ├── __init__.py
│   │   ├── auth.py          # JWT authentication
│   │   ├── rbac.py          # Role-based access control
│   │   ├── logging.py       # Request logging
│   │   └── error_handler.py # Global error handling
│   ├── utils/               # Utility functions
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   ├── helpers.py
│   │   ├── decorators.py
│   │   └── constants.py
│   └── static/              # Static files (if needed)
├── migrations/              # Database migrations (Flask-Migrate)
│   └── versions/
├── uploads/                 # File upload directory
│   ├── blogs/
│   ├── careers/
│   ├── applicants/
│   ├── gallery/
│   └── case_studies/
├── tests/                   # Test files
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_enquiries.py
│   ├── test_blogs.py
│   ├── test_careers.py
│   ├── test_applicants.py
│   ├── test_gallery.py
│   ├── test_case_studies.py
│   └── test_users.py
├── requirements.txt          # Python dependencies
├── requirements-dev.txt     # Development dependencies
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .flaskenv                # Flask-specific environment variables
├── config.py                # Alternative config file
├── run.py                   # Development server entry point
└── wsgi.py                  # Production WSGI entry point
```

## Database Structure

```
database/
├── schema.sql               # Initial database schema
├── seed_data.sql            # Sample data for development
├── migrations/              # Migration scripts (if not using Flask-Migrate)
│   ├── 001_initial_schema.sql
│   ├── 002_add_indexes.sql
│   └── ...
└── backup/                  # Database backups
```

## Documentation Structure

```
docs/
├── 01-architecture.md       # System architecture
├── 02-folder-structure.md   # This file
├── 03-database-schema.md    # Database schema documentation
├── 04-er-diagram.md         # ER diagram
├── 05-api-documentation.md  # API endpoints and specifications
├── 06-user-roles-permissions.md # User roles and permissions
├── 07-component-design.md   # Reusable component design
├── 08-development-guide.md  # Development setup and guidelines
├── 09-deployment-guide.md   # Deployment instructions
└── 10-migration-guide.md    # Migration from PHP
```

## File Naming Conventions

### Frontend
- Components: PascalCase (e.g., `DataTable.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Services: camelCase with `.service` suffix (e.g., `auth.service.ts`)
- Types: camelCase with `.types` suffix (e.g., `auth.types.ts`)
- Utils: camelCase (e.g., `formatters.ts`)
- Pages: PascalCase with `Page` suffix (e.g., `EnquiriesListPage.tsx`)

### Backend
- Models: lowercase with underscores (e.g., `user.py`)
- Routes: lowercase with underscores (e.g., `auth.py`)
- Services: lowercase with `_service` suffix (e.g., `auth_service.py`)
- Schemas: lowercase (e.g., `auth.py`)
- Middleware: lowercase (e.g., `auth.py`)
- Utils: lowercase (e.g., `helpers.py`)

## Environment Configuration Files

### Frontend
- `.env` - Local development
- `.env.production ` - Production
- `.env.staging` - Staging

### Backend
- `.env` - Local development
- `.env.production` - Production
- `.flaskenv` - Flask-specific settings

## Git Repository Structure

```
.gitignore                  # Git ignore rules
README.md                   # Project overview
LICENSE                     # License file
CONTRIBUTING.md             # Contribution guidelines
CHANGELOG.md                # Version history
```

## Build and Distribution

### Frontend Build Output
```
frontend/dist/              # Production build (generated by Vite)
```

### Backend Distribution
```
backend/
├── requirements.txt        # Production dependencies
└── wsgi.py                 # WSGI entry point
```

## Docker Structure (Optional)

```
docker/
├── Dockerfile.frontend     # Frontend Dockerfile
├── Dockerfile.backend      # Backend Dockerfile
├── docker-compose.yml      # Docker Compose configuration
└── nginx.conf              # Nginx configuration
```

## Summary

This folder structure follows best practices for:
- Separation of concerns
- Scalability
- Maintainability
- Team collaboration
- Clear organization of code by functionality
- Easy navigation and onboarding
