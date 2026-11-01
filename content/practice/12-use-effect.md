## Q
When does an effect run?

- [ ] Only when the user clicks
- [ ] Before the component renders
- [x] After React has put the render on the screen
- [ ] Once, when the page loads, whatever its dependencies

> Effects run after the commit, so rendering itself stays pure and fast.

## Q
What does `useEffect(fn, [])` mean?

- [x] Run `fn` after the first render only (and clean up when the component goes away)
- [ ] Never run `fn`
- [ ] Run `fn` on every render
- [ ] Run `fn` before the first render

> An empty list means "depends on nothing that changes", so it runs once after mounting. (StrictMode runs it, cleans up and runs it again in development.)

## Q
An effect reads `query` but its dependency list is `[]`. What goes wrong?

- [x] It keeps using the `query` from the first render: a stale value
- [ ] Nothing; fewer runs is faster
- [ ] It throws an error
- [ ] React adds `query` automatically

> The dependency list must contain everything the effect reads that can change. Leaving one out doesn't save work, it gives wrong results.

## Q
In the loading effect, what is `let ignore = false` with a cleanup that sets it to `true` for?

- [ ] To cancel the network request itself
- [ ] To make fetch faster
- [ ] To stop React from rendering
- [x] So a slow, outdated request can't overwrite newer data when it finally finishes

> The request may still complete, but its result is ignored. Without it, an old response arriving late could replace a newer one.

## Q
Which of these should **not** be an effect?

- [ ] Fetching data when the page opens
- [ ] Listening to a key on `window`
- [ ] Saving likes to `localStorage` when they change
- [x] Filtering the snacks by the search text

> The filtered list is calculated from state you already have. Compute it while rendering. Effects are for syncing with things outside React.

## Exercise: The page title
Make the browser tab show the number of snacks in the basket, like "(3) Yune's Snack Shelf", and just "Yune's Snack Shelf" when the basket is empty.

### Hint
`document.title` is outside React, so setting it is an effect. What does it depend on?

### Solution
```tsx
useEffect(() => {
  document.title = basket.length > 0 ? `(${basket.length}) Yune's Snack Shelf` : "Yune's Snack Shelf"
}, [basket.length])
```

The dependency is `basket.length`: the only value it reads. (Lesson 33 shows React 19's `<title>` element, which does this without an effect.)
