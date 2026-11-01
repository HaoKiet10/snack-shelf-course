---
title: Your first React app
summary: Create a real React and TypeScript project with Vite, follow how the page starts up, and take apart one dense line of React.
minutes: 15
demo: 03-first-react-app
---

## Creating the project

```bash
npm create vite@latest snack-shelf -- --template react-ts
cd snack-shelf
npm install
npm run dev
```

1. **`npm create vite`** downloads Vite's project generator and copies a starter React + TypeScript project into `snack-shelf/`.
2. **`npm install`** reads `package.json` and downloads React, Vite, TypeScript and the rest into `node_modules/`.
3. **`npm run dev`** starts Vite's **dev server**: a small local web server that serves your app and watches your files.

**Why you need a tool like Vite at all.** Browsers cannot run React code as you write it. JSX (`<App />` inside a script) is not valid JavaScript, and neither are TypeScript's types. Vite **translates** both into plain JavaScript every time you save. Create React App used to do this job; it was deprecated in 2025, and Vite is the common choice now.

## The files that matter

```diagram
snack-shelf/
├─ package.json       project ID card: name, scripts, dependencies
├─ index.html         the ONLY html page
├─ vite.config.ts     tells Vite "this is a React project"
├─ tsconfig*.json     TypeScript's rules
├─ node_modules/      downloaded packages (never edit, never share)
├─ public/            files served as-is (favicon)
└─ src/               YOUR code
   ├─ main.tsx        entry point: connects React to the page
   ├─ App.tsx         the top component: what you see
   └─ index.css
```

`.tsx` means "TypeScript that contains JSX". A file without JSX would be `.ts`.

## How the page starts up

**1. `index.html`** has an almost empty body:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

An empty `div` and a script. You will not write HTML here any more: React fills `#root`.

**2. `main.tsx`** is the bridge between React and the DOM:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`document.getElementById('root')` grabs the empty div (the DOM from lesson 1). `createRoot` says "React, this node is yours now". `.render(<App />)` says "draw the App component in there". After this line, React manages everything inside `#root`.

The `!` is TypeScript: `getElementById` might find nothing, so its type is "an element or `null`", and `createRoot` refuses `null`. The `!` says "trust me, it is not null". That is safe here because `index.html` always has `#root`. Use it sparingly: if you are wrong, it crashes at runtime like plain JavaScript would.

`StrictMode` is a development-only helper that deliberately runs some things twice to expose bugs. It does nothing in the final site.

**3. `App.tsx`** is your first component. The core of it:

```tsx
export default function App() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count is {count}
    </button>
  )
}
```

It is the like button from lesson 1, React style. `useState(0)` gives a remembered number and a function to change it. `onClick` is the event listener. `{count}` puts the number in the text. There is **no `textContent =` line anywhere**: you call `setCount`, React calls `App()` again, gets the new description, and updates that one text node. Lesson 2, running for real.

```diagram
index.html  ─loads─▶  main.tsx  ─renders─▶  <App />  ─returns─▶  description
   #root  ◀───────────── React updates the DOM here ◀───────────────┘
```

## Hot Module Replacement

With the dev server running, save a file and Vite pushes **only that change** to the browser. The page updates in about a second without a full reload, and even the count keeps its value. Try it: change the text in `App.tsx` and save while you watch the browser.

## Taking apart one dense line

```tsx
onClick={() => setCount((count) => count + 1)}
```

Three ideas, from the outside in.

**`onClick={ ... }` hands React a function to call later.** The braces mean "this is JavaScript". The value must be a **function**; React stores it and calls it when a click happens, just like `addEventListener("click", fn)`.

**`() => ...` is an arrow function**, a short way to write `function () { return ... }`. Why wrap the call in a function at all? Compare:

```tsx
onClick={() => setCount(5)}   // ✅ "here's a function; call it on click"
onClick={setCount(5)}         // ❌ calls setCount RIGHT NOW, while rendering
```

The name `onClick` does not delay anything. JSX becomes an ordinary function call, roughly `jsx("button", { onClick: setCount(5) })`, and to build that object JavaScript evaluates `setCount(5)` immediately. The parentheses mean "run it now", wherever they appear. Setting state during render triggers another render, which calls it again, and React stops with "Too many re-renders". The arrow function **creates** a function without running its body, so nothing happens until the click.

```js
btn.addEventListener("click", sayHi());          // ❌ sayHi runs NOW
btn.addEventListener("click", sayHi);            // ✅ hands over the function
btn.addEventListener("click", () => sayHi("Yune")); // ✅ wraps it to pass arguments
```

**`setCount((count) => count + 1)` is the updater form.** There are two ways to call a setter:

```tsx
setCount(count + 1)              // A: "set it to this value"
setCount((count) => count + 1)   // B: "compute the new value from the latest one"
```

Inside one render, `count` is a fixed **snapshot**. Calling the setter does not change it; it asks React to render again later. So:

```tsx
// count is 0
setCount(count + 1)  // 0 + 1
setCount(count + 1)  // 0 + 1 again: count is still 0 in this render
setCount(count + 1)  // result: 1

setCount(c => c + 1) // React queues 0 → 1
setCount(c => c + 1) // 1 → 2, it gets the previous result
setCount(c => c + 1) // result: 3
```

Use B when the new value depends on the old one (counters, toggles like `on => !on`). Use A when it does not (`setName("Pocky")`, `setCount(0)`).

## What TypeScript adds

TypeScript is JavaScript plus **types**: you label what kind of value each thing is, and the editor checks it before the code runs. Most professional React code is written in it, and this course uses it from here on. Everything React-specific stays the same; TypeScript is a layer on top that disappears at build time.

One thing to know early: **Vite does not type-check while you develop.** `npm run dev` strips the types and runs the code, which is why it is fast. Type errors show up as red squiggles in your editor, when you run `npx tsc -b`, and in `npm run build`, which refuses to build. A page can run in the browser and still have type errors, so watch the squiggles.

## Check yourself

<details>
<summary><code>index.html</code> has an empty <code>&lt;div id="root"&gt;</code>. Where does the visible content come from?</summary>

From React. `main.tsx` calls `createRoot(...).render(<App />)`, React calls `App()`, gets a description, and creates DOM nodes inside `#root` to match it.
</details>

<details>
<summary>Why can't the browser load <code>App.tsx</code> directly, without Vite?</summary>

It contains JSX and TypeScript types, and neither is valid JavaScript. Vite translates them into plain JavaScript first.
</details>

<details>
<summary>What is wrong with <code>onClick={setCount(5)}</code>?</summary>

`setCount(5)` runs immediately, during render, and `onClick` receives its return value (`undefined`) instead of a function. Setting state during render causes another render, which runs it again, in a loop. Write `onClick={() => setCount(5)}`.
</details>
