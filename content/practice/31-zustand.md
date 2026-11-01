## Q
Where does a Zustand store's state live?

- [x] Outside React, in a module, with a hook to read it
- [ ] In the component that created it
- [ ] In a React context
- [ ] In `localStorage` only

> That's why there's no provider: any file can import the store.

## Q
`Shelf` uses `useBasketStore((s) => s.dispatch)`. Does it re-render when something is added to the basket?

- [x] No; its selector picks `dispatch`, which never changes
- [ ] Yes, every store change re-renders every reader
- [ ] Only in development
- [ ] Only if it's on screen

> Zustand re-renders a component only when its selector's result changes.

## Q
What's wrong with `useBasketStore((s) => ({ lines: s.lines, count: s.lines.length }))`?

- [ ] Nothing
- [x] It returns a new object every time, so it always counts as changed; in Zustand 5 that causes an endless render loop
- [ ] Selectors can't use `.length`
- [ ] It saves to storage twice

> Select values separately, or wrap the selector in `useShallow`.

## Q
What does `persist(…, { name: 'snack-shelf-basket-store' })` do?

- [ ] Sends the basket to a server
- [ ] Shares it between browser tabs instantly
- [x] Saves the store to `localStorage` under that name and loads it on start
- [ ] Makes the store read-only

> It replaced lesson 18's hand-written save-and-load hook.

## Q
Which state is the best fit for a Zustand store in this app?

- [ ] The search text
- [x] The basket: client state that many components read and that changes often
- [ ] The snacks from the server
- [ ] Whether the ✓ flash is showing

> Local UI state stays in `useState`, server state in TanStack Query, shareable state in the URL.

## Exercise: A likes store
Move the likes from `LikesContext` into a Zustand store with `persist`, and delete `LikesProvider`. Cards should re-render only when their own snack's likes change.

### Hint
The store holds `likes` and a `like(id)` action. Each card can select just its own number: `useLikesStore((s) => s.likes[id] ?? 0)`.

### Solution
```ts
type LikesStore = {
  likes: Record<string, number>
  like: (id: string) => void
}

export const useLikesStore = create<LikesStore>()(
  persist(
    (set) => ({
      likes: {},
      like: (id) => set((s) => ({ likes: { ...s.likes, [id]: (s.likes[id] ?? 0) + 1 } })),
    }),
    { name: 'snack-shelf-likes-store', partialize: (s) => ({ likes: s.likes }) },
  ),
)
```

```tsx
// inside the card (or a small wrapper around it)
const likes = useLikesStore((s) => s.likes[id] ?? 0)
const like = useLikesStore((s) => s.like)
```

Selecting one number per card is what makes only that card re-render.
