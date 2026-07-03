import { mockCareers } from './mockData'
import type { Career, CareerFormData, CareerFilters } from '../types/career.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const careerServiceMock = {
  getCareers: async (filters?: CareerFilters, page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Career>>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    let filtered = [...mockCareers]

    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters?.department) {
      filtered = filtered.filter(c => c.department === filters.department)
    }
    if (filters?.employment_type) {
      filtered = filtered.filter(c => c.employment_type === filters.employment_type)
    }
    if (filters?.work_mode) {
      filtered = filtered.filter(c => c.work_mode === filters.work_mode)
    }
    if (filters?.location) {
      filtered = filtered.filter(c => filters.location && c.location.includes(filters.location))
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.job_title.toLowerCase().includes(search) ||
        c.department.toLowerCase().includes(search) ||
        c.key_skills?.toLowerCase().includes(search)
      )
    }

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (page - 1) * pageSize
    const items = filtered.slice(startIndex, startIndex + pageSize)

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          page_size: pageSize,
          total_items: totalItems,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_previous: page > 1,
        },
      },
    }
  },

  getCareer: async (id: number): Promise<ApiResponse<Career>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const career = mockCareers.find(c => c.id === id)
    if (!career) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Career not found' } }
    }
    return { success: true, data: career }
  },

  createCareer: async (data: CareerFormData): Promise<ApiResponse<Career>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newCareer: Career = {
      id: Math.max(...mockCareers.map(c => c.id)) + 1,
      ...data,
      posted_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockCareers.push(newCareer)
    return { success: true, data: newCareer, message: 'Career created successfully' }
  },

  updateCareer: async (id: number, data: Partial<CareerFormData>): Promise<ApiResponse<Career>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockCareers.findIndex(c => c.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Career not found' } }
    }
    mockCareers[index] = { ...mockCareers[index], ...data, updated_at: new Date().toISOString() }
    return { success: true, data: mockCareers[index], message: 'Career updated successfully' }
  },

  deleteCareer: async (id: number): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockCareers.findIndex(c => c.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Career not found' } }
    }
    mockCareers.splice(index, 1)
    return { success: true, data: null, message: 'Career deleted successfully' }
  },
}
