import { useState } from 'react'
import { LayoutDashboard, FileText, Briefcase, Users, Image, BookOpen, Settings, X, BarChart3 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../common/Header'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/enquiries', label: 'Enquiries', icon: FileText },
  { path: '/blogs', label: 'Blogs', icon: BookOpen },
  { path: '/careers', label: 'Careers', icon: Briefcase },
  { path: '/applicants', label: 'Applicants', icon: Users },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/case-studies', label: 'Case Studies', icon: BarChart3 },
  { path: '/users', label: 'User Management', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const location = useLocation()

  const effectiveCollapsed = !isHovered

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#1E293B] z-50 transform transition-all duration-250 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${effectiveCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            {!effectiveCollapsed && <h1 className="text-xl font-bold text-white">Aalto Admin</h1>}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-700 rounded">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-250 ease-in-out group relative ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  title={effectiveCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${effectiveCollapsed ? 'mx-auto' : ''}`} />
                  {!effectiveCollapsed && <span className="font-medium whitespace-nowrap opacity-100 transition-opacity duration-250">{item.label}</span>}
                  {effectiveCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-700 ${effectiveCollapsed ? 'text-center' : ''}`}>
            {!effectiveCollapsed ? (
              <div className="text-xs text-gray-400">
                <p>© 2026 Aalto Engineers</p>
                <p className="mt-1">Version 1.0.0</p>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                <p>v1.0</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
