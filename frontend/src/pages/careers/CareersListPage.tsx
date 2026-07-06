import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown } from 'lucide-react'
import { careerService } from '../../services/career.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import PageHeading from '../../components/common/PageHeading'
import StatusBadge from '../../components/common/StatusBadge'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS, TABLE_CELL_CLASS, TABLE_CELL_CENTER_CLASS, ACTION_COL_WIDTH, TABLE_SKELETON_CLASS, TABLE_ROW_CLASS } from '../../components/common/tableStyles'
import type { Career, CareerFilters, CareerStatus, EmploymentType, WorkMode } from '../../types/career.types'
import { CAREER_STATUS_COLORS, CAREER_STATUS_LABELS } from '../../types/career.types'

export default function CareersListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CareerFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusOptions: { value: CareerStatus; label: string; color: string }[] = [
    { value: 'ACTIVE', label: 'Published', color: 'bg-green-100 text-green-800' },
    { value: 'draft', label: 'Draft', color: 'bg-orange-100 text-orange-800' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-red-100 text-red-800' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
  ]

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

   
  useEffect(() => {
    loadCareers()
  }, [page, filters])

  const loadCareers = async () => {
    setLoading(true)
    try {
      const response = await careerService.getAll(filters, page, 20)
      if (response.success && response.data) {
        setCareers(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to load careers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
    setPage(1)
  }

  const handleFilterChange = (field: keyof CareerFilters, value: string | number | boolean | undefined) => {
    setFilters({ ...filters, [field]: value || undefined })
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this career posting?')) {
      try {
        const response = await careerService.delete(id)
        if (response.success) {
          toast.success('Career deleted successfully')
          loadCareers()
        } else {
          toast.error('Failed to delete career')
        }
      } catch (error) {
        console.error('Failed to delete career:', error)
        toast.error('Failed to delete career')
      }
    }
  }

  const getActionMenuItems = (career: Career) => {
    const items = [
      {
        label: 'View',
        onClick: () => navigate(`/careers/${career.id}`),
        icon: <Eye className="w-4 h-4" />
      },
      {
        label: 'Edit',
        onClick: () => navigate(`/careers/${career.id}/edit`),
        icon: <Edit className="w-4 h-4" />
      },
      {
        label: 'Delete',
        onClick: () => handleDelete(career.id),
        icon: <Trash2 className="w-4 h-4" />,
        color: 'danger' as const
      }
    ]
    return items
  }

  const getStatusBadge = (status: CareerStatus) => (
    <StatusBadge
      status={status}
      colorMap={CAREER_STATUS_COLORS}
      labelMap={CAREER_STATUS_LABELS}
    />
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getLastUpdated = (career: Career) =>
    career.updated_at || career.updated_date || career.created_at || career.posted_date

  const formatEmploymentType = (type?: string) => {
    if (!type) return '-'
    return employmentTypeOptions.find(o => o.value === type)?.label || type.replace(/_/g, ' ')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeading 
        title="Careers" 
        description="Manage job postings and careers"
        action={
          <button 
            onClick={() => navigate('/careers/create')}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Career
          </button>
        }
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search careers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                onChange={(e) => handleFilterChange('employment_type', e.target.value)}
              >
                <option value="">All Types</option>
                {employmentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                onChange={(e) => handleFilterChange('work_mode', e.target.value)}
              >
                <option value="">All Modes</option>
                {workModeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Filter by location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={TABLE_HEAD_CLASS}>
              <tr>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>S.No</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Job Title</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Department</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Location</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Employment Type</th>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Status</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Last Updated</th>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} ${ACTION_COL_WIDTH}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className={TABLE_SKELETON_CLASS}>
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : careers.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`${TABLE_CELL_CLASS} text-center text-gray-500`}>
                    No careers found
                  </td>
                </tr>
              ) : (
                careers.map((career, index) => (
                  <tr key={career.id} className={TABLE_ROW_CLASS}>
                    <td className={TABLE_CELL_CENTER_CLASS}>{(page - 1) * 20 + index + 1}</td>
                    <td className={TABLE_CELL_CLASS}>{career.job_titles}</td>
                    <td className={TABLE_CELL_CLASS}>{career.Department}</td>
                    <td className={TABLE_CELL_CLASS}>{career.Locations}</td>
                    <td className={TABLE_CELL_CLASS}>{formatEmploymentType(career.EmploymentType || career.employment_type)}</td>
                    <td className={TABLE_CELL_CENTER_CLASS}>{getStatusBadge((career.job_status || career.status || 'ACTIVE') as CareerStatus)}</td>
                    <td className={TABLE_CELL_CLASS}>{formatDate(getLastUpdated(career))}</td>
                    <td className={TABLE_CELL_CENTER_CLASS}>
                      <ActionMenu items={getActionMenuItems(career)} ariaLabel={`Actions for ${career.job_titles}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
                    page === i + 1 ? 'bg-[#2563EB] text-white' : 'border border-gray-300 hover:bg-gray-50'
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
