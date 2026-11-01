import { Suspense, useEffect, useRef } from 'react'
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

  // After moving to another page, put keyboard and screen-reader focus at
  // the start of the new content. Without this, focus stays on the link
  // you clicked (which may not exist any more) and nothing is announced.
  const mainRef = useRef<HTMLElement>(null)
  // Remember the path we last handled. On page load it's the current one,
  // so nothing happens; only a real change moves focus. (A "skip the first
  // run" flag would break: StrictMode runs effects twice in development.)
  const lastPath = useRef(location.pathname)
  useEffect(() => {
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    mainRef.current?.focus()
  }, [location.pathname])

  return (
    <>
      {/* The first thing Tab reaches: jump past the header. Hidden until focused. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault()   // a hash link would confuse the HashRouter
          mainRef.current?.focus()
        }}
      >
        Skip to content
      </a>
      <Header />
      {/* tabIndex={-1}: focusable from code, but not a Tab stop. */}
      <main id="main" ref={mainRef} tabIndex={-1}>
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
      </main>
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
