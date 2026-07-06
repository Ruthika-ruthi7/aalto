export interface LoginCredentials {
  username: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  email: string
  username: string
  password: string
  first_name: string
  last_name: string
  role?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    role: string
    permissions: string[]
  }
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  new_password: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}
