---
title: Put it online
summary: Push the app to GitHub and let a workflow build and publish it to GitHub Pages on every push, so the shelf has a real address you can send to people.
minutes: 20
demo: 15-put-it-online
---

The last lesson has almost no app code. It makes the shelf live at an address like `https://you.github.io/snack-shelf/`, and keeps it up to date by itself.

## Static hosting is enough

After `npm run build`, the whole app is a folder of files (lesson 14). There is no server code: the browser downloads the files and runs everything itself. Any **static host** can serve that. GitHub Pages is free for public repositories, and it already has your code, so it is the simplest place to start. Netlify, Cloudflare Pages and Vercel work the same way.

There are two ways to get the files onto Pages:

| | commit the built files | build on GitHub |
|---|---|---|
| how | run `npm run build` yourself, commit the output, Pages serves it from a branch | GitHub runs `npm run build` on every push and publishes the result |
| `dist/` in git | yes | no, stays in `.gitignore` |
| forget to rebuild | the site goes stale | cannot happen |
| used by | this course site | the snack shelf |

Building on GitHub is the usual choice for an app. You only push source code; the build happens on a clean machine every time, so "it works on my computer" cannot sneak in.

## The workflow file

**GitHub Actions** runs scripts on GitHub's machines when something happens in your repository. A workflow is a YAML file in `.github/workflows/`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

Reading it top to bottom:

- **`on`**: run on every push to `main`. `workflow_dispatch` adds a "Run workflow" button, for when you want to redeploy without a change.
- **`permissions`**: what this workflow is allowed to do. Read the code, write to Pages, and get an `id-token`, which is how Pages verifies the upload came from this repository's workflow. Nothing else.
- **`concurrency`**: one deploy at a time. If you push twice quickly, the second waits.
- **`build` job**, on a fresh Ubuntu machine:
  - `checkout` downloads your repository.
  - `setup-node` installs Node 24; `cache: npm` keeps downloaded packages between runs.
  - `npm ci` installs the **exact** versions in `package-lock.json`. Unlike `npm install`, it never changes the lock file, and it fails if the lock file and `package.json` disagree. That is what you want on a build machine.
  - `npm run build` type-checks and builds `dist/`. A type error stops the deploy, so a broken build never goes live.
  - `upload-pages-artifact` packs `dist/` for Pages.
- **`deploy` job**: `needs: build` makes it wait for the build to succeed. Then `deploy-pages` publishes the files.

The `@v7`, `@v6` and `@v5` are the major versions of each action. Each action's GitHub page lists its current version.

## Steps, once

1. Create an empty repository on GitHub named `snack-shelf`, without a README.
2. In the project folder:

   ```bash
   git init
   git add -A
   git commit -m "Snack shelf"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/snack-shelf.git
   git push -u origin main
   ```

   `.gitignore` already keeps out `node_modules/` and `dist/`, so only the source is pushed.
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab. If the first run started before step 3 and failed, press **Run workflow**.
5. When both jobs are green, the address appears on the deploy job and on the Pages settings page.

From now on, deploying is just `git push`. Change something, push, and about a minute later it is live.

Pages on a private repository needs a paid GitHub plan. On a free account, the repository has to be public.

## When it does not work

| what you see | likely cause |
|---|---|
| blank page, and 404s for `/assets/...` in the Network tab | `base` is not set (lesson 14) |
| the build job fails on `npm ci` | `package-lock.json` was not committed, or is out of date: run `npm install` and commit it |
| the build job fails on `tsc` | a type error; it fails the same way locally with `npm run build` |
| the deploy job says Pages is not enabled | step 3 was skipped |
| the old version still shows | the browser cached `index.html`: reload with Ctrl+F5 |

Read the failed step's log on the Actions tab. It is the same output you would get by running that command yourself.

## Where to go from here

The shelf now covers the core of React: components, props, state, events, lists, conditional rendering, lifting state, effects, styling and shipping. Good next steps, in roughly this order:

- **Forms with several fields**, and a **reducer** (`useReducer`) when one state update has to change several things at once. The basket would be a good candidate: remove an item, change a quantity.
- **Context** (`useContext`), for data that many components at different depths need, so you do not pass the same prop through five layers.
- **Routing** (React Router), for an app with several pages, such as a page per snack.
- **Data fetching libraries** (TanStack Query), which handle loading, errors, caching and retries so you rarely write the lesson-12 effect by hand.
- **Testing** (Vitest and Testing Library).

And the best next step of all: build something of your own. The concepts carry over; the snacks were only an excuse.

## Check yourself

<details>
<summary>Why build on GitHub instead of committing <code>dist/</code>?</summary>

Every push is built fresh on a clean machine, so the site can never be stale or built from uncommitted local changes, and the repository holds only source code.
</details>

<details>
<summary>What is the difference between <code>npm ci</code> and <code>npm install</code>?</summary>

`npm ci` installs exactly what `package-lock.json` says and never changes it; it fails if the lock file is out of date. `npm install` may update the lock file. For builds you want the exact, repeatable versions.
</details>

<details>
<summary>The type checker finds an error during the workflow. What happens to the live site?</summary>

Nothing. The build job fails, the deploy job needs it, so it never runs. The previous version stays live.
</details>
