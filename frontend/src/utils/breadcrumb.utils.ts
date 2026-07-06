export interface BreadcrumbItem {
  label: string
  path?: string
}

const ROUTE_LABELS: { prefix: string; label: string }[] = [
  { prefix: '/enquiries', label: 'Enquiries' },
  { prefix: '/blogs', label: 'Blogs' },
  { prefix: '/careers', label: 'Careers' },
  { prefix: '/applicants', label: 'Applicants' },
  { prefix: '/gallery', label: 'Gallery' },
  { prefix: '/case-studies', label: 'Case Studies' },
  { prefix: '/users', label: 'Users' },
  { prefix: '/settings', label: 'Settings' },
  { prefix: '/reports', label: 'Reports' },
]

export function getBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] | null {
  if (pathname === '/dashboard' || pathname === '/') {
    return null
  }

  const match = ROUTE_LABELS.find((route) => pathname.startsWith(route.prefix))
  if (!match) {
    return null
  }

  return [
    { label: 'Home', path: '/dashboard' },
    { label: match.label },
  ]
}
