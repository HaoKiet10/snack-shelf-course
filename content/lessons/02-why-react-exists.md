---
title: Why React exists
summary: Wire up every like button and the basket total by hand, and you will feel the problem React was built to solve.
minutes: 10
demo: 02-why-react-exists
---

In lesson 1 only one button worked. The demo for this lesson makes **all three** like buttons work and keeps the basket total right, in plain JavaScript. It works. Look at how.

## The problem: keeping data and screen in sync

```js
const snacks = [
  { name: "Pocky", likes: 0 },
  { name: "Onigiri", likes: 0 },
  { name: "Melon Pan", likes: 0 },
];
let basket = 0;

document.querySelectorAll(".like").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    snacks[i].likes++;            // change the data...
    basket++;

    btn.textContent = "❤ " + snacks[i].likes;                 // ...sync screen #1
    btn.classList.toggle("liked", snacks[i].likes > 0);       // ...sync screen #2
    document.querySelector("#basket").textContent = "🧺 " + basket; // ...sync #3
  });
});
```

Every change to the data must be followed by updating, **by hand**, each spot on the screen that shows that data. This style is called **imperative**: you give the browser step-by-step instructions.

Now imagine adding features:

- an "unlike" button: copy all three sync lines, and remember to subtract;
- a "remove snack" button: delete the card, fix the basket, and the index `i` no longer points at the right snack;
- a "top snack" banner: now every like must also check whether the banner needs to change.

Every feature multiplies the places to update. **Forget one, and the screen shows the wrong thing.** That class of bug was hurting Facebook's interface when they built React.

## The idea: describe the result, not the steps

What if you only wrote one function that says *given this data, the screen looks like this*, and called it again whenever the data changed?

```js
function render() {
  shelf.innerHTML = snacks.map(s => `
    <div class="card">
      <h2>${s.name}</h2>
      <button class="${s.likes > 0 ? "like liked" : "like"}">❤ ${s.likes}</button>
    </div>
  `).join("");
  basketEl.textContent = "🧺 " + basket;
}
```

Now there is one rule: **change the data, then call `render()`.** You cannot forget a spot, because the whole screen is derived from the data. This style is called **declarative**: you describe *what* the screen should be, not *how* to change it.

> **UI = f(data).** This one line is the core of React.

But this naive version has real problems:

1. **Slow.** It throws away and rebuilds every DOM node on every click.
2. **It loses things.** Text typed into an input, keyboard focus and scroll position vanish when the nodes are rebuilt.
3. **Listeners vanish** with the old nodes, so you must attach them again every time.

## What React adds

React keeps the "describe it again" model and fixes those problems:

1. Your components return a **description** of the UI: lightweight JavaScript objects, not real DOM nodes.
2. When data changes, React calls your component again to get a **new description**.
3. It **compares** the new description with the old one. This is called *reconciliation*.
4. It changes **only the DOM nodes that differ**. If one number changed, it touches one text node. Inputs keep their text, focus stays put.

```diagram
data changes ─▶ React calls your function ─▶ new description
                                               │ compare with old
                                               ▼
                                     update only what changed in the DOM
```

A preview of what a snack card looks like in React (the syntax comes later):

```tsx
function SnackCard({ snack, onLike }) {
  return (
    <div className="card">
      <h2>{snack.name}</h2>
      <button className={snack.likes > 0 ? "like liked" : "like"} onClick={onLike}>
        ❤ {snack.likes}
      </button>
    </div>
  );
}
```

Notice what is missing: no `querySelector`, no `textContent =`, no `classList.toggle`. You never touch the DOM. You say what the card looks like for a given snack, and React keeps the page matching.

## Check yourself

<details>
<summary>In the imperative version you add an "unlike" button and forget to update the basket. What goes wrong?</summary>

The heart count goes down but the basket total stays where it was. The data and the screen now disagree, and nothing will ever correct it: the basket only updates when your code updates it.
</details>

<details>
<summary>Why does the naive <code>render()</code> wipe out whatever someone typed into a search box?</summary>

`innerHTML = ...` destroys every existing node inside the shelf and creates brand-new ones. A brand-new input element starts empty and unfocused. The old one, with the typed text, is gone.
</details>

<details>
<summary>What does React compare, and why is that faster than rebuilding everything?</summary>

It compares the new description (plain JavaScript objects) with the previous description. Comparing objects is cheap. Touching the real DOM is the expensive part, and React only does it for the parts that actually differ.
</details>
