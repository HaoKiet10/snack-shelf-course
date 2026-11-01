/*
  BEHAVIOUR (the electricity).
  `document` is the root of the DOM tree. Everything JS does to the page is
  "find a node in the tree, then change it". The browser notices the change
  and redraws the affected part of the screen.
*/

// 1. FIND the node. querySelector takes the same selectors as CSS
//    and returns the FIRST match, or null if nothing matches.
const pockyButton = document.querySelector("#like-pocky");

// 2. The DATA. This number lives in JS memory. The page has no idea it exists.
let pockyLikes = 0;

// 3. LISTEN. Hand the browser a function and say "call this on every click".
//    The function does NOT run now. It runs later, once per click.
pockyButton.addEventListener("click", () => {
  // 3a. Change the data...
  pockyLikes = pockyLikes + 1;

  // 3b. ...then update the screen BY HAND to match.
  //     Forget this line and the data says 1 while the button still says 0.
  //     Keeping data and screen in sync yourself is THE problem React solves.
  pockyButton.textContent = "❤ " + pockyLikes;

  // Challenge: turn the heart red once it's liked.
  // classList.toggle(name, condition) adds the class when condition is true
  // and removes it when false. The look itself is defined in style.css.
  pockyButton.classList.toggle("liked", pockyLikes > 0);
});

/*
  Try this in the browser: open DevTools (F12) -> Console, then type
    document.querySelector("h1").textContent = "Hacked!"
  The title changes instantly, but index.html on disk is untouched.
  Refresh and it's back. Proof that the screen is drawn from the DOM tree
  in memory, not from the file.
*/
