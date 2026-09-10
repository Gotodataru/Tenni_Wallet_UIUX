#!/usr/bin/env node
/**
 * Linter for docs/FIGMA_RULES.md
 *
 * Catches CSS that has no Figma Auto Layout equivalent — exactly what makes
 * a component fall apart on import.
 *
 * Run: npm run check:figma
 */

import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const SRC = join(ROOT, 'src')

/** Relaxed files: the browser reset and the documentation chrome. */
const RESET_FILES = ['styles/base.css']
const DOC_FILES = ['pages/kitchen.css']

const RULES = [
  {
    id: 'margin',
    re: /(^|[\s;{])(margin(-top|-right|-bottom|-left)?)\s*:\s*([^;]+)/i,
    ok: (m) => /^0(px)?$/.test(m[4].trim()),
    msg: "margin is not allowed — Figma Auto Layout has none. Use the parent's padding + gap.",
  },
  {
    id: 'percent-size',
    re: /(^|[\s;{])(width|height|min-width|min-height|max-width|max-height)\s*:\s*[\d.]+%/i,
    msg: 'percentage size — Figma has no %. Use fit-content / flex: 1 1 0 / fixed px.',
  },
  {
    id: 'grid',
    re: /display\s*:\s*(inline-)?grid/i,
    msg: 'display: grid has no Figma equivalent. Use nested flex containers.',
  },
  {
    id: 'line-height-unitless',
    re: /line-height\s*:\s*([\d.]+)\s*(;|$)/i,
    msg: 'unitless line-height does not transfer to Figma exactly. Use px.',
  },
  {
    id: 'position',
    re: /position\s*:\s*(absolute|fixed|sticky)/i,
    needsMarker: 'is-abs',
    msg: 'out-of-flow position needs an /* is-abs: why */ note.',
  },
  {
    id: 'hardcoded-color',
    re: /:\s*#[0-9a-f]{3,8}\b/i,
    msg: 'hard-coded color. Colors come from var(--*); values live in tokens/.',
  },
  {
    id: 'magic-space',
    re: /(^|[\s;{])(padding|gap|row-gap|column-gap|border-radius)\s*:\s*([^;]+)/i,
    ok: (m) => m[3].split(/\s+/).every((v) => /^(0|0px|var\(--[\w-]+\)|inherit|auto)$/.test(v.trim())),
    msg: 'magic number. Spacing and radii come from var(--space-*) / var(--r-*).',
  },
]

async function walk(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name.endsWith('.css')) out.push(p)
  }
  return out
}

const files = await walk(SRC)
const problems = []

for (const file of files) {
  const rel = relative(SRC, file).split(sep).join('/')
  if (rel.startsWith('tokens/')) continue           // tokens are the source of values — literals are legal there

  const isReset = RESET_FILES.includes(rel)
  const isDoc = DOC_FILES.includes(rel)
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)

  lines.forEach((line, i) => {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) return

    for (const rule of RULES) {
      // Relaxations
      if (isReset && ['margin', 'position', 'percent-size'].includes(rule.id)) continue
      if (isDoc && rule.id === 'magic-space') continue

      const m = line.match(rule.re)
      if (!m) continue
      if (rule.ok && rule.ok(m)) continue

      if (rule.needsMarker) {
        const ctx = lines.slice(Math.max(0, i - 2), i + 2).join('\n')
        if (ctx.includes(rule.needsMarker)) continue
      }

      problems.push({ rel, line: i + 1, id: rule.id, msg: rule.msg, src: line.trim() })
    }
  })
}

if (problems.length === 0) {
  console.log(`✓ FIGMA_RULES: no violations (${files.length} stylesheets checked)`)
  process.exit(0)
}

console.error(`\n✗ FIGMA_RULES: ${problems.length} violations\n`)
for (const p of problems) {
  console.error(`  ${p.rel}:${p.line}  [${p.id}]`)
  console.error(`     ${p.src}`)
  console.error(`     → ${p.msg}\n`)
}
process.exit(1)
