---
title: Pages and routing
summary: Give every snack its own page and the basket its own address with React Router. Links that do not reload, a layout shared by every page, URL parameters, and a search that lives in the URL.
minutes: 25
demo: 21-routing
---

Click a snack's name and it opens its own page, with a description and a **Buy now** button. The 🧺 in the header goes to a basket page. The browser's Back button works, and a search like "mel" is still there when you come back.

## What a router does

The app is still **one HTML page**. A router watches the URL, and when it changes, renders a different component instead of asking the server for a new page. Clicking a link swaps the content instantly, the app's state (the basket, the loaded snacks) survives, and the URL still says where you are, so Back, Forward, bookmarks and shared links all work.

React does not include a router. **React Router** is the most widely used one:

```bash
npm install react-router
```

## Routes: a map of the site

```tsx
// App.tsx
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ShelfPage />} />
        <Route path="snack/:id" element={<SnackPage />} />
        <Route path="basket" element={<BasketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

`<Routes>` looks at the current URL and renders the **one** `<Route>` that matches best:

| URL | route | page |
|---|---|---|
| `/` | `index` | ShelfPage |
| `/snack/pocky` | `snack/:id` | SnackPage, with `id = "pocky"` |
| `/basket` | `basket` | BasketPage |
| `/anything/else` | `*` | NotFoundPage |

App has become a map of the site. Each page is an ordinary component in `src/pages/`; what used to be App's body is now `ShelfPage`.

## A layout and its Outlet

The outer `<Route element={<Layout />}>` has no path. It wraps the others, so every page gets the same frame:

```tsx
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
```

`<Outlet />` is the hole where the matching child page goes. It is `children`'s idea (lesson 16), filled in by the router instead of by you.

## Link instead of a

```tsx
<Link to={`/snack/${id}`}>{name}</Link>
```

A plain `<a href>` makes the browser load the page from the server again, throwing away all of React's state. `<Link>` renders a real `<a>` (so right-click, "open in new tab" and screen readers still work), but catches normal clicks, updates the URL and lets the router re-render. `SnackCard` now gets an `id` prop so it can build its link.

`NavLink` is a Link that knows whether it points at the current page:

```tsx
<NavLink className="basket" to="/basket">🧺 {count}</NavLink>
```

On the basket page it gets `class="active"` and `aria-current="page"`, which the CSS uses to highlight it.

## URL parameters

One component serves every snack. The `:id` in `snack/:id` is a placeholder, and `useParams` reads it:

```tsx
export default function SnackPage() {
  const { id } = useParams()
  const { snacks, status } = useSnackData()

  if (status !== 'ready') {
    return <SnacksStatus />
  }

  const snack = snacks.find((s) => s.id === id)
  if (!snack) {
    return <Panel title="No such snack" …>There's no snack called “{id}”.</Panel>
  }
  // … the page for this snack
}
```

`id` is `string | undefined`, because TypeScript cannot know this component is only used on a route with `:id`. The URL is **input from the outside**: anyone can type `/snack/banana`, so the page must handle a snack that does not exist.

The snacks gained an `about` field in `snacks.json` for the page's description.

## Navigating from code

```tsx
const navigate = useNavigate()

function buyNow(snackId: string) {
  dispatch({ type: 'added', id: snackId })
  navigate('/basket')
}
```

Use `<Link>` when the user clicks to go somewhere. Use `navigate()` when the app decides to move after doing something, like after adding to the basket, or after a form is submitted.

## The search lives in the URL

Before, the query was `useState` in App. Now ShelfPage is a page, and leaving it **unmounts** it (lesson 7), so a search would be lost on the way to a snack and back. The fix is to keep it in the URL instead:

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const query = searchParams.get('q') ?? ''

function setQuery(next: string) {
  setSearchParams(next === '' ? {} : { q: next }, { replace: true })
}
```

Type "mel" and the address becomes `…#/?q=mel`. The URL *is* the state: it survives Back, a reload, and a shared link. `replace: true` updates the current history entry instead of adding one per keystroke, so Back does not step through every letter. SearchBar did not change at all; it still gets `query` and `onQueryChange`.

Good things to keep in the URL: searches, filters, sort order, the current tab. Anything someone might want to bookmark or share.

## Likes move to context

The likes are needed on two pages now, the shelf and the snack page. They moved into a `LikesContext` with `useLikes()`, the same pattern as the basket (lesson 19). `Shelf` takes only `snacks` now.

## HashRouter and static hosting

```tsx
// main.tsx
<HashRouter>
  <SnacksProvider>…<App />…</SnacksProvider>
</HashRouter>
```

There are two ways to keep the path in the URL:

| | BrowserRouter | HashRouter |
|---|---|---|
| URL | `/snack-shelf/snack/pocky` | `/snack-shelf/#/snack/pocky` |
| reload or open a link directly | the server must send `index.html` for every path | always works: the server only sees `/snack-shelf/` |
| needs | a server you can configure | nothing |

GitHub Pages cannot be told "send `index.html` for every path", so opening `/snack-shelf/snack/pocky` directly would be a 404. Everything after `#` never reaches the server, so with HashRouter it always works. On a host that supports a fallback (Netlify, Vercel, your own server), BrowserRouter gives cleaner URLs.

## Check yourself

<details>
<summary>Why use <code>&lt;Link&gt;</code> instead of <code>&lt;a href&gt;</code>?</summary>

An `<a>` reloads the whole page from the server, losing React's state. `<Link>` renders an `<a>` but handles the click itself: it updates the URL and lets the router render the new page.
</details>

<details>
<summary>What does <code>&lt;Outlet /&gt;</code> do?</summary>

It marks where a layout route renders the child route that matches the current URL.
</details>

<details>
<summary>Why does SnackPage handle a missing snack?</summary>

The id comes from the URL, which anyone can type. `/snack/banana` matches the route, but there is no such snack.
</details>

<details>
<summary>Why does the search live in the URL instead of in state?</summary>

ShelfPage unmounts when you go to another page, which would throw its state away. The URL survives navigation, reloads and sharing.
</details>
