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

  // DERIVED data: not state. Recomputed on every render from SNACKS + query.
  // (Lesson 6: derive, don't store.)
  const q = query.trim().toLowerCase()
  const visible = SNACKS.filter((s) => s.name.toLowerCase().includes(q))

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
      <Header />
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
      <p className="search-hint">
        Showing {visible.length} of {SNACKS.length} snacks
      </p>
      <main className="shelf">
        {/* map: turn each Snack object into a <SnackCard>.
            key: tells React WHICH snack each card is, across renders. */}
        {visible.map((snack) => (
          <SnackCard
            key={snack.id}
            name={snack.name}
            price={snack.price}
            emoji={snack.emoji}
          />
        ))}
      </main>
    </>
  )
}
