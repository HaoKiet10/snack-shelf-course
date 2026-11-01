---
title: Lists and keys
summary: Move the snacks into typed data, turn them into cards with map, filter them with the search box, and see the bug that keys prevent.
minutes: 18
demo: 09-lists-and-keys
---

The search box filters now: there are six snacks, and typing "oni" leaves only Onigiri.

## Data separate from the UI

```ts
// src/data/snacks.ts
export type Snack = {
  id: string
  name: string
  price: number
  emoji: string
}

export const SNACKS: Snack[] = [
  { id: 'pocky', name: 'Pocky', price: 2.5, emoji: '🍫' },
  { id: 'onigiri', name: 'Onigiri', price: 1.8, emoji: '🍙' },
  // ...four more
]
```

The snacks are plain **data** now, not JSX. `Snack[]` means "an array of Snack objects", and TypeScript checks that every entry has all four fields with the right types. Adding a snack is one line of data.

## map turns data into JSX

```tsx
{visible.map((snack) => (
  <SnackCard
    key={snack.id}
    name={snack.name}
    price={snack.price}
    emoji={snack.emoji}
  />
))}
```

`.map` is plain JavaScript: it runs a function on each item and returns a new array of the results.

```js
[1, 2, 3].map(n => n * 2)                // [2, 4, 6]
SNACKS.map(s => <SnackCard ... />)        // [<SnackCard/>, <SnackCard/>, ...]
```

**JSX can render an array**: put an array of elements inside `{ }` and React renders each one in order. That is all a list is in React.

## Filtering is derived data

```tsx
const q = query.trim().toLowerCase()
const visible = SNACKS.filter((s) => s.name.toLowerCase().includes(q))
```

`visible` is **not state**. It is recalculated on every render from `SNACKS` and `query`. Each keystroke changes `query`, App re-renders, `visible` is recalculated, and the map produces fewer cards. Lowercasing both sides makes it case-insensitive, and an empty query matches everything, because every string includes `''`.

## Why key exists

When the list changes, React compares the old cards with the new ones. The question is: **which old card is which new card?** Without help, React matches by **position**: first card before, first card after. That breaks as soon as items are removed, added or reordered.

**`key` gives each item a permanent identity**, so React matches by key instead of position.

Here is the bug, tested for real. With `key={index}`, like Pocky twice, then search for "oni":

```text
index keys:  Onigiri ❤ 2    ← wrong: those are Pocky's likes
id keys:     Onigiri ❤ 0    ← correct
```

What happened with index keys:

```diagram
before:  key 0 = Pocky (likes box: 2)    key 1 = Onigiri (likes box: 0) ...
after:   key 0 = Onigiri                 "key 0 still exists, keep its state"
```

React saw that key `0` still existed and kept its state box, the one holding 2, and just gave it new props. **State follows the key, not the data.** With `key={snack.id}`, Onigiri is always `"onigiri"` and keeps its own box.

## The rules for keys

1. Every item in a mapped list needs one. Without it, React warns and falls back to the index.
2. Unique among its siblings (not across the whole app).
3. **Stable**: the same item gets the same key on every render. That is why the data has an `id`.
4. Not the index, if the list can be filtered, sorted, inserted into or deleted from. For a list that never changes, the index is harmless.
5. Not `Math.random()`: a new key every render means a new item every render, and all state is thrown away.
6. The key goes on the outermost element inside `map` (`<SnackCard>` here). It is not a prop: `SnackCard` cannot read `key`.

## The catch

Like Pocky, search for "oni", then clear the search. **Pocky's likes are back to 0.**

When the filter hides Pocky, its card is **removed** from the tree and React throws its state box away (lesson 7). When Pocky comes back, it is a brand-new card starting at 0. That is not a key problem; it is a **where does the state live** problem. The likes should not live inside a card that can disappear. They belong somewhere that stays, App, which is **lifting state up**, coming in lesson 11.

## Side note: map or a for loop?

They can do the same job. The real difference is that **map is an expression that produces a new array**, and **a for loop is a statement that just runs code**.

```ts
const prices = [2.5, 1.8, 2.2]

// for loop: start empty, push step by step (how)
const labels: string[] = []
for (const p of prices) {
  labels.push('$' + p.toFixed(2))
}

// map: describe how ONE item transforms (what)
const labels = prices.map((p) => '$' + p.toFixed(2))
```

Inside JSX's braces you can only put an **expression**, something that produces a value. `map` produces an array, so it fits. A `for` loop produces nothing, so it is a syntax error there (the same reason `{if (x) ...}` does not work). You can still use a loop **before** the `return` and put the resulting array in the JSX; `map` is just shorter.

| | map | for loop |
|---|---|---|
| result | a new array of the same length | nothing, unless you build it |
| original array | untouched | whatever your code does |
| stop early | no | `break`, `continue` |
| `await` one item at a time | awkward | natural |
| inside JSX | yes | no |

Transform each item: `map`. Keep some: `filter`. Combine into one value: `reduce`. Stop early, or step through async work: `for`.

## Side note: where does `s` come from?

```ts
SNACKS.filter((s) => s.price < 2.5)
```

`s` is not defined anywhere special. It is the **parameter name of the function you wrote**, and `filter` fills it in each time it calls that function. The arrow function is the same as:

```ts
function isCheap(s: Snack) {
  return s.price < 2.5
}
SNACKS.filter(isCheap)   // identical
```

`filter` calls it once per item. Written by hand, `filter` is just:

```ts
function myFilter<T>(array: T[], test: (item: T) => boolean): T[] {
  const result: T[] = []
  for (const item of array) {
    if (test(item)) {        // calls YOUR function, passing the item in
      result.push(item)
    }
  }
  return result
}
```

The name is up to you: `s`, `snack` and `banana` all work. TypeScript knows `s` is a `Snack` because `SNACKS` is a `Snack[]`. And `map` and `filter` actually pass three arguments, `(item, index, array)`; you name the ones you need, which is where `index` came from in the key-bug test.

## Check yourself

<details>
<summary>What does <code>.map</code> return, and why can JSX render it?</summary>

A new array with one result per item; here, an array of `<SnackCard>` elements. JSX renders an array by rendering each element in order.
</details>

<details>
<summary>With <code>key={index}</code>, why does Onigiri show Pocky's 2 likes after searching "oni"?</summary>

Onigiri is now first in the list, so it gets key 0. Key 0 existed before (Pocky), so React keeps that card's state box, holding 2, and only changes its props.
</details>

<details>
<summary>Why is <code>visible</code> a plain <code>const</code> and not state?</summary>

It can be computed from `SNACKS` and `query` on every render. Storing it as state would mean keeping it in sync by hand whenever either changes.
</details>
