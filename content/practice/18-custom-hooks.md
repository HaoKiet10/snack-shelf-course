## Q
What makes a function a custom hook?

- [x] Its name starts with `use` and it calls other hooks
- [ ] It's in a `hooks/` folder
- [ ] It returns JSX
- [ ] It's registered with React

> That's the whole definition. The `use` prefix tells people and the linter that the rules of hooks apply.

## Q
Header and Shelf both call `useSnacks()` (lesson 18's version). How many times are the snacks fetched?

- [ ] Once; hooks share their state
- [x] Twice; each call has its own state and effect
- [ ] Never; hooks can't fetch
- [ ] It depends on the order

> Calling a hook is like pasting its code into that component. Custom hooks share logic, not state.

## Q
Why does `useLocalStorage` end with `return [value, setValue] as const`?

- [ ] To save it to storage
- [ ] It's required for all hooks
- [x] So TypeScript sees a fixed pair (value, then setter) instead of an array of either type
- [ ] To make the array read-only at runtime

> Without `as const`, each position could be either type, and destructuring loses precise types.

## Q
`useReducer(basketReducer, BASKET_KEY, readSavedBasket)`. What is the third argument?

- [ ] A cleanup function
- [ ] A function called on every render
- [x] An init function React calls once with the second argument to make the first state
- [ ] The dispatch function

> Like `useState(fn)`, it avoids repeating expensive setup, here reading `localStorage`, on every render.

## Q
Which is a **poor** custom hook?

- [ ] `useSnacks`, loading data with its status
- [ ] `useLocalStorage`, a value saved in storage
- [ ] `useBasketState`, a reducer plus saving
- [x] `useToggle`, wrapping a single `useState(false)` and nothing else

> A hook that hides one `useState` adds a file and hides nothing. Good hooks hide effects and related state with a name.

## Exercise: useDocumentTitle
Write a `useDocumentTitle(title: string)` hook that sets `document.title`, and use it in App to show the basket count.

### Hint
It's an effect that depends on `title`. A hook doesn't have to return anything.

### Solution
```ts
import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
```

```tsx
useDocumentTitle(count > 0 ? `(${count}) Yune's Snack Shelf` : "Yune's Snack Shelf")
```
