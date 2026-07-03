import { Search, Filter, ChevronDown } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface FilterField {
  key: string
  label: string
  type: 'select' | 'input'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterBarProps {
  searchPlaceholder?: string
  filters?: FilterField[]
  onSearchChange: (value: string) => void
  onFilterChange: (key: string, value: string) => void
  showFilters?: boolean
  onToggleFilters?: () => void
}

export default function FilterBar({
  searchPlaceholder = 'Search...',
  filters = [],
  onSearchChange,
  onFilterChange,
  showFilters = false,
  onToggleFilters,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {filters.length > 0 && (
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
              {filter.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                >
                  <option value="">All</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#2563EB focus:border-transparent outline-none"
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
