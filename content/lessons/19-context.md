---
title: Context
summary: Stop passing the basket down through components that do not use it. A context makes a value available to every component inside a provider, so Header, Shelf and the basket panel each read it themselves.
minutes: 20
demo: 19-context
---

Nothing changes on screen. What changes is that **App no longer mentions the basket at all**. The components that need it read it straight from a context.

## The problem: prop drilling

After lesson 18, the basket travels like this:

```diagram
App   owns basket, dispatch, total
├─ Header        ← count, total
├─ Shelf         ← onAdd (only to pass on)
│  └─ SnackCard  ← onAdd
└─ BasketPanel   ← lines, snacks, total, dispatch
```

App has to know what every descendant needs, and `Shelf` carries `onAdd` it never uses. In a real app this goes five or six levels deep, and every new feature means editing every component on the path. That is **prop drilling**.

## Context: a value that skips the levels

A **context** lets a component high up offer a value, and any component below it read that value directly, however deep.

```diagram
<BasketProvider>   offers { lines, count, total, dispatch }
  App
  ├─ Header        useBasket() → count, total
  ├─ Shelf         useBasket() → dispatch
  └─ BasketPanel   useBasket() → everything
```

It takes three pieces.

## 1. Create the context

```ts
// context/BasketContext.ts
export type BasketValue = {
  lines: BasketLine[]
  count: number
  total: number
  dispatch: ActionDispatch<[BasketAction]>
}

export const BasketContext = createContext<BasketValue | null>(null)
```

`createContext(defaultValue)` makes the channel. The default is what a component gets **if there is no provider above it**. Here that would always be a bug, so the default is `null` and the next piece checks for it.

## 2. A hook to read it

```ts
export function useBasket(): BasketValue {
  const value = useContext(BasketContext)
  if (value === null) {
    throw new Error('useBasket() must be used inside <BasketProvider>')
  }
  return value
}
```

`useContext(BasketContext)` reads the value from the **nearest provider above** the component. Wrapping it in `useBasket()` gives components a short name, and turns a forgotten provider into a clear error instead of a confusing "cannot read properties of null" somewhere else. It also narrows the type from `BasketValue | null` to `BasketValue`, so callers never have to check.

## 3. A provider that supplies it

```tsx
// context/BasketProvider.tsx
export default function BasketProvider({ children }: { children: ReactNode }) {
  const { lines, dispatch, count } = useBasketState()
  const { snacks } = useSnackData()

  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  const total = basketTotal(lines, prices)

  return <BasketContext value={{ lines, count, total, dispatch }}>{children}</BasketContext>
}
```

The provider is an ordinary component. It **owns** the basket state (with lesson 18's hook) and puts it in the context with `<BasketContext value={…}>`. Everything in `children` can now read it. (Before React 19 you wrote `<BasketContext.Provider value={…}>`; you will see that in older code.)

The context and hook live in a `.ts` file and the provider in a `.tsx` file. That keeps fast refresh happy: a file that exports a component should only export components.

## Wrap the app

```tsx
// main.tsx
<StrictMode>
  <SnacksProvider>
    <BasketProvider>
      <App />
    </BasketProvider>
  </SnacksProvider>
</StrictMode>
```

The snacks got the same treatment, as `SnacksContext` with `useSnackData()`. Lesson 18 noted that each `useSnacks()` call loads separately. Now `useSnacks()` is called **once**, in `SnacksProvider`, and every component reads that one result through context. That is the difference between the two tools: **a hook shares code; a context shares a value.**

Order matters: `BasketProvider` reads the snacks to work out the total, so it must be **inside** `SnacksProvider`.

## Reading it

```tsx
export default function Header() {
  const { count, total } = useBasket()
  // …
}
```

```tsx
export default function Shelf({ snacks, likes, onLike }: ShelfProps) {
  const { dispatch } = useBasket()
  // … onAdd={() => dispatch({ type: 'added', id: snack.id })}
}
```

`Header` and `BasketPanel` take no props at all now. App renders `<Header />` and `<BasketPanel />` and does not know the basket exists.

## What context costs

When a provider's value changes, **every component that reads that context re-renders**. Here, adding to the basket re-renders Header, Shelf and BasketPanel, which is exactly the set that should update. In a large app, putting everything in one giant context makes unrelated parts re-render together. Split contexts by what changes together: snacks and basket are separate for that reason.

Context also makes a component **depend on where it sits**: `Header` now only works inside a `BasketProvider`. That is a fair trade for app-wide data. For data only a parent and child share, a prop is still simpler and more obvious.

| use | for |
|---|---|
| props | data a parent hands to its children |
| context | data many components at different depths need: the basket, the logged-in user, the theme, the language |
| neither | data that can be calculated from what you already have |

## Check yourself

<details>
<summary>What is prop drilling, and where was it in this app?</summary>

Passing props through components that do not use them, just to reach one further down. `Shelf` received `onAdd` only to give it to `SnackCard`.
</details>

<details>
<summary>What does <code>useContext</code> return?</summary>

The value of the nearest provider for that context above the component. If there is none, it returns the default passed to `createContext`.
</details>

<details>
<summary>What is the difference between a custom hook and a context?</summary>

A custom hook shares code: each caller gets its own state. A context shares one value: every reader below the provider gets the same thing.
</details>

<details>
<summary>Why must <code>BasketProvider</code> be inside <code>SnacksProvider</code>?</summary>

It calls `useSnackData()` to get prices for the total, and a context can only be read below its provider.
</details>
