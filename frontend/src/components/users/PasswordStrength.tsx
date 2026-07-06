import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    { label: 'Minimum 8 characters', regex: /.{8,}/ },
    { label: 'At least one uppercase letter', regex: /[A-Z]/ },
    { label: 'At least one lowercase letter', regex: /[a-z]/ },
    { label: 'At least one number', regex: /[0-9]/ },
    { label: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ]

  const strength = requirements.filter(req => req.regex.test(password)).length
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][Math.max(0, strength - 1)] || 'Very Weak'
  const strengthColor = [
    'bg-red-500',
    'bg-red-400',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ][Math.max(0, strength - 1)] || 'bg-slate-200'

  if (!password) return null

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">Strength: {strengthText}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={`h-1.5 w-6 rounded-full transition-all duration-500 ${step <= strength ? strengthColor : 'bg-gray-200'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password)
          return (
            <div key={index} className="flex items-center gap-2">
              {isMet ? (
                <div className="bg-green-100 p-0.5 rounded-full">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              ) : (
                <div className="bg-gray-200 p-0.5 rounded-full">
                  <X className="w-3 h-3 text-gray-400" />
                </div>
              )}
              <span className={`text-xs font-medium ${isMet ? 'text-green-700' : 'text-gray-400'}`}>
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
