import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SnackCard from './SnackCard.tsx'

// SnackCard contains a <Link>, which only works inside a router.
// MemoryRouter is a router that keeps its URL in memory: ideal for tests.
// vi.fn() is a fake function that records every call, so we can check them.
function card(likes: number, onLike = vi.fn(), onAdd = vi.fn()) {
  return (
    <MemoryRouter>
      <SnackCard id="pocky" name="Pocky" price={2.5} emoji="🍫" likes={likes} onLike={onLike} onAdd={onAdd} />
    </MemoryRouter>
  )
}

describe('SnackCard', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the name, price and a link to the snack page', () => {
    render(card(0))
    // Find things the way a user would: by role and visible name.
    expect(screen.getByRole('link', { name: 'Pocky' })).toHaveAttribute('href', '/snack/pocky')
    expect(screen.getByText('$2.50')).toBeInTheDocument()
  })

  it('reports a like when the heart is clicked', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(card(2, onLike))
    await user.click(screen.getByRole('button', { name: 'Like Pocky, 2 likes' }))
    expect(onLike).toHaveBeenCalledWith('pocky')
  })

  it('only shows the badge from 3 likes', () => {
    const { rerender } = render(card(2))
    // queryBy… returns null instead of throwing when nothing matches.
    expect(screen.queryByText('Fan favourite')).not.toBeInTheDocument()
    rerender(card(3))   // same card, new props: like a parent re-rendering
    expect(screen.getByText('Fan favourite')).toBeInTheDocument()
  })

  it('flashes ✓ for a second after adding', () => {
    vi.useFakeTimers()  // control time instead of really waiting
    const onAdd = vi.fn()
    render(card(0, vi.fn(), onAdd))
    const button = screen.getByRole('button', { name: 'Add Pocky to basket' })

    // fireEvent dispatches one click right away. (userEvent waits between
    // steps using timers, which don't move while they're faked.)
    fireEvent.click(button)
    expect(onAdd).toHaveBeenCalledWith('pocky')
    expect(button).toHaveTextContent('✓')

    // act(): "this causes React updates; apply them before going on".
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(button).toHaveTextContent('+')
  })
})
