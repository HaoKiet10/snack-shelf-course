## Q
What does `npm run dev` do in a Vite project?

- [ ] Builds the final files for a web host
- [x] Starts a development server that serves your app and updates the page as you save
- [ ] Installs React
- [ ] Runs the tests

> The dev server translates TypeScript and JSX on the fly and pushes changes to the open page (Hot Module Replacement). Building for production is `npm run build` (lesson 14).

## Q
In what order does the page start up?

- [ ] `App.tsx` → `index.html` → `main.tsx`
- [ ] `main.tsx` → `index.html` → `App.tsx`
- [x] `index.html` → `main.tsx` → `App.tsx`
- [ ] `App.tsx` → `main.tsx` → `index.html`

> The browser loads `index.html`, whose `<script type="module">` loads `main.tsx`, which imports `App` and tells React to render it into `<div id="root">`.

## Q
```tsx
<button onClick={() => setCount((count) => count + 1)}>
```
Why is there an arrow function around `setCount(...)`?

- [ ] To make the button faster
- [x] So React gets a function to call later, on click, instead of calling setCount immediately while drawing
- [ ] Arrow functions are required by TypeScript
- [ ] Because onClick only accepts strings

> `onClick={setCount(5)}` would run `setCount(5)` during rendering and pass its result to onClick. Wrapping it in `() => …` passes a function, which React calls when the click happens.

## Q
What does `(count) => count + 1` passed to `setCount` mean?

- [ ] It is the same as `setCount(count + 1)` in every case
- [ ] Add 1 to every count in the app
- [ ] Set count to the function itself
- [x] "Take the latest count and return it plus one": the updater form

> Passing a function lets React give you the most recent value, which matters when several updates happen before the next render (lesson 6).

## Q
What does TypeScript add to the project?

- [ ] A different version of React
- [ ] It makes the app run faster in the browser
- [x] Type checking while you write, so many mistakes show up before the code runs
- [ ] Automatic tests

> Types are removed when the code is built; the browser runs plain JavaScript. Their value is catching mistakes in the editor and in `tsc`.

## Exercise: Change the starter
In a fresh Vite project, make the counter button go up by 2 on each click, and add a second button that resets it to 0.

### Hint
Both buttons use the same `setCount`. The reset doesn't need the previous value.

### Solution
```tsx
<button onClick={() => setCount((count) => count + 2)}>count is {count}</button>
<button onClick={() => setCount(0)}>Reset</button>
```

The reset can pass a plain value, because the new value doesn't depend on the old one.
