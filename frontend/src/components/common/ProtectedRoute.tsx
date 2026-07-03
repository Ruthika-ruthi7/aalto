import { Navigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../../utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const user = localStorage.getItem(STORAGE_KEYS.USER)

  if (!token || !user) {
    console.log('[PROTECTED ROUTE] No token or user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('[PROTECTED ROUTE] User authenticated, rendering protected content')
  return <>{children}</>
}
