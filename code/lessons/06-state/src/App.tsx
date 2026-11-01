import Header from './components/Header.tsx'
import SnackCard from './components/SnackCard.tsx'
import './App.css'

// App is the top of the component tree. It doesn't draw much itself;
// it ARRANGES other components and hands each one its data as props.
export default function App() {
  return (
    <>
      <Header />
      <main className="shelf">
        {/* Strings can use quotes. Anything else (numbers, objects,
            variables) goes in curly braces. */}
        <SnackCard name="Pocky" price={2.5} emoji="🍫" />
        <SnackCard name="Onigiri" price={1.8} emoji="🍙" />
        <SnackCard name="Melon Pan" price={2.2} emoji="🍈" />
      </main>
    </>
  )
}
