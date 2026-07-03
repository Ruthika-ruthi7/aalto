import { mockApplicants } from './mockData'
import type { Applicant, ApplicantFormData, ApplicantFilters } from '../types/applicant.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const applicantServiceMock = {
  getApplicants: async (filters?: ApplicantFilters, page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Applicant>>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    let filtered = [...mockApplicants]

    if (filters?.career_id) {
      filtered = filtered.filter(a => a.career_id === filters.career_id)
    }
    if (filters?.status) {
      filtered = filtered.filter(a => a.status === filters.status)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(a =>
        a.applicant_name.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.mobile.includes(search)
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

  getApplicant: async (id: number): Promise<ApiResponse<Applicant>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const applicant = mockApplicants.find(a => a.id === id)
    if (!applicant) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Applicant not found' } }
    }
    return { success: true, data: applicant }
  },

  createApplicant: async (data: ApplicantFormData): Promise<ApiResponse<Applicant>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newApplicant: Applicant = {
      id: Math.max(...mockApplicants.map(a => a.id)) + 1,
      ...data,
      resume_path: typeof data.resume_path === 'string' ? data.resume_path : '/uploads/applicants/default.pdf',
      applied_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockApplicants.push(newApplicant)
    return { success: true, data: newApplicant, message: 'Applicant created successfully' }
  },

  updateApplicant: async (id: number, data: Partial<ApplicantFormData>): Promise<ApiResponse<Applicant>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockApplicants.findIndex(a => a.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Applicant not found' } }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data }
    if (data.resume_path && typeof data.resume_path !== 'string') {
      updateData.resume_path = '/uploads/applicants/default.pdf'
    }
    mockApplicants[index] = { ...mockApplicants[index], ...updateData, updated_at: new Date().toISOString() }
    return { success: true, data: mockApplicants[index], message: 'Applicant updated successfully' }
  },

  deleteApplicant: async (id: number): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockApplicants.findIndex(a => a.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Applicant not found' } }
    }
    mockApplicants.splice(index, 1)
    return { success: true, data: null, message: 'Applicant deleted successfully' }
  },
}
