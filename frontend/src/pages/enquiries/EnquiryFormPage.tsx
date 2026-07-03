import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { enquiryService } from '../../services/enquiry.service'
import { useToast } from '../../components/common/Toast'
import type { EnquiryFormData, EnquiryStatus } from '../../types/enquiry.types'

const statusOptions: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'start_working', label: 'Start Working' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'spam', label: 'Spam' },
  { value: 'closed', label: 'Closed' },
]

export default function EnquiryFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
    assigned_to: '',
    status: 'new',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

   
  useEffect(() => {
    if (id) {
      loadEnquiry(parseInt(id))
    }
  }, [id])

  const loadEnquiry = async (enquiryId: number) => {
    setLoading(true)
    try {
      const response = await enquiryService.getById(enquiryId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          subject: data.subject || '',
          message: data.message || '',
          assigned_to: (typeof data.assigned_to === 'object' ? data.assigned_to : (data.assigned_to || '')) as any,
          status: (data.status as EnquiryStatus) || 'new',
        })
      } else {
        toast.error('Failed to load enquiry')
      }
    } catch (error) {
      console.error('Failed to load enquiry:', error)
      toast.error('Failed to load enquiry')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    }

    if (formData.subject && formData.subject.length > 255) {
      newErrors.subject = 'Subject must be less than 255 characters'
    }

    if (formData.assigned_to && typeof formData.assigned_to === 'string' && formData.assigned_to.length > 100) {
      newErrors.assigned_to = 'Assigned to must be less than 100 characters'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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
      if (isEdit && id) {
        const response = await enquiryService.update(parseInt(id), formData)
        if (response.success) {
          toast.success('Enquiry updated successfully')
          navigate('/enquiries')
        } else {
          toast.error('Failed to update enquiry')
        }
      } else {
        const response = await enquiryService.create(formData)
        if (response.success) {
          toast.success('Enquiry created successfully')
          navigate('/enquiries')
        } else {
          toast.error('Failed to create enquiry')
        }
      }
    } catch (error) {
      console.error('Failed to save enquiry:', error)
      toast.error('Failed to save enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof EnquiryFormData, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/enquiries')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">
            {isView ? 'View Enquiry' : isEdit ? 'Edit Enquiry' : 'Add New Enquiry'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isView ? 'View enquiry details' : isEdit ? 'Update enquiry details' : 'Create a new enquiry'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                  errors.mobile ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter mobile number"
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter subject"
                maxLength={255}
              />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <input
                type="text"
                value={typeof formData.assigned_to === 'string' ? formData.assigned_to : ''}
                onChange={(e) => handleChange('assigned_to', e.target.value)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                  errors.assigned_to ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter assigned person"
                maxLength={100}
              />
              {errors.assigned_to && <p className="mt-1 text-sm text-red-500">{errors.assigned_to}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as EnquiryStatus)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter message"
                maxLength={5000}
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
            </div>
          </div>

          {/* Form Actions */}
          {!isView && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/enquiries')}
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
                <Save className="w-4 h-4" />
                {submitting ? 'Saving...' : isEdit ? 'Update Enquiry' : 'Create Enquiry'}
              </button>
            </div>
          )}
          {isView && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/enquiries/${id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Edit Enquiry
              </button>
              <button
                type="button"
                onClick={() => navigate('/enquiries')}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
