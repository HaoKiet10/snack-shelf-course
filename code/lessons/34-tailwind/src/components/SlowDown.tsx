import { memo } from 'react'

// FOR THE LESSON ONLY: pretends this is a slow phone by wasting time while
// rendering, a fixed amount per card. Turn it on with the "Simulate a slow
// device" box on the shelf.
//
// 'use no memo' tells the React Compiler to leave the body alone: normally
// it would skip work that looks pointless, and here we WANT the waste.
// memo() still skips the whole component when its props are the same, so
// the urgent render (just the input) doesn't pay for it; only renders with
// a new query or sort do.
const MS_PER_CARD = 60

type SlowDownProps = {
  cards: number
  query: string
  sort: string
}

function SlowDown({ cards }: SlowDownProps) {
  'use no memo'
  const until = performance.now() + cards * MS_PER_CARD
  while (performance.now() < until) {
    // busy-wait: block the main thread on purpose
  }
  return null
}

export default memo(SlowDown)
