---
title: Transitions
summary: Keep typing instant while the shelf catches up. Urgent and non-urgent updates, useDeferredValue for the search, useTransition for sorting, and a slow-device switch to feel the difference.
minutes: 22
demo: 29-transitions
---

The shelf can be **sorted** now: by name, cheapest first, or most liked. Tick **Simulate a slow device**, which makes the shelf take about half a second to render, and type in the search box. The letters still appear the moment you press the keys; the cards follow a moment later, faded while they are out of date.

## One slow render blocks everything

JavaScript runs on one thread. While React renders, nothing else happens: no typing, no clicks, no scrolling. Normally a render takes a millisecond and nobody notices. On a slow phone, with a big list, it can take hundreds, and the whole page freezes: you type "mo" and nothing shows until the list has rebuilt.

But not every update is equally urgent:

- **Urgent**: the text in the box. People feel a delay of even 100ms in their own typing.
- **Not urgent**: the list of results. It is fine if it updates a moment later, as long as typing never waits for it.

React 18 added a way to say which is which. A **non-urgent** render can happen in the background, and React **abandons it** if something urgent comes along, then starts again with the newer value.

## Simulating a slow device

```tsx
function SlowDown({ cards }: SlowDownProps) {
  'use no memo'
  const until = performance.now() + cards * MS_PER_CARD
  while (performance.now() < until) {
    // busy-wait: block the main thread on purpose
  }
  return null
}

export default memo(SlowDown)
```

Only for this lesson: it blocks for 60ms per card shown. `'use no memo'` is a directive that tells the React Compiler (lesson 27) to leave this component's body alone, because we *want* the waste. It still goes through `memo`, so it only re-runs when the cards, query or sort change.

## useDeferredValue: a copy that may lag

```tsx
const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
const deferredQuery = useDeferredValue(query)

const visible = sortSnacks(
  snacks.filter((s) => s.name.toLowerCase().includes(deferredQuery.trim().toLowerCase())),
  sort,
  likes,
)
const isStale = query !== deferredQuery || isPending
```

`useDeferredValue(query)` returns a value that **lags behind** `query`. When you type, React first does an urgent render where `query` is new but `deferredQuery` is still the **old** value, so the input updates and the list is unchanged (and cheap, because nothing it depends on changed). Then it starts a background render with the new `deferredQuery`. Type another letter before that finishes and React drops it and starts over with the newest text.

The search box gets `query`. The shelf gets results from `deferredQuery`. While they differ, the results are stale, and the CSS fades them:

```tsx
<div className={isStale ? 'results stale' : 'results'}>
```

Measured in the running app with the slow device on: the box showed the typed letter **6ms** after the key, and the list caught up about half a second later.

## Why the query moved back into useState

In lesson 21 the search lived only in the URL. But React Router applies URL changes as a **transition**, which is non-urgent. An input reading its value straight from the URL would itself lag on a slow device; in a test it took about half a second for a letter to appear. So the text is local state again, the urgent copy, and every change is also written to the URL so Back and shared links still work:

```tsx
function changeQuery(next: string) {
  setQuery(next)        // urgent: the input shows it now
  setParam('q', next)   // the URL catches up
}
```

The general rule: a controlled input's value must come from an urgent update.

## useTransition: mark your own update as non-urgent

`useDeferredValue` is for when you **receive** a value. When you **make** the update yourself, wrap it in a transition:

```tsx
const [sort, setSort] = useState<SortKey>('name')
const [isPending, startTransition] = useTransition()

<button onClick={() => startTransition(() => setSort('price'))}>Cheapest</button>
```

Everything set inside `startTransition` renders in the background. The click returns immediately (0ms in the test, with the slow device on), the current list stays usable, and `isPending` is `true` until the new order is ready. If you click another sort first, the unfinished one is abandoned.

You have already used transitions without seeing them: React 19 form actions (lesson 22) run in one, which is what `isPending` from `useActionState` reports, and React Router wraps navigation in one.

| | useDeferredValue | useTransition |
|---|---|---|
| you have | a value from props or state | the code that sets the state |
| you get | a lagging copy of the value | `startTransition` and `isPending` |
| use for | expensive results of a fast-changing input | switching tabs, sorting, filters |

## What transitions are not

They do not make anything faster: the slow render still takes as long. They make the app **stay responsive** while it happens. If something is slow, the first fix is still to make it less slow (lesson 27, or render fewer items). Transitions are for the work that remains.

## Check yourself

<details>
<summary>What is the difference between an urgent and a non-urgent update?</summary>

An urgent update renders immediately and blocks until done, which typing needs. A non-urgent one renders in the background and is abandoned if a newer update arrives.
</details>

<details>
<summary>While you type with the slow device on, what are <code>query</code> and <code>deferredQuery</code>?</summary>

`query` is what is in the box right now. `deferredQuery` is the value the shelf last finished rendering with; it catches up when the background render completes.
</details>

<details>
<summary>Why does sorting use <code>useTransition</code> and the search use <code>useDeferredValue</code>?</summary>

The sort is set by our own click handler, so we can wrap the update in `startTransition`. The search box must update urgently, and the shelf receives a value it can only defer.
</details>

<details>
<summary>Why can't the input read its value straight from the URL here?</summary>

React Router updates the URL in a transition, which is non-urgent. On a slow render, the input would show each letter late.
</details>
