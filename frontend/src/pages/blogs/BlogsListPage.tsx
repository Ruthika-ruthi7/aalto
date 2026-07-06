import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, Download, Star, Eye, Send } from 'lucide-react'
import { blogService } from '../../services/blog.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import PageHeading from '../../components/common/PageHeading'
import StatusBadge from '../../components/common/StatusBadge'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS, TABLE_CELL_CLASS, TABLE_CELL_CENTER_CLASS, ACTION_COL_WIDTH, TABLE_ROW_CLASS, TABLE_SKELETON_CLASS } from '../../components/common/tableStyles'
import type { Blog, BlogFilters, BlogStatus } from '../../types/blog.types'
import { BLOG_STATUS_COLORS, BLOG_STATUS_LABELS, BLOG_STATUS_FILTER_OPTIONS } from '../../types/blog.types'

export default function BlogsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusOptions = BLOG_STATUS_FILTER_OPTIONS

  const categoryOptions: string[] = [
    'All Categories',
    'Industrial Automation',
    'Elevators',
    'Escalators',
    'Modernization',
    'Maintenance',
    'Safety',
    'Technology',
    'Engineering',
    'Construction',
    'Innovation',
    'Project Updates'
  ]

  const featuredOptions: { value: string; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ]

   
  useEffect(() => {
    loadBlogs()
  }, [page, filters])

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const response = await blogService.getAll(filters, page, 20)
      if (response.success && response.data) {
        setBlogs(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      } else {
        console.error('API response unsuccessful:', response.error)
      }
    } catch (error) {
      console.error('Failed to load blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value || undefined })
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters({ ...filters, status: (value || undefined) as any })
    setPage(1)
  }

  const handleCategoryFilter = (value: string) => {
    setFilters({ ...filters, category: value || undefined })
    setPage(1)
  }

  const handleFeaturedFilter = (value: string) => {
    setFilters({ ...filters, is_featured: value === 'true' ? true : value === 'false' ? false : undefined })
    setPage(1)
  }

  const handleExportCSV = () => {
    const headers = ['Title', 'Category', 'Author', 'Publish Date', 'Status', 'Last Updated']
    const rows = blogs.map(b => [
      b.title,
      b.category || '',
      b.author,
      b.publish_date || '',
      b.job_status || '',
      b.updated_at || ''
    ])
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blogs.csv'
    a.click()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await blogService.delete(id)
        if (response.success) {
          toast.success('Blog deleted successfully')
          loadBlogs()
        } else {
          toast.error('Failed to delete blog')
        }
      } catch (error) {
        console.error('Failed to delete blog:', error)
        toast.error('Failed to delete blog')
      }
    }
  }

  const handleTogglePublish = async (blog: Blog) => {
    const newStatus: BlogStatus = blog.job_status === 'published' ? 'draft' : 'published'
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      const response = await blogService.update(blog.id, formData)
      if (response.success) {
        toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
        loadBlogs()
      } else {
        toast.error('Failed to update blog status')
      }
    } catch (error) {
      console.error('Failed to toggle blog status:', error)
      toast.error('Failed to update blog status')
    }
  }

  const getActionMenuItems = (blog: Blog) => [
    {
      label: 'View',
      onClick: () => navigate(`/blogs/${blog.id}`),
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Edit',
      onClick: () => navigate(`/blogs/${blog.id}/edit`),
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: blog.job_status === 'published' ? 'Unpublish' : 'Publish',
      onClick: () => handleTogglePublish(blog),
      icon: <Send className="w-4 h-4" />,
      color: blog.job_status === 'published' ? 'warning' as const : 'success' as const
    },
    {
      label: 'Delete',
      onClick: () => handleDelete(blog.id),
      icon: <Trash2 className="w-4 h-4" />,
      color: 'danger' as const
    }
  ]

  const getStatusBadge = (status: string) => (
    <StatusBadge
      status={status}
      colorMap={BLOG_STATUS_COLORS}
      labelMap={BLOG_STATUS_LABELS}
    />
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeading 
        title="Blogs" 
        description="Manage all blog posts"
        action={
          <button 
            onClick={() => navigate('/blogs/create')}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Blog
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Status</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleStatusFilter(e.target.value)}
              value={filters.status || ''}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleCategoryFilter(e.target.value === 'All Categories' ? '' : e.target.value)}
              value={filters.category || 'All Categories'}
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleFeaturedFilter(e.target.value)}
              value={filters.is_featured === true ? 'true' : filters.is_featured === false ? 'false' : ''}
            >
              {featuredOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={TABLE_HEAD_CLASS}>
              <tr>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>S.No</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Featured Image</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Blog Title</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Category</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Author</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Publish Date</th>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Status</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Last Updated</th>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} ${ACTION_COL_WIDTH}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className={TABLE_SKELETON_CLASS}>
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`${TABLE_CELL_CLASS} text-center text-gray-500`}>
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr key={blog.id} className={TABLE_ROW_CLASS}>
                    <td className={TABLE_CELL_CENTER_CLASS}>{(page - 1) * 20 + index + 1}</td>
                    <td className={TABLE_CELL_CLASS}>
                      <div className="flex items-center gap-2">
                        {blog.featured_image ? (
                          <img 
                            src={blog.featured_image} 
                            alt="Featured" 
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                        {blog.is_featured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <div className="font-medium text-[#0F172A] text-sm max-w-xs truncate">{blog.title}</div>
                    </td>
                    <td className={TABLE_CELL_CLASS}>{blog.category || '-'}</td>
                    <td className={TABLE_CELL_CLASS}>{blog.author}</td>
                    <td className={TABLE_CELL_CLASS}>{formatDate(blog.publish_date)}</td>
                    <td className={TABLE_CELL_CENTER_CLASS}>{getStatusBadge(blog.job_status)}</td>
                    <td className={TABLE_CELL_CLASS}>{formatDate(blog.updated_at)}</td>
                    <td className={TABLE_CELL_CENTER_CLASS}>
                      <ActionMenu items={getActionMenuItems(blog)} ariaLabel={`Actions for ${blog.title}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    page === i + 1 ? 'bg-#2563EB text-white' : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
