import BasketPanel from '../components/BasketPanel.tsx'
import CheckoutForm from '../components/CheckoutForm.tsx'

// The page at "/basket": what's in it, then the checkout form.
// Loading and errors are handled around the page, in Layout.
export default function BasketPage() {
  return (
    <>
      <BasketPanel />
      <CheckoutForm />
    </>
  )
}
