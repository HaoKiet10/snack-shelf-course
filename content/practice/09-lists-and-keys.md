## Q
What does `SNACKS.map((s) => <SnackCard key={s.id} name={s.name} />)` return?

- [ ] Nothing; map only loops
- [ ] One SnackCard
- [ ] The SNACKS array, changed in place
- [x] An array of SnackCard elements, one per snack

> `map` returns a new array of whatever the function returns. JSX renders an array by rendering each item in order.

## Q
What is a `key` for?

- [ ] Styling list items
- [ ] Sorting the list
- [x] Telling React which item is which across renders, so state stays with the right item
- [ ] Making items clickable

> Without stable keys React matches items by position, so after filtering or reordering, state can end up on the wrong item.

## Q
The list can be filtered. Which key is best?

- [ ] `key={index}`
- [x] `key={snack.id}`
- [ ] `key={Math.random()}`
- [ ] No key at all

> The index changes when items are removed; a random key is new every render, which throws state away. A stable id from the data is right.

## Q
Can you write a `for` loop directly inside JSX's `{ }`?

- [ ] Only in TypeScript files
- [ ] Only with a key
- [x] No, braces take an expression, and a `for` loop is a statement
- [ ] Yes, any JavaScript works there

> Inside braces you need something that produces a value. `map` produces an array; a `for` loop produces nothing. You can still loop before the `return`.

## Q
In `SNACKS.filter((s) => s.price < 2.5)`, where does `s` come from?

- [ ] It's a global variable React defines
- [ ] It must be declared with `let s` first
- [x] It's the parameter of your arrow function; `filter` passes each item in
- [ ] It's always the first snack

> `filter` calls your function once per item and passes the item as the first argument. You can name it anything.

## Exercise: Cheap snacks only
Add a checkbox "Under $2.50" above the shelf. When ticked, show only snacks cheaper than $2.50, combined with the search.

### Hint
A boolean `useState`, a controlled checkbox (`checked` and `onChange` with `e.target.checked`), and one more condition in the `filter`.

### Solution
```tsx
const [cheapOnly, setCheapOnly] = useState(false)

const visible = SNACKS.filter(
  (s) => s.name.toLowerCase().includes(q) && (!cheapOnly || s.price < 2.5),
)

<label>
  <input type="checkbox" checked={cheapOnly} onChange={(e) => setCheapOnly(e.target.checked)} />
  Under $2.50
</label>
```

`visible` is still derived: no extra state for the filtered list.
