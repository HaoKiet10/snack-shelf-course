## Q
What is a React component?

- [ ] A DOM element created by React
- [x] A function that returns a description of some UI (JSX)
- [ ] A CSS class with JavaScript inside
- [ ] An HTML file for one part of the page

> A component is just a function. React calls it and turns what it returns into DOM.

## Q
Which of these is used as a component correctly?

- [ ] `function SnackCard() { … }` used as `<snack-card />`
- [ ] `const SnackCard = <div>…</div>` used as `<SnackCard />`
- [ ] `function snackCard() { … }` used as `<snackCard />`
- [x] `function SnackCard() { … }` used as `<SnackCard />`

> Component names must start with a capital letter. Lowercase tags like `<snackCard>` are treated as HTML elements.

## Q
Why does this fail?
```tsx
function Header() {
  return (
    <h1>Snack Shelf</h1>
    <span>🧺 0</span>
  )
}
```

- [x] A component must return one element; wrap them in a parent or a Fragment `<>…</>`
- [ ] The function needs to be async
- [ ] Emoji can't be used in JSX
- [ ] `<span>` is not allowed in a header

> JSX compiles to function calls, and a function returns one value. Wrap siblings in `<header>` or `<>…</>`.

## Q
In JSX, how do you give an element a CSS class?

- [ ] `css="card"`
- [ ] `style="card"`
- [x] `className="card"`
- [ ] `class="card"`

> JSX is JavaScript, where `class` is a keyword, so the attribute is `className`.

## Q
`export default function Header()` in `Header.tsx`. Which import works?

- [x] `import Header from './components/Header.tsx'`
- [ ] `require Header from './components/Header.tsx'`
- [ ] `import { Header } from './components/Header.tsx'`
- [ ] `import * from './components/Header.tsx'`

> A default export is imported without braces, under any name you choose. Braces are for named exports.

## Exercise: A Footer component
Add a `Footer` component in `components/Footer.tsx` that shows "Made with React" and the current year, and render it under the shelf in `App`.

### Hint
`new Date().getFullYear()` gives the year. Put JavaScript inside JSX with `{ }`.

### Solution
```tsx
// components/Footer.tsx
export default function Footer() {
  return <footer className="footer">Made with React · {new Date().getFullYear()}</footer>
}
```

```tsx
// App.tsx
import Footer from './components/Footer.tsx'

// … after the shelf:
<Footer />
```
