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
