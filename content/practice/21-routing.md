## Q
Why use `<Link to="/basket">` instead of `<a href="/basket">`?

- [ ] `<Link>` is faster to type
- [ ] `<a>` doesn't work in JSX
- [ ] Links are styled differently
- [x] `<a>` reloads the whole page and loses React's state; `<Link>` changes the URL and lets the router render

> `<Link>` still renders a real `<a>`, so new tabs and screen readers work, but it handles normal clicks itself.

## Q
What does `<Outlet />` do in a layout route?

- [ ] Exits the router
- [ ] Links to another page
- [x] Marks where the child route that matches the URL is rendered
- [ ] Shows a 404 page

> It's the layout's hole for the current page, like `children` filled in by the router.

## Q
For the route `snack/:id` and the URL `#/snack/mochi`, what does `useParams()` return?

- [ ] `{ snack: 'mochi' }`
- [ ] `'mochi'`
- [x] `{ id: 'mochi' }`
- [ ] `{ path: '/snack/mochi' }`

> The name after the colon becomes the key. Its type is `string | undefined`.

## Q
Why does lesson 21 keep the search text in the URL (`?q=mel`)?

- [ ] To hide it from users
- [ ] URLs are faster than state
- [ ] React Router requires it
- [x] The shelf page unmounts when you leave it, so state would be lost; the URL survives Back, reloads and sharing

> Things worth bookmarking or sharing, like searches and filters, belong in the URL.

## Q
Why does the app use `HashRouter` on GitHub Pages?

- [ ] It's the only router in React Router
- [x] Everything after `#` never reaches the server, so reloading or opening any address still loads `index.html`
- [ ] It's faster
- [ ] Hash URLs are better for SEO

> With `BrowserRouter`, the server would have to send `index.html` for every path, which GitHub Pages can't be told to do.

## Exercise: A "Liked" page
Add a page at `/liked` that shows only the snacks with at least one like, and a link to it in the header.

### Hint
A new component in `pages/`, a new `<Route path="liked">`, the likes from `useLikes()`, and `<NavLink>` in the Header.

### Solution
```tsx
// pages/LikedPage.tsx
export default function LikedPage() {
  const { snacks } = useSnackData()
  const { likes } = useLikes()
  const liked = snacks.filter((s) => (likes[s.id] ?? 0) > 0)

  if (liked.length === 0) {
    return <Panel title="No favourites yet">Press ❤ on a snack you like.</Panel>
  }
  return <Shelf snacks={liked} />
}
```

```tsx
// App.tsx
<Route path="liked" element={<LikedPage />} />
```

```tsx
// Header.tsx
<NavLink to="/liked">❤ Liked</NavLink>
```

(In lesson 21 pages also check `status`; from lesson 28 they don't need to.)
