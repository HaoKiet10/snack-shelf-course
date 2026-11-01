// `styles` maps the class names you wrote to the unique names Vite made:
// styles.card === '_card_x7k2a' (or similar). TypeScript knows the type
// from vite/client, so a typo like styles.crad is just undefined: check it.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import styles from './SnackCard.module.css'

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

  // className is just a string, so combine classes with normal JS.
  // filter(Boolean) drops the false when not liked.
  const likeClass = [styles.button, styles.like, liked && styles.liked].filter(Boolean).join(' ')

  // A value only known at runtime: an inline style is the right tool.
  // style takes an OBJECT with camelCase keys, not a CSS string.
  const meterWidth = `${(Math.min(likes, METER_MAX) / METER_MAX) * 100}%`

  return (
    <div className={styles.card}>
      {popular && <span className={styles.badge}>Fan favourite</span>}
      {/* Decorative: the name says what it is. Without aria-hidden a screen
          reader would read "chocolate bar, Pocky". */}
      <span className={styles.emoji} aria-hidden="true">
        {emoji}
      </span>
      <h2 className={styles.name}>
        <Link to={`/snack/${id}`}>{name}</Link>
      </h2>
      <p className={styles.price}>${price.toFixed(2)}</p>
      <div className={styles.meter} aria-hidden="true">
        <div style={{ width: meterWidth }} />
      </div>
      <div className={styles.actions}>
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
          className={`${styles.button} ${styles.add}`}
          onClick={handleAdd}
          aria-label={`Add ${name} to basket`}
        >
          {justAdded ? '✓ 🧺' : '+ 🧺'}
        </button>
      </div>
    </div>
  )
}
