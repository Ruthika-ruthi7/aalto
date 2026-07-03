import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Applicant, ApplicantFilters } from '../types/applicant.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const applicantService = {
  async getAll(filters?: ApplicantFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Applicant>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.career_id) params.append('career_id', filters.career_id.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.applicants}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Applicant>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.applicantById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: FormData): Promise<ApiResponse<Applicant>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.applicants, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: FormData): Promise<ApiResponse<Applicant>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.applicantById(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(apiConfig.endpoints.applicantById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
