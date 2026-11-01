import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { snacksQuery } from '../data/snacksQuery.ts'
import { useBasketStore } from '../store/basketStore.ts'
import CheckoutForm from './CheckoutForm.tsx'

// Replace the real sendOrder (which waits 800ms) with an instant fake.
vi.mock('../data/orders.ts', () => ({
  sendOrder: vi.fn(async () => 'YS-TEST-2'),
}))

const dispatch = vi.fn()

beforeEach(() => {
  // A Zustand store can be set directly, from outside React: put a known
  // basket in it, with a fake dispatch we can check.
  dispatch.mockClear()
  useBasketStore.setState({ lines: [{ id: 'pocky', qty: 2 }], dispatch })
})

function renderForm() {
  // The total needs prices from the snacks query: seed the cache instead
  // of fetching. retry: false so a test never waits on retries.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(snacksQuery.queryKey, [
    { id: 'pocky', name: 'Pocky', price: 2.5, emoji: '🍫', about: '' },
  ])
  render(
    <QueryClientProvider client={client}>
      <CheckoutForm />
    </QueryClientProvider>,
  )
}

describe('CheckoutForm', () => {
  it('shows the total from the basket and the prices', () => {
    renderForm()
    expect(screen.getByRole('button', { name: 'Place order · $5.00' })).toBeInTheDocument()
  })

  it('shows an error for each missing field', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('That email address looks incomplete.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('places the order and empties the basket', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Name'), 'Yune')
    await user.type(screen.getByLabelText('Email'), 'yune@example.com')
    await user.selectOptions(screen.getByLabelText('Pick-up time'), 'Tomorrow, 10 am')
    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(await screen.findByText('YS-TEST-2')).toBeInTheDocument()
    expect(dispatch).toHaveBeenCalledWith({ type: 'emptied' })
  })
})
