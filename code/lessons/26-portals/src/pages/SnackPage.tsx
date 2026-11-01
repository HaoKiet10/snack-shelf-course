import { Link, useNavigate, useParams } from 'react-router'
import Panel from '../components/Panel.tsx'
import SnacksStatus from '../components/SnacksStatus.tsx'
import { useBasket } from '../context/BasketContext.ts'
import { useLikes } from '../context/LikesContext.ts'
import { useSnacks } from '../hooks/useSnacks.ts'
import './SnackPage.css'

// The page at "/snack/:id". ONE component serves every snack:
// the :id part of the URL says which one.
export default function SnackPage() {
  // For the URL #/snack/melon-pan, id is "melon-pan".
  // It's string | undefined: TypeScript can't know the route always has it.
  const { id } = useParams()
  const { snacks, status } = useSnacks()
  const { likes, like } = useLikes()
  const { dispatch } = useBasket()
  // navigate('/basket') changes the page from code, e.g. after an action.
  const navigate = useNavigate()

  if (status !== 'ready') {
    return <SnacksStatus />
  }

  const snack = snacks.find((s) => s.id === id)
  if (!snack) {
    return (
      <Panel title="No such snack" action={<Link to="/">Back to the shelf</Link>}>
        There's no snack called “{id}”.
      </Panel>
    )
  }

  function buyNow(snackId: string) {
    dispatch({ type: 'added', id: snackId })
    navigate('/basket')
  }

  return (
    <article className="snack-page">
      <Link className="back" to="/">
        ← All snacks
      </Link>
      <div className="snack-hero">{snack.emoji}</div>
      <h2>{snack.name}</h2>
      <p className="snack-price">${snack.price.toFixed(2)}</p>
      <p className="snack-about">{snack.about}</p>
      <div className="snack-actions">
        <button onClick={() => like(snack.id)}>❤ {likes[snack.id] ?? 0}</button>
        <button onClick={() => dispatch({ type: 'added', id: snack.id })}>+ 🧺 Add</button>
        <button className="primary" onClick={() => buyNow(snack.id)}>
          Buy now
        </button>
      </div>
    </article>
  )
}
