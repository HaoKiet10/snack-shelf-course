## Q
What happens when you change `ref.current`?

- [ ] React throws an error
- [x] The value changes, but React doesn't re-render
- [ ] The DOM updates automatically
- [ ] The component re-renders

> A ref is a box React keeps between renders, which it doesn't watch.

## Q
`const inputRef = useRef<HTMLInputElement>(null)` and `<input ref={inputRef} />`. When is `inputRef.current` the input element?

- [ ] During the first render
- [ ] Only after a click
- [x] After React has put the input in the DOM
- [ ] Never; you must set it yourself

> React fills it in after committing to the DOM, and sets it back to `null` when the element is removed. That's why you write `inputRef.current?.focus()`.

## Q
Which belongs in a ref rather than state?

- [ ] Whether the ✓ flash is showing
- [ ] The search text
- [ ] The number of likes
- [x] The id of a `setTimeout`, needed only to cancel it later

> If the screen depends on it, it's state. A timer id is never shown, so a ref is enough.

## Q
```tsx
const clicks = useRef(0)
<button onClick={() => clicks.current++}>Clicked {clicks.current} times</button>
```
What's wrong?

- [ ] Refs can't hold numbers
- [x] The number on the button won't update, because changing a ref doesn't re-render
- [ ] It counts every click twice
- [ ] Nothing

> If it's displayed, it must be state.

## Q
Why does the `/` shortcut's effect return a cleanup that removes the listener?

- [ ] Listeners expire otherwise
- [ ] React requires every effect to return something
- [x] Without it, every mount adds another listener to `window` and they pile up
- [ ] To focus the input

> `window` is outside React. Anything an effect adds there, its cleanup should remove.

## Exercise: Scroll to the basket
On the shelf page, add a "Go to basket" button that smoothly scrolls the basket panel into view (lesson 17–20 layout, where the basket panel is under the shelf).

### Hint
Put a ref on the basket panel's outer element. `element.scrollIntoView({ behavior: 'smooth' })` does the scrolling.

### Solution
```tsx
const basketRef = useRef<HTMLDivElement>(null)

<button onClick={() => basketRef.current?.scrollIntoView({ behavior: 'smooth' })}>
  Go to basket
</button>

<div ref={basketRef}>
  <BasketPanel />
</div>
```

`Panel` doesn't accept a ref, so a plain `<div>` around it holds it. (In React 19 a component can also accept `ref` as a normal prop and pass it on.)
