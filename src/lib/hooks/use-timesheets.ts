'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  timesheetsService,
  type TimesheetWithDetails,
  type TimesheetFilters,
  type Timesheet,
} from '@/lib/services'

export function useContractorTimesheets(
  contractorId: string | undefined,
  filters?: TimesheetFilters
) {
  return useQuery<TimesheetWithDetails[]>({
    queryKey: ['timesheets', 'contractor', contractorId, filters],
    queryFn: () => timesheetsService.getContractorTimesheets(contractorId!, filters),
    enabled: !!contractorId,
  })
}

export function useCompanyTimesheets(
  companyId: string | undefined,
  filters?: TimesheetFilters
) {
  return useQuery<TimesheetWithDetails[]>({
    queryKey: ['timesheets', 'company', companyId, filters],
    queryFn: () => timesheetsService.getCompanyTimesheets(companyId!, filters),
    enabled: !!companyId,
  })
}

export function useTimesheet(timesheetId: string | undefined) {
  return useQuery<TimesheetWithDetails | null>({
    queryKey: ['timesheets', timesheetId],
    queryFn: () => timesheetsService.getTimesheet(timesheetId!),
    enabled: !!timesheetId,
  })
}

export function usePendingTimesheetCount(companyId: string | undefined) {
  return useQuery<number>({
    queryKey: ['timesheets', 'pending', companyId],
    queryFn: () => timesheetsService.getPendingCount(companyId!),
    enabled: !!companyId,
  })
}

export function useSubmitTimesheet() {
  const queryClient = useQueryClient()

  return useMutation<Timesheet, Error, string>({
    mutationFn: (timesheetId) => timesheetsService.submitTimesheet(timesheetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] })
    },
  })
}

export function useApproveTimesheet() {
  const queryClient = useQueryClient()

  return useMutation<
    Timesheet,
    Error,
    { timesheetId: string; approverId: string }
  >({
    mutationFn: ({ timesheetId, approverId }) =>
      timesheetsService.approveTimesheet(timesheetId, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] })
    },
  })
}

export function useRejectTimesheet() {
  const queryClient = useQueryClient()

  return useMutation<Timesheet, Error, string>({
    mutationFn: (timesheetId) => timesheetsService.rejectTimesheet(timesheetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] })
    },
  })
}

export function useSaveTimesheet() {
  const queryClient = useQueryClient()

  return useMutation<
    Timesheet,
    Error,
    {
      contractorId: string
      contractId: string
      weekStartDate: string
      weekEndDate: string
      mondayHours?: number
      tuesdayHours?: number
      wednesdayHours?: number
      thursdayHours?: number
      fridayHours?: number
      saturdayHours?: number
      sundayHours?: number
      taskDescription?: string
    }
  >({
    mutationFn: (timesheet) => timesheetsService.saveTimesheet(timesheet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] })
    },
  })
}
