import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload } from 'lucide-react'
import { applicantService } from '../../services/applicant.service'
import { useToast } from '../../components/common/Toast'
import type { ApplicantFormData, ApplicantStatus } from '../../types/applicant.types'

const statusOptions: { value: ApplicantStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'selected', label: 'Selected' },
  { value: 'offered', label: 'Offered' },
  { value: 'joined', label: 'Joined' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'on_hold', label: 'On Hold' },
]

const convertToFormData = (data: ApplicantFormData): FormData => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === 'number') {
        formData.append(key, String(value))
      } else if (value !== '') {
        formData.append(key, String(value))
      }
    }
  })
  return formData
}

export default function ApplicantFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<ApplicantFormData>({
    career_id: 1,
    name: '',
    applicant_name: '',
    mobile: '',
    phone: '',
    email: '',
    current_location: '',
    experience: '',
    current_company: '',
    current_ctc: undefined,
    expected_ctc: undefined,
    notice_period: '',
    resume_path: undefined,
    resume: undefined,
    status: 'new',
    rejection_reason: '',
    hold_reason: '',
    interview_date: '',
    interview_feedback: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

   
   
  useEffect(() => {
    if (id) {
      loadApplicant(parseInt(id))
    }
  }, [id])

  const loadApplicant = async (applicantId: number) => {
    setLoading(true)
    try {
      const response = await applicantService.getById(applicantId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          career_id: data.career_id || data.apply_id,
          name: data.name || data.applicant_name,
          mobile: data.mobile || data.phone,
          phone: data.phone || data.mobile,
          email: data.email,
          current_location: data.address || data.current_location,
          experience: data.experience,
          current_company: data.current_company,
          current_ctc: data.current_ctc,
          expected_ctc: data.expected_ctc,
          notice_period: data.notice_period,
          resume_path: data.resume || data.resume_path,
          resume: data.resume || data.resume_path,
          status: data.status,
          rejection_reason: data.rejection_reason,
          hold_reason: data.hold_reason,
          interview_date: data.interview_date,
          interview_feedback: data.interview_feedback,
        })
      } else {
        toast.error('Failed to load applicant')
      }
    } catch (error) {
      console.error('Failed to load applicant:', error)
      toast.error('Failed to load applicant')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim() && !formData.applicant_name?.trim()) {
      newErrors.name = 'Applicant name is required'
    } else if ((formData.name || formData.applicant_name || '').length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if ((formData.name || formData.applicant_name || '').length > 255) {
      newErrors.name = 'Name must be less than 255 characters'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '')) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.mobile?.trim() && !formData.phone?.trim()) {
      newErrors.mobile = 'Phone number is required'
    } else if (!/^[\d\s+\-()]{10,20}$/.test(formData.mobile || formData.phone || '')) {
      newErrors.mobile = 'Invalid phone number format'
    }

    if (!isEdit && !formData.resume_path && !formData.resume) {
      newErrors.resume = 'Resume is required'
    }

    if (formData.status === 'rejected' && !formData.rejection_reason?.trim()) {
      newErrors.rejection_reason = 'Rejection reason is required when status is Rejected'
    }

    if (formData.status === 'on_hold' && !formData.hold_reason?.trim()) {
      newErrors.hold_reason = 'Hold reason is required when status is On Hold'
    }

    if (formData.status === 'interview_scheduled' && !formData.interview_date) {
      newErrors.interview_date = 'Interview date is required when status is Interview Scheduled'
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
        const response = await applicantService.update(parseInt(id), convertToFormData(formData))
        if (response.success) {
          toast.success('Applicant updated successfully')
          navigate('/applicants')
        } else {
          toast.error('Failed to update applicant')
        }
      } else {
        const response = await applicantService.create(convertToFormData(formData))
        if (response.success) {
          toast.success('Applicant created successfully')
          navigate('/applicants')
        } else {
          toast.error('Failed to create applicant')
        }
      }
    } catch (error) {
      console.error('Failed to save applicant:', error)
      toast.error('Failed to save applicant')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof ApplicantFormData, value: string | number | boolean | File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume_path: 'File size must be less than 5MB' }))
        return
      }
      if (
!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
) {
        setErrors(prev => ({ ...prev, resume_path: 'Only PDF and DOC files are allowed' }))
        return
      }
      handleChange('resume_path', file)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
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
        <button onClick={() => navigate('/applicants')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isView ? 'View Applicant' : isEdit ? 'Edit Applicant' : 'Add New Applicant'}</h1>
          <p className="text-gray-600 mt-1">{isView ? 'View applicant details' : isEdit ? 'Update applicant details' : 'Add a new applicant'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => handleChange('applicant_name', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.applicant_name ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter full name"
                  maxLength={255}
                />
                {errors.applicant_name && <p className="mt-1 text-sm text-red-500">{errors.applicant_name}</p>}
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
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                <input
                  type="text"
                  value={formData.current_location}
                  onChange={(e) => handleChange('current_location', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., San Francisco, CA"
                  maxLength={255}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.career_id}
                  onChange={(e) => handleChange('career_id', parseInt(e.target.value))}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  <option value={1}>Senior Structural Engineer</option>
                  <option value={2}>Project Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., 5 years"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
                <input
                  type="text"
                  value={formData.current_company}
                  onChange={(e) => handleChange('current_company', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Current company name"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
                <input
                  type="text"
                  value={formData.notice_period}
                  onChange={(e) => handleChange('notice_period', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., 30 days"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current CTC</label>
                <input
                  type="number"
                  value={formData.current_ctc || ''}
                  onChange={(e) => handleChange('current_ctc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Annual CTC"
                  min={0}
                  max={10000000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected CTC</label>
                <input
                  type="number"
                  value={formData.expected_ctc || ''}
                  onChange={(e) => handleChange('expected_ctc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Expected annual CTC"
                  min={0}
                  max={10000000}
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume <span className="text-red-500">*</span>
            </label>
            {!isView && (
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.resume_path ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-#2563EB'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">PDF or DOC up to 5MB</p>
                  </div>
                </label>
                {typeof formData.resume_path === 'string' && (
                  <p className="mt-2 text-sm text-green-600">Current: {formData.resume_path}</p>
                )}
                {typeof formData.resume_path === 'object' && (
                  <p className="mt-2 text-sm text-green-600">Selected: {formData.resume_path.name}</p>
                )}
              </div>
            )}
            {isView && typeof formData.resume_path === 'string' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">Resume: {formData.resume_path}</p>
              </div>
            )}
            {errors.resume_path && <p className="mt-1 text-sm text-red-500">{errors.resume_path}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as ApplicantStatus)}
              disabled={isView}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Conditional Fields */}
          {formData.status === 'interview_scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.interview_date}
                onChange={(e) => handleChange('interview_date', e.target.value)}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                  errors.interview_date ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
              />
              {errors.interview_date && <p className="mt-1 text-sm text-red-500">{errors.interview_date}</p>}
            </div>
          )}

          {formData.status === 'interview_scheduled' || formData.status === 'interview_completed' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Feedback</label>
              <textarea
                value={formData.interview_feedback}
                onChange={(e) => handleChange('interview_feedback', e.target.value)}
                rows={3}
                disabled={isView}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter interview feedback"
              />
            </div>
          ) : null}

          {formData.status === 'rejected' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.rejection_reason}
                onChange={(e) => handleChange('rejection_reason', e.target.value)}
                rows={3}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${
                  errors.rejection_reason ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter rejection reason"
                maxLength={1000}
              />
              {errors.rejection_reason && <p className="mt-1 text-sm text-red-500">{errors.rejection_reason}</p>}
            </div>
          )}

          {formData.status === 'on_hold' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hold Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.hold_reason}
                onChange={(e) => handleChange('hold_reason', e.target.value)}
                rows={3}
                disabled={isView}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${
                  errors.hold_reason ? 'border-red-500' : 'border-gray-300'
                } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Enter hold reason"
                maxLength={1000}
              />
              {errors.hold_reason && <p className="mt-1 text-sm text-red-500">{errors.hold_reason}</p>}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            {!isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/applicants')}
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Applicant' : 'Create Applicant'}
                </button>
              </>
            )}
            {isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/applicants/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Applicant
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/applicants')}
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
