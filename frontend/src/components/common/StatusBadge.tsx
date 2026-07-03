interface StatusBadgeProps {
  status: string
  colorMap?: Record<string, string>
  className?: string
}

const defaultColorMap: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  published: 'bg-green-100 text-green-800',
  open: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  inactive: 'bg-red-100 text-red-800',
  unpublished: 'bg-red-100 text-red-800',
  closed: 'bg-red-100 text-red-800',
  on_hold: 'bg-orange-100 text-orange-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  spam: 'bg-purple-100 text-purple-800',
  expired: 'bg-purple-100 text-purple-800',
  start_working: 'bg-indigo-100 text-indigo-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  interview_scheduled: 'bg-purple-100 text-purple-800',
  interview_completed: 'bg-indigo-100 text-indigo-800',
  selected: 'bg-teal-100 text-teal-800',
  offered: 'bg-cyan-100 text-cyan-800',
  joined: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ status, colorMap = defaultColorMap, className = '' }: StatusBadgeProps) {
  const colorClass = colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  )
}
