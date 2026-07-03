import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Mail, Lock, CheckCircle } from 'lucide-react'
import { authService } from '../../services/auth.service'
import { useToast } from '../../components/common/Toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('[LOGIN] Attempting login with:', { email, rememberMe })

    try {
      const response = await authService.login({ email, password, remember_me: rememberMe })
      
      console.log('[LOGIN] API response:', response)
      
      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        console.log('[LOGIN] Tokens stored, navigating to dashboard')
        toast.success('Login successful! Redirecting...')
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        console.log('[LOGIN] Login failed:', response.error)
        toast.error(response.error?.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('[LOGIN] API error:', error)
      toast.error('An error occurred. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl max-h-full bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden m-4 lg:m-6">
        {/* Left Side - Dark Navy with Illustration */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-16 left-16 w-48 h-48 border-2 border-white rounded-full" />
            <div className="absolute bottom-16 right-16 w-40 h-40 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full" />
          </div>

          {/* Modern HR/Admin Dashboard Illustration */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4">
            <div className="w-64 h-64 lg:w-80 lg:h-80 mb-6 relative">
              <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle */}
                <circle cx="200" cy="200" r="180" fill="white" opacity="0.05" />
                
                {/* Desk/Table */}
                <rect x="50" y="280" width="300" height="12" rx="2" fill="white" opacity="0.15" />
                <rect x="70" y="292" width="16" height="60" fill="white" opacity="0.1" />
                <rect x="314" y="292" width="16" height="60" fill="white" opacity="0.1" />
                
                {/* Monitor */}
                <rect x="100" y="120" width="200" height="130" rx="8" fill="white" opacity="0.2" />
                <rect x="110" y="130" width="180" height="110" rx="4" fill="#2563EB" opacity="0.15" />
                
                {/* Screen content - Charts */}
                <rect x="120" y="145" width="60" height="40" rx="2" fill="white" opacity="0.3" />
                <rect x="190" y="145" width="90" height="40" rx="2" fill="white" opacity="0.2" />
                <rect x="120" y="195" width="160" height="35" rx="2" fill="white" opacity="0.25" />
                
                {/* Monitor stand */}
                <rect x="185" y="250" width="30" height="30" fill="white" opacity="0.15" />
                <rect x="165" y="280" width="70" height="8" rx="2" fill="white" opacity="0.15" />
                
                {/* Person - Admin/HR Professional */}
                <circle cx="200" cy="70" r="28" fill="white" opacity="0.25" />
                <path d="M 160 100 Q 200 90 240 100 L 250 160 L 150 160 Z" fill="white" opacity="0.2" />
                
                {/* Laptop */}
                <rect x="280" y="260" width="50" height="35" rx="3" fill="white" opacity="0.15" />
                <rect x="285" y="265" width="40" height="25" rx="2" fill="#2563EB" opacity="0.1" />
                
                {/* Documents/Papers */}
                <rect x="60" y="260" width="35" height="45" rx="2" fill="white" opacity="0.12" transform="rotate(-10 77.5 282.5)" />
                <rect x="55" y="265" width="35" height="45" rx="2" fill="white" opacity="0.08" transform="rotate(-15 72.5 287.5)" />
                
                {/* Coffee cup */}
                <circle cx="320" cy="250" r="12" fill="white" opacity="0.15" />
                <path d="M 332 245 Q 340 250 332 255" stroke="white" strokeWidth="2" fill="none" opacity="0.15" />
                
                {/* Plant */}
                <rect x="45" y="240" width="20" height="30" rx="2" fill="white" opacity="0.1" />
                <ellipse cx="55" cy="235" rx="15" ry="10" fill="white" opacity="0.12" />
              </svg>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight">
              Manage Your Workforce Smarter
            </h2>
            <p className="text-white/80 text-sm lg:text-base max-w-sm leading-relaxed">
              Access enquiries, blogs, careers, applicants and more — all in one place.
            </p>
          </div>

          {/* Feature Chips */}
          <div className="relative z-10 grid grid-cols-2 gap-3 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-[#10B981] mb-1" />
              <p className="text-white font-medium text-sm">Enquiries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-[#10B981] mb-1" />
              <p className="text-white font-medium text-sm">Blogs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-[#10B981] mb-1" />
              <p className="text-white font-medium text-sm">Careers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-[#10B981] mb-1" />
              <p className="text-white font-medium text-sm">Reports</p>
            </div>
          </div>
        </div>

        {/* Right Side - White Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          {/* Welcome Text */}
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-2 leading-tight">
              Welcome Back! 👋
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              Please sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Login to Your Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
