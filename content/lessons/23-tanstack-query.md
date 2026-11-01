---
title: TanStack Query
summary: Replace the hand-written loading effect and the snacks context with TanStack Query. One fetch shared by every page, a cache, retries and background refreshing, from about ten lines.
minutes: 20
demo: 23-tanstack-query
---

The app looks the same, but it fetches less. Open DevTools → Network, go from the shelf to a snack page to the basket and back: `snacks.json` is requested **once**.

## Server state is different

Look at what the app stores:

| | where it comes from | who can change it |
|---|---|---|
| query, basket, likes | the user, in this browser | only this app |
| the snacks | a server | the server, any time |

The snacks are **server state**: a copy of data that lives somewhere else. A copy can be loading, can fail, can go **stale** when the server changes it, and might be needed by several components at once. Lesson 12's effect handled the first two. Lesson 19's context handled sharing. Neither knows when the copy is stale, and every app needs the same code again for every endpoint.

**TanStack Query** is a library for exactly this: you say what to fetch, and it manages the copy.

```bash
npm install @tanstack/react-query
```

## One client for the whole app

```tsx
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

<QueryClientProvider client={queryClient}>
  <HashRouter>…</HashRouter>
</QueryClientProvider>
```

The `QueryClient` holds the **cache**: every result fetched, by key. `QueryClientProvider` is a context provider (lesson 19), so any component can reach it.

## useQuery

```ts
export function useSnacks() {
  const query = useQuery({
    queryKey: ['snacks'],
    queryFn: loadSnacks,
  })

  let status: Status = 'ready'
  if (query.isPending) status = 'loading'
  else if (query.isError) status = 'error'

  return {
    snacks: query.data ?? [],
    status,
    retry: () => void query.refetch(),
    isFetching: query.isFetching,
  }
}
```

- **`queryKey`** names the data in the cache. Every `useQuery` with the key `['snacks']` shares one entry. Keys are arrays so they can hold parameters: one snack would be `['snack', id]`, a separate entry per id.
- **`queryFn`** is how to get it: any function that returns a Promise. `loadSnacks` from lesson 12 works unchanged, including its `throw` on a bad response, which is how TanStack Query knows it failed.

The hook keeps the shape the components already use (`snacks`, `status`, `retry`), so no page had to change beyond its import.

What it replaced: the three `useState`s, the effect with its `ignore` flag and cleanup, the `attempt` counter, **and** `SnacksContext` with its provider. Both files are deleted.

## Why the context could go

Lesson 18 said calling a hook twice means two separate states, which is why lesson 19 needed a context. `useQuery` is different: its state lives in the **QueryClient's cache**, not in the component. Ten components calling `useSnacks()` all read the same cache entry. The first one to mount starts the fetch; the others wait for the same request. So `useSnacks()` can be called directly anywhere, and the context has nothing left to do.

## The things you get for free

**Caching.** Leave the shelf and come back: the snacks are already in the cache, so there is no loading message at all.

**Freshness.** `staleTime: 60_000` says the data counts as fresh for a minute. After that it is *stale*: still shown immediately, but refetched in the background the next time a component needs it, or when you come back to the browser tab. You see old data instantly and new data a moment later, never a spinner over data you already had. The default `staleTime` is 0, which refetches very eagerly; a minute suits a snack list.

**Retries.** A failed request is retried before giving up. The default is three times with growing pauses, which means about seven seconds before an error shows. `retry: 1` makes it one retry here.

**Status flags.** `isPending` means there is no data yet. `isFetching` means a request is running, including background refreshes. The retry button uses it to show "Trying again…".

**Request deduplication**, so StrictMode's double effects in development, two components mounting at once, or a quick double-click on retry still mean one request.

## What not to put in it

TanStack Query is for **server state**. The basket and likes stay where they are: they are client state, owned by this app, and nothing else can change them. Putting them in a query cache would be like caching your own thoughts.

Changing server data (like posting the order in lesson 22) is the other half, called **mutations**: `useMutation` handles pending and error state for the request, and you can tell the cache which queries to refetch afterwards. With a real server, that is the next step for the checkout.

## Check yourself

<details>
<summary>What is server state, and how is it different from the basket?</summary>

A local copy of data that lives on a server and can change there at any time, so it can be loading, failed or stale. The basket is client state: only this app creates and changes it.
</details>

<details>
<summary>Why could <code>SnacksContext</code> be deleted?</summary>

`useQuery` keeps its data in the shared QueryClient cache, not in the component. Every component using the same key reads the same entry, so a context to share it is no longer needed.
</details>

<details>
<summary>What does <code>staleTime</code> control?</summary>

How long fetched data counts as fresh. While fresh it is never refetched; once stale it is still shown, but refreshed in the background when needed.
</details>

<details>
<summary>How does <code>useQuery</code> know <code>loadSnacks</code> failed?</summary>

The promise rejects: `loadSnacks` throws when the response is not OK, and a failed `fetch` throws on its own.
</details>
