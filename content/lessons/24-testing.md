---
title: Testing
summary: Write tests with Vitest and Testing Library. Test the basket reducer as a plain function, render components and click them like a user would, fake timers and modules, and run it all with npm test.
minutes: 25
demo: 24-testing
---

The app is the same; this lesson adds 14 tests that check it. Run `npm test`, and from then on, change something and the tests tell you within a second whether you broke the basket.

## Why bother

Every lesson so far ended with "try this": like Pocky three times, search, clear. That is testing, by hand. It is slow, so you stop doing it, and then something breaks quietly. An automated test does the same clicking in a fraction of a second, every time you save.

## Setting up

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

- **Vitest** runs tests. It is built on Vite, so it uses the same config and understands TypeScript and JSX with no extra setup.
- **jsdom** is a fake browser DOM for Node, so components can render without a real browser.
- **Testing Library** renders components and finds things on the "screen" the way a user would.

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

The setup file adds matchers like `toBeInTheDocument()`, and clears the page between tests. Add `"test": "vitest"` to `package.json`'s scripts. Any file named `*.test.ts` or `*.test.tsx` is a test file.

## The shape of a test

```ts
describe('basketReducer', () => {
  it('adds a new snack with quantity 1', () => {
    const next = basketReducer([], { type: 'added', id: 'pocky' })
    expect(next).toEqual([{ id: 'pocky', qty: 1 }])
  })
})
```

`describe` groups tests, `it` is one test with a sentence saying what should be true, and `expect(actual).toEqual(expected)` checks it. **Arrange, act, assert**: set something up, do one thing, check the result.

## Pure functions are the easiest

The reducer (lesson 17) has no React, no DOM, no network. Testing it is just calling it:

```ts
it('removes a line when its quantity drops to 0', () => {
  const lines: BasketLine[] = [
    { id: 'pocky', qty: 1 },
    { id: 'ramune', qty: 2 },
  ]
  const next = basketReducer(lines, { type: 'quantityChanged', id: 'pocky', qty: 0 })
  expect(next).toEqual([{ id: 'ramune', qty: 2 }])
})

it('never changes the old state', () => {
  const before: BasketLine[] = [{ id: 'pocky', qty: 1 }]
  const after = basketReducer(before, { type: 'added', id: 'pocky' })
  expect(before).toEqual([{ id: 'pocky', qty: 1 }])
  expect(after).not.toBe(before)
})
```

The second test checks lesson 11's rule directly: `toBe` compares identity, so `not.toBe` proves the reducer made a new array. This is the payoff for keeping logic in plain functions: the most important rules of the app get the cheapest tests.

## Testing a component like a user

```tsx
it('shows the name, price and a link to the snack page', () => {
  render(card(0))
  expect(screen.getByRole('link', { name: 'Pocky' })).toHaveAttribute('href', '/snack/pocky')
  expect(screen.getByText('$2.50')).toBeInTheDocument()
})
```

`render` puts the component on the fake page, and `screen` searches it. Testing Library deliberately makes you search the way a **user** finds things: by role ("the link called Pocky"), label, or visible text, not by class name or component internals. That has two benefits. Tests keep passing when you restyle or restructure, and if a test cannot find a button by its name, a screen reader user probably cannot either.

`card()` wraps `SnackCard` in a `MemoryRouter`, because its `<Link>` needs a router, and a `MemoryRouter` keeps its URL in memory instead of the address bar.

| query | when nothing matches | use for |
|---|---|---|
| `getBy…` | throws (test fails) | things that must be there |
| `queryBy…` | returns `null` | checking something is **not** there |
| `findBy…` | waits up to 1s, then throws | things that appear after something async |

## Clicking, and fake functions

```tsx
it('reports a like when the heart is clicked', async () => {
  const user = userEvent.setup()
  const onLike = vi.fn()
  render(card(2, onLike))
  await user.click(screen.getByRole('button', { name: '❤ 2' }))
  expect(onLike).toHaveBeenCalledTimes(1)
})
```

`vi.fn()` is a **mock function**: it does nothing but remember how it was called. The card's job is to *report* a like (lesson 11), so the test checks exactly that. `userEvent` simulates a real user: pointer events, focus, then click.

