import { useState, useRef, useEffect } from 'react'
import { Search, Bell, User, LogOut, ChevronDown, Menu, X, CheckCheck, Eye, Check, AlertCircle, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { notificationService } from '../../services/notification.service'
import type { Notification } from '../../types/notification.types'
import { useToast } from './Toast'

export default function Header({
  onMobileMenuClick,
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onMobileMenuClick?: () => void
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
}) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  }

  const [user, setUser] = useState(readStoredUser)

  const displayName = user.full_name || user.User_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Admin'
  const profileImage = user.profile_image

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  useEffect(() => {
    const handleUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent
      setUser(customEvent.detail || readStoredUser())
    }

    const handleStorage = () => setUser(readStoredUser())

    window.addEventListener('userUpdated', handleUserUpdated)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdated)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationService.getAll(1, 10)
      if (response.success && response.data) {
        setNotifications(response.data.items || [])
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      if (response.success && response.data) {
        setUnreadCount(response.data.unread)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  const getNotificationIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'Enquiries': return '📨'
      case 'Applicants': return '👤'
      case 'Blogs': return '📝'
      case 'Gallery': return '🖼️'
      case 'Careers': return '💼'
      case 'Users': return '👥'
      case 'Settings': return '⚙️'
      case 'Case Studies': return '📊'
      default: return '🔔'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-400'
    }
  }

  const handleViewDetails = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id)
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }

    const moduleRoutes: Record<string, string> = {
      Enquiries: '/enquiries',
      Blogs: '/blogs',
      Careers: '/careers',
      Applicants: '/applicants',
      Gallery: '/gallery',
      'Case Studies': '/case-studies',
      Users: '/users',
      Settings: '/settings',
    }

    const route = moduleRoutes[notification.module_name] || '/dashboard'
    setNotificationOpen(false)
    navigate(route)
  }

  const handleMarkAsRead = async (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation()
    if (notification.is_read) return
    try {
      await notificationService.markAsRead(notification.id)
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
      toast.success('Marked as read')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAsUnread = async (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation()
    if (!notification.is_read) return
    try {
      await notificationService.markAsUnread(notification.id)
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, is_read: false } : n)))
      setUnreadCount((prev) => prev + 1)
      toast.success('Marked as unread')
    } catch (error) {
      console.error('Failed to mark as unread:', error)
      toast.error('Failed to mark as unread')
    }
  }

  const handleDeleteNotification = async (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation()
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationService.delete(notification.id)
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        if (!notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
        toast.success('Notification deleted')
      } catch (error) {
        console.error('Failed to delete notification:', error)
        toast.error('Failed to delete notification')
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead()
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                // Mobile: open drawer
                if (onMobileMenuClick) onMobileMenuClick()
                // Desktop: toggle collapsed state
                if (onToggleSidebar) onToggleSidebar()
              }}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search enquiries, blogs, careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    // Navigate to enquiries with search query
                    navigate(`/enquiries?search=${encodeURIComponent(searchQuery.trim())}`)
                    setSearchQuery('')
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/enquiries?search=${encodeURIComponent(searchQuery.trim())}`)
                  setSearchQuery('')
                }
              }}
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen)
                  if (!notificationOpen) {
                    loadNotifications()
                  }
                }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2563EB] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-[#0F172A]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-[#2563EB] hover:text-[#1E40AF] font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center text-gray-500">
                        <div className="animate-pulse">Loading...</div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${
                            !notification.is_read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <span className="text-xl">{getNotificationIcon(notification.module_name)}</span>
                              {notification.priority && (
                                <span
                                  className={`absolute -top-1 -right-1 w-3 h-3 ${getPriorityColor(notification.priority)} rounded-full border-2 border-white`}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p
                                    className={`font-medium text-sm ${
                                      !notification.is_read ? 'text-[#0F172A]' : 'text-gray-600'
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400">{formatTime(notification.created_at)}</span>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                      {notification.module_name}
                                    </span>
                                  </div>
                                </div>
                                {!notification.is_read && <span className="w-2 h-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1" />}
                              </div>
                              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleViewDetails(notification)}
                                  className="text-xs text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1"
                                  title="View Details"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </button>
                                {!notification.is_read ? (
                                  <button
                                    onClick={(e) => handleMarkAsRead(notification, e)}
                                    className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                    title="Mark as Read"
                                  >
                                    <Check className="w-3 h-3" />
                                    Read
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => handleMarkAsUnread(notification, e)}
                                    className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                    title="Mark as Unread"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    Unread
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleDeleteNotification(notification, e)}
                                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="flex-1 text-center text-sm text-[#2563EB] hover:text-[#1E40AF] font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View all
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Clear all notifications?')) {
                            setNotifications([])
                            setUnreadCount(0)
                            toast.success('All notifications cleared')
                          }
                        }}
                        className="flex-1 text-center text-sm text-red-600 hover:text-red-800 font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt={displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-[#0F172A]">{displayName}</p>
                  <p className="text-xs text-gray-500">{user.email || 'admin@aalto.com'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                        {profileImage ? (
                          <img src={profileImage} alt={displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{displayName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.role || 'Admin'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email || 'admin@aalto.com'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getNotificationIcon(selectedNotification.module_name)}</span>
                <h3 className="font-semibold text-[#0F172A]">{selectedNotification.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full font-medium">
                  {selectedNotification.module_name}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{selectedNotification.description}</p>
              <div className="text-sm text-gray-500">
                <p>Created: {new Date(selectedNotification.created_at).toLocaleString()}</p>
                <p>Status: {selectedNotification.is_read ? 'Read' : 'Unread'}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
