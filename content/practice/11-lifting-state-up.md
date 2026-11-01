## Q
Header and SnackCard both need the basket. Where should its state live?

- [ ] In Header
- [ ] In each SnackCard
- [x] In App, their closest common parent
- [ ] In a global variable

> Siblings can't see each other's state, and props only flow down. The state goes in the closest component above both.

## Q
How does a click in `SnackCard` change state that lives in App?

- [ ] The event bubbles to App automatically
- [ ] SnackCard changes its props
- [x] App passes a function down as a prop, and SnackCard calls it
- [ ] SnackCard imports App's state

> The function was written in App, so it can call App's setter. The card only reports "I was clicked".

## Q
```tsx
likes[id] = likes[id] + 1
setLikes(likes)
```
What happens?

- [ ] It works fine
- [ ] It throws an error
- [x] React sees the same object and may skip the re-render, so the screen doesn't update
- [ ] Every card's likes change

> React compares with `Object.is`. Changing an object in place and passing it back means "nothing changed". Make a new object.

## Q
Which adds `'ramune'` to a basket array **correctly** for React?

- [ ] `setBasket(basket.push('ramune'))`
- [ ] `basket[basket.length] = 'ramune'`
- [x] `setBasket((prev) => [...prev, 'ramune'])`
- [ ] `basket.push('ramune'); setBasket(basket)`

> Spread makes a new array with the old items plus the new one. `push` changes the old array and returns a number.

## Q
Why is `total` calculated and not stored in state?

- [ ] State can't hold numbers
- [x] It can be derived from the basket and prices on every render, so there's nothing to keep in sync
- [ ] It's faster to store it
- [ ] React forbids sums in state

> Derived values stay right automatically. Storing them means updating them in every handler, and one day forgetting.

## Exercise: Remove from basket
Each card has "+ 🧺". Add a "− 🧺" button that removes one of that snack from the basket (the basket is a list of ids, as in lesson 11). Disable it when that snack isn't in the basket.

### Hint
Remove only **one** occurrence: find its index with `indexOf`, then build a new array without it. Pass a second callback prop, `onRemove`.

### Solution
```tsx
function removeFromBasket(id: string) {
  setBasket((prev) => {
    const i = prev.indexOf(id)
    if (i === -1) return prev
    return [...prev.slice(0, i), ...prev.slice(i + 1)]
  })
}
```

```tsx
<SnackCard
  …
  inBasket={basket.includes(snack.id)}
  onRemove={() => removeFromBasket(snack.id)}
/>
```

Returning `prev` unchanged when there's nothing to remove is fine: same array, no re-render needed. Lesson 17 replaces this with a reducer and quantities.
