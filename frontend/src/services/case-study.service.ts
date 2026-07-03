import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { CaseStudy, CaseStudyFilters } from '../types/case-study.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const caseStudyService = {
  async getAll(filters?: CaseStudyFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<CaseStudy>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.service_type) params.append('service_type', filters.service_type)
      if (filters?.industry) params.append('industry', filters.industry)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.caseStudies}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<CaseStudy>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.caseStudyById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: FormData): Promise<ApiResponse<CaseStudy>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.caseStudies, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: FormData): Promise<ApiResponse<CaseStudy>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.caseStudyById(id), data, {
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
      await apiClient.delete(apiConfig.endpoints.caseStudyById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
