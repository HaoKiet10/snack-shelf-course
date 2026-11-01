import './Header.css'

type HeaderProps = {
  count: number
  total: number
}

// Header doesn't know where the basket lives. It just shows two numbers.
export default function Header({ count, total }: HeaderProps) {
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
