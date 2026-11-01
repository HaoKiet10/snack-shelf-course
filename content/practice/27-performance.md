## Q
What should you do before optimising a component?

- [ ] Wrap it in `memo`
- [ ] Add `useCallback` to every function
- [ ] Rewrite it as a class
- [x] Measure with the React DevTools Profiler to see if it's actually slow

> Most re-renders cost almost nothing. Optimise what the Profiler shows is slow.

## Q
`SnackCard` is wrapped in `memo`, but gets `onLike={() => like(snack.id)}`. Does `memo` skip re-renders?

- [ ] Only in production
- [ ] Only if `like` is a `useCallback`
- [x] No; the arrow function is new every render, so a prop always looks changed
- [ ] Yes, always

> `memo` compares props with `Object.is`. New functions are different objects.

## Q
What does `useMemo(() => expensive(a, b), [a, b])` do?

- [ ] Runs `expensive` once, ever
- [x] Keeps the result between renders and only recomputes when `a` or `b` change
- [ ] Caches the result in `localStorage`
- [ ] Runs `expensive` in a background thread

> It memoises a value. `useCallback` does the same for a function.

## Q
What does the React Compiler need from your code to work?

- [x] Pure components and hooks that don't mutate props, state or earlier values
- [ ] `memo` on every component
- [ ] Class components
- [ ] A special file extension

> It skips code that breaks the rules, which then works as before, without the optimisation.

## Q
Why did the card's `onLike` change to take the snack's id?

- [ ] To make the button accessible
- [ ] TypeScript required it
- [ ] Ids are faster than names
- [x] So the shelf can pass one stable function to every card, instead of a new arrow per card that can't be memoised

> The compiler can't memoise per item inside a `map`, so the design passes the same function down.

## Exercise: Find the re-renders
Install React DevTools, open the shelf, and turn on **Highlight updates when components render**. Like a snack, type in the search, and add to the basket. Note which components flash each time, then explain one flash you didn't expect.

### Hint
The Components tab's settings (⚙) has the highlight option. The Profiler tab can record and show *why* each component rendered.

### Solution
There's no single right answer: this is about reading the tools. Typically you'll see Header flash when the basket changes (its count and total changed), the cards flash when likes change, and SearchBar flash on each keystroke. If a component flashes that shouldn't, record in the Profiler and read "Why did this render?" to see which prop or context changed.
