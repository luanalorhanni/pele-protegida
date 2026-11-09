import { enqueue, flushQueue, type SendOutcome } from './queue';
import type { RespostaRow } from './payload';
import { getSupabase } from './supabase';

/** Código do Postgres para chave duplicada: a linha já foi gravada antes. */
const UNIQUE_VIOLATION = '23505';

/**
 * Envia uma linha ao Supabase.
 * IMPORTANTE: sem `.select()` depois do insert — o papel anon não tem permissão de leitura.
 */
export async function sendRow(row: RespostaRow): Promise<SendOutcome> {
  const pending = getSupabase();
  if (!pending) return { ok: false, retry: true };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, retry: true };

  const supabase = await pending;
  const { error, status } = await supabase.from('respostas').insert(row);
  if (!error) return { ok: true };
  if (error.code === UNIQUE_VIOLATION) return { ok: true }; // reenvio da fila: já está no banco

  // 4xx com código do Postgres/PostgREST = dado rejeitado. Demais casos = rede/servidor.
  const rejected = status >= 400 && status < 500 && status !== 408 && status !== 429 && !!error.code;
  return rejected
    ? { ok: false, retry: false, reason: `${error.code}: ${error.message}` }
    : { ok: false, retry: true };
}

export type SubmitStatus = 'enviada' | 'na_fila';

/** Guarda a resposta na fila local e tenta enviar na hora. */
export async function submitResponse(row: RespostaRow): Promise<SubmitStatus> {
  await enqueue(row);
  const pending = await flushQueue(sendRow);
  return pending === 0 ? 'enviada' : 'na_fila';
}

/** Liga o envio automático da fila: agora (abertura do app) e sempre que a conexão voltar. */
export function startQueueSync(onChange?: (pending: number) => void): () => void {
  const run = () => {
    flushQueue(sendRow)
      .then((n) => onChange?.(n))
      .catch(() => {
        /* IndexedDB indisponível (ex.: navegação privada antiga): nada a fazer */
      });
  };
  run();
  window.addEventListener('online', run);
  const onVisible = () => {
    if (document.visibilityState === 'visible') run();
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    window.removeEventListener('online', run);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
