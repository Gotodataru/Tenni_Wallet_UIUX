import { useEffect, useState } from 'react'
import {
  Screen, AppBar, IconButton, Stack, Text, Button, Surface, ListRow, Avatar,
  Input, Banner, Checkbox, Segmented, ProgressDots, CardStage, EmptyState,
  LockOverlay, Chip, Icon,
} from '../ui/index.js'
import { CARD_LAST4 } from './data.js'
import { nameError, birthDateError, addressError, formatDate } from './format.js'

/**
 * Verify — the identity check a card issuer is required to run, then the card.
 *
 * intro → country → details → ID photo → selfie → review → checking →
 * card ready | retake the ID photo
 *
 * Three rules for the whole flow:
 * · Say why first. The intro lists the four things it will ask for and
 *   how long it takes, so nothing comes as a surprise halfway.
 * · Refuse early. A country without the card and an age under 18 stop
 *   the user on the step where they are typed, not after the review.
 * · Nothing is lost on a retry. A blurry ID photo sends the user back to
 *   that one photo; the details and the selfie stay.
 *
 * This is a public demo, so the form is filled with made-up details, the
 * camera is never opened and nothing leaves the page.
 */

const STEPS = ['intro', 'country', 'details', 'document', 'selfie', 'review', 'checking', 'approved', 'retry']

/** Error states for the catalog. */
const CHECKS = [
  { id: 'country-unavailable', step: 'country', preset: 'unavailable', label: 'Card not available there' },
  { id: 'details-errors', step: 'details', preset: 'errors', label: 'Details that don’t pass' },
  { id: 'document-glare', step: 'document', preset: 'glare', label: 'Glare on the ID photo' },
  { id: 'review-consent', step: 'review', preset: 'consent', label: 'Not confirmed' },
]

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'US', name: 'United States', unavailable: true },
]

const DOCUMENTS = ['Passport', 'ID card', 'Driver’s license']

/** Made-up details the form starts with, so nobody types their own. */
const DEMO_DETAILS = { first: 'Nina', last: 'Ross', dob: '04/12/1994', address: '12 Marina Walk, Dubai' }
const BAD_DETAILS = { first: 'Нина', last: 'R', dob: '03/18/2011', address: 'Dubai' }

const DOT = { country: 0, details: 1, document: 2, selfie: 3, review: 4 }
const BACK = { country: 'intro', details: 'country', document: 'details', selfie: 'document', review: 'selfie' }

const CHECK_ROWS = ['Personal details', 'ID document', 'Selfie matches the ID']

function detailErrors(d) {
  return {
    first: nameError(d.first, 'first name'),
    last: nameError(d.last, 'last name'),
    dob: birthDateError(d.dob),
    address: addressError(d.address),
  }
}

/** A step's heading: the question, and one line on why it is asked. */
function Heading({ title, body }) {
  return (
    <Stack gap={4}>
      <Text variant="h2">{title}</Text>
      {body && <Text variant="bodySm" tone="dim">{body}</Text>}
    </Stack>
  )
}

function IntroStep({ onNext, onLater }) {
  const needs = [
    { icon: 'globe', title: 'Where you live' },
    { icon: 'user', title: 'Your name and date of birth' },
    { icon: 'card', title: 'A photo of your ID' },
    { icon: 'face-id', title: 'A quick selfie' },
  ]
  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Heading
          title="Get your Tenni card"
          body="The law asks every card issuer to check who you are. It takes about 3 minutes."
        />
        <Surface level={1} radius="lg" pad={0} gap={0}>
          {needs.map((n, i) => (
            <ListRow
              key={n.icon}
              size="sm"
              leading={<Icon name={n.icon} size={20} tone="dim" />}
              title={n.title}
              divider={i < needs.length - 1}
            />
          ))}
        </Surface>
        <Text variant="bodySm" tone="dim">
          Have your passport, ID card or driver’s license at hand. Your details go only to the card issuer.
        </Text>
      </Stack>
      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onNext}>Start</Button>
        <Button variant="ghost" size="md" fullWidth onClick={onLater}>Later</Button>
      </Stack>
    </Stack>
  )
}

