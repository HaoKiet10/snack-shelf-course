## Q
What are props?

- [ ] CSS properties for a component
- [ ] Global variables every component can read
- [x] The arguments a parent passes to a component
- [ ] State that a component owns

> `<SnackCard name="Pocky" price={2.5} />` calls `SnackCard` with `{ name: 'Pocky', price: 2.5 }`. Props flow from parent to child.

## Q
What's the difference between `price="2.5"` and `price={2.5}`?

- [ ] None
- [x] Quotes pass the string "2.5"; braces pass the number 2.5
- [ ] Braces pass a string; quotes pass a number
- [ ] Quotes are for HTML elements only

> Quotes are always a string. Braces hold any JavaScript expression, so `{2.5}` is a number and `price.toFixed(2)` works on it.

## Q
Inside `SnackCard`, what happens if you write `name = name.toUpperCase()`?

- [ ] TypeScript converts it to state
- [ ] The parent's data changes too
- [x] It breaks the rule that props are read-only; the parent still owns the data
- [ ] React re-renders with the new name

> Props belong to the parent. A component reads them and never changes them. To show something different, calculate a new variable, like `const shout = name.toUpperCase()`.

## Q
```tsx
type SnackCardProps = { name: string; price: number; emoji: string }
```
What happens with `<SnackCard name="Pocky" price={2.5} />`?

- [x] TypeScript reports that `emoji` is missing
- [ ] It works, and `emoji` is an empty string
- [ ] It crashes in the browser only
- [ ] React adds a default emoji

> Every prop in the type is required unless it is marked optional with `?`. TypeScript checks each use of the component.

## Q
What does `function SnackCard({ name, price }: SnackCardProps)` do?

- [x] Destructures the props object into `name` and `price` variables
- [ ] Creates two new state variables
- [ ] Makes `name` and `price` optional
- [ ] Copies the props into the parent

> It is shorthand for `function SnackCard(props: SnackCardProps)` followed by `const { name, price } = props`.

## Exercise: A sale price
Add an optional `oldPrice` prop to `SnackCard`. When it is given, show it crossed out next to the price. Use it on one snack.

### Hint
Optional props are typed with `?`: `oldPrice?: number`. Show it only when it exists, with `{oldPrice && …}` or a check, and use `<s>` for strike-through.

### Solution
```tsx
type SnackCardProps = {
  name: string
  price: number
  emoji: string
  oldPrice?: number
}

export default function SnackCard({ name, price, emoji, oldPrice }: SnackCardProps) {
  return (
    <div className="card">
      {/* … */}
      <p className="price">
        ${price.toFixed(2)}
        {oldPrice !== undefined && <s> ${oldPrice.toFixed(2)}</s>}
      </p>
    </div>
  )
}
```

```tsx
<SnackCard name="Pocky" price={2.5} emoji="🍫" oldPrice={3} />
```

`oldPrice !== undefined` rather than `oldPrice &&`: a price of 0 would otherwise print a stray 0 (lesson 10).
