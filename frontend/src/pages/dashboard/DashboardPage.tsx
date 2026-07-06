import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Image as ImageIcon, 
  BookOpen,
  TrendingUp,
  Eye,
  ArrowRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '../../services/dashboard.service'
import type { DashboardStats, DashboardAnalytics } from '../../types/dashboard.types'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [date, setDate] = useState('')
  const [subtitle, setSubtitle] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAnalytics()
        ])
        if (statsRes.success && statsRes.data) setStats(statsRes.data)
        if (analyticsRes.success && analyticsRes.data) setAnalytics(analyticsRes.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let greetingText = ''
      let subtitleText = ''
      
      if (hour >= 5 && hour < 12) {
        greetingText = 'Good Morning, Admin! ☀️'
        subtitleText = "Start your day by reviewing today's website activities and pending tasks."
      } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good Afternoon, Admin! 🌤️'
        subtitleText = "Here's an overview of today's website activities and recent updates."
      } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good Evening, Admin! 🌇'
        subtitleText = "Review today's progress and monitor the latest website activities."
      } else {
        greetingText = 'Good Night, Admin! 🌙'
        subtitleText = "Today's activities are summarized below. Have a productive evening!"
      }
      
      setGreeting(greetingText)
      setSubtitle(subtitleText)
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      setDate(now.toLocaleDateString('en-US', options))
    }
    
    updateGreeting()
  }, [])

  const statCards = [
    { title: 'Total Enquiries', value: stats?.total_enquiries || 0, icon: LayoutDashboard, color: 'bg-[#2563EB]', trend: '+12%' },
    { title: 'Total Applications', value: stats?.total_applications || 0, icon: Users, color: 'bg-blue-500', trend: '+8%' },
    { title: 'Total Blogs', value: stats?.total_blogs || 0, icon: FileText, color: 'bg-green-500', trend: '+5%' },
    { title: 'Active Careers', value: stats?.active_careers || 0, icon: Briefcase, color: 'bg-purple-500', trend: '+15%' },
    { title: 'Case Studies', value: stats?.case_studies || 0, icon: BookOpen, color: 'bg-pink-500', trend: '+3%' },
    { title: 'Gallery', value: stats?.gallery_count || 0, icon: ImageIcon, color: 'bg-cyan-500', trend: '+7%' },
    { title: 'New Enquiries Today', value: stats?.new_enquiries_today || 0, icon: TrendingUp, color: 'bg-yellow-500', trend: '+20%' },
  ]

  const quickActions = [
    { title: 'Add Blog', icon: FileText, link: '/blogs/create', color: 'text-[#2563EB]' },
    { title: 'Add Career', icon: Briefcase, link: '/careers/create', color: 'text-blue-500' },
    { title: 'Add Case Study', icon: BookOpen, link: '/case-studies/create', color: 'text-green-500' },
    { title: 'Upload Gallery', icon: ImageIcon, link: '/gallery/create', color: 'text-purple-500' },
    { title: 'View Enquiries', icon: LayoutDashboard, link: '/enquiries', color: 'text-pink-500' },
    { title: 'View Applicants', icon: Users, link: '/applicants', color: 'text-cyan-500' },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">{greeting}</h1>

        <p className="text-gray-500 text-sm lg:text-base mt-1">{date}</p>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#2563EB]/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1 lg:mt-2">{card.value}</p>
                <div className="flex items-center mt-1 lg:mt-2 text-xs lg:text-sm">
                  <span className="text-green-600 font-medium">{card.trend}</span>
                  <span className="text-gray-500 ml-1 lg:ml-2">vs last month</span>
                </div>
              </div>
              <div className={`${card.color} p-2 lg:p-3 rounded-xl`}>
                <card.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-[#0F172A]">Monthly Enquiry Trend</h2>
              <p className="text-gray-600 text-xs lg:text-sm mt-1">Enquiry statistics over the last 12 months</p>
            </div>
            <button 
              onClick={() => navigate('/enquiries')}
              className="flex items-center gap-2 text-[#2563EB] hover:text-[#1E40AF] font-medium text-xs lg:text-sm cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
          
          {/* Recharts Bar Chart */}
          <div 
            className="h-48 lg:h-64 cursor-pointer"
            onClick={() => navigate('/enquiries')}
          >
            {analytics && analytics.enquiries_trend && analytics.enquiries_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.enquiries_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">No analytics data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity - Spans 1 column */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg lg:text-xl font-bold text-[#0F172A] mb-3 lg:mb-4">Recent Activity</h2>
          <div className="space-y-3 lg:space-y-4">
            {[
              { action: 'New enquiry received', entity: 'John Smith - Acme Corp', time: '2 hours ago', type: 'enquiry' },
              { action: 'Blog published', entity: 'Sustainable Engineering Practices', time: '5 hours ago', type: 'blog' },
              { action: 'New applicant', entity: 'Robert Chen - Senior Structural Engineer', time: '1 day ago', type: 'applicant' },
              { action: 'Career posted', entity: 'Project Manager - Chicago', time: '2 days ago', type: 'career' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-[#F8FAFC] rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F172A] text-sm lg:text-base truncate">{activity.action}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">{activity.entity}</p>
                </div>
                <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg lg:text-xl font-bold text-[#0F172A] mb-3 lg:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.link}
              className="bg-white rounded-xl p-3 lg:p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#2563EB] group"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={`p-2 lg:p-3 rounded-lg bg-[#F8FAFC] group-hover:bg-blue-50 transition-colors`}>
                  <action.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0F172A] text-sm lg:text-base">{action.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-[#2563EB] transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
