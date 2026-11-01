import { useBasket } from '../context/BasketContext.ts'
import { useLikes } from '../context/LikesContext.ts'
import type { Snack } from '../data/snacks.ts'
import SnackCard from './SnackCard.tsx'
import './Shelf.css'

// The grid of cards. It gets the snacks to show; likes and the basket
// come from context.
type ShelfProps = {
  snacks: Snack[]
}

export default function Shelf({ snacks }: ShelfProps) {
  const { dispatch } = useBasket()
  const { likes, like } = useLikes()

  return (
    <main className="shelf">
      {snacks.map((snack) => (
        <SnackCard
          key={snack.id}
          id={snack.id}
          name={snack.name}
          price={snack.price}
          emoji={snack.emoji}
          likes={likes[snack.id] ?? 0}
          onLike={() => like(snack.id)}
          onAdd={() => dispatch({ type: 'added', id: snack.id })}
        />
      ))}
    </main>
  )
}
