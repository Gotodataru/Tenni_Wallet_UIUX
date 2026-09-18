// Tenni tokens → Figma Variables and styles.
// Idempotent: re-running updates existing variables and styles by name.

const MONO_FAMILY = 'Roboto Mono' // ui-monospace has no Figma equivalent

const report = { vars: 0, textStyles: 0, effectStyles: 0, paintStyles: 0, icons: 0, skipped: [] }

// ---------- value parsing ----------

function parseColor(v) {
  v = v.trim()
  let m = v.match(/^#([0-9a-f]{6})$/i)
  if (m) {
    const n = parseInt(m[1], 16)
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 }
  }
  m = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i)
  if (m) return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] === undefined ? 1 : +m[4] }
  return null
}

const px = (v) => {
  const m = String(v).trim().match(/^(-?[\d.]+)(px|ms)?$/)
  return m ? +m[1] : null
}

/** Split on commas that are not inside parentheses. */
function splitTop(v) {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of v) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

const aliasOf = (v) => {
  const m = v.trim().match(/^var\(--([\w-]+)\)$/)
  return m ? m[1] : null
}

// ---------- naming ----------

// --c-ball-glow → ball-glow  (palette stays flat, it is hidden from pickers)
const paletteName = (k) => k.replace(/^c-/, '')

// --text-h1-size → text/h1/size, --space-12 → space/12, --r-md → radius/md
function scaleName(k) {
  let m = k.match(/^text-(\w+)-(size|lh|w|ls)$/)
  if (m) return `text/${m[1]}/${{ size: 'size', lh: 'line-height', w: 'weight', ls: 'letter-spacing' }[m[2]]}`
  m = k.match(/^r-(.+)$/)
  if (m) return `radius/${m[1]}`
  const i = k.indexOf('-')
  return i < 0 ? k : `${k.slice(0, i)}/${k.slice(i + 1)}`
}

// --bg-surface-1 → bg/surface-1, --accent → accent/default
function themeName(k) {
  const i = k.indexOf('-')
  return i < 0 ? `${k}/default` : `${k.slice(0, i)}/${k.slice(i + 1)}`
}

function scaleScopes(k) {
  if (k.startsWith('space-')) return ['GAP', 'WIDTH_HEIGHT']
  if (k.startsWith('r-')) return ['CORNER_RADIUS']
  if (/-size$/.test(k)) return ['FONT_SIZE']
  if (/-lh$/.test(k)) return ['LINE_HEIGHT']
  if (/-ls$/.test(k)) return ['LETTER_SPACING']
  if (/-w$/.test(k)) return ['FONT_WEIGHT']
  if (k.startsWith('font-')) return ['FONT_FAMILY']
  if (/^(control|icon|touch|screen|statusbar|appbar|tabbar|home)-/.test(k)) return ['WIDTH_HEIGHT']
  if (k === 'icon-stroke') return ['STROKE_FLOAT']
  return []
}

function themeScopes(k) {
  if (k.startsWith('fg-') || k === 'up' || k === 'down') return ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR']
  if (k.startsWith('border-')) return ['STROKE_COLOR']
  if (k === 'glass-blur') return ['EFFECT_FLOAT']
  if (k.startsWith('btn-') && k.endsWith('-fg')) return ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR']
  return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR']
}

// ---------- Figma helpers ----------

async function getCollection(name) {
  const all = await figma.variables.getLocalVariableCollectionsAsync()
  return all.find((c) => c.name === name) || figma.variables.createVariableCollection(name)
}

async function getVariable(collection, name, type) {
  const all = await figma.variables.getLocalVariablesAsync(type)
  const found = all.find((v) => v.variableCollectionId === collection.id && v.name === name)
  if (found) return found
  report.vars++
  return figma.variables.createVariable(name, collection, type)
}

