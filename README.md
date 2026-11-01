# Snack Shelf

A free course in **React and TypeScript**, from the first component to advanced topics like Suspense, Server Components and accessibility. You build one small web app, a shelf of Japanese snacks with like buttons and a search box, adding one idea per lesson.

Each lesson has a written explanation, the app's real code at that point, a live demo, a few "check yourself" questions, and a **practice** section: five multiple-choice questions that check themselves as you answer, plus a small exercise with a hint and a solution.

The practice lives in `content/practice/<lesson>.md`, in a short format described at the top of `scripts/build-site.mjs`.

## Lessons

| # | Lesson | The idea |
|---|---|---|
| 1 | Every website is a house | HTML, CSS and JavaScript, and the DOM they all meet in |
| 2 | Why React exists | Keeping data and screen in sync by hand, and the idea that replaces it |
| 3 | Your first React app | Vite, TypeScript, and how the page actually starts up |
| 4 | Components | Functions that return UI, and the component tree |
| 5 | Props | Passing data down, typed, read-only |
| 6 | State | Giving a component memory with useState |
| 7 | Re-rendering | When React calls your function again, and what it changes |
| 8 | Clicks and typing | Events, and inputs that React controls |
| 9 | Lists and keys | Turning data into cards with map, and why keys matter |
| 10 | Show or hide | Conditional rendering: empty states and badges |
| 11 | Lifting state up | Sharing state between siblings: the basket count |
| 12 | useEffect | Loading snacks from the network, and when not to use effects |
| 13 | Styling it | CSS Modules, CSS variables and inline styles |
| 14 | Building for production | What npm run build makes, and why |
| 15 | Put it online | Deploying the shelf to a real address |
| | **Part two: intermediate** | |
| 16 | Splitting components | children, slots, and when to split a component |
| 17 | useReducer | A basket with quantities, and every change in one function |
| 18 | Custom hooks | Your own use… functions, and saving the basket |
| 19 | Context | Sharing the basket without passing props down |
| 20 | useRef | Keyboard focus, timers, and values that don't re-render |
| 21 | Pages and routing | A page per snack with React Router, and the URL as state |
| 22 | Forms | A checkout form with validation and React 19 form actions |
| 23 | TanStack Query | Server state: caching, retries and refreshing |
| 24 | Testing | Vitest and Testing Library, tests that click like a user |
| | **Part three: advanced** | |
| 25 | Error boundaries | Catching a crash so one broken snack stays one broken card |
| 26 | Portals and toasts | Notifications with Undo, rendered outside the component tree |
| 27 | Performance and the React Compiler | Measuring re-renders, memo, and letting the compiler do it |
| 28 | Suspense and lazy loading | Waiting for data and code without loading states everywhere |
| 29 | Transitions | Typing that stays instant while a slow list catches up |
| 30 | TypeScript for components | Generic components, derived types, and checking server data |
| 31 | State libraries (Zustand) | A basket store with selectors instead of a context |
| 32 | Server Components and Next.js | React on the server, and actions that run there |
| 33 | Accessibility | Keyboard, screen readers, focus, and what automated checks miss |

## Reading the course

Open `index.html` through any local web server (the demos are ES modules, so `file://` will not run them), or read it on GitHub Pages once it is published.

```bash
npx serve .
```

## Running a lesson's code

Every lesson's app lives in `code/lessons/<lesson>/` as a complete, runnable snapshot.

```bash
npm install
npm run lesson -- code/lessons/06-state
```

Lessons 1 and 2 are plain HTML; open their `index.html` directly. Lesson 32 is a Next.js project: run `npm install` and `npm run dev` inside its folder.

The latest lesson's tests (lesson 33) run with:

```bash
npm test
```

## Building the site

```bash
npm run build
```

This type-checks every lesson, builds each lesson's app into `demos/`, and turns `content/lessons/*.md` into `lessons/*.html` and `content/home.html` into `index.html`. The built files are committed, so GitHub Pages can serve the repository root as-is.

## Layout

```
content/          lesson text (Markdown) and the home page template
code/lessons/     the app's source at the end of each lesson
scripts/          build-site.mjs
assets/           site CSS, JS and pictures
lessons/ demos/   built output (generated, committed for GitHub Pages)
index.html        built home page
```

## Credits

Pictures from Wikimedia Commons, credited in the site footer and in `assets/credits.json`:
"おつまみ (3277855675)" by paranoidnotandroid (CC BY 2.0), "Japanese rice balls (onigiri)" by tednmiki (CC BY-SA 3.0), "Melon bread and green tea melon bread" by Andy Li (CC0), "Taiyaki 005" by Ocdp (CC0), "Ramune-lemonade,japan" by katorisi (CC BY 3.0).
