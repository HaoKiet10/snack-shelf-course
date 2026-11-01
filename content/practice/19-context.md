## Q
What problem does context solve?

- [ ] Fetching data
- [ ] Styling components
- [x] Passing the same data through many components that don't use it (prop drilling)
- [ ] Slow rendering

> A provider offers a value, and any component below it can read it directly, however deep.

## Q
What does `useContext(BasketContext)` return?

- [ ] Every provider's value in an array
- [ ] The basket from the parent's props
- [x] The value of the nearest `BasketContext` provider above the component
- [ ] The basket from `localStorage`

> If there is no provider above, it returns the default passed to `createContext`.

## Q
Why does `useBasket()` throw when the value is `null`?

- [ ] To slow the app down
- [ ] React requires it
- [x] A missing provider is a bug; a clear error beats a confusing crash elsewhere, and it narrows the type
- [ ] To reset the basket

> With the check, callers get `BasketValue`, not `BasketValue | null`, and a forgotten provider names itself.

## Q
`BasketProvider` reads the snacks with `useSnackData()`. Where must it be?

- [x] Inside `SnacksProvider`
- [ ] Outside `SnacksProvider`
- [ ] Anywhere
- [ ] In a separate React root

> A context can only be read below its provider.

## Q
What happens when a provider's value changes?

- [x] Every component that reads that context re-renders
- [ ] Nothing until the page reloads
- [ ] Only components that are visible re-render
- [ ] Only the provider re-renders

> This is why it helps to split contexts by what changes together, and why lesson 31 uses a store with selectors for the basket.

## Exercise: A theme switch
Make a `ThemeContext` holding `'light' | 'dark'` and a toggle function. Add a button in the Header that switches it, and set `data-theme` on the `<html>` element so CSS can use it.

### Hint
Three pieces again: `createContext` + a `useTheme()` hook, a `ThemeProvider` with `useState`, and an effect that sets `document.documentElement.dataset.theme`.

### Solution
```ts
// context/ThemeContext.ts
export type Theme = 'light' | 'dark'
export type ThemeValue = { theme: Theme; toggle: () => void }
export const ThemeContext = createContext<ThemeValue | null>(null)

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (value === null) throw new Error('useTheme() must be used inside <ThemeProvider>')
  return value
}
```

```tsx
// context/ThemeProvider.tsx
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}
```

```tsx
// Header
const { theme, toggle } = useTheme()
<button onClick={toggle}>{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</button>
```

Then in CSS, repeat the dark variables under `:root[data-theme='dark']`.
