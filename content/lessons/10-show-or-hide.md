---
title: Show or hide
summary: Render something only sometimes. An empty-search message, a hint that appears while you type, a badge for popular snacks, and the stray 0 that catches everyone once.
minutes: 15
demo: 10-show-or-hide
---

Search for "zzz" and the shelf no longer goes blank: it says nothing matched. Like a snack three times and it gets a **Fan favourite** badge.

## There is no v-if

Some frameworks have special template syntax for "show this only if". React has none. A component is a function, so you decide what to render with **plain JavaScript**. There are three tools, and which one fits depends on where you are standing.

| where | tool | use it for |
|---|---|---|
| before `return` | `if` | whole different outcomes, early exits |
| inside JSX | `cond ? a : b` | one of two things |
| inside JSX | `cond && a` | something or nothing |

Inside JSX's braces you can only put an **expression** (lesson 9's side note), which is why `if` cannot go there but `? :` and `&&` can.

## if, before the return

```tsx
function Price({ price }: { price: number }) {
  if (price === 0) {
    return <p className="price">Free!</p>
  }
  return <p className="price">${price.toFixed(2)}</p>
}
```

The function returns different JSX depending on its props. Nothing new to learn, it is an ordinary `if`. Good for when the outcomes are very different, or for an **early exit** at the top of a component.

A component can also **return `null`** to render nothing at all:

```tsx
function Hint({ query }: { query: string }) {
  if (query === '') return null
  return <p>Searching for “{query}”</p>
}
```

## ? : picks one of two

The shelf shows cards, or a message when there are none:

```tsx
{visible.length > 0 ? (
  <main className="shelf">
    {visible.map((snack) => <SnackCard key={snack.id} ... />)}
  </main>
) : (
  <p className="empty">
    No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
  </p>
)}
```

`condition ? whenTrue : whenFalse` is JavaScript's conditional expression, an `if/else` that produces a value. The parentheses are only there so the JSX can span several lines.

It works for small things too, like lesson 6's class name:

```tsx
className={liked ? 'like liked' : 'like'}
```

This "nothing here" message is called an **empty state**. Before, a search with no matches left a blank page, which looks broken. An empty state tells you the app is fine and what to try instead.

## && renders something or nothing

The search hint only makes sense while you are searching:

```tsx
{query !== '' && (
  <p className="search-hint">
    Showing {visible.length} of {SNACKS.length} snacks
  </p>
)}
```

And the badge, in `SnackCard`:

```tsx
const popular = likes >= 3

{popular && <span className="badge">Fan favourite</span>}
```

Why does this work? `a && b` in JavaScript does not return `true` or `false`. It returns **`a` if `a` is falsy, otherwise `b`**:

```js
true && 'badge'    // 'badge'
false && 'badge'   // false
```

And React renders `false`, `true`, `null` and `undefined` as **nothing**. So `false && <Badge />` gives `false`, which draws nothing, and `true && <Badge />` gives the badge.

## The stray 0

Here is the catch. Suppose you write the condition with a number:

```tsx
{likes && <span className="badge">Liked</span>}
```

When `likes` is `0`, `0 && ...` returns `0`, because `0` is falsy. And React does **not** skip numbers. It renders them. The card shows a lonely **0** where the badge would be.

Only `false`, `null`, `undefined` and `true` render as nothing. `0` and `NaN` render as text, and so does an empty string (invisibly). So make the left side of `&&` a real **boolean**:

```tsx
{likes > 0 && <span className="badge">Liked</span>}   // boolean: fine
{popular && <span className="badge">Fan favourite</span>}   // boolean: fine
{items.length && <List />}       // 0 when empty: bug
{items.length > 0 && <List />}   // fine
```

TypeScript will not catch this one, because rendering a number is perfectly legal. Naming the condition (`const popular = likes >= 3`) is a good habit: it makes the boolean obvious and the JSX easier to read.

## Not rendered is not the same as hidden

Like Pocky three times, search "oni", then clear. Pocky's badge is gone, and so are its likes.

When a condition turns false, React does not hide the element. It **removes it from the tree**, the same as the filter does, and any state inside is thrown away (lessons 7 and 9). When it comes back, it is a new component starting from scratch.

The other option is to keep it in the tree and hide it. Every card would be rendered, and each one's outer `<div>` would get the HTML `hidden` attribute when it does not match:

```tsx
<div className="card" hidden={!matches}>   // stays mounted, keeps its likes
```

| | conditional rendering | hidden with CSS |
|---|---|---|
| in the DOM | no | yes, just not shown |
| state inside | lost | kept |
| cost | nothing for hidden items | every item is still rendered |
| usual choice | yes | tabs you switch back and forth, for example |

Hiding would fix the lost likes here, but it treats the symptom. The likes are still stored in a card that should not have to stay alive to remember them. Lesson 11 moves them up into App, where they survive whatever the cards do.

## Check yourself

<details>
<summary>Why can you write <code>? :</code> inside JSX but not <code>if</code>?</summary>

JSX braces take an expression, something that produces a value. `? :` produces a value; `if` is a statement and produces nothing. Use `if` before the `return` instead.
</details>

<details>
<summary>A list shows a stray <code>0</code> when it is empty. What is the likely line, and the fix?</summary>

Something like `{items.length && <List />}`. When the length is 0, `&&` returns `0`, and React renders numbers. Fix it with a boolean: `{items.length > 0 && <List />}`.
</details>

<details>
<summary>How does a component render nothing at all?</summary>

It returns `null`. In JSX, `false`, `null`, `undefined` and `true` also render nothing.
</details>

<details>
<summary>Why does Pocky lose its badge after a search that hides it?</summary>

Conditional rendering removes the card from the tree, and its state goes with it. When Pocky comes back, it is a new card with likes at 0, so `popular` is false.
</details>
