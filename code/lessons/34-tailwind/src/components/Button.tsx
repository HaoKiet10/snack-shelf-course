import type { ComponentProps } from 'react'

// ComponentProps<'button'> is every prop a real <button> accepts: onClick,
// disabled, type, aria-*, … We add one of our own and pass the rest through,
// so <Button> works everywhere a <button> does.
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'soft' | 'primary'
}

// One full class string per variant, in an object. Not `bg-${variant}`:
// Tailwind only makes CSS for class names it can find written out in a file.
const variants = {
  soft: 'bg-lilac text-ink',
  primary: 'bg-accent font-semibold text-white',
}

// disabled: and hover: are VARIANTS: the class only applies in that state.
// enabled:hover: means "hovered, and not disabled".
const base =
  'cursor-pointer rounded-full border-0 px-3.5 py-2 font-[inherit] enabled:hover:brightness-95 disabled:cursor-default disabled:opacity-50'

export default function Button({ variant = 'soft', className, ...rest }: ButtonProps) {
  // ...rest is "every other prop", spread onto the real element.
  const classes = [base, variants[variant], className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
