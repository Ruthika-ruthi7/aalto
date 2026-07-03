import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Notification, NotificationResponse } from '../types/notification.types'
import type { ApiResponse } from '../types/common.types'

export const notificationService = {
  async getAll(page = 1, limit = 20): Promise<ApiResponse<NotificationResponse>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.notifications}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Notification>> {
    try {
      const response = await apiClient.get<any>(`${apiConfig.endpoints.notifications}/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: any): Promise<ApiResponse<Notification>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.notifications, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async markAsRead(id: number): Promise<ApiResponse<Notification>> {
    try {
      const response = await apiClient.patch<any>(`${apiConfig.endpoints.notifications}/${id}/read`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async markAsUnread(id: number): Promise<ApiResponse<Notification>> {
    try {
      const response = await apiClient.patch<any>(`${apiConfig.endpoints.notifications}/${id}/unread`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async markAllAsRead(): Promise<ApiResponse<{ affectedRows: number }>> {
    try {
      const response = await apiClient.patch<any>(`${apiConfig.endpoints.notifications}/mark-all-read`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`${apiConfig.endpoints.notifications}/${id}`)
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getUnreadCount(): Promise<ApiResponse<{ unread: number }>> {
    try {
      const response = await apiClient.get<any>(`${apiConfig.endpoints.notifications}/unread-count`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
