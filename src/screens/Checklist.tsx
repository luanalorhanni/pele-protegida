import { CHECKLIST } from '../content/screens';
import { Icon } from '../components/icons';
import { useScreenFocus } from '../components/useScreenFocus';
import { navigate } from '../router';

interface Props {
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}

const TOTAL = CHECKLIST.reduce((n, s) => n + s.items.length, 0);

export function Checklist({ checks, onToggle }: Props) {
  const h1 = useScreenFocus('checklist');
  const checked = CHECKLIST.flatMap((s) => s.items).filter((i) => checks[i.id]).length;

  return (
    <div className="screen">
      <div className="stack stack--sm">
        <h1 ref={h1} tabIndex={-1} className="display">
          Checklist de proteção
        </h1>
        <p>Marque o que você já faz. Não precisa salvar.</p>
        <p className="strong" style={{ color: 'var(--primary)' }} aria-live="polite">
          {checked} de {TOTAL} marcados
        </p>
      </div>

      {CHECKLIST.map((sec) => (
        <section key={sec.title} className="stack" aria-labelledby={`sec-${sec.title}`}>
          <h2 id={`sec-${sec.title}`} className="section-title">
            {sec.title}
          </h2>
          <ul className="checklist-list">
            {sec.items.map((it) => (
              <li key={it.id}>
                <label className="check-item">
                  <input type="checkbox" checked={!!checks[it.id]} onChange={() => onToggle(it.id)} />
                  <span className="bubble bubble--lg">
                    <Icon name={it.icon} size={28} strokeWidth={1.8} />
                  </span>
                  <span className="check-item__text">
                    <span className="check-item__title">{it.t}</span>
                    <span className="check-item__desc">{it.d}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button type="button" className="btn btn--primary" onClick={() => navigate('consentimento')}>
        Fazer o questionário
        <Icon name="right" size={24} strokeWidth={2.4} />
      </button>
    </div>
  );
}
