import ninaRoss from '../assets/people/nina-ross.webp'
import leoPark from '../assets/people/leo-park.webp'
import samOrtiz from '../assets/people/sam-ortiz.webp'
/**
 * Demo data shared by every screen, so numbers reconcile across the
 * prototype: the three holdings add up to the total on Home, the weekly
 * gain matches the percentage, and the activity feed is the same list
 * on Home and on Activity.
 */

/** Bottom navigation shared by the tab screens (Home, Activity, Settings). */
export const TABS = [
  { id: 'home',     icon: 'home',  label: 'Home' },
  { id: 'pay',      icon: 'pay',   label: 'Pay' },
  { id: 'activity', icon: 'clock', label: 'Activity' },
  { id: 'more',     icon: 'more',  label: 'More' },
]

/* Portraits: Unsplash, under the Unsplash License — see /CREDITS.md.
   The names are fictional; the people pictured aren't connected to the project. */

export const PHOTOS = { 'Nina Ross': ninaRoss, 'Leo Park': leoPark, 'Sam Ortiz': samOrtiz }

export const USER = { name: 'Nina Ross', email: 'nina.ross@example.com', initials: 'NR', holder: 'NINA ROSS', photo: ninaRoss }

export const RATES = { eth: 3984.2, btc: 61200, usdt: 1 }

export const HOLDINGS = [
  { symbol: 'eth',  name: 'Ethereum', ticker: 'ETH',  amount: 2.04,    precision: 2 },
  { symbol: 'usdt', name: 'Tether',   ticker: 'USDT', amount: 1249.7,  precision: 2 },
  { symbol: 'btc',  name: 'Bitcoin',  ticker: 'BTC',  amount: 0.0485,  precision: 4 },
]

export const TOTAL = HOLDINGS.reduce((sum, h) => sum + h.amount * RATES[h.symbol], 0)   // 12,345.67
export const WEEK_DELTA = 3.84                                                            // %
export const WEEK_GAIN = TOTAL - TOTAL / (1 + WEEK_DELTA / 100)                           // 456.54

/** Balance over the last 7 days, ending at TOTAL. */
export const TREND = [11889, 11952, 11918, 12031, 11994, 12102, 12168, 12121, 12236, 12297, 12264, TOTAL]

/** Newest first — inside a day as well as across days. */
export const TRANSACTIONS = [
  { id: 1, day: 'Today',     time: '11:47', type: 'received', title: 'From exchange', value: 120 },
  { id: 2, day: 'Today',     time: '10:30', type: 'sent',     title: 'Leo Park',      value: 0.005, unit: 'BTC', precision: 3 },
  { id: 3, day: 'Today',     time: '09:12', type: 'paid',     title: 'Starbucks',     value: 4.8, card: true, category: 'coffee' },
  { id: 4, day: 'Yesterday', time: '20:03', type: 'paid',     title: 'Uber',          value: 12.4, card: true, state: 'pending', category: 'car' },
  { id: 5, day: 'Yesterday', time: '18:45', type: 'swapped',  title: 'ETH → USDT',    value: 250 },
  { id: 6, day: 'Sep 5',     time: '14:22', type: 'sent',     title: 'Sam Ortiz',     value: 0.02, unit: 'ETH', precision: 3, state: 'failed' },
  { id: 7, day: 'Sep 5',     time: '09:00', type: 'received', title: 'Salary',        value: 1800, category: 'briefcase' },
  { id: 8, day: 'Sep 3',     time: '12:00', type: 'staked',   title: 'ETH staking',   value: 0.5, unit: 'ETH', precision: 3 },
  { id: 9, day: 'Sep 3',     time: '08:15', type: 'paid',     title: 'Netflix',       value: 9.99, card: true, category: 'tv' },
]

export const CARD_LAST4 = '4291'
export const CARD_EXPIRY = '12/29'

/**
 * The account the prototype is signed in to: the demo user, until the
 * visitor signs up with their own email and puts their name through the
 * identity check. The photo belongs to the demo user only; anyone else
 * gets initials.
 */
export function makeUser({ name, email }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return { name, email, initials, holder: name.toUpperCase(), photo: name === USER.name ? USER.photo : undefined }
}

/* Sign-up and unlock: the demo "inbox" shows this code, and the demo
   account opens with this passcode until the visitor creates their own. */
export const DEMO_CODE = '246810'
export const DEMO_PASSCODE = '258046'

/** The prototype says which passcode opens it — unless the visitor made their own. */
export const passcodeHint = (passcode) =>
  passcode === DEMO_PASSCODE ? `Demo passcode: ${DEMO_PASSCODE}` : 'The one you created at sign-up'

/** Props for TransactionRow from one feed item. */
export function txRowProps(t, { withDay = false } = {}) {
  const when = withDay ? `${t.day} · ${t.time}` : t.time
  return {
    type: t.type,
    title: t.title,
    subtitle: t.card ? `${when} · ••${CARD_LAST4}` : when,
    value: t.value,
    currency: t.unit ? '' : '$',
    unit: t.unit,
    precision: t.precision ?? 2,
    state: t.state,
    category: t.category,
    photo: PHOTOS[t.title],
  }
}
