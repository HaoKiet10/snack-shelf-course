---
title: Performance and the React Compiler
summary: Measure before you optimise, learn what memo, useMemo and useCallback actually do, then switch on the React Compiler, which adds them for you. And the one design change that makes it all work for lists.
minutes: 25
demo: 27-performance
---

The app looks the same. Underneath, liking Pocky no longer makes the other five cards do any work, and the code has **no** `memo`, `useMemo` or `useCallback` in it.

## First, is it slow?

Almost never, in an app this size. A re-render (lesson 7) means calling some functions and comparing their results; React only touches the DOM where something changed. Six cards re-rendering takes a fraction of a millisecond.

So the rule is **measure first**. Install the **React Developer Tools** browser extension, which adds two tabs to DevTools:

- **Components** → ⚙ → *Highlight updates when components render*: every re-rendering component flashes. Like a snack and watch which ones flash.
- **Profiler** → record, click around, stop: a chart of every render, how long each component took, and *why* it rendered ("props changed: onLike").

Optimise when the Profiler shows a real cost: a big list, an expensive calculation, typing that feels sticky. Otherwise the tools below make the code harder to read for nothing.

## Why everything re-renders

When a component re-renders, **all of its children re-render too**, by default. React does not check whether their props changed, because comparing props also costs time, and most components are cheap.

Liking Pocky changes `likes` in `LikesProvider`, so every component reading that context re-renders: `Shelf`, then all six `SnackCard`s. Five of them get the same name, price and likes as before, and do work that produces exactly the same result.

## The manual tools

**`memo`** wraps a component so it skips re-rendering when its props are the same as last time:

```tsx
export default memo(SnackCard)
```

"The same" means `Object.is` for each prop, the identity check from lesson 11. Numbers and strings compare by value. **Functions and objects compare by identity**, and here is the trap:

```tsx
<SnackCard onLike={() => like(snack.id)} … />
```

That arrow function is created **new on every render**. To `memo`, a new function is a different prop, so the card re-renders anyway. `memo` alone did nothing.

**`useCallback`** keeps the same function between renders, until its dependencies change:

```tsx
const like = useCallback((id: string) => {
  setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
}, [setLikes])
```

**`useMemo`** does the same for a calculated value:

```tsx
const visible = useMemo(
  () => snacks.filter((s) => s.name.toLowerCase().includes(q)),
  [snacks, q],
)
```

Getting all three right by hand is fiddly. Miss one dependency and you get stale values (lesson 12's warning). Add one unstable prop and the `memo` is silently useless. That is why the React team built a compiler.

## The React Compiler

The **React Compiler** reads your components and hooks at build time and inserts the memoisation for you: it works out what each value depends on and caches it, at a finer grain than you would by hand. It is a Babel plugin, added to `vite.config.ts`:

```bash
npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler
```

```ts
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  // …
})
```

That is the whole setup. In React DevTools, compiled components get a **Memo ✨** badge.

It relies on the rules you have followed since lesson 4: components are **pure** (same props and state, same JSX), and you **never change props, state or values from a previous render** in place. Code that breaks those rules is skipped by the compiler, and works as before.

## The design change it still needs

The compiler cannot memoise *per item inside a loop*. In a `map`, an arrow function like `() => like(snack.id)` is still created fresh for each card on each render. So the card's API changed: the card passes **its own id** back, and the shelf hands every card **the same function**:

```tsx
// SnackCard: the callback takes the id
type SnackCardProps = {
  id: string
  …
  onLike: (id: string) => void
  onAdd: (id: string) => void
}
<button onClick={() => onLike(id)}>…</button>
```

```tsx
// Shelf: one function for all cards
<SnackCard … onLike={like} onAdd={add} />
```

`like` comes from context, and `add` only uses `dispatch` and the toast's `show`, which never change, plus the list of snacks for the name. So the compiler keeps both functions identical between renders, unless the visible snacks change. Now, when Pocky is liked, Onigiri's card gets props that are all the same as before, and the compiled card returns its cached result without re-creating anything.

Undo needed the same treatment. The old version remembered the quantity before adding, which made `add` depend on the basket and change on every add. A new action, `removedOne`, takes one away instead, so `add` no longer needs the basket at all:

```ts
case 'removedOne':
  return lines
    .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
    .filter((l) => l.qty > 0)
```

This was checked in the running app: after liking Pocky, Onigiri's card received the very same `onLike` and `onAdd` functions, and its rendered output was reused.

## Should you still write useMemo?

With the compiler on: rarely. Its docs suggest keeping your existing ones but not adding new ones by default. Reach for them when the Profiler shows a specific problem the compiler did not solve, or when a value is used as an effect dependency and must not change identity. Without the compiler, the advice is the same as always: measure, then memoise the part that is actually slow.

## Check yourself

<details>
<summary>When Shelf re-renders, why do all the cards re-render by default?</summary>

React re-renders every child of a re-rendering component unless told otherwise, because checking props has its own cost and most components are cheap.
</details>

<details>
<summary>Why does <code>memo(SnackCard)</code> alone not help with <code>onLike={() =&gt; like(snack.id)}</code>?</summary>

The arrow function is new on every render, so it is a different prop each time, and `memo` sees changed props.
</details>

<details>
<summary>What does the React Compiler need from your code?</summary>

Pure components and hooks, and no mutating of props, state or earlier render values. It skips code that breaks the rules.
</details>

<details>
<summary>Why did <code>onLike</code> change to take the snack's id?</summary>

So the shelf can pass the same function to every card. Per-item arrow functions in a `map` cannot be memoised, so they would change on every render.
</details>
