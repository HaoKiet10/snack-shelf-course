import { Link, NavLink } from 'react-router'
import { useBasketCount, useBasketTotal } from '../store/basketStore.ts'
import './Header.css'

export default function Header() {
  const count = useBasketCount()
  const total = useBasketTotal()
  return (
    <header className="header">
      {/* <Link> changes the URL WITHOUT reloading the page: React Router
          catches the click and renders the matching route instead. */}
      <h1>
        <Link to="/">Yune's Snack Shelf</Link>
      </h1>
      {/* <NavLink> is a Link that knows if it's the current page, and then
          adds class="active" (and aria-current="page") by itself. */}
      <NavLink className="basket" to="/basket">
        🧺 {count}
        {count > 0 && <span className="total"> · ${total.toFixed(2)}</span>}
      </NavLink>
    </header>
  )
}
