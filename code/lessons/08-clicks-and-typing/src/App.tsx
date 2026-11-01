import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import './App.css'

const MAX_QUERY = 20

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components and hands each one its data as props.
export default function App() {
  // The search text lives in React state. The <input> just DISPLAYS it.
  // It's here in App (not in a SearchBar) because next lesson App uses it
  // to decide which cards to show.
  const [query, setQuery] = useState('')

  // Event handlers: functions React calls with an event object.
  // ChangeEvent<HTMLInputElement> = "a change event from an <input>",
  // so TypeScript knows e.target.value is a string.
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Because WE decide what goes into state, we can transform the input.
    // Type 25 characters: only the first 20 ever appear.
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
        Searching for "{query}" ({query.length}/{MAX_QUERY})
      </p>
      <main className="shelf">
        <SnackCard name="Pocky" price={2.5} emoji="🍫" />
        <SnackCard name="Onigiri" price={1.8} emoji="🍙" />
        <SnackCard name="Melon Pan" price={2.2} emoji="🍈" />
      </main>
    </>
  )
}
