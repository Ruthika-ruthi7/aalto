import { apiClient } from '../utils/apiClient'
import { apiConfig } from '../config/api.config'
import { handleApiError } from '../utils/errorHandler'
import type { Gallery, GalleryFilters } from '../types/gallery.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const galleryService = {
  async getAll(filters?: GalleryFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Gallery>>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters?.category) params.append('category', filters.category)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiClient.get<any>(
        `${apiConfig.endpoints.gallery}?${params.toString()}`
      )
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async getById(id: number): Promise<ApiResponse<Gallery>> {
    try {
      const response = await apiClient.get<any>(apiConfig.endpoints.galleryById(id))
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async create(data: FormData): Promise<ApiResponse<Gallery>> {
    try {
      const response = await apiClient.post<any>(apiConfig.endpoints.gallery, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },

  async update(id: number, data: FormData): Promise<ApiResponse<Gallery>> {
    try {
      const response = await apiClient.put<any>(apiConfig.endpoints.galleryById(id), data, {
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
      await apiClient.delete(apiConfig.endpoints.galleryById(id))
      return { success: true, data: null }
    } catch (error) {
      const apiError = handleApiError(error)
      return { success: false, error: apiError }
    }
  },
}
