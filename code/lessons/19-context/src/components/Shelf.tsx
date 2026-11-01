import { useBasket } from '../context/BasketContext.ts'
import type { Snack } from '../data/snacks.ts'
import SnackCard from './SnackCard.tsx'
import './Shelf.css'

// The grid of cards. It gets the snacks to show and passes clicks up.
type ShelfProps = {
  snacks: Snack[]
  likes: Record<string, number>
  onLike: (id: string) => void
}

export default function Shelf({ snacks, likes, onLike }: ShelfProps) {
  // Adding to the basket no longer needs a prop passed down from App.
  const { dispatch } = useBasket()

  return (
    <main className="shelf">
      {snacks.map((snack) => (
        <SnackCard
          key={snack.id}
          name={snack.name}
          price={snack.price}
          emoji={snack.emoji}
          likes={likes[snack.id] ?? 0}
          onLike={() => onLike(snack.id)}
          onAdd={() => dispatch({ type: 'added', id: snack.id })}
        />
      ))}
    </main>
  )
}
