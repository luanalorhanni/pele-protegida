import { Icon } from '../components/icons';
import { useScreenFocus } from '../components/useScreenFocus';
import { InstallButton } from '../pwa/InstallButton';
import { navigate } from '../router';

function HeroArt() {
  return (
    <svg className="hero-art" width="358" height="168" viewBox="0 0 358 168" aria-hidden="true" focusable="false">
      <rect width="358" height="168" fill="#FFF0D6" />
      <circle cx="268" cy="62" r="34" fill="#FFC94A" />
      <g stroke="#FF9147" strokeWidth="5" strokeLinecap="round">
        <path d="M268 12v-6 M268 118v6 M218 62h-6 M318 62h6 M233 27l-4-4 M303 27l4-4 M233 97l-4 4 M303 97l4 4" />
      </g>
      <path
        d="M0 112c30 0 30-12 60-12s30 12 60 12 30-12 60-12 30 12 60 12 30-12 60-12 30 12 58 12V168H0z"
        fill="#FFBE5C"
      />
      <path
        d="M0 136c30 0 30-10 60-10s30 10 60 10 30-10 60-10 30 10 60 10 30-10 60-10 30 10 58 10"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M70 104l14-38 28 38z" fill="#FFFFFF" />
      <path d="M60 106h62l-8 12H68z" fill="#5B4E9A" />
      <path d="M84 66v40" stroke="#1E1E2E" strokeWidth="3" />
    </svg>
  );
}

export function Inicio() {
  const h1 = useScreenFocus('inicio');
  return (
    <div className="screen">
      <HeroArt />
      <div className="stack stack--sm">
        <h1 ref={h1} tabIndex={-1} className="display display--hero">
          Pele Protegida
        </h1>
        <div className="accent-bar" aria-hidden="true" />
        <p className="lead">Cuide da sua pele no trabalho ao sol</p>
        <p className="muted">Dicas simples para quem pesca, vende, constrói ou trabalha na rua.</p>
      </div>
      <div className="stack">
        <button type="button" className="btn btn--primary" onClick={() => navigate('checklist')}>
          <Icon name="list" size={26} />
          Ver checklist de proteção
        </button>
        <button type="button" className="btn btn--sun" onClick={() => navigate('consentimento')}>
          <Icon name="chat" size={26} />
          Responder o questionário (5 min)
        </button>
        <p className="muted center">Você não precisa dizer seu nome.</p>
      </div>
      <button type="button" className="btn btn--link" onClick={() => navigate('ubs')}>
        <Icon name="house" size={24} />
        Quero falar com a UBS
      </button>
      <InstallButton />
    </div>
  );
}
