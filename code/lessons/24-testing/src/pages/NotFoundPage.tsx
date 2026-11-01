import { Link } from 'react-router'
import Panel from '../components/Panel.tsx'

// Any URL no other route matches ends up here (path="*").
export default function NotFoundPage() {
  return (
    <Panel title="Page not found" action={<Link to="/">Back to the shelf</Link>}>
      There's nothing at this address.
    </Panel>
  )
}
