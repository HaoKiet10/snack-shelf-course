import { Link, Outlet, useLocation } from 'react-router'
import ErrorBoundary from './ErrorBoundary.tsx'
import Header from './Header.tsx'
import Panel from './Panel.tsx'

// What every page shares. <Outlet /> is the hole where the router puts
// the page that matches the current URL.
export default function Layout() {
  const location = useLocation()
  return (
    <>
      <Header />
      {/* If a page crashes, the header still works and you can leave.
          key: a new page means a new boundary, so the error is cleared
          as soon as you navigate somewhere else. */}
      <ErrorBoundary
        key={location.pathname}
        fallback={(error) => (
          <Panel title="Something went wrong on this page" action={<Link to="/">Back to the shelf</Link>}>
            {import.meta.env.DEV ? error.message : 'Sorry about that. The rest of the shop still works.'}
          </Panel>
        )}
      >
        <Outlet />
      </ErrorBoundary>
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
