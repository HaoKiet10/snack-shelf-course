## Q
Why is the basket reducer the easiest thing in the app to test?

- [ ] It has no TypeScript
- [ ] Vitest has special reducer support
- [ ] It's the shortest file
- [x] It's a pure function: call it with a state and an action and compare the result, no DOM or network

> Logic kept in plain functions gets the cheapest, fastest tests.

## Q
Which query would you use to check that "Fan favourite" is **not** shown?

- [ ] `getAllByText`
- [ ] `findByText`
- [x] `queryByText`, then `expect(…).not.toBeInTheDocument()`
- [ ] `getByText`

> `getBy…` throws when nothing matches. `queryBy…` returns `null`, which you can assert on.

## Q
What is `vi.fn()`?

- [ ] The Vitest version of `useState`
- [ ] A way to run a test only once
- [ ] A mock of the whole module
- [x] A fake function that records how it was called

> Pass it as `onLike`, click, then check `expect(onLike).toHaveBeenCalledWith('pocky')`.

## Q
Why find a button with `getByRole('button', { name: 'Add Pocky to basket' })` instead of by its class?

- [ ] Classes can't be queried
- [ ] Classes change on every render
- [x] It's how users find it, so the test survives restyling, and it checks the button has an accessible name
- [ ] Roles are faster to look up

> Testing Library pushes you to test what people see and use, not implementation details.

## Q
The confirmation appears after an async action. Which query waits for it?

- [x] `findByText`
- [ ] `getByText`
- [ ] `screen.debug()`
- [ ] `queryByText`

> `findBy…` returns a promise and retries for up to a second, so you `await` it.

## Exercise: Test the search
Write a test for `SearchBar`: typing calls `onQueryChange` with the text, and pressing Escape calls it with `''`.

### Hint
Render `SearchBar` with `query=""` and a `vi.fn()`. `user.type(input, 'm')` and `user.keyboard('{Escape}')`. Find the input by its label.

### Solution
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import SearchBar from './SearchBar.tsx'

it('reports typing and clears on Escape', async () => {
  const user = userEvent.setup()
  const onQueryChange = vi.fn()
  render(<SearchBar query="" onQueryChange={onQueryChange} />)

  const input = screen.getByRole('textbox', { name: 'Search snacks' })
  await user.type(input, 'm')
  expect(onQueryChange).toHaveBeenLastCalledWith('m')

  await user.keyboard('{Escape}')
  expect(onQueryChange).toHaveBeenLastCalledWith('')
})
```

The input stays empty on screen, because `query` is a prop the test never changes. That's fine: the test checks what SearchBar *reports*.
