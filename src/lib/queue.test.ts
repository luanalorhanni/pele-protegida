import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clear, createStore } from 'idb-keyval';
import { enqueue, flushQueue, pendingCount, type Sender } from './queue';
import type { RespostaRow } from './payload';

const row = (id: string, minute: number): RespostaRow => ({
  id,
  respondida_em: `2026-11-09T12:${String(minute).padStart(2, '0')}:00.000Z`,
  consentimento: true,
  respostas: { p1: 'nao' },
  flags: [],
  resultado_prevencao: 'caminho',
  alerta_ubs: null,
  versao_questionario: 'teste',
  origem: 'web',
});

beforeEach(async () => {
  await clear(createStore('pele-protegida', 'fila-respostas'));
});

describe('fila offline', () => {
  it('mantém as respostas enquanto está offline e envia quando a conexão volta', async () => {
    await enqueue(row('a', 1));
    await enqueue(row('b', 2));

    const offline: Sender = vi.fn(async () => ({ ok: false, retry: true }) as const);
    expect(await flushQueue(offline)).toBe(2);
    expect(offline).toHaveBeenCalledTimes(1); // para na primeira falha de rede

    const online = vi.fn<Sender>(async () => ({ ok: true }));
    expect(await flushQueue(online)).toBe(0);
    expect(online.mock.calls.map(([r]) => r.id)).toEqual(['a', 'b']); // ordem de resposta
    expect(await pendingCount()).toBe(0);
  });

  it('descarta um item rejeitado pelo banco depois de 5 tentativas', async () => {
    await enqueue(row('ruim', 1));
    const reject: Sender = async () => ({ ok: false, retry: false, reason: '23514: check' });
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    for (let i = 0; i < 4; i++) expect(await flushQueue(reject)).toBe(1);
    expect(await flushQueue(reject)).toBe(0);
    expect(err).toHaveBeenCalledOnce();
  });

  it('chamadas simultâneas não enviam a mesma resposta duas vezes', async () => {
    await enqueue(row('x', 1));
    const send = vi.fn<Sender>(async () => ({ ok: true }));
    await Promise.all([flushQueue(send), flushQueue(send), flushQueue(send)]);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
