export type UserRole = 'Super Admin' | 'Customer Admin' | 'Admin' | 'Editor' | 'HR' | 'Viewer'
export type UserStatus = 'active' | 'inactive'

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export type ModuleName = 
  | 'Dashboard' 
  | 'Enquiries' 
  | 'Blogs' 
  | 'Careers' 
  | 'Applicants' 
  | 'Gallery' 
  | 'Case Studies' 
  | 'User Management' 
  | 'Settings'
  | 'Reports'
  | 'Notifications'

export interface UserPermissions {
  [key: string]: Permission
}

export interface User {
  id: number
  username: string
  role: UserRole
  status: UserStatus
  permissions: UserPermissions | string
  last_login?: string
  created_at: string
  updated_at?: string
  created_by?: number
}

export interface UserFormData {
  username: string
  password?: string
  confirm_password?: string
  role: UserRole
  permissions: UserPermissions
  status: UserStatus
}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  search?: string
}

export const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'Super Admin', label: 'Super Admin' },
  { value: 'Customer Admin', label: 'Customer Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Editor', label: 'Editor' },
  { value: 'HR', label: 'HR' },
  { value: 'Viewer', label: 'Viewer' },
]

export const defaultPermissions: Record<UserRole, UserPermissions> = {
  'Super Admin': {
    'Dashboard': { create: true, read: true, update: true, delete: true },
    'Enquiries': { create: true, read: true, update: true, delete: true },
    'Blogs': { create: true, read: true, update: true, delete: true },
    'Careers': { create: true, read: true, update: true, delete: true },
    'Applicants': { create: true, read: true, update: true, delete: true },
    'Gallery': { create: true, read: true, update: true, delete: true },
    'Case Studies': { create: true, read: true, update: true, delete: true },
    'User Management': { create: true, read: true, update: true, delete: true },
    'Settings': { create: true, read: true, update: true, delete: true },
    'Reports': { create: true, read: true, update: true, delete: true },
    'Notifications': { create: true, read: true, update: true, delete: true },
  },
  'Customer Admin': {
    'Dashboard': { create: false, read: true, update: false, delete: false },
    'Enquiries': { create: true, read: true, update: true, delete: true },
    'Blogs': { create: true, read: true, update: true, delete: true },
    'Careers': { create: true, read: true, update: true, delete: true },
    'Applicants': { create: true, read: true, update: true, delete: true },
    'Gallery': { create: true, read: true, update: true, delete: true },
    'Case Studies': { create: true, read: true, update: true, delete: true },
    'User Management': { create: false, read: false, update: false, delete: false },
    'Settings': { create: false, read: false, update: false, delete: false },
    'Reports': { create: true, read: true, update: true, delete: true },
    'Notifications': { create: true, read: true, update: true, delete: true },
  },
  'Admin': {
    'Dashboard': { create: false, read: true, update: false, delete: false },
    'Enquiries': { create: true, read: true, update: true, delete: true },
    'Blogs': { create: true, read: true, update: true, delete: true },
    'Careers': { create: true, read: true, update: true, delete: true },
    'Applicants': { create: false, read: true, update: true, delete: false },
    'Gallery': { create: true, read: true, update: true, delete: true },
    'Case Studies': { create: true, read: true, update: true, delete: true },
    'User Management': { create: false, read: false, update: false, delete: false },
    'Settings': { create: false, read: true, update: true, delete: false },
    'Reports': { create: true, read: true, update: true, delete: true },
    'Notifications': { create: true, read: true, update: true, delete: true },
  },
  'Editor': {
    'Dashboard': { create: false, read: true, update: false, delete: false },
    'Enquiries': { create: false, read: false, update: false, delete: false },
    'Blogs': { create: true, read: true, update: true, delete: true },
    'Careers': { create: false, read: false, update: false, delete: false },
    'Applicants': { create: false, read: false, update: false, delete: false },
    'Gallery': { create: true, read: true, update: true, delete: true },
    'Case Studies': { create: true, read: true, update: true, delete: true },
    'User Management': { create: false, read: false, update: false, delete: false },
    'Settings': { create: false, read: false, update: false, delete: false },
    'Reports': { create: false, read: false, update: false, delete: false },
    'Notifications': { create: false, read: false, update: false, delete: false },
  },
  'HR': {
    'Dashboard': { create: false, read: true, update: false, delete: false },
    'Enquiries': { create: false, read: false, update: false, delete: false },
    'Blogs': { create: false, read: false, update: false, delete: false },
    'Careers': { create: true, read: true, update: true, delete: true },
    'Applicants': { create: true, read: true, update: true, delete: true },
    'Gallery': { create: false, read: false, update: false, delete: false },
    'Case Studies': { create: false, read: false, update: false, delete: false },
    'User Management': { create: false, read: false, update: false, delete: false },
    'Settings': { create: false, read: false, update: false, delete: false },
    'Reports': { create: false, read: false, update: false, delete: false },
    'Notifications': { create: false, read: false, update: false, delete: false },
  },
  'Viewer': {
    'Dashboard': { create: false, read: true, update: false, delete: false },
    'Enquiries': { create: false, read: true, update: false, delete: false },
    'Blogs': { create: false, read: true, update: false, delete: false },
    'Careers': { create: false, read: true, update: false, delete: false },
    'Applicants': { create: false, read: true, update: false, delete: false },
    'Gallery': { create: false, read: true, update: false, delete: false },
    'Case Studies': { create: false, read: true, update: false, delete: false },
    'User Management': { create: false, read: false, update: false, delete: false },
    'Settings': { create: false, read: false, update: false, delete: false },
    'Reports': { create: false, read: true, update: false, delete: false },
    'Notifications': { create: false, read: true, update: false, delete: false },
  },
}
