import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderForm from '../../../components/OrderForm'
import { getSnack, getSnacks } from '../../../lib/snacks'

// The folder name [id] is the route parameter, like lesson 21's snack/:id.
// In Next 15+ `params` is a Promise, so it's awaited.
type Props = {
  params: Promise<{ id: string }>
}

// Tells Next which ids exist, so these pages can be built ahead of time.
export async function generateStaticParams() {
  const snacks = await getSnacks()
  return snacks.map((s) => ({ id: s.id }))
}

export default async function SnackPage({ params }: Props) {
  const { id } = await params
  const snack = await getSnack(id)
  if (!snack) {
    notFound() // renders app/not-found.tsx
  }

  return (
    <article className="snack-page">
      <Link href="/">← All snacks</Link>
      <div className="snack-hero">{snack.emoji}</div>
      <h2>{snack.name}</h2>
      <p className="price">${snack.price.toFixed(2)}</p>
      <p>{snack.about}</p>
      <OrderForm snackId={snack.id} snackName={snack.name} />
    </article>
  )
}
