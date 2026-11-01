import { useSuspenseQuery } from '@tanstack/react-query'
import { snacksQuery } from '../data/snacksQuery.ts'

// useSuspenseQuery never returns "loading" or "error":
//   - while loading, it SUSPENDS: React shows the nearest <Suspense> fallback
//   - if it fails, it THROWS: the nearest error boundary catches it
// So when this line returns, the snacks are there. Always.
export function useSnacks() {
  const { data } = useSuspenseQuery(snacksQuery)
  return { snacks: data }
}
