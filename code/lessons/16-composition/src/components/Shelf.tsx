import type { Snack } from '../data/snacks.ts'
import SnackCard from './SnackCard.tsx'
import './Shelf.css'

// The grid of cards. It gets the snacks to show and passes clicks up.
type ShelfProps = {
  snacks: Snack[]
  likes: Record<string, number>
  onLike: (id: string) => void
  onAdd: (id: string) => void
}

export default function Shelf({ snacks, likes, onLike, onAdd }: ShelfProps) {
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
          onAdd={() => onAdd(snack.id)}
        />
      ))}
    </main>
  )
}
