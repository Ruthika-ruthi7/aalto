export interface DashboardStats {
  total_enquiries: number
  total_applications: number
  total_blogs: number
  active_careers: number
  case_studies: number
  gallery_count: number
  new_enquiries_today: number
}

export interface EnquiryTrend {
  month: string
  count: number
}

export interface DashboardAnalytics {
  enquiries_trend: EnquiryTrend[]
  applications_trend?: EnquiryTrend[]
  blog_views?: any[]
}
