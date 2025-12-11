'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Users, Building2, FileText, Briefcase, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGlobalSearch } from '@/lib/hooks/use-superadmin-dashboard'
import Link from 'next/link'
import type { SearchResult } from '@/types/superadmin'

// Figma Design Tokens
const colors = {
  primary500: '#642DFC',
  primary100: '#E0D5FE',
  primary50: '#F6F2FF',
  neutral900: '#1B1D21',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3',
  neutral400: '#A8B5C2',
  neutral50: '#F4F7FA',
  border: '#DEE4EB',
  success600: '#22957F',
  warning600: '#CC7A00',
}

const typeIcons: Record<SearchResult['type'], React.ReactNode> = {
  employee: <Users className="h-4 w-4" style={{ color: colors.primary500 }} />,
  contractor: <Briefcase className="h-4 w-4" style={{ color: colors.warning600 }} />,
  company: <Building2 className="h-4 w-4" style={{ color: colors.success600 }} />,
  invoice: <FileText className="h-4 w-4" style={{ color: colors.neutral600 }} />,
  request: <FileText className="h-4 w-4" style={{ color: colors.neutral600 }} />,
}

const typeLabels: Record<SearchResult['type'], string> = {
  employee: 'Employee',
  contractor: 'Contractor',
  company: 'Company',
  invoice: 'Invoice',
  request: 'Request',
}

const filterOptions: { value: SearchResult['type'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'employee', label: 'Employees' },
  { value: 'contractor', label: 'Contractors' },
  { value: 'company', label: 'Companies' },
]

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<SearchResult['type'] | 'all'>('all')
  const { results, isSearching, search, clearResults } = useGlobalSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Handle search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => {
        const filter = activeFilter === 'all' ? undefined : { type: activeFilter }
        search(query, filter)
      }, 300)
    } else {
      clearResults()
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, activeFilter, search, clearResults])

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Cmd/Ctrl + K to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      // Escape to close
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClear = () => {
    setQuery('')
    clearResults()
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
          style={{ color: colors.neutral400 }}
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search employees, contractors, companies... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-11 rounded-xl border-2 focus:border-primary-500 transition-colors"
          style={{
            borderColor: isOpen ? colors.primary500 : colors.border,
            backgroundColor: colors.neutral50,
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" style={{ color: colors.neutral500 }} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border overflow-hidden z-50"
          style={{ backgroundColor: 'white', borderColor: colors.border }}
        >
          {/* Filter Tabs */}
          <div className="flex gap-1 p-2 border-b" style={{ borderColor: colors.border, backgroundColor: colors.neutral50 }}>
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: activeFilter === filter.value ? colors.primary500 : 'transparent',
                  color: activeFilter === filter.value ? 'white' : colors.neutral600,
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.primary500 }} />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.link}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary50 }}>
                      {typeIcons[result.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: colors.neutral900 }}>
                        {result.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: colors.neutral500 }}>
                        {result.subtitle}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: colors.neutral50, color: colors.neutral600 }}
                    >
                      {typeLabels[result.type]}
                    </span>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="py-8 text-center">
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                  No results found for "{query}"
                </p>
                <p className="text-xs mt-1" style={{ color: colors.neutral400 }}>
                  Try a different search term
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t text-xs" style={{ borderColor: colors.border, backgroundColor: colors.neutral50, color: colors.neutral500 }}>
            <span className="font-medium">Tip:</span> Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 mx-1">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-200 mx-1">K</kbd> to search anytime
          </div>
        </div>
      )}
    </div>
  )
}
