## Q
What makes an input **controlled**?

- [ ] It has an `id`
- [x] Its `value` comes from React state, and `onChange` updates that state
- [ ] It has `defaultValue`
- [ ] It is inside a `<form>`

> The state is the source of truth; the input only displays it. Every keystroke goes through `onChange` and back via `value`.

## Q
You write `<input value={query} />` with no `onChange`. What happens when you type?

- [ ] The page reloads
- [x] Nothing appears to change; React keeps putting `query` back
- [ ] It works normally
- [ ] React stores the text automatically

> A controlled input shows exactly `query`. Without `onChange` to update it, the typed text is thrown away on every render.

## Q
How do you type the event in `function handleChange(e) { … }` for an input?

- [ ] `e: Event`
- [ ] `e: HTMLInputElement`
- [x] `e: ChangeEvent<HTMLInputElement>`
- [ ] `e: InputEvent`

> React's `ChangeEvent<HTMLInputElement>` (imported with `import type`) gives `e.target.value` the type `string`.

## Q
You want Escape to clear the search. Which event?

- [x] `onKeyDown`
- [ ] `onSubmit`
- [ ] `onChange`
- [ ] `onClick`

> Escape doesn't change the text, so there is no change event. `onKeyDown` fires for every key, with `e.key === 'Escape'`.

## Q
How do you limit the search box to 20 characters with a controlled input?

- [ ] Use `defaultValue`
- [ ] `maxLength` is the only way
- [x] Store `e.target.value.slice(0, 20)` in state
- [ ] Throw an error after 20 characters

> Because React decides what the input shows, it can shape the value before storing it. `maxLength` also works, but slicing shows the controlled idea.

## Exercise: A character counter
Under the search box, show "12 / 20" with the current length of the search, and make it a different colour when the limit is reached.

### Hint
The length is `query.length`: derive it, don't store it. A class can depend on a condition.

### Solution
```tsx
<p className={query.length === MAX_QUERY ? 'counter full' : 'counter'}>
  {query.length} / {MAX_QUERY}
</p>
```

```css
.counter { font-size: 0.85rem; opacity: 0.7; }
.counter.full { color: crimson; opacity: 1; }
```
