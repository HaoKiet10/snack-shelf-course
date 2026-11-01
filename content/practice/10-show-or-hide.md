## Q
`likes` is 0. What does `{likes && <span>Liked</span>}` show?

- [ ] Nothing
- [x] A `0`
- [ ] "Liked"
- [ ] "false"

> `0 && …` evaluates to `0`, and React renders numbers. Use a boolean: `{likes > 0 && …}`.

## Q
Which of these renders nothing at all?

- [x] `{false}`
- [ ] `{'0'}`
- [ ] `{NaN}`
- [ ] `{0}`

> `false`, `true`, `null` and `undefined` render as nothing. Numbers (including 0 and NaN) and strings render as text.

## Q
You need to show either the shelf or a "nothing found" message. Which fits best inside JSX?

- [ ] A `for` loop
- [x] `condition ? <Shelf /> : <Empty />`
- [ ] An `if` statement inside the braces
- [ ] `&&`

> `? :` picks one of two. `&&` is for something or nothing, and `if` can't go inside braces.

## Q
How does a component render nothing?

- [ ] `return undefined` is an error, so it can't
- [x] `return null`
- [ ] `return <></>` is required
- [ ] `return false` throws

> Returning `null` renders nothing. (Since React 18, `undefined` is allowed too, but `null` says it clearly.)

## Q
A search hides Pocky's card, then you clear the search. Why are Pocky's likes back at 0 (in lesson 10)?

- [ ] The key is wrong
- [ ] CSS hid the likes
- [ ] The search resets all state
- [x] Conditionally not rendering removes the card from the tree, and its state goes with it

> Not rendered is not the same as hidden. Removed components lose their state. Lesson 11 moves the likes up to fix it.

## Exercise: A "new" badge
Give two snacks a `isNew: true` field in the data, and show a "New" badge on their cards. Cards for other snacks show no badge.

### Hint
Add an optional field to the `Snack` type (`isNew?: boolean`), pass it as a prop, and use `&&` with a real boolean.

### Solution
```ts
export type Snack = {
  id: string
  name: string
  price: number
  emoji: string
  isNew?: boolean
}
```

```tsx
{isNew === true && <span className="badge">New</span>}
```

`isNew === true` handles both `false` and a missing field, and is always a boolean, so no stray values can appear.
