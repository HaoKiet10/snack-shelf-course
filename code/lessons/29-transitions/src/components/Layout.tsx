import { Suspense } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Link, Outlet, useLocation } from 'react-router'
import ErrorBoundary from './ErrorBoundary.tsx'
import Header from './Header.tsx'
import Panel from './Panel.tsx'

// What every page shares. Around the page, two boundaries:
//   ErrorBoundary: if anything inside throws (a crash, or a failed query)
//   Suspense:      while anything inside is still loading (data, or a lazy
//                  page's code), show the fallback instead
export default function Layout() {
  const location = useLocation()
  // Lets "Try again" tell TanStack Query to retry failed queries.
  const { reset: resetQueries } = useQueryErrorResetBoundary()

  return (
    <>
      <Header />
      <ErrorBoundary
        key={location.pathname}
        fallback={(error, retry) => (
          <Panel
            title="Something went wrong on this page"
            action={
              <>
                <button
                  onClick={() => {
                    resetQueries()   // forget the failed query…
                    retry()          // …and render the page again, which refetches
                  }}
                >
                  Try again
                </button>{' '}
                <Link to="/">Back to the shelf</Link>
              </>
            }
          >
            {import.meta.env.DEV ? error.message : 'Sorry about that. The rest of the shop still works.'}
          </Panel>
        )}
      >
        <Suspense fallback={<Panel>Loading…</Panel>}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
