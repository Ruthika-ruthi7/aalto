import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, Download, Eye } from 'lucide-react'
import { applicantService } from '../../services/applicant.service'
import { useToast } from '../../components/common/Toast'
import ActionMenu from '../../components/common/ActionMenu'
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${option?.color || 'bg-gray-100 text-gray-800'}`}>
        {option?.label || status.replace(/_/g, ' ')}
      </span>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Applicants</h1>
          <p className="text-gray-600 mt-1">Manage job applications</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-#2563EB hover:bg-#2563EBDark text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Applicant
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="lg:w-48">
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
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Job ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Job Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Applicant Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Applied Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={10} className="px-4 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                    No applicants found
                  </td>
                </tr>
              ) : (
                applicants.map((applicant, index) => (
                  <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 text-sm">{(page - 1) * 20 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{applicant.apply_id || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{applicant.position || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0F172A] text-sm max-w-xs truncate" title={applicant.name}>{applicant.name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{applicant.phone}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{applicant.email}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{applicant.experience || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {applicant.applied_at ? new Date(applicant.applied_at).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(applicant.status)}</td>
                    <td className="px-4 py-3">
                      <ActionMenu items={getActionMenuItems(applicant)} ariaLabel={`Actions for ${applicant.name}`} />
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
