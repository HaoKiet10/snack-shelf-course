'use client'

import { useActionState } from 'react'
import { placeOrder } from '../app/actions'
import type { OrderState } from '../app/actions'

// Lesson 22's useActionState, but the action runs ON THE SERVER.
// The form even works before this component's JavaScript has loaded:
// it posts like a plain HTML form, and Next runs placeOrder.
export default function OrderForm({ snackId, snackName }: { snackId: string; snackName: string }) {
  const [state, formAction, isPending] = useActionState<OrderState, FormData>(placeOrder, {})

  if (state.orderNo) {
    return <p className="done">Ordered! Your order number is {state.orderNo}.</p>
  }

  return (
    <form action={formAction} className="order">
      <input type="hidden" name="snackId" value={snackId} />
      <label htmlFor="qty">How many {snackName}?</label>
      <input id="qty" name="qty" type="number" min={1} max={9} defaultValue={1} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Ordering…' : 'Order for pick-up'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  )
}
