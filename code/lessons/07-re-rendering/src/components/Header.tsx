import './Header.css'

// A component is a function whose name starts with a CAPITAL letter
// and returns JSX (a description of some UI).
export default function Header() {
  // Lesson 7: runs every time React calls this function (= every render).
  console.log('render Header')

  return (
    <header className="header">
      <h1>Yune's Snack Shelf</h1>
      <span className="basket">🧺 0</span>
    </header>
  )
}