function CountryStep({ country, onPick, onNext }) {
  const picked = COUNTRIES.find((c) => c.code === country)
  return (
    <Stack gap={24} fill>
      <Heading title="Where do you live?" body="The country on your proof of address, not your nationality." />
      <Surface level={1} radius="lg" pad={0} gap={0}>
        {COUNTRIES.map((c, i) => (
          <ListRow
            key={c.code}
            leading={<Avatar type="initials" initials={c.code} size={40} />}
            title={c.name}
            subtitle={c.unavailable ? 'The card isn’t available here yet' : undefined}
            trailing={c.code === country ? <Icon name="check-circle" size={24} tone={c.unavailable ? 'dim' : 'accent'} /> : undefined}
            state={c.code === country ? 'selected' : undefined}
            divider={i < COUNTRIES.length - 1}
            onClick={() => onPick(c.code)}
          />
        ))}
      </Surface>
      {picked?.unavailable && (
        <Banner
          tone="warning"
          title="The card isn’t available there yet"
          body="The wallet works there, the card doesn’t. We’ll email you when it does."
        />
      )}
      <Stack fill justify="end">
        <Button
          variant="primary" size="xl" fullWidth iconTrailing="arrow-right"
          state={picked && !picked.unavailable ? undefined : 'disabled'} onClick={onNext}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}

/**
 * Checked on Continue, all fields at once; an error clears as soon as its
 * field is edited. The date is typed with a mask (MM/DD/YYYY), so the
 * user never has to type the slashes.
 */
function DetailsStep({ details, onChange, preset, onNext }) {
  const [errors, setErrors] = useState(preset === 'errors' ? detailErrors(details) : {})

  const set = (field) => (v) => {
    onChange({ ...details, [field]: field === 'dob' ? formatDate(v) : v })
    setErrors((e) => ({ ...e, [field]: null }))
  }

  function submit() {
    const found = detailErrors(details)
    setErrors(found)
    if (!Object.values(found).some(Boolean)) onNext()
  }

  return (
    <Stack gap={24} fill>
      <Heading title="Your details" body="Exactly as they’re printed in your ID." />
      <Banner tone="info" body="Demo: these details are made up and stay on this page. Try a birth date after 2008 to see the age check." />
      <Stack gap={16}>
        <Stack dir="row" gap={12}>
          <Stack fill><Input label="First name" value={details.first} onChange={set('first')} error={errors.first} autoComplete="off" /></Stack>
          <Stack fill><Input label="Last name" value={details.last} onChange={set('last')} error={errors.last} autoComplete="off" /></Stack>
        </Stack>
        <Input
          label="Date of birth"
          placeholder="MM/DD/YYYY"
          value={details.dob}
          onChange={set('dob')}
          error={errors.dob}
          inputMode="numeric"
          autoComplete="off"
        />
        <Input label="Home address" value={details.address} onChange={set('address')} error={errors.address} hint="Street, building number and city" autoComplete="off" />
      </Stack>
      <Stack fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={submit}>Continue</Button>
      </Stack>
    </Stack>
  )
}

/**
 * A viewfinder stand-in: the demo never opens the camera. "Taking" the
 * photo runs the same quality check a real one would. With `glareFirst`
 * (the catalog's "Glare" outcome) the first shot comes back with glare,
 * to show how a bad photo is handled; the prototype's shot is clear.
 *
 * phase — frame | checking | glare | clear
 */
function DocumentStep({ preset, glareFirst = false, onNext }) {
  const [doc, setDoc] = useState(0)
  const [phase, setPhase] = useState(preset === 'glare' ? 'glare' : 'frame')
  const [shots, setShots] = useState(0)

  useEffect(() => {
    if (phase !== 'checking') return
    const t = setTimeout(() => setPhase(glareFirst && shots === 1 ? 'glare' : 'clear'), 1200)
    return () => clearTimeout(t)
  }, [phase, shots, glareFirst])

  const shoot = () => { setShots((s) => s + 1); setPhase('checking') }

  const frame = {
    frame: { icon: 'card', tone: 'dim', text: `Place the ${DOCUMENTS[doc].toLowerCase()} photo page inside the frame` },
    checking: { icon: 'scan', tone: 'dim', text: 'Checking the photo…' },
    glare: { icon: 'alert-triangle', tone: 'warning', text: 'Part of the photo is hidden by glare' },
    clear: { icon: 'check-circle', tone: 'success', text: 'The photo is clear' },
  }[phase]

  return (
    <Stack gap={24} fill>
      <Heading title="Photo of your ID" body="All four corners in the frame, no fingers over the text." />
      <Segmented items={DOCUMENTS} active={doc} onChange={(i) => { setDoc(i); setPhase('frame') }} disabled={phase === 'checking'} />

      <Surface level={2} radius="xl" pad={32} gap={16}>
        <Stack align="center" gap={12}>
          <Icon name={frame.icon} size={32} tone={frame.tone} />
          <Text variant="bodySm" tone="dim" align="center">{frame.text}</Text>
        </Stack>
      </Surface>

      {phase === 'glare' && (
        <Banner tone="warning" title="Glare on the photo" body="Tilt the document away from the light and take it again." />
      )}

      <Stack fill justify="end" gap={12}>
        {phase === 'clear' ? (
          <>
            <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onNext}>Continue</Button>
            <Button variant="ghost" size="md" fullWidth onClick={shoot}>Retake</Button>
          </>
        ) : (
          <Button
            variant="primary" size="xl" fullWidth
            iconLeading={phase === 'glare' ? 'refresh' : 'scan'}
            state={phase === 'checking' ? 'loading' : undefined}
            onClick={shoot}
          >
            {phase === 'glare' ? 'Retake photo' : 'Take photo'}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

/** The selfie runs through the same Face ID-style scan the app uses elsewhere. */
function SelfieStep({ onNext }) {
  const [phase, setPhase] = useState('tips')   // tips | scanning | done

  useEffect(() => {
    if (phase !== 'scanning') return
    const t = setTimeout(() => setPhase('done'), 1400)
    return () => clearTimeout(t)
  }, [phase])

  if (phase !== 'tips') {
    return (
      <Stack fill gap={16}>
        <Stack fill>
          <LockOverlay method="faceid" state={phase === 'done' ? 'success' : 'scanning'} />
        </Stack>
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" state={phase === 'done' ? undefined : 'disabled'} onClick={onNext}>
          Continue
        </Button>
      </Stack>
    )
  }

  const tips = [
    { icon: 'sun', title: 'Face a window or a lamp' },
    { icon: 'eye', title: 'Take off glasses and hats' },
    { icon: 'user', title: 'Only you in the frame' },
  ]
  return (
    <Stack gap={24} fill>
      <Heading title="A quick selfie" body="We compare it with the photo in your ID, so nobody can use your documents but you." />
      <Surface level={1} radius="lg" pad={0} gap={0}>
        {tips.map((t, i) => (
          <ListRow key={t.icon} size="sm" leading={<Icon name={t.icon} size={20} tone="dim" />} title={t.title} divider={i < tips.length - 1} />
        ))}
      </Surface>
      <Stack fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconLeading="face-id" onClick={() => setPhase('scanning')}>Take a selfie</Button>
      </Stack>
    </Stack>
  )
}

function ReviewStep({ country, details, preset, onEdit, onSubmit }) {
  const [agreed, setAgreed] = useState(false)
  const [consentError, setConsentError] = useState(preset === 'consent')
  const place = COUNTRIES.find((c) => c.code === country)?.name

  const submit = () => (agreed ? onSubmit() : setConsentError(true))

  return (
    <Stack gap={24} fill>
      <Heading title="Check and send" body="The issuer compares these with your ID, letter by letter." />

      <Stack gap={8}>
        <Stack dir="row" justify="between" align="center">
          <Text variant="label" tone="dim">Details</Text>
          <Button variant="ghost" size="sm" iconLeading="edit" onClick={onEdit}>Edit</Button>
        </Stack>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" title="Country" trailing={<Text variant="bodySm" tone="dim">{place}</Text>} divider />
          <ListRow size="sm" title="Name" trailing={<Text variant="bodySm" tone="dim">{details.first} {details.last}</Text>} divider />
          <ListRow size="sm" title="Date of birth" trailing={<Text variant="bodySm" tone="dim" numeric>{details.dob}</Text>} divider />
          <ListRow size="sm" title="Address" trailing={<Text variant="bodySm" tone="dim">{details.address}</Text>} />
        </Surface>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Photos</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" leading={<Icon name="card" size={20} tone="dim" />} title="ID photo" trailing={<Icon name="check-circle" size={20} tone="success" />} divider />
          <ListRow size="sm" leading={<Icon name="face-id" size={20} tone="dim" />} title="Selfie" trailing={<Icon name="check-circle" size={20} tone="success" />} />
        </Surface>
      </Stack>

      <Stack gap={6}>
        <Stack dir="row" gap={12} align="center">
          <Checkbox
            checked={agreed}
            state={consentError && !agreed ? 'error' : undefined}
            onChange={(v) => { setAgreed(v); setConsentError(false) }}
            aria-label="I confirm the details are true and match my ID"
          />
          <Text variant="bodySm" tone="dim">I confirm the details are true and match my ID</Text>
        </Stack>
        {consentError && !agreed && (
          <Text variant="bodySm" tone="danger">Confirm the details to send them</Text>
        )}
      </Stack>

      <Stack fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={submit}>Send for checking</Button>
      </Stack>
    </Stack>
  )
}

/**
 * The check as a checklist that fills in, not a spinner: the user sees
 * what is being checked and how far it got.
 * done — rows finished; failAt — the row that failed (the retry outcome).
 */
function CheckingStep({ live, outcome, onResult }) {
  const [done, setDone] = useState(live ? 0 : 1)
  const failAt = outcome === 'retry' ? 1 : -1

  useEffect(() => {
    if (!live) return
    if (done === failAt || done >= CHECK_ROWS.length) {
      const t = setTimeout(() => onResult(done === failAt ? 'retry' : 'approved'), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setDone((d) => d + 1), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, done])

  const status = (i) => {
    if (i === failAt && done === failAt) return <Icon name="alert-circle" size={20} tone="danger" />
    if (i < done) return <Icon name="check-circle" size={20} tone="success" />
    if (i === done) return <Chip variant="neutral" size="sm">Checking</Chip>
    return <Text variant="caption" tone="faint">Waiting</Text>
  }

  return (
    <Stack gap={24} fill justify="center">
      <Heading title="Checking your details" body="Usually under two minutes. You can close the app — we’ll send a notification." />
      <Surface level={1} radius="lg" pad={0} gap={0}>
        {CHECK_ROWS.map((r, i) => (
          <ListRow key={r} size="sm" title={r} trailing={status(i)} divider={i < CHECK_ROWS.length - 1} />
        ))}
      </Surface>
    </Stack>
  )
}

function ApprovedStep({ details, onFinish }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack fill justify="center" gap={24}>
        <CardStage holder={`${details.first} ${details.last}`.toUpperCase()} last4={CARD_LAST4} />
        <Stack gap={8} align="center">
          <Text variant="h2" align="center">Your card is ready</Text>
          <Text variant="body" tone="dim" align="center">
            The virtual card works right away. The plastic one arrives in 5–7 days.
          </Text>
        </Stack>
      </Stack>
      <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onFinish}>Open wallet</Button>
    </Stack>
  )
}

function RetryStep({ onRetake }) {
  return (
    <Stack fill gap={16}>
      <Stack fill justify="center">
        <EmptyState
          illustration={<Icon name="alert-circle" size={56} tone="warning" />}
          title="We couldn’t read your ID"
          body="The photo came out blurry. Take that one again — your details and selfie are saved."
        />
      </Stack>
      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth iconLeading="refresh" onClick={onRetake}>Retake the ID photo</Button>
        <Button variant="ghost" size="md" fullWidth iconLeading="help">Contact support</Button>
      </Stack>
    </Stack>
  )
}

/**
 * step     — set from outside (the catalog) or driven internally.
 * preset   — freezes a step in an error state (catalog, see CHECKS).
 * outcome  — how the live flow goes: approved (the prototype: every step
 *            passes) | glare (the first ID photo has glare) | retry (the
 *            check can't read the ID; the second round is approved, like a
 *            declined payment in Pay).
 * onFinish — the card is issued (prototype → Home); onExit — "Later".
 */
export function VerifyScreen({ step: stepProp, preset, outcome = 'approved', theme = 'dark', scaled = false, onFinish, onExit }) {
  const [innerStep, setInnerStep] = useState('intro')
  const [country, setCountry] = useState(preset === 'unavailable' ? 'US' : stepProp ? 'AE' : null)
  const [details, setDetails] = useState(preset === 'errors' ? BAD_DETAILS : DEMO_DETAILS)
  const [round, setRound] = useState(0)
  const step = stepProp || innerStep
  const live = !stepProp

  const go = (s) => { if (live) setInnerStep(s) }

  const title = { approved: 'Card', retry: 'Verification', checking: 'Verification' }[step] || 'Verify identity'
  const appBar = (
    <AppBar
      layout="title-center"
      title={title}
      onBack={BACK[step] && live ? () => go(BACK[step]) : undefined}
      leading={step === 'intro' || step === 'retry'
        ? <IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={onExit} />
        : undefined}
    />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
    >
      <Stack gap={16} fill>
        {DOT[step] !== undefined && (
          <Stack align="center">
            <ProgressDots total={5} active={DOT[step]} />
          </Stack>
        )}

        {step === 'intro' && <IntroStep onNext={() => go('country')} onLater={onExit} />}
        {step === 'country' && <CountryStep country={country} onPick={setCountry} onNext={() => go('details')} />}
        {step === 'details' && <DetailsStep key={preset} details={details} onChange={setDetails} preset={preset} onNext={() => go('document')} />}
        {step === 'document' && <DocumentStep key={`${preset}-${round}`} preset={preset} glareFirst={outcome === 'glare' && round === 0} onNext={() => go(round > 0 ? 'review' : 'selfie')} />}
        {step === 'selfie' && <SelfieStep onNext={() => go('review')} />}
        {step === 'review' && (
          <ReviewStep key={preset} country={country} details={details} preset={preset} onEdit={() => go('details')} onSubmit={() => go('checking')} />
        )}
        {step === 'checking' && (
          <CheckingStep live={live} outcome={round === 0 && outcome === 'retry' ? 'retry' : 'approved'} onResult={(r) => go(r)} />
        )}
        {step === 'approved' && <ApprovedStep details={details} onFinish={onFinish} />}
        {step === 'retry' && <RetryStep onRetake={() => { setRound((r) => r + 1); go('document') }} />}
      </Stack>
    </Screen>
  )
}

export { STEPS as VERIFY_STEPS, CHECKS as VERIFY_CHECKS }
