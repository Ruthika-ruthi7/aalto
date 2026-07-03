import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload, X as XIcon } from 'lucide-react'
import { caseStudyService } from '../../services/case-study.service'
import { useToast } from '../../components/common/Toast'
import type { CaseStudyFormData, CaseStudyStatus, ServiceType, Industry } from '../../types/case-study.types'

const serviceTypeOptions: { value: ServiceType; label: string }[] = [
  { value: 'consulting', label: 'Consulting' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'construction', label: 'Construction' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'automation', label: 'Automation' },
  { value: 'lifts_elevators', label: 'Lifts & Elevators' },
  { value: 'material_handling', label: 'Material Handling' },
  { value: 'warehouse_solutions', label: 'Warehouse Solutions' },
  { value: 'other', label: 'Other' },
]

const industryOptions: { value: Industry; label: string }[] = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'construction', label: 'Construction' },
  { value: 'pharmaceutical', label: 'Pharmaceutical' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'textile', label: 'Textile' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'energy', label: 'Energy' },
  { value: 'other', label: 'Other' },
]

const statusOptions: { value: CaseStudyStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
]

const convertToFormData = (data: CaseStudyFormData): FormData => {
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

export default function CaseStudyFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: '',
    client_name: '',
    service_type: 'engineering',
    industry: 'manufacturing',
    featured_image: undefined,
    short_description: '',
    challenge: '',
    solution: '',
    results: '',
    technologies_used: '',
    project_duration: '',
    status: 'draft',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCaseStudy(parseInt(id))
    }
  }, [id])

  const loadCaseStudy = async (caseStudyId: number) => {
    setLoading(true)
    try {
      const response = await caseStudyService.getById(caseStudyId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          title: data.title,
          client_name: data.client_name,
          service_type: data.service_type,
          industry: data.industry,
          featured_image: undefined,
          short_description: data.short_description || '',
          challenge: data.challenge || '',
          solution: data.solution || '',
          results: data.results || '',
          technologies_used: data.technologies_used || '',
          project_duration: data.project_duration || '',
          status: data.status,
        })
        if (data.featured_image) {
          setImagePreview(data.featured_image)
        }
      } else {
        toast.error('Failed to load case study')
      }
    } catch (error) {
      console.error('Failed to load case study:', error)
      toast.error('Failed to load case study')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.')
        return
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit.')
        return
      }

      setFormData(prev => ({ ...prev, featured_image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, featured_image: undefined }))
    setImagePreview(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Case study title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title must be less than 500 characters'
    }

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required'
    } else if (formData.client_name.length < 2) {
      newErrors.client_name = 'Client name must be at least 2 characters'
    } else if (formData.client_name.length > 255) {
      newErrors.client_name = 'Client name must be less than 255 characters'
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = 'Short description is required'
    } else if (formData.short_description.length < 10) {
      newErrors.short_description = 'Description must be at least 10 characters'
    } else if (formData.short_description.length > 500) {
      newErrors.short_description = 'Description must be less than 500 characters'
    }

    if (!formData.challenge.trim()) {
      newErrors.challenge = 'Challenge is required'
    } else if (formData.challenge.length < 10) {
      newErrors.challenge = 'Challenge must be at least 10 characters'
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution is required'
    } else if (formData.solution.length < 10) {
      newErrors.solution = 'Solution must be at least 10 characters'
    }

    if (!formData.results.trim()) {
      newErrors.results = 'Impact/Results is required'
    } else if (formData.results.length < 10) {
      newErrors.results = 'Impact/Results must be at least 10 characters'
    }

    if (!isEdit && !formData.featured_image) {
      newErrors.featured_image = 'Featured image is required'
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
        const response = await caseStudyService.update(parseInt(id), convertToFormData(formData))
        if (response.success) {
          toast.success('Case study updated successfully')
          navigate('/case-studies')
        } else {
          toast.error('Failed to update case study')
        }
      } else {
        const response = await caseStudyService.create(convertToFormData(formData))
        if (response.success) {
          toast.success('Case study created successfully')
          navigate('/case-studies')
        } else {
          toast.error('Failed to create case study')
        }
      }
    } catch (error) {
      console.error('Failed to save case study:', error)
      toast.error('Failed to save case study')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof CaseStudyFormData, value: string | number | boolean | File | undefined) => {
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
            {[...Array(8)].map((_, i) => (
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
          <button onClick={() => navigate('/case-studies')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">{isView ? 'View Case Study' : isEdit ? 'Edit Case Study' : 'Add New Case Study'}</h1>
            <p className="text-gray-600 mt-1">{isView ? 'View case study details' : isEdit ? 'Update case study' : 'Create a new case study'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Study Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter case study title"
                  maxLength={500}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${
                    errors.client_name ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Client company name"
                  maxLength={255}
                />
                {errors.client_name && <p className="mt-1 text-sm text-red-500">{errors.client_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => handleChange('service_type', e.target.value as ServiceType)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {serviceTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value as Industry)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {industryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Duration</label>
                <input
                  type="text"
                  value={formData.project_duration}
                  onChange={(e) => handleChange('project_duration', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., 18 months"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image {!(isEdit || isView) && <span className="text-red-500">*</span>}
            </label>
            {!isView && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="max-h-64 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="featured-image-upload"
                    />
                    <label htmlFor="featured-image-upload" className="cursor-pointer">
                      <div className="text-gray-500">
                        <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm mt-1">JPG, JPEG, PNG, WEBP up to 2MB</p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            )}
            {isView && imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Featured" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
            {errors.featured_image && <p className="mt-1 text-sm text-red-500">{errors.featured_image}</p>}
          </div>

          {/* Case Study Details */}
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Case Study Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${
                    errors.short_description ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Brief summary of the case study"
                  maxLength={500}
                />
                {errors.short_description && <p className="mt-1 text-sm text-red-500">{errors.short_description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The Challenge <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => handleChange('challenge', e.target.value)}
                  rows={4}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${
                    errors.challenge ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Describe the challenge faced"
                />
                {errors.challenge && <p className="mt-1 text-sm text-red-500">{errors.challenge}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The Solution <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => handleChange('solution', e.target.value)}
                  rows={4}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${
                    errors.solution ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Describe the solution implemented"
                />
                {errors.solution && <p className="mt-1 text-sm text-red-500">{errors.solution}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The Impact / Results <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.results}
                  onChange={(e) => handleChange('results', e.target.value)}
                  rows={3}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${
                    errors.results ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Describe the impact and results"
                />
                {errors.results && <p className="mt-1 text-sm text-red-500">{errors.results}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                <textarea
                  value={formData.technologies_used}
                  onChange={(e) => handleChange('technologies_used', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., BIM, Prefabrication, IoT sensors"
                  maxLength={500}
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
              onChange={(e) => handleChange('status', e.target.value as CaseStudyStatus)}
              disabled={isView}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
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
                  onClick={() => navigate('/case-studies')}
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Case Study' : 'Create Case Study'}
                </button>
              </>
            )}
            {isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/case-studies/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Case Study
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/case-studies')}
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
