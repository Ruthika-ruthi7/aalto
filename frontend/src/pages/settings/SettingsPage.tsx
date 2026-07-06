import { useState, useEffect, useRef } from 'react'
import { User, Lock, Bell, Save, X, Camera, Upload } from 'lucide-react'
import { useToast } from '../../components/common/Toast'
import Breadcrumb from '../../components/common/Breadcrumb'
import { apiClient } from '../../utils/apiClient'
import type { ApiResponse } from '../../types/common.types'

interface UserProfile {
  id: number
  full_name?: string
  first_name: string
  last_name: string
  username: string
  email: string
  mobile: string
  profile_image?: string | null
  role: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    full_name: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    mobile: '',
    profile_image: null,
    role: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setProfileLoading(true)
    try {
      const response = await apiClient.get<any>('/auth/profile')
      const apiResponse: ApiResponse<UserProfile> = response.data
      if (apiResponse.success && apiResponse.data) {
        setProfile({
          id: apiResponse.data.id,
          full_name: apiResponse.data.full_name || [apiResponse.data.first_name, apiResponse.data.last_name].filter(Boolean).join(' '),
          first_name: apiResponse.data.first_name || '',
          last_name: apiResponse.data.last_name || '',
          username: apiResponse.data.username || '',
          email: apiResponse.data.email || '',
          mobile: apiResponse.data.mobile || '',
          profile_image: apiResponse.data.profile_image || null,
          role: apiResponse.data.role || '',
        })
        setPhotoPreview(null)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim()
    const validationErrors: Record<string, string> = {}

    if (!fullName) validationErrors.full_name = 'Full name is required'
    if (!profile.username.trim()) validationErrors.username = 'Username is required'
    if (!profile.email.trim()) {
      validationErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      validationErrors.email = 'Valid email is required'
    }
    if (!profile.mobile.trim()) {
      validationErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(profile.mobile.trim())) {
      validationErrors.mobile = 'Mobile number must contain exactly 10 digits'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstError = Object.values(validationErrors)[0]
      setMessage({ type: 'error', text: firstError })
      toast.error(firstError)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('full_name', fullName)
      formData.append('first_name', profile.first_name.trim())
      formData.append('last_name', profile.last_name.trim())
      formData.append('username', profile.username.trim())
      formData.append('email', profile.email.trim())
      formData.append('mobile', profile.mobile.trim())

      const selectedFile = photoInputRef.current?.files?.[0]
      if (selectedFile) {
        formData.append('profile_image', selectedFile)
      }

      const response = await apiClient.put<any>('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const apiResponse: ApiResponse<UserProfile> = response.data
      if (apiResponse.success) {
        const updated = apiResponse.data || profile
        const updatedProfile = {
          ...profile,
          ...updated,
          full_name: updated.full_name || [updated.first_name, updated.last_name].filter(Boolean).join(' '),
          first_name: updated.first_name || '',
          last_name: updated.last_name || '',
          username: updated.username || '',
          email: updated.email || '',
          mobile: updated.mobile || '',
          profile_image: updated.profile_image || profile.profile_image || null,
          role: updated.role || profile.role,
        }

        setProfile(updatedProfile)

        const userData = localStorage.getItem('user')
        const displayName = updatedProfile.full_name || [updatedProfile.first_name, updatedProfile.last_name].filter(Boolean).join(' ') || updatedProfile.username
        const updatedUser = {
          ...(userData ? JSON.parse(userData) : {}),
          id: updatedProfile.id,
          User_id: updatedProfile.id,
          User_name: displayName,
          full_name: displayName,
          username: updatedProfile.username,
          first_name: updatedProfile.first_name,
          last_name: updatedProfile.last_name,
          email: updatedProfile.email,
          mobile: updatedProfile.mobile,
          profile_image: updatedProfile.profile_image,
          role: updatedProfile.role,
        }

        localStorage.setItem('user', JSON.stringify(updatedUser))
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }))

        if (userData) {
          window.dispatchEvent(new Event('storage'))
        }

        setMessage({ type: 'success', text: 'Profile updated successfully.' })
        toast.success('Profile updated successfully.')
        setPhotoPreview(null)
        if (photoInputRef.current) photoInputRef.current.value = ''
      } else {
        const errorMessage = apiResponse.message || apiResponse.error?.message || 'Failed to update profile'
        setMessage({ type: 'error', text: errorMessage })
        toast.error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error?.message || 'Failed to update profile'
      setMessage({ type: 'error', text: errorMessage })
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!passwordForm.current_password) {
      newErrors.current_password = 'Current password is required'
    }
    if (!passwordForm.new_password) {
      newErrors.new_password = 'New password is required'
    } else if (passwordForm.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters'
    }
    if (!passwordForm.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setMessage(null)
    setLoading(true)

    try {
      const response = await apiClient.post<any>('/auth/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })

      const apiResponse: ApiResponse<void> = response.data
      if (apiResponse.success) {
        setMessage({ type: 'success', text: 'Password changed successfully' })
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        setMessage({ type: 'error', text: apiResponse.error?.message || 'Failed to change password' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.response?.data?.error?.message || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Notification settings updated' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Photo size must be less than 2MB' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    enquiry_alerts: true,
    application_alerts: true,
    system_updates: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ]

  if (profileLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="lg:col-span-3 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Breadcrumb />
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMessage(null)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <p>{message.text}</p>
                <button onClick={() => setMessage(null)} className="p-1 hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center overflow-hidden">
                        {photoPreview || profile.profile_image ? (
                          <img src={photoPreview || profile.profile_image || ''} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <label htmlFor="profile-photo-upload" className="absolute bottom-0 right-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-300">
                        <Camera className="w-3.5 h-3.5 text-gray-600" />
                      </label>
                      <input
                        id="profile-photo-upload"
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{fullName || 'User'}</p>
                      <p className="text-sm text-gray-500">{profile.role}</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          id="profile-first_name"
                          type="text"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                          placeholder="First name"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                            errors.full_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <input
                          id="profile-last_name"
                          type="text"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                          placeholder="Last name"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                            errors.full_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        id="profile-username"
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        id="profile-email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input
                        id="profile-mobile"
                        type="tel"
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.mobile ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      loadProfile()
                      setMessage(null)
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.current_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.current_password && <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.new_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.new_password && <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                          errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.confirm_password && <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
                      setErrors({})
                      setMessage(null)
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'push_notifications', label: 'Push Notifications', desc: 'Receive in-app push notifications' },
                      { key: 'enquiry_alerts', label: 'Enquiry Alerts', desc: 'Get notified for new enquiries' },
                      { key: 'application_alerts', label: 'Application Alerts', desc: 'Get notified for new job applications' },
                      { key: 'system_updates', label: 'System Updates', desc: 'Receive system update notifications' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#2563EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleNotificationSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
