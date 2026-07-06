import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react'
import { userService } from '../../services/user.service'
import { useToast } from '../../components/common/Toast'
import type { UserFormData, UserRole, UserStatus, UserPermissions } from '../../types/user.types'
import { roleOptions, defaultPermissions } from '../../types/user.types'
import PasswordStrength from '../../components/users/PasswordStrength'
import PermissionMatrix from '../../components/users/PermissionMatrix'
import Breadcrumb from '../../components/common/Breadcrumb'

export default function UserFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const toast = useToast()

  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    confirm_password: '',
    role: 'Viewer',
    permissions: defaultPermissions['Viewer'],
    status: 'active',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        let perms: UserPermissions
        try {
          perms = typeof data.permissions === 'string' ? JSON.parse(data.permissions) : data.permissions
        } catch (e) {
          perms = defaultPermissions[data.role]
        }

        setFormData({
          username: data.username,
          password: '',
          confirm_password: '',
          role: data.role,
          permissions: perms,
          status: data.status,
        })
      }
    } catch (error) {
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role: UserRole) => {
    if (isView) return
    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role],
    }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = 'Username is required'

    if (!isEdit && !isView) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
        if (!passRegex.test(formData.password)) {
          newErrors.password = 'Password does not meet requirements'
        }
      }

      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isView) return

    if (!validate()) {
      toast.error('Please correct the errors in the form')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        username: formData.username,
        role: formData.role,
        permissions: formData.permissions,
        status: formData.status,
        ...(formData.password ? { password: formData.password } : {}),
      }

      const response = isEdit
        ? await userService.update(parseInt(id!), payload)
        : await userService.create(payload as any)

      if (response.success) {
        toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`)
        navigate('/users')
      } else {
        toast.error(response.error?.message || 'Action failed')
      }
    } catch (error) {
      toast.error('A system error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`

  const passwordFieldClass = (field: string) =>
    `w-full px-4 py-2.5 pr-11 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`

  if (loading) {
    return (
      <div className="p-8">
        <div className="mx-auto w-full max-w-3xl animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pageTitle = isView ? 'View User' : isEdit ? 'Edit User' : 'Add New User'
  const pageDescription = isView
    ? 'View user account details and permissions'
    : isEdit
      ? 'Update user account details and permissions'
      : 'Create a new administrative user account'

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">{pageTitle}</h1>
            <Breadcrumb />
            <p className="text-gray-600 mt-1">{pageDescription}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isView}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                    className={fieldClass('username')}
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isView}
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                      isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                    }`}
                  >
                    {roleOptions.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    disabled={isView}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                      isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {!isView && (
              <div className="pt-2 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {isEdit ? 'Update Password' : 'Security'}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isEdit ? 'New Password' : 'Password'} {!isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
                        className={passwordFieldClass('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    <PasswordStrength password={formData.password || ''} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password {!isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        placeholder="Re-enter password"
                        className={passwordFieldClass('confirm_password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isView && (
              <div className="pt-2 border-t border-gray-200">
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-[#2563EB]" />
                  <h3 className="text-base font-semibold text-gray-900">Account Protected</h3>
                  <p className="text-sm text-gray-500">Passwords are encrypted and cannot be viewed.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Role-Based Permissions</h2>
              <p className="text-sm text-gray-500 mt-1">Define module-level access for this user</p>
            </div>

            <PermissionMatrix
              permissions={formData.permissions}
              onChange={(perms) => setFormData({ ...formData, permissions: perms })}
              disabled={isView || (formData.role !== 'Super Admin' && !isEdit)}
            />
          </div>

          {!isView && (
            <div className="flex items-center justify-end gap-4">
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
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEdit ? 'Update User' : 'Create User'}
                  </>
                )}
              </button>
            </div>
          )}

          {isView && (
            <div className="flex items-center justify-end gap-4">
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
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
