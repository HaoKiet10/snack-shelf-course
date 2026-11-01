// The DATA, separate from the UI. Components turn this into cards.
// Later (useEffect lesson) this will come from a server instead.

export type Snack = {
  id: string      // stable and unique: used as the React key
  name: string
  price: number
  emoji: string
}

export const SNACKS: Snack[] = [
  { id: 'pocky', name: 'Pocky', price: 2.5, emoji: '🍫' },
  { id: 'onigiri', name: 'Onigiri', price: 1.8, emoji: '🍙' },
  { id: 'melon-pan', name: 'Melon Pan', price: 2.2, emoji: '🍈' },
  { id: 'mochi', name: 'Mochi', price: 3.0, emoji: '🍡' },
  { id: 'taiyaki', name: 'Taiyaki', price: 2.8, emoji: '🐟' },
  { id: 'ramune', name: 'Ramune', price: 1.5, emoji: '🥤' },
]
