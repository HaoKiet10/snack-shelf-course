import { queryOptions } from '@tanstack/react-query'
import { loadSnacks } from './snacks.ts'

// The snacks query, described ONCE. Every place that needs the snacks uses
// this object, so the key and the function can never drift apart.
export const snacksQuery = queryOptions({
  queryKey: ['snacks'],
  queryFn: loadSnacks,
})
