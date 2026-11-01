## Q
What does `npm run build` produce?

- [x] A `dist/` folder of plain HTML, CSS and JavaScript that any web server can serve
- [ ] A running server
- [ ] An installer for the app
- [ ] A copy of `src/` with types removed

> The build bundles, compiles, minifies and hashes everything into static files.

## Q
Why do built files have names like `index-CoFGYht5.js`?

- [x] The hash comes from the contents, so browsers can cache the file forever and still get new versions
- [ ] To hide the code from visitors
- [ ] Vite adds random letters to avoid name clashes
- [ ] It's the date of the build

> Changed code means a new file name, which the new `index.html` points to. Unchanged files are never downloaded twice.

## Q
You double-click `dist/index.html` and get a blank page. Why?

- [ ] The build failed
- [ ] React only runs online
- [x] Browsers won't load ES modules from `file://`; it needs a server, like `npm run preview`
- [ ] The CSS is missing

> The page loads its code as a module, which `file://` blocks. Any local server works.

## Q
What happens to `if (import.meta.env.DEV) { … }` in a production build?

- [ ] It's kept but skipped at runtime
- [ ] It throws an error
- [ ] It runs, because DEV is a variable
- [x] Vite replaces the condition with `false` and the block is removed entirely

> The value is fixed at build time, so the minifier can delete code that can never run.

## Q
Is it safe to put a secret API key in your front-end code?

- [ ] Yes, if it's in `import.meta.env`
- [ ] Yes, after minifying
- [x] No; anything the front end uses ends up in files every visitor downloads
- [ ] Yes, if the repo is private

> Front-end code is public. Secrets belong on a server.

## Exercise: A build stamp
Show the app version from `package.json` and the mode in a small footer, for example "v0.0.0 · production".

### Hint
JSON files can be imported directly with Vite (`import pkg from '../package.json'`). `import.meta.env.MODE` gives the mode.

### Solution
```tsx
import pkg from '../package.json'

export default function Footer() {
  return (
    <footer className="dev-note">
      v{pkg.version} · {import.meta.env.MODE}
    </footer>
  )
}
```

Careful: importing `package.json` puts the **whole file** in your bundle, including its dependency list. For just a version, Vite's `define` option in `vite.config.ts` is tidier.
