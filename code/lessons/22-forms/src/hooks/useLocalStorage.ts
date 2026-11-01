import { useEffect, useState } from 'react'

// A CUSTOM HOOK: a function whose name starts with "use" and that calls
// other hooks. It works exactly like useState, but the value is also saved
// in the browser under `key` and read back on the next visit.
//
// <T> makes it GENERIC: T is whatever type you use it with, so
// useLocalStorage<Record<string, number>>('likes', {}) gives back that type.
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : (JSON.parse(saved) as T)
    } catch {
      return initial  // broken JSON or blocked storage
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked: keep working, just don't save
    }
  }, [key, value])

  // `as const` makes this a fixed pair [T, setter], like useState's,
  // instead of an array that could hold either type in any position.
  return [value, setValue] as const
}
