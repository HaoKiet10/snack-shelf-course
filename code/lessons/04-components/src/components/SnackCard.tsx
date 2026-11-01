import './SnackCard.css'

// One card. Write it once, use it as many times as you like: <SnackCard />
//
// Problem on purpose: the snack is hard-coded, so every <SnackCard />
// shows Pocky. Lesson 5 (props) fixes that.
export default function SnackCard() {
  return (
    <div className="card">
      <span className="emoji">🍫</span>
      <h2>Pocky</h2>
      <p className="price">$2.50</p>
      <button className="like">❤ 0</button>
    </div>
  )
}
