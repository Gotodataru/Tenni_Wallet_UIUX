import { useMemo, useState } from 'react'
import {
  Screen, AppBar, TabBar, Stack, Text, Surface, Input, Chip,
  TransactionRow, EmptyState, Illustration,
} from '../ui/index.js'
import { TABS, TRANSACTIONS, txRowProps } from './data.js'

/**
 * Activity — search + type filter + grouping by day.
 *
 * Filter is a row of `Chip`s, not `Segmented`: there are six options and
 * Segmented is limited to 2–4. The list is newest first, inside each day too.
 */

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'sent',     label: 'Sent' },
  { id: 'received', label: 'Received' },
  { id: 'paid',     label: 'Payments' },
  { id: 'swapped',  label: 'Swaps' },
  { id: 'staked',   label: 'Staking' },
]

function groupByDay(rows) {
  const map = new Map()
  for (const t of rows) {
    if (!map.has(t.day)) map.set(t.day, [])
    map.get(t.day).push(t)
  }
  return [...map.entries()]
}

export function ActivityScreen({ filter: filterProp, theme = 'dark', scaled = false, onNavigate }) {
  const [innerFilter, setInnerFilter] = useState('all')
  const [query, setQuery] = useState('')
  const filter = filterProp || innerFilter

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = TRANSACTIONS.filter((t) => {
      const matchesFilter = filter === 'all' || t.type === filter
      const matchesQuery = !q || t.title.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
    return groupByDay(filtered)
  }, [filter, query])

  const tabBar = (
    <TabBar items={TABS} active="activity" onChange={(id) => id !== 'activity' && onNavigate?.(id)} />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={<AppBar title="Activity" />}
      tabBar={tabBar}
      contentPadding={16}
    >
      <Stack gap={16} fill>
        <Input
          type="search"
          placeholder="Search transactions"
          value={query}
          onChange={setQuery}
          iconLeading="search"
        />

        {/* gap 12: 32px chips + 12 = 44, so the touch targets don't overlap */}
        <Stack dir="row" gap={12} wrap>
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              variant="outline"
              selected={filter === f.id}
              onClick={() => { if (!filterProp) setInnerFilter(f.id) }}
            >
              {f.label}
            </Chip>
          ))}
        </Stack>

        {groups.length === 0 ? (
          <Stack fill justify="center">
            <EmptyState
              illustration={<Illustration name="no-results" size={104} />}
              title="Nothing found"
              body="Try another filter or change your search"
            />
          </Stack>
        ) : (
          groups.map(([day, rows]) => (
            <Stack key={day} gap={8}>
              <Text variant="label" tone="dim">{day}</Text>
              <Surface level={1} radius="lg" pad={0} gap={0}>
                {rows.map((t, i) => (
                  <TransactionRow key={t.id} {...txRowProps(t)} divider={i < rows.length - 1} />
                ))}
              </Surface>
            </Stack>
          ))
        )}
      </Stack>
    </Screen>
  )
}

export { FILTERS as ACTIVITY_FILTERS }
