import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// From vitest/config instead of vite: the same defineConfig, plus the `test` key.
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // The React Compiler runs over every component and hook at build time and
  // adds the memoization you'd otherwise write by hand (memo, useMemo,
  // useCallback). It works through Babel, so it's a second plugin.
  // Tailwind's plugin reads your source files for class names like `p-4`
  // and writes only the CSS for the ones you used.
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
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
