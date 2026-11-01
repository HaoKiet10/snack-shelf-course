## Q
What does a reducer take and return?

- [ ] Props, and returns state
- [ ] An event, and returns JSX
- [ ] The DOM, and returns nothing
- [x] The current state and an action, and returns the next state

> `(state, action) => newState`. That's the whole interface.

## Q
Which is **not** allowed inside a reducer?

- [x] Calling `fetch` to save the basket
- [ ] A `switch` on `action.type`
- [ ] Returning the old state unchanged
- [ ] Returning a new array built with `map`

> Reducers must be pure: no side effects, no changing the old state. Fetching belongs in an event handler or effect.

## Q
What does `dispatch({ type: 'emptied' })` do?

- [x] Sends the action to React, which runs the reducer with the current state and stores the result
- [ ] Empties the basket directly
- [ ] Calls every component's reducer
- [ ] Deletes the reducer

> Components describe what happened; the reducer decides what it means.

## Q
```ts
type BasketAction =
  | { type: 'added'; id: string }
  | { type: 'emptied' }
```
Which is a type error?

- [ ] `{ type: 'added', id: 'pocky' }`
- [ ] `{ type: 'emptied' }`
- [x] `{ type: 'added' }`
- [ ] All are fine

> TypeScript uses `type` to know which shape applies. `added` needs an `id`.

## Q
When is `useReducer` a better fit than `useState`?

- [x] When state changes in several ways with rules, like a basket with add, remove, change quantity and empty
- [ ] For a single text input
- [ ] Always
- [ ] Only when the state is a number

> A reducer puts every kind of change in one tested place. For a value that only gets "set to this", `useState` is simpler.

## Exercise: A "set quantity" input
In the basket panel, replace the − and + buttons with a number input (1–9) for the quantity, using the existing `quantityChanged` action.

### Hint
`e.target.valueAsNumber` gives a number from `<input type="number">`. The reducer already removes lines at 0 and caps at the maximum.

### Solution
```tsx
<input
  type="number"
  min={1}
  max={MAX_QTY}
  value={line.qty}
  aria-label={`Quantity of ${snack.name}`}
  onChange={(e) => {
    const qty = e.target.valueAsNumber
    if (!Number.isNaN(qty)) dispatch({ type: 'quantityChanged', id: line.id, qty })
  }}
/>
```

No reducer change was needed: the rules were already in one place.
