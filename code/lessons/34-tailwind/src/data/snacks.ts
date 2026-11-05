// The DATA lives on the server now (public/snacks.json), not in the code.
// This file keeps the TYPE and the function that fetches the data.

export type Snack = {
  id: string      // stable and unique: used as the React key
  name: string
  price: number
  emoji: string
  about: string   // a sentence for the snack's own page
}

export async function loadSnacks(): Promise<Snack[]> {
  // Pretend the network is slow, so you can see "Loading…" while developing.
  // import.meta.env.DEV is true under `npm run dev` and false in a build,
  // where Vite replaces it with `false` and deletes this whole block.
  if (import.meta.env.DEV) {
    await new Promise((resolve) => setTimeout(resolve, 600))
  }

  // A relative URL: snacks.json next to index.html, wherever the app is hosted.
  const res = await fetch('snacks.json')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  // `unknown`, not `any`: TypeScript won't let us use it until we've checked.
  const data: unknown = await res.json()
  if (!Array.isArray(data)) {
    throw new Error('snacks.json is not a list')
  }
  // Keep the entries that really are snacks; report the rest.
  const snacks = data.filter(isSnack)
  if (snacks.length < data.length) {
    console.warn(`Skipped ${data.length - snacks.length} malformed snack(s) in snacks.json`)
  }
  return snacks
}

// A TYPE GUARD. The return type `value is Snack` means: when this returns
// true, TypeScript treats `value` as a Snack from then on. Lesson 25's
// "Mystery Snack" (no price) now fails here, before it can crash a card.
export function isSnack(value: unknown): value is Snack {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.price === 'number' &&
    typeof v.emoji === 'string' &&
    typeof v.about === 'string'
  )
}
