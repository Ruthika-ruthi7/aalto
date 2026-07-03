import { Eye, Edit, Trash2, Download } from 'lucide-react'
import { ReactNode } from 'react'

interface ActionButtonProps {
  type: 'view' | 'edit' | 'delete' | 'download' | 'custom'
  onClick: () => void
  title?: string
  icon?: ReactNode
  disabled?: boolean
}

const buttonStyles = {
  view: 'text-gray-600 hover:text-#2563EB hover:bg-orange-50',
  edit: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
  delete: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
  download: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
  custom: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
}

const icons = {
  view: <Eye className="w-4 h-4" />,
  edit: <Edit className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  custom: null,
}

export default function ActionButton({
  type,
  onClick,
  title,
  icon,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles[type]}`}
      title={title}
    >
      {icon || icons[type]}
    </button>
  )
}
