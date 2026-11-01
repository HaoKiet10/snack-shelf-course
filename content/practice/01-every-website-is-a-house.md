## Q
What is the DOM?

- [ ] The part of CSS that handles layout
- [ ] A JavaScript library for changing pages
- [ ] Another name for the HTML file
- [x] The tree of objects the browser builds from the HTML, which the screen is drawn from

> The browser reads the HTML once and builds a tree of objects in memory. That tree is the DOM. The screen is drawn from it, and JavaScript changes the page by changing it.

## Q
A script runs `document.querySelector('.count').textContent = '3'`. What changes?

- [ ] The HTML file on disk
- [x] The DOM, and so the screen; the HTML file stays the same
- [ ] Nothing until you reload the page
- [ ] Only the CSS

> JavaScript works on the DOM, the live copy in memory. The file you wrote is never touched; reload the page and the original text is back.

## Q
You change some text with JavaScript, then open **View Source** and DevTools' **Elements** tab. Which shows the new text?

- [ ] View Source
- [x] Elements
- [ ] Both
- [ ] Neither

> View Source shows the file the server sent. Elements shows the current DOM, including everything JavaScript changed since.

## Q
Why does a `<script>` in the `<head>` often need `defer`?

- [x] So it runs after the HTML has been read, when the elements it looks for exist
- [ ] To make the script download faster
- [ ] Because scripts in the head are ignored without it
- [ ] So the script runs before the page appears

> Without `defer`, the script runs as soon as the browser reaches it, before the body has been read. `querySelector` would find nothing. `defer` waits until the whole document is parsed.

## Q
Which part of the house is CSS?

- [ ] The walls: what's on the page
- [ ] The electricity: what happens when you click
- [ ] The address: where the page lives
- [x] The paint: how it looks

> HTML is the structure, CSS is the appearance, JavaScript is the behaviour. Each can change without touching the others.

## Exercise: A reset button
In lesson 1's plain HTML version, add a **Reset** button under the cards. Clicking it should set every like count back to 0 on the screen.

### Hint
`document.querySelectorAll('.count')` gives you every count element. Loop over them and set each `textContent`. Remember to wire the button with `addEventListener('click', …)`.

### Solution
```html
<button id="reset">Reset likes</button>
```

```js
document.querySelector('#reset').addEventListener('click', () => {
  document.querySelectorAll('.count').forEach((el) => {
    el.textContent = '0'
  })
})
```

Notice what you had to remember: every place a like count is shown. That bookkeeping is exactly the problem lesson 2 is about.
