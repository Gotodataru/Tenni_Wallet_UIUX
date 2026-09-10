import { useEffect, useState } from 'react'
import {
  Screen, AppBar, IconButton, Stack, Text, Surface, Segmented, AssetIcon,
  Button, Banner, QRBlock, Toast,
} from '../ui/index.js'
import { group } from './format.js'

/**
 * Receive — asset → QR → full address → copy / share
 *
 * The address is what the user hands to someone else, so it is shown in
 * full (grouped by 4, see format.js) in one place only: the QR caption is
 * switched off to avoid a second, truncated copy of the same string.
 * The copy confirmation sits in the flow above the address card and fades
 * on its own — an overlay would cover the text the user needs to read.
 */

const ASSETS = [
  { symbol: 'btc',  name: 'Bitcoin',  network: 'Bitcoin',          address: 'bc1q7k9m3xrt5jgc0y8h2wzn4vad6esq7unpx3fy2m' },
  { symbol: 'eth',  name: 'Ethereum', network: 'Ethereum (ERC-20)', address: '0x4a9F2c81eB35D6704C918B3aE27F0521dC6b8e93' },
  { symbol: 'usdt', name: 'Tether',   network: 'Tron (TRC-20)',     address: 'TXn8Rq2wYcVh5MpKz9LsD3fGa7uJb1EqNe' },
]

const STATUS_MESSAGE = {
  copied: 'Address copied',
  shared: 'Ready to share',
}

function AddressCard({ asset, onCopy }) {
  return (
    <Surface level={1} radius="lg" pad={16} gap={12}>
      <Stack dir="row" gap={8} align="center">
        <AssetIcon symbol={asset.symbol} size={24} />
        <Text variant="label" tone="dim" fill>Your {asset.name} address</Text>
        <IconButton variant="ghost" size={32} icon="copy" onClick={onCopy} aria-label="Copy address" />
      </Stack>
      <Text variant="mono">{group(asset.address)}</Text>
    </Surface>
  )
}

export function ReceiveScreen({ asset: assetProp, theme = 'dark', scaled = false, onExit }) {
  const [innerIndex, setInnerIndex] = useState(0)
  const [status, setStatus] = useState('idle')

  const index = assetProp ? ASSETS.findIndex((a) => a.symbol === assetProp) : innerIndex
  const asset = ASSETS[index < 0 ? 0 : index]

  useEffect(() => {
    if (status === 'idle') return
    const t = setTimeout(() => setStatus('idle'), 1800)
    return () => clearTimeout(t)
  }, [status])

  async function handleCopy() {
    try { await navigator.clipboard?.writeText(asset.address) } catch { /* clipboard blocked — the toast still confirms the action */ }
    setStatus('copied')
  }

  async function handleShare() {
    try {
      if (navigator.share) { await navigator.share({ text: asset.address }); return }
    } catch { /* share sheet dismissed */ return }
    setStatus('shared')
  }

  const appBar = (
    <AppBar
      layout="title-center"
      title="Receive"
      leading={<IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={onExit} />}
    />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
    >
      <Stack gap={20} fill>
        <Segmented
          items={ASSETS.map((a) => a.name)}
          active={index < 0 ? 0 : index}
          onChange={(i) => { if (!assetProp) setInnerIndex(i) }}
        />

        <Stack align="center">
          <QRBlock value={asset.address} size={200} withLogo logo={<AssetIcon symbol={asset.symbol} size={32} />} showValue={false} />
        </Stack>

        {status !== 'idle' && <Toast tone="success" message={STATUS_MESSAGE[status]} />}

        <AddressCard asset={asset} onCopy={handleCopy} />

        <Banner
          tone="warning"
          title={`${asset.network} network only`}
          body="Funds sent from another network won't arrive and can't be recovered."
        />

        <Stack fill justify="end">
          <Button variant="primary" size="xl" fullWidth iconLeading="share" onClick={handleShare}>
            Share address
          </Button>
        </Stack>
      </Stack>
    </Screen>
  )
}

export { ASSETS as RECEIVE_ASSETS }
