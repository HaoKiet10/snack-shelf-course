---
title: Lifting state up
summary: Move the likes out of the cards and into App, so they survive the search. Then add a basket that two components share, and learn why state updates make new objects instead of changing old ones.
minutes: 20
demo: 11-lifting-state-up
---

Two bugs and one missing feature, all with the same cause. Liked snacks forget their likes when a search hides them. The 🧺 in the header has said 0 since lesson 4. And there is no way to add anything to the basket.

## Where state lives decides what it can do

State lives inside the component that calls `useState`, and it lasts exactly as long as that component stays in the tree (lesson 7). That gives two rules of thumb:

1. **State lives as long as its component.** If the component can disappear, so can the state.
2. **Only a component and its children can see its state.** Data flows down through props (lesson 5), never up or sideways.

The likes broke rule 1: they lived in `SnackCard`, and the filter removes cards. The basket would break rule 2: the cards need to change it, the `Header` needs to show it, and they are **siblings**. Neither can see the other's state.

The fix for both is the same. **Move the state up to the closest common parent**, and pass it down.

```diagram
        App            ← likes and basket live here now
       /    \
  Header    SnackCard × 6
  (shows    (shows likes,
   count)    reports clicks)
```

## Step 1: App owns the data

```tsx
// App.tsx
const [likes, setLikes] = useState<Record<string, number>>({})
const [basket, setBasket] = useState<string[]>([])
```

`Record<string, number>` is TypeScript for "an object whose keys are strings and values are numbers", like `{ pocky: 3, onigiri: 1 }`. A snack that has never been liked is simply missing, so reading it gives `undefined`, and `?? 0` turns that into 0:

```tsx
likes={likes[snack.id] ?? 0}
```

The basket is a list of ids, one per item added. `['pocky', 'pocky', 'ramune']` is two Pocky and a Ramune.

## Step 2: the card shows, and reports

```tsx
type SnackCardProps = {
  name: string
  price: number
  emoji: string
  likes: number
  onLike: () => void
  onAdd: () => void
}
```

The card has **no `useState` any more**. It displays the `likes` it is given, and when a button is clicked, it calls a function it was given. `() => void` is the type of "a function that takes nothing and returns nothing".

```tsx
<button className={liked ? 'like liked' : 'like'} onClick={onLike}>
  ❤ {likes}
</button>
```

This is how data goes **up**: not by reaching into the parent, but by the parent handing down a function to call. The card does not know what a like does to the app. It only says "I was liked". App decides what that means.

```tsx
// App.tsx, inside the map
<SnackCard
  key={snack.id}
  ...
  likes={likes[snack.id] ?? 0}
  onLike={() => like(snack.id)}
  onAdd={() => addToBasket(snack.id)}
/>
```

The arrow functions remember which snack each card is, so the card does not need to know its own id.

## Step 3: update by making something new

```tsx
function like(id: string) {
  setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
}

function addToBasket(id: string) {
  setBasket((prev) => [...prev, id])
}
```

Read `{ ...prev, [id]: ... }` as "a **new** object with everything from `prev`, plus this one key set to a new value". `[...prev, id]` is "a **new** array with everything from `prev`, plus `id` on the end". `...` is the spread syntax; `[id]` as a key means "the key whose name is in the variable `id`".

Why not simply this?

```tsx
likes[id] = likes[id] + 1   // changes the existing object
setLikes(likes)             // the SAME object as before
```

Because when you call `setLikes`, React checks whether the new value **is the same object** as the old one (`Object.is`). It is, so React concludes nothing changed and **skips the re-render**. The data changed, and the screen did not. That is the exact out-of-sync bug React exists to prevent (lesson 2), sneaking back in.

The rule: **treat state as read-only. To change it, make a new one.**

| to do this | instead of | write |
|---|---|---|
| change a key | `obj.k = v` | `{ ...obj, k: v }` |
| add to an array | `arr.push(x)` | `[...arr, x]` |
| remove from an array | `arr.splice(i, 1)` | `arr.filter((x) => x !== gone)` |
| change one item | `arr[i] = x` | `arr.map((y) => (y.id === id ? x : y))` |

The spread only copies one level. The new object holds the same inner values, which is fine as long as you never change those in place either.

## Step 4: the header gets props

```tsx
// App.tsx
const total = basket.reduce((sum, id) => {
  const snack = SNACKS.find((s) => s.id === id)
  return sum + (snack ? snack.price : 0)
}, 0)

<Header count={basket.length} total={total} />
```

The count and the total are **derived** from the basket, not stored. `reduce` walks the array carrying a running value (`sum`, starting at `0`), which is the "combine into one value" tool from lesson 9.

```tsx
// Header.tsx
export default function Header({ count, total }: HeaderProps) {
  return (
    <header className="header">
      <h1>Yune's Snack Shelf</h1>
      <span className="basket">
        🧺 {count}
        {count > 0 && <span className="total"> · ${total.toFixed(2)}</span>}
      </span>
    </header>
  )
}
```

Note `count > 0 &&`, a boolean, not `count &&` (lesson 10's stray 0).

## Did it work?

Like Pocky three times, search "oni", clear the search. Pocky still has 3 likes and its badge. The card was still removed and rebuilt, but it never stored anything, so there was nothing to lose. The likes are in App, which stays.

Add Pocky and Onigiri to the basket. The header says **🧺 2 · $4.30**. Clicking inside one component changed what another one shows, because both read from the same place.

## Single source of truth

Every piece of state should have **one owner**. The likes are in App and nowhere else; the cards only display a copy passed as props. If a card also kept its own `useState` for likes, you would have two numbers to keep in sync, and sooner or later they would disagree.

Lifting has a cost: App now re-renders, and so do all its children, on every like. For six cards that costs nothing worth measuring. Lift state **as high as it needs to go, and no higher**. The search `query` is used only by App's own JSX, so it stays in App; it would not belong any higher even if there were somewhere higher to go.

## Check yourself

<details>
<summary>Header and SnackCard both need the basket. Where should it live, and why?</summary>

In App, their closest common parent. Siblings cannot see each other's state, and props only flow down, so the state has to live above both.
</details>

<details>
<summary>How does a click inside SnackCard change state that lives in App?</summary>

App passes a function down as a prop (`onLike`). The card calls it. The function was written in App, so it can call App's `setLikes`.
</details>

<details>
<summary>Why does <code>likes[id]++</code> followed by <code>setLikes(likes)</code> not update the screen?</summary>

It changes the existing object and passes the same object back. React compares old and new with `Object.is`, sees the same object, and skips the re-render. Make a new object: `{ ...likes, [id]: likes[id] + 1 }`.
</details>

<details>
<summary>Why are the likes no longer lost when a search hides a card?</summary>

The card is still removed, but it no longer holds the likes. They are in App, which is never removed, and are passed back in as a prop when the card returns.
</details>
