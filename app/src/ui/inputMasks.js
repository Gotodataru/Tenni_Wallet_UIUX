/**
 * L2 · Input masks
 *
 * Pure functions: raw <input> string → formatted string. No React or
 * DOM here — test them by calling with different inputs, no rendering.
 */

/** Card number: groups of 4, at most 16 digits (19 characters with spaces). */
export function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})(?=.)/g, '$1 ')
}

/** Expiry: MM/YY, the slash is inserted after the second digit. */
export function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

/** CVC: digits only, at most 4 (Amex). Masked by type="password" in Input. */
export function formatCvc(raw) {
  return raw.replace(/\D/g, '').slice(0, 4)
}

/**
 * Amount (en-US): comma thousands, one decimal point, up to two decimals.
 * Commas typed by the user are treated as grouping and dropped; leading
 * zeros are removed except a single "0".
 */
export function formatAmount(raw) {
  const cleaned = raw.replace(/[^\d.]/g, '')

  const sepIndex = cleaned.indexOf('.')
  let intPart = sepIndex === -1 ? cleaned : cleaned.slice(0, sepIndex)
  const hasSep = sepIndex !== -1
  const fracPart = hasSep ? cleaned.slice(sepIndex + 1).replace(/\./g, '').slice(0, 2) : ''

  intPart = intPart.replace(/^0+(?=\d)/, '')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return hasSep ? `${grouped}.${fracPart}` : grouped
}

/** Detect the card network from the first digits — for the Input icon. */
export function detectCardBrand(raw) {
  const digits = raw.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
  return null
}

const FORMATTERS = {
  card: formatCardNumber,
  expiry: formatExpiry,
  cvc: formatCvc,
  amount: formatAmount,
}

/** Dispatch by Input type. Types without a mask (text, address, search, pin) return the string as is. */
export function formatByType(type, raw) {
  return FORMATTERS[type] ? FORMATTERS[type](raw) : raw
}
