import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import BasketPage from './pages/BasketPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import ShelfPage from './pages/ShelfPage.tsx'
import SnackPage from './pages/SnackPage.tsx'
import './App.css'

// App is now a MAP of the site: which URL shows which page.
// The pages themselves are ordinary components in src/pages.
export default function App() {
  return (
    <Routes>
      {/* A route with no path, only an element: a LAYOUT. Its child routes
          render inside it, where Layout puts <Outlet />. */}
      <Route element={<Layout />}>
        <Route index element={<ShelfPage />} />              {/* "/" */}
        <Route path="snack/:id" element={<SnackPage />} />   {/* ":id" = any value */}
        <Route path="basket" element={<BasketPage />} />
        <Route path="*" element={<NotFoundPage />} />        {/* anything else */}
      </Route>
    </Routes>
  )
}
