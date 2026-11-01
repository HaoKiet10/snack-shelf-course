import { useEffect, useReducer } from 'react'
import { basketReducer, countItems } from '../basket/basketReducer.ts'
import type { BasketLine } from '../basket/basketReducer.ts'

const BASKET_KEY = 'snack-shelf-basket'

function readSavedBasket(key: string): BasketLine[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as BasketLine[]
  } catch {
    return []
  }
}

// The basket reducer, plus saving. useReducer's THIRD argument is an init
// function: React calls readSavedBasket(BASKET_KEY) once, for the first state.
export function useBasketState() {
  const [lines, dispatch] = useReducer(basketReducer, BASKET_KEY, readSavedBasket)

  useEffect(() => {
    try {
      localStorage.setItem(BASKET_KEY, JSON.stringify(lines))
    } catch {
      // not saved, still works
    }
  }, [lines])

  return { lines, dispatch, count: countItems(lines) }
}
