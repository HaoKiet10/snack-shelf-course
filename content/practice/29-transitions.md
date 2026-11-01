## Q
What makes an update "non-urgent"?

- [ ] It's skipped entirely
- [x] React renders it in the background and abandons it if a more urgent update comes in
- [ ] It happens in a `setTimeout`
- [ ] It runs on a different thread

> Typing is urgent. Showing the results can wait a moment, as long as typing never waits for it.

## Q
While you type with the slow device on, what is `deferredQuery`?

- [ ] The previous letter only
- [ ] An empty string until you stop typing
- [x] The value the shelf last finished rendering with; it catches up after the background render
- [ ] Always the same as `query`

> `query` is what's in the box now; `deferredQuery` lags behind it.

## Q
Sorting is set by our own click handler. Which tool fits?

- [x] `useTransition`, wrapping `setSort` in `startTransition`
- [ ] `useMemo`
- [ ] `useDeferredValue`
- [ ] `useEffect`

> When you write the code that sets the state, wrap it in a transition. When you only receive a value, defer it.

## Q
Why did the search text move back into `useState` in this lesson?

- [ ] To fix a TypeScript error
- [ ] URLs can't hold search text
- [x] React Router updates the URL in a transition, which is non-urgent, so an input reading it would lag
- [ ] `useDeferredValue` doesn't work with the URL

> A controlled input's value must come from an urgent update. The URL is still updated, just after.

## Q
Do transitions make a slow render faster?

- [x] No; the render takes as long, but the app stays responsive while it happens
- [ ] Yes, they split the work across threads
- [ ] Only with the React Compiler
- [ ] Yes, in production only

> First make the work smaller; use transitions for the work that remains.

## Exercise: A pending hint
While a sort is pending, show a small "Sorting…" label next to the sort buttons.

### Hint
`isPending` from `useTransition` is already there. Render the label with `&&`, and give it `role="status"` so screen readers hear it.

### Solution
```tsx
<SegmentedControl … />
{isPending && <span className="sorting" role="status">Sorting…</span>}
```

Only `isPending`, not `isStale`: the search already fades the results, and a label for every keystroke would be noisy.
