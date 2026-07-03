import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Enquiry, EnquiryFormData, EnquiryFilters } from '../types/enquiry.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const enquiryService = {
  async getAll(filters?: EnquiryFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Enquiry>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.service_type) params.append('service_type', filters.service_type)
      if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to.toString())
      if (filters?.search) params.append('search', filters.search)
      if (filters?.start_date) params.append('start_date', filters.start_date)
      if (filters?.end_date) params.append('end_date', filters.end_date)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.enquiries}?${params.toString()}`
      )
      // Backend wraps data in { success, message, data }
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Enquiry>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.enquiryById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: EnquiryFormData): Promise<ApiResponse<Enquiry>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.enquiries, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: EnquiryFormData): Promise<ApiResponse<Enquiry>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.enquiryById(id), data)
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(apiConfig.endpoints.enquiryById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
