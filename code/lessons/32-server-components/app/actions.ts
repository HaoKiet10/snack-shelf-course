'use server'
// ↑ Every function exported from this file is a SERVER FUNCTION (a "server
// action" when a form uses it). The code stays on the server; the browser
// gets a reference it can call, and Next turns the call into a request.

import { getSnack } from '../lib/snacks'

export type OrderState = {
  error?: string
  orderNo?: string
}

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const snackId = String(formData.get('snackId') ?? '')
  const qty = Number(formData.get('qty'))

  // Validate HERE, on the server. The browser can send anything.
  const snack = await getSnack(snackId)
  if (!snack) return { error: 'That snack no longer exists.' }
  if (!Number.isInteger(qty) || qty < 1 || qty > 9) return { error: 'Choose between 1 and 9.' }

  // A real app would write to a database here.
  console.log(`[server] order: ${qty} × ${snack.name}`)
  return { orderNo: `YS-${String(Date.now()).slice(-5)}-${qty}` }
}
