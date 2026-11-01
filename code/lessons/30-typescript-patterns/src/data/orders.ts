import type { BasketLine } from '../basket/basketReducer.ts'

export type Order = {
  name: string
  email: string
  pickup: string
  note: string
  lines: BasketLine[]
  total: number
}

// Stands in for a real "POST /orders" request: waits a moment, then
// answers with an order number. A real app would send `order` to a server.
export async function sendOrder(order: Order): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const items = order.lines.reduce((n, l) => n + l.qty, 0)
  return `YS-${String(Date.now()).slice(-5)}-${items}`
}