function ensureMode(collection, index, name) {
  if (collection.modes[index]) {
    collection.renameMode(collection.modes[index].modeId, name)
    return collection.modes[index].modeId
  }
  return collection.addMode(name)
}

// ---------- 1. palette ----------

async function buildPalette() {
  const col = await getCollection('palette')
  const mode = ensureMode(col, 0, 'Value')
  const byKey = {}
  for (const [k, v] of Object.entries(TOKENS.palette)) {
    const color = parseColor(v)
    if (!color) {
      report.skipped.push(`palette --${k} (gradient/shadow → styles)`)
      continue
    }
    const variable = await getVariable(col, paletteName(k), 'COLOR')
    variable.setValueForMode(mode, color)
    variable.scopes = [] // components use theme tokens only
    variable.hiddenFromPublishing = true
    byKey[k] = variable
  }
  return byKey
}

// ---------- 2. scale ----------

async function buildScale() {
  const col = await getCollection('scale')
  const mode = ensureMode(col, 0, 'Value')
  const byKey = {}
  for (const [k, v] of Object.entries(TOKENS.scale)) {
    let type
    let value
    if (k.startsWith('font-')) {
      type = 'STRING'
      value = k === 'font-mono' ? MONO_FAMILY : v.split(',')[0].replace(/['"]/g, '').trim()
    } else if (k.startsWith('ease-')) {
      report.skipped.push(`scale --${k} (easing: prototype setting, not a variable)`)
      continue
    } else {
      value = px(v)
      if (value === null) {
        report.skipped.push(`scale --${k}: ${v}`)
        continue
      }
      type = 'FLOAT'
    }
    const variable = await getVariable(col, scaleName(k), type)
    variable.setValueForMode(mode, value)
    variable.scopes = scaleScopes(k)
    byKey[k] = variable
  }
  return byKey
}

// ---------- 3. theme (Dark / Light) ----------

// Figma Starter allows one mode per collection. Then Light goes to its own
// collection `theme-light`; on a paid plan a re-run adds the Light mode to
// `theme` and `theme-light` can be deleted.
async function buildTheme(palette) {
  const dark = await getCollection('theme')
  const darkMode = ensureMode(dark, 0, 'Dark')
  let lightMode = null
  try {
    lightMode = ensureMode(dark, 1, 'Light')
  } catch (e) {
    report.skipped.push(`Light mode not allowed on this plan (${e.message}) → collection theme-light`)
  }
  if (lightMode) return fillTheme(dark, { dark: darkMode, light: lightMode }, palette)

  const byKey = await fillTheme(dark, { dark: darkMode }, palette)
  const light = await getCollection('theme-light')
  await fillTheme(light, { light: ensureMode(light, 0, 'Light') }, palette)
  return byKey
}

async function fillTheme(col, modes, palette) {
  const keys = Object.keys(TOKENS.dark)
  const byKey = {}

  const kindOf = (v) => {
    const a = aliasOf(v)
    if (a) return a.startsWith('c-') ? 'COLOR' : 'ALIAS'
    if (parseColor(v)) return 'COLOR'
    if (px(v) !== null) return 'FLOAT'
    return null
  }

  // pass 1: create
  for (const k of keys) {
    let kind = kindOf(TOKENS.dark[k])
    if (kind === 'ALIAS') kind = kindOf(TOKENS.dark[aliasOf(TOKENS.dark[k])])
    if (!kind) continue // gradients and shadows → styles
    const variable = await getVariable(col, themeName(k), kind)
    variable.scopes = themeScopes(k)
    byKey[k] = variable
  }

  // pass 2: values per mode
  for (const [theme, mode] of Object.entries(modes)) {
    for (const k of keys) {
      const variable = byKey[k]
      if (!variable) continue
      const v = TOKENS[theme][k]
      const a = aliasOf(v)
      if (a && palette[a]) variable.setValueForMode(mode, figma.variables.createVariableAlias(palette[a]))
      else if (a && byKey[a]) variable.setValueForMode(mode, figma.variables.createVariableAlias(byKey[a]))
      else if (parseColor(v)) variable.setValueForMode(mode, parseColor(v))
      else if (px(v) !== null) variable.setValueForMode(mode, px(v))
      else report.skipped.push(`theme ${theme} --${k}: ${v}`)
    }
  }

  for (const k of keys) if (!byKey[k]) report.skipped.push(`theme --${k} (gradient/shadow → styles)`)
  return byKey
}

// ---------- 4. text styles ----------

const WEIGHT_STYLE = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' }
const norm = (s) => s.toLowerCase().replace(/\s+/g, '')

async function fontFor(family, weight) {
  const fonts = await figma.listAvailableFontsAsync()
  const want = norm(WEIGHT_STYLE[weight] || 'Regular')
  const hit = fonts.find((f) => f.fontName.family === family && norm(f.fontName.style) === want)
  const fontName = hit ? hit.fontName : { family: 'Inter', style: WEIGHT_STYLE[weight] || 'Regular' }
  if (!hit) report.skipped.push(`font ${family} ${weight} not installed → Inter`)
  await figma.loadFontAsync(fontName)
  return fontName
}

async function buildTextStyles(scale) {
  const roles = [...new Set(Object.keys(TOKENS.scale).map((k) => (k.match(/^text-(\w+)-size$/) || [])[1]).filter(Boolean))]
  const displayRoles = ['display', 'h1', 'h2'] // Text.css: these use --font-display
  const existing = await figma.getLocalTextStylesAsync()

  for (const role of roles) {
    const get = (p) => TOKENS.scale[`text-${role}-${p}`]
    const family = role === 'mono' ? MONO_FAMILY : displayRoles.includes(role) ? 'Space Grotesk' : 'Inter'
    const weight = px(get('w'))
    const name = `${role === 'bodysm' ? 'bodySm' : role}`
    let style = existing.find((s) => s.name === name)
    if (!style) {
      style = figma.createTextStyle()
      style.name = name
      report.textStyles++
    }
    style.fontName = await fontFor(family, weight)
    style.fontSize = px(get('size'))
    style.lineHeight = { unit: 'PIXELS', value: px(get('lh')) }
    style.letterSpacing = { unit: 'PIXELS', value: px(get('ls')) }
    if (role === 'caption') style.textCase = 'UPPER'

    for (const [field, p] of [['fontSize', 'size'], ['lineHeight', 'lh'], ['letterSpacing', 'ls']]) {
      const variable = scale[`text-${role}-${p}`]
      if (!variable) continue
      try {
        style.setBoundVariable(field, variable)
      } catch (e) {
        report.skipped.push(`bind ${name}.${field}: ${e.message}`)
      }
    }
  }
}

// ---------- 5. effect styles (shadows) ----------

function parseShadows(v) {
  if (v.trim() === 'none') return []
  return splitTop(v).map((part) => {
    const inset = /\binset\b/.test(part)
    const colorMatch = part.match(/rgba?\([^)]*\)|#[0-9a-f]{6}/i)
    const color = colorMatch ? parseColor(colorMatch[0]) : { r: 0, g: 0, b: 0, a: 1 }
    const nums = part.replace(/inset/, '').replace(colorMatch ? colorMatch[0] : '', '').trim().split(/\s+/).map(px)
    const [x = 0, y = 0, blur = 0, spread = 0] = nums
    const effect = {
      type: inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      color, offset: { x, y }, radius: blur, spread,
      visible: true, blendMode: 'NORMAL',
    }
    if (!inset) effect.showShadowBehindNode = false // drop shadows only
    return effect
  })
}

async function upsertEffectStyle(name, effects) {
  const existing = await figma.getLocalEffectStylesAsync()
  let style = existing.find((s) => s.name === name)
  if (!style) {
    style = figma.createEffectStyle()
    style.name = name
    report.effectStyles++
  }
  try {
    style.effects = effects
  } catch (e) {
    // Newer API versions require blurType on blurs, older ones reject it.
    const retry = effects.map((ef) => {
      if (ef.type !== 'BACKGROUND_BLUR' && ef.type !== 'LAYER_BLUR') return ef
      const copy = { ...ef }
      if ('blurType' in copy) delete copy.blurType
      else copy.blurType = 'NORMAL'
      return copy
    })
    try {
      style.effects = retry
    } catch {
      report.skipped.push(`effect style ${name}: ${e.message}`)
    }
  }
}

async function buildEffectStyles() {
  for (const theme of ['dark', 'light']) {
    const Theme = theme === 'dark' ? 'Dark' : 'Light'
    for (const [k, v] of Object.entries(TOKENS[theme])) {
      if (!k.startsWith('shadow-') || v === 'none') continue
      await upsertEffectStyle(`${Theme}/${k}`, parseShadows(v))
    }
    await upsertEffectStyle(`${Theme}/glass-blur`, [
      { type: 'BACKGROUND_BLUR', radius: px(TOKENS[theme]['glass-blur']), visible: true },
    ])
  }
  await upsertEffectStyle('Card/shadow-dark', parseShadows(TOKENS.palette['c-card-shadow']))
  await upsertEffectStyle('Card/shadow-light', parseShadows(TOKENS.palette['c-card-shadow-light']))
}

// ---------- 6. paint styles (linear gradients) ----------

function linearGradient(v) {
  const m = v.match(/^linear-gradient\((.*)\)$/)
  if (!m) return null
  const parts = splitTop(m[1])
  const angle = parseFloat(parts.shift()) * Math.PI / 180
  // CSS angle: 0deg points up, clockwise. Figma: gradient runs (0,.5)→(1,.5) in its own space.
  const dx = Math.sin(angle)
  const dy = -Math.cos(angle)
  const L = Math.abs(dx) + Math.abs(dy)
  const a = dx / L, b = dy / L
  const gradientTransform = [
    [a, b, 0.5 - 0.5 * (a + b)],
    [-b, a, 0.5 - 0.5 * (a - b)],
  ]
  const gradientStops = parts.map((s) => {
    const sm = s.match(/^(.+?)\s+([\d.]+)%$/)
    return { color: parseColor(sm[1]), position: +sm[2] / 100 }
  })
  return { type: 'GRADIENT_LINEAR', gradientTransform, gradientStops }
}

async function buildPaintStyles() {
  const sources = [
    ['Card/dark', TOKENS.palette['c-card-dark-bg']],
    ['Card/light', TOKENS.palette['c-card-light-bg']],
  ]
  for (const theme of ['dark', 'light']) {
    const Theme = theme === 'dark' ? 'Dark' : 'Light'
    for (const k of ['phone-bezel', 'phone-screen', 'card-bg']) sources.push([`${Theme}/${k}`, TOKENS[theme][k]])
    report.skipped.push(`${Theme} --bg-ambient (radial backdrop, draw once on the cover frame)`)
  }
  const existing = await figma.getLocalPaintStylesAsync()
  for (const [name, v] of sources) {
    const paint = v && linearGradient(v)
    if (!paint) {
      report.skipped.push(`paint ${name}: ${v}`)
      continue
    }
    let style = existing.find((s) => s.name === name)
    if (!style) {
      style = figma.createPaintStyle()
      style.name = name
      report.paintStyles++
    }
    style.paints = [paint]
  }
}

// ---------- 7. icon components ----------
// One component per icon (not a variant set): instance swap in Figma works
// best with plain components. Color is bound to theme fg/default, so an
// instance recolors by overriding the bound variable.

async function buildIcons(theme) {
  let page = figma.root.children.find((p) => p.name === 'Icons')
  if (!page) {
    page = figma.createPage()
    page.name = 'Icons'
  }
  await page.loadAsync()
  const color = theme['fg-default']
  const bind = (paints) =>
    paints.map((p) => (p.type === 'SOLID' && color ? figma.variables.setBoundVariableForPaint(p, 'color', color) : p))

  let x = 0
  for (const pack of ICON_PACKS) {
    let group = page.children.find((n) => n.type === 'FRAME' && n.name === pack)
    if (!group) {
      group = figma.createFrame()
      group.name = pack
      page.appendChild(group)
    }
    group.layoutMode = 'HORIZONTAL'
    group.layoutWrap = 'WRAP'
    group.primaryAxisSizingMode = 'FIXED'
    group.counterAxisSizingMode = 'AUTO'
    group.resize(24 * 8 + 16 * 7 + 48, group.height)
    group.itemSpacing = 16
    group.counterAxisSpacing = 16
    group.paddingTop = group.paddingBottom = group.paddingLeft = group.paddingRight = 24
    group.fills = []
    group.x = x
    group.y = 0
    x += group.width + 48

    for (const icon of ICONS.filter((i) => i.pack === pack)) {
      const name = `icon/${icon.name}`
      let comp = group.children.find((n) => n.type === 'COMPONENT' && n.name === name)
      if (!comp) {
        comp = figma.createComponent()
        comp.name = name
        group.appendChild(comp)
        report.icons++
      }
      comp.resizeWithoutConstraints(24, 24)
      comp.fills = []
      comp.clipsContent = false
      comp.layoutSizingHorizontal = 'FIXED'
      comp.layoutSizingVertical = 'FIXED'
      comp.description = `${pack} · 24×24, live area 20×20, stroke 1.75 outlined into one filled vector. Source: app/src/icons/paths.js`
      for (const child of [...comp.children]) child.remove()

      // One filled vector per icon: strokes are outlined and everything is
      // flattened. An instance swap carries color overrides layer by layer, so
      // a multi-layer icon would get only its first layer recolored. Outlined
      // strokes also scale with the icon the way the SVG does.
      const svg = figma.createNodeFromSvg(icon.svg)
      const parts = []
      for (const n of [...svg.findAll()]) {
        if (!('strokes' in n) || n.type === 'GROUP' || n.type === 'FRAME') continue
        const hasFill = Array.isArray(n.fills) && n.fills.length > 0
        if (n.strokes.length) {
          n.strokeCap = 'ROUND'
          n.strokeJoin = 'ROUND'
          const outline = n.outlineStroke()
          if (outline) {
            // outlineStroke() lands on the page with coordinates local to the svg frame
            const { x: ox, y: oy } = outline
            svg.appendChild(outline)
            outline.x = ox
            outline.y = oy
            parts.push(outline)
          }
        }
        if (hasFill) {
          n.strokes = []
          parts.push(n)
        } else if (n.strokes.length) n.remove()
      }
      const flat = figma.flatten(parts, svg)
      const { x: fx, y: fy } = flat
      comp.appendChild(flat)
      flat.x = fx
      flat.y = fy
      flat.name = 'Vector'
      flat.fills = bind([{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }])
      flat.strokes = []
      flat.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }
      svg.remove()
    }
  }
}

// ---------- run ----------

;(async () => {
  try {
    const palette = await buildPalette()
    const scale = await buildScale()
    const theme = await buildTheme(palette)
    await buildTextStyles(scale)
    await buildEffectStyles()
    await buildPaintStyles()
    await buildIcons(theme)
    console.log('Tenni tokens report', report)
    figma.closePlugin(
      `Tenni tokens: +${report.vars} variables, +${report.textStyles} text, ` +
        `+${report.effectStyles} effect, +${report.paintStyles} paint styles, +${report.icons} icons. ` +
        `${report.skipped.length} notes in the console.`,
    )
  } catch (e) {
    console.error(e)
    figma.closePlugin(`Tenni tokens failed: ${e.message}`)
  }
})()
