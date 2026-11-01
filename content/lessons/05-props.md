---
title: Props
summary: Props are a component's arguments. Give each card its own snack, type the props with TypeScript, and learn the two rules props live by.
minutes: 12
demo: 05-props
---

The shelf now shows three different snacks: Pocky, Onigiri and Melon Pan.

## Props are a component's arguments

The parent passes data like HTML attributes:

```tsx
// App.tsx
<SnackCard name="Onigiri" price={1.8} emoji="🍙" />
```

The child receives them as **one object**:

```tsx
// SnackCard.tsx
type SnackCardProps = {
  name: string
  price: number
  emoji: string
}

export default function SnackCard({ name, price, emoji }: SnackCardProps) {
  return (
    <div className="card">
      <span className="emoji">{emoji}</span>
      <h2>{name}</h2>
      <p className="price">${price.toFixed(2)}</p>
      <button className="like">❤ 0</button>
    </div>
  )
}
```

JSX becomes a function call, so `<SnackCard name="Onigiri" price={1.8} emoji="🍙" />` turns into React calling

```js
SnackCard({ name: "Onigiri", price: 1.8, emoji: "🍙" })
```

Props are just function arguments, packed into one object.

## Typing the props

`type SnackCardProps = { ... }` describes the **shape** of that object, and `: SnackCardProps` says "this function's argument has this shape". TypeScript then checks every place the component is used:

```tsx
<SnackCard name="Pocky" price="2.5" emoji="🍫" />
//                      ~~~~~ Type 'string' is not assignable to type 'number'
```

In plain JavaScript that mistake only shows up when the page crashes on `toFixed`. With types, it is a red squiggle as you type, and you get autocomplete: type `<SnackCard ` and the editor lists exactly which props exist.

## Destructuring

These two are the same:

```tsx
function SnackCard(props: SnackCardProps) {
  return <h2>{props.name}</h2>
}

function SnackCard({ name, price, emoji }: SnackCardProps) {   // unpack right away
  return <h2>{name}</h2>
}
```

The second is plain JavaScript **destructuring**: take the object and pull these keys out as variables. Most React code uses it.

## Quotes or braces?

```tsx
name="Onigiri"     // quotes: a string, exactly as written
price={1.8}        // braces: any JS value, here the number 1.8
price="1.8"        // the STRING "1.8": price.toFixed() would crash
```

Inside braces you can pass anything: numbers, booleans, arrays, objects, variables, even functions. Passing functions will matter soon.

Inside JSX, `{ }` means "insert a JavaScript value here". In `${price.toFixed(2)}` the `$` is just a dollar sign in the text and `{...}` is the JavaScript part.

## The two rules of props

**Data flows down.** Props go from parent to child, never the other way. App knows all the snacks and hands each card one. A card cannot reach up and change what App gave it.

```diagram
      App   (owns the data)
     ╱  │  ╲
 props props props   ↓ one way
   ╱    │    ╲
 Card  Card  Card
```

**Props are read-only.** A component must never change its own props:

```tsx
function SnackCard({ name }: SnackCardProps) {
  name = "Hacked"   // ❌ don't: the parent owns this value
}
```

React relies on this: given the same props, a component should always produce the same output. That is UI = f(data) again.

## What is still missing

The like buttons still do nothing. The count cannot be a prop, because the card itself needs to change it and props are read-only. A normal variable like `let likes = 0` does not work either. A component needs its own **memory**: a value it owns, can change, and that redraws the card when it changes. That is **state**, the next lesson.

## Check yourself

<details>
<summary>You write <code>&lt;SnackCard name="Pocky" price="2.5" emoji="🍫" /&gt;</code>. What happens?</summary>

TypeScript flags it: `"2.5"` is a string and `price` must be a number. In plain JavaScript it would get through and then crash at `price.toFixed(2)`, because strings have no `toFixed` method.
</details>

<details>
<summary>What object does <code>SnackCard</code> receive for <code>&lt;SnackCard name="Pocky" price={2.5} emoji="🍫" /&gt;</code>?</summary>

`{ name: "Pocky", price: 2.5, emoji: "🍫" }`
</details>

<details>
<summary>Why shouldn't the like count be a prop passed in from App?</summary>

The card needs to change it on a click, and props are read-only for the component that receives them. Something the component changes itself belongs in state.
</details>
