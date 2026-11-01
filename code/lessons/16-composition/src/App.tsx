import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import SearchBar from './components/SearchBar.tsx'
import Shelf from './components/Shelf.tsx'
import { loadSnacks } from './data/snacks.ts'
import type { Snack } from './data/snacks.ts'
import './App.css'

const LIKES_KEY = 'snack-shelf-likes'

function readSavedLikes(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? '{}')
  } catch {
    return {}
  }
}

type Status = 'loading' | 'ready' | 'error'

// App keeps the STATE and decides WHAT to show.
// The components it renders decide HOW each part looks.
export default function App() {
  const [query, setQuery] = useState('')
  const [likes, setLikes] = useState<Record<string, number>>(readSavedLikes)
  const [basket, setBasket] = useState<string[]>([])
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
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
    return () => {
      ignore = true
    }
  }, [attempt])

  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes))
  }, [likes])

  function retry() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  const q = query.trim().toLowerCase()
  const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))

  const total = basket.reduce((sum, id) => {
    const snack = snacks.find((s) => s.id === id)
    return sum + (snack ? snack.price : 0)
  }, 0)

  function like(id: string) {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  function addToBasket(id: string) {
    setBasket((prev) => [...prev, id])
  }

  // Each outcome is now one short line of JSX, because the pieces
  // (Panel, Shelf) are components with names that say what they are.
  let content: ReactNode
  if (status === 'loading') {
    content = <Panel>Loading snacks…</Panel>
  } else if (status === 'error') {
    content = (
      <Panel title="Couldn't load the snacks" action={<button onClick={retry}>Try again</button>}>
        Check your connection, then try again.
      </Panel>
    )
  } else if (visible.length === 0) {
    content = (
      <Panel title="Nothing found">
        No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
      </Panel>
    )
  } else {
    content = <Shelf snacks={visible} likes={likes} onLike={like} onAdd={addToBasket} />
  }

  return (
    <>
      <Header count={basket.length} total={total} />
      <SearchBar query={query} onQueryChange={setQuery} />
      {status === 'ready' && query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      {content}
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
