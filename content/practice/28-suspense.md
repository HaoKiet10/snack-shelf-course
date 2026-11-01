## Q
What happens when a component suspends?

- [ ] It throws an error
- [ ] It renders `null`
- [x] React shows the nearest `<Suspense>` boundary's fallback until it's ready
- [ ] The whole page reloads

> Suspense is the loading twin of an error boundary.

## Q
What does `useSuspenseQuery` return while the data is loading?

- [ ] `undefined`
- [x] Nothing: the component suspends, so the line doesn't return until the data is there
- [ ] `{ status: 'loading' }`
- [ ] An empty array

> That's why the pages could drop their status checks and `data` is never `undefined`.

## Q
A query fails inside `useSuspenseQuery`. Where does the error go?

- [ ] Into `isError`
- [ ] Into the Suspense fallback
- [x] It's thrown during rendering, and the nearest error boundary catches it
- [ ] Into the console only

> Loading goes to Suspense, failure goes to the error boundary.

## Q
Why does `BasketProvider` use `useQuery` rather than `useSuspenseQuery`?

- [ ] It's faster
- [ ] It needs a different query key
- [ ] `useSuspenseQuery` can't be used in providers
- [x] It wraps the whole app; suspending there would hide everything, header included, until the snacks load

> Same key, same cache entry, just a non-suspending way to read it.

## Q
What does `lazy(() => import('./pages/SnackPage.tsx'))` change?

- [ ] The page loads before the app
- [ ] The page renders on the server
- [ ] Nothing in the build
- [x] The page goes into its own JS file, loaded the first time it renders, suspending until then

> `import()` as a function call loads a module on demand; `lazy` wraps it as a component.

## Exercise: A shelf skeleton
Replace the plain "Loading…" fallback with a skeleton: six grey card shapes the size of real cards, so the page doesn't jump when the snacks arrive.

### Hint
Make a `ShelfSkeleton` component that renders the `.shelf` grid with six empty boxes. Use it as the fallback. Respect reduced motion if you animate it.

### Solution
```tsx
export default function ShelfSkeleton() {
  return (
    <div className="shelf" aria-busy="true" aria-label="Loading snacks">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="card-skeleton" />
      ))}
    </div>
  )
}
```

```css
.card-skeleton {
  width: 160px;
  height: 190px;
  border-radius: var(--radius);
  background: var(--lilac);
}
```

```tsx
<Suspense fallback={<ShelfSkeleton />}>
```

Using the index as the key is fine here: the list never changes order (lesson 9's rule 4).
