import { mockBlogs } from './mockData'
import type { Blog, BlogFormData, BlogFilters } from '../types/blog.types'
import type { ApiResponse, PaginatedResponse } from '../types/common.types'

export const blogServiceMock = {
  getBlogs: async (filters?: BlogFilters, page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Blog>>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    let filtered = [...mockBlogs]

    if (filters?.status) {
      filtered = filtered.filter(b => b.status === filters.status)
    }
    if (filters?.category) {
      filtered = filtered.filter(b => b.category === filters.category)
    }
    if (filters?.is_featured !== undefined) {
      filtered = filtered.filter(b => b.is_featured === filters.is_featured)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(b =>
        b.blog_title.toLowerCase().includes(search) ||
        b.short_description?.toLowerCase().includes(search)
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

  getBlog: async (id: number): Promise<ApiResponse<Blog>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const blog = mockBlogs.find(b => b.id === id)
    if (!blog) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Blog not found' } }
    }
    return { success: true, data: blog }
  },

  createBlog: async (data: BlogFormData): Promise<ApiResponse<Blog>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newBlog: Blog = {
      id: Math.max(...mockBlogs.map(b => b.id)) + 1,
      ...data,
      featured_image: typeof data.featured_image === 'string' ? data.featured_image : '/uploads/blog/default.jpg',
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockBlogs.push(newBlog)
    return { success: true, data: newBlog, message: 'Blog created successfully' }
  },

  updateBlog: async (id: number, data: Partial<BlogFormData>): Promise<ApiResponse<Blog>> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockBlogs.findIndex(b => b.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Blog not found' } }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data }
    if (data.featured_image && typeof data.featured_image !== 'string') {
      updateData.featured_image = '/uploads/blog/default.jpg'
    }
    mockBlogs[index] = { ...mockBlogs[index], ...updateData, updated_at: new Date().toISOString() }
    return { success: true, data: mockBlogs[index], message: 'Blog updated successfully' }
  },

  deleteBlog: async (id: number): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBlogs.findIndex(b => b.id === id)
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Blog not found' } }
    }
    mockBlogs.splice(index, 1)
    return { success: true, data: null, message: 'Blog deleted successfully' }
  },
}
