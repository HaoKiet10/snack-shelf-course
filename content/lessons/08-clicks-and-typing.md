---
title: Clicks and typing
summary: Events in React, typing the event object, and the controlled input: a search box whose text lives in state.
minutes: 15
demo: 08-clicks-and-typing
---

The shelf gets a search box. Type in it, press Escape, try typing more than 20 characters. The cards do not filter yet; that needs lists, in the next lesson.

## Events in React

```tsx
<button onClick={() => setQuery('')}>Clear</button>
<input onChange={handleChange} onKeyDown={handleKeyDown} />
```

- Prop names are **camelCase**: `onClick`, `onChange`, `onKeyDown`, `onSubmit`, `onMouseEnter`.
- You pass a **function**, and React calls it with an **event object**.
- Same idea as `addEventListener`, but you never attach or remove listeners yourself.

Two ways to write a handler. Inline, for one-liners:

```tsx
onClick={() => setQuery('')}
```

Or a named function, when there is logic or you need the event:

```tsx
function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Escape') {
    setQuery('')
  }
}
...
onKeyDown={handleKeyDown}       // no () here
```

The convention: `on...` is the prop, `handle...` is your function.

## The event object, typed

```tsx
import type { ChangeEvent, KeyboardEvent } from 'react'

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  e.target.value   // TypeScript knows: string
}
```

`ChangeEvent<HTMLInputElement>` reads as "a change event that came from an `<input>`", so TypeScript knows `e.target` has a `.value`. Inline handlers need no annotation, because TypeScript infers the type from where the function is used:

```tsx
onChange={(e) => setQuery(e.target.value)}   // e is typed automatically
```

`import type` imports something used only for types; it disappears completely from the JavaScript output.

## Controlled inputs

```tsx
const [query, setQuery] = useState('')

<input
  value={query}            // state → input
  onChange={handleChange}  // input → state
/>
```

That is a loop:

```diagram
you press "p"
   │
   ▼
onChange fires with e.target.value = "p"
   │
   ▼
setQuery("p")          → React re-renders App
   │
   ▼
<input value="p">      → React makes the input show "p"
```

**React state is the single source of truth.** The input does not own its text; it displays `query`. This is a **controlled input**.

What it buys you is control. Every keystroke passes through your code before it reaches the screen:

```tsx
function handleChange(e: ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value.slice(0, MAX_QUERY))
}
```

Type a 21st character and `slice` cuts it off: state stays at 20, so the input shows 20. You could force uppercase or strip digits the same way. And because the text lives in state, anything else can use it: the hint line, the Clear button's `disabled={query === ''}`, and next lesson the filter.

**The classic bug** is `value` without `onChange`:

```tsx
<input value={query} />   // ❌ frozen: you type, nothing appears
```

The input shows `query`, but nothing ever updates `query`. React warns about it. If you only want a starting value and do not care afterwards, use `defaultValue`, an *uncontrolled* input.

`query` lives in App, not in a separate SearchBar component, because the cards will need it to filter, and App is the parent of both.

## onChange or onKeyDown?

They answer different questions. **onChange**: did the value change? It gives you the new text. **onKeyDown**: which key was pressed? It fires whether or not the text changed.

| Action | onKeyDown | onChange |
|---|---|---|
| type "a" | yes, `e.key = "a"` | yes, value now ends in "a" |
| Escape, Enter, arrows, Shift | yes | no: the text did not change |
| paste with the mouse | no: no key pressed | yes |
| autofill, phone suggestions, voice typing | often no | yes |

So the search box uses each for what it is good at: `onChange` for the text, because it catches every way the value can change, and `onKeyDown` for Escape, which does not change the text.

The order of events for one key press:

```diagram
keydown   ← onKeyDown: e.key = "p", value is still the OLD text
   ▼
(browser inserts "p")
   ▼
input     ← onChange: value is the NEW text
   ▼
keyup
```

That is why `onKeyDown` is the wrong place to read the text, and why it can block a key before anything happens with `e.preventDefault()`.

One quirk: in plain DOM, the `change` event fires only when you leave the field. React's `onChange` is wired to the DOM `input` event, so it fires on every change. In plain-JavaScript tutorials, `"change"` means something different.

### Try it: an event log

Drop this component into the app to watch both events:

```tsx
import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

export default function EventLog() {
  const [text, setText] = useState('')
  const [log, setLog] = useState<string[]>([])

  function add(line: string) {
    setLog((prev) => [line, ...prev].slice(0, 15))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // the OLD text: the key hasn't been applied yet
    add(`keyDown  key="${e.key}"  value="${e.currentTarget.value}"`)

    if (e.key === 'Escape') {
      setText('')
    }
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()   // block digits before they reach the input
      add('         ↳ digit blocked, onChange will NOT fire')
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    add(`change   value="${e.target.value}"`)
    setText(e.target.value)
  }

  return (
    <div style={{ padding: 24 }}>
      <input value={text} onChange={handleChange} onKeyDown={handleKeyDown} />
      <pre>{log.join('\n')}</pre>
    </div>
  )
}
```

Two details: with an empty array, TypeScript cannot guess what goes inside, so `useState<string[]>([])` says so. And for keyboard events React types `e.target` loosely (events bubble, so it could be any element), while `e.currentTarget` is always the element the handler is on, so TypeScript knows it is an input.

Note that pasting "123" with the mouse still gets digits in, because it skips `keydown` entirely. To truly forbid something, filter in `onChange`, like the 20-character limit.

## Two more event behaviours

- `e.preventDefault()` stops the browser's default action. You need it in `<form onSubmit>`, which otherwise reloads the page.
- Events **bubble**: a click on a button also fires `onClick` on every ancestor. `e.stopPropagation()` stops that.

## Check yourself

<details>
<summary>You delete <code>onChange={handleChange}</code> but keep <code>value={query}</code>. What happens?</summary>

The input freezes. It always displays `query`, and nothing updates `query` any more, so whatever you type is immediately replaced by the old value. React warns in the console.
</details>

<details>
<summary>Why is <code>onKeyDown={handleKeyDown}</code> written without <code>()</code>?</summary>

`onKeyDown` needs a function to call later. `handleKeyDown()` would call it immediately during render and pass its result instead.
</details>

<details>
<summary>How does the 20-character limit work without a <code>maxLength</code> attribute?</summary>

The input only ever shows `query`, and `handleChange` stores at most 20 characters with `slice`. The 21st character arrives in the event, is cut off, and the input re-renders showing the same 20.
</details>
