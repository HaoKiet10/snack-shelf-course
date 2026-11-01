// The DATA lives on the server now (public/snacks.json), not in the code.
// This file keeps the TYPE and the function that fetches the data.

export type Snack = {
  id: string      // stable and unique: used as the React key
  name: string
  price: number
  emoji: string
}

export async function loadSnacks(): Promise<Snack[]> {
  // Pretend the network is slow, so you can actually see "Loading…".
  await new Promise((resolve) => setTimeout(resolve, 600))

  // A relative URL: snacks.json next to index.html, wherever the app is hosted.
  const res = await fetch('snacks.json')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  // res.json() is typed as any; we promise TypeScript it's a Snack[].
  return (await res.json()) as Snack[]
}
