## Q
In `<SegmentedControl options={SORTS} value={sort} onChange={…} />`, where does the generic `T` come from?

- [x] TypeScript infers it from the props, here `'name' | 'price' | 'likes'`
- [ ] From the component's default export
- [ ] You must always write `<SegmentedControl<SortKey>>`
- [ ] It's always `string`

> Inference fills `T` from `options` and `value`, so `onChange` receives exactly those values.

## Q
What would `SortKey` be without `as const` on `SORTS`?

- [ ] A type error
- [ ] The same union
- [x] `string`
- [ ] `never`

> Without `as const`, the literal values widen to `string` in the array's type.

## Q
What does `satisfies readonly Option<string>[]` do?

- [ ] Converts the array to the `Option` type
- [ ] Makes the array read-only at runtime
- [ ] Nothing; it's a comment
- [x] Checks the shape fits `Option` without changing the array's own, more exact type

> A type annotation would check too, but throw away the exact values `as const` kept.

## Q
`type ButtonProps = ComponentProps<'button'> & { variant?: 'soft' | 'primary' }`. What does `ComponentProps<'button'>` give?

- [ ] Only `onClick`
- [ ] A ref to the button
- [ ] The button's CSS
- [x] Every prop a real `<button>` accepts

> Spread `...rest` onto the `<button>`, and your component accepts everything a button does.

## Q
What's the difference between `data as Snack[]` and filtering with `isSnack`?

- [ ] None
- [x] `as` only tells TypeScript to assume; the type guard actually checks each value at runtime
- [ ] `as` is slower
- [ ] The guard only works in tests

> Data from outside can be anything. Start from `unknown` and check.

## Exercise: A generic Select
Write a `Select<T extends string>` component with `label`, `options: readonly Option<T>[]`, `value: T` and `onChange: (value: T) => void`, rendering a real `<select>`. Use it for the sort on narrow screens.

### Hint
`e.target.value` is a `string`. Find the matching option instead of casting, so a wrong value can't slip through.

### Solution
```tsx
type SelectProps<T extends string> = {
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

export default function Select<T extends string>({ label, options, value, onChange }: SelectProps<T>) {
  return (
    <label>
      {label}{' '}
      <select
        value={value}
        onChange={(e) => {
          const picked = options.find((o) => o.value === e.target.value)
          if (picked) onChange(picked.value)
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
```

`find` returns an `Option<T>`, so `picked.value` is a `T` with no `as` needed.
