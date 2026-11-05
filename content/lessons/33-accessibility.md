---
title: Accessibility
summary: Make the shelf work for keyboard and screen-reader users. A skip link, focus that follows navigation, page titles, real names for icon buttons, hidden decorations, reduced motion, and automated checks with axe, plus what they cannot catch.
minutes: 25
demo: 33-accessibility
---

This lesson changes little you can see, and a lot you can hear. Press <kbd>Tab</kbd> on a fresh page and a **Skip to content** link appears. Open a snack and the browser tab says its name. Turn on a screen reader (Narrator on Windows: <kbd>Ctrl</kbd>+<kbd>Win</kbd>+<kbd>Enter</kbd>; VoiceOver on a Mac: <kbd>Cmd</kbd>+<kbd>F5</kbd>) and the heart button says "Like Pocky, 3 likes" instead of "red heart, 3".

## Who this is for

Around one in six people live with a disability. Some never use a mouse, some use a screen reader, some zoom to 300%, some get sick from motion. Many more are temporarily in the same position: a broken arm, bright sunlight, a phone held in one hand. Accessible apps are also better for everyone: clearer labels, working keyboard shortcuts, sensible headings.

Much of it the course already did: real `<button>`s and `<label>`s, `aria-invalid` on form errors (lesson 22), `aria-pressed` on the sort (lesson 29), `aria-live` toasts (lesson 26). This lesson fixes the gaps.

## Names for things that are only pictures

A screen reader reads a button's **accessible name**, usually its text. "❤ 3" is read as "red heart, 3": no verb, no snack.

```tsx
<button
  className={likeClass}
  onClick={() => onLike(id)}
  aria-label={`Like ${name}, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
>
  ❤ {likes}
</button>
```

`aria-label` replaces the name with a sentence that says what the button does and its current state. The "+ 🧺" button already had one ("Add Pocky to basket").

The opposite case: things that are **only decoration** should be skipped:

```tsx
<span className={styles.emoji} aria-hidden="true">{emoji}</span>
```

Without `aria-hidden`, every card begins "chocolate bar, Pocky". The name already says what it is.

`aria-label` only works on elements that have a **role**: buttons, links, inputs, landmarks. Lesson 17's `<span aria-label="quantity">` was silently ignored. Real text that is visually hidden works everywhere:

```tsx
<span>
  <span className="visually-hidden">Quantity </span>
  {line.qty}
</span>
```

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

It is hidden on screen but still read aloud. (`display: none` would hide it from screen readers too.)

## Structure: one main, headings, titles

Screen-reader users jump around by **landmarks** and **headings**, the way sighted users skim. So:

- **One `<main>`**, in `Layout`, around every page. Before, only the shelf had one (inside `Shelf`), so the basket and snack pages had none.
- **Every page has a heading.** The shelf gained `<h2 className="visually-hidden">All snacks</h2>`: invisible, but "next heading" lands on it.
- **Every page has a title.** React 19 moves a `<title>` rendered anywhere into the document's `<head>`:

```tsx
<title>{`${snack.name} · Yune's Snack Shelf`}</title>
```

The title is the first thing a screen reader announces on a new page, and what you see in tabs and history. (The template string matters: `<title>` must contain one string, not several pieces of JSX.)

## Keyboard: skip link and focus

Keyboard users move with <kbd>Tab</kbd>. Two problems in a single-page app:

**Getting past the header** on every page. A **skip link** is the first focusable thing, visible only while focused:

```tsx
<a className="skip-link" href="#main" onClick={(e) => {
  e.preventDefault()
  mainRef.current?.focus()
}}>
  Skip to content
</a>
<Header />
<main id="main" ref={mainRef} tabIndex={-1}>
```

`tabIndex={-1}` makes `<main>` focusable from code without adding a Tab stop. The click handler focuses it directly, because a `#main` link would be read by the HashRouter as a route.

**Where focus goes after navigating.** A normal website loads a new page and the screen reader starts at the top. A single-page app only swaps content: focus stays on the link you clicked, which may no longer exist, and nothing is announced. So `Layout` moves focus to `<main>` when the path changes:

```tsx
const lastPath = useRef(location.pathname)
useEffect(() => {
  if (lastPath.current === location.pathname) return
  lastPath.current = location.pathname
  mainRef.current?.focus()
}, [location.pathname])
```

It compares with the last path instead of using a "skip the first run" flag. A flag broke in testing: StrictMode runs effects twice in development (lesson 12), so the second run on page load stole focus. Comparing values is safe however often the effect runs.

**Seeing focus.** Every focusable thing gets a clear ring, only for the keyboard:

```css
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

`:focus-visible` shows for keyboard focus and not for mouse clicks. Never remove focus outlines without replacing them.

## Less motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

Operating systems let people ask for less motion. This turns off the meter's slide and the stale fade for them.

## Automated checks, and their limits

**axe** is an open-source accessibility checker. `src/test/axe.ts` runs it over what a test rendered:

```ts
export async function a11yProblems(container: Element): Promise<string[]> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}×)`)
}
```

```tsx
it('the basket and checkout form have no problems', async () => {
  useBasketStore.setState({ lines: [{ id: 'pocky', qty: 2 }, { id: 'ramune', qty: 1 }] })
  const { container } = render(withApp(<><BasketPanel /><CheckoutForm /></>))
  expect(await a11yProblems(container)).toEqual([])
})
```

Colour contrast is off because jsdom cannot compute colours; check that in the browser with DevTools or the axe browser extension.

The honest part: **these tests passed before this lesson's fixes, too.** The unnamed heart, the emoji read aloud, the ignored `aria-label`, the missing `<main>`, the lost focus after navigation: axe flagged none of them. Automated tools catch roughly a third of real problems, the mechanical ones (a missing label, an invalid attribute, an image without alt text). They are worth running on every change. The rest needs a person: tab through every page, then try it with a screen reader, eyes closed.

## Check yourself

<details>
<summary>Why does the heart button need an <code>aria-label</code>?</summary>

Its visible content, "❤ 3", is read as "red heart, 3", which says neither what it does nor for which snack.
</details>

<details>
<summary>Why did <code>&lt;span aria-label="quantity"&gt;</code> not work?</summary>

`aria-label` is only used on elements with a role, like buttons, links and inputs. On a plain span it is ignored. Visually hidden text works anywhere.
</details>

<details>
<summary>Why move focus to <code>&lt;main&gt;</code> after navigation?</summary>

A single-page app swaps content without loading a page, so focus stays on the old link and nothing is announced. Moving focus puts keyboard and screen-reader users at the start of the new content.
</details>

<details>
<summary>The axe tests pass. Is the app accessible?</summary>

Not necessarily. Automated checks catch only the mechanical problems; most issues, like confusing names or lost focus, need testing by hand with a keyboard and a screen reader.
</details>
