import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import BasketPanel from '../components/BasketPanel.tsx'
import CheckoutForm from '../components/CheckoutForm.tsx'
import SnackCard from '../components/SnackCard.tsx'
import { snacksQuery } from '../data/snacksQuery.ts'
import { useBasketStore } from '../store/basketStore.ts'
import { a11yProblems } from './axe.ts'

const SNACKS = [
  { id: 'pocky', name: 'Pocky', price: 2.5, emoji: '🍫', about: 'Sticks.' },
  { id: 'ramune', name: 'Ramune', price: 1.5, emoji: '🥤', about: 'Fizzy.' },
]

// Everything the basket components need: a query cache with the snacks
// already in it, and a router.
function withApp(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(snacksQuery.queryKey, SNACKS)
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('accessibility checks (axe)', () => {
  it('a snack card has no problems', async () => {
    const { container } = render(
      withApp(<SnackCard id="pocky" name="Pocky" price={2.5} emoji="🍫" likes={3} onLike={vi.fn()} onAdd={vi.fn()} />),
    )
    expect(await a11yProblems(container)).toEqual([])
  })

  it('the basket and checkout form have no problems', async () => {
    useBasketStore.setState({ lines: [{ id: 'pocky', qty: 2 }, { id: 'ramune', qty: 1 }] })
    const { container } = render(
      withApp(
        <>
          <BasketPanel />
          <CheckoutForm />
        </>,
      ),
    )
    expect(await a11yProblems(container)).toEqual([])
  })
})
