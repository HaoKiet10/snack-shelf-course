import { useState } from 'react'
import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import './App.css'

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components and hands each one its data as props.
export default function App() {
  // Lesson 7 demo only: state in App, so we can watch what happens to
  // the children when the PARENT re-renders.
  const [demo, setDemo] = useState(0)

  console.log(`render App: demo=${demo}`)

  return (
    <>
      <Header />
      <main className="shelf">
        <SnackCard name="Pocky" price={2.5} emoji="🍫" />
        <SnackCard name="Onigiri" price={1.8} emoji="🍙" />
        <SnackCard name="Melon Pan" price={2.2} emoji="🍈" />
      </main>
      <button className="demo" onClick={() => setDemo((d) => d + 1)}>
        Re-render App (demo: {demo})
      </button>
    </>
  )
}
