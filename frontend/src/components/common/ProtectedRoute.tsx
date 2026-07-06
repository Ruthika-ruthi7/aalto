import { Navigate, useLocation } from 'react-router-dom'
import { STORAGE_KEYS } from '../../utils/constants'
import { ModuleName } from '../../types/user.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  module?: ModuleName
}

const moduleRoutes: Record<string, ModuleName> = {
  '/dashboard': 'Dashboard',
  '/enquiries': 'Enquiries',
  '/blogs': 'Blogs',
  '/careers': 'Careers',
  '/applicants': 'Applicants',
  '/gallery': 'Gallery',
  '/case-studies': 'Case Studies',
  '/users': 'User Management',
  '/settings': 'Settings',
}

export default function ProtectedRoute({ children, module }: ProtectedRouteProps) {
  const location = useLocation()
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const userData = localStorage.getItem(STORAGE_KEYS.USER)
  const user = userData ? JSON.parse(userData) : null

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Determine module from path if not provided
  const path = location.pathname
  const targetModule = module || Object.keys(moduleRoutes).find(r => path === r || path.startsWith(r + '/')) ? moduleRoutes[Object.keys(moduleRoutes).find(r => path === r || path.startsWith(r + '/'))!] : null

  if (targetModule && user.role !== 'Super Admin') {
    const permissions = user.permissions || {}
    if (!permissions[targetModule] || !permissions[targetModule].read) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}
