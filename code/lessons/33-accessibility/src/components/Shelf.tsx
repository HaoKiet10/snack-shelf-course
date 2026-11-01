import { useLikes } from '../context/LikesContext.ts'
import { useToast } from '../context/ToastContext.ts'
import type { Snack } from '../data/snacks.ts'
import { useBasketStore } from '../store/basketStore.ts'
import ErrorBoundary from './ErrorBoundary.tsx'
import SnackCard from './SnackCard.tsx'
import './Shelf.css'

// The grid of cards. It gets the snacks to show; likes come from context
// and the basket from its store.
type ShelfProps = {
  snacks: Snack[]
}

export default function Shelf({ snacks }: ShelfProps) {
  // Only `dispatch`, which never changes, so the basket changing doesn't
  // re-render the shelf at all.
  const dispatch = useBasketStore((s) => s.dispatch)
  const { likes, like } = useLikes()
  const toast = useToast()

  // One function for every card, taking the id. It only uses things that
  // never change (dispatch, toast, snacks for the name), so the React
  // Compiler can keep the SAME function between renders, and a card whose
  // own props didn't change can skip re-rendering.
  function add(id: string) {
    dispatch({ type: 'added', id })
    const name = snacks.find((s) => s.id === id)?.name ?? 'Snack'
    toast.show(`${name} added to the basket`, {
      label: 'Undo',
      onClick: () => dispatch({ type: 'removedOne', id }),
    })
  }

  return (
    <div className="shelf">
      {snacks.map((snack) => (
        // One boundary PER CARD: a snack with bad data breaks only its own
        // card, and the other five keep working.
        <ErrorBoundary
          key={snack.id}
          fallback={() => (
            <div className="card-broken" role="note">
              <strong>{snack.name}</strong>
              <span>can't be shown right now</span>
            </div>
          )}
        >
          <SnackCard
            id={snack.id}
            name={snack.name}
            price={snack.price}
            emoji={snack.emoji}
            likes={likes[snack.id] ?? 0}
            onLike={like}
            onAdd={add}
          />
        </ErrorBoundary>
      ))}
    </div>
  )
}
