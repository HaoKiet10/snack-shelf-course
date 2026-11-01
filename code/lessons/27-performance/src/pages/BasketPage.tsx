import BasketPanel from '../components/BasketPanel.tsx'
import CheckoutForm from '../components/CheckoutForm.tsx'
import SnacksStatus from '../components/SnacksStatus.tsx'
import { useSnacks } from '../hooks/useSnacks.ts'

// The page at "/basket": what's in it, then the checkout form.
export default function BasketPage() {
  const { status } = useSnacks()
  if (status !== 'ready') {
    return <SnacksStatus />
  }
  return (
    <>
      <BasketPanel />
      <CheckoutForm />
    </>
  )
}
