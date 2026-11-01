/*
  Lesson 2: every button wired BY HAND (the imperative way).
  It works. Count the places that must be kept in sync, then imagine
  adding "unlike", "remove snack" or a "top snack" banner.
*/

// The DATA lives in JS memory...
const snacks = [
  { name: "Pocky", likes: 0 },
  { name: "Onigiri", likes: 0 },
  { name: "Melon Pan", likes: 0 },
];
let basket = 0;

const basketEl = document.querySelector("#basket");

// ...and every click must update the data AND every spot on screen.
document.querySelectorAll(".like").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    snacks[i].likes++;
    basket++;

    btn.textContent = "❤ " + snacks[i].likes;            // sync #1
    btn.classList.toggle("liked", snacks[i].likes > 0);  // sync #2
    basketEl.textContent = "🧺 " + basket;               // sync #3
  });
});
