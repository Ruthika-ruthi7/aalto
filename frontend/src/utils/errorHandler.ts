import axios, { AxiosError } from 'axios'

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: unknown
}

export class ApiErrorHandler {
  static handle(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return this.handleAxiosError(error)
    }

    if (error instanceof Error) {
      return {
        message: error.message,
      }
    }

    return {
      message: 'An unexpected error occurred',
    }
  }

  private static handleAxiosError(error: AxiosError): ApiError {
    const response = error.response
    const request = error.request

    if (response) {
      // Server responded with error status
      const data = response.data as { message?: string; error?: string; code?: string }
      return {
        message: data?.message || data?.error || this.getDefaultMessage(response.status),
        code: data?.code,
        status: response.status,
        details: response.data,
      }
    }

    if (request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      }
    }

    // Request setup error
    return {
      message: error.message || 'Request configuration error',
      code: 'REQUEST_ERROR',
    }
  }

  private static getDefaultMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Forbidden. You do not have permission.',
      404: 'Resource not found.',
      409: 'Conflict. The resource already exists.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Bad gateway. Service unavailable.',
      503: 'Service unavailable. Please try again later.',
    }

    return messages[status] || 'An error occurred. Please try again.'
  }

  static isNetworkError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return !error.response && !!error.request
    }
    return false
  }

  static isAuthError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 401
    }
    return false
  }

  static isValidationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 422
    }
    return false
  }
}

export const handleApiError = (error: unknown): ApiError => {
  return ApiErrorHandler.handle(error)
}
