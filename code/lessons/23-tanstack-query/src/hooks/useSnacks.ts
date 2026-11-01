import { useQuery } from '@tanstack/react-query'
import { loadSnacks } from '../data/snacks.ts'

export type Status = 'loading' | 'ready' | 'error'

// TanStack Query does the loading now. We describe WHAT to fetch:
//   queryKey: a name for this data in the shared cache
//   queryFn:  how to get it (any function returning a Promise)
// and it handles loading/error state, retries, caching and refreshing.
//
// Every component that calls useSnacks() reads the SAME cached result,
// so the snacks are fetched once, no matter how many components ask.
export function useSnacks() {
  const query = useQuery({
    queryKey: ['snacks'],
    queryFn: loadSnacks,
  })

  // Keep the same shape the components already use.
  let status: Status = 'ready'
  if (query.isPending) status = 'loading'
  else if (query.isError) status = 'error'

  return {
    snacks: query.data ?? [],
    status,
    retry: () => void query.refetch(),
    // true during ANY fetch, including a background refresh of cached data
    isFetching: query.isFetching,
  }
}
