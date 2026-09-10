import { useEffect, useState } from 'react'
import {
  Screen, TabBar, Avatar, IconButton, Balance, Layer, CardVisual,
  Surface, Stack, Text, Chip, Button, Section, TransactionRow, Amount,
  Skeleton, EmptyState, Illustration, Banner, Sparkline, Toast,
} from '../ui/index.js'
import { TABS, USER, RATES, HOLDINGS, TOTAL, WEEK_DELTA, WEEK_GAIN, TREND, TRANSACTIONS, CARD_LAST4, txRowProps } from './data.js'
import { num } from './format.js'

/**
 * Home — balance, the card with the "Pay with" composer, quick actions,
 * portfolio and recent activity.
 *
 * Built only from system components: the card + glass fan is `Layer`
 * (anchor="stack"), the composer is `Surface glass`. No screen-level CSS.
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

/** Glass "Pay with" panel — the front layer of the card fan. */
function PayComposer({ onPay }) {
  return (
    <Surface glass fill radius="lg" pad={16} gap={0}>
      <Stack fill justify="between" gap={12}>
        <Stack dir="row" justify="between" align="center">
          <Text variant="caption" tone="dim">Pay with</Text>
          <IconButton variant="ghost" size={32} icon="more" aria-label="Choose asset" />
        </Stack>

        <Stack dir="row" justify="between" align="end">
          <Stack dir="row" gap={8} align="baseline">
            <Text variant="h2" numeric>{num(ETH.amount)}</Text>
            <Chip variant="neutral" size="sm">{ETH.ticker}</Chip>
          </Stack>
          <Text variant="caption" tone="dim" numeric>≈ ${num(ETH.amount * RATES.eth, 0)}</Text>
        </Stack>

        <Stack dir="row" justify="between" align="center">
          <Text variant="caption" tone="dim">Used when you tap</Text>
          <Button variant="primary" size="sm" iconTrailing="arrow-right" onClick={onPay}>Pay</Button>
        </Stack>
      </Stack>
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
            <Skeleton shape="line" w={48} h={11} />
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
          <Text variant="caption" tone="dim">{a.label}</Text>
        </Stack>
      ))}
    </Stack>
  )
}

function PortfolioSkeleton() {
  return (
    <Section title="Portfolio">
      <Surface level={1} radius="lg" pad={16} gap={12}>
        <Stack dir="row" justify="between" align="center">
          <Stack gap={6}>
            <Skeleton shape="line" w={64} h={11} />
            <Skeleton shape="line" w={110} h={22} />
          </Stack>
          <Skeleton shape="line" w={56} h={24} radius="var(--r-full)" />
        </Stack>
        <Skeleton shape="rect" h={64} />
      </Surface>
    </Section>
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
      <Stack gap={20}>
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
                period={state === 'empty' ? undefined : '7 days'}
              />}
          <Avatar type="initials" initials={USER.initials} size={48} ring />
        </Stack>

        {/* --- Card + glass fan --- */}
        {state === 'loading' ? (
          <Layer anchor="stack" offset="64 24" over={<Skeleton shape="rect" radius="var(--r-lg)" />}>
            <Skeleton shape="rect" h={200} radius="var(--r-xl)" />
          </Layer>
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
          <Layer anchor="stack" offset="64 24" over={<PayComposer onPay={() => onNavigate?.('pay')} />}>
            <CardVisual skin="auto" kind="debit" holder={USER.holder} last4={CARD_LAST4} />
          </Layer>
        )}

        <QuickActions loading={state === 'loading'} onAction={handleAction} />

        {/* --- Portfolio --- */}
        {state === 'loading' && <PortfolioSkeleton />}
        {state === 'default' && (
          <Section title="Portfolio" action actionLabel="Details">
            <Surface level={1} radius="lg" pad={16} gap={12}>
              <Stack dir="row" justify="between" align="center">
                <Stack gap={2}>
                  <Text variant="caption" tone="dim">Last 7 days</Text>
                  <Amount value={WEEK_GAIN} sign="plus" showArrow size="lg" />
                </Stack>
                <Chip variant="success" size="sm">+{num(WEEK_DELTA)}%</Chip>
              </Stack>
              <Sparkline data={TREND} tone="up" showFill />
            </Surface>
          </Section>
        )}

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
