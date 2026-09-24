import { useEffect, useState } from 'react'
import {
  Screen, TabBar, Avatar, Balance, CardVisual, AssetIcon, ListRow,
  Surface, Stack, Text, Button, Section, TransactionRow, IconButton,
  Skeleton, EmptyState, Illustration, Banner, Toast,
} from '../ui/index.js'
import { TABS, USER, RATES, HOLDINGS, TOTAL, WEEK_DELTA, WEEK_GAIN, TRANSACTIONS, CARD_LAST4, txRowProps } from './data.js'
import { num } from './format.js'

/**
 * Home — balance, the card with the "Pay with" row, quick actions and
 * recent activity.
 *
 * One order of importance, top to bottom: what I have → what I pay with
 * → what I can do → what happened. The card is the one large patch of
 * brand color; everything around it is neutral. The week's change lives
 * in the balance line — a separate portfolio chart repeated the same
 * +3.84% three times on one screen, so it moved out of Home.
 *
 * Built only from system components. No screen-level CSS.
 */

const QUICK_ACTIONS = [
  { id: 'send',    icon: 'send',    label: 'Send' },
  { id: 'receive', icon: 'receive', label: 'Receive' },
  { id: 'swap',    icon: 'swap',    label: 'Swap' },
  { id: 'stake',   icon: 'stake',   label: 'Stake' },
]

/** Actions this demo doesn't build — they answer with a toast instead of doing nothing. */
const NOT_IN_DEMO = { swap: 'Swap', stake: 'Staking' }

const ETH = HOLDINGS.find((h) => h.symbol === 'eth')

/** "Pay with" — the asset a tap will spend, and the way into Pay. Sits
    right under the card and outside it: the card is plastic, this row is
    the app. The button is named and carries the terminal icon, so it
    can't be read as part of a picture. */
function PayWith({ onPay }) {
  return (
    <Surface level={1} radius="lg" pad={0} gap={0}>
      <ListRow
        leading={<AssetIcon symbol="eth" size={40} />}
        title="Pay with ETH"
        subtitle={`${num(ETH.amount)} ETH · ≈ $${num(ETH.amount * RATES.eth, 0)}`}
        trailing={<Button variant="primary" size="sm" iconLeading="pay" onClick={onPay}>Pay</Button>}
      />
    </Surface>
  )
}

function QuickActions({ loading = false, onAction }) {
  if (loading) {
    return (
      <Stack dir="row" gap={12} fillCross>
        {QUICK_ACTIONS.map((a) => (
          <Stack key={a.id} fill align="center" gap={8}>
            <Skeleton shape="circle" w={48} h={48} />
            <Skeleton shape="line" w={48} h={12} />
          </Stack>
        ))}
      </Stack>
    )
  }

  return (
    <Stack dir="row" gap={12} fillCross>
      {QUICK_ACTIONS.map((a) => (
        <Stack key={a.id} fill align="center" gap={8}>
          <IconButton variant="solid" size={48} icon={a.icon} aria-label={a.label} onClick={() => onAction?.(a.id)} />
          <Text variant="bodySm" tone="dim">{a.label}</Text>
        </Stack>
      ))}
    </Stack>
  )
}

/**
 * state: default | loading | empty | error — set from outside (the catalog
 * shows all four side by side) or, when omitted, the screen plays a real
 * cold start: 900 ms of skeletons under every block, then content.
 *
 * onNavigate(id) — wires the screen into the clickable prototype:
 * 'send' | 'receive' | 'pay' | 'activity' | 'more'.
 */
export function HomeScreen({ state: stateProp, theme = 'dark', scaled = false, onNavigate }) {
  const [masked, setMasked] = useState(false)
  const [bootState, setBootState] = useState('loading')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (stateProp) return
    const t = setTimeout(() => setBootState('default'), 900)
    return () => clearTimeout(t)
  }, [stateProp])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 2200)
    return () => clearTimeout(t)
  }, [notice])

  const state = stateProp || bootState

  function handleAction(id) {
    if (NOT_IN_DEMO[id]) setNotice(`${NOT_IN_DEMO[id]} isn't part of this demo yet`)
    else onNavigate?.(id)
  }

  const tabBar = (
    <TabBar items={TABS} active="home" onChange={(id) => id !== 'home' && onNavigate?.(id)} />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      tabBar={tabBar}
      contentPadding={16}
    >
      <Stack gap={24}>
        {state === 'error' && (
          <Banner tone="danger" body="Couldn't update your balance" action actionLabel="Retry" />
        )}

        {notice && <Toast tone="info" message={notice} />}

        {/* --- Header: balance on the left, avatar on the right --- */}
        <Stack dir="row" justify="between" align="start" gap={12}>
          {state === 'loading'
            ? <Balance value={0} loading align="start" />
            : <Balance
                align="start"
                value={state === 'empty' ? 0 : TOTAL}
                masked={masked}
                onToggleMask={setMasked}
                delta={state === 'empty' ? undefined : WEEK_DELTA}
                gain={state === 'empty' ? undefined : WEEK_GAIN}
                period={state === 'empty' ? undefined : '7 days'}
              />}
          <Avatar type="initials" initials={USER.initials} size={40} />
        </Stack>

        {/* --- Card + what a tap pays with --- */}
        {state === 'loading' ? (
          <Stack gap={8}>
            <Skeleton shape="rect" h={224} radius="var(--r-xl)" />
            <Skeleton shape="rect" h={68} radius="var(--r-lg)" />
          </Stack>
        ) : state === 'empty' ? (
          <Surface level={1} radius="xl" pad={0} gap={0}>
            <EmptyState
              illustration={<Illustration name="no-cards" size={104} />}
              title="No cards yet"
              body="Link a Visa or Mastercard to pay with crypto anywhere cards are accepted"
              action
              actionLabel="Link a card"
            />
          </Surface>
        ) : (
          <Stack gap={8}>
            <CardVisual skin="ball" kind="debit" holder="" last4={CARD_LAST4} />
            <PayWith onPay={() => onNavigate?.('pay')} />
          </Stack>
        )}

        <QuickActions loading={state === 'loading'} onAction={handleAction} />

        {/* --- Activity --- */}
        <Section title="Activity" action actionLabel="See all" onAction={() => onNavigate?.('activity')}>
          {state === 'loading' && (
            <Surface level={1} radius="lg" pad={16} gap={16}>
              {[0, 1, 2].map((i) => (
                <Stack key={i} dir="row" gap={12} align="center">
                  <Skeleton shape="circle" w={40} h={40} />
                  <Stack gap={6} fill>
                    <Skeleton shape="line" w={150} h={13} />
                    <Skeleton shape="line" w={96} h={11} />
                  </Stack>
                </Stack>
              ))}
            </Surface>
          )}

          {state === 'empty' && (
            <Surface level={1} radius="lg" pad={0} gap={0}>
              <EmptyState
                illustration={<Illustration name="empty-activity" size={96} />}
                title="No transactions yet"
                body="Transfers and purchases will show up here"
              />
            </Surface>
          )}

          {(state === 'default' || state === 'error') && (
            <Surface level={1} radius="lg" pad={0} gap={0}>
              {TRANSACTIONS.slice(0, 3).map((t, i) => (
                <TransactionRow
                  key={t.id}
                  {...txRowProps(t, { withDay: true })}
                  divider={i < 2}
                  onClick={() => onNavigate?.('activity')}
                />
              ))}
            </Surface>
          )}
        </Section>
      </Stack>
    </Screen>
  )
}
