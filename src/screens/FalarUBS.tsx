import { UBS } from '../content/ubs';
import { Icon } from '../components/icons';
import { useScreenFocus } from '../components/useScreenFocus';
import { ContactButtons, HowToBook } from '../components/UbsBits';

interface Props {
  onBack: () => void;
}

export function FalarUBS({ onBack }: Props) {
  const h1 = useScreenFocus('ubs');
  return (
    <div className="screen">
      <h1 ref={h1} tabIndex={-1} className="display">
        Quero falar com a UBS
      </h1>

      <section className="card card--primary" aria-labelledby="ubs-nome">
        <h2 id="ubs-nome" style={{ fontSize: 22, lineHeight: 1.3 }}>
          {UBS.nome}
        </h2>
        <p>Apoio: {UBS.apoio}</p>
      </section>

      <div className="card">
        <div className="card-row">
          <span className="bubble">
            <Icon name="pin" />
          </span>
          <div className="card-row__body">
            <h2 className="card-title">Endereço</h2>
            <p>{UBS.endereco}</p>
          </div>
        </div>
        <a href={UBS.mapaUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
          <Icon name="pin" size={22} />
          Abrir no mapa
        </a>
      </div>

      <div className="card">
        <div className="card-row">
          <span className="bubble">
            <Icon name="call" />
          </span>
          <div className="card-row__body">
            <h2 className="card-title">Telefone e WhatsApp</h2>
            <p>Telefone: {UBS.telefone}</p>
            <p>WhatsApp: {UBS.whatsapp}</p>
          </div>
        </div>
        <ContactButtons />
      </div>

      <div className="card card--gap">
        <div className="card-row">
          <span className="bubble">
            <Icon name="clock" />
          </span>
          <div className="card-row__body">
            <h2 className="card-title">Horário</h2>
            <p>{UBS.horario}</p>
          </div>
        </div>
        <div className="card-row">
          <span className="bubble">
            <Icon name="calendar" />
          </span>
          <div className="card-row__body">
            <h2 className="card-title">Como marcar</h2>
            <HowToBook />
          </div>
        </div>
        <div className="card-row">
          <span className="bubble">
            <Icon name="card" />
          </span>
          <div className="card-row__body">
            <h2 className="card-title">O que levar</h2>
            <p>{UBS.oQueLevar}</p>
          </div>
        </div>
      </div>

      <div className="card card--sand">
        <span className="bubble bubble--lg bubble--white">
          <Icon name="person" size={26} />
        </span>
        <p className="strong" style={{ paddingTop: 6 }}>
          {UBS.agente}
        </p>
      </div>

      <button type="button" className="btn btn--outline" onClick={onBack}>
        <Icon name="left" size={24} strokeWidth={2.4} />
        Voltar
      </button>
    </div>
  );
}
