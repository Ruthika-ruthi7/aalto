import api from './api'
import type { DashboardStats, DashboardAnalytics } from '../types/dashboard.types'
import type { ApiResponse } from '../types/common.types'

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      console.log('[DASHBOARD] Fetching stats from API...')
      
      // Fetch counts from different endpoints
      const [enquiriesRes, blogsRes, careersRes, applicantsRes, galleryRes] = await Promise.all([
        api.get('/enquiries?page=1&limit=1').catch(e => { console.error('Enquiries error:', e); return { data: null } }),
        api.get('/blogs?page=1&limit=1').catch(e => { console.error('Blogs error:', e); return { data: null } }),
        api.get('/careers?page=1&limit=1').catch(e => { console.error('Careers error:', e); return { data: null } }),
        api.get('/applicants?page=1&limit=1').catch(e => { console.error('Applicants error:', e); return { data: null } }),
        api.get('/gallery?page=1&limit=1').catch(e => { console.error('Gallery error:', e); return { data: null } }),
      ])

      console.log('[DASHBOARD] API responses:', {
        enquiries: enquiriesRes.data,
        blogs: blogsRes.data,
        careers: careersRes.data,
        applicants: applicantsRes.data,
        gallery: galleryRes.data
      })

      const stats: DashboardStats = {
        total_enquiries: enquiriesRes.data?.data?.total || 0,
        total_blogs: blogsRes.data?.data?.total || 0,
        active_careers: careersRes.data?.data?.total || 0,
        total_applications: applicantsRes.data?.data?.total || 0,
        gallery_count: galleryRes.data?.data?.total || 0,
        case_studies: 0, // No endpoint yet
        new_enquiries_today: 0, // Would need date filtering
      }

      console.log('[DASHBOARD] Final stats:', stats)
      return { success: true, data: stats }
    } catch (error) {
      console.error('[DASHBOARD] Failed to fetch dashboard stats:', error)
      return { success: false, error: { message: 'Failed to fetch dashboard stats' } }
    }
  },

  getAnalytics: async (): Promise<ApiResponse<DashboardAnalytics>> => {
    try {
      // Fetch real analytics data from enquiries endpoint with date grouping
      const enquiriesRes = await api.get('/enquiries?page=1&limit=1000').catch(e => {
        console.error('Analytics error:', e)
        return { data: null }
      })

      // Generate monthly trend from real data
      const monthlyData: { month: string; count: number }[] = []
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentYear = new Date().getFullYear()

      // Initialize all months with 0
      for (let i = 0; i < 12; i++) {
        monthlyData.push({ month: monthNames[i], count: 0 })
      }

      // Count enquiries by month from real data
      if (enquiriesRes.data?.data?.items) {
        enquiriesRes.data.data.items.forEach((enquiry: any) => {
          const createdDate = new Date(enquiry.created_at)
          if (createdDate.getFullYear() === currentYear) {
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
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      return { success: false, error: { message: 'Failed to fetch analytics' } }
    }
  },
}
