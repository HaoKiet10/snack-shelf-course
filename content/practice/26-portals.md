## Q
What does `createPortal(jsx, document.body)` change?

- [ ] It opens a new browser window
- [x] Where the JSX goes in the DOM; its place in the React tree stays the same
- [ ] The component's place in the React tree
- [ ] Nothing; it's only for styling

> Logically here, physically there: context and state work as if it were rendered in place.

## Q
A click happens inside a portal. Which `onClick` handlers can it reach as it bubbles?

- [ ] Only DOM ancestors in `<body>`
- [x] Its ancestors in the React tree, even though they're elsewhere in the DOM
- [ ] Every handler on the page
- [ ] None; portals stop events

> React events follow the React tree. This surprises people with modals inside clickable cards.

## Q
Why render toasts into `document.body` instead of next to the button?

- [ ] Screen readers only read the body
- [ ] Buttons can't contain text
- [ ] It's faster
- [x] A parent's `overflow`, `z-index` or `transform` could clip or bury them

> At the top of the body, nothing above them in the DOM can interfere.

## Q
Why are the toasts' timer ids kept in a ref?

- [x] They're needed to cancel timers, but never shown, so changing them shouldn't re-render
- [ ] State can't hold numbers
- [ ] So the timers run faster
- [ ] Refs are required for timers

> The toasts themselves are on screen, so they're state.

## Q
For a modal dialog, what does the lesson suggest trying first?

- [x] The native `<dialog>` element with `showModal()`, which uses the browser's top layer
- [ ] An iframe
- [ ] A portal into `document.body`
- [ ] `position: absolute` and a high z-index

> `showModal()` puts the dialog above everything, traps focus and closes on Escape.

## Exercise: Different kinds of toast
Let `show` take an optional `tone: 'info' | 'error'`, and show error toasts in the accent colour. Use it to show "Couldn't add, basket is full" when a snack is already at the maximum.

### Hint
Add `tone` to the `Toast` type and to `show`'s parameters, and set a class from it. Check the line's quantity against `MAX_QTY` before dispatching.

### Solution
```ts
type Toast = { id: number; message: string; action?: ToastAction; tone: 'info' | 'error' }

function show(message: string, action?: ToastAction, tone: 'info' | 'error' = 'info') {
  const id = nextId.current++
  setToasts((prev) => [...prev, { id, message, action, tone }].slice(-MAX_TOASTS))
  timers.current.set(id, window.setTimeout(() => dismiss(id), TOAST_MS))
}
```

```tsx
<div className={tone === 'error' ? 'toast toast-error' : 'toast'} key={id}>
```

```css
.toast-error { background: var(--accent); color: white; }
```

Update `ToastValue`'s type to match. Errors could also use `role="alert"` so screen readers announce them at once.
