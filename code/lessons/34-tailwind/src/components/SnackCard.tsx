// Styled with Tailwind: each class does one small thing (p-4 is padding:
// 1rem, rounded-full is border-radius: 9999px), and the styles live right
// on the elements. SnackCard.module.css is gone.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

// The card no longer OWNS any state. It shows what it's given (likes) and
// reports clicks upward through callback props (onLike, onAdd).
// App decides what those clicks mean.
type SnackCardProps = {
  id: string
  name: string
  price: number
  emoji: string
  likes: number
  onLike: (id: string) => void   // the card passes its own id back
  onAdd: (id: string) => void
}

const METER_MAX = 5
const ADDED_MS = 1000

export default function SnackCard({ id, name, price, emoji, likes, onLike, onAdd }: SnackCardProps) {
  const liked = likes > 0

  // Show "✓" on the basket button for a second after each add.
  const [justAdded, setJustAdded] = useState(false)
  // The timer's id is needed later (to cancel it) but never shown on screen,
  // so it goes in a ref, not state: changing it shouldn't re-render.
  const timerRef = useRef<number | undefined>(undefined)

  function handleAdd() {
    onAdd(id)
    setJustAdded(true)
    window.clearTimeout(timerRef.current)  // clicked again: restart the second
    timerRef.current = window.setTimeout(() => setJustAdded(false), ADDED_MS)
  }

  // If the card disappears (a search hides it) while the timer is running,
  // cancel it so it doesn't fire for a card that's gone.
  useEffect(() => {
    return () => window.clearTimeout(timerRef.current)
  }, [])
  const popular = likes >= 3

  // Classes both buttons share. Still just strings, combined with normal JS.
  // Write every class name out in full: Tailwind finds them by reading this
  // file as text, so a name built at runtime (`bg-${colour}`) is never found.
  const button = 'cursor-pointer rounded-full border-0 px-2.5 py-1.5 text-base text-ink hover:brightness-95'
  const likeClass = `${button} bg-lilac ${liked ? 'font-bold text-accent' : ''}`

  // A value only known at runtime: an inline style is the right tool.
  // style takes an OBJECT with camelCase keys, not a CSS string.
  const meterWidth = `${(Math.min(likes, METER_MAX) / METER_MAX) * 100}%`

  return (
    <div className="relative box-border w-40 rounded-xl bg-surface p-4 text-center shadow-card">
      {popular && (
        <span className="absolute -top-2 -right-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
          Fan favourite
        </span>
      )}
      {/* Decorative: the name says what it is. Without aria-hidden a screen
          reader would read "chocolate bar, Pocky". */}
      <span className="text-[2.5rem]" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="mt-2 mb-1 text-lg">
        <Link className="text-inherit" to={`/snack/${id}`}>
          {name}
        </Link>
      </h2>
      <p className="mt-0 mb-2 opacity-70">${price.toFixed(2)}</p>
      <div className="mx-2 mb-3 h-1 overflow-hidden rounded-full bg-lilac" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-200" style={{ width: meterWidth }} />
      </div>
      <div className="flex justify-center gap-1.5">
        {/* What it does AND the current count. "❤ 3" alone is read as
            "red heart 3", which says neither. */}
        <button
          className={likeClass}
          onClick={() => onLike(id)}
          aria-label={`Like ${name}, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
        >
          ❤ {likes}
        </button>
        <button
          className={`${button} bg-peach`}
          onClick={handleAdd}
          aria-label={`Add ${name} to basket`}
        >
          {justAdded ? '✓ 🧺' : '+ 🧺'}
        </button>
      </div>
    </div>
  )
}
