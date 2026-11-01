import { MAX_QTY } from '../basket/basketReducer.ts'
import { useBasket } from '../context/BasketContext.ts'
import { useSnacks } from '../hooks/useSnacks.ts'
import Panel from './Panel.tsx'
import './BasketPanel.css'

// Everything it needs comes from context, so it takes no props.
export default function BasketPanel() {
  const { lines, total, dispatch } = useBasket()
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
                {snack.emoji} {snack.name}
              </span>
              <span className="basket-qty">
                <button
                  aria-label={`One less ${snack.name}`}
                  onClick={() => dispatch({ type: 'quantityChanged', id: line.id, qty: line.qty - 1 })}
                >
                  −
                </button>
                <span aria-label="quantity">{line.qty}</span>
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
