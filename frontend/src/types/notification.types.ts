export interface Notification {
  id: number
  user_id: number
  title: string
  module_name: string
  description: string
  is_read: boolean
  priority?: 'high' | 'medium' | 'low'
  created_at: string
  updated_at: string
}

export interface NotificationFormData {
  user_id: number
  title: string
  module_name: string
  description?: string
  is_read?: boolean
}

export interface NotificationResponse {
  items: Notification[]
  total: number
  page: number
  limit: number
  totalPages: number
  unread: number
}

export type NotificationModule = 'Enquiries' | 'Blogs' | 'Careers' | 'Applicants' | 'Gallery' | 'Users' | 'Case Studies' | 'Settings'
