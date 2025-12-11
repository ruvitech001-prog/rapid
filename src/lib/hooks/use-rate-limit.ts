'use client'

import { useRef, useCallback, useState } from 'react'

interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  maxAttempts?: number // Max attempts in the window
}

interface RateLimitState {
  attempts: number[]
  lastAttempt: number
}

/**
 * Hook to rate limit function calls
 * Prevents rapid-fire mutations by tracking attempts within a time window
 */
export function useRateLimit(options: RateLimitOptions = {}) {
  const { windowMs = 2000, maxAttempts = 1 } = options
  const stateRef = useRef<RateLimitState>({ attempts: [], lastAttempt: 0 })

  const checkLimit = useCallback((): boolean => {
    const now = Date.now()
    const state = stateRef.current

    // Create new array instead of mutating - prevents race condition
    const validAttempts = state.attempts.filter((time) => now - time < windowMs)
    state.attempts = validAttempts

    // Check if we're at the limit
    if (validAttempts.length >= maxAttempts) {
      return false // Rate limited
    }

    // Record this attempt
    state.attempts = [...validAttempts, now]
    state.lastAttempt = now
    return true // Allowed
  }, [windowMs, maxAttempts])

  const reset = useCallback(() => {
    stateRef.current = { attempts: [], lastAttempt: 0 }
  }, [])

  const getRemainingTime = useCallback((): number => {
    const state = stateRef.current
    // Guard against empty array - Math.min() returns Infinity for empty arrays
    if (state.attempts.length === 0) return 0

    const oldestAttempt = Math.min(...state.attempts)
    const timeUntilReset = oldestAttempt + windowMs - Date.now()
    return Math.max(0, timeUntilReset)
  }, [windowMs])

  return {
    checkLimit,
    reset,
    getRemainingTime,
  }
}

/**
 * Wrapper for mutations that adds rate limiting
 * Returns a wrapped mutation function that respects rate limits
 * Uses useState for reactive state updates
 */
export function useRateLimitedMutation<T extends (...args: Parameters<T>) => ReturnType<T>>(
  mutationFn: T,
  options: RateLimitOptions = {}
): {
  mutate: T
  isRateLimited: boolean
  remainingTime: number
} {
  const { checkLimit, getRemainingTime } = useRateLimit(options)
  // Use useState for reactive state instead of useRef
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  const wrappedMutate = useCallback(
    ((...args: Parameters<T>) => {
      if (!checkLimit()) {
        setIsRateLimited(true)
        setRemainingTime(getRemainingTime())
        console.warn('Rate limited: Please wait before trying again')
        return
      }
      setIsRateLimited(false)
      setRemainingTime(0)
      return mutationFn(...args)
    }) as T,
    [mutationFn, checkLimit, getRemainingTime]
  )

  return {
    mutate: wrappedMutate,
    isRateLimited,
    remainingTime,
  }
}
