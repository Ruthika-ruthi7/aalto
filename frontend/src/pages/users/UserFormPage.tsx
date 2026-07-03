import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { userService } from '../../services/user.service'
import { useToast } from '../../components/common/Toast'
import type { UserFormData, UserRole, UserStatus } from '../../types/user.types'
import { roleOptions } from '../../types/user.types'

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export default function UserFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role: 'Viewer',
    status: 'active',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadUser(parseInt(id))
    }
  }, [id])

  const loadUser = async (userId: number) => {
    setLoading(true)
    try {
      const response = await userService.getById(userId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          full_name: data.full_name,
          username: data.username,
          email: data.email,
          password: '',
          confirm_password: '',
          phone: data.phone || '',
          role: data.role,
          status: data.status,
        })
      } else {
        toast.error('Failed to load user')
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      toast.error('Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match'
      }
    } else if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.warning('Please fix the validation errors')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      }

      if (isEdit && id) {
        const response = await userService.update(parseInt(id), submitData)
        if (response.success) {
          toast.success('User updated successfully')
          navigate('/users')
        } else {
          toast.error(response.error?.message || 'Failed to update user')
        }
      } else {
        const response = await userService.create(submitData)
        if (response.success) {
          toast.success('User created successfully')
          navigate('/users')
        } else {
          toast.error(response.error?.message || 'Failed to create user')
        }
      }
    } catch (error) {
      console.error('Failed to save user:', error)
      toast.error('Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="space-y-4">
            {[...Array(6)].map((_: any, i: number) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/users')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isView ? 'View User' : isEdit ? 'Edit User' : 'Add New User'}</h1>
          <p className="text-gray-600 mt-1">{isView ? 'View user details' : isEdit ? 'Update user details' : 'Create a new user account'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.full_name ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter full name"
                  maxLength={255}
                />
                {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter username"
                  maxLength={100}
                />
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter email address"
                  maxLength={255}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter phone number"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">{roleOptions.find(r => r.value === formData.role)?.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Password Section */}
          {!isView && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isEdit ? 'Change Password (Optional)' : 'Password'}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEdit ? 'New Password' : 'Password'} {!isEdit && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                    minLength={6}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password {!isEdit && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => handleChange('confirm_password', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                      errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEdit ? 'Confirm new password' : 'Confirm password'}
                  />
                  {errors.confirm_password && <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            {!isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-#2563EB hover:bg-#2563EBDark text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                </button>
              </>
            )}
            {isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/users/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit User
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
