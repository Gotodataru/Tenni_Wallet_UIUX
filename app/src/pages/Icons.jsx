import { Icon, Text } from '../ui/index.js'
import { byPack, ICON_NAMES } from '../icons/paths.js'
import { Section, Spec, Cell } from './parts.jsx'

const PACK_TITLE = {
  navigation: 'Navigation: structure and transitions',
  wallet:     'Wallet: money actions',
  status:     'Status: states and safety',
  security:   'Security: sign-in and keys',
  settings:   'Settings: profile and system',
  assets:     'Assets: coins and payment marks',
}

export function Icons() {
  const packs = byPack()

  return (
    <Section
      hint={`${ICON_NAMES.length} icons in ${packs.length} packs. Shared geometry: 24×24 viewBox, 20×20 live area, 1.75 stroke, round caps, currentColor.`}
    >
      <div className="Note">
        <Icon name="alert-triangle" size={20} tone="warning" />
        <Text variant="bodySm">
          No Visa, Mastercard or Apple Pay logos on purpose. They are registered
          trademarks and can't be redrawn by hand; official assets come from each
          company's brand center. The assets pack uses neutral chip, contactless and nfc marks instead.
        </Text>
      </div>

      <Spec title="Sizes" contract="16 / 20 / 24 / 32 · flex: 0 0 auto, never shrinks">
        {[16, 20, 24, 32].map((size) => (
          <Cell key={size} label={`${size}px`} center>
            <Icon name="send" size={size} />
          </Cell>
        ))}
      </Spec>

      <Spec title="Tones">
        {['default', 'dim', 'faint', 'accent', 'success', 'danger', 'warning'].map((tone) => (
          <Cell key={tone} label={tone} center>
            <Icon name="shield" size={24} tone={tone} />
          </Cell>
        ))}
      </Spec>

      {packs.map(({ pack, names }) => (
        <Spec key={pack} title={PACK_TITLE[pack]} contract={`${names.length} icons`}>
          <div className="IconGrid">
            {names.map((name) => (
              <div key={name} className="IconCell" title={name}>
                <Icon name={name} size={24} />
                <span className="IconCell__name">{name}</span>
              </div>
            ))}
          </div>
        </Spec>
      ))}
    </Section>
  )
}
