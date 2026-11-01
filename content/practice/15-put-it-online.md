## Q
Why can GitHub Pages host the snack shelf?

- [x] After building, the app is just static files; the browser does all the work
- [ ] It needs a paid plan for React
- [ ] GitHub runs React on its servers
- [ ] GitHub Pages converts React to HTML

> A static host only hands out files. A single-page app needs nothing more.

## Q
What triggers the deploy workflow?

- [ ] Every commit on any branch
- [ ] Running `npm run build` locally
- [x] A push to the `main` branch (or the manual "Run workflow" button)
- [ ] Opening the site

> `on: push: branches: [main]` plus `workflow_dispatch` for the button.

## Q
Why does the workflow use `npm ci` and not `npm install`?

- [x] It installs exactly what `package-lock.json` says and fails if it's out of date
- [ ] `npm ci` also deploys
- [ ] `npm install` doesn't work on Linux
- [ ] It's faster to type

> Builds should be repeatable. `npm install` may change versions; `npm ci` never does.

## Q
A type error is pushed. What happens to the live site?

- [ ] GitHub fixes the error
- [x] Nothing: the build job fails, so the deploy job never runs and the old version stays
- [ ] It breaks
- [ ] It shows the error message

> `needs: build` makes deploying depend on a successful build.

## Q
The site shows a blank page and the Network tab shows 404s for `/assets/...`. Most likely cause?

- [ ] The browser is too old
- [ ] The workflow didn't run
- [ ] The repository is private
- [x] `base` isn't set, so the paths point at the domain root instead of `/snack-shelf/`

> GitHub Pages serves projects under a sub-path. `base: './'` makes the paths relative (lesson 14).

## Exercise: Check before you ship
Add a step to the workflow that runs the linter before building, so lint errors also stop a deploy.

### Hint
Steps run top to bottom, and a failing step stops the job. The project already has `npm run lint`.

### Solution
```yaml
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

Place it after `npm ci` (the linter is a dependency) and before the build.
