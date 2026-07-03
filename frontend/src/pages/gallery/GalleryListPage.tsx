import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, Edit, Trash2, Power, PowerOff } from 'lucide-react'
import { galleryService } from '../../services/gallery.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import type { Gallery, GalleryFilters, GalleryStatus } from '../../types/gallery.types'

export default function GalleryListPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<GalleryFilters>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const statusOptions: { value: GalleryStatus; label: string; color: string }[] = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-red-100 text-red-800' },
  ]

   
  useEffect(() => {
    loadGalleries()
  }, [page, filters])

  const loadGalleries = async () => {
    setLoading(true)
    try {
      const response = await galleryService.getAll(filters, page, 20)
      console.log('Gallery response:', response)
      if (response.success && response.data) {
        setGalleries(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      } else {
        console.error('Gallery API error:', response.error)
      }
    } catch (error) {
      console.error('Failed to load galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters({ ...filters, status: value as GalleryStatus || undefined })
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
      try {
        const response = await galleryService.delete(id)
        if (response.success) {
          toast.success('Gallery deleted successfully')
          loadGalleries()
        } else {
          toast.error('Failed to delete gallery')
        }
      } catch (error) {
        console.error('Failed to delete gallery:', error)
        toast.error('Failed to delete gallery')
      }
    }
  }

  const handleToggleStatus = async (gallery: Gallery) => {
    try {
      const formData = new FormData()
      formData.append('status', gallery.status === 'active' ? 'inactive' : 'active')
      const response = await galleryService.update(gallery.id, formData)
      if (response.success) {
        toast.success(`Gallery ${gallery.status === 'active' ? 'deactivated' : 'activated'} successfully`)
        loadGalleries()
      } else {
        toast.error('Failed to update gallery status')
      }
    } catch (error) {
      console.error('Failed to toggle gallery status:', error)
      toast.error('Failed to update gallery status')
    }
  }

  const getActionMenuItems = (gallery: Gallery) => {
    const items = [
      {
        label: 'View',
        onClick: () => navigate(`/gallery/${gallery.id}`),
        icon: <Eye className="w-4 h-4" />
      },
      {
        label: 'Edit',
        onClick: () => navigate(`/gallery/${gallery.id}/edit`),
        icon: <Edit className="w-4 h-4" />
      },
      {
        label: gallery.status === 'active' ? 'Deactivate' : 'Activate',
        onClick: () => handleToggleStatus(gallery),
        icon: gallery.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />,
        color: (gallery.status === 'active' ? 'warning' : 'success') as 'danger' | 'default' | 'success' | 'warning'
      },
      {
        label: 'Delete',
        onClick: () => handleDelete(gallery.id),
        icon: <Trash2 className="w-4 h-4" />,
        color: 'danger' as const
      }
    ]
    return items
  }


  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Gallery</h1>
          <p className="text-gray-600 mt-1">Manage image galleries</p>
        </div>
        <button 
          onClick={() => navigate('/gallery/create')}
          className="inline-flex items-center gap-2 bg-#2563EB hover:bg-#2563EBDark text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Gallery
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search galleries..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="lg:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Gallery Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Uploaded Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : galleries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No galleries found
                  </td>
                </tr>
              ) : (
                galleries.map((gallery, index) => (
                  <tr key={gallery.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{(page - 1) * 20 + index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-#2563EB transition-all"
                           onClick={() => gallery.image_paths && gallery.image_paths.length > 0 && setSelectedImage(gallery.image_paths[0].startsWith('http') ? gallery.image_paths[0] : `http://localhost:5000${gallery.image_paths[0]}`)}>
                        {gallery.image_paths && gallery.image_paths.length > 0 ? (
                          <img 
                            src={gallery.image_paths[0].startsWith('http') ? gallery.image_paths[0] : `http://localhost:5000${gallery.image_paths[0]}`} 
                            alt={gallery.gallery_title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0F172A]">{gallery.gallery_title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{gallery.category}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {gallery.uploaded_date ? new Date(gallery.uploaded_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {gallery.last_updated ? new Date(gallery.last_updated).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gallery.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {gallery.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ActionMenu items={getActionMenuItems(gallery)} ariaLabel={`Actions for ${gallery.gallery_title}`} />
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
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
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
                    page === i + 1
                      ? 'bg-#2563EB text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
