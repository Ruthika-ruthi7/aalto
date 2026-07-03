export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'HR' | 'Viewer'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: number
  full_name: string
  username: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  last_login?: string
  created_date: string
}

export interface UserFormData {
  full_name: string
  username: string
  email: string
  password?: string
  confirm_password?: string
  phone?: string
  role: UserRole
  status: UserStatus
}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  search?: string
}

export const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'Super Admin', label: 'Super Admin', description: 'Full access to all modules and settings' },
  { value: 'Admin', label: 'Admin', description: 'Manage website content and operational modules' },
  { value: 'Editor', label: 'Editor', description: 'Manage Blogs, Gallery and Case Studies' },
  { value: 'HR', label: 'HR', description: 'Manage Careers and Applicants' },
  { value: 'Viewer', label: 'Viewer', description: 'Read-only access' },
]
