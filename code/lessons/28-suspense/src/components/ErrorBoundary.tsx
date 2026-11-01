import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

// An ERROR BOUNDARY catches errors thrown while rendering anything inside
// it, and shows `fallback` instead of letting the whole app go blank.
//
// It has to be a CLASS component: there is no hook for this yet. This is
// the only class in the app, and you only ever need to write it once.
type ErrorBoundaryProps = {
  fallback: (error: Error, reset: () => void) => ReactNode
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  // Called during rendering when a child throws: turn the error into state,
  // so the next render shows the fallback. (Anything can be thrown, so make
  // sure it's an Error.)
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  // Called after the fallback is shown: the place to log or report it.
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Caught by an error boundary:', error, info.componentStack)
  }

  // Lets the fallback offer "try again": clear the error, render children again.
  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}
