---
title: Styling it
summary: Scope a component's CSS with a CSS Module, put the colours in CSS variables and get dark mode almost for free, and use inline styles only for values that change at runtime.
minutes: 18
demo: 13-styling
---

The app follows your system's light or dark setting now, each card has a small like meter, and `SnackCard`'s styles can no longer collide with anyone else's.

## The problem with plain CSS files

Since lesson 4, each component has imported its own `.css` file. That *looks* like each file belongs to its component. It does not. Vite puts every imported CSS file onto the **same page**, and every class is **global**.

```css
/* SnackCard.css */
.badge { background: crimson; }

/* someday, Header.css */
.badge { background: gold; }
```

Both rules apply to every `.badge` on the page, and whichever comes later wins. Nothing warns you. In a six-file app you can keep the names apart in your head. In a two-hundred-file app you cannot.

## CSS Modules: scoped class names

Rename the file to end in **`.module.css`**. That is the whole setup; Vite supports it out of the box.

```css
/* SnackCard.module.css */
.card { ... }
.badge { ... }
.like { ... }
.liked { ... }
```

```tsx
import styles from './SnackCard.module.css'

<div className={styles.card}>
  {popular && <span className={styles.badge}>Fan favourite</span>}
```

Vite renames every class to something unique, like `_card_13giw_2`, and `styles` is an object mapping your names to the real ones: `styles.card === '_card_13giw_2'`. Open DevTools and inspect a card to see it. Another file's `.badge` gets a different name, so they cannot meet.

Two things to know:

- Give each element its own class (`.name`) rather than writing `.card h2`. Only class names are renamed: in `.card h2`, the `h2` part is not, so that rule is scoped only by the `.card` in front of it.
- A misspelt `styles.crad` is `undefined`, which renders as no class at all, so it fails silently. If a style is missing, check the name first.

`Header.css` and `App.css` are still plain global CSS. Mixing is fine. Page-wide basics, like `body` and the colour variables, *should* be global.

## Combining classes

`className` is just a string, so combining classes is plain JavaScript:

```tsx
const likeClass = [styles.button, styles.like, liked && styles.liked]
  .filter(Boolean)
  .join(' ')
```

The array is three class names, or two names and `false`. `filter(Boolean)` drops the `false`, and `join(' ')` makes one string. For exactly two, a template string reads fine:

```tsx
className={`${styles.button} ${styles.add}`}
```

Libraries such as `clsx` do the same job with nicer syntax. You do not need one yet.

## CSS variables: name each colour once

Before, `#ffe2c4` was typed in four places. Now `index.css` names every colour once:

```css
:root {
  --bg: #fff8ef;
  --surface: #ffffff;
  --ink: #3a2a1e;
  --peach: #ffe2c4;
  --lilac: #f3e8ff;
  --line: #e0c9b0;
  --accent: crimson;
  --radius: 12px;
}
```

and every other file uses them:

```css
.add {
  background: var(--peach);
}
```

These are **CSS custom properties**, part of CSS itself, not React or Vite. They are inherited like `color` is, so defining them on `:root` (the `<html>` element) makes them available everywhere.

## Dark mode, by changing the variables

Because every colour goes through a variable, dark mode is one block that redefines them:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1f1812;
    --surface: #2c231b;
    --ink: #f4e9dc;
    --peach: #5a3d24;
    ...
  }
}
```

No component changed. Switch your system to dark (or in Chrome DevTools: ⋮ → More tools → Rendering → *Emulate CSS media feature prefers-color-scheme*) and the whole app follows.

## Inline styles for runtime values

The like meter's width depends on `likes`, which CSS cannot know. That is what the `style` prop is for:

```tsx
const meterWidth = `${(Math.min(likes, METER_MAX) / METER_MAX) * 100}%`

<div className={styles.meter} aria-hidden="true">
  <div style={{ width: meterWidth }} />
</div>
```

`style` takes an **object**, not a string, with **camelCase** keys: `backgroundColor`, not `background-color`. The double braces are not special syntax. The outer pair means "JavaScript here" and the inner pair is the object.

Keep inline styles for values that come from data. Everything that does not change, the meter's height, colour and rounded ends, stays in the CSS file, where hover, media queries and dark mode can reach it. Inline styles cannot do `:hover` or `@media`.

`aria-hidden="true"` hides the meter from screen readers, because the button already says the number of likes.

## The other ways people style React

| approach | what it looks like | good at |
|---|---|---|
| plain global CSS | `className="card"` | small apps, page-wide basics |
| CSS Modules | `className={styles.card}` | scoping with no new tools (this app) |
| utility classes (Tailwind) | `className="p-4 rounded-xl bg-white"` | styling without leaving the JSX, fast prototyping |
| CSS-in-JS | styles written as JS in the component | styles that depend heavily on props |

None of these is React. React only passes `className` and `style` through to the DOM. Tailwind is very common in new projects: you install it, and instead of writing CSS rules you compose many small ready-made classes. It is worth trying once you are comfortable with plain CSS, because underneath, its classes are just the same CSS properties.

## Check yourself

<details>
<summary>Why can two plain CSS files clash, even if each is imported by a different component?</summary>

All imported CSS ends up on the same page and class names are global. Importing a file in a component does not limit its rules to that component.
</details>

<details>
<summary>What is <code>styles.card</code> at runtime?</summary>

A string: the unique class name Vite generated for `.card` in that module, such as `_card_13giw_2`.
</details>

<details>
<summary>How did dark mode work without changing any component?</summary>

All colours go through CSS variables. A `prefers-color-scheme: dark` media query redefines the variables, and every rule that uses them picks up the new values.
</details>

<details>
<summary>When is an inline <code>style</code> the right tool?</summary>

When the value depends on data at runtime, like the meter's width. Fixed styles belong in CSS, where they can use `:hover`, media queries and variables.
</details>
