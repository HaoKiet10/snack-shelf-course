## Q
A button shows only "❤ 3". What does a screen reader announce?

- [ ] "Button"
- [x] Something like "red heart, 3": neither the action nor the snack
- [ ] Nothing at all
- [ ] "Like Pocky, 3 likes"

> Give it an `aria-label` that says what it does and its state.

## Q
Why was `<span aria-label="quantity">2</span>` ignored?

- [ ] Spans can't hold numbers
- [x] `aria-label` only applies to elements with a role, like buttons, links and inputs
- [ ] It needs `aria-hidden` too
- [ ] Screen readers ignore all spans

> Use real text that's hidden visually, with a `.visually-hidden` class.

## Q
Why does the app move focus to `<main>` after a page change?

- [ ] To hide the header
- [x] A single-page app swaps content without loading a page, so focus would stay on the old link and nothing would be announced
- [ ] Browsers require it
- [ ] To scroll to the top faster

> Moving focus puts keyboard and screen-reader users at the start of the new content.

## Q
Why does the focus effect compare with the last path instead of skipping its first run with a flag?

- [ ] React forbids booleans in refs
- [x] StrictMode runs effects twice in development, so a "first run" flag let the second run steal focus on page load
- [ ] Flags are slower
- [ ] To support older browsers

> Comparing values works however many times an effect runs.

## Q
The axe tests pass. What does that tell you?

- [ ] Screen readers will work perfectly
- [ ] Colour contrast is fine
- [ ] The app is fully accessible
- [x] No mechanical problems were found; most real problems still need testing by hand

> In this lesson, the axe tests passed before any of the fixes. Tab through it, and try a screen reader.

## Exercise: Announce the basket
When a snack is added, make sure screen-reader users hear the new basket count, even if they can't see the header.

### Hint
The toast already uses `aria-live`. Another way: a visually hidden `aria-live="polite"` region in the Header that contains the count as a sentence.

### Solution
```tsx
<span className="visually-hidden" aria-live="polite">
  {count === 0 ? 'Basket is empty' : `${count} ${count === 1 ? 'item' : 'items'} in the basket`}
</span>
```

The region has to exist before its text changes; screen readers announce changes, not a region appearing with text already in it.
