import { useBasket } from '../context/BasketContext.ts'
import './Header.css'

// No props any more: Header reads the basket straight from context.
export default function Header() {
  const { count, total } = useBasket()
  return (
    <header className="header">
      <h1>Yune's Snack Shelf</h1>
      <span className="basket">
        🧺 {count}
        {count > 0 && <span className="total"> · ${total.toFixed(2)}</span>}
      </span>
    </header>
  )
}
