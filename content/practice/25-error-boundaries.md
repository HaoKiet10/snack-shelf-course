## Q
Rendering throws and no error boundary catches it. What does React do?

- [ ] Reloads the page
- [ ] Skips just the broken component
- [ ] Shows the error message on the page
- [x] Removes the whole tree: the page goes blank

> React can't know what a half-rendered screen should show, so without a boundary it shows nothing.

## Q
Why is `ErrorBoundary` a class component?

- [ ] React Router requires it
- [x] Catching render errors needs `getDerivedStateFromError` / `componentDidCatch`, which have no hook equivalent
- [ ] Classes are faster
- [ ] Hooks can't be used with TypeScript

> It's the one class you write, once. Packages like `react-error-boundary` wrap the same thing.

## Q
A button's `onClick` handler throws. Does the error boundary catch it?

- [ ] Only in development
- [ ] Only if the button is inside the boundary
- [x] No; event handlers run outside rendering. Use `try`/`catch` in the handler
- [ ] Yes, always

> Boundaries catch errors while rendering (and in lifecycle code like effects), not in event handlers or async callbacks.

## Q
Why does the page boundary have `key={location.pathname}`?

- [ ] To make it faster
- [ ] Keys are required on every component
- [x] A new path gives a new boundary with no error, so navigating away clears the fallback
- [ ] To log the path with the error

> Changing a key replaces the component and its state (lesson 9).

## Q
Where are boundaries most useful?

- [x] Around each page, and around independent parts like each card or widget
- [ ] Only around forms
- [ ] Around every single element
- [ ] Only around the whole app

> Like fuses: placed so one failure takes out as little as possible.

## Exercise: Try again
Give the per-card fallback a "Try again" button that resets that card's boundary.

### Hint
The `fallback` function already receives `(error, reset)`.

### Solution
```tsx
<ErrorBoundary
  key={snack.id}
  fallback={(_error, reset) => (
    <div className="card-broken" role="note">
      <strong>{snack.name}</strong>
      <span>can't be shown right now</span>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
```

With bad data it will fail again straight away, which is honest. It helps when the error was temporary.
