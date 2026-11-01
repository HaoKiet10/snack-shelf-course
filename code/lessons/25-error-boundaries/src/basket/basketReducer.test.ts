import { describe, expect, it } from 'vitest'
import { basketReducer, basketTotal, countItems, MAX_QTY } from './basketReducer.ts'
import type { BasketLine } from './basketReducer.ts'

// The reducer is a plain function, so testing it is just:
// call it with some state and an action, check what comes back.
describe('basketReducer', () => {
  it('adds a new snack with quantity 1', () => {
    const next = basketReducer([], { type: 'added', id: 'pocky' })
    expect(next).toEqual([{ id: 'pocky', qty: 1 }])
  })

  it('adds 1 to a snack that is already in the basket', () => {
    const next = basketReducer([{ id: 'pocky', qty: 2 }], { type: 'added', id: 'pocky' })
    expect(next).toEqual([{ id: 'pocky', qty: 3 }])
  })

  it(`never goes above ${MAX_QTY}`, () => {
    const next = basketReducer([{ id: 'pocky', qty: MAX_QTY }], { type: 'added', id: 'pocky' })
    expect(next[0].qty).toBe(MAX_QTY)
  })

  it('removes a line when its quantity drops to 0', () => {
    const lines: BasketLine[] = [
      { id: 'pocky', qty: 1 },
      { id: 'ramune', qty: 2 },
    ]
    const next = basketReducer(lines, { type: 'quantityChanged', id: 'pocky', qty: 0 })
    expect(next).toEqual([{ id: 'ramune', qty: 2 }])
  })

  it('empties the basket', () => {
    expect(basketReducer([{ id: 'pocky', qty: 1 }], { type: 'emptied' })).toEqual([])
  })

  it('never changes the old state', () => {
    const before: BasketLine[] = [{ id: 'pocky', qty: 1 }]
    const after = basketReducer(before, { type: 'added', id: 'pocky' })
    expect(before).toEqual([{ id: 'pocky', qty: 1 }]) // untouched
    expect(after).not.toBe(before)                    // a new array
  })
})

describe('countItems and basketTotal', () => {
  const lines: BasketLine[] = [
    { id: 'pocky', qty: 2 },
    { id: 'ramune', qty: 1 },
  ]

  it('counts every item, not every line', () => {
    expect(countItems(lines)).toBe(3)
  })

  it('adds up price × quantity', () => {
    expect(basketTotal(lines, { pocky: 2.5, ramune: 1.5 })).toBeCloseTo(6.5)
  })
})
