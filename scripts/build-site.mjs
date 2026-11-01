// Builds the static course site:
//   content/lessons/*.md  ->  lessons/*.html
//   content/home.html     ->  index.html
//   code/lessons/*        ->  demos/*   (plain lessons copied, React lessons built with Vite)
// Run with: npm run build

import { readFile, writeFile, readdir, mkdir, rm, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const Prism = require('prismjs')
require('prismjs/components/index.js')(['markup', 'css', 'javascript', 'jsx', 'typescript', 'tsx', 'bash', 'json', 'yaml'])

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'))
const REPO_URL = (pkg.repository?.url ?? pkg.repository ?? '').replace(/^git\+/, '').replace(/\.git$/, '')

const manifest = JSON.parse(await readFile(path.join(ROOT, 'content/lessons.json'), 'utf8'))
const credits = JSON.parse(await readFile(path.join(ROOT, 'assets/credits.json'), 'utf8'))

// ---------- helpers ----------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) throw new Error('missing front matter')
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m[2] }
}

const LANGS = { tsx: 'tsx', ts: 'typescript', jsx: 'jsx', js: 'javascript', html: 'markup', css: 'css', bash: 'bash', json: 'json', yaml: 'yaml' }

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = LANGS[lang]
      if (!language) {
        // diagrams and plain output: no highlighting
        return `<pre class="diagram"><code>${esc(text)}</code></pre>\n`
      }
      const html = Prism.highlight(text, Prism.languages[language], language)
      return `<pre class="code" data-lang="${esc(lang)}"><code>${html}</code></pre>\n`
    },
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens)
      const id = inner.replace(/<[^>]+>/g, '').toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`
    },
    table(token) {
      // wrap tables so they can scroll sideways on a phone
      const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('')
      const rows = token.rows
        .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`)
        .join('\n')
      return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`
    },
  },
})

const creditsHtml = credits
  .map((c) => `<a href="${esc(c.page)}">“${esc(c.title)}”</a> by ${esc(c.creator)}, <a href="${esc(c.licenseUrl)}">${esc(c.license)}</a>`)
  .join('; ')

function bar(prefix) {
  const gh = REPO_URL ? `<a href="${esc(REPO_URL)}">GitHub</a>` : ''
  return `<header class="bar">
  <a class="wordmark" href="${prefix}index.html">Snack Shelf</a>
  <nav aria-label="Site"><a href="${prefix}index.html#lessons">Lessons</a>${gh}</nav>
</header>`
}

function head({ title, description, prefix }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/site.css">
<script src="${prefix}assets/site.js" defer></script>
</head>`
}

// ---------- demos ----------

async function buildDemos() {
  const dir = path.join(ROOT, 'code/lessons')
  for (const slug of await readdir(dir)) {
    const src = path.join(dir, slug)
    const out = path.join(ROOT, 'demos', slug)
    await rm(out, { recursive: true, force: true })
    if (existsSync(path.join(src, 'src/main.tsx'))) {
      await build({
        configFile: path.join(ROOT, 'vite.config.ts'),
        root: src,
        base: './',
        logLevel: 'warn',
        build: { outDir: out, emptyOutDir: true },
      })
    } else {
      await mkdir(out, { recursive: true })
      await cp(src, out, { recursive: true })
    }
    console.log('demo', slug)
  }
}

// ---------- lesson pages ----------

