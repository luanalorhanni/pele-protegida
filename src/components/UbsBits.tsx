import { UBS } from '../content/ubs';
import { Icon } from './icons';

export function ContactButtons() {
  return (
    <div className="btn-grid">
      <a href={UBS.telefoneLink} className="btn btn--primary btn--sm">
        <Icon name="call" size={22} />
        Ligar
      </a>
      <a href={UBS.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
        <Icon name="chat" size={22} />
        WhatsApp
      </a>
    </div>
  );
}

export function HowToBook() {
  return (
    <ol className="steps">
      {UBS.comoMarcar.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ol>
  );
}
