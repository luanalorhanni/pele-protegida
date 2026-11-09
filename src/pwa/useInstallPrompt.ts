import { useCallback, useEffect, useState } from 'react';
import { isStandalone } from '../lib/payload';

/** Evento do Chrome/Android (ainda não está nos tipos do DOM). */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function isIOS(): boolean {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS se apresenta como Mac
    (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  );
}

// O evento pode disparar antes do React montar: guardamos aqui.
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

export type InstallMode =
  /** Já instalado ou navegador sem suporte: esconder o botão. */
  | 'hidden'
  /** Chrome/Edge/Android: abre o diálogo nativo. */
  | 'prompt'
  /** iOS: mostrar instruções. */
  | 'ios';

export function useInstallPrompt() {
  const [, force] = useState(0);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const update = () => force((n) => n + 1);
    listeners.add(update);
    const mq = window.matchMedia('(display-mode: standalone)');
    const onMode = () => setInstalled(isStandalone());
    mq.addEventListener?.('change', onMode);
    const onInstalled = () => setInstalled(true);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      listeners.delete(update);
      mq.removeEventListener?.('change', onMode);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const mode: InstallMode = installed ? 'hidden' : deferred ? 'prompt' : isIOS() ? 'ios' : 'hidden';

  const promptInstall = useCallback(async () => {
    const ev = deferred;
    if (!ev) return;
    await ev.prompt();
    const { outcome } = await ev.userChoice;
    deferred = null; // o evento só pode ser usado uma vez
    if (outcome === 'accepted') setInstalled(true);
    force((n) => n + 1);
  }, []);

  return { mode, promptInstall };
}
