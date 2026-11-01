---
title: Components
summary: A component is a function that returns a description of some UI. Split the shelf into a Header and a SnackCard, and meet the component tree.
minutes: 12
demo: 04-components
---

The demo shows a header and three cards, and **all three cards are Pocky**. That is on purpose: the next lesson fixes it.

## What a component is

A component is a JavaScript function that returns a description of some UI. That is the whole definition.

```tsx
// src/components/SnackCard.tsx
export default function SnackCard() {
  return (
    <div className="card">
      <span className="emoji">🍫</span>
      <h2>Pocky</h2>
      <p className="price">$2.50</p>
      <button className="like">❤ 0</button>
    </div>
  )
}
```

Once defined, you use it like a new HTML tag:

```tsx
// src/App.tsx
export default function App() {
  return (
    <>
      <Header />
      <main className="shelf">
        <SnackCard />
        <SnackCard />
        <SnackCard />
      </main>
    </>
  )
}
```

`<SnackCard />` means "call the `SnackCard` function and put whatever it returns here".

## Three rules you can see in the code

**Names start with a capital letter.** That is how React tells the two kinds of tag apart. `<header>` (lowercase) is a built-in HTML element: React creates a real DOM node. `<Header>` (capitalised) is your component: React calls your function. Name it `header` and React makes an empty HTML `<header>` instead.

**Return one root element.** A function returns one thing, so the JSX needs a single outer wrapper. App returns `<Header />` and `<main>`, so they are wrapped in `<> </>`, a **Fragment**: a wrapper that groups things without adding an element to the DOM.

**`className` instead of `class`.** JSX is JavaScript, and `class` is a reserved word there. React uses `className`, which is also the DOM property name (`el.className`).

## Files, import and export

```diagram
src/
├─ main.tsx           unchanged: renders <App /> into #root
├─ App.tsx / App.css  arranges the page
├─ index.css          page-wide basics
└─ components/
   ├─ Header.tsx / Header.css
   └─ SnackCard.tsx / SnackCard.css
```

Each component lives in its own file, with its CSS next to it, so everything about a card is in one place. The CSS is still global, though: `.card` would style any element with that class anywhere on the page.

## The component tree

Lesson 1 had a tree of DOM elements. Now there is a **tree of components** above it:

```diagram
App
├─ Header        → <header><h1/><span/></header>
└─ main.shelf
   ├─ SnackCard  → <div.card>...</div>
   ├─ SnackCard  → <div.card>...</div>
   └─ SnackCard  → <div.card>...</div>
```

React calls `App()`. The result contains `<Header />` and `<SnackCard />`, so React calls those too, and so on down until only plain HTML elements are left, and builds the DOM from them. Open DevTools and look at **Elements**: you only find `div`, `h2` and `button`. The components themselves never appear in the DOM.

Why bother? **Reuse**: write the card once, use it anywhere. **Focus**: each file is small and about one thing. **Composition**: a real app is a deep tree of small components like these.

## Side note: what is `export default`?

A file (a module) can share things in two ways.

```tsx
// Default export: one main thing per file
export default function SnackCard() { ... }
import SnackCard from './components/SnackCard.tsx'   // no braces
import Card from './components/SnackCard.tsx'        // also works: you pick the name

// Named exports: as many as you like
export function formatPrice(n: number) { ... }
export const TAX = 0.1
import { formatPrice, TAX } from './prices.ts'       // braces, exact names
import { formatPrice as fmt } from './prices.ts'     // rename with "as"
```

A file can have at most one default export, and you choose any name when importing it. Named exports must match exactly, so a typo fails at build time. You can mix both: `import React, { useState } from 'react'`. That is why `useState` sits in braces: it is a named export of React.

Which to use is a style choice. React's docs and Vite use `export default` for one component per file, as this course does. Many teams prefer named exports everywhere, because names stay consistent and editors rename them more reliably. Pick one and be consistent.

## The problem you can see

`<SnackCard />` always says Pocky because the function has no input. It is like a function `add()` that always returns 2 + 2. Functions become flexible when they take **arguments**, and components do too:

```tsx
<SnackCard name="Onigiri" price={1.8} emoji="🍙" />
```

Those attributes are **props**. That is the next lesson.

## Check yourself

<details>
<summary>You rename the function to <code>snackCard</code> and write <code>&lt;snackCard /&gt;</code>. What happens?</summary>

Lowercase tags are treated as built-in HTML elements, so React creates an unknown `<snackCard>` element instead of calling your function. Nothing from your component appears, and React warns in the console. TypeScript catches it even earlier: `snackCard` is not a known HTML element, so the line is marked as an error.
</details>

<details>
<summary>Why does App wrap its content in <code>&lt;&gt; &lt;/&gt;</code>?</summary>

A component must return a single root, and App wants to return two siblings (`<Header />` and `<main>`). A Fragment groups them without adding an extra element to the DOM.
</details>

<details>
<summary><code>&lt;SnackCard /&gt;</code> appears three times in App. How many times does the <code>SnackCard</code> function run?</summary>

Three times per render of App, once for each place it is used. (In development, StrictMode doubles that, as lesson 7 shows.)
</details>
