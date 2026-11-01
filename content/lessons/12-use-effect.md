---
title: useEffect
summary: Load the snacks from the network with loading and error states, save likes in the browser, and learn the one question that tells you whether you need an effect at all.
minutes: 25
demo: 12-use-effect
---

The snacks are no longer written into the code. They are a file on the server, `snacks.json`, and the app fetches them when it starts. The likes are saved in the browser now, so they survive a reload.

## Rendering must be pure

Since lesson 4, a component has been a function that **calculates** UI from props and state. React may call it at any time, as often as it likes, and even twice in a row in development (StrictMode, lesson 7). So rendering must have no **side effects**: it should not change anything outside itself.

Fetching is a side effect. Writing to `localStorage` is a side effect. Put a `fetch` straight in the component body and it runs on **every render**; when it finishes it sets state, which causes another render, which fetches again, forever.

An **effect** is React's place for that kind of code: "after you have put this render on the screen, also run this".

```tsx
useEffect(() => {
  // runs AFTER React has updated the screen
}, [/* dependencies */])
```

## The dependency array

The second argument says **when** to run it again:

| you write | it runs |
|---|---|
| `useEffect(fn, [])` | after the first render only |
| `useEffect(fn, [a, b])` | after the first render, then after any render where `a` or `b` changed |
| `useEffect(fn)` | after every render (rarely what you want) |

List **every** prop, state or variable from the component that the effect reads. Leaving one out does not make the effect "run less"; it makes it run with **stale** values. The dependency array is not a schedule you choose, it is a description of what the effect reads.

## Step 1: the data moves to a server

```json
// public/snacks.json
[
  { "id": "pocky", "name": "Pocky", "price": 2.5, "emoji": "🍫" },
  ...
]
```

Files in `public/` are served as they are, so this one is at `snacks.json`, next to `index.html`. It stands in for a real API.

```ts
// src/data/snacks.ts
export async function loadSnacks(): Promise<Snack[]> {
  // Pretend the network is slow, so you can actually see "Loading…".
  await new Promise((resolve) => setTimeout(resolve, 600))

  const res = await fetch('snacks.json')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return (await res.json()) as Snack[]
}
```

`fetch` only throws for network failures. A 404 is a successful *request* with a failed *answer*, so check `res.ok` yourself. `res.json()` is typed as `any`, and `as Snack[]` tells TypeScript what we expect; TypeScript cannot check data that arrives at runtime, so a real app would validate it.

## Step 2: three states, not one

The snacks start empty, and the app has to say what is going on:

```tsx
type Status = 'loading' | 'ready' | 'error'

const [snacks, setSnacks] = useState<Snack[]>([])
const [status, setStatus] = useState<Status>('loading')
const [attempt, setAttempt] = useState(0)
```

`'loading' | 'ready' | 'error'` is a **union of string literals**: `status` can only ever be one of those three words, and a typo like `'redy'` is a type error.

## Step 3: the loading effect

```tsx
useEffect(() => {
  let ignore = false
  loadSnacks()
    .then((data) => {
      if (!ignore) {
        setSnacks(data)
        setStatus('ready')
      }
    })
    .catch(() => {
      if (!ignore) setStatus('error')
    })
  return () => {
    ignore = true
  }
}, [attempt])
```

In order:

1. App renders for the first time, with no snacks and `status = 'loading'`. The screen says "Loading snacks…".
2. React runs the effect. The fetch starts.
3. 600ms later the data arrives. `setSnacks` and `setStatus` cause a re-render, and the cards appear.

**The function you return is the cleanup.** React calls it before running the effect again, and when the component is removed. Here it sets `ignore = true`, so if this request finishes late, after it has been replaced, its result is thrown away instead of overwriting newer data. Without it, a slow old request can arrive after a fast new one and win.

In development you will see the effect run, get cleaned up and run again on start. That is StrictMode doing it on purpose, to prove your cleanup works. In a production build it runs once.

## Step 4: retry by changing a dependency

```tsx
function retry() {
  setStatus('loading')
  setAttempt((a) => a + 1)
}
```

The effect depends on `[attempt]`. Changing `attempt` is the way to say "run it again". The effect never reads `attempt`'s value, it just reacts to it changing.

```tsx
let content: ReactNode
if (status === 'loading') {
  content = <p className="status">Loading snacks…</p>
} else if (status === 'error') {
  content = (
    <p className="status">
      Couldn't load the snacks. <button onClick={retry}>Try again</button>
    </p>
  )
} else if (visible.length === 0) {
  content = <p className="empty">No snacks match …</p>
} else {
  content = <main className="shelf">{/* cards */}</main>
}
```

Four outcomes is too many for nested `? :`, so this is lesson 10's `if`, before the `return`, building a variable that the JSX then puts in place with `{content}`. `ReactNode` is the type of "anything React can render".

To see the error, open DevTools, go to the Network tab, set throttling to **Offline**, and reload. Then go back online and press **Try again**.

## Step 5: save the likes

```tsx
const [likes, setLikes] = useState<Record<string, number>>(readSavedLikes)

useEffect(() => {
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes))
}, [likes])
```

`localStorage` is outside React, so keeping it in step with state is an effect: "after any render where `likes` changed, write them down".

Reading them back happens in `useState`. Note `readSavedLikes`, **without brackets**. You pass the function, and React calls it once, for the first value only. Writing `useState(readSavedLikes())` would read and parse `localStorage` on every single render and throw the result away every time after the first.

```tsx
function readSavedLikes(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? '{}')
  } catch {
    return {}
  }
}
```

The `try` matters: storage can be blocked or hold broken text, and a crash on start is worse than forgetting some likes.

## When you do not need an effect

The question to ask is: **is this syncing with something outside React?** The network, `localStorage`, a timer, the page title, a chat connection: yes, use an effect. Anything calculated from props and state: no.

```tsx
// ❌ an effect to keep derived data "in sync"
const [visible, setVisible] = useState<Snack[]>([])
useEffect(() => {
  setVisible(snacks.filter((s) => s.name.toLowerCase().includes(q)))
}, [snacks, q])

// ✅ just calculate it while rendering
const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))
```

The effect version renders once with the **old** list, then again with the new one, and it is one more thing to get wrong. The same goes for responding to a click: put that code in the event handler, not in an effect that watches for the state the click changed.

Effects are the escape hatch from React's world, not a general "do this when that changes" tool. This app has exactly two, and both talk to the outside.

## Check yourself

<details>
<summary>Why can't the fetch go straight in the component body?</summary>

The body runs on every render. The fetch would set state, which re-renders, which fetches again, forever. Rendering must stay pure; side effects go in effects or event handlers.
</details>

<details>
<summary>What does the dependency array <code>[attempt]</code> mean, and how does Try again use it?</summary>

Run the effect after the first render, and again after any render where `attempt` changed. Try again increments `attempt`, so the effect runs again and refetches.
</details>

<details>
<summary>What is the cleanup function for in the loading effect?</summary>

It marks the old request as ignored when the effect re-runs or App goes away, so a late response cannot overwrite newer data or set state on a component that is gone.
</details>

<details>
<summary>Why <code>useState(readSavedLikes)</code> and not <code>useState(readSavedLikes())</code>?</summary>

The first passes the function, which React calls once for the initial value. The second calls it on every render and throws the result away every time after the first.
</details>

<details>
<summary>Should <code>total</code> (the basket price) be calculated in an effect?</summary>

No. It comes from `basket` and `snacks`, both already available while rendering. Calculate it directly; effects are for syncing with things outside React.
</details>
