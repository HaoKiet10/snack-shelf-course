import { Outlet } from 'react-router'
import Header from './Header.tsx'

// What every page shares. <Outlet /> is the hole where the router puts
// the page that matches the current URL.
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      {import.meta.env.DEV && <p className="dev-note">Development build</p>}
    </>
  )
}
