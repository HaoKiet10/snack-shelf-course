import BasketPanel from '../components/BasketPanel.tsx'
import SnacksStatus from '../components/SnacksStatus.tsx'
import { useSnackData } from '../context/SnacksContext.ts'

// The page at "/basket".
export default function BasketPage() {
  const { status } = useSnackData()
  if (status !== 'ready') {
    return <SnacksStatus />
  }
  return <BasketPanel />
}
