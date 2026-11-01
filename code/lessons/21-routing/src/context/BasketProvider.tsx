import type { ReactNode } from 'react'
import { basketTotal } from '../basket/basketReducer.ts'
import { useBasketState } from '../hooks/useBasketState.ts'
import { BasketContext } from './BasketContext.ts'
import { useSnackData } from './SnacksContext.ts'

// Owns the basket and shares it. It READS another context (the snacks)
// to work out the total, so it must sit inside <SnacksProvider>.
export default function BasketProvider({ children }: { children: ReactNode }) {
  const { lines, dispatch, count } = useBasketState()
  const { snacks } = useSnackData()

  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  const total = basketTotal(lines, prices)

  return <BasketContext value={{ lines, count, total, dispatch }}>{children}</BasketContext>
}
