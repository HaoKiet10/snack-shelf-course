import { createContext, useContext } from 'react'
import type { useSnacks } from '../hooks/useSnacks.ts'

// The SHAPE of what the provider shares: whatever useSnacks returns.
type SnacksValue = ReturnType<typeof useSnacks>

// A context is a "channel". null is the value a component gets if there
// is no provider above it, which is always a mistake, so we check for it.
export const SnacksContext = createContext<SnacksValue | null>(null)

// Components call this instead of useContext(SnacksContext) directly:
// shorter, and it fails loudly if the provider is missing.
export function useSnackData(): SnacksValue {
  const value = useContext(SnacksContext)
  if (value === null) {
    throw new Error('useSnackData() must be used inside <SnacksProvider>')
  }
  return value
}
