import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

interface TableSortProps {
  column: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc' | null
  onSort: (column: string) => void
  children: React.ReactNode
}

export default function TableSort({ column, sortColumn, sortDirection, onSort, children }: TableSortProps) {
  const isActive = sortColumn === column
  const icon = isActive ? (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />) : <ArrowUpDown className="w-4 h-4" />

  return (
    <button
      onClick={() => onSort(column)}
      className={`flex items-center gap-1 hover:text-[#2563EB] transition-colors ${isActive ? 'text-[#2563EB]' : ''}`}
    >
      {children}
      {icon}
    </button>
  )
}
