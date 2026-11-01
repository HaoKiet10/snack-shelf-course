import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type Snack = {
  id: string
  name: string
  price: number
  emoji: string
  about: string
}

// This code only ever runs ON THE SERVER: it reads a file from disk, which
// a browser can't do. In a real app this would be a database query, with a
// password the browser must never see. Server Components can call it
// directly: no fetch, no API route, no loading state.
export async function getSnacks(): Promise<Snack[]> {
  const file = path.join(process.cwd(), 'data', 'snacks.json')
  return JSON.parse(await readFile(file, 'utf8')) as Snack[]
}

export async function getSnack(id: string): Promise<Snack | undefined> {
  const snacks = await getSnacks()
  return snacks.find((s) => s.id === id)
}
