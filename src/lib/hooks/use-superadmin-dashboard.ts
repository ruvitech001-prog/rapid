'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { queryKeys } from '@/lib/queries/keys'
import { superadminDashboardService } from '@/lib/services/superadmin-dashboard.service'
import type { SearchResult } from '@/types/superadmin'

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.superadmin.dashboard(),
    queryFn: () => superadminDashboardService.getStats(),
    staleTime: 60000, // Data considered fresh for 1 minute
    refetchInterval: 60000, // Refresh every minute
  })
}

export function useSuperAdminCompanies() {
  return useQuery({
    queryKey: queryKeys.superadmin.companies.list(),
    queryFn: () => superadminDashboardService.getCompanies(),
    staleTime: 120000, // Data considered fresh for 2 minutes
  })
}

export interface WorkforceFilters {
  search?: string
  companyId?: string
  type?: 'employee' | 'contractor' | 'all'
}

export function useSuperAdminWorkforce(filters?: WorkforceFilters) {
  return useQuery({
    queryKey: [...queryKeys.superadmin.all, 'workforce', filters],
    queryFn: () => superadminDashboardService.getWorkforce(filters),
    staleTime: 60000, // Data considered fresh for 1 minute
  })
}

// Global search hook with debounce
export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const search = useCallback(async (
    query: string,
    filters?: { type?: 'employee' | 'contractor' | 'company' | 'invoice' | 'request' }
  ) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const searchResults = await superadminDashboardService.globalSearch(query, filters)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return { results, isSearching, search, clearResults }
}
