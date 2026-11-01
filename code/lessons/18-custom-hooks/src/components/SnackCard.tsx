// `styles` maps the class names you wrote to the unique names Vite made:
// styles.card === '_card_x7k2a' (or similar). TypeScript knows the type
// from vite/client, so a typo like styles.crad is just undefined: check it.
import styles from './SnackCard.module.css'

// The card no longer OWNS any state. It shows what it's given (likes) and
// reports clicks upward through callback props (onLike, onAdd).
// App decides what those clicks mean.
type SnackCardProps = {
  name: string
  price: number
  emoji: string
  likes: number
  onLike: () => void
  onAdd: () => void
}

const METER_MAX = 5

export default function SnackCard({ name, price, emoji, likes, onLike, onAdd }: SnackCardProps) {
  const liked = likes > 0
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
      <span className={styles.emoji}>{emoji}</span>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.price}>${price.toFixed(2)}</p>
      <div className={styles.meter} aria-hidden="true">
        <div style={{ width: meterWidth }} />
      </div>
      <div className={styles.actions}>
        <button className={likeClass} onClick={onLike}>
          ❤ {likes}
        </button>
        <button
          className={`${styles.button} ${styles.add}`}
          onClick={onAdd}
          aria-label={`Add ${name} to basket`}
        >
          + 🧺
        </button>
      </div>
    </div>
  )
}
