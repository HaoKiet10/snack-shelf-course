// Snack Shelf course site: section entrances, the "watch the shelf grow"
// slider on the home page, and copy buttons on code blocks.
document.documentElement.classList.add('js')

window.addEventListener('DOMContentLoaded', () => {
  // --- entrances: reveal each [data-reveal] block once as it enters ---
  const targets = document.querySelectorAll('[data-reveal], .shutter')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((t) => io.observe(t))
  } else {
    targets.forEach((t) => t.classList.add('in'))
  }

  // --- home: drag through the stages of the app ---
  const range = document.getElementById('grow-range')
  const frame = document.getElementById('grow-frame')
  const title = document.getElementById('grow-title')
  const stops = document.querySelectorAll('#grow-stops li')
  if (range && frame && title && stops.length) {
    let timer
    const show = (i) => {
      const stop = stops[i]
      stops.forEach((s, k) => s.classList.toggle('on', k === i))
      range.value = String(i)
      range.style.setProperty('--fill', (i / (stops.length - 1)) * 100 + '%')
      title.classList.add('swap')
      clearTimeout(timer)
      timer = setTimeout(() => {
        title.textContent = stop.dataset.clause
        title.classList.remove('swap')
      }, 200)
      const src = 'demos/' + stop.dataset.demo + '/index.html'
      if (!frame.src.endsWith(src)) frame.src = src
    }
    range.addEventListener('input', () => show(Number(range.value)))
    stops.forEach((s, i) => s.addEventListener('click', () => show(i)))
  }

  // --- lesson pages: copy buttons on code blocks ---
  document.querySelectorAll('.prose pre.code').forEach((pre) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy'
    btn.textContent = 'Copy'
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code').innerText)
        btn.textContent = 'Copied'
      } catch {
        btn.textContent = 'Select and copy'
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1600)
    })
    // wrap the <pre> so the button stays put while the code scrolls sideways
    const wrap = document.createElement('div')
    wrap.className = 'code-block'
    pre.replaceWith(wrap)
    wrap.append(pre, btn)
  })
})
