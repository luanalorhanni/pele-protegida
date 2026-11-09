import { useRegisterSW } from 'virtual:pwa-register/react';
import { Icon } from '../components/icons';

const UPDATE_CHECK_MS = 60 * 60 * 1000; // procura nova versão a cada 1 hora

/** Registra o service worker e avisa quando há uma nova versão. */
export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      setInterval(() => {
        if (navigator.onLine) void registration.update();
      }, UPDATE_CHECK_MS);
    },
  });

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {needRefresh && (
        <div className="toast">
          <Icon name="refresh" size={26} />
          <p className="toast__text">Atualização disponível</p>
          <button type="button" className="toast__btn" onClick={() => void updateServiceWorker(true)}>
            Atualizar
          </button>
          <button
            type="button"
            className="toast__close"
            aria-label="Agora não"
            onClick={() => setNeedRefresh(false)}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
