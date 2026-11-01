## Q
What does "re-render" mean in React?

- [ ] The CSS is applied again
- [ ] The browser reloads the page
- [ ] Every DOM element is deleted and recreated
- [x] React calls the component function again to get its new JSX

> A render is a function call. Afterwards React compares the result with the last one and changes only what differs in the DOM.

## Q
The like count in Pocky's card changes. Which part of the DOM does React change?

- [ ] The whole card
- [x] Only the text inside the like button (and its class, if that changed)
- [ ] The whole page
- [ ] Nothing until the page is refreshed

> A re-render is not a redraw. React compares old and new JSX and touches only the parts that differ.

## Q
App re-renders. What happens to its child components by default?

- [x] They re-render too
- [ ] They are removed and created again
- [ ] Nothing, children only render once
- [ ] Only the children whose props changed re-render

> By default every child of a re-rendering component re-renders. Lesson 27 covers how to skip that when it matters.

## Q
In development, every `console.log` in a component appears twice. Why?

- [ ] React always renders twice in production too
- [ ] The browser is broken
- [x] StrictMode renders each component twice on purpose, to catch impure components
- [ ] Each component is mounted twice on the page

> StrictMode is development only. If a component gives a different result the second time, it has a side effect it shouldn't.

## Q
Which of these does **not** cause a component to re-render?

- [ ] Its parent re-rendering
- [ ] Its own state changing
- [x] A plain local variable inside it changing
- [ ] A context it reads changing

> React only knows about state, props and context. Changing an ordinary variable is invisible to it.

## Exercise: Count the renders
Add a render counter to `Header` that logs how many times it has rendered, without causing extra renders.

### Hint
A variable inside the component resets every render. You need something that survives renders but doesn't trigger one. (Lesson 20 names it, but a variable outside the component works too, for one instance.)

### Solution
```tsx
let renders = 0   // outside the component: survives re-renders

export default function Header() {
  renders++
  console.log('Header render', renders)
  // …
}
```

It works for a single Header. With StrictMode the count goes up by two each time. Lesson 20's `useRef` is the proper per-instance version.
