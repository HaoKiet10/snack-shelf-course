import BasketPanel from '../components/BasketPanel.tsx'
import CheckoutForm from '../components/CheckoutForm.tsx'
import SnacksStatus from '../components/SnacksStatus.tsx'
import { useSnackData } from '../context/SnacksContext.ts'

// The page at "/basket": what's in it, then the checkout form.
export default function BasketPage() {
  const { status } = useSnackData()
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