`rerender` gives the same component new props, like a parent re-rendering:

```tsx
const { rerender } = render(card(2))
expect(screen.queryByText('Fan favourite')).not.toBeInTheDocument()
rerender(card(3))
expect(screen.getByText('Fan favourite')).toBeInTheDocument()
```

## Faking time

The ✓ flash lasts a second (lesson 20). Waiting a real second per test adds up, so take control of the clock:

```tsx
it('flashes ✓ for a second after adding', () => {
  vi.useFakeTimers()
  // … render, find the button
  fireEvent.click(button)
  expect(button).toHaveTextContent('✓')

  act(() => {
    vi.advanceTimersByTime(1000)
  })
  expect(button).toHaveTextContent('+')
})
```

`vi.useFakeTimers()` freezes `setTimeout`, and `advanceTimersByTime` moves the clock forward instantly. `fireEvent.click` is used here instead of `userEvent`, because `userEvent` waits between its steps using timers, which do not move while they are faked. `act()` tells React "this causes updates; apply them before the next line".

## Faking a module, providing a context

The checkout form calls `sendOrder`, which waits 800ms, and reads the basket from context. A test should control both:

```tsx
vi.mock('../data/orders.ts', () => ({
  sendOrder: vi.fn(async () => 'YS-TEST-2'),
}))

function renderWithBasket() {
  const dispatch = vi.fn()
  const basket: BasketValue = { lines: [{ id: 'pocky', qty: 2 }], count: 2, total: 5, dispatch }
  render(
    <BasketContext value={basket}>
      <CheckoutForm />
    </BasketContext>,
  )
  return { dispatch }
}
```

`vi.mock` replaces the whole module for this test file, so the form gets an instant fake `sendOrder`. Instead of the real `BasketProvider` with storage and snacks, the test provides the context **value** directly. That is a nice side effect of lesson 19's design: a component that reads a context can be given any value you like.

```tsx
it('places the order and empties the basket', async () => {
  const user = userEvent.setup()
  const { dispatch } = renderWithBasket()

  await user.type(screen.getByLabelText('Name'), 'Yune')
  await user.type(screen.getByLabelText('Email'), 'yune@example.com')
  await user.selectOptions(screen.getByLabelText('Pick-up time'), 'Tomorrow, 10 am')
  await user.click(screen.getByRole('button', { name: /place order/i }))

  expect(await screen.findByText('YS-TEST-2')).toBeInTheDocument()
  expect(dispatch).toHaveBeenCalledWith({ type: 'emptied' })
})
```

`getByLabelText` finds fields by their `<label>`, which only works because lesson 22 connected each label with `htmlFor`. `findByText` waits for the confirmation, since the action is async.

## Running them

```bash
npm test
```

Vitest runs everything, then **watches**: save a file and the affected tests run again. `npx vitest run` runs once and exits, which is what CI uses. In this course's repository, `npm test` runs the tests of the latest lesson's code.

This lesson's version of lesson 15's workflow has one more step, `- run: npx vitest run`, before the build. A failing test now stops a broken version from going live.

## What to test

Test **behaviour a user or another part of the app relies on**: the reducer's rules, that a click reports the right thing, that errors appear, that an order goes through. Do not test implementation details, like a component's state variable names or which CSS class is set; those tests break on every refactor while the app works fine. The tests here would all survive rewriting `SnackCard` from scratch, as long as it still behaves the same.

## Check yourself

<details>
<summary>Why is the reducer the easiest thing to test?</summary>

It is a pure function with no React, DOM or network: call it with a state and an action, and compare the result.
</details>

<details>
<summary>Why find a button by its role and name instead of its class?</summary>

That is how users find it, so the test survives restyling and refactoring, and it also checks that the button has an accessible name.
</details>

<details>
<summary>When do you use <code>queryBy…</code> instead of <code>getBy…</code>?</summary>

To check that something is not there. `getBy…` throws when nothing matches; `queryBy…` returns `null`, which you can assert on.
</details>

<details>
<summary>How does the checkout test avoid the real 800ms <code>sendOrder</code> and the real basket?</summary>

`vi.mock` replaces the orders module with an instant fake, and the test renders the form inside a `BasketContext` with a value it made itself.
</details>
