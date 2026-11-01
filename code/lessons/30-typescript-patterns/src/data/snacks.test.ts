import { describe, expect, it } from 'vitest'
import { isSnack } from './snacks.ts'

describe('isSnack', () => {
  const pocky = { id: 'pocky', name: 'Pocky', price: 2.5, emoji: '🍫', about: 'Sticks.' }

  it('accepts a complete snack', () => {
    expect(isSnack(pocky)).toBe(true)
  })

  it('rejects a snack with a missing or wrong field', () => {
    expect(isSnack({ ...pocky, price: undefined })).toBe(false)
    expect(isSnack({ ...pocky, price: '2.50' })).toBe(false)
  })

  it('rejects things that are not objects', () => {
    expect(isSnack(null)).toBe(false)
    expect(isSnack('pocky')).toBe(false)
  })
})
