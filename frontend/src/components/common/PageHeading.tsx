import { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getBreadcrumbsFromPath } from '../../utils/breadcrumb.utils'

interface PageHeadingProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function PageHeading({ title, description, action }: PageHeadingProps) {
  const location = useLocation()
  const breadcrumbs = useMemo(() => getBreadcrumbsFromPath(location.pathname), [location.pathname])

  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-2 text-[13px] font-medium text-[#64748B]"
        >
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#94A3B8]">/</span>}
              {item.path ? (
                <Link to={item.path} className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#64748B]">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-[#0F172A]" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 mt-1 text-sm lg:text-base" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
