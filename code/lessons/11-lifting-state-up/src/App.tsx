import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import { SNACKS } from './data/snacks.ts'
import './App.css'

const MAX_QUERY = 20

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components and hands each one its data as props.
export default function App() {
  // The search text lives in React state. The <input> just DISPLAYS it.
  const [query, setQuery] = useState('')

  // LIFTED STATE. Likes used to live inside each SnackCard, so a card that
  // the filter removed forgot its likes. Now App keeps them, and App never
  // disappears. One object for all snacks: { pocky: 3, onigiri: 1 }.
  const [likes, setLikes] = useState<Record<string, number>>({})

  // The basket is needed by TWO siblings: the cards (add) and the Header
  // (show the count). The closest common parent is App, so it lives here.
  // One id per item added, so ['pocky', 'pocky'] is two Pocky.
  const [basket, setBasket] = useState<string[]>([])

  // DERIVED data: not state. Recomputed on every render from SNACKS + query.
  // (Lesson 6: derive, don't store.)
  const q = query.trim().toLowerCase()
  const visible = SNACKS.filter((s) => s.name.toLowerCase().includes(q))

  // Derived from the basket: no extra state needed.
  const total = basket.reduce((sum, id) => {
    const snack = SNACKS.find((s) => s.id === id)
    return sum + (snack ? snack.price : 0)
  }, 0)

  // State updates must make NEW objects/arrays, never change the old ones.
  // React compares old and new by identity: same object = "nothing changed".
  function like(id: string) {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  function addToBasket(id: string) {
    setBasket((prev) => [...prev, id])
  }

  // Event handlers: functions React calls with an event object.
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value.slice(0, MAX_QUERY))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <>
      <Header count={basket.length} total={total} />
      <div className="search">
        <input
          type="text"
          placeholder="Search snacks…"
          value={query}            // controlled: state -> input
          onChange={handleChange}  // input -> state, on every keystroke
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => setQuery('')} disabled={query === ''}>
          Clear
        </button>
      </div>
      {/* &&: "if the left side is true, render the right side, else nothing".
          The hint only makes sense while you're searching. */}
      {query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {SNACKS.length} snacks
        </p>
      )}
      {/* ? : picks ONE of two things to render. */}
      {visible.length > 0 ? (
        <main className="shelf">
          {/* map: turn each Snack object into a <SnackCard>.
              key: tells React WHICH snack each card is, across renders. */}
          {visible.map((snack) => (
            <SnackCard
              key={snack.id}
              name={snack.name}
              price={snack.price}
              emoji={snack.emoji}
              likes={likes[snack.id] ?? 0}
              onLike={() => like(snack.id)}
              onAdd={() => addToBasket(snack.id)}
            />
          ))}
        </main>
      ) : (
        <p className="empty">
          No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
        </p>
      )}
    </>
  )
}
