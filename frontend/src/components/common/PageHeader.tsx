import { Plus } from 'lucide-react'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onActionClick?: () => void
  children?: ReactNode
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  onActionClick,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 bg-#2563EB hover:bg-#2563EBDark text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  )
}
