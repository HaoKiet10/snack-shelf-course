---
title: Splitting components
summary: App has grown to a hundred lines that do everything. Split it into components with clear jobs, and meet children, the prop that lets a component wrap JSX it knows nothing about.
minutes: 15
demo: 16-composition
---

Part two starts by cleaning up. Nothing looks different, but `App.tsx` went from a long mix of state, effects, handlers and markup to a short file that **reads like a summary** of the app.

## When to split

There is no rule like "100 lines max". These are better signals:

- **One part has its own job** you can name in two words: "the search bar", "the shelf". If you can name it, it can be a component.
- **The same markup appears twice**, like lesson 15's three nearly identical `<p className="status">` / `<p className="empty">` boxes.
- **You scroll to understand it.** If reading `App` means jumping between the top (state) and the bottom (JSX that uses it), pieces of it want to live together.

And one reason *not* to split: making tiny components that each hold three lines and need six props. A component should make the code that uses it **simpler**.

## The new pieces

```diagram
App                 state + what to show
├─ Header
├─ SearchBar        the input, Clear, Escape
├─ Panel            a box for messages (loading, error, nothing found)
└─ Shelf            the grid
   └─ SnackCard × 6
```

**SearchBar** takes the query and reports changes. Escape, the 20-character limit and the Clear button moved inside it, because they are about *typing*, not about the app:

```tsx
type SearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}
```

The query itself stays in App. App needs it to filter, so App owns it, and SearchBar gets it as a prop (lesson 11's rule: state lives with the closest component that needs it).

**Shelf** gets the visible snacks and draws the grid. The `map` and the `key` (lesson 9) moved there.

## children: a component with a hole in it

The loading message, the error and "nothing found" were three slightly different boxes. They became one **Panel**:

```tsx
type PanelProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
}

export default function Panel({ title, action, children }: PanelProps) {
  return (
    <section className="panel">
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="panel-body">{children}</div>
      {action && <div className="panel-action">{action}</div>}
    </section>
  )
}
```

`children` is a special prop: it is **whatever you write between the opening and closing tags**.

```tsx
<Panel title="Nothing found">
  No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
</Panel>
```

Here `children` is the sentence. Panel does not know or care what it is: text, a list, another component. It just puts it in the right place. That is **composition**: building bigger things by nesting pieces, instead of adding a prop for every possible variation.

`title?: string` with a `?` makes the prop optional. `ReactNode` is the type of anything React can render, which is what `children` usually is.

## Slots: more than one hole

`children` is one hole. For a second one, use an ordinary prop that takes JSX:

```tsx
<Panel
  title="Couldn't load the snacks"
  action={<button onClick={retry}>Try again</button>}
>
  Check your connection, then try again.
</Panel>
```

`action` is a **slot**. JSX is just a value (lesson 4), so you can pass it as a prop like any number or string. Panel decides *where* the button goes; App decides *what* the button is.

## App now

```tsx
let content: ReactNode
if (status === 'loading') {
  content = <Panel>Loading snacks…</Panel>
} else if (status === 'error') {
  content = (
    <Panel title="Couldn't load the snacks" action={<button onClick={retry}>Try again</button>}>
      Check your connection, then try again.
    </Panel>
  )
} else if (visible.length === 0) {
  content = <Panel title="Nothing found">No snacks match …</Panel>
} else {
  content = <Shelf snacks={visible} likes={likes} onLike={like} onAdd={addToBasket} />
}

return (
  <>
    <Header count={basket.length} total={total} />
    <SearchBar query={query} onQueryChange={setQuery} />
    {/* hint */}
    {content}
  </>
)
```

Each outcome is one short line, because each piece has a name that says what it is. The CSS moved too: each component's styles now sit next to it (`SearchBar.css`, `Shelf.css`, `Panel.css`).

## Notice the props

`Shelf` gets `likes`, `onLike` and `onAdd` only so it can hand them on to each `SnackCard`. It does not use them itself. Passing props through a component that does not need them is called **prop drilling**. Two levels is fine. When the basket arrives in the next lesson and several distant components need it, this will start to hurt, and lesson 19 fixes it.

## Check yourself

<details>
<summary>What is <code>children</code>?</summary>

The prop that holds whatever JSX is written between a component's opening and closing tags. The component decides where to render it.
</details>

<details>
<summary>Why does the query stay in App instead of moving into SearchBar?</summary>

App needs it to filter the snacks. State lives in the closest component that needs it, and props only flow down, so App owns it and passes it to SearchBar.
</details>

<details>
<summary>How do you give a component two places to put outside JSX?</summary>

Use `children` for one, and an ordinary prop typed `ReactNode` (a slot, like `action`) for the other.
</details>
