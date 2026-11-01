import Link from 'next/link'
import LikeButton from '../components/LikeButton'
import { getSnacks } from '../lib/snacks'

// A SERVER COMPONENT (the default in the app folder). It can be async and
// await data directly: this runs on the server, before any HTML is sent.
// Compare lessons 12, 18, 23 and 28: no effect, no loading state, no query.
export default async function ShelfPage() {
  const snacks = await getSnacks()

  return (
    <div className="shelf">
      {snacks.map((snack) => (
        <div className="card" key={snack.id}>
          <span className="emoji">{snack.emoji}</span>
          <h2>
            <Link href={`/snack/${snack.id}`}>{snack.name}</Link>
          </h2>
          <p className="price">${snack.price.toFixed(2)}</p>
          {/* A Client Component inside a Server Component: only this button
              ships JavaScript to the browser. Props must be serialisable
              (strings, numbers, plain objects), because they cross from
              server to browser. */}
          <LikeButton snackId={snack.id} />
        </div>
      ))}
    </div>
  )
}
