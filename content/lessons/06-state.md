---
title: State
summary: Why a normal variable can't make the like count go up, what useState really does, and the rules that keep state working.
minutes: 15
demo: 06-state
---

The like buttons work now. Each card keeps its own count and turns red once it is liked. Try it in the demo.

## The code

```tsx
import { useState } from 'react'

export default function SnackCard({ name, price, emoji }: SnackCardProps) {
  const [likes, setLikes] = useState(0)
  const liked = likes > 0

  return (
    <div className="card">
      ...
      <button
        className={liked ? 'like liked' : 'like'}
        onClick={() => setLikes((l) => l + 1)}
      >
        ❤ {likes}
      </button>
    </div>
  )
}
```

No `querySelector`, no `textContent =`. Compare it with lesson 1.

## Why a normal variable can't work

```tsx
function SnackCard() {
  let likes = 0
  return <button onClick={() => { likes = likes + 1 }}>❤ {likes}</button>
}
```

Click it and nothing changes on screen, for two separate reasons:

1. **Nothing tells React to redraw.** `likes` does become 1, but React does not watch normal variables. It never calls `SnackCard()` again, so the screen keeps the old description.
2. **Even if it redrew, the value would reset.** A component is a function, and every render is a fresh call. The first line runs again: `let likes = 0`. Local variables do not survive between calls, in any JavaScript function.

So a component needs a value that **survives between renders** and **triggers a re-render when it changes**. That is exactly what `useState` gives you.

## What useState actually does

```tsx
const [likes, setLikes] = useState(0)
```

- **The value lives in React, not in your function.** React keeps a small storage box for each card on the page; your function reads from it on each call.
- **`useState(0)`:** on the first render React creates the box with 0 in it. On every later render the `0` is ignored and React returns whatever is in the box.
- **It returns a pair**, `[current value, setter]`, unpacked with array destructuring. `[thing, setThing]` is the naming convention.
- **TypeScript** infers `likes: number` from the `0`. No annotation needed.

## A click, step by step

```diagram
click
  │
  ▼
setLikes(l => l + 1)       "React, change the box 0 → 1 and re-render"
  │
  ▼
React calls SnackCard() again
  │   useState(0) → returns 1 this time (from the box)
  │   liked = 1 > 0 → true
  │   returns <button className="like liked">❤ 1</button>
  ▼
React compares with the previous description
  │   className changed, text changed
  ▼
updates just those two things in the DOM
```

That is UI = f(data), for real. You change the data; React re-runs the function and fixes the DOM.

## Each card has its own state

Three `<SnackCard />`s means **three separate boxes**. React tracks state **by position in the component tree**: the first SnackCard inside `main`, the second, and so on. That is why liking Pocky does not touch Onigiri. One function, separate memory for each place it is used.

## Derive, don't store

```tsx
const liked = likes > 0
```

It is tempting to make `liked` its own state:

```tsx
const [liked, setLiked] = useState(false)   // ❌ unnecessary
```

That gives you two pieces of state you must keep in sync by hand, which is lesson 2's problem all over again. If a value can be **calculated** from existing state or props, calculate it during render. **Keep state minimal; compute everything else.**

## State is a snapshot

Inside one render, `likes` is a fixed number. Calling `setLikes` does not change that variable; it schedules a new render where `likes` has the new value.

```tsx
onClick={() => {
  setLikes(likes + 1)
  console.log(likes)   // still the OLD value: this render's snapshot
}}
```

That is why the updater form `l => l + 1` exists: it reads the box's latest value, not this render's snapshot.

## The rules of hooks

`useState` is a **hook**: a function starting with `use` that plugs into React's machinery. React matches each hook to its box **by call order**, so:

- call hooks at the **top level** of the component;
- **never** inside `if`, loops or nested functions.

```tsx
if (isSpecial) {
  const [x, setX] = useState(0)   // ❌ skipped on some renders,
}                                  //    so every later hook gets the wrong box
```

## Still broken

Like three snacks: the basket in the header still says 0. Each card's likes live inside that card, and the Header cannot see them: props only flow down, and the cards are siblings of the Header, not its parents. The fix, **lifting state up**, comes a few lessons later.

## Check yourself

<details>
<summary>Why does <code>let likes = 0</code> inside the component reset on every render?</summary>

Each render is a new call of the function, so its first lines run again and create a fresh local variable set to 0. Nothing carries the old value over between calls.
</details>

<details>
<summary>What is wrong with storing <code>liked</code> in its own <code>useState</code>?</summary>

It can be computed from `likes`. Storing it separately means two values that must always be updated together, and the day one update is forgotten, the screen shows a liked card with 0 likes.
</details>

<details>
<summary>Why can't you call <code>useState</code> inside an <code>if</code>?</summary>

React finds each hook's box by the order the hooks are called. If a hook is skipped on some renders, every hook after it shifts by one and reads someone else's box.
</details>
