'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, toApiError } from '@/lib/api/errors'

export interface UseApiQueryOptions {
  enabled?: boolean
  pollInterval?: number
  onSuccess?: () => void
}

export interface UseApiQueryResult<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
  isRefetching: boolean
  refetch: () => Promise<void>
}

export function useApiQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
  const { enabled = true, pollInterval, onSuccess } = options
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const mountedRef = useRef(true)

  const refetch = useCallback(async () => {
    if (!enabled) return

    const isInitial = data === null && loading
    if (!isInitial) setIsRefetching(true)

    try {
      const result = await fetcher()
      if (!mountedRef.current) return
      setData(result)
      setError(null)
      onSuccess?.()
    } catch (err) {
      if (!mountedRef.current) return
      setError(toApiError(err))
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
      setIsRefetching(false)
    }
  }, [enabled, fetcher, data, loading, onSuccess])

  useEffect(() => {
    mountedRef.current = true
    if (enabled) {
      setLoading(true)
      refetch()
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  useEffect(() => {
    if (!pollInterval || !enabled) return
    const id = setInterval(refetch, pollInterval)
    return () => clearInterval(id)
  }, [pollInterval, enabled, refetch])

  return { data, error, loading, isRefetching, refetch }
}
