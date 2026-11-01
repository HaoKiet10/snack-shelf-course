// A REDUCER: a plain function (state, action) => new state.
// Every way the basket can change is listed here, in one place.
// No React in this file at all, which also makes it easy to test.

export type BasketLine = {
  id: string   // which snack
  qty: number  // how many
}

// An ACTION describes WHAT HAPPENED. `type` says which kind of event;
// the other fields carry what that event needs. TypeScript checks each one.
export type BasketAction =
  | { type: 'added'; id: string }
  | { type: 'quantityChanged'; id: string; qty: number }
  | { type: 'removedOne'; id: string }
  | { type: 'removed'; id: string }
  | { type: 'emptied' }

export const MAX_QTY = 9

export function basketReducer(lines: BasketLine[], action: BasketAction): BasketLine[] {
  switch (action.type) {
    case 'added': {
      const existing = lines.find((l) => l.id === action.id)
      if (!existing) {
        return [...lines, { id: action.id, qty: 1 }]
      }
      return lines.map((l) =>
        l.id === action.id ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l,
      )
    }
    case 'quantityChanged': {
      if (action.qty <= 0) {
        return lines.filter((l) => l.id !== action.id)
      }
      return lines.map((l) =>
        l.id === action.id ? { ...l, qty: Math.min(action.qty, MAX_QTY) } : l,
      )
    }
    case 'removedOne':
      return lines
        .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    case 'removed':
      return lines.filter((l) => l.id !== action.id)
    case 'emptied':
      return []
  }
}

// Small helpers that DERIVE numbers from the lines.
export function countItems(lines: BasketLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0)
}

export function basketTotal(lines: BasketLine[], prices: Record<string, number>): number {
  return lines.reduce((sum, l) => sum + l.qty * (prices[l.id] ?? 0), 0)
}
