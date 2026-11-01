import './SnackCard.css'

// The SHAPE of this component's props. TypeScript checks every
// <SnackCard ... /> against it: missing or wrong-type props are errors.
type SnackCardProps = {
  name: string
  price: number
  emoji: string
}

// Props arrive as ONE object: { name: "Onigiri", price: 1.8, emoji: "🍙" }.
// The { name, price, emoji } in the parameter list "destructures" it,
// i.e. pulls those keys out into variables.
export default function SnackCard({ name, price, emoji }: SnackCardProps) {
  return (
    <div className="card">
      <span className="emoji">{emoji}</span>
      <h2>{name}</h2>
      {/* price is a number; toFixed(2) turns 1.8 into "1.80" */}
      <p className="price">${price.toFixed(2)}</p>
      <button className="like">❤ 0</button>
    </div>
  )
}
