# Aalto Engineers Admin Panel - Frontend Architecture

## Overview

This document describes the frontend architecture of the Aalto Engineers Admin Panel, a React-based admin dashboard built with modern web technologies.

## Technology Stack

### Core Framework
- **React 18** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Custom CSS Variables** - Brand colors and theme configuration

### Routing
- **React Router v6** - Client-side routing for SPA navigation

### HTTP Client
- **Axios** - HTTP client for API requests

### Icons
- **Lucide React** - Modern icon library

### Data Visualization
- **Recharts** - Chart library for analytics dashboards

### Rich Text Editor
- **Tiptap** - Headless rich text editor framework

### Form Handling
- **React Hook Form** - Performant form library
- **Zod** - Schema validation library

### State Management
- **React Hooks** - useState, useEffect, useContext for local state
- **TanStack Query** - Server state management (planned for production)
## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── common/           # Reusable UI components
│   │       ├── ActionButton.tsx
│   │       ├── DataTable.tsx
│   │       ├── FilterBar.tsx
│   │       ├── FormField.tsx
│   │       ├── PageHeader.tsx
│   │       └── StatusBadge.tsx
│   ├── page└/         # Authentication pages
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/        # Dashboard module
│   │   │   └── DashboardPage.tsx
│   │   ├── enquiries/        # Enquiries module
│   │   │   ├── EnquiriesListPage.tsx
│   │   │   └── EnquiryFormPage.tsx
│   │   ├── blogs/            # Blogs module
│   │   │   ├── BlogsListPage.tsx
│   │   │   └── BlogFormPage.tsx
│   │   ├── careers/          # Careers module
│   │   │   ├── CareersListPage.tsx
│   │   │   └── CareerFormPage.tsx
│   │   ├── applicants/       # Applicants module
│   │   │   ├── ApplicantsListPage.tsx
│   │   │   └── ApplicantFormPage.tsx
│   │   ├── gallery/          # Gallery module
│   │   │   ├── GalleryListPage.tsx
│   │   │   └── GalleryFormPage.tsx
│   │   ├── case-studies/     # Case Studies module
│   │   │   ├── CaseStudiesListPage.tsx
│   │   │   └── CaseStudyFormPage.tsx
│   │   └── settings/         # Settings module
│   │       └── SettingsPage.tsx
│   ├── services/             # API service layer
│   │   ├── auth.service.ts
│   │   ├── common.types.ts
│   │   ├── mockData.ts
│   │   ├── enquiry.service.mock.ts
│   │   ├── blog.service.mock.ts
│   │   ├── career.service.mock.ts
│   │   ├── applicant.service.mock.ts
│   │   └── dashboard.service.mock.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── common.types.ts
│   │   ├── enquiry.types.ts
│   │   ├── blog.types.ts
│   │   ├── career.types.ts
│   │   ├── applicant.types.ts
│   │   ├── gallery.types.ts
│   │   └── case-study.types.ts
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Root component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── docs/                     # Documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Architecture Patterns

### Component Architecture

**Functional Components**: All components are functional React components using hooks.

**Composition Pattern**: Components are designed to be composable and reusable.

**Props Interface**: All components use TypeScript interfaces for type-safe props.

### Data Flow

**Unidirectional Data Flow**: Data flows from parent to child components via props.

**State Management**:
- Local state using `useState` for component-specific state
- Server state using TanStack Query (planned)
- Global state using React Context (for auth, theme, etc.)

### Service Layer Pattern

The service layer abstracts API calls from the UI components:

```typescript
// Service interface
interface Service<T> {
  getAll(filters?: FilterType, page?: number, limit?: number): Promise<PaginatedResponse<T>>
  getById(id: number): Promise<ApiResponse<T>>
  create(data: FormData): Promise<ApiResponse<T>>
  update(id: number, data: FormData): Promise<ApiResponse<T>>
  delete(id: number): Promise<ApiResponse<null>>
}
```

**Mock Services**: During development, mock services provide simulated API responses.

### Type Safety

**TypeScript Interfaces**: All entities have corresponding TypeScript interfaces matching the database schema.

**Generic Types**: Common types like `ApiResponse<T>` and `PaginatedResponse<T>` for type-safe API responses.

## Modules

### Authentication Module
- Login page with form validation
- JWT token management
- Protected route handling
- Password change functionality

### Dashboard Module
- Statistics cards with key metrics
- Monthly enquiry trend chart
- Quick action links
- Recent activity feed

### Enquiries Module
- List view with search, filters, and pagination
- Form with client-side validation
- Status management (new, start_working, on_hold, spam, closed)
- Conditional fields based on status

### Blogs Module
- List view with status and category filters
- Form with rich text editor support
- Featured image upload
- SEO fields (meta title, meta description)
- Status management (draft, published, unpublished)

### Careers Module
- Job posting management
- Employment type and work mode filters
- Form with comprehensive job details
- Application deadline management
- Status management (draft, open, closed, on_hold, expired)

