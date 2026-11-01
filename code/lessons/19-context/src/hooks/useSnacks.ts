import { useEffect, useState } from 'react'
import { loadSnacks } from '../data/snacks.ts'
import type { Snack } from '../data/snacks.ts'

export type Status = 'loading' | 'ready' | 'error'

// Everything about LOADING the snacks, out of App and behind one call:
//   const { snacks, status, retry } = useSnacks()
// Each component that calls it gets its OWN copy of this state.
export function useSnacks() {
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    loadSnacks()
      .then((data) => {
        if (!ignore) {
          setSnacks(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  function retry() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  return { snacks, status, retry }
}
