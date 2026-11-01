---
title: useRef
summary: Press / anywhere to jump to the search box, and see a tick on the basket button after each add. Both need useRef, the box React keeps for values that should not cause a re-render, including real DOM elements.
minutes: 15
demo: 20-use-ref
---

Press <kbd>/</kbd> anywhere on the page and the cursor jumps to the search box. After **+ 🧺**, the button shows **✓** for a second. Each feature needs something React normally keeps away from you.

## A box that does not re-render

```tsx
const ref = useRef(initialValue)
ref.current          // read it
ref.current = 5      // change it
```

`useRef` gives you an object with one property, `current`. React keeps the same object for the component's whole life, like state. But **changing `ref.current` does not re-render**. React does not even know you changed it.

| | state | ref |
|---|---|---|
| survives re-renders | yes | yes |
| changing it re-renders | yes | no |
| read during render to show it | yes | no, the screen will not update |
| use for | anything shown on screen | DOM elements, timer ids, other "behind the scenes" values |

The test: **does the screen depend on it?** If yes, state. If no, a ref is fine.

## Refs to DOM elements

React builds the DOM for you, so you rarely touch it. But some things only the real element can do: `focus()`, `scrollIntoView()`, measuring its size, playing a video. For those, put a ref on the element:

```tsx
const inputRef = useRef<HTMLInputElement>(null)

<input ref={inputRef} … />
```

After rendering, React sets `inputRef.current` to the real `<input>` DOM node. Before that (during the first render) it is `null`, which is why the type is `HTMLInputElement | null` and you write `?.`:

```tsx
inputRef.current?.focus()
```

## Press / to search

```tsx
useEffect(() => {
  function onKey(e: globalThis.KeyboardEvent) {
    const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
    if (e.key === '/' && !typing) {
      e.preventDefault()          // don't type the "/" itself
      inputRef.current?.focus()
    }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])
```

A key press **anywhere** on the page means listening on `window`, which is outside React, so it is an effect (lesson 12) with a cleanup that removes the listener. Without the cleanup, every time SearchBar mounted it would add another listener and never remove the old ones.

`globalThis.KeyboardEvent` is the browser's own event type. The bare name `KeyboardEvent` in this file is React's (imported for `onKeyDown`), and the two are different types.

The `typing` check stops the shortcut from stealing a `/` you are typing into a field. Escape got smarter too: the first press clears the search, a second press on an empty box calls `inputRef.current?.blur()` to leave it. And Clear puts the cursor back in the box with `focus()`, so you can type the next search straight away.

## The ✓ flash: a ref for a timer

```tsx
const [justAdded, setJustAdded] = useState(false)
const timerRef = useRef<number | undefined>(undefined)

function handleAdd() {
  onAdd()
  setJustAdded(true)
  window.clearTimeout(timerRef.current)  // clicked again: restart the second
  timerRef.current = window.setTimeout(() => setJustAdded(false), ADDED_MS)
}

useEffect(() => {
  return () => window.clearTimeout(timerRef.current)
}, [])
```

`justAdded` is **state**: it changes what the button shows. The timer id is a **ref**: we need it later to cancel the timer, but it is never shown, and changing it should not re-render.

Why not a plain `let timer` variable? Because the component function runs again on every render, and a plain variable starts fresh each time. The id from the previous render would be lost, and clicking twice quickly could not cancel the first timer. A ref survives re-renders.

The effect with only a cleanup and `[]` means "when this card goes away, cancel any timer". Search while the ✓ is showing and the card unmounts; without the cleanup, the timer would still fire a second later for a card that no longer exists.

## Do not read refs to render

```tsx
// ❌ the screen won't update when this changes
const clicks = useRef(0)
<button onClick={() => clicks.current++}>Clicked {clicks.current} times</button>
```

The count does change, but nothing tells React to re-render, so the text stays stale until something else causes a render. If it is on the screen, it is state.

Refs are an **escape hatch**, like effects: a way out of React's model for the few things that need it. Most components never use one. If you are reaching for refs to change what is displayed, you probably want state.

## Check yourself

<details>
<summary>What is the difference between changing state and changing <code>ref.current</code>?</summary>

Both values survive re-renders, but setting state re-renders the component, and changing a ref does not.
</details>

<details>
<summary>Why is <code>inputRef.current</code> sometimes <code>null</code>?</summary>

React fills it in after the element is put in the DOM. During the first render, and after the element is removed, there is no element, so it is `null`.
</details>

<details>
<summary>Why is the timer id in a ref and not in a <code>let</code> variable?</summary>

The component function runs again on every render, so a local variable is recreated each time and the old id is lost. A ref keeps the same value across renders.
</details>

<details>
<summary>Why does the <code>/</code> shortcut need an effect with a cleanup?</summary>

It listens on `window`, outside React. The effect adds the listener after mounting, and the cleanup removes it on unmount, so listeners do not pile up.
</details>
