import { useState } from 'react'
import './SnackCard.css'

// The SHAPE of this component's props. TypeScript checks every
// <SnackCard ... /> against it: missing or wrong-type props are errors.
type SnackCardProps = {
  name: string
  price: number
  emoji: string
}

export default function SnackCard({ name, price, emoji }: SnackCardProps) {
  // STATE: a value this card remembers between renders.
  //   likes    = the current value (a snapshot for THIS render)
  //   setLikes = ask React to change it and re-render this card
  //   0        = the starting value, used only on the very first render
  // TypeScript infers likes: number from the 0.
  const [likes, setLikes] = useState(0)

  // A normal variable, recalculated on every render from state.
  // No need to store "is it liked?" separately: it follows from likes.
  const liked = likes > 0

  return (
    <div className="card">
      <span className="emoji">{emoji}</span>
      <h2>{name}</h2>
      {/* price is a number; toFixed(2) turns 1.8 into "1.80" */}
      <p className="price">${price.toFixed(2)}</p>
      <button
        className={liked ? 'like liked' : 'like'}
        // Updater form: "take the latest likes, add 1".
        onClick={() => setLikes((l) => l + 1)}
      >
        ❤ {likes}
      </button>
    </div>
  )
}
