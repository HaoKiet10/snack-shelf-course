import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Adds DOM matchers like expect(el).toBeInTheDocument() (the import above),
// and removes whatever a test rendered before the next test starts.
afterEach(() => {
  cleanup()
})
