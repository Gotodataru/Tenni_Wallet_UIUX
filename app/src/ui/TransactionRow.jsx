import { Icon } from '../icons/Icon.jsx'
import { ListRow } from './ListRow.jsx'
import { Amount } from './Amount.jsx'
import './TransactionRow.css'

/**
 * L3 · TransactionRow — a ListRow preset, not a copy of its markup
 *
 * Wraps ListRow: leading is a small circle with the transaction-type
 * icon (its own element, not Avatar — it means "transaction status",
 * not "person/asset"), trailing is Amount. The row layout (height,
 * padding, min-width: 0 on the body) comes from ListRow and isn't
 * duplicated here.
 *
 * type sets the icon, tone and sign. Outgoing money is neutral —
 * spending is everyday, not an alarm — incoming money is "up", and
 * clay is reserved for failures. Each can be overridden by a prop.
 */
const TYPE_META = {
  sent:     { icon: 'send',    tone: 'muted',   sign: 'minus' },
  received: { icon: 'receive', tone: 'up',      sign: 'plus' },
  paid:     { icon: 'pay',     tone: 'muted',   sign: 'minus' },
  swapped:  { icon: 'swap',    tone: 'neutral', sign: 'none' },
  staked:   { icon: 'stake',   tone: 'neutral', sign: 'none' },
}

const STATE_META = {
  pending: { meta: 'Pending' },
  failed:  { meta: 'Failed' },
}

export function TransactionRow({
  type = 'sent',
  title,
  subtitle,
  value,
  currency = '$',
  unit,
  precision = 2,
  sign,
  tone,
  state,
  divider = false,
  size = 'md',
  onClick,
  className = '',
}) {
  const typeMeta = TYPE_META[type] || TYPE_META.sent
  const isPending = state === 'pending'
  const isFailed = state === 'failed'

  // pending/failed override the icon and tone — the transaction is on
  // hold (pending) or didn't happen (failed), the color mustn't lie
  const leadingIcon = isPending ? 'spinner' : isFailed ? 'x-circle' : typeMeta.icon
  const leadingTone = isFailed ? 'danger' : isPending ? 'muted' : typeMeta.tone
  // Spending is everyday, not an alarm: outgoing amounts stay neutral,
  // only incoming money gets the "up" color. Clay is reserved for failures.
  const amountTone = isFailed ? 'down' : isPending ? 'neutral' : (tone || (typeMeta.tone === 'up' ? 'up' : 'neutral'))
  const amountSign = isFailed || isPending ? 'none' : (sign || typeMeta.sign)

  // ListRow doesn't know about pending/failed — those are DATA states
  // of the transaction, not ROW states (pressed/selected/disabled pass
  // through via state when needed)
  const rowState = state === 'pending' || state === 'failed' ? undefined : state

  return (
    <ListRow
      size={size}
      divider={divider}
      state={rowState}
      onClick={onClick}
      className={className}
      title={title}
      subtitle={subtitle}
      meta={STATE_META[state]?.meta}
      leading={
        <span className={`TransactionRow__icon TransactionRow__icon--${leadingTone}`}>
          <Icon name={leadingIcon} size={18} tone="inherit" className={isPending ? 'Icon--spin' : undefined} />
        </span>
      }
      trailing={
        <Amount
          value={value}
          currency={currency}
          suffix={unit ? ` ${unit}` : ''}
          precision={precision}
          sign={amountSign}
          tone={amountTone}
          size="sm"
        />
      }
    />
  )
}
