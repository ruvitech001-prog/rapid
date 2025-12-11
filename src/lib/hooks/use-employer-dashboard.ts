'use client'

import { useQuery } from '@tanstack/react-query'
import {
  dashboardService,
  type TeamHeadcount,
  type ProbationEmployee,
  type Celebration,
  type JoiningEmployee,
  type SetupStatus,
} from '@/lib/services/dashboard.service'

/**
 * Get team headcount breakdown by department
 */
export function useTeamHeadcount(companyId: string | undefined) {
  return useQuery<TeamHeadcount[]>({
    queryKey: ['employer', 'dashboard', 'teamHeadcount', companyId],
    queryFn: () => dashboardService.getTeamHeadcount(companyId!),
    enabled: !!companyId,
    staleTime: 30000,
  })
}

/**
 * Get employees with probation ending soon
 */
export function useProbationEnding(companyId: string | undefined, daysAhead: number = 7) {
  return useQuery<ProbationEmployee[]>({
    queryKey: ['employer', 'dashboard', 'probationEnding', companyId, daysAhead],
    queryFn: () => dashboardService.getProbationEndingSoon(companyId!, daysAhead),
    enabled: !!companyId,
    staleTime: 30000,
  })
}

/**
 * Get upcoming birthdays and work anniversaries
 */
export function useUpcomingCelebrations(companyId: string | undefined, daysAhead: number = 30) {
  return useQuery<Celebration[]>({
    queryKey: ['employer', 'dashboard', 'celebrations', companyId, daysAhead],
    queryFn: () => dashboardService.getUpcomingCelebrations(companyId!, daysAhead),
    enabled: !!companyId,
    staleTime: 30000,
  })
}

/**
 * Get employees joining this month with details
 */
export function useJoiningThisMonth(companyId: string | undefined) {
  return useQuery<JoiningEmployee[]>({
    queryKey: ['employer', 'dashboard', 'joiningThisMonth', companyId],
    queryFn: () => dashboardService.getJoiningThisMonth(companyId!),
    enabled: !!companyId,
    staleTime: 30000,
  })
}

/**
 * Get company setup status for first-time experience
 */
export function useCompanySetupStatus(companyId: string | undefined) {
  return useQuery<SetupStatus>({
    queryKey: ['employer', 'dashboard', 'setupStatus', companyId],
    queryFn: () => dashboardService.getCompanySetupStatus(companyId!),
    enabled: !!companyId,
    staleTime: 60000, // Cache for longer as this changes less frequently
  })
}

/**
 * Get cost overview with configurable period
 */
export function useCostOverviewPeriod(
  companyId: string | undefined,
  months: 3 | 6 | 12 = 6
) {
  return useQuery<{ month: string; cost: number }[]>({
    queryKey: ['employer', 'dashboard', 'costOverview', companyId, months],
    queryFn: () => dashboardService.getCostOverviewByPeriod(companyId!, months),
    enabled: !!companyId,
    staleTime: 30000,
  })
}
