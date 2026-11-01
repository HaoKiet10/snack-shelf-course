---
title: Re-rendering
summary: Log every render and watch exactly what React re-runs when state changes, and why a re-render is not a redraw.
minutes: 12
demo: 07-re-rendering
---

This lesson's demo has a `console.log` at the top of every component, so each **render** (each time React calls the function) shows up in the console. It also has a temporary "Re-render App" button. Open the demo in its own tab, press F12, open the Console, and click around.

## What you will see

**Page load:** every component renders, from the top down.

```text
render App: demo=0
render Header
render SnackCard Pocky: likes=0
render SnackCard Onigiri: likes=0
render SnackCard Melon Pan: likes=0
```

**Like Pocky:** only Pocky re-renders.

```text
render SnackCard Pocky: likes=1
```

**Click "Re-render App":** App and everything inside it re-renders.

```text
render App: demo=1
render Header
render SnackCard Pocky: likes=1     ← its likes survived
render SnackCard Onigiri: likes=0
render SnackCard Melon Pan: likes=0
```

Every line appears twice. That is StrictMode, explained below.

## The two rules

**A state change re-renders the component that owns the state.** `setLikes` lives in Pocky's card, so React re-runs Pocky's card. Nothing above it is affected.

**When a component re-renders, all of its children re-render too.** App's state changed, so App ran again. Its JSX contains `<Header />` and three `<SnackCard />`s, so React calls all of them again, **even though their props did not change**. Header has no props at all and still re-ran.

```diagram
state changes here ──▶ App ◀── re-renders
                       ├─ Header        ◀── re-renders (child)
                       └─ main
                          ├─ SnackCard  ◀── re-renders (child)
                          ├─ SnackCard  ◀── re-renders (child)
                          └─ SnackCard  ◀── re-renders (child)
```

Re-renders flow **down** the tree. Never up, never sideways to siblings.

## A re-render is not a redraw

A render is React **calling your function** to get a new description. It is not touching the DOM.

```diagram
1. RENDER   React calls your components → new description
2. COMPARE  React diffs it with the previous description
3. COMMIT   React changes ONLY the DOM nodes that differ
```

When App re-rendered, Header and the cards ran again but produced **identical** output, so React changed nothing in the DOM for them. The only DOM change was the demo button's number. You can watch this in DevTools: in **Elements**, changed nodes flash; the cards do not.

That is why re-renders are usually cheap: calling a few small functions and comparing objects. The expensive part, the DOM, only changes where something really changed.

## State survives re-renders

After the App re-render, Pocky still has `likes=1`. Its card ran again, but `useState(0)` ignores the 0 after the first render and returns what is in the box. State is only lost when a component is **removed** from the tree, or when the tree changes shape at that spot. (You will meet that in lesson 9.)

## Why every log appears twice

`main.tsx` wraps App in `<StrictMode>`. In **development only**, it calls each component twice per render and throws the second result away. The purpose: catching **impure** components, ones that do something besides calculating their output, like changing an outside variable. Doing it twice exposes those bugs. The production build renders once.

That is also why components must be **pure**: same props and state in, same JSX out, no side effects during render. A `console.log` is harmless; changing a global variable is not.

## What triggers a render

1. The first mount: `createRoot(...).render(<App />)`.
2. The component's own state changes.
3. Its parent re-renders.
4. A context it reads changes (a later topic).

Props changing is not a separate trigger: props only change because the parent re-rendered.

## Performance, briefly

"Every child re-renders" sounds wasteful, but for most apps it is fine because renders are cheap. When it matters, React can **skip** children whose props have not changed (`memo`), and the **React Compiler** adds that skipping automatically at build time. This course's code does not use the compiler, so you see the raw behaviour. Do not optimise until something is actually slow.

## Check yourself

<details>
<summary>You click the heart on Onigiri. Which components render?</summary>

Only Onigiri's SnackCard (twice in development, because of StrictMode). App, Header and the other cards do not run.
</details>

<details>
<summary>App re-renders and Header's output is identical. Does React touch Header's DOM nodes?</summary>

No. Header's function runs, but the comparison finds nothing different, so the commit step leaves its DOM alone.
</details>

<details>
<summary>Why does Pocky's like count survive when App re-renders?</summary>

The count lives in React's box for that card, not in the function. The card stays in the same place in the tree, so React keeps its box and `useState` returns the stored value.
</details>
