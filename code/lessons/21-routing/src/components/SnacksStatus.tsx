import { useSnackData } from '../context/SnacksContext.ts'
import Panel from './Panel.tsx'

// "Loading…" or "Couldn't load", for any page that needs the snacks.
// Renders nothing once they're ready.
export default function SnacksStatus() {
  const { status, retry } = useSnackData()

  if (status === 'loading') {
    return <Panel>Loading snacks…</Panel>
  }
  if (status === 'error') {
    return (
      <Panel title="Couldn't load the snacks" action={<button onClick={retry}>Try again</button>}>
        Check your connection, then try again.
      </Panel>
    )
  }
  return null
}
