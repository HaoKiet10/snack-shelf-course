---
title: Building for production
summary: What npm run build actually makes, why the files have strange names, how to check the build before shipping it, and how code can behave differently in development and production.
minutes: 15
demo: 14-building
---

Until now the app has only run under `npm run dev`. Browsers cannot run that setup by themselves, and nobody visiting your site will have Vite. This lesson turns the app into plain files any web server can hand out.

## Two different jobs

`npm run dev` is built for **you**. Vite serves your source files nearly as they are, translates TypeScript and JSX one file at a time when the browser asks for it, and pushes changes to the page the moment you save. It is fast to start and easy to debug, but it is slow to load for a visitor: hundreds of small requests, unminified code, and development-only checks.

`npm run build` is built for **visitors**. It does the slow work once, ahead of time:

```bash
npm run build
```

```text
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-CzRbQHv-.css    2.38 kB │ gzip:  0.92 kB
dist/assets/index-CoFGYht5.js   222.76 kB │ gzip: 69.94 kB
```

The script in `package.json` is `tsc -b && vite build`. First TypeScript checks every file, and **the build stops if there is a type error**. Then Vite builds.

## What is in dist

```diagram
dist/
  index.html            the page, now pointing at the files below
  assets/
    index-CoFGYht5.js   ALL your code + React, in one file
    index-CzRbQHv-.css  ALL your CSS, in one file
  favicon.svg           copied from public/
  snacks.json           copied from public/
```

What happened on the way:

- **Bundled.** Every `import` was followed and your files plus React became one JavaScript file. One request instead of dozens.
- **Compiled.** TypeScript types and JSX are gone; it is plain JavaScript a browser understands.
- **Minified.** Spaces, comments and long names were removed. `loadSnacks` became something like `_`. Open the JS file to see.
- **Tree-shaken.** Code that nothing uses was left out.
- **Hashed.** `CoFGYht5` is a fingerprint of the file's contents.

The hash is there for **caching**. A browser can keep `index-CoFGYht5.js` forever, because if you change the code, the file gets a different name, and the new `index.html` points at the new name. Visitors never get stuck with an old version, and never download an unchanged one twice.

`public/` is the exception. Its files are copied **as they are**, with their names unchanged, which is what you want for `snacks.json` and `favicon.svg`: things referred to by a fixed URL.

## Check it before you ship it

```bash
npm run preview
```

This serves the **built** `dist/` folder locally, as a real server would. Always test it once: some bugs only show up in a build, like a file path that only worked because the dev server was forgiving.

Opening `dist/index.html` by double-clicking does **not** work. The page loads its code as an ES module, and browsers refuse to load modules from `file://` addresses. It needs a server, even a local one.

## Development and production can differ

Vite gives your code a few values that are fixed at build time:

| value | under `npm run dev` | in `npm run build` |
|---|---|---|
| `import.meta.env.DEV` | `true` | `false` |
| `import.meta.env.PROD` | `false` | `true` |
| `import.meta.env.MODE` | `'development'` | `'production'` |
| `import.meta.env.BASE_URL` | the `base` setting | the `base` setting |

The fake slow network from lesson 12 should only slow *you* down, not visitors:

```ts
if (import.meta.env.DEV) {
  await new Promise((resolve) => setTimeout(resolve, 600))
}
```

And a small marker shows which version you are looking at:

```tsx
{import.meta.env.DEV && <p className="dev-note">Development build</p>}
```

In the build, Vite replaces `import.meta.env.DEV` with the literal `false`. `if (false) { ... }` can never run, so the minifier **deletes the whole block**. Search the built JS for "Development build" and it is not there. The demo on this page is a build, so you will not see the marker or the delay; run `npm run dev` and you will.

React does the same thing internally. Its helpful development warnings, like the missing-`key` warning from lesson 9, and StrictMode's double renders, all live behind checks like this. That is part of why the production build is smaller and faster.

These values are **public**. Anything your code reads ends up in the JS file that every visitor downloads. Never put a secret key in front-end code; if it needs to stay secret, it needs a server.

## base: where the app will live

By default, Vite writes absolute paths into `index.html`: `/assets/index-CoFGYht5.js`. That only works if the app is at the **root** of a domain. GitHub Pages serves a project at a sub-path like `https://you.github.io/snack-shelf/`, where `/assets/...` points at the wrong place and the page is blank.

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: './',
})
```

`base: './'` makes every path relative, `./assets/index-CoFGYht5.js`, so the build works in any folder. It is why `loadSnacks` uses `fetch('snacks.json')` without a leading slash, too. If you know the exact path, `base: '/snack-shelf/'` also works; relative is simply the setting you cannot get wrong for a one-page app like this one.

## Check yourself

<details>
<summary>Why do the built files have names like <code>index-CoFGYht5.js</code>?</summary>

The hash is based on the contents. Browsers can cache the file forever, because changed code gets a new file name, and the new `index.html` points at it.
</details>

<details>
<summary>What happens to <code>if (import.meta.env.DEV) { … }</code> in a production build?</summary>

Vite replaces the condition with `false`, so the block can never run, and the minifier removes it from the output completely.
</details>

<details>
<summary>Why does the built app show a blank page at <code>/snack-shelf/</code> without <code>base</code>?</summary>

The default paths start with `/`, so the browser asks for `/assets/…` at the domain root instead of `/snack-shelf/assets/…`, and gets nothing.
</details>

<details>
<summary>Is it safe to put an API key in <code>import.meta.env</code>?</summary>

No. Whatever the front-end code reads is written into the JS file that every visitor downloads. Secrets belong on a server.
</details>
