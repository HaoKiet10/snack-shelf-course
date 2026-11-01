import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BasketContext } from '../context/BasketContext.ts'
import type { BasketValue } from '../context/BasketContext.ts'
import CheckoutForm from './CheckoutForm.tsx'

// Replace the real sendOrder (which waits 800ms) with an instant fake.
// vi.mock swaps the whole module for every file that imports it.
vi.mock('../data/orders.ts', () => ({
  sendOrder: vi.fn(async () => 'YS-TEST-2'),
}))

// Instead of the real BasketProvider, hand the form a basket we control.
function renderWithBasket() {
  const dispatch = vi.fn()
  const basket: BasketValue = {
    lines: [{ id: 'pocky', qty: 2 }],
    count: 2,
    total: 5,
    dispatch,
  }
  render(
    <BasketContext value={basket}>
      <CheckoutForm />
    </BasketContext>,
  )
  return { dispatch }
}

describe('CheckoutForm', () => {
  it('shows an error for each missing field', async () => {
    const user = userEvent.setup()
    renderWithBasket()
    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('That email address looks incomplete.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('places the order and empties the basket', async () => {
    const user = userEvent.setup()
    const { dispatch } = renderWithBasket()

    // Labels connect to inputs, so a test can find fields like a person does.
    await user.type(screen.getByLabelText('Name'), 'Yune')
    await user.type(screen.getByLabelText('Email'), 'yune@example.com')
    await user.selectOptions(screen.getByLabelText('Pick-up time'), 'Tomorrow, 10 am')
    await user.click(screen.getByRole('button', { name: /place order/i }))

    // findBy… waits (up to 1s) for something that appears later.
    expect(await screen.findByText('YS-TEST-2')).toBeInTheDocument()
    expect(dispatch).toHaveBeenCalledWith({ type: 'emptied' })
  })
})
