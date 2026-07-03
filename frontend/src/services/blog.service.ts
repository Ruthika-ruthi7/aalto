import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Blog, BlogFilters } from '../types/blog.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const blogService = {
  async getAll(filters?: BlogFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Blog>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString())
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.blogs}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Blog>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.blogById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: FormData): Promise<ApiResponse<Blog>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.blogs, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: FormData): Promise<ApiResponse<Blog>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.blogById(id), data, {
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
      await apiClient.delete(apiConfig.endpoints.blogById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
