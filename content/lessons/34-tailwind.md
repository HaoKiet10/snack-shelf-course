---
title: Tailwind CSS
summary: Style components with small utility classes written right on the elements. Add Tailwind to Vite without breaking the existing CSS, turn the app's colours into Tailwind colours, use hover, disabled, aria and screen-size variants, and learn the one rule that trips everyone up: class names must be written out in full.
minutes: 22
demo: 34-tailwind
---

The shelf looks exactly the same as before, and that is the point. Under the hood, the snack card, the buttons, the sort control and the shelf grid are now styled with **Tailwind**, and four CSS files are gone. Inspect a card in DevTools and you'll see classes like `rounded-xl bg-surface p-4` instead of `_card_13giw_2`.

## What Tailwind is

Lesson 13 wrote CSS the usual way: name a thing (`.card`), then describe it in a separate file. Tailwind turns that around. It gives you thousands of tiny classes that each do **one** thing, and you put them straight on the element:

```tsx
<div className="relative w-40 rounded-xl bg-surface p-4 text-center shadow-card">
```

| Class | CSS |
|---|---|
| `relative` | `position: relative` |
| `w-40` | `width: 10rem` (160px) |
| `rounded-xl` | `border-radius: 0.75rem` (12px) |
| `p-4` | `padding: 1rem` |
| `text-center` | `text-align: center` |

The numbers come from one scale: **one step is 0.25rem, which is 4px**. So `p-4` is 16px, `gap-1.5` is 6px, `w-40` is 160px. Once you know the scale, you can read most classes without looking them up.

Why people like it:

- **No naming.** No more deciding between `.card-inner`, `.card-body` and `.card-content`.
- **No jumping between files.** The look of a component is in the component.
- **Delete with confidence.** Delete a component and its styles go with it. Unused plain CSS tends to stay forever, because nobody is sure it's unused.
- **A built-in system.** Spacing, font sizes and colours come from a scale, so things line up.

Why some people don't: long class strings are harder to read at first, and the HTML gets busy. Both are real. Lesson 13's tools are still good tools; this is another one, and very common in React jobs.

The CSS Tailwind ships is small: it **reads your source files**, finds the class names you used, and writes CSS for only those. Nothing else ends up in the build.

## Adding it to Vite

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add the plugin next to the others in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
```

In a new project, one line at the top of your CSS is the whole setup:

```css
@import 'tailwindcss';
```

That line brings in three things: the **theme** (colours, sizes), **preflight** (a reset that removes the browser's default styles: margins on headings, borders on buttons, bullets on lists) and the **utilities** (the classes).

Our app is not new. It has a dozen CSS files that rely on the browser defaults, and preflight would change all of them at once. So `index.css` brings in only two of the three:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
```

Now every component can move over when you get to it, and the rest keep working. That's how teams usually adopt Tailwind in a real app.

One side effect: without preflight, elements keep the browser's `box-sizing: content-box`, where padding is *added* to the width. The old card set `box-sizing: border-box`, so the new one has the `box-border` class for the same result.

## Layers: who wins

`@layer` is plain CSS, not Tailwind. It sorts rules into named groups, and **a later layer beats an earlier one, whatever the selectors**. That's why the order line lists `utilities` last.

One more rule: CSS that is **not** in any layer beats everything that is. All our old CSS files are unlayered, so if `Header.css` styled a `button`, it would beat `bg-peach` on that button. It doesn't happen here because the old files only style their own class names. But if a Tailwind class seems ignored in a mixed app, look for an unlayered rule hitting the same element.

## Your colours as Tailwind colours

Tailwind has its own palette (`bg-red-500`, `text-slate-700`, …). We already have ours in CSS variables, with dark mode. `@theme` adds them to Tailwind:

```css
@theme inline {
  --color-page: var(--bg);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-peach: var(--peach);
  --color-lilac: var(--lilac);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

The **name** of each variable becomes classes. `--color-peach` makes `bg-peach`, `text-peach`, `border-peach` and every other colour class. `--shadow-card` makes `shadow-card`.

`inline` makes `bg-peach` use `var(--peach)` directly, instead of going through `--color-peach`. In this app the dark-mode colours are set on `:root`, the same place as the theme, so plain `@theme` would work too. `inline` matters when a variable changes **lower down** the page, for example a dark panel inside a light page: without it, the class would still use the value worked out on `:root`. It's the safe choice whenever a token points at another variable. Either way, dark mode keeps working with no extra classes.

(Tailwind also has a `dark:` variant, as in `bg-white dark:bg-black`. It's handy when you don't have variables. With variables, you don't need it.)

## The card

Here is the whole card's markup now. Every style from `SnackCard.module.css` is in the classes:

```tsx
<div className="relative box-border w-40 rounded-xl bg-surface p-4 text-center shadow-card">
  {popular && (
    <span className="absolute -top-2 -right-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
      Fan favourite
    </span>
  )}
  <span className="text-[2.5rem]" aria-hidden="true">
    {emoji}
  </span>
  <h2 className="mt-2 mb-1 text-lg">
    <Link className="text-inherit" to={`/snack/${id}`}>
      {name}
    </Link>
  </h2>
  <p className="mt-0 mb-2 opacity-70">${price.toFixed(2)}</p>
  <div className="mx-2 mb-3 h-1 overflow-hidden rounded-full bg-lilac" aria-hidden="true">
    <div className="h-full bg-accent transition-[width] duration-200" style={{ width: meterWidth }} />
  </div>
  …
