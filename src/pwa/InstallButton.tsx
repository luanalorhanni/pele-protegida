import { useRef } from 'react';
import { Icon } from '../components/icons';
import { useInstallPrompt } from './useInstallPrompt';

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export function InstallButton() {
  const { mode, promptInstall } = useInstallPrompt();
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (mode === 'hidden') return null;

  const label = isTouch() || mode === 'ios' ? 'Instalar no celular' : 'Instalar o aplicativo';

  return (
    <>
      <button
        type="button"
        className="btn btn--outline"
        onClick={() => (mode === 'prompt' ? void promptInstall() : dialogRef.current?.showModal())}
      >
        <Icon name="download" size={24} />
        {label}
      </button>

      {mode === 'ios' && (
        <dialog ref={dialogRef} className="dialog" aria-labelledby="ios-install-title">
          <h2 id="ios-install-title">Instalar no iPhone</h2>
          <ol className="dialog__steps">
            <li>
              <Icon name="share" size={26} />
              <span>
                Toque em <strong>Compartilhar</strong> (o quadrado com a seta para cima, na barra do Safari).
              </span>
            </li>
            <li>
              <Icon name="plusSquare" size={26} />
              <span>
                Role e toque em <strong>Adicionar à Tela de Início</strong>.
              </span>
            </li>
            <li>
              <Icon name="check" size={26} />
              <span>
                Toque em <strong>Adicionar</strong>. O Pele Protegida aparece junto com seus aplicativos.
              </span>
            </li>
          </ol>
          <form method="dialog">
            <button type="submit" className="btn btn--primary">
              Entendi
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
