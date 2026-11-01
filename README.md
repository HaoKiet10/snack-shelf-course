# Snack Shelf

A free beginner course in **React and TypeScript**. You build one small web app, a shelf of Japanese snacks with like buttons and a search box, adding one idea per lesson.

Each lesson has a written explanation, the app's real code at that point, a live demo, and a few "check yourself" questions with answers.

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
| 10–15 | Coming soon | Show or hide, lifting state up, useEffect, styling, building, putting it online |

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

Lessons 1 and 2 are plain HTML; open their `index.html` directly.

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
