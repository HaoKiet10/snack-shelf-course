import { useEffect, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import { loadSnacks } from './data/snacks.ts'
import type { Snack } from './data/snacks.ts'
import './App.css'

const MAX_QUERY = 20
const LIKES_KEY = 'snack-shelf-likes'

// Read saved likes from the browser. Runs once, on the first render only.
function readSavedLikes(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? '{}')
  } catch {
    return {}  // broken or blocked storage: start fresh
  }
}

type Status = 'loading' | 'ready' | 'error'

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components and hands each one its data as props.
export default function App() {
  // The search text lives in React state. The <input> just DISPLAYS it.
  const [query, setQuery] = useState('')

  // LIFTED STATE. Likes used to live inside each SnackCard, so a card that
  // the filter removed forgot its likes. Now App keeps them, and App never
  // disappears. One object for all snacks: { pocky: 3, onigiri: 1 }.
  // Passing a FUNCTION to useState: React calls it once for the first value,
  // instead of reading localStorage on every render.
  const [likes, setLikes] = useState<Record<string, number>>(readSavedLikes)

  // The basket is needed by TWO siblings: the cards (add) and the Header
  // (show the count). The closest common parent is App, so it lives here.
  // One id per item added, so ['pocky', 'pocky'] is two Pocky.
  const [basket, setBasket] = useState<string[]>([])

  // The snacks come from the network now. Start empty, and track how it went.
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [status, setStatus] = useState<Status>('loading')
  // Bumping this number re-runs the loading effect (see its dependencies).
  const [attempt, setAttempt] = useState(0)

  // EFFECT 1: load the snacks.
  // Rendering must stay pure (no fetching while drawing), so the fetch goes
  // in an effect: React runs it AFTER the screen has been updated.
  // [attempt] = "run after the first render, and again when attempt changes".
  useEffect(() => {
    let ignore = false  // set to true if this effect is cleaned up
    loadSnacks()
      .then((data) => {
        if (!ignore) {
          setSnacks(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })
    // CLEANUP: runs before the effect runs again, and when App unmounts.
    // A stale request may still finish, but it can no longer set state.
    return () => {
      ignore = true
    }
  }, [attempt])

  // EFFECT 2: keep localStorage in sync with likes.
  // [likes] = "run after any render where likes changed".
  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes))
  }, [likes])

  function retry() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  // DERIVED data: not state. Recomputed on every render from snacks + query.
  // NOT an effect: an effect that sets state from other state is a wasted
  // extra render and one more thing to keep in sync.
  // (Lesson 6: derive, don't store.)
  const q = query.trim().toLowerCase()
  const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))

  // Derived from the basket: no extra state needed.
  const total = basket.reduce((sum, id) => {
    const snack = snacks.find((s) => s.id === id)
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

  // Four possible outcomes for the main area, so plain if/else before the
  // return reads better than nested ? : inside the JSX.
  let content: ReactNode
  if (status === 'loading') {
    content = <p className="status">Loading snacks…</p>
  } else if (status === 'error') {
    content = (
      <p className="status">
        Couldn't load the snacks. <button onClick={retry}>Try again</button>
      </p>
    )
  } else if (visible.length === 0) {
    content = (
      <p className="empty">
        No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
      </p>
    )
  } else {
    content = (
      <main className="shelf">
        {/* key: tells React WHICH snack each card is, across renders. */}
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
    )
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
      {status === 'ready' && query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      {content}
    </>
  )
}
