import './SnackCard.css'

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

export default function SnackCard({ name, price, emoji, likes, onLike, onAdd }: SnackCardProps) {
  const liked = likes > 0
  const popular = likes >= 3

  return (
    <div className="card">
      {popular && <span className="badge">Fan favourite</span>}
      <span className="emoji">{emoji}</span>
      <h2>{name}</h2>
      <p className="price">${price.toFixed(2)}</p>
      <div className="actions">
        <button className={liked ? 'like liked' : 'like'} onClick={onLike}>
          ❤ {likes}
        </button>
        <button className="add" onClick={onAdd} aria-label={`Add ${name} to basket`}>
          + 🧺
        </button>
      </div>
    </div>
  )
}
