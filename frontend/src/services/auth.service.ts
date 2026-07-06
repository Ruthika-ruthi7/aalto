import api from './api'
import type { ApiResponse } from '../types/common.types'
import type { AuthResponse, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, ChangePasswordData } from '../types/auth.types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<{ access_token: string; token_type: string; expires_in: number }>> => {
    const response = await api.post<ApiResponse<{ access_token: string; token_type: string; expires_in: number }>>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout', { refresh_token: refreshToken })
    return response.data
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/change-password', data)
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/auth/profile')
    return response.data
  },

  updateProfile: async (data: FormData): Promise<ApiResponse<any>> => {
    const response = await api.put<ApiResponse<any>>('/auth/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
