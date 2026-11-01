---
title: Error boundaries
summary: One snack with bad data used to blank the whole page. An error boundary catches a crash while rendering and shows a fallback instead, so one broken card stays one broken card.
minutes: 18
demo: 25-error-boundaries
---

Part three starts by breaking something on purpose. `snacks.json` now has a seventh entry, a **Mystery Snack** with no price and no description. Its card shows "can't be shown right now", and the other six work. Open its page (`#/snack/mystery`) and you get a message with a way back, not a white screen.

## What a crash does without one

In lesson 12, `loadSnacks` ends with `as Snack[]`: we *promised* TypeScript the data was right, and TypeScript believed us. The Mystery Snack breaks the promise. When its card renders:

```tsx
<p className={styles.price}>${price.toFixed(2)}</p>
```

`price` is `undefined`, and `undefined.toFixed` throws. An error thrown **while rendering** means React cannot know what the screen should look like. Showing half a page could be worse than nothing (imagine a bank page with the balance missing), so React's rule is: **if rendering throws and nobody catches it, remove the whole tree**. The page goes white.

Try it in lesson 24's demo with this lesson's data and the whole shelf would vanish because of one snack.

## An error boundary

An **error boundary** is a component that catches errors thrown while rendering anything inside it, and renders a fallback instead.

```tsx
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Caught by an error boundary:', error, info.componentStack)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}
```

Yes, a **class**. React has no hook for catching render errors, so this is the one place modern React code still uses a class component. You write it once and use it everywhere; many projects install the small `react-error-boundary` package instead, which is this same class with more options.

How it works:

- `static getDerivedStateFromError` is called when a child throws during rendering. It turns the error into state, and the next render shows the fallback. (JavaScript can throw anything, not just `Error` objects, so it makes sure it has one.)
- `componentDidCatch` is called afterwards. It is where you would send the error to a logging service. `info.componentStack` says which components it happened in.
- `render` shows the children normally, or the fallback once there is an error.
- `reset` clears the error, so the fallback can offer "try again".

`fallback` is a **render prop**: a function the boundary calls to get JSX, so the fallback can use the error and the reset function.

## Where to put them

Boundaries are like fuses: place them so a failure takes out as little as possible.

**One per card**, in `Shelf`:

```tsx
<ErrorBoundary
  key={snack.id}
  fallback={() => (
    <div className="card-broken" role="note">
      <strong>{snack.name}</strong>
      <span>can't be shown right now</span>
    </div>
  )}
>
  <SnackCard … />
</ErrorBoundary>
```

The key moved from `SnackCard` to the boundary, because the boundary is now the outermost element in the `map` (lesson 9's rule).

**One around every page**, in `Layout`:

```tsx
const location = useLocation()

<ErrorBoundary
  key={location.pathname}
  fallback={(error) => (
    <Panel title="Something went wrong on this page" action={<Link to="/">Back to the shelf</Link>}>
      {import.meta.env.DEV ? error.message : 'Sorry about that. The rest of the shop still works.'}
    </Panel>
  )}
>
  <Outlet />
</ErrorBoundary>
```

The header is outside it, so after a crash you can still navigate. `key={location.pathname}` gives each page a fresh boundary (lesson 9: a new key is a new component), so going to another page clears the error. In development the fallback shows the real message; visitors get a polite sentence.

A good default is one boundary around each page, plus one around any independent widget on a page, so that one widget can fail without hiding the rest.

## What boundaries do not catch

Only errors thrown **while React is rendering** (and in lifecycle code like effects). Not:

| error in | why not | handle it with |
|---|---|---|
| an event handler | it runs after rendering, when React is not drawing anything | `try`/`catch` in the handler |
| async code (a `fetch`, a `setTimeout`) | it finishes later, outside rendering | `.catch`, or put the error in state |
| the boundary itself | it cannot catch its own crash | a boundary further up |

Lesson 28 connects these: a failed query will be *thrown during rendering*, so boundaries can catch data errors too.

## Fixing the cause

The boundary keeps the page alive, but the real fix is not trusting the data. Lesson 30 adds a **type guard** that checks each snack when it arrives and skips malformed ones. Then the boundary is a last line of defence for bugs nobody predicted, which is what it is for.

## Check yourself

<details>
<summary>Why does React remove the whole page when rendering throws?</summary>

It no longer knows what the screen should show, and a half-drawn page could mislead. Unless a boundary catches the error, the safest thing is to show nothing.
</details>

<details>
<summary>Why is <code>ErrorBoundary</code> a class component?</summary>

Catching render errors needs `getDerivedStateFromError` / `componentDidCatch`, and React has no hook equivalent for them.
</details>

<details>
<summary>Why does the page boundary have <code>key={location.pathname}</code>?</summary>

A new key creates a new boundary with no error, so moving to another page clears the fallback instead of showing it everywhere.
</details>

<details>
<summary>A button's click handler throws. Does the boundary catch it?</summary>

No. Event handlers run outside rendering. Catch it in the handler with `try`/`catch` and show an error through state.
</details>
