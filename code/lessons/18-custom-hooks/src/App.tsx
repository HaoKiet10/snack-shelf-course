import { useState } from 'react'
import type { ReactNode } from 'react'
import { basketTotal } from './basket/basketReducer.ts'
import BasketPanel from './components/BasketPanel.tsx'
import Header from './components/Header.tsx'
import Panel from './components/Panel.tsx'
import SearchBar from './components/SearchBar.tsx'
import Shelf from './components/Shelf.tsx'
import { useBasket } from './hooks/useBasket.ts'
import { useLocalStorage } from './hooks/useLocalStorage.ts'
import { useSnacks } from './hooks/useSnacks.ts'
import './App.css'

// App keeps the STATE and decides WHAT to show.
// The components it renders decide HOW each part looks.
export default function App() {
  const [query, setQuery] = useState('')
  // Three custom hooks. Each one hides a chunk of state + effects behind a
  // name, so App reads like a summary of what it needs.
  const [likes, setLikes] = useLocalStorage<Record<string, number>>('snack-shelf-likes', {})
  const { snacks, status, retry } = useSnacks()
  const { lines: basket, dispatch, count } = useBasket()

  const q = query.trim().toLowerCase()
  const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))

  // { pocky: 2.5, onigiri: 1.8, … } so prices can be looked up by id.
  const prices = Object.fromEntries(snacks.map((s) => [s.id, s.price]))
  const total = basketTotal(basket, prices)

  function like(id: string) {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  // No logic here any more: just say what happened.
  function addToBasket(id: string) {
    dispatch({ type: 'added', id })
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
      <Header count={count} total={total} />
      <SearchBar query={query} onQueryChange={setQuery} />
      {status === 'ready' && query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      {content}
      {status === 'ready' && (
        <BasketPanel lines={basket} snacks={snacks} total={total} dispatch={dispatch} />
      )}
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
