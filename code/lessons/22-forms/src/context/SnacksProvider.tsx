import type { ReactNode } from 'react'
import { useSnacks } from '../hooks/useSnacks.ts'
import { SnacksContext } from './SnacksContext.ts'

// Loads the snacks ONCE and shares them with every component inside it.
export default function SnacksProvider({ children }: { children: ReactNode }) {
  const value = useSnacks()
  // React 19: the context object itself is the provider component.
  return <SnacksContext value={value}>{children}</SnacksContext>
}
