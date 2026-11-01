import react from '@vitejs/plugin-react'
// From vitest/config instead of vite: the same defineConfig, plus the `test` key.
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative URLs in the build (./assets/...), so the app works in any
  // folder: the site root, or a sub-path like /snack-shelf/ on GitHub Pages.
  base: './',
  test: {
    // Tests run in Node, which has no DOM. jsdom fakes one, so components
    // can render into a pretend document.
    environment: 'jsdom',
    // Runs before every test file.
    setupFiles: ['./src/test/setup.ts'],
  },
})
