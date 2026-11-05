import { useDeferredValue, useState, useTransition } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import Panel from '../components/Panel.tsx'
import SegmentedControl from '../components/SegmentedControl.tsx'
import type { Option } from '../components/SegmentedControl.tsx'
import SearchBar from '../components/SearchBar.tsx'
import Shelf from '../components/Shelf.tsx'
import SlowDown from '../components/SlowDown.tsx'
import { useLikes } from '../context/LikesContext.ts'
import type { Snack } from '../data/snacks.ts'
import { useSnacks } from '../hooks/useSnacks.ts'
import './ShelfPage.css'

// `as const` keeps the exact values ('name', not just string).
// `satisfies` checks the shape against Option without widening it.
const SORTS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Cheapest' },
  { value: 'likes', label: 'Most liked' },
] as const satisfies readonly Option<string>[]

// The type is DERIVED from the data: add a sort above and it appears here.
type SortKey = (typeof SORTS)[number]['value']   // 'name' | 'price' | 'likes'

// The page at "/": search, sort, and the shelf.
export default function ShelfPage() {
  const { snacks } = useSnacks()
  const { likes } = useLikes()

  const [searchParams, setSearchParams] = useSearchParams()
  const slow = searchParams.get('slow') === '1'

  // The text in the box is LOCAL state, so typing is an urgent update.
  // It starts from the URL and is copied back to it on every change.
  // (React Router applies URL changes as a transition, which is not urgent:
  // an input that read straight from the URL would lag on a slow device.)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  function changeQuery(next: string) {
    setQuery(next)          // urgent: the input shows it now
    setParam('q', next)     // the URL catches up, for Back and sharing
  }

  function setParam(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === '') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  // URGENT vs NOT URGENT.
  // The input must show every key straight away (urgent). The shelf can lag
  // a moment behind. useDeferredValue gives a copy of `query` that React
  // updates only after the urgent work is done, and can abandon half-way if
  // you type again.
  const deferredQuery = useDeferredValue(query)

  // Sorting is never urgent: wrap it in a TRANSITION. React renders the new
  // order in the background and keeps the current screen working meanwhile.
  const [sort, setSort] = useState<SortKey>('name')
  const [isPending, startTransition] = useTransition()

  const q = deferredQuery.trim().toLowerCase()
  const visible = sortSnacks(
    snacks.filter((s) => s.name.toLowerCase().includes(q)),
    sort,
    likes,
  )

  // While the shelf shows older results than the input, dim it.
  const isStale = query !== deferredQuery || isPending

  let content: ReactNode
  if (visible.length === 0) {
    content = (
      <Panel title="Nothing found">
        No snacks match “{deferredQuery.trim()}”. Try “pocky” or “mochi”.
      </Panel>
    )
  } else {
    content = <Shelf snacks={visible} />
  }

  return (
    <>
      <title>Yune's Snack Shelf</title>
      {/* Every page starts with a heading, even if it's only for screen
          readers, so "jump to next heading" lands somewhere useful. */}
      <h2 className="visually-hidden">All snacks</h2>
      <SearchBar query={query} onQueryChange={changeQuery} />
      <div className="shelf-tools">
        {/* T is inferred as SortKey from `options` and `value`. */}
        <SegmentedControl
          label="Sort by"
          options={SORTS}
          value={sort}
          onChange={(next) => startTransition(() => setSort(next))}
        />
        <label className="slow-toggle">
          <input
            type="checkbox"
            checked={slow}
            onChange={(e) => setParam('slow', e.target.checked ? '1' : '')}
          />
          Simulate a slow device
        </label>
      </div>
      {query !== '' && (
        <p className="search-hint">
          Showing {visible.length} of {snacks.length} snacks
        </p>
      )}
      <div className={isStale ? 'results stale' : 'results'}>
        {slow && <SlowDown cards={visible.length} query={deferredQuery} sort={sort} />}
        {content}
      </div>
    </>
  )
}

function sortSnacks(list: Snack[], sort: SortKey, likes: Record<string, number>): Snack[] {
  // toSorted returns a NEW sorted array; sort() would change `list` in place.
  return list.toSorted((a, b) => {
    if (sort === 'price') return a.price - b.price
    if (sort === 'likes') return (likes[b.id] ?? 0) - (likes[a.id] ?? 0)
    return a.name.localeCompare(b.name)
  })
}
