import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import ShelfPage from './pages/ShelfPage.tsx'
import './App.css'

// LAZY pages: their code is split into separate files and only downloaded
// the first time someone visits that page. The shelf is the first thing
// everyone sees, so it stays in the main bundle.
// import('./x') (a function call, not the import statement) loads a module
// on demand and returns a Promise; lazy() turns that into a component.
const SnackPage = lazy(() => import('./pages/SnackPage.tsx'))
const BasketPage = lazy(() => import('./pages/BasketPage.tsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'))

// App is a MAP of the site: which URL shows which page.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ShelfPage />} />
        <Route path="snack/:id" element={<SnackPage />} />
        <Route path="basket" element={<BasketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
