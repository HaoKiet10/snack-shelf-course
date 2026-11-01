---
title: Custom hooks
summary: Pull the loading logic and the saving logic out of App into your own hooks, useSnacks, useLocalStorage and useBasket. The basket now survives a reload, and App gets three lines shorter for each idea.
minutes: 18
demo: 18-custom-hooks
---

Put something in the basket and reload: it is still there. That took a few lines, because the saving code was already written once, for the likes, and this lesson turns it into something reusable.

## A hook is just a function

A **custom hook** is a function whose name starts with `use` and that calls other hooks. That is the entire definition. There is no registration and no special API.

```ts
export function useSnacks() {
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // … lesson 12's loading effect, unchanged …
  }, [attempt])

  function retry() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  return { snacks, status, retry }
}
```

This is lesson 12's code, cut out of App and pasted into a function. In App, four state variables, an effect and a function became:

```tsx
const { snacks, status, retry } = useSnacks()
```

The `use` prefix is not decoration. It tells you, the linter and React that the **rules of hooks** (lesson 6) apply: call it at the top level of a component or another hook, never in a condition or a loop. Inside, it can use any hook it likes.

## Hooks share logic, not state

This is the one thing to really get. **Every component that calls `useSnacks()` gets its own, separate state.** Calling a hook is like calling the code inside it in that component. Two components calling `useSnacks()` would fetch the snacks twice and hold two separate lists.

So a custom hook is a way to **reuse code**, not a way to share data. Sharing data between components is lesson 19.

## A generic hook: useLocalStorage

The likes were saved with a lazy `useState` plus an effect (lesson 12). The basket needs the same thing. Instead of writing it twice:

```ts
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : (JSON.parse(saved) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked: keep working, just don't save
    }
  }, [key, value])

  return [value, setValue] as const
}
```

It works exactly like `useState`, except the value is saved under `key`:

```tsx
const [likes, setLikes] = useLocalStorage<Record<string, number>>('snack-shelf-likes', {})
```

`<T>` makes the function **generic**: `T` stands for whatever type you use it with. Here `T` is `Record<string, number>`, so `likes` has that type and `setLikes` only accepts it. One hook, any type.

`as const` on the return value matters. Without it TypeScript sees `[value, setValue]` as "an array where any item may be either type". With it, it is a fixed pair, `[T, setter]`, just like `useState`'s.

## useBasket: a reducer that remembers

The basket uses `useReducer`, not `useState`, so it gets its own small hook:

```ts
export function useBasket() {
  const [lines, dispatch] = useReducer(basketReducer, BASKET_KEY, readSavedBasket)

  useEffect(() => {
    try {
      localStorage.setItem(BASKET_KEY, JSON.stringify(lines))
    } catch {
      // not saved, still works
    }
  }, [lines])

  return { lines, dispatch, count: countItems(lines) }
}
```

`useReducer`'s optional **third argument** is an init function, like the function form of `useState`. React calls `readSavedBasket(BASKET_KEY)` once to get the first state, instead of reading storage on every render. (In lesson 19 this hook is renamed `useBasketState`, because the name `useBasket` is needed for something else.)

A hook can return anything: a pair like `useState`, an object like this one, a single value. Return an object when there are several named things, so the caller can pick what it needs: `const { lines, count } = useBasket()`.

## App, now

```tsx
export default function App() {
  const [query, setQuery] = useState('')
  const [likes, setLikes] = useLocalStorage<Record<string, number>>('snack-shelf-likes', {})
  const { snacks, status, retry } = useSnacks()
  const { lines: basket, dispatch, count } = useBasket()
  // …
```

The top of App reads like a list of what it needs. The details of *how* each piece works are one click away, in `src/hooks/`.

## When to make a hook

Make one when a group of state and effects belongs together and has a name: "the snacks, loaded", "a value saved in storage". Do not make one for a single `useState`; `useCounter` that wraps one `useState` adds a file and hides nothing.

Good hooks hide **effects** most of all, because effects are where the tricky parts live (cleanup, dependencies). Once `useLocalStorage` is correct, nobody using it has to think about them again.

## Check yourself

<details>
<summary>What makes a function a custom hook?</summary>

Its name starts with `use` and it calls other hooks. The rules of hooks then apply to it, just like to built-in ones.
</details>

<details>
<summary>Header and App both call <code>useSnacks()</code>. How many times are the snacks loaded?</summary>

Twice. Each call has its own state and its own effect. Custom hooks share code, not state.
</details>

<details>
<summary>Why does <code>useLocalStorage</code> return <code>[value, setValue] as const</code>?</summary>

So TypeScript treats it as a fixed pair, the value then the setter, instead of an array where any item could be either type.
</details>

<details>
<summary>What is the third argument of <code>useReducer</code> for?</summary>

An init function. React calls it once with the second argument to produce the first state, so expensive setup, like reading storage, only happens once.
</details>
