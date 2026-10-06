import { useEffect, useState } from 'react'
import { getErrorMessage } from '@/services/api'

interface FetchState<T> {
  source: (() => Promise<T>) | null
  data?: T
  error?: string
}

/**
 * Runs `fetcher` whenever its identity changes, so wrap it in `useCallback` with the
 * values it depends on. Results from a previous fetcher are never returned.
 */
export function useFetch<T>(fetcher: (() => Promise<T>) | null) {
  const [state, setState] = useState<FetchState<T>>({ source: null })

  useEffect(() => {
    if (!fetcher) return
    let active = true
    fetcher().then(
      (data) => active && setState({ source: fetcher, data }),
      (error: unknown) => active && setState({ source: fetcher, error: getErrorMessage(error) }),
    )
    return () => {
      active = false
    }
  }, [fetcher])

  const isCurrent = fetcher !== null && state.source === fetcher
  return {
    data: isCurrent ? state.data : undefined,
    error: isCurrent ? state.error : undefined,
    loading: fetcher !== null && !isCurrent,
  }
}
