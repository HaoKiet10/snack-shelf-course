import { createContext, useContext } from 'react'
import type { ActionDispatch } from 'react'
import type { BasketAction, BasketLine } from '../basket/basketReducer.ts'

export type BasketValue = {
  lines: BasketLine[]
  count: number
  total: number
  dispatch: ActionDispatch<[BasketAction]>
}

export const BasketContext = createContext<BasketValue | null>(null)

export function useBasket(): BasketValue {
  const value = useContext(BasketContext)
  if (value === null) {
    throw new Error('useBasket() must be used inside <BasketProvider>')
  }
  return value
}
