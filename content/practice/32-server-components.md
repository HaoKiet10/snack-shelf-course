## Q
Why can a Server Component be `async` and `await` its data directly?

- [ ] All React components can be async
- [ ] Next.js converts it to a Client Component
- [ ] Because it uses `useEffect` internally
- [x] It runs on the server before anything is sent, so it can wait and send finished HTML

> There's no screen yet to show a loading state on.

## Q
What does `'use client'` at the top of a file mean?

- [ ] The file only runs in the browser, never on the server
- [x] This file and everything it imports are client code: they can use state, effects and events, and are sent to the browser
- [ ] The component can't be used by Server Components
- [ ] The file is skipped in production

> It marks the boundary between server and client code. (Client Components are still pre-rendered to HTML on the server.)

## Q
Which prop **can't** a Server Component pass to a Client Component?

- [ ] Some JSX
- [x] An ordinary function like `() => console.log('hi')`
- [ ] A plain object with numbers
- [ ] A string

> Props cross from server to browser and must be serialisable. Server functions are the exception, sent as references.

## Q
Why does `placeOrder` check `qty` on the server, when the input already has `min` and `max`?

- [ ] TypeScript requires it
- [ ] Browsers ignore `min` and `max`
- [ ] To make it faster
- [x] A server function is a public endpoint; anyone can call it with any data, bypassing the form

> Only the server's own checks can be trusted.

## Q
Why can't lesson 32's app be hosted on GitHub Pages like the others?

- [ ] It has no `index.html`
- [ ] GitHub doesn't allow Next.js
- [ ] It's too big
- [x] It needs a server to run Server Components and actions; GitHub Pages only serves files

> A Vite single-page app is just files. Server Components need something running.

## Exercise: A server-only total
In `snack-shelf-next`, add a line under the shelf: "6 snacks, from $1.50 to $3.00", calculated in the Server Component. Check in the browser's DevTools that no JavaScript for it was downloaded.

### Hint
You already have the snacks in `ShelfPage`. `Math.min` and `Math.max` with spread.

### Solution
```tsx
const prices = snacks.map((s) => s.price)

<p className="summary">
  {snacks.length} snacks, from ${Math.min(...prices).toFixed(2)} to ${Math.max(...prices).toFixed(2)}
</p>
```

The calculation happens on the server, and only the resulting text reaches the browser.
