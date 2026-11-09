// =====================================================================
// Fila local de respostas (IndexedDB).
//
// Toda resposta entra primeiro na fila e só sai quando o Supabase confirma.
// Assim nada se perde se a pessoa terminar sem internet ou fechar o app.
// O envio é tentado: logo após terminar, no evento `online` e ao abrir o app.
// Não depende de Background Sync (o iOS não suporta).
// =====================================================================
import { createStore, del, entries, set, type UseStore } from 'idb-keyval';
import type { RespostaRow } from './payload';

export interface QueueItem {
  row: RespostaRow;
  attempts: number;
}

/** Resultado de uma tentativa de envio. */
export type SendOutcome =
  | { ok: true }
  /** Falha de rede/servidor: tentar de novo depois. */
  | { ok: false; retry: true }
  /** Rejeitado pelo banco (dado inválido): não adianta repetir. */
  | { ok: false; retry: false; reason: string };

export type Sender = (row: RespostaRow) => Promise<SendOutcome>;

/** Desiste de um item rejeitado pelo banco depois de algumas tentativas. */
const MAX_REJECTED_ATTEMPTS = 5;

let store: UseStore | null = null;
function getStore(): UseStore {
  store ??= createStore('pele-protegida', 'fila-respostas');
  return store;
}

export async function enqueue(row: RespostaRow): Promise<void> {
  await set(row.id, { row, attempts: 0 } satisfies QueueItem, getStore());
}

export async function pendingCount(): Promise<number> {
  return (await entries(getStore())).length;
}

let inFlight: Promise<number> | null = null;

/**
 * Tenta enviar tudo o que está na fila. Retorna quantos itens continuam pendentes.
 * Chamadas simultâneas reaproveitam o mesmo envio.
 */
export function flushQueue(send: Sender): Promise<number> {
  inFlight ??= doFlush(send).finally(() => {
    inFlight = null;
  });
  return inFlight;
}

async function doFlush(send: Sender): Promise<number> {
  const s = getStore();
  const items = (await entries<string, QueueItem>(s)).sort((a, b) =>
    a[1].row.respondida_em.localeCompare(b[1].row.respondida_em),
  );
  let pending = items.length;
  for (const [key, item] of items) {
    let outcome: SendOutcome;
    try {
      outcome = await send(item.row);
    } catch {
      outcome = { ok: false, retry: true };
    }
    if (outcome.ok) {
      await del(key, s);
      pending--;
    } else if (outcome.retry) {
      break; // provavelmente sem conexão: para e tenta no próximo gatilho
    } else {
      const attempts = item.attempts + 1;
      if (attempts >= MAX_REJECTED_ATTEMPTS) {
        console.error('[Pele Protegida] resposta descartada após rejeições do servidor:', outcome.reason);
        await del(key, s);
        pending--;
      } else {
        await set(key, { ...item, attempts } satisfies QueueItem, s);
      }
    }
  }
  return pending;
}
