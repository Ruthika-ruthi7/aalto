import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, User, Lock, Mail, ArrowRight } from 'lucide-react'
import { authService } from '../../services/auth.service'
import { useToast } from '../../components/common/Toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login({ username, password, remember_me: rememberMe })

      if (response.success && response.data) {
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        toast.success('Login successful! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 500)
      } else {
        toast.error(response.message || response.error?.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('[LOGIN] API error:', error)
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined
      toast.error(message || 'An error occurred. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-[0_24px_72px_rgba(15,23,42,0.14)] overflow-hidden grid grid-cols-1 md:grid-cols-[48%_52%] min-h-[650px] lg:min-h-[700px]">

        <div className="relative bg-[#0B1F3C] p-8 lg:p-12 flex flex-col text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl" />


          <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-full max-w-[250px] mb-8">
              <svg viewBox="0 0 400 400" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="160" fill="white" opacity="0.08" />
                <rect x="70" y="270" width="260" height="16" rx="8" fill="white" opacity="0.08" />
                <rect x="100" y="150" width="200" height="120" rx="18" fill="white" opacity="0.16" />
                <rect x="120" y="168" width="52" height="44" rx="12" fill="white" opacity="0.24" />
                <rect x="186" y="168" width="76" height="44" rx="12" fill="white" opacity="0.18" />
                <rect x="120" y="228" width="150" height="34" rx="12" fill="white" opacity="0.2" />
                <rect x="164" y="284" width="72" height="22" rx="12" fill="white" opacity="0.16" />
                <circle cx="200" cy="82" r="28" fill="white" opacity="0.18" />
                <path d="M 150 115 Q 200 95 250 115 L 260 170 L 140 170 Z" fill="white" opacity="0.1" />
              </svg>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Manage Your Workforce Smarter
            </h2>
            <p className="text-white/75 text-sm lg:text-base max-w-[340px] leading-relaxed">
              Access enquiries, blogs, careers, applicants, gallery, case studies and more — all in one place.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-3">
            {['Enquiries', 'Blogs', 'Careers', 'Gallery'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#f4f7fb] p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Welcome Back 👋</h2>
              <p className="text-slate-500 text-sm">Please login to your account to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-[24px] border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-[24px] border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 rounded-[24px] bg-[#1E3A5F] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1E3A5F]/20 transition hover:bg-[#152A45] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Login to Your Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 border-t border-slate-200" />
                <span className="text-sm text-slate-400 whitespace-nowrap">Need help?</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4f7fb] shadow-sm">
                  <Mail className="h-4 w-4 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Contact Support</p>
                  <a href="mailto:info@avirtues.com" className="text-sm font-semibold text-[#1E3A5F] hover:underline">
                    info@avirtues.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
