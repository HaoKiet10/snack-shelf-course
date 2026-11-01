import type { ReactNode } from 'react'
import { basketTotal } from '../basket/basketReducer.ts'
import { useBasketState } from '../hooks/useBasketState.ts'
import { BasketContext } from './BasketContext.ts'
import { useSnacks } from '../hooks/useSnacks.ts'

// Owns the basket and shares it. It reads the snacks (from the query cache)
// to work out the total.
export default function BasketProvider({ children }: { children: ReactNode }) {
  const { lines, dispatch, count } = useBasketState()
  const { snacks } = useSnacks()

  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  const total = basketTotal(lines, prices)

  return <BasketContext value={{ lines, count, total, dispatch }}>{children}</BasketContext>
}
