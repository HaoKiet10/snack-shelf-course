## Q
What is `children` in `<Panel title="Hi">Some text</Panel>`?

- [ ] An array of Panel's child components
- [x] `"Some text"`: whatever is written between the tags
- [ ] Nothing; Panel takes no children
- [ ] `"Hi"`

> `children` is a special prop holding the content between the opening and closing tags.

## Q
Panel needs a second place for outside JSX, a button at the bottom. How?

- [ ] It can't; components only get one `children`
- [ ] Use two Panels
- [ ] Pass the button inside `title`
- [x] Add a prop typed `ReactNode`, like `action`, and render it where the button goes

> JSX is a value, so any prop can carry it. Such a prop is often called a slot.

## Q
What is the type of a prop that can hold any renderable content?

- [ ] `HTMLElement`
- [ ] `JSX`
- [ ] `string`
- [x] `ReactNode`

> `ReactNode` covers elements, strings, numbers, arrays, `null` and more.

## Q
What is **prop drilling**?

- [ ] Passing too many props to one component
- [ ] Using `children` everywhere
- [ ] Changing props inside a child
- [x] Passing props through components that don't use them, just to reach a deeper one

> In lesson 16, `Shelf` received `onAdd` only to hand it to `SnackCard`. Lesson 19 removes it with context.

## Q
Which is a **bad** reason to split out a component?

- [ ] It has a job you can name in two words
- [ ] The same markup appears in several places
- [ ] Reading the parent means scrolling back and forth
- [x] To keep every file under ten lines, even if each needs six props from its parent

> Splitting should make the code that uses the component simpler. Tiny pieces with long prop lists do the opposite.

## Exercise: A Card wrapper
Many boxes in the app share the same look: padding, rounded corners, a surface background. Make a `Box` component that takes `children` and an optional `tone?: 'plain' | 'highlight'`, and use it for the empty-search message.

### Hint
Combine a base class with one that depends on `tone`, and render `children` inside.

### Solution
```tsx
import type { ReactNode } from 'react'

type BoxProps = {
  tone?: 'plain' | 'highlight'
  children: ReactNode
}

export default function Box({ tone = 'plain', children }: BoxProps) {
  return <div className={`box box-${tone}`}>{children}</div>
}
```

```tsx
<Box tone="highlight">No snacks match “{query}”.</Box>
```

`tone = 'plain'` is a default value for an optional prop.
