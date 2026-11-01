---
title: useReducer
summary: A real basket with quantities, plus and minus, remove and empty. When state can change in many ways, a reducer puts every way in one function that is easy to read and easy to test.
minutes: 20
demo: 17-use-reducer
---

The basket is a panel now. Pocky twice is one line with a quantity of 2. You can change quantities, remove a line or empty the basket.

## The problem with many setters

With `useState`, each change is written where it happens. For this basket that would mean four handlers in App, each with its own copying logic (lesson 11), and soon more: a maximum quantity, a "remove when it reaches 0" rule. The rules of the basket would be spread across the component.

A **reducer** gathers them in one place:

```diagram
event handler                 reducer                          React
dispatch({ type: 'added' })  → (lines, action) => new lines  → re-render with new lines
"what happened"                "what that means for the state"
```

## Actions describe what happened

```ts
export type BasketAction =
  | { type: 'added'; id: string }
  | { type: 'quantityChanged'; id: string; qty: number }
  | { type: 'removed'; id: string }
  | { type: 'emptied' }
```

An action is a plain object. `type` says which event it is, and the other fields carry what that event needs. The `|` makes this a **discriminated union**: TypeScript looks at `type` and knows which other fields exist. `{ type: 'emptied', id: 'x' }` or `{ type: 'removed' }` with no id are type errors.

Name actions after **what happened** (`added`, `emptied`), not what to do (`setLines`). The component reports events; the reducer decides what they mean.

## The reducer

```ts
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
    case 'removed':
      return lines.filter((l) => l.id !== action.id)
    case 'emptied':
      return []
  }
}
```

Three things make it a reducer:

1. **It takes the current state and an action, and returns the next state.** That is the whole interface.
2. **It is pure.** Same inputs, same output. No fetching, no `localStorage`, no random numbers, no changing `lines` in place. It builds new arrays with `map`, `filter` and spread, exactly like lesson 11's table.
3. **It has no React in it.** It lives in its own file, `basket/basketReducer.ts`, and could run anywhere. Lesson 24 tests it with plain function calls.

Inside `case 'added'`, TypeScript knows `action` has an `id`, because it narrowed the union by `type`. And since every case returns, TypeScript checks you have handled them all.

The lines are now `{ id, qty }` objects instead of lesson 11's list of ids. Two small helpers derive numbers from them:

```ts
export function countItems(lines: BasketLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0)
}
```

## Using it

```tsx
const [basket, dispatch] = useReducer(basketReducer, [])
```

Like `useState`, it returns a pair: the current state and a function to change it. The difference is the function. `dispatch` takes an **action**, and React runs it through your reducer to get the next state.

```tsx
<button onClick={() => dispatch({ type: 'emptied' })}>Empty the basket</button>
<button onClick={() => dispatch({ type: 'removed', id: line.id })}>✕</button>
```

The buttons say what happened, in one line each. All the "how" is in the reducer.

## useState or useReducer?

| | useState | useReducer |
|---|---|---|
| good for | a value or two that change simply | state with several kinds of change, or rules |
| the update logic lives | in each event handler | in one reducer function |
| testing the logic | through the component | call the function directly |
| code size | less | more, up front |

`query` stays `useState`: it only ever gets "set to this text". The basket has four kinds of change and a rule (quantity between 1 and 9), so it gets a reducer. Neither is more "advanced". They store state the same way; they only differ in where the update logic lives.

## The basket panel

`BasketPanel` receives `lines`, `snacks`, `total` and `dispatch` as props. `dispatch` is typed `ActionDispatch<[BasketAction]>`, which is React's type for "a dispatch that accepts BasketAction". The `+` button is disabled at the maximum, and `−` at 1 sends `quantityChanged` with 0, which the reducer turns into a removal, so that rule only lives in one place.

The panel also needs the snacks list, to show names and prices for the ids. App passes four props down to it. Keep an eye on that.

## Check yourself

<details>
<summary>What does a reducer take, and what does it return?</summary>

The current state and an action; it returns the next state. It must be pure: no side effects and no changing the old state.
</details>

<details>
<summary>What does <code>dispatch</code> do?</summary>

It sends an action to React. React calls the reducer with the current state and that action, stores the result, and re-renders.
</details>

<details>
<summary>Why does the minus button send <code>quantityChanged</code> with 0 instead of its own <code>removed</code> logic?</summary>

So the rule "quantity 0 means remove the line" lives in one place, the reducer. The button only reports the new quantity.
</details>

<details>
<summary>Why is <code>query</code> still <code>useState</code>?</summary>

It only has one kind of change, "set it to this text", so a reducer would add code without making anything clearer.
</details>
