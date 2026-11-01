import type { ChangeEvent, KeyboardEvent } from 'react'
import './SearchBar.css'

const MAX_QUERY = 20

// The search box on its own. It doesn't own the query: App does, because
// App also needs it to filter. SearchBar shows it and reports changes.
type SearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onQueryChange(e.target.value.slice(0, MAX_QUERY))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      onQueryChange('')
    }
  }

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search snacks…"
        aria-label="Search snacks"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => onQueryChange('')} disabled={query === ''}>
        Clear
      </button>
    </div>
  )
}
