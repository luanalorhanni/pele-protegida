import { CONSENT_ITEMS } from '../content/screens';
import { Icon } from '../components/icons';
import { useScreenFocus } from '../components/useScreenFocus';

interface Props {
  consent: boolean;
  onConsentChange: (v: boolean) => void;
  onStart: () => void;
}

export function Consentimento({ consent, onConsentChange, onStart }: Props) {
  const h1 = useScreenFocus('consentimento');
  return (
    <div className="screen">
      <h1 ref={h1} tabIndex={-1} className="display">
        Antes de começar
      </h1>
      <ul className="icon-list">
        {CONSENT_ITEMS.map((c) => (
          <li key={c.t}>
            <span className="bubble">
              <Icon name={c.icon} size={24} />
            </span>
            <span>{c.t}</span>
          </li>
        ))}
      </ul>

      <label className="consent-box">
        <input type="checkbox" checked={consent} onChange={(e) => onConsentChange(e.target.checked)} />
        Li e concordo em responder
      </label>

      {consent ? (
        <button type="button" className="btn btn--primary" onClick={onStart}>
          Começar
          <Icon name="right" size={24} strokeWidth={2.4} />
        </button>
      ) : (
        <div className="stack stack--sm">
          <button type="button" className="btn" aria-disabled="true" aria-describedby="consent-hint">
            Começar
          </button>
          <p id="consent-hint" className="muted center">
            Marque a caixa acima para começar.
          </p>
        </div>
      )}
    </div>
  );
}