### Applicants Module
- Job application management
- Resume upload functionality
- Application status tracking
- Interview scheduling
- CTC information management

### Gallery Module
- Image gallery management
- Multiple image upload
- Image metadata (title, alt text)
- Category-based organization
- Status management (active, inactive)

### Case Studies Module
- Project showcase management
- Challenge-solution-impact structure
- Featured image support
- Service type categorization
- Status management (draft, published, unpublished)

### Settings Module
- Profile management
- Password change
- Notification preferences
- Logout functionality

### Toast Notification System
- Global toast notifications for user feedback
- Success, error, warning, and info message types
- Auto-dismissal with configurable duration
- Position-aware toast container
- `useToast` hook for component integration

## Validation Rules

### Form Validation Strategy

**Client-side validation** using React Hook Form with Zod schemas:

```typescript
// Example validation schema
const enquirySchema = z.object({
  full_name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{10,20}$/),
  subject: z.string().min(5).max(500),
  status: z.enum(['new', 'start_working', 'on_hold', 'spam', 'closed']),
})
```

**Conditional Validation**: Fields validated based on other field values (e.g., hold_reason required when status is 'on_hold').

**Real-time Validation**: Errors displayed as user types with debouncing.

### Common Validation Rules

- **Email**: Valid email format
- **Phone**: 10-20 characters, digits and special characters allowed
- **Required Fields**: Non-empty strings
- **Length Constraints**: Min/max character limits
- **Date Validation**: Future dates for deadlines
- **File Upload**: Size and type validation

## Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Strategies

- **Mobile-first approach** using Tailwind CSS
- **Grid layouts** that stack on mobile
- **Responsive tables** with horizontal scroll
- **Flexible spacing** based on screen size
- **Touch-friendly** button sizes on mobile

## API Integration

### API Base URL

```
http://localhost:5000/api/v1
```

### API Endpoints

```
/auth/login          POST
/auth/logout         POST
/auth/change-password POST

/enquiries           GET, POST, PUT, DELETE
/blogs               GET, POST, PUT, DELETE
/careers             GET, POST, PUT, DELETE
/applicants          GET, POST, PUT, DELETE
/gallery             GET, POST, PUT, DELETE
/case-studies        GET, POST, PUT, DELETE
/dashboard/stats     GET
/dashboard/analytics  GET
```

### Request/Response Format

**Request**:
```typescript
{
  data: FormData,
  headers: {
    Authorization: `Bearer ${token}`
  }
}
```

**Response**:
```typescript
{
  success: boolean,
  data: T | null,
  error?: {
    message: string,
    code: string
  }
}
```

## Branding

### Colors

- **Primary Orange**: #FF6B35
- **Primary Blue**: #1E3A5F
- **Dark**: #0F172A
- **Light Gray**: #F3F4F6
- **White**: #FFFFFF

### Typography

- **Font Family**: System fonts (Inter, San Francisco, Segoe UI)
- **Headings**: Bold, 1.5rem - 3rem
- **Body**: Regular, 0.875rem - 1rem
- **Small**: 0.75rem for labels and captions

## Performance Optimization

### Code Splitting

- Route-based code splitting using React.lazy()
- Component lazy loading for large modules

### Asset Optimization

- Image optimization (WebP format)
- Lazy loading images
- Minified CSS and JS in production

### Caching Strategy

- API response caching using TanStack Query
- Static asset caching via browser cache

## Security Considerations

### Authentication
- JWT token storage in localStorage
- Token refresh mechanism
- Protected routes with authentication check

### Data Validation
- Client-side validation before API calls
- Server-side validation (backend responsibility)
- XSS prevention via React's built-in escaping

### File Uploads
- File type validation
- File size limits
- Virus scanning (backend responsibility)

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- **ESLint**: Linting and code quality
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Git Workflow

- Feature branches for new features
- Pull requests for 
- [x] Toast notification system (completed)code review
- Main branch for production

## Future Enhancements

### Planned Features
- [ ] Global search functionality
- [ ] Advanced filtering options
- [ ] Data export (CSV, PDF)
- [ ] Real-time notifications
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Role-based access control UI

### Technical Improvements
- [ ] TanStack Query for server state
- [ ] Error boundary implementation
- [ ] Loading skeletons
- [ ] Virtual scrolling for large lists
- [ ] Service worker for offline support
- [ ] E2E testing with Playwright

## Deployment

### Build Process

1. Run `npm run build` to create production bundle
2. Upload `dist/` folder to web server
3. Configure web server for SPA routing
4. Set up environment variables

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Aalto Engineers Admin Panel
```

## Support and Maintenance

### Documentation
- Code comments for complex logic
- Component prop documentation
- API endpoint documentation

### Monitoring
- Error tracking (Sentry integration planned)
- Performance monitoring
- User analytics

---

**Last Updated**: June 2026
**Version**: 1.0.0
