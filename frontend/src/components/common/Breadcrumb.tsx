import { Link, useLocation } from 'react-router-dom'
import { getBreadcrumbsFromPath, type BreadcrumbItem } from '../../utils/breadcrumb.utils'

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation()
  const breadcrumbs = items ?? getBreadcrumbsFromPath(location.pathname)

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 mt-1 text-[13px] font-medium text-[#64748B] ${className}`}
    >
      {breadcrumbs.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span className="text-[#94A3B8]">/</span>}
          {item.path ? (
            <Link
              to={item.path}
              className="text-[#64748B] hover:text-[#2563EB] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#64748B]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
