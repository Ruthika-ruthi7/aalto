import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Trash2, Power, Key, AlertCircle, Loader2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { userService } from '../../services/user.service'
import { useToast } from '../../components/common/Toast'
import type { User, UserFilters, UserRole, UserStatus } from '../../types/user.types'
import { roleOptions } from '../../types/user.types'
import PageHeader from '../../components/common/PageHeader'
import DataTable, { Pagination } from '../../components/common/DataTable'
import ActionMenu from '../../components/common/ActionMenu'
import Modal from '../../components/common/Modal'
import PageHeading from '../../components/common/PageHeading'

export default function UserListPage() {
  const toast = useToast()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<UserFilters>({ search: '', role: undefined, status: undefined })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modals state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: number | null }>({ isOpen: false, userId: null })
  const [resetModal, setResetModal] = useState<{ isOpen: boolean; userId: number | null }>({ isOpen: false, userId: null })
  const [newPassword, setNewPassword] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [page, filters])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await userService.getAll(filters, page, 10)
      if (response.success && response.data) {
        setUsers(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.userId) return
    setActionLoading(true)
    try {
      const response = await userService.delete(deleteModal.userId)
      if (response.success) {
        toast.success('User deleted successfully')
        loadUsers()
        setDeleteModal({ isOpen: false, userId: null })
      } else {
        toast.error(response.error?.message || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetModal.userId || !newPassword) return
    setActionLoading(true)
    try {
      const response = await userService.resetPassword(resetModal.userId, newPassword)
      if (response.success) {
        toast.success('Password reset successfully')
        setResetModal({ isOpen: false, userId: null })
        setNewPassword('')
      } else {
        toast.error(response.error?.message || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('Failed to reset password')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await userService.toggleStatus(id)
      if (response.success) {
        toast.success('User status updated successfully')
        loadUsers()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const roleBadgeColors: Record<UserRole, string> = {
    'Super Admin': 'bg-red-100 text-red-700 border-red-200',
    'Customer Admin': 'bg-blue-100 text-blue-700 border-blue-200',
    'Admin': 'bg-amber-100 text-amber-700 border-amber-200',
    'Editor': 'bg-purple-100 text-purple-700 border-purple-200',
    'HR': 'bg-orange-100 text-orange-700 border-orange-200',
    'Viewer': 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const columns = [
    { 
      key: 'sno', 
      header: 'S.No', 
      render: (_: unknown, __: User, index: number) => (page - 1) * 10 + (typeof index === 'number' ? index : 0) + 1,
      className: 'w-16',
    },
    { 
      key: 'username', 
      header: 'Username',
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (val: UserRole) => (
        <span className={`inline-flex items-center px-2.5 py-2.5 rounded-full text-xs font-semibold border ${roleBadgeColors[val]}`}>
          {val}
        </span>
      ),
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (val: UserStatus) => (
        <span className={`inline-flex items-center px-2.5 py-2.5 rounded-full text-xs font-semibold border capitalize ${
          val === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {val}
        </span>
      ),
    },
    { 
      key: 'last_login', 
      header: 'Last Login',
      render: (val: string) => val ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4 shrink-0" />
          {formatDistanceToNow(new Date(val), { addSuffix: true })}
        </span>
      ) : 'Never',
    },
    { 
      key: 'created_at', 
      header: 'Created Date',
      render: (val: string) => formatDate(val),
    },
    { 
      key: 'updated_at', 
      header: 'Last Updated',
      render: (_: unknown, user: User) => formatDate(user.updated_at || user.created_at),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, user: User) => (
        <ActionMenu 
          items={[
            { label: 'View', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/users/${user.id}`) },
            { label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: () => navigate(`/users/${user.id}/edit`) },
            { label: 'Reset Password', icon: <Key className="w-4 h-4" />, onClick: () => setResetModal({ isOpen: true, userId: user.id }) },
            { 
              label: user.status === 'active' ? 'Deactivate' : 'Activate', 
              icon: <Power className="w-4 h-4" />, 
              onClick: () => handleToggleStatus(user.id),
              color: user.status === 'active' ? 'warning' : 'success'
            },
            { 
              label: 'Delete', 
              icon: <Trash2 className="w-4 h-4" />, 
              onClick: () => setDeleteModal({ isOpen: true, userId: user.id }),
              color: 'danger',
              disabled: user.role === 'Super Admin'
            },
          ]}
        />
      )
    }
  ]

  return (
    <div className="p-6 lg:p-10 space-y-8 font-['Nunito_Sans']">
      <PageHeading 
        title="User Management" 
        description="Create and manage administrative users and their permissions."
        action={
          <button
            onClick={() => navigate('/users/create')}
            className="inline-flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Search Username</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="e.g. admin_user"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>
        
        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Role</label>
          <select
            value={filters.role || ''}
            onChange={(e) => setFilters({ ...filters, role: e.target.value as UserRole || undefined })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] outline-none text-sm font-medium transition-all cursor-pointer"
          >
            <option value="">All Roles</option>
            {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as UserStatus || undefined })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] outline-none text-sm font-medium transition-all cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable 
          columns={columns as any} 
          data={users as any} 
          loading={loading}
          emptyMessage="No users found in the system."
        />
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        title="Confirm Deletion"
        footer={
          <>
            <button 
              onClick={() => setDeleteModal({ isOpen: false, userId: null })}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete User
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4 text-slate-600">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="font-medium">Are you sure you want to delete this user? This action can be undone by an administrator later but will remove access immediately.</p>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetModal.isOpen}
        onClose={() => {
          setResetModal({ isOpen: false, userId: null })
          setNewPassword('')
        }}
        title="Reset Password"
        footer={
          <>
            <button 
              onClick={() => setResetModal({ isOpen: false, userId: null })}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleResetPassword}
              disabled={actionLoading || !newPassword}
              className="px-6 py-2 bg-[#1E3A5F] hover:bg-[#0F172A] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              Update Password
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Enter a new secure password for this user. They will need this to login next time.</p>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] outline-none text-sm font-medium"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
