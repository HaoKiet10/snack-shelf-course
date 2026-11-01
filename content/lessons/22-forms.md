---
title: Forms
summary: A checkout form on the basket page, with validation, error messages, a pending state and an order confirmation. Uncontrolled fields read with FormData, React 19 form actions with useActionState, and useFormStatus.
minutes: 25
demo: 22-forms
---

The basket page has a checkout form now. Leave a field empty and you get a message under it, with what you typed still there. Fill it in and the button says **Placing order…**, then you get an order number and the basket empties.

## Controlled or uncontrolled

Lesson 8's search box is **controlled**: React state holds the value, and every keystroke goes through `onChange`. That is the right choice when something must react to every keystroke, like filtering.

A checkout form does not need that. Nothing happens until you press the button. Controlling all four fields would mean four pieces of state and four handlers for nothing. So most fields here are **uncontrolled**: the browser keeps their value, as plain HTML forms always have, and we read them all at once when the form is submitted.

```tsx
<input id="name" name="name" defaultValue={values.name} />
```

`defaultValue` (not `value`) sets the **starting** value only; after that the browser owns it. `name` is the key the value will be read back by.

The note *is* controlled, because its character counter needs every keystroke:

```tsx
const [note, setNote] = useState('')

<textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))} />
<p className="note-count">{note.length} / {NOTE_MAX}</p>
```

Mixing the two in one form is fine. Pick per field.

## A form action

In React 19, a `<form>`'s `action` can be a **function**:

```tsx
<form action={formAction}>
```

When the form is submitted, React calls it with a `FormData` object: all the fields, by `name`. No `e.preventDefault()`, no `onSubmit`. `useActionState` wraps the action and keeps what it returns as state:

```tsx
const [state, formAction, isPending] = useActionState(placeOrder, { values: EMPTY, errors: {} })
```

- `placeOrder` is your function. React calls it as `placeOrder(previousState, formData)`.
- `state` is whatever it returned last time (or the initial value).
- `formAction` goes on the form.
- `isPending` is `true` while it runs.

## The action

```tsx
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
```

It reads the fields, validates them, and either returns the errors or sends the order and returns the order number. `formData.get` returns `FormDataEntryValue | null`, so `String(… ?? '')` turns it into a plain string. `_prev` starts with an underscore to say "not used here".

`sendOrder` in `data/orders.ts` stands in for a real request: it waits 800ms and makes up an order number.

## Validation is a plain function

```ts
function validate(v: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (v.name.length < 2) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'That email address looks incomplete.'
  if (!PICKUP_TIMES.includes(v.pickup)) errors.pickup = 'Choose when to pick it up.'
  return errors
}
```

Values in, errors out, no React. `Partial<Record<keyof FormValues, string>>` means "an object that may have a message for any of the field names": `keyof FormValues` is `'name' | 'email' | 'pickup'`, and `Partial` makes every key optional.

The form has `noValidate`, which turns off the browser's own popups so our messages are the only ones. Browser validation (`required`, `type="email"`) is still a fine first line on simple forms; the server must always validate again anyway, because anyone can send it anything.

## Showing errors, keeping values

```tsx
<input
  id="email"
  name="email"
  type="email"
  defaultValue={values.email}
  aria-invalid={errors.email ? true : undefined}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
```

After an action runs, **React resets the form**, like a browser does after a classic submit. For uncontrolled fields that means going back to their `defaultValue`. So the action returns the submitted `values`, and each field uses them as its `defaultValue`: after a failed submit, the reset puts back what you typed. After a successful one, `values` is empty, so the form clears.

`aria-invalid` and `aria-describedby` tell screen readers the field has a problem and which text explains it. Every input also has a `<label htmlFor>`, which is what makes clicking the label focus the field, and what lets tests find fields by their label (lesson 24).

## Pending state: useFormStatus

```tsx
function SubmitButton({ total }: { total: number }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="submit" disabled={pending}>
      {pending ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
    </button>
  )
}
```

`useFormStatus` (from `react-dom`) reads the status of the form the component is **inside**, without any props. It only works in a component rendered within the `<form>`, not in the component that renders the form. Disabling the button while pending also stops double orders from impatient double-clicks.

`isPending` from `useActionState` gives the same information to the component that owns the form; here it shows the "Sending your order…" line.

## After the order

```tsx
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
```

The action emptied the basket with `dispatch`, a plain context call from lesson 19. The form disappears with an empty basket, except to show the confirmation.

## Check yourself

<details>
<summary>When would you make a field controlled instead of uncontrolled?</summary>

When something has to react to every change while typing, like a live filter or a character counter. If the value only matters on submit, uncontrolled with `FormData` is simpler.
</details>

<details>
<summary>What does <code>useActionState</code> give back?</summary>

The latest state returned by the action, a wrapped action to put on the form, and whether the action is currently running.
</details>

<details>
<summary>After a failed submit, why does the form still show what you typed?</summary>

React resets the form after the action, which returns fields to their `defaultValue`. The action returned the submitted values, and they are used as the defaults.
</details>

<details>
<summary>Why is <code>SubmitButton</code> its own component?</summary>

`useFormStatus` reads the form the component is rendered inside. It has to be called from a child of the `<form>`, not from the component that renders it.
</details>
