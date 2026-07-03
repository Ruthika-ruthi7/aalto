import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Career, CareerFormData, CareerFilters } from '../types/career.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const careerService = {
  async getAll(filters?: CareerFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Career>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.department) params.append('department', filters.department)
      if (filters?.employment_type) params.append('employment_type', filters.employment_type)
      if (filters?.work_mode) params.append('work_mode', filters.work_mode)
      if (filters?.location) params.append('location', filters.location)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.careers}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Career>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.careerById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: CareerFormData): Promise<ApiResponse<Career>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.careers, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: CareerFormData): Promise<ApiResponse<Career>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.careerById(id), data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(apiConfig.endpoints.careerById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
