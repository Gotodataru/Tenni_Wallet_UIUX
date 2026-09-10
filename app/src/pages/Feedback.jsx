import { useState } from 'react'
import {
  Toast, Banner, Modal, BottomSheet, EmptyState, LockOverlay,
  Illustration, ILLUSTRATION_NAMES,
  Stack, Text, Button,
} from '../ui/index.js'
import { Section, Spec, Cell } from './parts.jsx'

const TONES = ['info', 'success', 'warning', 'danger']

function ToastSection() {
  return (
    <Section title="Toast" hint="row · W=fill H=hug · pad 12/16 · gap 12 · radius lg. The card only — position, stacking and the timer belong to the screen.">
      <Spec title="Tones" column>
        {TONES.map((tone) => (
          <Toast key={tone} tone={tone} message={`A ${tone} message`} />
        ))}
      </Spec>
      <Spec title="With an action and dismiss" column>
        <Toast tone="danger" message="Couldn't send the transaction" action actionLabel="Retry" dismissible />
        <Toast tone="success" message="Transfer sent" dismissible />
      </Spec>
    </Section>
  )
}

function BannerSection() {
  return (
    <Section title="Banner" hint="row · W=fill H=hug · pad 12/16 · gap 8. Lives in the screen flow — “No connection”, “Not enough funds”, “The rate changed”.">
      <Spec title="Tones × title" column>
        {TONES.map((tone) => (
          <Banner key={tone} tone={tone} title="Banner title" body="Supporting text under the title, may run longer than one line." />
        ))}
      </Spec>
      <Spec title="No title, with an action" column>
        <Banner tone="warning" body="The rate moved 2.4% since you opened this screen" action actionLabel="Update rate" />
        <Banner tone="danger" body="Not enough funds for this transfer" action actionLabel="Top up" />
      </Spec>
    </Section>
  )
}

function ModalSection() {
  const [open, setOpen] = useState(false)

  return (
    <Section title="Modal" hint="column · W=fixed(320) H=hug · pad 24 · gap 16 · radius xl. The component is the panel only; the scrim belongs to the scene.">
      <Spec title="1 / 2 actions, tone" column>
        <Stack dir="row" gap={24} wrap>
          <Modal icon="shield" title="Turn on Face ID?" body="Faster sign-in and payment confirmation." actions={[{ label: 'Turn on' }, { label: 'Later', variant: 'secondary' }]} />
          <Modal tone="danger" icon="alert-triangle" title="Delete this wallet?" body="This can't be undone. Without your recovery phrase you'll lose access to the funds." actions={[{ label: 'Delete', variant: 'danger' }, { label: 'Cancel', variant: 'secondary' }]} />
        </Stack>
        <Modal icon="check-circle" title="Done" body="Your transfer is on its way and will appear in Activity in a few seconds." actions={[{ label: 'Got it' }]} />
      </Spec>

      <Spec title="Live example — with a scrim" contract="the scrim is demo scaffolding, not part of Modal" column>
        <Button variant="secondary" size="md" onClick={() => setOpen(true)}>Open modal</Button>
        {open && (
          <div className="Feedback__scrimBox">
            <Modal
              tone="danger"
              icon="alert-triangle"
              title="Unlink this card?"
              body="Debit card •••• 4291 will no longer be available for payments."
              actions={[
                { label: 'Unlink', variant: 'danger', onClick: () => setOpen(false) },
                { label: 'Cancel', variant: 'secondary', onClick: () => setOpen(false) },
              ]}
            />
          </div>
        )}
      </Spec>
    </Section>
  )
}

function BottomSheetSection() {
  return (
    <Section title="BottomSheet" hint="column · W=fill H=hug · pad 8/20/24 · gap 16 · radius top xl. The slide-up and scrim belong to the screen; this is the panel.">
      <Spec title="Live example" contract="grabber + header + content + actions">
        <div className="Feedback__sheetFrame">
          <BottomSheet title="Choose a network" onClose={() => {}} actions={
            <>
              <Button variant="secondary" size="lg" fullWidth>Cancel</Button>
              <Button variant="primary" size="lg" fullWidth>Continue</Button>
            </>
          }>
            <Stack gap={8}>
              <Text variant="body">Ethereum (ERC-20)</Text>
              <Text variant="body" tone="dim">Solana (SPL)</Text>
              <Text variant="body" tone="dim">BNB Chain (BEP-20)</Text>
            </Stack>
          </BottomSheet>
        </div>
      </Spec>

      <Spec title="No grabber / no header">
        <div className="Feedback__sheetFrame" style={{ height: 200 }}>
          <BottomSheet grabber={false} header={false}>
            <Text variant="bodySm" tone="dim">Minimal configuration — content only</Text>
          </BottomSheet>
        </div>
      </Spec>
    </Section>
  )
}

const EMPTY_CASES = [
  ['empty-balance', 'Your wallet is empty', 'Top up to start paying with your card', 'Top up'],
  ['empty-activity', 'No transactions yet', 'Transfers and purchases will show up here', null],
  ['offline', 'No connection', 'Check your internet and try again', 'Retry'],
  ['no-results', 'Nothing found', 'Try changing your search or filters', 'Clear filters'],
  ['no-cards', 'No cards yet', 'Link a Visa or Mastercard to pay anywhere cards are accepted', 'Link a card'],
  ['generic', 'Nothing here yet', 'A generic placeholder for cases without their own illustration', null],
]

function EmptyStateSection() {
  return (
    <Section
      title="EmptyState"
      hint="column · W=fill H=hug · pad 32/24 · gap 16 · center. illustration is a slot (ReactNode), so adding the SVG set didn't change the component API."
    >
      <Spec title="Illustration set — 6" contract="120×120 canvas · r=46 background circle · 2.5 stroke · exactly one accent per drawing">
        {ILLUSTRATION_NAMES.map((name) => (
          <Cell key={name} label={name} center>
            <Illustration name={name} size={104} />
          </Cell>
        ))}
      </Spec>

      <Spec title="Inside EmptyState" column>
        {EMPTY_CASES.map(([name, title, body, actionLabel]) => (
          <div className="Feedback__emptyFrame" key={name}>
            <EmptyState
              illustration={<Illustration name={name} size={112} />}
              title={title}
              body={body}
              action={Boolean(actionLabel)}
              actionLabel={actionLabel || undefined}
            />
          </div>
        ))}
      </Spec>

      <Spec title="Fallback without an illustration" contract="the default when the slot is empty — the component still works">
        <div className="Feedback__emptyFrame">
          <EmptyState icon="search" title="No illustration" body="An icon in a circle — the slot's default" />
        </div>
      </Spec>
    </Section>
  )
}

const LOCK_STATES = ['idle', 'scanning', 'success', 'failed']

function LockOverlaySection() {
  return (
    <Section title="LockOverlay" hint="column · W=fill H=fill · center · gap 24. Doesn't position itself — fills the container the screen gives it.">
      <Spec title="Face ID — 4 states">
        {LOCK_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <div className="Feedback__lockFrame">
              <LockOverlay method="faceid" state={state} onUseFallback={() => {}} />
            </div>
          </Cell>
        ))}
      </Spec>
      <Spec title="PIN — failed (no fallback to itself)">
        <div className="Feedback__lockFrame">
          <LockOverlay method="pin" state="failed" />
        </div>
      </Spec>
    </Section>
  )
}

export function Feedback() {
  return (
    <>
      <ToastSection />
      <BannerSection />
      <ModalSection />
      <BottomSheetSection />
      <EmptyStateSection />
      <LockOverlaySection />
    </>
  )
}
