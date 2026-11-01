import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import BasketProvider from './context/BasketProvider.tsx'
import LikesProvider from './context/LikesProvider.tsx'
import SnacksProvider from './context/SnacksProvider.tsx'

// HashRouter keeps the page's path after a # (…/index.html#/snack/pocky).
// The server only ever sees index.html, so every URL works on a static host
// like GitHub Pages, even when you reload or open a link directly.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SnacksProvider>
        <BasketProvider>
          <LikesProvider>
            <App />
          </LikesProvider>
        </BasketProvider>
      </SnacksProvider>
    </HashRouter>
  </StrictMode>,
)
