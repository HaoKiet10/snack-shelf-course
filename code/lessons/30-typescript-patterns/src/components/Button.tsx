import type { ComponentProps } from 'react'
import './Button.css'

// ComponentProps<'button'> is every prop a real <button> accepts: onClick,
// disabled, type, aria-*, … We add one of our own and pass the rest through,
// so <Button> works everywhere a <button> does.
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'soft' | 'primary'
}

export default function Button({ variant = 'soft', className, ...rest }: ButtonProps) {
  // ...rest is "every other prop", spread onto the real element.
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
