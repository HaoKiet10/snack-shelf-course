import { useState } from 'react'
import type { ReactNode } from 'react'
import BasketPanel from './components/BasketPanel.tsx'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import SearchBar from './components/SearchBar.tsx'
import Shelf from './components/Shelf.tsx'
import { useSnackData } from './context/SnacksContext.ts'
import { useLocalStorage } from './hooks/useLocalStorage.ts'
import './App.css'

// App keeps the STATE and decides WHAT to show.
// The components it renders decide HOW each part looks.
export default function App() {
  const [query, setQuery] = useState('')
  const [likes, setLikes] = useLocalStorage<Record<string, number>>('snack-shelf-likes', {})
  // The snacks come from context now: loaded once by <SnacksProvider>.
  // The basket isn't mentioned here at all; the components that need it
  // read it themselves.
  const { snacks, status, retry } = useSnackData()

  const q = query.trim().toLowerCase()
  const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))

  function like(id: string) {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
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
    content = <Shelf snacks={visible} likes={likes} onLike={like} />
  }

  return (
    <>
      <Header />
      <SearchBar query={query} onQueryChange={setQuery} />
      {status === 'ready' && query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      {content}
      {status === 'ready' && (
        <BasketPanel />
      )}
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
