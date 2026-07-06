import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react'
import { enquiryService } from '../../services/enquiry.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import PageHeading from '../../components/common/PageHeading'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS, TABLE_CELL_CLASS, TABLE_CELL_CENTER_CLASS, ACTION_COL_WIDTH, TABLE_ROW_CLASS, TABLE_SKELETON_CLASS } from '../../components/common/tableStyles'
import type { Enquiry, EnquiryFilters } from '../../types/enquiry.types'

export default function EnquiriesListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<EnquiryFilters>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusOptions: { value: string; label: string; color: string }[] = [
    { value: '', label: 'All Status', color: '' },
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: 'Closed', color: 'bg-red-100 text-red-800' },
  ]



  const handleExportCSV = () => {
    const headers = ['Name', 'Subject', 'Mobile', 'Email', 'Assigned To', 'Enquired Date', 'Last Updated', 'Status']
    const rows = enquiries.map(e => [e.name, e.subject || '', e.mobile, e.email, e.assigned_to || '', e.created_at || '', e.last_updated || '', e.status || ''])
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enquiries.csv'
    a.click()
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value || undefined })
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters({ ...filters, status: (value || undefined) as any })
    setPage(1)
  }

  useEffect(() => {
    // Check for search query in URL params
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      setFilters({ ...filters, search: searchQuery })
    }
  }, [searchParams])

  useEffect(() => {
    loadEnquiries()
  }, [page, filters])

  const loadEnquiries = async () => {
    setLoading(true)
    try {
      const response = await enquiryService.getAll(filters, page, 20)
      if (response.success && response.data) {
        setEnquiries(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to load enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await enquiryService.delete(id)
        if (response.success) {
          toast.success('Enquiry deleted successfully')
          loadEnquiries()
        } else {
          toast.error('Failed to delete enquiry')
        }
      } catch (error) {
        console.error('Failed to delete enquiry:', error)
        toast.error('Failed to delete enquiry')
      }
    }
  }

  const getActionMenuItems = (enquiry: Enquiry) => [
    {
      label: 'View',
      onClick: () => navigate(`/enquiries/${enquiry.id}`),
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Edit',
      onClick: () => navigate(`/enquiries/${enquiry.id}/edit`),
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: 'Delete',
      onClick: () => handleDelete(enquiry.id),
      icon: <Trash2 className="w-4 h-4" />,
      color: 'danger' as const
    }
  ]


  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeading 
        title="Enquiries" 
        description="Manage all customer enquiries"
        action={
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        }
      />

      {/* Search and Status Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search enquiries..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="lg:w-48">
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
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={TABLE_HEAD_CLASS}>
              <tr>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>S.No</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Full Name</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Subject</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Phone</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Assigned To</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Enquired Date</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Last Updated</th>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Status</th>
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
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`${TABLE_CELL_CLASS} text-center text-gray-500`}>
                    No enquiries found
                  </td>
                </tr>
              ): (
                enquiries.map((enquiry, index) => {
                  const statusKey = enquiry.status?.toString().toLowerCase().trim()
                  const normalizedKey = statusKey === 'in progress' ? 'in_progress' : statusKey
                  const statusOption = statusOptions.find(opt => opt.value === normalizedKey)

                  return (
                    <tr key={enquiry.id} className={TABLE_ROW_CLASS}>
                      <td className={TABLE_CELL_CENTER_CLASS}>{(page - 1) * 20 + index + 1}</td>

                      <td className={TABLE_CELL_CLASS}>

                        <div className="font-medium text-[#0F172A]">{enquiry.name}</div>
                      </td>
                      <td className={`${TABLE_CELL_CLASS} max-w-xs truncate`}>{enquiry.subject || '-'}</td>
                      <td className={TABLE_CELL_CLASS}>{enquiry.mobile}</td>
                      <td className={TABLE_CELL_CLASS}>
                        {enquiry.assigned_to && typeof enquiry.assigned_to === 'object'
                          ? `${enquiry.assigned_to.first_name || ''} ${enquiry.assigned_to.last_name || ''}`.trim() || '-'
                          : typeof enquiry.assigned_to === 'string'
                            ? enquiry.assigned_to
                            : '-'}
                      </td>

                      <td className={TABLE_CELL_CLASS}>
                        {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className={TABLE_CELL_CLASS}>
                        {enquiry.last_updated ? new Date(enquiry.last_updated).toLocaleDateString() : '-'}
                      </td>
                      <td className={TABLE_CELL_CENTER_CLASS}>
                        {statusOption ? (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
                            {statusOption.label}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {enquiry.status || 'Unknown'}
                          </span>
                        )}
                      </td>
                      <td className={TABLE_CELL_CENTER_CLASS}>
                        <ActionMenu items={getActionMenuItems(enquiry)} ariaLabel={`Actions for ${enquiry.name}`} />
                      </td>
                    </tr>
                  )
                })
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
                      ? 'bg-[#2563EB] text-white'
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
    </div>
  )
}