async function buildLessons() {
  const published = manifest.filter((l) => !l.soon)
  await mkdir(path.join(ROOT, 'lessons'), { recursive: true })

  for (const [i, lesson] of manifest.entries()) {
    if (lesson.soon) continue
    const file = path.join(ROOT, 'content/lessons', lesson.slug + '.md')
    const { meta, body } = parseFrontMatter(await readFile(file, 'utf8'))
    // wrap each question so the open/closed arrow and the text sit in two columns
    const html = marked.parse(body).replace(/<summary>([\s\S]*?)<\/summary>/g, '<summary><span>$1</span></summary>')
    const prev = manifest[i - 1]
    const next = manifest[i + 1]
    const demo = meta.demo
    const codeLink = REPO_URL ? `<a href="${esc(REPO_URL)}/tree/main/code/lessons/${esc(lesson.slug)}">Read this lesson's code</a>` : ''

    const pager = `<nav class="pager" aria-label="Lessons">
  ${prev ? `<a class="pager-prev" href="${prev.slug}.html"><span>Previous</span>${esc(prev.title)}</a>` : '<span></span>'}
  ${
    next
      ? next.soon
        ? `<p class="pager-next"><span>Coming next</span>${esc(next.title)}</p>`
        : `<a class="pager-next" href="${next.slug}.html"><span>Next</span>${esc(next.title)}</a>`
      : ''
  }
</nav>`

    const page = `${head({ title: `${meta.title} · Snack Shelf`, description: meta.summary, prefix: '../' })}
<body class="lesson-page">
${bar('../')}
<main class="lesson">
  <div class="lesson-head" data-reveal>
    <h1>${esc(meta.title)}</h1>
    <p class="lead">${esc(meta.summary)}</p>
    <p class="meta">Lesson ${i + 1} of ${manifest.length}, about ${esc(meta.minutes)} minutes</p>
  </div>
  <aside class="demo" aria-label="Live demo">
    <div class="demo-sticky">
      <div class="demo-frame" data-ui>
        <iframe src="../demos/${esc(demo)}/index.html" title="Live demo for ${esc(meta.title)}" loading="lazy"></iframe>
      </div>
      <p class="demo-links"><a href="../demos/${esc(demo)}/index.html" target="_blank" rel="noopener">Open the demo in its own tab</a>${codeLink}</p>
    </div>
  </aside>
  <article class="prose">
${html}
  </article>
</main>
${pager}
<footer class="foot-small">
  <p>Snack Shelf, a beginner course in React and TypeScript. ${published.length === manifest.length ? `${manifest.length} lessons.` : `${published.length} of ${manifest.length} lessons written.`}</p>
</footer>
</body>
</html>
`
    await writeFile(path.join(ROOT, 'lessons', lesson.slug + '.html'), page, 'utf8')
    console.log('lesson', lesson.slug)
  }
}

// ---------- home page ----------

async function buildHome() {
  let tpl = await readFile(path.join(ROOT, 'content/home.html'), 'utf8')
  const groups = [3, 9] // extra space after these lesson numbers
  const rows = manifest
    .map((l, i) => {
      const cls = groups.includes(i) ? ' class="group-start"' : ''
      const title = l.soon ? esc(l.title) : `<a href="lessons/${l.slug}.html">${esc(l.title)}</a>`
      const status = l.soon ? '<span class="soon">Soon</span>' : `<a class="go" href="lessons/${l.slug}.html" aria-hidden="true" tabindex="-1">Read →</a>`
      return `<li${cls}><span class="t">${title}</span><span class="idea">${esc(l.idea)}</span>${status}</li>`
    })
    .join('\n          ')
  const published = manifest.filter((l) => !l.soon).length
  tpl = tpl
    .replaceAll('{{HEAD}}', head({ title: 'Snack Shelf: learn React one snack at a time', description: 'A free beginner course in React and TypeScript. Build a small snack-shelf web app, one idea per lesson.', prefix: '' }).replace(/^<!doctype html>\n<html lang="en">\n/, ''))
    .replaceAll('{{LESSON_ROWS}}', rows)
    .replaceAll(
      '{{LESSONS_NOTE}}',
      published === manifest.length
        ? `All ${manifest.length} lessons are written, each with its code and a live demo.`
        : `${published} of ${manifest.length} written so far. New lessons arrive as they are finished.`,
    )
    .replaceAll('{{PUBLISHED}}', String(published))
    .replaceAll('{{TOTAL}}', String(manifest.length))
    .replaceAll('{{CREDITS}}', creditsHtml)
    .replaceAll('{{GITHUB_LINK}}', REPO_URL ? `<a href="${esc(REPO_URL)}">GitHub</a>` : '')
  await writeFile(path.join(ROOT, 'index.html'), tpl, 'utf8')
  console.log('home')
}

const only = process.argv[2]
if (!only || only === 'demos') await buildDemos()
if (!only || only === 'pages') {
  await buildLessons()
  await buildHome()
}
