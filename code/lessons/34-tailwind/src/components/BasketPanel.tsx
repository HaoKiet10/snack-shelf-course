import { MAX_QTY } from '../basket/basketReducer.ts'
import { useBasketStore, useBasketTotal } from '../store/basketStore.ts'
import { useSnacks } from '../hooks/useSnacks.ts'
import Panel from './Panel.tsx'
import './BasketPanel.css'

// Everything it needs comes from the store and the query cache.
export default function BasketPanel() {
  const lines = useBasketStore((s) => s.lines)
  const dispatch = useBasketStore((s) => s.dispatch)
  const total = useBasketTotal()
  const { snacks } = useSnacks()

  if (lines.length === 0) {
    return <Panel title="Your basket">Nothing here yet. Press + 🧺 on a snack.</Panel>
  }

  return (
    <Panel
      title="Your basket"
      action={<button onClick={() => dispatch({ type: 'emptied' })}>Empty the basket</button>}
    >
      <ul className="basket-lines">
        {lines.map((line) => {
          const snack = snacks.find((s) => s.id === line.id)
          if (!snack) return null  // a snack that no longer exists
          return (
            <li key={line.id}>
              <span className="basket-name">
                <span aria-hidden="true">{snack.emoji}</span> {snack.name}
              </span>
              <span className="basket-qty">
                <button
                  aria-label={`One less ${snack.name}`}
                  onClick={() => dispatch({ type: 'quantityChanged', id: line.id, qty: line.qty - 1 })}
                >
                  −
                </button>
                {/* aria-label does nothing on a plain <span>: use real text,
                    hidden visually but read aloud. */}
                <span>
                  <span className="visually-hidden">Quantity </span>
                  {line.qty}
                </span>
                <button
                  aria-label={`One more ${snack.name}`}
                  disabled={line.qty >= MAX_QTY}
                  onClick={() => dispatch({ type: 'added', id: line.id })}
                >
                  +
                </button>
              </span>
              <span className="basket-price">${(snack.price * line.qty).toFixed(2)}</span>
              <button
                className="basket-remove"
                aria-label={`Remove ${snack.name}`}
                onClick={() => dispatch({ type: 'removed', id: line.id })}
              >
                ✕
              </button>
            </li>
          )
        })}
      </ul>
      <p className="basket-total">Total: ${total.toFixed(2)}</p>
    </Panel>
  )
}
