## Q
In the hand-written version, a like changes three things on screen: the count, the button colour and the basket total. What is the real problem with updating them by hand?

- [x] Every change must remember every place that shows that data, and forgetting one leaves the screen out of sync
- [ ] JavaScript is too slow to update three elements
- [ ] Browsers can only update one element per click
- [ ] CSS can't change colours after the page loads

> The code works, but each new feature adds more places to keep in sync. Miss one and the screen disagrees with the data. That bookkeeping grows faster than the app.

## Q
What does "UI = f(data)" mean?

- [x] The screen is calculated from the data, the way a function's result is calculated from its input
- [ ] Data must be stored in the UI
- [ ] The UI is a function you call to fetch data
- [ ] Every element needs its own function

> You describe what the screen should look like for any given data. When the data changes, the screen is recalculated, instead of being patched step by step.

## Q
Which is **declarative**?

- [ ] "Wait for a click, then change the DOM"
- [x] "If likes is above 0, the button has the class `liked`"
- [ ] "Loop over the cards and change each one"
- [ ] "Find the button, add the class `liked`, then update the counter's text"

> Declarative code says what the result should be. Imperative code lists the steps to get there. React lets you write the first and does the steps for you.

## Q
When the data changes, what does React do with the DOM?

- [ ] Nothing: you still update it yourself
- [x] Works out what is different from last time and changes only that
- [ ] Reloads the page from the server
- [ ] Throws it away and rebuilds the whole page

> React calculates the new description of the screen, compares it with the previous one, and makes the smallest set of DOM changes. This is called reconciliation.

## Q
Which job does React **not** take over from you?

- [ ] Updating the DOM when data changes
- [ ] Keeping the count and the button colour in sync
- [x] Deciding what the data is and how it changes
- [ ] Working out which elements need to change

> You still own the data and the rules for changing it. React's job is turning that data into the screen.

## Exercise: Spot the sync bugs
In lesson 2's hand-written version, imagine adding a **"liked snacks: 2"** line in the header that counts how many snacks have at least one like. List every function you would have to change, and what each would have to do.

### Hint
Look for every place that changes a like count. Each one now also affects the new line.

### Solution
Every handler that changes likes (the like button, and any reset or remove you add later) must also recount the liked snacks and update the header text. If one forgets, the header lies.

In React you would write the line once, `{snacks.filter((s) => likes[s.id] > 0).length}`, and it would be right after every change, because it is recalculated from the data.
