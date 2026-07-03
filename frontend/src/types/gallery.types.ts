export type GalleryStatus = 'active' | 'inactive'

export interface Gallery {
  id: number
  Bu_id?: number
  gallery_title?: string
  category?: string
  image_paths?: string[]
  images?: string[] | any[]
  description?: string
  status?: GalleryStatus
  uploaded_date?: string
  last_updated?: string
  created_at?: string
  updated_at?: string
}

export interface GalleryFormData {
  gallery_title?: string
  category?: string
  description?: string
  status?: GalleryStatus
  images?: File[] | string[] | any[]
  uploaded_date?: string
  last_updated?: string
}

export interface GalleryFilters {
  category?: string
  status?: GalleryStatus
  search?: string
}
