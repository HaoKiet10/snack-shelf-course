import type { ReactNode } from 'react'
import { basketTotal } from '../basket/basketReducer.ts'
import { useBasketState } from '../hooks/useBasketState.ts'
import { BasketContext } from './BasketContext.ts'
import { useQuery } from '@tanstack/react-query'
import { snacksQuery } from '../data/snacksQuery.ts'

// Owns the basket and shares it. It reads the snacks (from the query cache)
// to work out the total.
export default function BasketProvider({ children }: { children: ReactNode }) {
  const { lines, dispatch, count } = useBasketState()
  // useQuery, NOT the suspense version: the provider wraps the whole app,
  // and the basket must not hide everything while prices load. Same cache
  // entry as useSnacks(), so it's still one request.
  const { data: snacks = [] } = useQuery(snacksQuery)

  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  const total = basketTotal(lines, prices)

  return <BasketContext value={{ lines, count, total, dispatch }}>{children}</BasketContext>
}
