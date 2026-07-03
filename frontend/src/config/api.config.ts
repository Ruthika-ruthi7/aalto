const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)
const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true'
const ENABLE_DEBUG_MODE = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  enableMockApi: ENABLE_MOCK_API,
  enableDebugMode: ENABLE_DEBUG_MODE,
  endpoints: {
    // Auth
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    changePassword: '/auth/change-password',
    
    // Dashboard
    stats: '/dashboard/stats',
    analytics: '/dashboard/analytics',
    
    // Enquiries
    enquiries: '/enquiries',
    enquiryById: (id: number) => `/enquiries/${id}`,
    
    // Blogs
    blogs: '/blogs',
    blogById: (id: number) => `/blogs/${id}`,
    
    // Careers
    careers: '/careers',
    careerById: (id: number) => `/careers/${id}`,
    
    // Applicants
    applicants: '/applicants',
    applicantById: (id: number) => `/applicants/${id}`,
    
    // Gallery
    gallery: '/gallery',
    galleryById: (id: number) => `/gallery/${id}`,
    
    // Users
    users: '/users',
    userById: (id: number) => `/users/${id}`,
    
    // Notifications
    notifications: '/notifications',
    
    // Case Studies
    caseStudies: '/case-studies',
    caseStudyById: (id: number) => `/case-studies/${id}`,
    
    // Settings
    profile: '/settings/profile',
  },
} as const

export type ApiConfig = typeof apiConfig
