import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Find the empty <div id="root"> and hand it to React.
// The ! tells TypeScript "this is never null": index.html always has #root.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
