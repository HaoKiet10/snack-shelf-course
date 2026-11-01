## Q
What makes the snacks **server state**?

- [ ] They never change
- [ ] They're fetched with TanStack Query
- [ ] They're stored in React state
- [x] They're a local copy of data that lives on a server and can change there, so they can be loading, failed or stale

> The basket, by contrast, is client state: only this app creates and changes it.

## Q
Three components call `useQuery({ queryKey: ['snacks'], queryFn: loadSnacks })` at once. How many requests?

- [ ] None until one of them asks
- [ ] It depends on StrictMode
- [ ] Three
- [x] One; they share the cache entry for `['snacks']`

> The query's state lives in the QueryClient's cache, keyed by `queryKey`. Requests for the same key are deduplicated.

## Q
What does `staleTime: 60_000` do?

- [ ] Waits a minute before the first fetch
- [ ] Deletes the data after a minute
- [x] Treats fetched data as fresh for a minute, so it isn't refetched in that time
- [ ] Retries failed requests for a minute

> After that, the data is still shown immediately, but refreshed in the background when needed.

## Q
How does TanStack Query know `loadSnacks` failed?

- [ ] It doesn't; you must set `isError` yourself
- [x] The returned promise rejects: `loadSnacks` throws on a bad response
- [ ] It checks the HTTP status itself
- [ ] It compares the data with the last result

> That's why lesson 12's `if (!res.ok) throw …` matters: `fetch` alone only rejects on network failures.

## Q
Where should the basket live after this lesson?

- [ ] In a query, so it's cached
- [ ] In the QueryClient's default options
- [ ] In `snacks.json`
- [x] Where it was: it's client state, owned by the app, not a copy of server data

> TanStack Query is for server state. Putting client state in it adds complexity for nothing.

## Exercise: One snack, one query
On the snack page, fetch the single snack with its own query, keyed by id: `['snack', id]`. (Pretend the server has `snack-<id>.json` files; you can use the list and `find` inside the query function.)

### Hint
The key includes the id, so each snack gets its own cache entry. `queryFn` can reuse `loadSnacks`.

### Solution
```ts
export function useSnack(id: string | undefined) {
  return useQuery({
    queryKey: ['snack', id],
    queryFn: async () => {
      const snacks = await loadSnacks()
      return snacks.find((s) => s.id === id) ?? null
    },
    enabled: id !== undefined,   // don't run without an id
  })
}
```

Each id has its own entry: visiting Pocky, then Mochi, then Pocky again shows Pocky from the cache.
