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

  // --- lesson pages: practice questions ---
  // Pick a choice: right ones lock the question and open the explanation;
  // wrong ones are crossed out so you can try again.
  document.querySelectorAll('.quiz').forEach((quiz) => {
    const questions = [...quiz.querySelectorAll('.quiz-q')]
    const score = quiz.querySelector('.quiz-score')
    const firstTry = new Map()

    const update = () => {
      const done = questions.filter((q) => q.classList.contains('done')).length
      if (done < questions.length) {
        score.textContent = ''
        return
      }
      const right = [...firstTry.values()].filter(Boolean).length
      score.textContent = `${right} of ${questions.length} right on the first try. `
      const again = document.createElement('button')
      again.type = 'button'
      again.textContent = 'Start over'
      again.addEventListener('click', reset)
      score.appendChild(again)
    }

    const reset = () => {
      firstTry.clear()
      questions.forEach((q) => {
        q.classList.remove('done')
        q.querySelectorAll('.quiz-choice').forEach((c) => c.classList.remove('right', 'wrong'))
        q.querySelectorAll('input').forEach((i) => {
          i.checked = false
          i.disabled = false
        })
        q.querySelector('.quiz-feedback').textContent = ''
        q.querySelector('.quiz-why').open = false
        q.querySelector('.quiz-why summary span').textContent = 'Show the answer'
      })
      update()
      questions[0]?.scrollIntoView({ block: 'center' })
    }

    // Arrow keys move through a radio group by checking each option they
    // reach, which fires "change". So with the keyboard, arrows only move
    // and Space or Enter answers; clicks and taps answer straight away.
    let arrowing = false
    quiz.addEventListener('keydown', (e) => {
      arrowing = e.key.startsWith('Arrow')
      const input = e.target
      if ((e.key === ' ' || e.key === 'Enter') && input instanceof HTMLInputElement) {
        e.preventDefault()
        input.checked = true
        input.closest('.quiz-q')?.dispatchEvent(new CustomEvent('answer', { detail: input }))
      }
    })
    quiz.addEventListener('pointerdown', () => (arrowing = false))

    questions.forEach((q) => {
      const answer = Number(q.dataset.answer)
      const feedback = q.querySelector('.quiz-feedback')
      q.addEventListener('change', (e) => {
        if (arrowing) {
          feedback.textContent = 'Press Space to answer.'
          return
        }
        q.dispatchEvent(new CustomEvent('answer', { detail: e.target }))
      })
      q.addEventListener('answer', (e) => {
        const input = e.detail
        if (!(input instanceof HTMLInputElement) || input.disabled || q.classList.contains('done')) return
        const label = input.closest('.quiz-choice')
        if (Number(input.value) === answer) {
          if (!firstTry.has(q)) firstTry.set(q, true)
          label.classList.add('right')
          q.classList.add('done')
          q.querySelectorAll('input').forEach((i) => (i.disabled = true))
          feedback.textContent = 'Right.'
          q.querySelector('.quiz-why').open = true
          q.querySelector('.quiz-why summary span').textContent = 'Why'
        } else {
          firstTry.set(q, false)
          label.classList.add('wrong')
          input.disabled = true
          feedback.textContent = 'Not quite. Try another.'
        }
        update()
      })
    })
  })

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
