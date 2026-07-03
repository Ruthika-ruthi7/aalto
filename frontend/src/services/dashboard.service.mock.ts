import { mockDashboardStats, mockDashboardAnalytics } from './mockData'
import type { DashboardStats, DashboardAnalytics } from '../types/dashboard.types'
import type { ApiResponse } from '../types/common.types'

// Mock API service for dashboard - will be replaced with real API calls
export const dashboardServiceMock = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true, data: mockDashboardStats }
  },

  getAnalytics: async (): Promise<ApiResponse<DashboardAnalytics>> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return { success: true, data: mockDashboardAnalytics }
  },
}
