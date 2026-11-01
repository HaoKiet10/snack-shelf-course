import { useEffect, useRef } from 'react'
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
  // A REF: a box React keeps between renders, like state, but changing it
  // does NOT re-render. Put it on an element with ref={inputRef} and React
  // fills inputRef.current with the real <input> DOM node after rendering.
  const inputRef = useRef<HTMLInputElement>(null)

  // Press "/" anywhere on the page to jump to the search box.
  // The listener is on window, outside React, so it's an effect with cleanup.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if (e.key === '/' && !typing) {
        e.preventDefault()          // don't type the "/" itself
        inputRef.current?.focus()   // ?. because current is null before mount
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onQueryChange(e.target.value.slice(0, MAX_QUERY))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (query === '') {
        inputRef.current?.blur()    // second Escape: leave the box
      }
      onQueryChange('')
    }
  }

  return (
    <div className="search">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search snacks…  ( / )"
        aria-label="Search snacks"
        aria-keyshortcuts="/"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={() => {
          onQueryChange('')
          inputRef.current?.focus()   // put the cursor back for the next search
        }}
        disabled={query === ''}
      >
        Clear
      </button>
    </div>
  )
}
