---
title: TypeScript for components
summary: A generic component that stays fully typed for any options, types derived from data with as const and satisfies, a Button that accepts every real button prop, and a type guard that checks the server's data instead of trusting it.
minutes: 22
demo: 30-typescript-patterns
---

Four TypeScript techniques that show up in every serious React codebase, each solving a real problem in the shelf. The Mystery Snack is gone from the shelf now: it is caught when the data arrives.

## A generic component

The sort buttons from lesson 29 are useful elsewhere: a size picker, a light/dark switch. A reusable **segmented control** needs to accept any set of options, and still know exactly which values are possible.

```tsx
export type Option<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({
  label, options, value, onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
```

`<T extends string>` makes the component **generic**, like lesson 18's `useLocalStorage<T>`: `T` is filled in by each use. `extends string` limits it to string types, because values are used as keys.

```tsx
<SegmentedControl
  label="Sort by"
  options={SORTS}
  value={sort}
  onChange={(next) => startTransition(() => setSort(next))}
/>
```

TypeScript infers `T` as `'name' | 'price' | 'likes'` from `options` and `value`. So `next` in `onChange` has exactly that type, and `setSort(next)` type-checks with no casting. Pass a `value` that is not one of the options and it is an error. One component, precise types at every use.

## Types derived from data

Before, the sort keys were written twice, once as a type and once in the array:

```ts
type SortKey = 'name' | 'price' | 'likes'
const SORTS: { key: SortKey; label: string }[] = [ … ]
```

Add a sort and you must remember both. Instead, write the data once and **derive** the type from it:

```ts
const SORTS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Cheapest' },
  { value: 'likes', label: 'Most liked' },
] as const satisfies readonly Option<string>[]

type SortKey = (typeof SORTS)[number]['value']   // 'name' | 'price' | 'likes'
```

Three pieces:

- **`as const`** keeps the exact values. Without it, `value: 'name'` widens to `value: string`, and the derived type would be just `string`.
- **`satisfies`** checks the shape (every item must be a valid `Option`) **without changing** the type. `const SORTS: Option<string>[] = …` would also check it, but would throw away the exact values.
- **`(typeof SORTS)[number]['value']`** reads as "the type of SORTS, any item of it, its `value` field".

Now the array is the single source of truth. Add a sort and the type follows.

## A component that is a real button

```tsx
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'soft' | 'primary'
}

export default function Button({ variant = 'soft', className, ...rest }: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
```

`ComponentProps<'button'>` is **every prop a `<button>` accepts**: `onClick`, `disabled`, `type`, `aria-label`, `form`, and dozens more. The `&` adds our own. `...rest` collects everything not named, and `{...rest}` spreads it onto the real element. So `<Button>` works everywhere a `<button>` does, and TypeScript autocompletes all of it.

It defaults to `type="button"`, because a plain `<button>` inside a form defaults to `submit`, a classic source of forms sending by accident. Since `{...rest}` comes after, `<Button type="submit">` still overrides it. The snack page's three buttons use it.

## Do not trust the network

Lesson 25's Mystery Snack crashed because of one line from lesson 12:

```ts
return (await res.json()) as Snack[]
```

`as` is a promise to TypeScript, not a check. Data from outside (a server, `localStorage`, a URL, a form) can be anything. The fix is to start from `unknown` and **check**:

```ts
const data: unknown = await res.json()
if (!Array.isArray(data)) {
  throw new Error('snacks.json is not a list')
}
const snacks = data.filter(isSnack)
if (snacks.length < data.length) {
  console.warn(`Skipped ${data.length - snacks.length} malformed snack(s) in snacks.json`)
}
return snacks
```

`unknown` is the safe opposite of `any`: TypeScript lets you do nothing with it until you have narrowed it. The narrowing is a **type guard**:

```ts
export function isSnack(value: unknown): value is Snack {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.price === 'number' &&
    typeof v.emoji === 'string' &&
    typeof v.about === 'string'
  )
}
```

The return type `value is Snack` means "if this returns true, treat `value` as a `Snack`". `filter` understands type guards, so `data.filter(isSnack)` is a `Snack[]`. The Mystery Snack fails the check, is skipped with a warning, and never reaches a card. The error boundary stays, for bugs nobody predicted.

For bigger data, libraries like **Zod** or **Valibot** let you describe the shape once and get both the check and the TypeScript type from it. Same idea, less typing. The guard has its own tests in `data/snacks.test.ts`.

## Check yourself

<details>
<summary>In <code>SegmentedControl</code>, where does <code>T</code> come from?</summary>

TypeScript infers it from the props at each use: here from `options={SORTS}` and `value={sort}`, so `T` is `'name' | 'price' | 'likes'`.
</details>

<details>
<summary>What would <code>SortKey</code> be without <code>as const</code>?</summary>

`string`. Without `as const`, the literal `'name'` widens to `string` in the array's type, so the derived type loses the exact values.
</details>

<details>
<summary>Why does <code>Button</code> spread <code>{...rest}</code> after <code>type="button"</code>?</summary>

So it has a safe default that a caller can still override: `<Button type="submit">` replaces it, because later props win.
</details>

<details>
<summary>What is the difference between <code>as Snack[]</code> and a type guard?</summary>

`as` tells TypeScript to assume the type without checking anything at runtime. A type guard actually checks the value, and only then lets TypeScript treat it as a `Snack`.
</details>
