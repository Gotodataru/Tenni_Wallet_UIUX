/**
 * Shared formatting and validation for the screens.
 *
 * group() — a long address is one token without spaces and never wraps
 * on its own. Splitting it into groups of 4 with plain spaces lets the
 * browser wrap it while every character stays on screen — the same
 * pattern hardware wallets use on their confirm screens. It is not
 * truncation: the user can still compare the address character by character.
 */
export const group = (value) => value?.match(/.{1,4}/g)?.join(' ') ?? value

/**
 * shortHash — truncation is only acceptable for strings the user never
 * verifies by hand: a transaction hash on a receipt, not a recipient
 * address or a key.
 */
export const shortHash = (value, head = 6, tail = 6) => `${value.slice(0, head)}…${value.slice(-tail)}`

/**
 * num — the same number format `Amount` renders (en-US: comma thousands,
 * dot decimals). Any number a screen prints itself goes through here, so
 * one value never appears in two formats on the same screen.
 */
export const num = (value, precision = 2) =>
  value.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })

/** Parse a keypad string ("1,204.5" or "0.05") into a number. */
export const parseAmount = (value) => Number(String(value).replace(/,/g, '')) || 0

/**
 * Keypad input with guards: one decimal point, at most `decimals` digits
 * after it, at most `maxInt` digits before it. Returns the new string.
 */
export function typeKey(current, key, { decimals = 2, maxInt = 7 } = {}) {
  const [int, frac] = current.split('.')
  if (key === '.') return current.includes('.') ? current : `${current || '0'}.`
  if (frac !== undefined) return frac.length >= decimals ? current : current + key
  if (current === '0') return key
  return int.length >= maxInt ? current : current + key
}

export const backspace = (current) => (current.length <= 1 ? '0' : current.slice(0, -1))

/**
 * What kind of address the user typed. Format checks only (no checksum) —
 * enough to catch the two mistakes that lose money in practice: a typo
 * and a wrong-network address.
 */
export function detectAddress(value) {
  const v = value.trim()
  if (!v) return 'empty'
  if (/^bc1[02-9ac-hj-np-z]{11,71}$/.test(v) || /^[13][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(v)) return 'btc'
  if (/^0x[0-9a-fA-F]{40}$/.test(v)) return 'eth'
  if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(v)) return 'tron'
  return 'invalid'
}

/* ── Sign-up and identity checks ─────────────────────────────────
   Each returns an error sentence or null. The sentence says what to do,
   not only what is wrong: "Use Latin letters…", not "Invalid name". */

/** Format only — whether the inbox exists is the code step's job. */
export function emailError(value) {
  const v = value.trim()
  if (!v) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Check the email — it should look like name@example.com'
  return null
}

/**
 * A passcode guards money, so the obvious ones are refused: one digit
 * repeated (111111), a run up or down (123456, 987654) and two digits
 * alternating (121212). The first thing a thief tries.
 */
export function passcodeWeakness(code) {
  if (/^(\d)\1+$/.test(code)) return 'One digit repeated is the first thing anyone would try'
  const steps = [...code].slice(1).map((d, i) => Number(d) - Number(code[i]))
  if (steps.every((s) => s === 1) || steps.every((s) => s === -1)) return 'A run of digits in order is too easy to guess'
  if (/^(\d\d)\1+$/.test(code)) return 'A repeating pattern is too easy to guess'
  return null
}

/** Names as printed on an ID: Latin letters, spaces, hyphens, apostrophes. */
export function nameError(value, field = 'name') {
  const v = value.trim()
  if (!v) return `Enter your ${field}`
  if (!/^[A-Za-z][A-Za-z' -]*$/.test(v)) return 'Use Latin letters, as printed in your ID'
  if (v.length < 2) return `Enter your full ${field}`
  return null
}

/** Date typing mask: digits → MM/DD/YYYY (en-US). */
export function formatDate(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/** Age in full years on `today`, or null when the date isn't a real one. */
export function ageOn(value, today) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!m) return null
  const [month, day, year] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(year, month - 1, day)
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null
  let age = today.getFullYear() - year
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age -= 1
  return age
}

/**
 * A card account is for adults: under 18 is refused with the reason,
 * a future or impossible date is a typo.
 */
export function birthDateError(value, today = new Date()) {
  if (!value) return 'Enter your date of birth'
  if (value.length < 10) return 'Use the format MM/DD/YYYY'
  const age = ageOn(value, today)
  if (age === null || age > 120) return 'This date doesn’t exist — check the month and day'
  if (age < 0) return 'This date is in the future'
  if (age < 18) return 'You need to be 18 or older to get a card'
  return null
}

export function addressError(value) {
  const v = value.trim()
  if (!v) return 'Enter your home address'
  if (v.length < 8 || !/\d/.test(v) || !/[A-Za-z]/.test(v)) return 'Add the street, building number and city'
  return null
}

/** mm:ss for countdowns (resend a code, a lockout). */
export const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
