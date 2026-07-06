import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, Send, Download, Star } from 'lucide-react'
import { caseStudyService } from '../../services/case-study.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import PageHeading from '../../components/common/PageHeading'
import StatusBadge from '../../components/common/StatusBadge'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS, TABLE_CELL_CLASS, TABLE_CELL_CENTER_CLASS, ACTION_COL_WIDTH, TABLE_SKELETON_CLASS, TABLE_ROW_CLASS } from '../../components/common/tableStyles'
import type { CaseStudy, CaseStudyFilters, CaseStudyStatus, ServiceType, Industry } from '../../types/case-study.types'

export default function CaseStudiesListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CaseStudyFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const statusOptions: { value: CaseStudyStatus; label: string; color: string }[] = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
    { value: 'unpublished', label: 'Unpublished', color: 'bg-red-100 text-red-800' },
  ]

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

  useEffect(() => {
    loadCaseStudies()
  }, [page, filters])

  const loadCaseStudies = async () => {
    setLoading(true)
    try {
      const response = await caseStudyService.getAll(filters, page, 20)
      if (response.success && response.data) {
        setCaseStudies(response.data.items || [])
        setTotal(response.data.total || 0)
      } else {
        setCaseStudies([])
        setTotal(0)
      }
    } catch (error) {
      console.error('Failed to load case studies:', error)
      setCaseStudies([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value || undefined })
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters({ ...filters, status: value as CaseStudyStatus || undefined })
    setPage(1)
  }

  const handleServiceTypeFilter = (value: string) => {
    setFilters({ ...filters, service_type: value as ServiceType || undefined })
    setPage(1)
  }

  const handleIndustryFilter = (value: string) => {
    setFilters({ ...filters, industry: value as Industry || undefined })
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      try {
        const response = await caseStudyService.delete(id)
        if (response.success) {
          toast.success('Case study deleted successfully')
          loadCaseStudies()
        } else {
          toast.error('Failed to delete case study')
        }
      } catch (error) {
        console.error('Failed to delete case study:', error)
        toast.error('Failed to delete case study')
      }
    }
  }

  const handleTogglePublish = async (caseStudy: CaseStudy) => {
    const newStatus = caseStudy.status === 'published' ? 'unpublished' : 'published'
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      const response = await caseStudyService.update(caseStudy.id, formData)
      if (response.success) {
        toast.success(`Case study ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
        loadCaseStudies()
      } else {
        toast.error('Failed to update case study status')
      }
    } catch (error) {
      console.error('Failed to toggle case study status:', error)
      toast.error('Failed to update case study status')
    }
  }

  const handleExportCSV = () => {
    const headers = ['S.No', 'Title', 'Client Name', 'Service Type', 'Industry', 'Status', 'Last Updated']
    const rows = caseStudies.map((cs, index) => [
      (page - 1) * 20 + index + 1,
      cs.title,
      cs.client_name,
      cs.service_type,
      cs.industry,
      cs.status,
      new Date(cs.updated_at).toLocaleDateString()
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'case-studies.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  const getActionMenuItems = (caseStudy: CaseStudy) => {
    const items = [
      {
        label: 'View',
        onClick: () => navigate(`/case-studies/${caseStudy.id}`),
        icon: <Eye className="w-4 h-4" />
      },
      {
        label: 'Edit',
        onClick: () => navigate(`/case-studies/${caseStudy.id}/edit`),
        icon: <Edit className="w-4 h-4" />
      },
      {
        label: caseStudy.status === 'published' ? 'Unpublish' : 'Publish',
        onClick: () => handleTogglePublish(caseStudy),
        icon: <Send className="w-4 h-4" />,
        color: (caseStudy.status === 'published' ? 'warning' : 'success') as 'danger' | 'default' | 'success' | 'warning'
      },
      {
        label: 'Delete',
        onClick: () => handleDelete(caseStudy.id),
        icon: <Trash2 className="w-4 h-4" />,
        color: 'danger' as const
      }
    ]
    return items
  }

  const getStatusBadge = (status: CaseStudyStatus) => {
    const option = statusOptions.find(o => o.value === status)
    return (
      <StatusBadge
        status={status}
        label={option?.label}
        colorMap={Object.fromEntries(statusOptions.map(o => [o.value, o.color]))}
      />
    )
  }

  const formatServiceType = (type: string) => {
    return serviceTypeOptions.find(o => o.value === type)?.label || type
  }

  const formatIndustry = (industry: string) => {
    return industryOptions.find(o => o.value === industry)?.label || industry
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeading 
        title="Case Studies" 
        description="Manage project case studies"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={() => navigate('/case-studies/new')}
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Case Study
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search case studies..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                onChange={(e) => handleServiceTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {serviceTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                onChange={(e) => handleIndustryFilter(e.target.value)}
              >
                <option value="">All Industries</option>
                {industryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={TABLE_HEAD_CLASS}>
              <tr>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>S.No</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Featured Image</th>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Featured</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Case Study Title</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Client Name</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Service Type</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Industry</th>
                <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Status</th>
                <th className={TABLE_HEADER_CELL_CLASS}>Last Updated</th>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} ${ACTION_COL_WIDTH}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={10} className={TABLE_SKELETON_CLASS}>
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : caseStudies.length === 0 ? (
                <tr>
                  <td colSpan={10} className={`${TABLE_CELL_CLASS} text-center text-gray-500`}>
                    No case studies found
                  </td>
                </tr>
              ) : (
                caseStudies.map((caseStudy, index) => (
                  <tr key={caseStudy.id} className={TABLE_ROW_CLASS}>
                    <td className={TABLE_CELL_CENTER_CLASS}>{(page - 1) * 20 + index + 1}</td>
                    <td className={TABLE_CELL_CLASS}>
                      {caseStudy.featured_image ? (
                        <img
                            src={caseStudy.featured_image.startsWith('http') ? caseStudy.featured_image : `${import.meta.env.VITE_API_BASE_URL}${caseStudy.featured_image}`}
                            alt={caseStudy.title}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(caseStudy.featured_image?.startsWith('http') ? caseStudy.featured_image : `${import.meta.env.VITE_API_BASE_URL}${caseStudy.featured_image}`, '_blank')}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className={TABLE_CELL_CENTER_CLASS}>
                      {caseStudy.featured ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <div className="font-medium text-[#0F172A]">{caseStudy.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{caseStudy.short_description}</div>
                    </td>
                    <td className={TABLE_CELL_CLASS}>{caseStudy.client_name}</td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="inline-flex px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-xs font-medium">
                        {formatServiceType(caseStudy.service_type)}
                      </span>
                    </td>
                    <td className={TABLE_CELL_CLASS}>{formatIndustry(caseStudy.industry)}</td>
                    <td className={TABLE_CELL_CENTER_CLASS}>{getStatusBadge(caseStudy.status)}</td>
                    <td className={TABLE_CELL_CLASS}>
                      {new Date(caseStudy.updated_at).toLocaleDateString()}
                    </td>
                    <td className={TABLE_CELL_CENTER_CLASS}>
                      <ActionMenu items={getActionMenuItems(caseStudy)} ariaLabel={`Actions for ${caseStudy.title}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => setPage(p => Math.min(Math.ceil(total / 20), p + 1))}
                disabled={page >= Math.ceil(total / 20)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
