export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role: 'super_admin' | 'customer_admin' | 'editor' | 'hr' | 'viewer'
  website_id?: number
  is_active: boolean
  email_verified: boolean
  last_login?: string
  permissions?: string[]
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

export interface PaginatedResponse<T> {
  items: T[]
  total?: number
  page?: number
  limit?: number
  page_size?: number
  total_items?: number
  totalPages?: number
  total_pages?: number
  has_next?: boolean
  has_previous?: boolean
  pagination?: {
    total?: number
    page?: number
    limit?: number
    page_size?: number
    total_items?: number
    totalPages?: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
  }
}

export interface PaginationParams {
  page?: number
  page_size?: number
}

export interface FilterParams {
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  start_date?: string
  end_date?: string
}
