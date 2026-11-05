import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useBasketStore, useBasketTotal } from '../store/basketStore.ts'
import { sendOrder } from '../data/orders.ts'
import Panel from './Panel.tsx'
import './CheckoutForm.css'

const NOTE_MAX = 100

type FormValues = {
  name: string
  email: string
  pickup: string
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

// What the action returns, and so what the form shows next.
type CheckoutState = {
  values: FormValues    // what was typed, so a failed submit doesn't wipe it
  errors: FieldErrors
  orderNo?: string      // set once an order went through
  customer?: string
}

const EMPTY: FormValues = { name: '', email: '', pickup: '' }

const PICKUP_TIMES = ['Today, 5 pm', 'Tomorrow, 10 am', 'Tomorrow, 5 pm']

// Plain function: values in, errors out. No React.
function validate(v: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (v.name.length < 2) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'That email address looks incomplete.'
  if (!PICKUP_TIMES.includes(v.pickup)) errors.pickup = 'Choose when to pick it up.'
  return errors
}

export default function CheckoutForm() {
  const lines = useBasketStore((s) => s.lines)
  const dispatch = useBasketStore((s) => s.dispatch)
  const total = useBasketTotal()

  // The note is CONTROLLED (state), because the counter needs every keystroke.
  // The other fields are UNCONTROLLED: the browser keeps their values, and we
  // read them all at once from FormData when the form is submitted.
  const [note, setNote] = useState('')

  // The ACTION: React calls it with the previous state and the form's data
  // when the form is submitted. Whatever it returns becomes the new state.
  async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
    const values: FormValues = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      pickup: String(formData.get('pickup') ?? ''),
    }
    const errors = validate(values)
    if (Object.keys(errors).length > 0) {
      return { values, errors }
    }
    const orderNo = await sendOrder({ ...values, note, lines, total })
    dispatch({ type: 'emptied' })
    setNote('')
    return { values: EMPTY, errors: {}, orderNo, customer: values.name }
  }

  // state: the latest returned value. formAction: goes on <form action>.
  // isPending: true while placeOrder is running.
  const [state, formAction, isPending] = useActionState(placeOrder, { values: EMPTY, errors: {} })

  if (state.orderNo) {
    return (
      <Panel title="Order placed">
        Thanks, {state.customer}! Your order number is <strong>{state.orderNo}</strong>.
      </Panel>
    )
  }
  if (lines.length === 0) {
    return null
  }

  const { errors, values } = state

  return (
    // noValidate: skip the browser's own popups, we show our own messages.
    <form className="checkout" action={formAction} noValidate>
      <h2>Checkout</h2>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"            // the key in FormData
        autoComplete="name"
        defaultValue={values.name}  // uncontrolled: a STARTING value only
        aria-invalid={errors.name ? true : undefined}
        aria-describedby={errors.name ? 'name-error' : undefined}
      />
      {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}

      <label htmlFor="pickup">Pick-up time</label>
      <select
        id="pickup"
        name="pickup"
        defaultValue={values.pickup}
        aria-invalid={errors.pickup ? true : undefined}
        aria-describedby={errors.pickup ? 'pickup-error' : undefined}
      >
        <option value="">Choose…</option>
        {PICKUP_TIMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {errors.pickup && <p className="field-error" id="pickup-error">{errors.pickup}</p>}

      <label htmlFor="note">Note (optional)</label>
      <textarea
        id="note"
        name="note"
        rows={2}
        value={note}                                        // controlled
        onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
      />
      <p className="note-count">
        {note.length} / {NOTE_MAX}
      </p>

      <SubmitButton total={total} />
      {isPending && <p className="sending" role="status">Sending your order…</p>}
    </form>
  )
}

// useFormStatus reads the status of the <form> this component is INSIDE,
// without any props. It must be called from a child of the form.
function SubmitButton({ total }: { total: number }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="submit" disabled={pending}>
      {pending ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
    </button>
  )
}
