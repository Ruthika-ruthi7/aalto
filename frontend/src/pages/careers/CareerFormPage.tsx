import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { careerService } from '../../services/career.service'
import { useToast } from '../../components/common/Toast'
import type { CareerFormData, CareerStatus, EmploymentType, WorkMode } from '../../types/career.types'

const employmentTypeOptions: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

const workModeOptions: { value: WorkMode; label: string }[] = [
  { value: 'on_site', label: 'On Site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

const statusOptions: { value: CareerStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
]

export default function CareerFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<CareerFormData>({
    job_code: '',
    job_title: '',
    department: '',
    role_category: '',
    industry_type: '',
    employment_type: 'full_time',
    work_mode: 'on_site',
    location: '',
    number_of_openings: 1,
    experience_required: '',
    education_qualification: '',
    key_skills: '',
    description: '',
    roles_and_responsibilities: '',
    benefits: '',
    application_deadline: '',
    status: 'ACTIVE',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadCareer(parseInt(id))
    } else {
      // Auto-generate job code for new careers
      const newJobCode = `ENG-${String(Date.now()).slice(-3)}`
      setFormData(prev => ({ ...prev, job_code: newJobCode }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadCareer = async (careerId: number) => {
    setLoading(true)
    try {
      const response = await careerService.getById(careerId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          job_code: data.job_code || '',
          job_title: data.job_title || data.job_titles || '',
          department: data.department || data.Department || '',
          role_category: data.role_category || data.RoleCategory || '',
          industry_type: data.industry_type || data.IndustryType || '',
          employment_type: data.employment_type || data.EmploymentType || 'full_time',
          work_mode: data.work_mode || 'on_site',
          location: data.location || data.Locations || '',
          number_of_openings: data.number_of_openings || 1,
          experience_required: data.experience_required || data.Experience || '',
          education_qualification: data.education_qualification || data.Education || '',
          key_skills: data.key_skills || data.KeySkills || '',
          description: data.description || data.jobDescription || '',
          roles_and_responsibilities: data.roles_and_responsibilities || data.Responsibilities || '',
          benefits: data.benefits || '',
          application_deadline: data.application_deadline || '',
          status: (data.status || data.job_status || 'ACTIVE') as any,
        })
      } else {
        toast.error('Failed to load career')
      }
    } catch (error) {
      console.error('Failed to load career:', error)
      toast.error('Failed to load career')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.job_code?.trim()) {
      newErrors.job_code = 'Job code is required'
    }

    if (!formData.job_title?.trim()) {
      newErrors.job_title = 'Job title is required'
    } else if (formData.job_title.length < 5) {
      newErrors.job_title = 'Job title must be at least 5 characters'
    } else if (formData.job_title.length > 255) {
      newErrors.job_title = 'Job title must be less than 255 characters'
    }

    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required'
    } else if (formData.department.length < 2) {
      newErrors.department = 'Department must be at least 2 characters'
    } else if (formData.department.length > 100) {
      newErrors.department = 'Department must be less than 100 characters'
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    } else if (formData.location.length > 255) {
      newErrors.location = 'Location must be less than 255 characters'
    }

    if ((formData.number_of_openings || 0) < 1) {
      newErrors.number_of_openings = 'Number of openings must be at least 1'
    } else if ((formData.number_of_openings || 0) > 100) {
      newErrors.number_of_openings = 'Number of openings must be less than 100'
    }

    if (formData.status === 'ACTIVE' && formData.application_deadline) {
      const deadline = new Date(formData.application_deadline)
      if (deadline <= new Date()) {
        newErrors.application_deadline = 'Application deadline must be a future date for open positions'
      }
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
        const response = await careerService.update(parseInt(id), formData)
        if (response.success) {
          toast.success('Career updated successfully')
          navigate('/careers')
        } else {
          toast.error('Failed to update career')
        }
      } else {
        const response = await careerService.create(formData)
        if (response.success) {
          toast.success('Career created successfully')
          navigate('/careers')
        } else {
          toast.error('Failed to create career')
        }
      }
    } catch (error) {
      console.error('Failed to save career:', error)
      toast.error('Failed to save career')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof CareerFormData, value: string | number | boolean | File | undefined) => {
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
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/careers')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isView ? 'View Career' : isEdit ? 'Edit Career' : 'Add New Career'}</h1>
            <p className="text-gray-600 mt-1">{isView ? 'View job posting' : isEdit ? 'Update job posting' : 'Create a new job posting'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.job_code}
                  onChange={(e) => handleChange('job_code', e.target.value)}
                  disabled={isEdit || isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.job_code ? 'border-red-500' : 'border-gray-300'
                  } ${(isEdit || isView) ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., ENG-001"
                />
                {errors.job_code && <p className="mt-1 text-sm text-red-500">{errors.job_code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.job_title ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Senior Structural Engineer"
                  maxLength={255}
                />
                {errors.job_title && <p className="mt-1 text-sm text-red-500">{errors.job_title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Engineering"
                  maxLength={100}
                />
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Category</label>
                <input
                  type="text"
                  value={formData.role_category}
                  onChange={(e) => handleChange('role_category', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Technical"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry Type</label>
                <input
                  type="text"
                  value={formData.industry_type}
                  onChange={(e) => handleChange('industry_type', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Construction"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., New York, NY"
                  maxLength={255}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => handleChange('employment_type', e.target.value as EmploymentType)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {employmentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.work_mode}
                  onChange={(e) => handleChange('work_mode', e.target.value as WorkMode)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {workModeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.number_of_openings}
                  onChange={(e) => handleChange('number_of_openings', parseInt(e.target.value) || 1)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.number_of_openings ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  min={1}
                  max={100}
                />
                {errors.number_of_openings && <p className="mt-1 text-sm text-red-500">{errors.number_of_openings}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
                <input
                  type="text"
                  value={formData.experience_required}
                  onChange={(e) => handleChange('experience_required', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., 5-8 years"
                  maxLength={100}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <input
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleChange('application_deadline', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.application_deadline ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                />
                {errors.application_deadline && <p className="mt-1 text-sm text-red-500">{errors.application_deadline}</p>}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Qualification</label>
                <textarea
                  value={formData.education_qualification}
                  onChange={(e) => handleChange('education_qualification', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Bachelor's in Civil Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                <textarea
                  value={formData.key_skills}
                  onChange={(e) => handleChange('key_skills', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., AutoCAD, Structural Analysis, Project Management"
                  maxLength={1000}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Describe the role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles and Responsibilities</label>
                <textarea
                  value={formData.roles_and_responsibilities}
                  onChange={(e) => handleChange('roles_and_responsibilities', e.target.value)}
                  rows={4}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="List key responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Health insurance, 401k, paid time off"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as CareerStatus)}
              disabled={isView}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            {!isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/careers')}
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Career' : 'Create Career'}
                </button>
              </>
            )}
            {isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/careers/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Career
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/careers')}
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
    </div>
  )
}
