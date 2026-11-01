import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="panel">
      <h2>Not found</h2>
      <p>There's no snack or page at this address.</p>
      <Link href="/">Back to the shelf</Link>
    </div>
  )
}
