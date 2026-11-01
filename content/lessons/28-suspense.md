---
title: Suspense and lazy loading
summary: Let components wait for data and code without loading states of their own. useSuspenseQuery, Suspense boundaries, errors caught by lesson 25's boundary, and pages split into separate files that load on first visit.
minutes: 22
demo: 28-suspense
---

The pages lost their loading and error checks, and **SnacksStatus** is deleted. Loading and failure are now handled **around** the pages, in one place. And the snack, basket and not-found pages are no longer in the main JavaScript file: each downloads the first time you open it.

## The problem with status checks everywhere

Since lesson 12, every page started like this:

```tsx
const { snacks, status } = useSnacks()
if (status !== 'ready') {
  return <SnacksStatus />
}
```

Every component that needs data must handle "not yet" and "failed" itself, and TypeScript cannot tell that `snacks` is real only after the check. Ten components, ten copies.

## Suspense

**Suspense** moves "not yet" out of the component. A component that needs something not ready yet **suspends**, and React shows the nearest `<Suspense>` boundary's fallback instead, until it is ready:

```tsx
<Suspense fallback={<Panel>Loading…</Panel>}>
  <Outlet />
</Suspense>
```

It is the loading twin of lesson 25's error boundary:

| | catches | shows |
|---|---|---|
| `<Suspense fallback>` | something still loading | the fallback until it is ready |
| error boundary | something that threw | the fallback until reset |

You do not make a component suspend yourself. Libraries do it: TanStack Query, React Router's data APIs, `lazy`, and React 19's `use()`.

## useSuspenseQuery

```ts
export function useSnacks() {
  const { data } = useSuspenseQuery(snacksQuery)
  return { snacks: data }
}
```

`useSuspenseQuery` **never returns** "loading" or "error". While loading it suspends; on failure it **throws** the error during rendering, where an error boundary catches it. So when the line returns, `data` is always there, and its type is `Snack[]`, not `Snack[] | undefined`.

The pages get simpler:

```tsx
export default function SnackPage() {
  const { id } = useParams()
  const { snacks } = useSnacks()       // loaded, or we wouldn't be here
  const snack = snacks.find((s) => s.id === id)
  // …
}
```

The query is now described once, with TanStack Query's `queryOptions` helper:

```ts
export const snacksQuery = queryOptions({
  queryKey: ['snacks'],
  queryFn: loadSnacks,
})
```

and used in several places: `useSuspenseQuery(snacksQuery)` in pages, `useQuery(snacksQuery)` in `BasketProvider`. The provider wraps the **whole app**, and it must not suspend: that would hide everything, header included, while prices load. So it uses the ordinary `useQuery` with an empty list until the data arrives. Same key, same cache entry, still one request.

## Errors, and trying again

```tsx
const { reset: resetQueries } = useQueryErrorResetBoundary()

<ErrorBoundary
  key={location.pathname}
  fallback={(error, retry) => (
    <Panel
      title="Something went wrong on this page"
      action={
        <>
          <button onClick={() => { resetQueries(); retry() }}>Try again</button>{' '}
          <Link to="/">Back to the shelf</Link>
        </>
      }
    >…</Panel>
  )}
>
  <Suspense fallback={<Panel>Loading…</Panel>}>
    <Outlet />
  </Suspense>
</ErrorBoundary>
```

A failed query is thrown into the boundary from lesson 25. "Try again" does two things: `resetQueries()` tells TanStack Query to forget the failed query, and `retry()` (the boundary's `reset`) renders the page again, which starts a new request and suspends while it runs. Order matters: Suspense **inside** the error boundary, so an error while loading still lands in the boundary.

To see it: DevTools → Network → Offline, reload, then go back online and press **Try again**.

## lazy: load a page's code when it is needed

```tsx
const SnackPage = lazy(() => import('./pages/SnackPage.tsx'))
const BasketPage = lazy(() => import('./pages/BasketPage.tsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'))
```

`import('./x')`, written like a function call, is a **dynamic import**: it loads a module when that line runs and returns a Promise. `lazy` turns it into a component that **suspends** until the code has arrived. Vite sees each dynamic import and puts that page in its **own file**:

```text
dist/assets/index-CpZruwCl.js         305 kB    the app, React, the shelf
dist/assets/BasketPage-vDF5tdBU.js    6.7 kB    loaded on first visit to the basket
dist/assets/SnackPage-BOdLC7Pp.js     2.5 kB
dist/assets/NotFoundPage-BfVq4otY.js  0.3 kB
```

The first visit to a snack page shows the same `Loading…` fallback for a moment while its code downloads. Nothing else was needed: the Suspense boundary for data already covers code.

`ShelfPage` stays a normal import. Everyone sees it first, and splitting it out would only add a second request before anything appears. Split what is **big and not needed at the start**: other pages, a rich text editor, a chart library. Here the pages are tiny, so this is mostly to learn the technique; in a large app it can cut the first download in half.

## Where to put Suspense boundaries

Each boundary decides **what disappears while waiting**. One around the page means the header stays and only the page area shows `Loading…`. Put boundaries around the parts that can sensibly appear on their own, the same reasoning as error boundaries. Too few and the whole screen blanks; too many and the page pops in piece by piece.

## Check yourself

<details>
<summary>What happens when a component suspends?</summary>

React stops rendering that part and shows the fallback of the nearest `<Suspense>` boundary above it, then tries again once whatever it was waiting for is ready.
</details>

<details>
<summary>Why can the pages drop their status checks with <code>useSuspenseQuery</code>?</summary>

It suspends while loading and throws on failure, so it only returns when the data is there. Loading and errors are handled by the Suspense and error boundaries around the page.
</details>

<details>
<summary>Why does <code>BasketProvider</code> use <code>useQuery</code> instead of <code>useSuspenseQuery</code>?</summary>

It wraps the whole app. Suspending there would hide everything, including the header, until the snacks loaded.
</details>

<details>
<summary>What does <code>lazy(() =&gt; import('./pages/SnackPage.tsx'))</code> change in the build?</summary>

The page goes into its own JavaScript file, downloaded the first time the page renders. Until then the component suspends.
</details>
