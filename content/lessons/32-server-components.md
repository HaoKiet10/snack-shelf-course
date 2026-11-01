---
title: Server Components and Next.js
summary: React that runs on the server. Rebuild the shelf in Next.js with Server Components that read data directly, Client Components only where there is interaction, and a server action behind the order form.
minutes: 30
demo: none
---

This lesson's app is a **separate project**, `snack-shelf-next`, because it needs something the Vite app cannot have: a server. It shows the shelf, a page per snack, like buttons, and an order form whose action runs on the server.

## Everything so far ran in the browser

The Vite app is a **single-page app** (lesson 14). The server sends an almost empty `index.html` and a JavaScript file; the browser downloads it, runs React, then fetches `snacks.json`, then finally shows snacks. Every component, and every library it imports, is downloaded by every visitor.

That has costs: a blank page until the JavaScript runs, a waterfall of "load code, then load data", and secrets that can never go in front-end code (lesson 14).

**React Server Components** let some components run **on the server** instead. They render there, send their result to the browser, and their own code is never downloaded.

## Server Components

In Next.js's `app` folder, every component is a Server Component unless it says otherwise:

```tsx
// app/page.tsx: the page at "/"
export default async function ShelfPage() {
  const snacks = await getSnacks()

  return (
    <div className="shelf">
      {snacks.map((snack) => (
        <div className="card" key={snack.id}>
          <span className="emoji">{snack.emoji}</span>
          <h2><Link href={`/snack/${snack.id}`}>{snack.name}</Link></h2>
          <p className="price">${snack.price.toFixed(2)}</p>
          <LikeButton snackId={snack.id} />
        </div>
      ))}
    </div>
  )
}
```

Look at what is missing: no `useEffect`, no `useQuery`, no loading state, no error state. The component is **async** and simply awaits its data, because it runs on the server **before** anything is sent. The visitor receives finished HTML with the snacks already in it.

And `getSnacks` reads a file from disk:

```ts
export async function getSnacks(): Promise<Snack[]> {
  const file = path.join(process.cwd(), 'data', 'snacks.json')
  return JSON.parse(await readFile(file, 'utf8')) as Snack[]
}
```

A browser cannot read files. On the server this could just as well be a database query with a password in it: the code never leaves the server.

## Client Components

Server Components cannot have state, effects or event handlers: there is no user on the server to click anything. Interactive parts are **Client Components**, marked by a directive at the top of the file:

```tsx
'use client'

import { useState } from 'react'

export default function LikeButton({ snackId }: { snackId: string }) {
  const [likes, setLikes] = useState(0)
  return (
    <button className={likes > 0 ? 'like liked' : 'like'} onClick={() => setLikes((l) => l + 1)}>
      ❤ {likes}
    </button>
  )
}
```

This is ordinary React, the kind from lessons 4 to 31. Its code is sent to the browser. `'use client'` marks a **boundary**: this file and everything it imports become client code.

Server Components can render Client Components and pass them props, as the shelf does with `LikeButton`. Those props cross from the server to the browser, so they must be **serialisable**: strings, numbers, plain objects and arrays, and JSX. Not functions (except server functions, below) and not class instances.

The usual design: **Server Components by default, Client Components at the leaves**, where the interaction is. The shelf's HTML, names and prices cost the browser no JavaScript; only the like buttons and the order form do.

## Routing by folders

Next.js routes by files instead of a `<Routes>` list (lesson 21):

```diagram
app/
  layout.tsx           wraps every page (lesson 21's Layout)
  page.tsx             "/"
  not-found.tsx        anything that doesn't exist
  snack/[id]/page.tsx  "/snack/pocky", "/snack/mochi", …
```

```tsx
type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const snacks = await getSnacks()
  return snacks.map((s) => ({ id: s.id }))
}

export default async function SnackPage({ params }: Props) {
  const { id } = await params
  const snack = await getSnack(id)
  if (!snack) {
    notFound()
  }
  // …
}
```

`[id]` in the folder name is the parameter. `params` is a Promise in current Next.js, so it is awaited. `notFound()` stops rendering and shows `not-found.tsx`; it never returns, so TypeScript knows `snack` is defined after it. `generateStaticParams` lists the ids so Next can render those pages **at build time**: `npm run build` reports six pre-rendered snack pages.

## Server actions

The order form is a Client Component using lesson 22's `useActionState`, but its action is imported from a file marked `'use server'`:

```ts
'use server'

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const snackId = String(formData.get('snackId') ?? '')
  const qty = Number(formData.get('qty'))

  const snack = await getSnack(snackId)
  if (!snack) return { error: 'That snack no longer exists.' }
  if (!Number.isInteger(qty) || qty < 1 || qty > 9) return { error: 'Choose between 1 and 9.' }

  console.log(`[server] order: ${qty} × ${snack.name}`)
  return { orderNo: `YS-${String(Date.now()).slice(-5)}-${qty}` }
}
```

```tsx
'use client'

const [state, formAction, isPending] = useActionState<OrderState, FormData>(placeOrder, {})
<form action={formAction}>…</form>
```

Every function exported from a `'use server'` file is a **server function**. Its code stays on the server; the browser gets a reference, and calling it becomes a request that Next.js handles for you. No API route, no `fetch`, no JSON by hand. When this was tested, ordering 3 Pocky in the browser printed `[server] order: 3 × Pocky` in the **server's** terminal.

Two important consequences:

- **Validate on the server.** Anyone can call a server function with any data, not only your form. The `qty` check here is the real one; the `min`/`max` on the input are only a convenience.
- **It works before JavaScript loads.** The form posts like a classic HTML form, and the server runs the action. This is called **progressive enhancement**.

## Running it

```bash
cd snack-shelf-next
npm install
npm run dev
```

Then open http://localhost:3000. The course repository has the same project in `code/lessons/32-server-components`. It cannot run inside this page as the other demos do, because it needs a server.

## When to use which

| | Vite single-page app | Next.js with Server Components |
|---|---|---|
| hosting | any static host (lesson 15) | a Node server, or a host that supports Next |
| first screen | blank until JavaScript runs | HTML with content straight away |
| data | fetched from the browser | read directly on the server |
| secrets | impossible in front-end code | safe in server code |
| best for | apps behind a login, tools, dashboards | public sites, shops, content, SEO |

Everything from the earlier lessons still applies: Client Components are the React you know, and state, effects, context, forms and testing all work the same in them. Server Components add a second kind of component on top. Next.js is the most widely used framework for them, and other frameworks are adding support too.

## Check yourself

<details>
<summary>Why can a Server Component be <code>async</code> and await its data directly?</summary>

It runs on the server before anything is sent to the browser, so it can wait for data and send finished HTML. There is no screen to show a loading state on yet.
</details>

<details>
<summary>What does <code>'use client'</code> mean?</summary>

This file and everything it imports run in the browser too, so they can use state, effects and event handlers. Their code is sent to the browser.
</details>

<details>
<summary>Why can't a Server Component pass an ordinary function as a prop to a Client Component?</summary>

Props from a Server Component travel from the server to the browser and must be serialisable. A function is code with a closure and cannot be sent like that. Server functions are the exception, sent as references.
</details>

<details>
<summary>Why must <code>placeOrder</code> validate <code>qty</code> even though the input has <code>min</code> and <code>max</code>?</summary>

A server function is a public endpoint. Anyone can call it with any data, bypassing the form, so only the server's own check can be trusted.
</details>
