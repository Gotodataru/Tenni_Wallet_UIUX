import { Icon } from '../icons/Icon.jsx'
import './Keypad.css'

/**
 * L2 · Keypad
 *
 * Sizing contract (Figma):
 *   column · W=fill H=hug · gap 8
 *   └ row ×4 · W=fill · gap 8
 *      └ key ×3 · fill · H=fixed(56)
 *
 * props: mode (amount — last key is "." | pin — last key is Face ID),
 *        showBiometric (bool), onKey(key), onBackspace(), onBiometric()
 */
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
]

export function Keypad({ mode = 'amount', showBiometric = true, onKey, onBackspace, onBiometric, className = '' }) {

  return (
    <div className={['Keypad', className].filter(Boolean).join(' ')}>
      {ROWS.map((row) => (
        <div className="Keypad__row" key={row.join('')}>
          {row.map((key) => (
            <button key={key} type="button" className="Keypad__key" onClick={() => onKey?.(key)}>
              {key}
            </button>
          ))}
        </div>
      ))}

      <div className="Keypad__row">
        {mode === 'amount' ? (
          <button type="button" className="Keypad__key" onClick={() => onKey?.('.')}>.</button>
        ) : showBiometric ? (
          <button type="button" className="Keypad__key Keypad__key--icon" onClick={onBiometric} aria-label="Face ID">
            <Icon name="face-id" size={24} />
          </button>
        ) : (
          <span className="Keypad__key Keypad__key--empty" aria-hidden="true" />
        )}

        <button type="button" className="Keypad__key" onClick={() => onKey?.('0')}>0</button>

        <button type="button" className="Keypad__key Keypad__key--icon" onClick={onBackspace} aria-label="Delete">
          <Icon name="arrow-left" size={22} />
        </button>
      </div>
    </div>
  )
}
