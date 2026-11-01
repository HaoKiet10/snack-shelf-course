---
title: Every website is a house
summary: HTML is the walls, CSS is the paint, JavaScript is the electricity. And the screen is drawn from something you never see in the file: the DOM.
minutes: 12
demo: 01-every-website-is-a-house
---

This lesson is a quick recap of plain HTML, CSS and JavaScript, built around the first version of the Snack Shelf: three snack cards and one working like button. It ends with the problem that the rest of the course solves.

## What the browser does with your files

```diagram
index.html ──parse──▶ DOM tree ─┐
                                ├─▶ match styles ─▶ LAYOUT ─▶ PAINT ─▶ pixels
style.css ──parse──▶ CSS rules ─┘
script.js ──run──▶ reads and changes the DOM ──▶ browser redoes the steps above
                                                 for whatever changed
```

The key idea: the screen is drawn from the **DOM**, a tree of objects in memory, not from your HTML file. The HTML file is just the recipe the browser uses to build that tree.

## HTML builds the structure

```html
<div class="card">
  <span class="emoji">🍫</span>
  <h2>Pocky</h2>
  <p class="price">$2.50</p>
  <button id="like-pocky" class="like">❤ 0</button>
</div>
```

- Elements nest inside each other, so the page is a **tree**: `body` → `main` → `div.card` → `button`.
- `class` labels a group of elements, mostly for CSS. `id` names exactly one element, mostly for JavaScript.
- The browser builds the tree from top to bottom. That is why the script tag needs `defer`: without it, the script runs as soon as the browser reaches it, before the buttons below it exist.

```html
<link rel="stylesheet" href="style.css">   <!-- in <head> -->
<script src="script.js" defer></script>    <!-- defer = run after the HTML is parsed -->
```

## CSS styles it

```css
.shelf { display: flex; gap: 16px; }        /* cards side by side */
.card  { padding: 16px; border-radius: 12px; }
.like.liked { color: crimson; }             /* both classes on one element */
```

- A rule is a **selector** (which elements) plus **properties** (what they look like).
- **Cascade:** when two rules disagree, the more specific selector wins (`#id` beats `.class` beats `tag`). On a tie, the later rule wins.
- **Inheritance:** text styles like `color` and `font` flow down the tree from parent to child.
- **Box model:** every element is a rectangle of content, padding, border and margin.
- **Flexbox:** `display: flex` on a parent lays its children out in a row.

## JavaScript makes it move

Every DOM interaction has the same three steps: **find** an element, **listen** for something, **change** the element.

```js
// 1. FIND the element
const pockyButton = document.querySelector("#like-pocky");

// 2. The DATA lives in JS memory. The page doesn't know it exists.
let pockyLikes = 0;

// 3. LISTEN: hand the browser a function to call on every click
pockyButton.addEventListener("click", () => {
  pockyLikes = pockyLikes + 1;                       // change the data...
  pockyButton.textContent = "❤ " + pockyLikes;       // ...then update the screen BY HAND
  pockyButton.classList.toggle("liked", pockyLikes > 0);
});
```

The function you pass to `addEventListener` does not run now. It runs later, once per click.

**The event loop, in brief.** JavaScript runs on one thread. When you click, the browser puts a "click happened" task in a queue. When JavaScript is free, it takes the task and runs your function. That is why a long-running function freezes the whole page: nothing else can run until it finishes.

## So what is the DOM?

DOM stands for **Document Object Model**: the browser's live, in-memory version of your page. Each element becomes a **node**, a real JavaScript object with:

- properties: `textContent`, `className`, `style`, `id`;
- links to its relatives: `parentNode`, `children`, `nextSibling`;
- methods: `addEventListener`, `remove()`, `appendChild()`.

```diagram
document
└─ html
   └─ body
      ├─ header
      │  ├─ h1  ── "Yune's Snack Shelf"
      │  └─ span#basket
      └─ main.shelf
         ├─ div.card ── h2 "Pocky", button "❤ 0"
         ├─ div.card ── h2 "Onigiri", ...
         └─ div.card ── h2 "Melon Pan", ...
```

After the page loads, the HTML file no longer matters. You can prove it: open the demo, press F12, go to the Console and type

```js
document.querySelector("h1").textContent = "Hacked!"
```

The title changes instantly. The **Elements** tab now says "Hacked!" too, because it shows the DOM, not the file. Refresh, and the DOM is rebuilt from the file, so your change is gone.

| You want to... | DOM code |
|---|---|
| find an element | `document.querySelector(".card")` |
| change its text | `el.textContent = "❤ 1"` |
| change its style | `el.classList.add("liked")` |
| add an element | `parent.appendChild(newEl)` |
| remove one | `el.remove()` |
| react to the user | `el.addEventListener("click", fn)` |

## The problem this sets up

In `script.js`, the like count exists in **two places**:

| Where | What | Who updates it |
|---|---|---|
| JavaScript memory | `pockyLikes = 1` | your code |
| the DOM | the text "❤ 1" on the button | also your code, by hand |

Nothing connects the two. Every time the data changes, you must remember to fix every place on screen that shows it. With one button that is easy. With a whole app it is where most bugs come from, and it is the reason React exists.

## Check yourself

<details>
<summary>You delete <code>defer</code> from the script tag. What breaks, and why?</summary>

The script now runs as soon as the browser reaches the `<script>` tag in `<head>`, before the `<body>` has been parsed. `document.querySelector("#like-pocky")` finds nothing and returns `null`, and `null.addEventListener(...)` throws an error, so the button never works.
</details>

<details>
<summary>What is the difference between <code>.like.liked</code> and <code>.like .liked</code>?</summary>

Without a space, both classes must be on the **same** element: a button that has `like` and `liked`. With a space, it means an element with class `liked` somewhere **inside** an element with class `like`.
</details>

<details>
<summary>In the console you run <code>pockyLikes = 100</code>. What does the button show?</summary>

Still the old number. The variable really is 100 now, but changing a variable does not touch the DOM. Only a line like `pockyButton.textContent = ...` updates the screen, and that runs only on a click. Click once and the button jumps to 101. That gap between data and screen is the whole point of this lesson.
</details>
