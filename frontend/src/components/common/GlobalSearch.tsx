import { useState, useEffect } from 'react'
import { Search, X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  id: number
  type: 'enquiry' | 'blog' | 'career' | 'applicant' | 'gallery' | 'case-study'
  title: string
  subtitle: string
  url: string
  status?: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    // Simulate search across all modules
    // In production, this would call a unified search API
    const mockResults: SearchResult[] = [
      {
        id: 1,
        type: 'enquiry' as const,
        title: 'Office Building Project',
        subtitle: 'John Doe - john@example.com',
        url: '/enquiries/1/edit',
        status: 'new',
      },
      {
        id: 2,
        type: 'blog' as const,
        title: 'Modern Construction Techniques',
        subtitle: 'Published - Engineering',
        url: '/blogs/1/edit',
        status: 'published',
      },
      {
        id: 3,
        type: 'career' as const,
        title: 'Senior Structural Engineer',
        subtitle: 'Full Time - New York',
        url: '/careers/1/edit',
        status: 'open',
      },
    ].filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(mockResults)
    setLoading(false)
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      enquiry: 'Enquiry',
      blog: 'Blog',
      career: 'Career',
      applicant: 'Applicant',
      gallery: 'Gallery',
      'case-study': 'Case Study',
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      enquiry: 'bg-blue-100 text-blue-800',
      blog: 'bg-purple-100 text-purple-800',
      career: 'bg-green-100 text-green-800',
      applicant: 'bg-orange-100 text-orange-800',
      gallery: 'bg-pink-100 text-pink-800',
      'case-study': 'bg-teal-100 text-teal-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enquiries, blogs, careers, applicants..."
            className="flex-1 text-lg outline-none"
            autoFocus
            autoComplete="off"
          />
          <button
            onClick={() => {
              setIsOpen(false)
              setQuery('')
              setResults([])
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-pulse">Searching...</div>
            </div>
          ) : query.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Search across all modules</p>
              <p className="text-sm mt-1">Type at least 2 characters to start searching</p>
              <p className="text-xs mt-4 text-gray-400">Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{result.title}</div>
                    <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                  </div>
                  {result.status && (
                    <span className="text-xs text-gray-400 capitalize">{result.status}</span>
                  )}
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Results: {results.length}</span>
            <span>Type to search</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
