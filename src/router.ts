// Roteador mínimo com a History API (sem dependência extra).
import { useSyncExternalStore } from 'react';

export const ROUTES = {
  inicio: '/',
  checklist: '/checklist',
  consentimento: '/consentimento',
  questionario: '/questionario',
  resultado: '/resultado',
  ubs: '/ubs',
} as const;
export type RouteName = keyof typeof ROUTES;

const byPath = new Map<string, RouteName>(
  (Object.entries(ROUTES) as [RouteName, string][]).map(([name, path]) => [path, name]),
);

export interface Location {
  route: RouteName;
  /** Pergunta atual do questionário (?q=p5). */
  q: string | null;
  key: string;
}

function read(): Location {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = byPath.get(path) ?? 'inicio';
  const q = new URLSearchParams(window.location.search).get('q');
  return { route, q, key: `${route}?${q ?? ''}` };
}

let current = read();
const subs = new Set<() => void>();
function emit() {
  current = read();
  subs.forEach((s) => s());
}
window.addEventListener('popstate', emit);

export function navigate(route: RouteName, opts: { q?: string; replace?: boolean } = {}) {
  const url = ROUTES[route] + (opts.q ? `?q=${encodeURIComponent(opts.q)}` : '');
  const state = { q: opts.q ?? null, prevKey: current.key };
  if (opts.replace) window.history.replaceState(state, '', url);
  else window.history.pushState(state, '', url);
  emit();
}

/** Volta no histórico se a entrada anterior for `key`; senão navega substituindo. */
export function backTo(route: RouteName, q?: string) {
  const target = `${route}?${q ?? ''}`;
  const state = window.history.state as { prevKey?: string } | null;
  if (state?.prevKey === target) window.history.back();
  else navigate(route, { q, replace: true });
}

export function useLocation(): Location {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => current,
  );
}
