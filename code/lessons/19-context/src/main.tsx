import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BasketProvider from './context/BasketProvider.tsx'
import SnacksProvider from './context/SnacksProvider.tsx'

// Providers wrap the app, so every component inside can read their values.
// Order matters: BasketProvider uses the snacks, so it goes inside.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnacksProvider>
      <BasketProvider>
        <App />
      </BasketProvider>
    </SnacksProvider>
  </StrictMode>,
)
