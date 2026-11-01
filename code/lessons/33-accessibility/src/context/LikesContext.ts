import { createContext, useContext } from 'react'

// Likes are needed on two pages now (the shelf and a snack's own page),
// so they move into a context, the same way the basket did.
export type LikesValue = {
  likes: Record<string, number>
  like: (id: string) => void
}

export const LikesContext = createContext<LikesValue | null>(null)

export function useLikes(): LikesValue {
  const value = useContext(LikesContext)
  if (value === null) {
    throw new Error('useLikes() must be used inside <LikesProvider>')
  }
  return value
}
