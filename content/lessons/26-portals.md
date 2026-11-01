---
title: Portals and toasts
summary: Add "Pocky added to the basket · Undo" notifications. A toast system built from context, timers in refs, and a portal that renders the toasts straight into the page body, wherever in the tree they were asked for.
minutes: 18
demo: 26-portals
---

Press **+ 🧺** and a small message slides in at the bottom: *Pocky added to the basket*, with **Undo**. It disappears after four seconds, or when you close it.

## Where should a toast live in the DOM?

The add button is deep in the tree: `Layout → main → ShelfPage → Shelf → ErrorBoundary → SnackCard`. If the toast were rendered there, it would be **inside the card** in the DOM. Then:

- `overflow: hidden` on any parent would clip it,
- a parent's `z-index` or `transform` would trap it in that parent's stacking layer, under other things,
- `position: fixed` stops being relative to the screen inside a parent with `transform`.

Modals, toasts, tooltips and menus all have this problem. They belong to a deep component **logically**, but must sit at the top of the page **visually**.

## createPortal

```tsx
import { createPortal } from 'react-dom'

createPortal(<div className="toasts">…</div>, document.body)
```

`createPortal(jsx, domNode)` renders JSX into a **different DOM node** than its parent's, here directly into `<body>`. In the DOM, the toasts are a child of `body`, outside everything. In the **React tree**, they stay where you wrote them, which means:

- they can read context from their React parents,
- their state is owned by the component that rendered them,
- events **bubble through the React tree**, not the DOM tree. A click inside a portal reaches `onClick` handlers on its React ancestors, even though in the DOM they are elsewhere.

That split, *logically here, physically there*, is all a portal is.

## A toast system

Three pieces, the same shape as lesson 19's contexts.

```ts
// context/ToastContext.ts
export type ToastValue = {
  show: (message: string, action?: ToastAction) => void
}
export const ToastContext = createContext<ToastValue | null>(null)
export function useToast(): ToastValue { /* useContext + null check */ }
```

Any component can call `useToast().show(...)`. It does not need to know where toasts are drawn.

```tsx
// context/ToastProvider.tsx
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, number>())

  function dismiss(id: number) {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function show(message: string, action?: ToastAction) {
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, message, action }].slice(-MAX_TOASTS))
    timers.current.set(id, window.setTimeout(() => dismiss(id), TOAST_MS))
  }

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  return (
    <ToastContext value={{ show }}>
      {children}
      {createPortal(
        <div className="toasts" role="status" aria-live="polite">
          {toasts.map(({ id, message, action }) => ( /* message, action button, ✕ */ ))}
        </div>,
        document.body,
      )}
    </ToastContext>
  )
}
```

Things from earlier lessons doing the work:

- **State** holds the visible toasts (they are on screen). `.slice(-MAX_TOASTS)` keeps at most three.
- **Refs** hold the id counter and the timer ids (lesson 20): needed between renders, never shown.
- An **effect cleanup** cancels the timers if the provider goes away. It copies `timers.current` into a variable first, because by the time a cleanup runs, a ref may point somewhere else; the linter warns about this.
- `role="status"` with `aria-live="polite"` makes screen readers **announce** new toasts when the user is not busy, without moving focus.

The toast's button closes over `action` from the destructured toast, so TypeScript knows it is defined inside the `&&`.

## Undo

```tsx
function add(snack: Snack) {
  const before = lines.find((l) => l.id === snack.id)?.qty ?? 0
  dispatch({ type: 'added', id: snack.id })
  toast.show(`${snack.name} added to the basket`, {
    label: 'Undo',
    onClick: () => dispatch({ type: 'quantityChanged', id: snack.id, qty: before }),
  })
}
```

Undo is just the action that puts things back, remembered in a closure when the toast is made. A toast with Undo is often friendlier than an "Are you sure?" dialog: the common case is one click, and mistakes are still cheap to fix.

## What about dialogs?

The browser's own `<dialog>` element, opened with `showModal()`, renders in a special **top layer** above everything, traps focus inside, and closes on Escape. For modals, use it before reaching for a portal; it solves the stacking problem by itself. Portals are still the tool for things the top layer does not cover, like toasts and tooltips, and for older code you will meet.

## Check yourself

<details>
<summary>What does <code>createPortal</code> change, and what does it leave the same?</summary>

It changes where the JSX goes in the DOM. Its place in the React tree stays the same, so context, state and event bubbling work as if it were rendered in place.
</details>

<details>
<summary>Why render toasts into <code>document.body</code> instead of next to the button?</summary>

A parent's `overflow`, `z-index` or `transform` could clip or bury them. At the top of the body, nothing above them in the DOM can.
</details>

<details>
<summary>Why are the timer ids in a ref, and the toasts in state?</summary>

The toasts are on screen, so changes must re-render. The timer ids are only needed to cancel timers, never displayed, so a ref is enough.
</details>

<details>
<summary>What does <code>aria-live="polite"</code> do?</summary>

It asks screen readers to announce content added to that region, when they finish what they are currently reading, without moving focus.
</details>
