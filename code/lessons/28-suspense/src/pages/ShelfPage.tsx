import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import Panel from '../components/Panel.tsx'
import SearchBar from '../components/SearchBar.tsx'
import Shelf from '../components/Shelf.tsx'
import { useSnacks } from '../hooks/useSnacks.ts'

// The page at "/": search plus the shelf.
export default function ShelfPage() {
  // No status to check: if this line returns, the snacks are loaded.
  const { snacks } = useSnacks()

  // The search text lives in the URL now (…/#/?q=oni) instead of useState.
  // So it survives going to a snack's page and pressing Back, and you can
  // share a link to a search.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  function setQuery(next: string) {
    // replace: don't add a history entry for every keystroke
    setSearchParams(next === '' ? {} : { q: next }, { replace: true })
  }

  const q = query.trim().toLowerCase()
  const visible = snacks.filter((s) => s.name.toLowerCase().includes(q))

  let content: ReactNode
  if (visible.length === 0) {
    content = (
      <Panel title="Nothing found">
        No snacks match “{query.trim()}”. Try “pocky” or “mochi”.
      </Panel>
    )
  } else {
    content = <Shelf snacks={visible} />
  }

  return (
    <>
      <SearchBar query={query} onQueryChange={setQuery} />
      {query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      {content}
    </>
  )
}
