import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { basketReducer, basketTotal, countItems } from '../basket/basketReducer.ts'
import type { BasketAction, BasketLine } from '../basket/basketReducer.ts'
import { snacksQuery } from '../data/snacksQuery.ts'

type BasketStore = {
  lines: BasketLine[]
  dispatch: (action: BasketAction) => void
}

// A ZUSTAND STORE: state that lives OUTSIDE React, in a module, with a hook
// to read it. No provider, no context. Any component can call
// useBasketStore(...) and will re-render only when the part it picked changes.
//
// The rules of the basket are still lesson 17's reducer: the store just
// keeps the lines and runs every action through it.
export const useBasketStore = create<BasketStore>()(
  // persist: save to localStorage and load on start. Replaces our own
  // useBasketState hook from lessons 18–19.
  persist(
    (set) => ({
      lines: [],
      dispatch: (action) => set((state) => ({ lines: basketReducer(state.lines, action) })),
    }),
    {
      name: 'snack-shelf-basket-store',
      partialize: (state) => ({ lines: state.lines }), // save the data, not the function
    },
  ),
)

// Small hooks for derived values. A SELECTOR (the function passed in)
// picks what a component needs; the component re-renders only when the
// selector's result changes. A number stays the same number, so a
// component reading the count doesn't re-render when quantities shuffle.
export function useBasketCount(): number {
  return useBasketStore((s) => countItems(s.lines))
}

export function useBasketTotal(): number {
  const lines = useBasketStore((s) => s.lines)
  const { data: snacks = [] } = useQuery(snacksQuery)
  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  return basketTotal(lines, prices)
}
