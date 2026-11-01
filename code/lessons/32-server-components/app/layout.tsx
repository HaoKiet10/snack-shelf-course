import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: "Yune's Snack Shelf",
}

// app/layout.tsx wraps every page, like lesson 21's Layout. It's a Server
// Component: it renders on the server and sends HTML, no JavaScript.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>
            <Link href="/">Yune's Snack Shelf</Link>
          </h1>
          <span className="tag">Next.js version</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
