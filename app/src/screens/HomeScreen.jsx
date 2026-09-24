import { useEffect, useState } from 'react'
import {
  Screen, TabBar, Avatar, Balance, CardVisual, AssetIcon, ListRow,
  Surface, Stack, Button, Section, TransactionRow, IconButton, Chip,
  Skeleton, EmptyState, Illustration, Banner, BottomSheet,
} from '../ui/index.js'
import { Icon } from '../icons/Icon.jsx'
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

/** Actions under More — this demo doesn't build them, and the sheet says so. */
const MORE_ACTIONS = [
  { id: 'swap',  icon: 'swap',  title: 'Swap',  subtitle: 'Trade one coin for another' },
  { id: 'stake', icon: 'stake', title: 'Stake', subtitle: 'Earn on ETH and SOL' },
]

const ETH = HOLDINGS.find((h) => h.symbol === 'eth')

/** "Pay with" — the asset a tap will spend, and the way into Pay. Sits
    right under the card and outside it: the card is plastic, this row is
    the app. The button is named and carries the terminal icon, so it
    can't be read as part of a picture, and it is lg (48): the main action
    of the screen gets a full-size touch target, not a 32px chip. */
function PayWith({ onPay }) {
  return (
    <Surface level={1} radius="lg" pad={0} gap={0}>
      <ListRow
        leading={<AssetIcon symbol="eth" size={40} />}
        title="Pay with ETH"
        subtitle={`${num(ETH.amount)} ETH · ≈ $${num(ETH.amount * RATES.eth, 0)}`}
        trailing={<Button variant="primary" size="lg" iconLeading="pay" onClick={onPay}>Pay</Button>}
      />
    </Surface>
  )
}

/** Quick actions with a hierarchy: the two everyday actions are wide
    tiles, the rest folds into More. Four equal circles said every action
    matters the same — they don't. Tiles use the card's corner (rounded). */
function QuickActions({ loading = false, onAction, onMore }) {
  if (loading) {
    return (
      <Stack dir="row" gap={8} fillCross>
        <Stack fill><Skeleton shape="rect" h={48} radius="var(--r-lg)" /></Stack>
        <Stack fill><Skeleton shape="rect" h={48} radius="var(--r-lg)" /></Stack>
        <Skeleton shape="rect" w={48} h={48} radius="var(--r-lg)" />
      </Stack>
    )
  }

  return (
    <Stack dir="row" gap={8} fillCross>
      <Stack fill>
        <Button variant="secondary" size="lg" shape="rounded" fullWidth iconLeading="send" onClick={() => onAction?.('send')}>Send</Button>
      </Stack>
      <Stack fill>
        <Button variant="secondary" size="lg" shape="rounded" fullWidth iconLeading="receive" onClick={() => onAction?.('receive')}>Receive</Button>
      </Stack>
      <IconButton variant="solid" size={48} shape="rounded" icon="more" aria-label="More actions: Swap, Stake" onClick={onMore} />
    </Stack>
  )
}

/** The More sheet. Swap and Stake are marked "Soon" — honest about the demo,
    instead of a tap that does nothing or a toast that flashes by. */
function MoreSheet({ onClose }) {
  return (
    <BottomSheet title="More actions" onClose={onClose}>
      <Surface level={1} radius="lg" pad={0} gap={0}>
        {MORE_ACTIONS.map((a, i) => (
          <ListRow
            key={a.id}
            leading={<Icon name={a.icon} size={24} tone="dim" />}
            title={a.title}
            subtitle={a.subtitle}
            trailing={<Chip variant="neutral" size="sm">Soon</Chip>}
            divider={i < MORE_ACTIONS.length - 1}
          />
        ))}
      </Surface>
    </BottomSheet>
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
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    if (stateProp) return
    const t = setTimeout(() => setBootState('default'), 900)
    return () => clearTimeout(t)
  }, [stateProp])

  const state = stateProp || bootState

  const tabBar = (
    <TabBar items={TABS} active="home" onChange={(id) => id !== 'home' && onNavigate?.(id)} />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      tabBar={tabBar}
      contentPadding={16}
      overlay={moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}
      onOverlayClose={() => setMoreOpen(false)}
    >
      <Stack gap={24}>
        {state === 'error' && (
          <Banner tone="danger" body="Couldn't update your balance" action actionLabel="Retry" />
        )}

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
          <Avatar type="image" src={USER.photo} size={40} />
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

        <QuickActions loading={state === 'loading'} onAction={(id) => onNavigate?.(id)} onMore={() => setMoreOpen(true)} />

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
