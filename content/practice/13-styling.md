## Q
Two components each import a CSS file with a `.badge` rule. What happens?

- [ ] Each rule only applies to its own component
- [ ] Only the first file is used
- [ ] Vite reports an error
- [x] Both rules apply to every `.badge` on the page; the later one wins where they conflict

> Imported CSS files all end up on the same page, and class names are global. Importing doesn't scope anything.

## Q
What turns a CSS file into a CSS Module in Vite?

- [ ] A comment at the top
- [ ] Installing a plugin
- [ ] Importing it with `import * as`
- [x] Naming it `something.module.css`

> The `.module.css` ending is all it takes. Vite then renames each class uniquely and gives you a `styles` object.

## Q
In a CSS Module, what is `styles.card`?

- [x] A string: the unique class name Vite generated, like `_card_13giw_2`
- [ ] The CSS rules as an object
- [ ] `true` if the class exists
- [ ] A React component

> You pass it to `className`. A typo like `styles.crad` is `undefined` and silently applies nothing.

## Q
How did dark mode work without touching any component?

- [ ] Each component checks the system theme
- [ ] The browser inverts the colours
- [ ] React has a dark mode setting
- [x] All colours go through CSS variables, and a `prefers-color-scheme: dark` block redefines them

> Change the variables once and every rule that uses them follows.

## Q
Which is the right use of the `style` prop?

- [ ] `style={{ ':hover': { color: 'red' } }}`
- [ ] Putting all of a component's styles in it
- [ ] `style="width: 50%"`
- [x] `style={{ width: meterWidth }}`, for a value calculated from data

> `style` takes an object with camelCase keys. Keep it for runtime values; fixed styles, hover and media queries belong in CSS.

## Exercise: A sale colour
Add a `--sale` colour variable (for example a green) in `index.css`, with a different value in dark mode, and use it for a "Sale" badge class in `SnackCard.module.css`.

### Hint
Define it in `:root` and again inside the `@media (prefers-color-scheme: dark)` block. Use it with `var(--sale)`.

### Solution
```css
/* index.css */
:root {
  /* … */
  --sale: #1f7a3a;
}
@media (prefers-color-scheme: dark) {
  :root {
    /* … */
    --sale: #5fd38a;
  }
}
```

```css
/* SnackCard.module.css */
.sale {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--sale);
  color: white;
  font-size: 0.75rem;
}
```

```tsx
<span className={styles.sale}>Sale</span>
```
