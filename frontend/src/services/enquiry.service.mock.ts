import { mockEnquiries } from './mockData'
import type { Enquiry, EnquiryFormData, EnquiryFilters } from '../types/enquiry.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

// Mock API service for enquiries - will be replaced with real API calls
export const enquiryServiceMock = {
  getEnquiries: async (filters?: EnquiryFilters, page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Enquiry>>> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

    let filtered = [...mockEnquiries]

    if (filters?.status) {
      filtered = filtered.filter(e => e.status === filters.status)
    }
    if (filters?.service_type) {
      filtered = filtered.filter(e => e.service_type === filters.service_type)
    }
    if (filters?.assigned_to) {
      filtered = filtered.filter(e => typeof e.assigned_to === 'object' && e.assigned_to?.id === filters.assigned_to)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(e =>
        e.full_name.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.company_name?.toLowerCase().includes(search) ||
        e.subject.toLowerCase().includes(search)
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

  getEnquiry: async (id: number): Promise<ApiResponse<Enquiry>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const enquiry = mockEnquiries.find(e => e.id === id)
    if (!enquiry) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Enquiry not found' } }
    }
    return { success: true, data: enquiry }
  },

  createEnquiry: async (data: EnquiryFormData): Promise<ApiResponse<Enquiry>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newEnquiry: Enquiry = {
      id: Math.max(...mockEnquiries.map(e => e.id)) + 1,
      ...data,
      assigned_to: data.assigned_to ? { id: data.assigned_to, first_name: 'User', last_name: 'Name' } : undefined,
      enquiry_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockEnquiries.push(newEnquiry)
    return { success: true, data: newEnquiry, message: 'Enquiry created successfully' }
  },

  updateEnquiry: async (id: number, data: Partial<EnquiryFormData>): Promise<ApiResponse<Enquiry>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockEnquiries.findIndex(e => e.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Enquiry not found' } }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data }
    if (data.assigned_to) {
      updateData.assigned_to = { id: data.assigned_to, first_name: 'User', last_name: 'Name' }
    }
    mockEnquiries[index] = { ...mockEnquiries[index], ...updateData, updated_at: new Date().toISOString() }
    return { success: true, data: mockEnquiries[index], message: 'Enquiry updated successfully' }
  },

  deleteEnquiry: async (id: number): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockEnquiries.findIndex(e => e.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Enquiry not found' } }
    }
    mockEnquiries.splice(index, 1)
    return { success: true, data: null, message: 'Enquiry deleted successfully' }
  },

  updateStatus: async (id: number, status: string, reason?: string): Promise<ApiResponse<Enquiry>> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockEnquiries.findIndex(e => e.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Enquiry not found' } }
    }
    mockEnquiries[index] = {
      ...mockEnquiries[index],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: status as any,
      hold_reason: status === 'on_hold' ? reason : undefined,
      closing_remarks: status === 'closed' ? reason : undefined,
      updated_at: new Date().toISOString(),
    }
    return { success: true, data: mockEnquiries[index], message: 'Status updated successfully' }
  },
}
