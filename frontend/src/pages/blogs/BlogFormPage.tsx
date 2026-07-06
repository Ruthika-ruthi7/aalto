import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, X, Star } from 'lucide-react'
import { blogService } from '../../services/blog.service'
import { useToast } from '../../components/common/Toast'
import Breadcrumb from '../../components/common/Breadcrumb'
import type { BlogFormData, BlogStatus } from '../../types/blog.types'
import { BLOG_STATUS_FORM_OPTIONS } from '../../types/blog.types'

const statusOptions = BLOG_STATUS_FORM_OPTIONS

const convertToFormData = (data: BlogFormData): FormData => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    }
  })
  return formData
}

export default function BlogFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith('/edit')
  const isView = !!id && !location.pathname.endsWith('/edit')
  const toast = useToast()

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    blog_title: '',
    slug: '',
    category: '',
    featured_image: undefined,
    short_description: '',
    description: '',
    blog_content: '',
    author: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    status: 'draft',
    is_featured: false,
    publish_date: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

   
  useEffect(() => {
    if (id) {
      loadBlog(parseInt(id))
    }
  }, [id])

  const loadBlog = async (blogId: number) => {
    setLoading(true)
    try {
      const response = await blogService.getById(blogId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          title: data.title || data.blog_title || '',
          blog_title: data.blog_title || data.title || '',
          slug: data.slug || '',
          category: data.category || '',
          featured_image: data.featured_image,
          short_description: data.short_description || data.description || '',
          description: data.description || '',
          blog_content: data.blog_content || data.inside_description || '',
          author: data.author || '',
          tags: data.tags || '',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          status: data.status || data.job_status || 'draft',
          is_featured: data.is_featured || false,
          publish_date: data.publish_date || '',
        })
      } else {
        toast.error('Failed to load blog')
      }
    } catch (error) {
      console.error('Failed to load blog:', error)
      toast.error('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, blog_title: value, slug: generateSlug(value) }))
    if (errors.blog_title) setErrors(prev => ({ ...prev, blog_title: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim() && !formData.blog_title?.trim()) {
      newErrors.title = 'Blog title is required'
    } else if ((formData.title || formData.blog_title || '').length < 5) {
      newErrors.title = 'Blog title must be at least 5 characters'
    } else if ((formData.title || formData.blog_title || '').length > 500) {
      newErrors.title = 'Blog title must be less than 500 characters'
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (formData.slug.length < 5) {
      newErrors.slug = 'Slug must be at least 5 characters'
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required'
    } else if (formData.category.length < 2) {
      newErrors.category = 'Category must be at least 2 characters'
    } else if (formData.category.length > 100) {
      newErrors.category = 'Category must be less than 100 characters'
    }

    if (!formData.description?.trim() && !formData.blog_content?.trim()) {
      newErrors.description = 'Blog content is required'
    } else if ((formData.description || formData.blog_content || '').length < 50) {
      newErrors.description = 'Blog content must be at least 50 characters'
    }

    if (!formData.author?.trim()) {
      newErrors.author = 'Author is required'
    } else if (formData.author.length < 2) {
      newErrors.author = 'Author must be at least 2 characters'
    }

    if ((formData.status === 'published' || formData.status === 'scheduled') && !formData.publish_date) {
      newErrors.publish_date = 'Publish date is required for published or scheduled blogs'
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
        const response = await blogService.update(parseInt(id), convertToFormData(formData))
        if (response.success) {
          toast.success('Blog updated successfully')
          navigate('/blogs')
        } else {
          toast.error('Failed to update blog')
        }
      } else {
        const response = await blogService.create(convertToFormData(formData))
        if (response.success) {
          toast.success('Blog created successfully')
          navigate('/blogs')
        } else {
          toast.error('Failed to create blog')
        }
      }
    } catch (error) {
      console.error('Failed to save blog:', error)
      toast.error('Failed to save blog')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof BlogFormData, value: string | number | boolean | File | undefined) => {
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
          <button onClick={() => navigate('/blogs')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isView ? 'View Blog' : isEdit ? 'Edit Blog' : 'Add New Blog'}</h1>
            <Breadcrumb />
            <p className="text-gray-600 mt-1">{isView ? 'View blog post' : isEdit ? 'Update blog post' : 'Create a new blog post'}</p>
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
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.blog_title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.blog_title ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Enter blog title"
                  maxLength={500}
                />
                {errors.blog_title && <p className="mt-1 text-sm text-red-500">{errors.blog_title}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="blog-post-url-slug"
                  maxLength={500}
                />
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Engineering, Construction"
                  maxLength={100}
                />
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.author ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Author name"
                  maxLength={255}
                />
                {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            {!isView && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-#2563EB transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange('featured_image', e.target.files?.[0])}
                  className="hidden"
                  id="featured-image-upload"
                />
                <label htmlFor="featured-image-upload" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>
              </div>
            )}
            {isView && formData.featured_image && (
              <div className="mt-2">
                <img src={typeof formData.featured_image === 'string' ? formData.featured_image : URL.createObjectURL(formData.featured_image)} alt="Featured" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Brief description for blog preview"
                  maxLength={500}
                />
                <p className="mt-1 text-sm text-gray-500">{formData.short_description?.length || 0} / 500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.blog_content}
                  onChange={(e) => handleChange('blog_content', e.target.value)}
                  rows={12}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${
                    errors.blog_content ? 'border-red-500' : 'border-gray-300'
                  } ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="Write your blog content here (HTML supported)"
                />
                {errors.blog_content && <p className="mt-1 text-sm text-red-500">{errors.blog_content}</p>}
              </div>
            </div>
          </div>

          {/* SEO & Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO & Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="tag1, tag2, tag3"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="SEO title"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={2}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                  placeholder="SEO description"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as BlogStatus)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.publish_date}
                  onChange={(e) => handleChange('publish_date', e.target.value)}
                  disabled={isView}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
                    errors.publish_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.publish_date && <p className="mt-1 text-sm text-red-500">{errors.publish_date}</p>}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-#2563EB focus:ring-#2563EB"
                />
                <label htmlFor="is_featured" className="flex items-center gap-2 cursor-pointer">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">Featured Post</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {!isView && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
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
                {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Blog'}
              </button>
            </div>
          )}
          {isView && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/blogs/${id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Edit Blog
              </button>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
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
    </div>
  )
}
