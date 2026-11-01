import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import LikesProvider from './context/LikesProvider.tsx'
import ToastProvider from './context/ToastProvider.tsx'

// The QueryClient holds the cache of everything fetched with useQuery.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data counts as fresh for a minute: no refetch
      retry: 1,          // on failure, try once more before showing the error
    },
  },
})

// SnacksProvider is gone: the query cache shares the snacks instead.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        {/* No BasketProvider: the basket is a Zustand store now. */}
        <LikesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LikesProvider>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
)
