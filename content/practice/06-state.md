## Q
Why can't `let likes = 0` and `likes++` in a click handler make the count go up on screen?

- [ ] TypeScript blocks it
- [ ] Click handlers can't change variables
- [x] Nothing tells React to re-render, and the next render would start again at 0 anyway
- [ ] `let` variables can't be numbers in JSX

> A plain variable lives only during one call of the component. Changing it doesn't trigger a render, and when the component does render again, the variable is created fresh at 0.

## Q
What does `const [likes, setLikes] = useState(0)` give you?

- [ ] A reference to a DOM element
- [x] The current value, and a function that stores a new value and asks React to re-render
- [ ] Two state variables, both starting at 0
- [ ] A value that updates itself every second

> React keeps the value between renders. `setLikes` stores a new one and schedules a re-render, during which `likes` holds the new value.

## Q
```tsx
function handleClick() {
  setLikes(likes + 1)
  setLikes(likes + 1)
}
```
`likes` is 0. What is it after one click?

- [x] 1
- [ ] 0
- [ ] It throws an error
- [ ] 2

> `likes` is a snapshot: 0 for this whole render. Both calls say "set it to 0 + 1". Use `setLikes((l) => l + 1)` twice to get 2.

## Q
Each `SnackCard` calls `useState(0)`. What happens when you like Pocky?

- [ ] Only the first card's count changes
- [ ] Every card's count goes up
- [ ] Nothing, state has to live in App
- [x] Only Pocky's count changes; each card has its own state

> State belongs to one component instance. Six cards mean six separate boxes.

## Q
Which breaks the rules of hooks?

- [ ] Calling `useState` in a custom hook named `useLikes`
- [ ] Passing a number to `useState`
- [ ] Calling `useState` twice at the top of a component
- [x] Calling `useState` inside an `if`

> React matches hooks to their state by call order. A hook inside a condition can be skipped on some renders, which shifts every hook after it.

## Exercise: An unlike button
Add a second button to `SnackCard`, **−**, that takes one like away, but never below 0. Disable it when there are no likes.

### Hint
Use the updater form and `Math.max`. `disabled` takes a boolean.

### Solution
```tsx
<button
  onClick={() => setLikes((l) => Math.max(0, l - 1))}
  disabled={likes === 0}
  aria-label={`Unlike ${name}`}
>
  −
</button>
```

The `Math.max` guard is still worth having even with `disabled`: two quick clicks can both be queued before the button turns off.
