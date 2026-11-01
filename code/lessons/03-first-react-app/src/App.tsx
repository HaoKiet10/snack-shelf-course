import { useState } from 'react'

// The smallest useful React app: one component, one piece of state.
// (Vite's starter has logos and links around this; the idea is the same.)
export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main style={{ padding: 24 }}>
      <h1>Hello, React</h1>
      <p>Edit src/App.tsx and save: the page updates without a reload (HMR).</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </main>
  )
}
