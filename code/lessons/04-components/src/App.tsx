import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import './App.css'

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components, the way <body> arranged elements in lesson 1.
export default function App() {
  return (
    <>
      <Header />
      <main className="shelf">
        <SnackCard />
        <SnackCard />
        <SnackCard />
      </main>
    </>
  )
}
