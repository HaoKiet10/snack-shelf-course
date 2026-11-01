## Q
When should a form field be **controlled**?

- [ ] Only for checkboxes
- [x] When something must react to every keystroke, like a live counter or filter
- [ ] Always
- [ ] Never in React 19

> If the value only matters on submit, an uncontrolled field read with `FormData` is simpler.

## Q
What does `defaultValue` do on an input?

- [ ] Makes it controlled
- [x] Sets its starting value; after that the browser owns the value
- [ ] Shows a placeholder
- [ ] Resets it on every render

> `value` makes React own it; `defaultValue` only sets where it starts.

## Q
`const [state, formAction, isPending] = useActionState(placeOrder, initial)`. What is `state`?

- [ ] `true` while submitting
- [x] Whatever `placeOrder` returned last time (or `initial` before the first submit)
- [ ] The FormData object
- [ ] The form's current field values

> The action's return value becomes the state, which is how errors and the order number reach the screen.

## Q
Why is `SubmitButton` its own component?

- [ ] To make it reusable in other apps
- [ ] To avoid re-rendering the form
- [x] `useFormStatus` reads the form it is rendered inside, so it must be called from a child of the `<form>`
- [ ] Buttons must be separate components

> Called in the component that renders the form, `useFormStatus` wouldn't be inside that form.

## Q
After a failed submit, why are the typed values still there?

- [ ] `noValidate` keeps them
- [ ] Uncontrolled inputs never reset
- [ ] The browser remembers them
- [x] React resets the form after the action, and the action returned the submitted values, which the fields use as `defaultValue`

> On success the action returns empty values, so the same reset clears the form.

## Exercise: A phone number
Add an optional phone field to the checkout. If something is typed, it must contain only digits, spaces and `+`, and have at least 8 digits; show an error otherwise.

### Hint
Add `phone` to `FormValues`, read it from `formData`, and add a rule to `validate`. Count digits with `.replace(/\D/g, '').length`.

### Solution
```ts
type FormValues = { name: string; email: string; pickup: string; phone: string }

// in placeOrder:
phone: String(formData.get('phone') ?? '').trim(),

// in validate:
if (v.phone !== '' && (!/^[\d +]+$/.test(v.phone) || v.phone.replace(/\D/g, '').length < 8)) {
  errors.phone = 'Use digits, spaces and +, at least 8 digits.'
}
```

```tsx
<label htmlFor="phone">Phone (optional)</label>
<input
  id="phone"
  name="phone"
  type="tel"
  autoComplete="tel"
  defaultValue={values.phone}
  aria-invalid={errors.phone ? true : undefined}
  aria-describedby={errors.phone ? 'phone-error' : undefined}
/>
{errors.phone && <p className="field-error" id="phone-error">{errors.phone}</p>}
```

Remember to add `phone: ''` to `EMPTY`.
