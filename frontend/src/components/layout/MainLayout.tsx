import { useState, useMemo, useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Image,
  BookOpen,
  Settings,
  BarChart3,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../common/Header'
import { ModuleName } from '../../types/user.types'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
  module: ModuleName
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, module: 'Dashboard' },
  { path: '/enquiries', label: 'Enquiries', icon: FileText, module: 'Enquiries' },
  { path: '/blogs', label: 'Blogs', icon: BookOpen, module: 'Blogs' },
  { path: '/careers', label: 'Careers', icon: Briefcase, module: 'Careers' },
  { path: '/applicants', label: 'Applicants', icon: Users, module: 'Applicants' },
  { path: '/gallery', label: 'Gallery', icon: Image, module: 'Gallery' },
  { path: '/case-studies', label: 'Case Studies', icon: BarChart3, module: 'Case Studies' },
  { path: '/users', label: 'User Management', icon: Users, module: 'User Management' },
  { path: '/settings', label: 'Settings', icon: Settings, module: 'Settings' },
]

const STORAGE_KEY = 'sidebarCollapsed'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const readStoredUser = () => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  const [user, setUser] = useState(readStoredUser)

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

  const filteredNavItems = useMemo(() => {
    if (!user) return []
    if (user.role === 'Super Admin') return navItems

    return navItems.filter((item) => {
      const perms = user.permissions?.[item.module]
      return perms && perms.read
    })
  }, [user])

  const isItemActive = (item: NavItem) => {
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(sidebarCollapsed))
    } catch {
      // ignore
    }
  }, [sidebarCollapsed])

  // Mobile drawer
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarDrawerOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleSidebarCollapsed = () => setSidebarCollapsed((v) => !v)

  const closeMobileDrawer = () => setSidebarDrawerOpen(false)

  const sidebarWidth = sidebarCollapsed ? 80 : 280

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={closeMobileDrawer}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 z-50 hidden h-screen border-r border-white/10 bg-[#111827] shadow-2xl lg:flex flex-col overflow-hidden"
        style={{ width: sidebarWidth, transition: 'width 250ms ease' }}
        aria-label="Sidebar"
      >
        <div className="flex items-center px-4 py-5 border-b border-white/10 min-h-[76px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[9px] font-bold leading-tight text-[#111827]">
            LOGO
          </div>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item)

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-label={item.label}
                    title={sidebarCollapsed ? item.label : undefined}
                    onClick={() => {
                      // Desktop only - no-op; mobile drawer handles closing.
                    }}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 ${
                      active
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                    style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200">
                      <Icon className="h-5 w-5" />
                    </span>

                    <span
                      className="whitespace-nowrap overflow-hidden text-sm font-semibold"
                      style={{ opacity: sidebarCollapsed ? 0 : 1, transition: 'opacity 250ms ease' }}
                    >
                      {item.label === 'User Management' ? 'User Management' : item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-4">
          {!sidebarCollapsed ? (
            <div className="flex flex-col items-start">
              <div className="text-[12px] font-bold text-white/90">Admin Panel</div>
              <div className="text-[11px] text-white/60 mt-1">Version 1.0.1</div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-[11px] text-white/60">Version 1.0.1</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className="fixed left-0 top-0 z-50 h-screen bg-[#111827] shadow-2xl lg:hidden"
        style={{ width: 280, transform: sidebarDrawerOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 250ms ease-in-out' }}
        aria-label="Mobile sidebar"
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[76px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[9px] font-bold leading-tight text-[#111827]">
            LOGO
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Company</div>
            <div className="text-[11px] text-white/70 leading-tight">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item)

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileDrawer}
                    aria-label={item.label}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 ${
                      active
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="whitespace-nowrap overflow-hidden text-sm font-semibold">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="text-[12px] font-bold text-white/90 text-center">Admin Panel</div>
          <div className="text-[11px] text-white/60 mt-1 text-center">Version 1.0.1</div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex h-screen min-w-0 flex-col overflow-hidden"
        style={{ marginLeft: sidebarWidth, transition: 'margin-left 250ms ease' }}
      >
        <Header
          onMobileMenuClick={() => setSidebarDrawerOpen(true)}
          onToggleSidebar={toggleSidebarCollapsed}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

