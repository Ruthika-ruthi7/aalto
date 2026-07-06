export type BlogStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export const BLOG_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  archived: 'bg-red-100 text-red-800',
  unpublished: 'bg-red-100 text-red-800',
}

export const BLOG_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  scheduled: 'Scheduled',
  archived: 'Archived',
  unpublished: 'Archived',
}

export const BLOG_STATUS_FILTER_OPTIONS: { value: BlogStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

export const BLOG_STATUS_FORM_OPTIONS: { value: BlogStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

export interface Blog {
  id: number
  title?: string
  blog_title?: string
  description?: string
  short_description?: string
  Bu_id?: number
  images?: string
  author?: string
  created_date?: string
  created_at?: string
  updated_date?: string
  updated_by?: string
  tags?: string
  subtitle?: string
  inside_description?: string
  blog_content?: string
  job_status?: BlogStatus
  featured_image?: string
  category?: string
  publish_date?: string
  updated_at?: string
  is_featured?: boolean
  slug?: string
  meta_title?: string
  meta_description?: string
  status?: BlogStatus
  views?: number
}

export interface BlogFormData {
  title: string
  blog_title?: string
  slug?: string
  category?: string
  featured_image?: File | string
  short_description?: string
  description?: string
  blog_content?: string
  author?: string
  tags?: string
  meta_title?: string
  meta_description?: string
  status?: BlogStatus
  is_featured?: boolean
  publish_date?: string
}

export interface BlogFilters {
  status?: BlogStatus
  category?: string
  is_featured?: boolean
  search?: string
}
