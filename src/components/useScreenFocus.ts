import { useEffect, useRef } from 'react';

let firstRender = true;

/**
 * Ao trocar de tela (ou de pergunta): volta ao topo e leva o foco ao título,
 * para que leitores de tela anunciem a nova tela.
 */
export function useScreenFocus<T extends HTMLElement = HTMLHeadingElement>(key: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    // Na primeira carga, não rouba o foco (o navegador já está no início da página).
    if (firstRender) {
      firstRender = false;
      return;
    }
    ref.current?.focus({ preventScroll: true });
  }, [key]);
  return ref;
}
