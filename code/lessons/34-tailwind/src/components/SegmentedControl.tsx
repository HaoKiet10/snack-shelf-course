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
    <div className="flex gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        // aria-pressed: styles the pressed button from the same attribute
        // screen readers read, so the look and the meaning can't disagree.
        <button
          key={o.value}
          className="cursor-pointer rounded-full border border-line bg-transparent px-3 py-1.5 font-[inherit] text-sm text-inherit aria-pressed:border-peach aria-pressed:bg-peach aria-pressed:font-semibold"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
