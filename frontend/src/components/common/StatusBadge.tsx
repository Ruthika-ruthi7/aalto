interface StatusBadgeProps {
  status: string
  label?: string
  colorMap?: Record<string, string>
  labelMap?: Record<string, string>
  className?: string
}

export const BADGE_BASE_CLASSES =
  'inline-flex items-center px-2.5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap'

const defaultColorMap: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  published: 'bg-green-100 text-green-800',
  open: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  inactive: 'bg-red-100 text-red-800',
  unpublished: 'bg-red-100 text-red-800',
  archived: 'bg-red-100 text-red-800',
  closed: 'bg-red-100 text-red-800',
  scheduled: 'bg-blue-100 text-blue-800',
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

const defaultLabelMap: Record<string, string> = {
  unpublished: 'Archived',
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function StatusBadge({
  status,
  label,
  colorMap = defaultColorMap,
  labelMap = defaultLabelMap,
  className = '',
}: StatusBadgeProps) {
  const key = status.toLowerCase()
  const colorClass = colorMap[key] || 'bg-gray-100 text-gray-800'
  const displayLabel = label ?? labelMap[key] ?? formatStatusLabel(status)

  return (
    <span className={`${BADGE_BASE_CLASSES} ${colorClass} ${className}`}>
      {displayLabel}
    </span>
  )
}
