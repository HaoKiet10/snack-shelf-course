## Q
With Tailwind's spacing scale, how much padding is `p-6`?

- [ ] 6px
- [ ] 0.6rem
- [x] 1.5rem, which is 24px
- [ ] 6rem

> One step is 0.25rem (4px), so 6 steps is 1.5rem.

## Q
Why does the shelf's `index.css` import Tailwind's theme and utilities, but not preflight?

- [x] Preflight resets browser default styles, and the app's other CSS files rely on those defaults
- [ ] Preflight only works with Next.js
- [ ] Preflight makes the build too big
- [ ] The utilities don't work without the theme

> Leaving preflight out lets components move to Tailwind one at a time while the rest look the same.

## Q
A `Badge` component sets `` className={`bg-${colour}`} `` with `colour` set to `'peach'`. What happens?

- [ ] It works, because Tailwind runs the code at build time
- [ ] TypeScript reports an error
- [ ] Tailwind throws an error during the build
- [x] The element gets the class `bg-peach`, but no CSS was made for it, so there is no background

> Tailwind reads your files as text. Write out every full class name, for example in an object: `{ peach: 'bg-peach', lilac: 'bg-lilac' }`.

## Q
What does `sm:p-6` mean?

- [ ] Padding of 6 on small screens only
- [x] Padding of 1.5rem from 640px wide and up
- [ ] A small padding of 6px
- [ ] Padding of 6 when the element is selected

> Tailwind is mobile-first: plain classes apply everywhere, and `sm:` and the other breakpoints switch on from that width and up.

## Q
What does `inline` change in `@theme inline { --color-peach: var(--peach) }`?

- [ ] It puts the CSS in a `<style>` tag
- [ ] It lets `@theme` accept variables
- [x] Classes like `bg-peach` use `var(--peach)` directly, so they follow `--peach` wherever it changes, even below `:root`
- [ ] It makes the CSS file smaller

> Without `inline`, the class uses `--color-peach` as worked out on `:root`. That's fine while `--peach` only changes there, as in this app.

## Exercise: Move the header
Move `Header` to Tailwind and delete `Header.css`. Keep the look: peach bar, the title on the left, the basket on the right, and a surface-coloured pill behind the basket while you're on the basket page.

### Hint
`<NavLink>` adds `aria-current="page"` on the current page, as well as the `active` class. Tailwind has no built-in `aria-current:` variant, but square brackets work for any attribute: `aria-[current=page]:bg-surface`.

### Solution
```tsx
<header className="flex items-center justify-between bg-peach px-6 py-4">
  <h1 className="m-0 text-[1.4rem]">
    <Link className="text-inherit no-underline" to="/">
      Yune's Snack Shelf
    </Link>
  </h1>
  <NavLink
    className="rounded-full px-2.5 py-1 text-[1.2rem] text-inherit no-underline aria-[current=page]:bg-surface"
    to="/basket"
  >
    🧺 {count}
    {count > 0 && <span className="text-base opacity-80"> · ${total.toFixed(2)}</span>}
  </NavLink>
</header>
```

Styling from `aria-current` instead of `.active` means the look follows the same attribute screen readers announce, like the sort buttons.
