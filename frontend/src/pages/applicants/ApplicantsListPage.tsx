import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, Download, Eye } from 'lucide-react'
import { applicantService } from '../../services/applicant.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
import PageHeading from '../../components/common/PageHeading'
import StatusBadge from '../../components/common/StatusBadge'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS, TABLE_CELL_CLASS, TABLE_CELL_CENTER_CLASS, ACTION_COL_WIDTH, TABLE_SKELETON_CLASS, TABLE_ROW_CLASS } from '../../components/common/tableStyles'
import { getApplicantJobId } from '../../utils/formatJobReferenceId'
import type { Applicant, ApplicantFilters, ApplicantStatus } from '../../types/applicant.types'

export default function ApplicantsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ApplicantFilters>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusOptions: { value: ApplicantStatus; label: string; color: string }[] = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'under_review', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-green-100 text-green-800' },
    { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800' },
    { value: 'interview_completed', label: 'Interview Completed', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'selected', label: 'Selected', color: 'bg-teal-100 text-teal-800' },
    { value: 'offered', label: 'Offered', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'joined', label: 'Joined', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-orange-100 text-orange-800' },
  ]

   
  useEffect(() => {
    loadApplicants()
  }, [page, filters])

  const loadApplicants = async () => {
    setLoading(true)
    try {
      const response = await applicantService.getAll(filters, page, 20)
      if (response.success && response.data) {
        setApplicants(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to load applicants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters({ ...filters, status: value as ApplicantStatus || undefined })
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      try {
        const response = await applicantService.delete(id)
        if (response.success) {
          toast.success('Applicant deleted successfully')
          loadApplicants()
        } else {
          toast.error('Failed to delete applicant')
        }
      } catch (error) {
        console.error('Failed to delete applicant:', error)
        toast.error('Failed to delete applicant')
      }
    }
  }

  const handleDownloadResume = (applicant: Applicant) => {
    // In real implementation, this would download the file
    console.log('Downloading resume for:', applicant.name)
  }

  const getActionMenuItems = (applicant: Applicant) => [
    {
      label: 'View',
      onClick: () => navigate(`/applicants/${applicant.id}`),
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Edit',
      onClick: () => navigate(`/applicants/${applicant.id}/edit`),
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: 'Download Resume',
      onClick: () => handleDownloadResume(applicant),
      icon: <Download className="w-4 h-4" />
    },
    {
      label: 'Delete',
      onClick: () => handleDelete(applicant.id),
      icon: <Trash2 className="w-4 h-4" />,
      color: 'danger' as const
    }
  ]

  const getStatusBadge = (status: ApplicantStatus) => {
    const option = statusOptions.find(o => o.value === status)
    return (
      <StatusBadge
        status={status}
        label={option?.label}
        colorMap={Object.fromEntries(statusOptions.map(o => [o.value, o.color]))}
      />
    )
  }

  const getStatusLabel = (status?: ApplicantStatus) => {
    return statusOptions.find(o => o.value === status)?.label || status || ''
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleExportCSV = () => {
    const headers = ['S.No', 'Job ID', 'Job Title', 'Applicant Name', 'Mobile', 'Email', 'Experience', 'Applied Date', 'Status']
    const rows = applicants.map((applicant, index) => [
      String((page - 1) * 20 + index + 1),
      getApplicantJobId(applicant),
      applicant.position || '',
      applicant.name || '',
      applicant.phone || '',
      applicant.email || '',
      applicant.experience || '',
      formatDate(applicant.applied_at || applicant.applied_date),
      getStatusLabel(applicant.status),
    ])
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applicants_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <PageHeading
            title="Applicants"
            description="Manage job applications"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-1">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => navigate('/applicants/create')}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Applicant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
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
          <table className="w-full table-fixed min-w-[1100px]">
            <thead className={TABLE_HEAD_CLASS}>
              <tr>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} w-[70px]`}>S.No</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[110px]`}>Job ID</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[240px]`}>Job Title</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[220px]`}>Applicant Name</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[160px]`}>Mobile</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[280px]`}>Email</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[140px]`}>Experience</th>
                <th className={`${TABLE_HEADER_CELL_CLASS} w-[150px]`}>Applied Date</th>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} w-[140px]`}>Status</th>
                <th className={`${TABLE_HEADER_CELL_CENTER_CLASS} ${ACTION_COL_WIDTH} w-[100px]`}>Actions</th>
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
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={10} className={`${TABLE_CELL_CLASS} text-center text-gray-500`}>
                    No applicants found
                  </td>
                </tr>
              ) : (
                applicants.map((applicant, index) => (
                  <tr key={applicant.id} className={TABLE_ROW_CLASS}>
                    <td className={TABLE_CELL_CENTER_CLASS}>{(page - 1) * 20 + index + 1}</td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate" title={getApplicantJobId(applicant)}>
                        {getApplicantJobId(applicant)}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate" title={applicant.position || '-'}>
                        {applicant.position || '-'}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate font-medium text-[#0F172A]" title={applicant.name}>
                        {applicant.name}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate" title={applicant.phone}>
                        {applicant.phone}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate" title={applicant.email}>
                        {applicant.email}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      <div className="truncate" title={applicant.experience || '-'}>
                        {applicant.experience || '-'}
                      </div>
                    </td>

                    <td className={TABLE_CELL_CLASS}>
                      {formatDate(applicant.applied_at || applicant.applied_date)}
                    </td>

                    <td className={TABLE_CELL_CENTER_CLASS}>{getStatusBadge(applicant.status)}</td>

                    <td className={`${TABLE_CELL_CENTER_CLASS} w-[100px]`}>
                      <div className="flex justify-center">
                        <ActionMenu items={getActionMenuItems(applicant)} ariaLabel={`Actions for ${applicant.name}`} />
                      </div>
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

