import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 5000
    const timer = setTimeout(() => onClose(toast.id), duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${toastColors[toast.type]}`}>
      {toastIcons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Expose methods to window for global access
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).toast = {
      success: (message: string, duration?: number) => addToast({ type: 'success', message, duration }),
      error: (message: string, duration?: number) => addToast({ type: 'error', message, duration }),
      warning: (message: string, duration?: number) => addToast({ type: 'warning', message, duration }),
      info: (message: string, duration?: number) => addToast({ type: 'info', message, duration }),
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Convenience hooks
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const toast = (window as Window & { toast?: { success: (msg?: string, dur?: number) => void; error: (msg?: string, dur?: number) => void; warning: (msg?: string, dur?: number) => void; info: (msg?: string, dur?: number) => void } }).toast
  return {
    success: (message: string, duration?: number) => toast?.success(message, duration),
    error: (message: string, duration?: number) => toast?.error(message, duration),
    warning: (message: string, duration?: number) => toast?.warning(message, duration),
    info: (message: string, duration?: number) => toast?.info(message, duration),
  }
}
