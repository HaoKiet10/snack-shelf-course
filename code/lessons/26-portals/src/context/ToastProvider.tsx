import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ToastContext } from './ToastContext.ts'
import type { ToastAction } from './ToastContext.ts'
import './Toasts.css'

type Toast = {
  id: number
  message: string
  action?: ToastAction
}

const TOAST_MS = 4000
const MAX_TOASTS = 3

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)                       // a counter that never needs to render
  const timers = useRef(new Map<number, number>()) // toast id -> timeout id

  function dismiss(id: number) {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function show(message: string, action?: ToastAction) {
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, message, action }].slice(-MAX_TOASTS))
    timers.current.set(id, window.setTimeout(() => dismiss(id), TOAST_MS))
  }

  // When the provider goes away, cancel every timer still waiting.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  return (
    <ToastContext value={{ show }}>
      {children}
      {/* createPortal(jsx, domNode): render this JSX into a DIFFERENT place
          in the DOM, here straight into <body>, while it stays a normal
          child of ToastProvider in the React tree (context, state, events). */}
      {createPortal(
        <div className="toasts" role="status" aria-live="polite">
          {toasts.map(({ id, message, action }) => (
            <div className="toast" key={id}>
              <span>{message}</span>
              {action && (
                <button
                  onClick={() => {
                    action.onClick()
                    dismiss(id)
                  }}
                >
                  {action.label}
                </button>
              )}
              <button className="toast-close" aria-label="Dismiss" onClick={() => dismiss(id)}>
                ✕
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext>
  )
}
