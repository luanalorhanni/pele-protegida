import type { MeasureId, MessageCode } from '../content/result-texts';
import { Icon, type IconName } from '../components/icons';
import { ContactButtons, HowToBook } from '../components/UbsBits';
import { useScreenFocus } from '../components/useScreenFocus';
import type { PreventionCode, Result } from '../lib/computeResult';
import type { SubmitStatus } from '../lib/submit';
import { navigate } from '../router';

const MEASURE_ICON: Record<MeasureId, IconName> = { p5: 'hat', p6: 'shirt', p7: 'bottle' };
const MESSAGE_ICON: Record<MessageCode, IconName> = {
  'SEM-REAPLICAR': 'clock',
  'POUCA-SOMBRA+EXP-ALTA': 'shade',
  'SEM-SOMBRA': 'hat',
  'PELE-RISCO|EXP-ACUMULADA': 'mirror',
  HISTORICO: 'people',
};
const BAND_ICON: Record<PreventionCode, IconName> = { atencao: 'sun', pode_melhorar: 'shirt', caminho: 'okCircle' };

interface Props {
  result: Result;
  status: SubmitStatus | 'enviando';
}

export function Resultado({ result, status }: Props) {
  const h1 = useScreenFocus('resultado');
  const { ubsAlert: alert, preventionResult: p, messages } = result;

  return (
    <div className="screen" style={{ gap: 18 }}>
      <h1 ref={h1} tabIndex={-1} className="display">
        Seu resultado
      </h1>

      {alert && (
        <section className="alert" aria-labelledby="ubs-alert-title">
          <div className="alert__head">
            <span className="bubble bubble--xl bubble--primary">
              <Icon name="eye" size={28} />
            </span>
            <h2 id="ubs-alert-title">{alert.title}</h2>
          </div>
          <p>{alert.intro}</p>
          {alert.statusText && <p className="strong">{alert.statusText}</p>}
          {alert.barriers.length > 0 && (
            <ul className="barriers">
              {alert.barriers.map((b) => (
                <li key={b.code}>
                  <Icon name="right" size={24} strokeWidth={2.4} />
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          )}
          {alert.showContacts && <ContactButtons />}
          {alert.showSteps && (
            <div className="stack" style={{ gap: 6 }}>
              <h3 style={{ fontSize: 19 }}>Como marcar</h3>
              <HowToBook />
            </div>
          )}
          <button type="button" className="btn btn--outline" onClick={() => navigate('ubs')}>
            <Icon name="house" size={24} />
            Como procurar a UBS
          </button>
        </section>
      )}

      <section className="prevention" aria-labelledby="prev-title">
        <div className={`prevention__band band--${p.code}`}>
          <Icon name={BAND_ICON[p.code]} size={36} />
          <h2 id="prev-title">{p.title}</h2>
        </div>
        <div className="prevention__body">
          <p>{p.text}</p>
          {p.tips.length > 0 && (
            <ul className="tips">
              {p.tips.map((t) => (
                <li key={t.measure}>
                  <span className="bubble bubble--lg bubble--white">
                    <Icon name={MEASURE_ICON[t.measure]} size={28} strokeWidth={1.8} />
                  </span>
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {messages.length > 0 && (
        <section className="stack" style={{ gap: 10 }} aria-labelledby="msgs-title">
          <h2 id="msgs-title" style={{ fontSize: 22 }}>
            Também vale saber
          </h2>
          <ul className="messages">
            {messages.map((m) => (
              <li key={m.code}>
                <span className="bubble bubble--sand">
                  <Icon name={MESSAGE_ICON[m.code] ?? 'info'} />
                </span>
                <p>{m.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="stack">
        <button type="button" className="btn btn--sun" onClick={() => navigate('checklist')}>
          <Icon name="list" size={26} />
          Ver checklist
        </button>
        <button type="button" className="btn btn--primary" onClick={() => navigate('ubs')}>
          <Icon name="house" size={26} />
          Quero falar com a UBS
        </button>
      </div>

      <div role="status" aria-live="polite">
        {status === 'enviada' && (
          <p className="saved-note">
            <Icon name="lock" size={20} />
            Respostas guardadas sem identificação.
          </p>
        )}
        {status === 'na_fila' && (
          <p className="saved-note saved-note--queued">
            <Icon name="wifiOff" size={22} />
            Sem internet agora. Suas respostas ficaram guardadas neste aparelho, sem identificação, e serão
            enviadas sozinhas quando a conexão voltar.
          </p>
        )}
      </div>
    </div>
  );
}
