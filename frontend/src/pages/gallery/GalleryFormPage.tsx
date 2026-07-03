import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload, X as XIcon } from 'lucide-react'
import { galleryService } from '../../services/gallery.service'
import { useToast } from '../../components/common/Toast'
import type { GalleryFormData, GalleryStatus } from '../../types/gallery.types'

const statusOptions: { value: GalleryStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const categoryOptions = ['Events', 'Projects', 'Team', 'Products', 'Office', 'Other']

const convertToFormData = (data: GalleryFormData): FormData => {
  const formData = new FormData()
  formData.append('gallery_title', data.gallery_title)
  formData.append('category', data.category)
  formData.append('description', data.description || '')
  formData.append('status', data.status)
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image)
    })
  }
  return formData
}

export default function GalleryFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<GalleryFormData>({
    gallery_title: '',
    category: '',
    description: '',
    status: 'active',
    images: [],
    uploaded_date: undefined,
    last_updated: undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

   
  useEffect(() => {
    if (id) {
      loadGallery(parseInt(id))
    }
  }, [id])

  const loadGallery = async (galleryId: number) => {
    setLoading(true)
    try {
      const response = await galleryService.getById(galleryId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          gallery_title: data.gallery_title,
          category: data.category,
          description: data.description || '',
          status: data.status,
          images: [],
          uploaded_date: data.uploaded_date,
          last_updated: data.last_updated,
        })
      } else {
        toast.error('Failed to load gallery')
      }
    } catch (error) {
      console.error('Failed to load gallery:', error)
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.gallery_title.trim()) {
      newErrors.gallery_title = 'Gallery title is required'
    } else if (formData.gallery_title.length < 5) {
      newErrors.gallery_title = 'Gallery title must be at least 5 characters'
    } else if (formData.gallery_title.length > 255) {
      newErrors.gallery_title = 'Gallery title must be less than 255 characters'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    } else if (formData.category.length < 2) {
      newErrors.category = 'Category must be at least 2 characters'
    } else if (formData.category.length > 100) {
      newErrors.category = 'Category must be less than 100 characters'
    }

    if (!isEdit && (!formData.images || formData.images.length === 0)) {
      newErrors.images = 'At least one image is required'
    }

    if (formData.images && formData.images.length > 50) {
      newErrors.images = 'Maximum 50 images allowed'
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
        const response = await galleryService.update(parseInt(id), convertToFormData(formData))
        if (response.success) {
          toast.success('Gallery updated successfully')
          navigate('/gallery')
        } else {
          toast.error('Failed to update gallery')
        }
      } else {
        const response = await galleryService.create(convertToFormData(formData))
        if (response.success) {
          toast.success('Gallery created successfully')
          navigate('/gallery')
        } else {
          toast.error('Failed to create gallery')
        }
      }
    } catch (error) {
      console.error('Failed to save gallery:', error)
      toast.error('Failed to save gallery')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof GalleryFormData, value: string | number | boolean | File[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 2MB.`)
        return false
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`File ${file.name} is not a valid image. Only JPG, JPEG, PNG, and WEBP are allowed.`)
        return false
      }
      return true
    })

    if (formData.images && formData.images.length + validFiles.length > 50) {
      setErrors(prev => ({ ...prev, images: 'Maximum 50 images allowed' }))
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...validFiles],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }))
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
    <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/gallery')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isView ? 'View Gallery' : isEdit ? 'Edit Gallery' : 'Add New Gallery'}</h1>
            <p className="text-gray-600 mt-1">{isView ? 'View gallery details' : isEdit ? 'Update gallery details' : 'Create a new image gallery'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.gallery_title}
                  onChange={(e) => handleChange('gallery_title', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.gallery_title ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter gallery title"
                  maxLength={255}
                />
                {errors.gallery_title && <p className="mt-1 text-sm text-red-500">{errors.gallery_title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as GalleryStatus)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter gallery description"
                  maxLength={2000}
                />
                <p className="mt-1 text-sm text-gray-500">{formData.description?.length || 0} / 2000</p>
              </div>

              {(isEdit || isView) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Date</label>
                    <input
                      type="text"
                      value={formData.uploaded_date ? new Date(formData.uploaded_date).toLocaleDateString('en-GB') : ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <input
                      type="text"
                      value={formData.last_updated ? new Date(formData.last_updated).toLocaleDateString('en-GB') : ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            {!isView && (
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-#2563EB'
              }`}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">JPG, JPEG, PNG, WEBP up to 2MB each (max 50 images)</p>
                  </div>
                </label>
              </div>
            )}
            {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
          </div>

          {/* Image List */}
          {formData.images && formData.images.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Uploaded Images ({formData.images.length}/50)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                    <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                    <p className="text-xs text-gray-400">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            {!isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Gallery' : 'Create Gallery'}
                </button>
              </>
            )}
            {isView && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/gallery/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Gallery
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
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
