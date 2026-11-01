import { createContext, useContext } from 'react'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastValue = {
  // Show a short message at the bottom of the screen, with an optional button.
  show: (message: string, action?: ToastAction) => void
}

export const ToastContext = createContext<ToastValue | null>(null)

export function useToast(): ToastValue {
  const value = useContext(ToastContext)
  if (value === null) {
    throw new Error('useToast() must be used inside <ToastProvider>')
  }
  return value
}
