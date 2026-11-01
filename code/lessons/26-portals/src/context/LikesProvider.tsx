import type { ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.ts'
import { LikesContext } from './LikesContext.ts'

export default function LikesProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useLocalStorage<Record<string, number>>('snack-shelf-likes', {})

  function like(id: string) {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  return <LikesContext value={{ likes, like }}>{children}</LikesContext>
}
