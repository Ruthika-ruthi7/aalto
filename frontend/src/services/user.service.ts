import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { User, UserFilters, UserFormData } from '../types/user.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const userService = {
  async getAll(filters?: UserFilters, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.role) params.append('role', filters.role)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.users}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<any>(`${apiConfig.endpoints.users}/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: UserFormData): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.users, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: Partial<UserFormData>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<any>(`${apiConfig.endpoints.users}/${id}`, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`${apiConfig.endpoints.users}/${id}`)
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async toggleStatus(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<any>(`${apiConfig.endpoints.users}/${id}/toggle-status`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async resetPassword(id: number, password: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.post(`${apiConfig.endpoints.users}/${id}/reset-password`, { password })
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
