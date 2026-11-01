---
title: State libraries (Zustand)
summary: Move the basket out of React context into a small Zustand store. No provider, components that re-render only when the part they pick changes, saving built in, and the same reducer underneath.
minutes: 20
demo: 31-zustand
---

The basket works exactly as before. But `BasketContext`, `BasketProvider` and `useBasketState` are **deleted**, and the basket changing no longer re-renders the shelf.

## Where context gets awkward

Lesson 19's context works, with two costs that grow with the app:

- **Every reader re-renders on any change.** `Shelf` only needs `dispatch`, which never changes, yet it re-rendered on every add, because the context *value* (lines, count, total, dispatch) changed.
- **Providers pile up** in `main.tsx`, in an order that matters, and every test has to wrap components in the right ones.

For app-wide client state that changes often, many teams use a small **state library** instead. **Zustand** is one of the simplest.

```bash
npm install zustand
```

## A store

```ts
type BasketStore = {
  lines: BasketLine[]
  dispatch: (action: BasketAction) => void
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set) => ({
      lines: [],
      dispatch: (action) => set((state) => ({ lines: basketReducer(state.lines, action) })),
    }),
    {
      name: 'snack-shelf-basket-store',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)
```

`create` makes a **store**: state that lives **outside React**, in a module, plus a hook to read it. The function inside gets `set`, which updates the state (like a setter, it merges what you return). Here the store holds the lines and a `dispatch` that runs **lesson 17's reducer**. The rules of the basket did not change at all; only where the state lives.

`persist` is Zustand middleware that saves the store to `localStorage` and loads it on start, replacing lesson 18's `useBasketState`. `partialize` saves only the data; functions cannot be stored as JSON. (The odd `create<BasketStore>()(…)`, with an empty call first, is how Zustand gets TypeScript's inference right when middleware is involved.)

## Selectors

```tsx
const lines = useBasketStore((s) => s.lines)
const dispatch = useBasketStore((s) => s.dispatch)
```

The function you pass is a **selector**: it picks the part of the store this component needs. Zustand re-renders the component **only when the selector's result changes** (compared with `Object.is`). So:

- `Shelf` selects `dispatch`, which never changes. Adding to the basket no longer re-renders the shelf.
- `Header` selects the count:

```ts
export function useBasketCount(): number {
  return useBasketStore((s) => countItems(s.lines))
}
```

The result is a number, so the header re-renders only when the count really changes.

Select the **smallest thing you need**. Selecting the whole store, `useBasketStore((s) => s)`, re-renders on every change, like context. And never return a **new** object or array from a selector, like `(s) => ({ lines: s.lines })`: it is different on every call, so it always counts as changed, and in Zustand 5 that causes an endless render loop. Select values one at a time, or wrap the selector in Zustand's `useShallow`, which compares the object's fields instead.

Derived values combining sources become small hooks:

```ts
export function useBasketTotal(): number {
  const lines = useBasketStore((s) => s.lines)
  const { data: snacks = [] } = useQuery(snacksQuery)
  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  return basketTotal(lines, prices)
}
```

## No provider

```tsx
<QueryClientProvider client={queryClient}>
  <HashRouter>
    <LikesProvider>
      <ToastProvider>
        <App />
```

`BasketProvider` is gone. A store is a module, so any file can import it. That includes code **outside components**: `useBasketStore.getState()` reads it and `useBasketStore.setState(…)` writes it, from anywhere.

Tests use that directly. Instead of wrapping the form in a fake context, a test puts a known basket in the store:

```ts
beforeEach(() => {
  useBasketStore.setState({ lines: [{ id: 'pocky', qty: 2 }], dispatch })
})
```

The total also needs prices, so the test **seeds the query cache** instead of fetching:

```ts
client.setQueryData(snacksQuery.queryKey, [{ id: 'pocky', price: 2.5, … }])
```

## Which tool for which state

The shelf now uses all of them, each for what it is good at:

| state | tool | why |
|---|---|---|
| search text, form fields, the ✓ flash | `useState` | only one component cares |
| the snacks | TanStack Query | server state: caching, refetching (lesson 23) |
| the search in the address bar | the URL | shareable, survives Back (lesson 21) |
| the basket | a Zustand store | client state many components read, changes often |
| likes, toasts | context | app-wide, but simple; context is fine here |

Context is still a good choice for values that rarely change (the theme, the logged-in user, the language) or that belong to one part of the tree. Reach for a store when many components read state that changes often. Other libraries in the same space are **Redux Toolkit** (more structure, built-in devtools, common in large teams) and **Jotai** (many small atoms instead of one store).

## Check yourself

<details>
<summary>Why did the shelf re-render on every add with context, and not with the store?</summary>

With context, every reader re-renders when the provider's value changes. With the store, the shelf's selector picks only `dispatch`, which never changes, so it is never re-rendered by basket changes.
</details>

<details>
<summary>What does a selector like <code>(s) =&gt; countItems(s.lines)</code> do?</summary>

It picks a derived value from the store. The component re-renders only when that value changes, so shuffling quantities that keep the same count does not re-render it.
</details>

<details>
<summary>Why is there no BasketProvider any more?</summary>

A Zustand store lives in a module, outside React, so components import its hook directly. There is no tree position to provide it from.
</details>

<details>
<summary>Why would <code>useBasketStore((s) =&gt; ({ lines: s.lines }))</code> be a bad selector?</summary>

It builds a new object on every call, which never equals the previous one. Zustand treats it as always changed, which in version 5 leads to an endless render loop. Select `s.lines` directly, or use `useShallow`.
</details>
