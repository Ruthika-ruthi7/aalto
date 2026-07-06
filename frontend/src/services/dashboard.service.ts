import api from './api'
import type { DashboardStats, DashboardAnalytics } from '../types/dashboard.types'
import type { ApiResponse, ApiError, PaginatedResponse } from '../types/common.types'

function pickTotal(payload: any): number {
  // Backend returns: { success: true, message, data }
  // data is expected to be: { total, items, ... }
  const candidates = [
    payload?.data?.total,
    payload?.data?.data?.total,
    payload?.total,
    payload?.data?.pagination?.total,
    payload?.data?.data?.pagination?.total,
  ]

  for (const v of candidates) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  }

  return 0
}

function pickItems(payload: any): any[] {
  return (
    payload?.data?.items ||
    payload?.data?.data?.items ||
    payload?.items ||
    []
  )
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      console.log('[DASHBOARD] Fetching stats from API...')

      const [enquiriesRes, blogsRes, careersRes, applicantsRes, galleryRes] = await Promise.all([
        api.get('/enquiries?page=1&limit=1'),
        api.get('/blogs?page=1&limit=1'),
        api.get('/careers?page=1&limit=1'),
        api.get('/applicants?page=1&limit=1'),
        api.get('/gallery?page=1&limit=1'),
      ]).catch(() => {
        // If one request fails, Promise.all rejects; handle individually below.
        return [
          api.get('/enquiries?page=1&limit=1').catch(e => (console.error('Enquiries error:', e), { data: null })),
          api.get('/blogs?page=1&limit=1').catch(e => (console.error('Blogs error:', e), { data: null })),
          api.get('/careers?page=1&limit=1').catch(e => (console.error('Careers error:', e), { data: null })),
          api.get('/applicants?page=1&limit=1').catch(e => (console.error('Applicants error:', e), { data: null })),
          api.get('/gallery?page=1&limit=1').catch(e => (console.error('Gallery error:', e), { data: null })),
        ] as any
      })

      const stats: DashboardStats = {
        total_enquiries: pickTotal(enquiriesRes),
        total_blogs: pickTotal(blogsRes),
        active_careers: pickTotal(careersRes),
        total_applications: pickTotal(applicantsRes),
        gallery_count: pickTotal(galleryRes),
        case_studies: 0, // No endpoint yet
        new_enquiries_today: 0, // Would need date filtering
      }

      console.log('[DASHBOARD] Final stats:', stats)
      return { success: true, data: stats }
    } catch (error: any) {
      console.error('[DASHBOARD] Failed to fetch dashboard stats:', error)
      const apiError: ApiError = { message: 'Failed to fetch dashboard stats' }
      return { success: false, error: apiError }
    }
  },

  getAnalytics: async (): Promise<ApiResponse<DashboardAnalytics>> => {
    try {
      const enquiriesRes = await api.get('/enquiries?page=1&limit=1000')

      const monthlyData: { month: string; count: number }[] = []
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentYear = new Date().getFullYear()

      for (let i = 0; i < 12; i++) {
        monthlyData.push({ month: monthNames[i], count: 0 })
      }

      const items = pickItems(enquiriesRes)
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((enquiry: any) => {
          const createdDate = new Date(enquiry.created_at)
          if (!Number.isNaN(createdDate.getTime()) && createdDate.getFullYear() === currentYear) {
            const monthIndex = createdDate.getMonth()
            monthlyData[monthIndex].count++
          }
        })
      }

      const analytics: DashboardAnalytics = {
        enquiries_trend: monthlyData,
        applications_trend: [],
        blog_views: [],
      }

      console.log('[DASHBOARD] Real analytics data:', analytics)
      return { success: true, data: analytics }
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error)
      return { success: false, error: { message: 'Failed to fetch analytics' } }
    }
  },
}

