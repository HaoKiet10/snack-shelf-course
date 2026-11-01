import './SegmentedControl.css'

// A GENERIC component: <T extends string> means "T is some kind of string,
// decided by whoever uses me". Use it with sort keys and T is
// 'name' | 'price' | 'likes'; onChange then only ever receives one of those,
// and value must be one of them too. One component, fully typed for any use.
export type Option<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  label: string                      // what the group is, for screen readers
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
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