</div>
```

A few things to notice:

- **Negative values** start with a minus: `-top-2` is `top: -0.5rem`, which pushes the badge over the corner.
- **Square brackets** are for a value the scale doesn't have: `text-[2.5rem]` is exactly `font-size: 2.5rem`. They're an escape hatch. If you use the same one in many places, add it to `@theme` instead.
- `text-lg` is 1.125rem; the old CSS said 1.1rem. Close enough, and now it's on the scale.
- The meter's width is **still an inline style**. Lesson 13's rule holds: a value only known at runtime goes in `style`. Tailwind can't make a class for a number it never sees in your code.

## Variants: hover, disabled, aria, screen size

Put a **variant** and a colon in front of a class, and the class only applies in that situation. The new `Button`:

```tsx
const base =
  'cursor-pointer rounded-full border-0 px-3.5 py-2 font-[inherit] enabled:hover:brightness-95 disabled:cursor-default disabled:opacity-50'
```

- `hover:brightness-95`: slightly darker while the mouse is over it.
- `disabled:opacity-50`: half see-through when it has the `disabled` attribute.
- `enabled:hover:…`: variants stack. Hovered, **and** not disabled, so a disabled button doesn't react.

The sort control uses an attribute variant:

```tsx
<button
  className="… border border-line bg-transparent aria-pressed:border-peach aria-pressed:bg-peach aria-pressed:font-semibold"
  aria-pressed={o.value === value}
>
```

`aria-pressed:bg-peach` applies when the button has `aria-pressed="true"`. The look comes from the same attribute screen readers announce (lesson 33), so the two can never disagree. No `isActive ? 'active' : ''` needed.

**Screen sizes** are variants too, and they're **mobile-first**: a plain class applies everywhere, and `sm:` means "from 640px wide and up". The shelf:

```tsx
<div className="flex flex-wrap gap-4 p-4 sm:p-6">
```

16px of padding on a phone, 24px on anything wider. The others are `md:` (768px), `lg:` (1024px), `xl:` and `2xl:`. Narrow your browser window to see the shelf's edge shrink.

## The rule that trips everyone up

Tailwind finds classes by **reading your files as text**. It doesn't run your code. So this does not work:

```tsx
// ✗ Tailwind never sees "bg-lilac" or "bg-accent" written anywhere
const classes = `bg-${variant === 'soft' ? 'lilac' : 'accent'}`
```

The browser gets the class `bg-lilac`, but no CSS was made for it. Write every class out **in full**, for example in an object:

```tsx
const variants = {
  soft: 'bg-lilac text-ink',
  primary: 'bg-accent font-semibold text-white',
}

const classes = [base, variants[variant], className].filter(Boolean).join(' ')
```

The same goes for the card's like button: `liked ? 'font-bold text-accent' : ''`, both class names written out.

## Combining and overriding classes

Combining classes is still plain JavaScript, exactly as in lesson 13. Many projects use a tiny library called **clsx** to make it shorter, `clsx(base, liked && 'text-accent')`, but you don't need it.

One trap: `Button` accepts a `className`, so you could write `<Button className="px-6">`. It already has `px-3.5`. Which wins? **Not** the one that comes later in the string. Classes in `className` have no order. The one later in the *CSS file* wins, and Tailwind decides that order. For small apps, avoid passing classes that clash. Bigger apps use a library called **tailwind-merge**, which removes the clashing class (`px-3.5`) for you.

## @apply, and why not

Tailwind lets you put utility classes back into a CSS class:

```css
.btn { @apply rounded-full px-3.5 py-2; }
```

It's tempting when class strings get long, but it brings back everything Tailwind removed: naming things, and styles in another file. In React, the long string already has a name: the **component**. `Button` *is* the reusable button style. Reach for `@apply` rarely, for example to style HTML you don't control, like Markdown output.

## Tools that help

- **Tailwind CSS IntelliSense** (VS Code extension): autocompletes class names, shows the CSS on hover, and warns about clashes like `p-2 p-4`.
- **prettier-plugin-tailwindcss**: sorts the classes in every string into a standard order when you format, so `className`s look the same across the project.

## What's still plain CSS

`Header.css`, `SearchBar.css`, `BasketPanel.css`, the pages and the toasts kept their CSS files, and `index.css` still holds the page basics, the focus ring, the skip link and the reduced-motion rule. That's fine. Mixing is the normal state of an app partway through a move. The exercise below moves one more.

## Going further

This lesson is the short version. **[Snack Box](https://haokiet10.github.io/snack-box-course/)** is a full course in Tailwind CSS that follows on from this one: 19 lessons that build a new, more visual app, a snack subscription site with a shop, a sign-up form and an account dashboard. It starts from an empty project with the full Tailwind setup, preflight included, and goes on to responsive layouts, dark mode with a switch, components with variants, container queries, your own utilities and accessibility.

## Check yourself

<details>
<summary>What is <code>px-2.5</code> in pixels?</summary>

10px of padding on the left and right. One step is 0.25rem (4px), so 2.5 steps is 0.625rem.
</details>

<details>
<summary>Why does the app import Tailwind's theme and utilities, but not <code>@import 'tailwindcss'</code>?</summary>

The full import includes preflight, a reset that removes browser default styles. The app's existing CSS files rely on those defaults, so preflight would change every page at once. Without it, components can move to Tailwind one at a time.
</details>

<details>
<summary>Why doesn't <code>`bg-${colour}`</code> work?</summary>

Tailwind makes CSS only for class names it finds written in your files. It reads them as text and never runs your code, so a class built at runtime gets no CSS. Write each class name out in full.
</details>

<details>
<summary>Why does the like meter still use an inline style?</summary>

Its width depends on the number of likes, which is only known at runtime. There's no class for a value that isn't written in the code.
</details>
