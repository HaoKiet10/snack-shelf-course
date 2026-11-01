'use client'
// ↑ This line makes it a CLIENT COMPONENT: its code is sent to the browser,
// and it can use state, effects and event handlers. Everything it imports
// becomes client code too.

import { useState } from 'react'

export default function LikeButton({ snackId }: { snackId: string }) {
  const [likes, setLikes] = useState(0)
  return (
    <button
      className={likes > 0 ? 'like liked' : 'like'}
      aria-label={`Like ${snackId}`}
      onClick={() => setLikes((l) => l + 1)}
    >
      ❤ {likes}
    </button>
  )
}
