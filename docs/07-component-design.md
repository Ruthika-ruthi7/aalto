# Aalto Engineers Admin Panel - Reusable Component Design

## Component Architecture Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components are generic and configurable
3. **Composition**: Build complex UIs from simple components
4. **Type Safety**: Full TypeScript support with proper typing
5. **Accessibility**: WCAG AA compliant with ARIA labels
6. **Performance**: Optimized with memoization where needed

---

## UI Component Library (Shadcn UI)

### Base Components

#### Button
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

**Usage**: Primary actions, secondary actions, icon buttons

#### Input
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}
```

**Usage**: Form inputs, search fields, filters

#### Card
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}
```

**Usage**: Content containers, dashboard cards, data display

#### Dialog
```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

**Usage**: Modals, confirmations, forms

#### Select
```typescript
interface SelectProps<T> {
  options: { value: T; label: string }[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
}
```

**Usage**: Dropdowns, filters, status selection

#### Table
```typescript
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  pagination?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}
```

**Usage**: Data tables, lists, grids

#### Badge
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}
```

**Usage**: Status indicators, tags, labels

#### Toast
```typescript
interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}
```

**Usage**: Notifications, alerts, feedback

---

## Layout Components

### DashboardLayout
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}
```

**Features**:
- Responsive sidebar (collapsible on mobile)
- Top header with user menu
- Breadcrumb navigation
- Main content area with scroll

**Structure**:
```
┌─────────────────────────────────────────┐
│ Header (Logo, Search, Notifications, User) │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │   Main Content               │
│          │   (children)                 │
│          │                              │
└──────────┴──────────────────────────────┘
```

### AuthLayout
```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
}
```

**Features**:
- Centered content
- Full-screen background
- Responsive design
- Logo placement

---

## Common Components

### PageHeader
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  backLink?: string;
}
```

**Usage**: Page titles, action buttons, breadcrumbs

### Breadcrumb
```typescript
interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}
```

**Usage**: Navigation hierarchy

### SearchBar
```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}
```

**Usage**: Global search, filtered search

### LoadingSkeleton
```typescript
interface LoadingSkeletonProps {
  type?: 'text' | 'card' | 'table' | 'avatar';
  count?: number;
}
```

**Usage**: Loading states, skeleton screens

### EmptyState
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage**: No data states, empty lists

### ConfirmationDialog
```typescript
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}
```

**Usage**: Delete confirmations, action confirmations

### FileUpload
```typescript
interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  preview?: boolean;
}
```

**Usage**: Image uploads, document uploads

### ImagePreview
```typescript
interface ImagePreviewProps {
  src: string;
  alt?: string;
  onDelete?: () => void;
}
```

**Usage**: Image display, gallery previews

### StatusBadge
```typescript
interface StatusBadgeProps {
  status: string;
  variant?: 'enquiry' | 'blog' | 'career' | 'applicant' | 'gallery';
}
```

**Usage**: Status indicators with color coding

---

## Data Table Component

### DataTable
A comprehensive data table with sorting, filtering, pagination.

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  pageSize?: number;
}
```

**Features**:
- Column sorting
- Global search
- Column filtering
- Row selection
- Pagination
- Responsive design
- Empty state
- Loading state

**Sub-components**:
- `DataTableColumnHeader`: Sortable column headers
- `DataTablePagination`: Pagination controls
- `DataTableToolbar`: Search and filter toolbar

---

## Form Components

### RichTextEditor
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  toolbar?: boolean;
  minHeight?: number;
}
```

**Features**:
- Bold, italic, underline
- Headings
- Lists (ordered, unordered)
- Links
- Images
- Tables
- Code blocks

### DatePicker
```typescript
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}
```

**Usage**: Date selection, date ranges

### MultiSelect
```typescript
interface MultiSelectProps<T> {
  options: { value: T; label: string }[];
  value?: T[];
  onChange?: (value: T[]) => void;
  placeholder?: string;
  searchable?: boolean;
}
```

**Usage**: Tag selection, category selection

---

## Chart Components

### LineChart
```typescript
interface LineChartProps {
  data: ChartData[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}
```

**Usage**: Trend analysis, time series data

### BarChart
```typescript
interface BarChartProps {
  data: ChartData[];
  xKey: string;
  yKey: string;
  color?: string;
  horizontal?: boolean;
  height?: number;
}
```

**Usage**: Comparisons, categorical data

### PieChart
```typescript
interface PieChartProps {
  data: ChartData[];
  nameKey: string;
  valueKey: string;
  height?: number;
}
```

**Usage**: Distribution, percentages

---

## Module-Specific Components

### EnquiryCard
```typescript
interface EnquiryCardProps {
  enquiry: Enquiry;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}
```

### BlogCard
```typescript
interface BlogCardProps {
  blog: Blog;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}
```

### CareerCard
```typescript
interface CareerCardProps {
  career: Career;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}
```

### ApplicantCard
```typescript
interface ApplicantCardProps {
  applicant: Applicant;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}
```

### GalleryGrid
```typescript
interface GalleryGridProps {
  images: GalleryImage[];
  onDelete?: (id: number) => void;
  onReorder?: (images: GalleryImage[]) => void;
}
```

---

## Custom Hooks

### useAuth
```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials: LoginCredentials) => { ... };
  const logout = async () => { ... };
  const refreshToken = async () => { ... };
  
  return { user, loading, login, logout, refreshToken };
};
```

### usePermission
```typescript
const usePermission = (permission: string) => {
  const { user } = useAuth();
  return user?.permissions?.includes(permission) || false;
};
```

### useDebounce
```typescript
const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### useFileUpload
```typescript
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const upload = async (file: File, type: string) => { ... };
  
  return { upload, uploading, progress };
};
```

### useLocalStorage
```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
};
```

### useDarkMode
```typescript
const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorage('dark-mode', false);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  
  const toggle = () => setIsDark(!isDark);
  
  return { isDark, toggle };
};
```

---

## Utility Functions

### cn (Class Name Utility)
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Formatters
```typescript
export const formatDate = (date: Date | string): string => { ... };
export const formatDateTime = (date: Date | string): string => { ... };
export const formatCurrency = (amount: number): string => { ... };
export const formatPhoneNumber = (phone: string): string => { ... };
export const truncateText = (text: string, length: number): string => { ... };
```

### Validators
```typescript
export const validateEmail = (email: string): boolean => { ... };
export const validatePhone = (phone: string): boolean => { ... };
export const validatePassword = (password: string): boolean => { ... };
export const validateUrl = (url: string): boolean => { ... };
```

---

## Component Styling

### Tailwind CSS Configuration
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Aalto Engineers brand colors
        brand: {
          orange: '#FF6B35',
          blue: '#1E3A5F',
          dark: '#0F172A',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
};
```

---

## Component Testing

### Unit Tests
```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration Tests
```typescript
describe('EnquiryForm', () => {
  it('submits form with valid data', async () => {
    render(<EnquiryForm />);
    // Fill form
    // Submit
    // Assert API call
  });
});
```

---

## Component Documentation

Each component should include:
1. JSDoc comments describing props and usage
2. Storybook stories for visual testing
3. TypeScript interfaces for props
4. Usage examples in code comments

---

## Performance Optimization

1. **React.memo**: Memoize components that don't need re-renders
2. **useMemo**: Memoize expensive calculations
3. **useCallback**: Memoize event handlers
4. **Code splitting**: Lazy load heavy components
5. **Virtual scrolling**: For large lists (react-window)
