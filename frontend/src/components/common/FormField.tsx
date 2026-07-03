import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}

export default function FormField({ label, required, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
}

export function Input({ label, required, error, className = '', ...props }: InputProps) {
  return (
    <FormField label={label || ''} required={required} error={error}>
      <input
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    </FormField>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, required, error, options, className = '', ...props }: SelectProps) {
  return (
    <FormField label={label || ''} required={required} error={error}>
      <select
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </FormField>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  error?: string
  showCharCount?: boolean
  maxLength?: number
}

export function Textarea({ label, required, error, showCharCount, maxLength, className = '', ...props }: TextareaProps) {
  const value = props.value as string || ''
  const charCount = value.length

  return (
    <FormField label={label || ''} required={required} error={error}>
      <textarea
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none transition-colors resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        maxLength={maxLength}
        {...props}
      />
      {showCharCount && maxLength && (
        <p className="mt-1 text-sm text-gray-500">{charCount} / {maxLength}</p>
      )}
    </FormField>
  )
}
