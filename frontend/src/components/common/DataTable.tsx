import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS } from './tableStyles'

interface Column<T> {
  key: keyof T | string
  header: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  headerClassName?: string
  cellClassName?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  headerClassName = TABLE_HEADER_CELL_CLASS,
  cellClassName = 'px-4 py-3 text-base font-medium text-[#1E293B] leading-6 align-middle',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={TABLE_HEAD_CLASS}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`${headerClassName} ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                <td colSpan={columns.length} className={cellClassName}>
                  <div className="animate-pulse h-4 bg-gray-200 rounded" />
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={`${cellClassName} py-12 text-center`}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`${cellClassName} ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row, index)
                      : String(row[column.key as keyof T] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === i + 1 ? 'bg-[#2563EB] text-white' : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
