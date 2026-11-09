import { describe, expect, it } from 'vitest';
import { QUESTIONS, type Answers } from '../content/questions';
import { computeResult } from './computeResult';
import { cleanAnswers, visibleQuestions } from './conditions';

const ids = (answers: Answers) => visibleQuestions(answers).map((q) => q.id);

/** Exemplo "atenção" do protótipo (tela 5a). */
const ATENCAO: Answers = {
  p1: '5mais', p2: '4mais', p3: 'sempre', p4: '15mais',
  p5: 'as_vezes', p6: 'nunca', p7: 'as_vezes', p8: 'uma_vez', p9: 'sem_sombra',
  p10: 'vermelha_escurece', p11: 'uma_vez', p12: 'nao', p13: 'nao',
  p14: 'nao', p15: 'sim', p16: 'sim', p17: 'nao', p18: 'nao',
  p19: 'nao', p20: 'sim', p21: 'nao', p22: 'nao_certeza',
  p23: 'nao_procurei', p24: ['horario', 'medo'],
};

/** Exemplo "caminho" do protótipo (tela 5b). */
const CAMINHO: Answers = {
  p1: '1a2', p2: 'menos2', p3: 'nunca', p4: 'menos5',
  p5: 'sempre', p6: 'sempre', p7: 'sempre', p8: 'sim', p9: 'sempre',
  p10: 'escurece', p11: 'nunca', p12: 'nao', p13: 'nao',
  p14: 'sim', p15: 'sim', p16: 'sim', p17: 'nao', p18: 'nao',
  p19: 'nao', p20: 'nao', p21: 'nao', p22: 'nao',
};

describe('configuração das perguntas', () => {
  it('tem 24 perguntas com ids p1…p24 únicos e em ordem', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(Array.from({ length: 24 }, (_, i) => `p${i + 1}`));
  });

  it('não repete valores dentro de uma pergunta', () => {
    for (const q of QUESTIONS) {
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size, q.id).toBe(values.length);
    }
  });
});

describe('"Sua rotina exige atenção!" com aviso da UBS', () => {
  const r = computeResult(ATENCAO);

  it('classifica como atenção e explica o porquê', () => {
    expect(r.preventionResult.code).toBe('atencao');
    expect(r.preventionResult.title).toBe('Sua rotina exige atenção!');
    expect(r.preventionResult.text).toBe(
      'Você contou que passa 4 horas ou mais no sol, usa chapéu ou proteção para a nuca só às vezes, ' +
        'quase nunca usa camisa de manga comprida e usa protetor só às vezes. ' +
        'Veja como incluir esses cuidados na sua jornada.',
    );
    expect(r.preventionResult.tips.map((t) => t.measure)).toEqual(['p5', 'p6', 'p7']);
  });

  it('gera os flags esperados', () => {
    expect(r.flags).toEqual(['EXP-ALTA', 'PROT-INCOMPLETA', 'EXP-ACUMULADA', 'SEM-REAPLICAR', 'SEM-SOMBRA']);
  });

  it('mostra as mensagens extras na ordem do design', () => {
    expect(r.messages.map((m) => m.code)).toEqual(['SEM-REAPLICAR', 'SEM-SOMBRA', 'PELE-RISCO|EXP-ACUMULADA']);
  });

  it('mostra o aviso da UBS com barreiras e contatos', () => {
    expect(r.ubsAlert).not.toBeNull();
    expect(r.ubsAlert!.code).toBe('sim');
    expect(r.ubsAlert!.status).toBe('nao_procurei');
    expect(r.ubsAlert!.barriers.map((b) => b.code)).toEqual(['horario', 'medo']);
    expect(r.ubsAlert!.showContacts).toBe(true); // barreira "horario"
    expect(r.ubsAlert!.showSteps).toBe(false);
  });
});

describe('"Você está no caminho da prevenção!" sem aviso', () => {
  const r = computeResult(CAMINHO);

  it('classifica como caminho, sem dicas, mensagens nem aviso', () => {
    expect(r.preventionResult.code).toBe('caminho');
    expect(r.preventionResult.title).toBe('Você está no caminho da prevenção!');
    expect(r.preventionResult.tips).toEqual([]);
    expect(r.flags).toEqual([]);
    expect(r.messages).toEqual([]);
    expect(r.ubsAlert).toBeNull();
  });
});

describe('"Sua proteção pode melhorar!"', () => {
  it('quando a proteção é incompleta mas não há outro fator de risco', () => {
    const r = computeResult({ ...CAMINHO, p6: 'as_vezes' });
    expect(r.preventionResult.code).toBe('pode_melhorar');
    expect(r.preventionResult.text).toBe('Veja o cuidado que pode entrar na sua rotina:');
    expect(r.preventionResult.tips.map((t) => t.measure)).toEqual(['p6']);
  });
});

describe('quem responde "Não trabalho exposto ao sol"', () => {
  const answers: Answers = {
    ...CAMINHO,
    p1: 'nao',
    p2: 'nao_sei', p3: 'sempre', p4: '15mais', // respostas antigas que devem ser descartadas
    p5: 'nunca', p9: 'nunca',
  };

  it('pula P2–P4', () => {
    const v = ids(answers);
    expect(v).not.toContain('p2');
    expect(v).not.toContain('p3');
    expect(v).not.toContain('p4');
    expect(v).toHaveLength(24 - 3 - 2); // sem P2–P4, P23 e P24
    expect(cleanAnswers(answers)).not.toHaveProperty('p2');
  });

  it('nunca recebe EXP-ALTA nem EXP-ACUMULADA e cai em "pode melhorar"', () => {
    const r = computeResult(answers);
    expect(r.flags).not.toContain('EXP-ALTA');
    expect(r.flags).not.toContain('EXP-ACUMULADA');
    expect(r.flags).toEqual(['PROT-INCOMPLETA', 'POUCA-SOMBRA']);
    expect(r.preventionResult.code).toBe('pode_melhorar');
    // POUCA-SOMBRA sozinha (sem EXP-ALTA) não gera mensagem.
    expect(r.messages).toEqual([]);
  });

  it('com histórico de câncer ainda pode chegar a "atenção"', () => {
    const r = computeResult({ ...answers, p12: 'sim' });
    expect(r.preventionResult.code).toBe('atencao');
    expect(r.preventionResult.text).toBe(
      'Você contou que já teve câncer de pele e quase nunca usa chapéu ou proteção para a nuca. ' +
        'Veja como incluir esse cuidado na sua jornada.',
    );
  });
});

describe('condicional P8 (reaplicação)', () => {
  it('aparece quando P7 = sempre ou às vezes', () => {
    expect(ids({ p1: '1a2', p7: 'sempre' })).toContain('p8');
    expect(ids({ p1: '1a2', p7: 'as_vezes' })).toContain('p8');
  });

  it('some quando P7 = nunca ou ainda não respondida', () => {
    expect(ids({ p1: '1a2', p7: 'nunca' })).not.toContain('p8');
    expect(ids({ p1: '1a2' })).not.toContain('p8');
  });

  it('resposta antiga de P8 é descartada se P7 mudar para nunca', () => {
    const r = computeResult({ ...CAMINHO, p7: 'nunca', p8: 'uma_vez' });
    expect(r.flags).not.toContain('SEM-REAPLICAR');
    expect(r.messages.map((m) => m.code)).not.toContain('SEM-REAPLICAR');
  });

  it('gera SEM-REAPLICAR quando passa só uma vez', () => {
    const r = computeResult({ ...CAMINHO, p8: 'uma_vez' });
    expect(r.flags).toContain('SEM-REAPLICAR');
    expect(r.messages.map((m) => m.code)).toEqual(['SEM-REAPLICAR']);
  });
});

describe('condicionais P23 e P24', () => {
  it('P23 aparece se qualquer P19–P22 for "Sim"', () => {
    for (const id of ['p19', 'p20', 'p21', 'p22'] as const) {
      expect(ids({ ...CAMINHO, [id]: 'sim' })).toContain('p23');
    }
  });

  it('P23 não aparece com "Não" ou "Não tenho certeza"', () => {
    expect(ids(CAMINHO)).not.toContain('p23');
    expect(ids({ ...CAMINHO, p19: 'nao_certeza' })).not.toContain('p23');
  });

  it('P24 só aparece quando P23 = "Ainda não procurei atendimento"', () => {
    const base = { ...CAMINHO, p20: 'sim' };
    expect(ids({ ...base, p23: 'nao_procurei' })).toContain('p24');
    expect(ids({ ...base, p23: 'avaliada' })).not.toContain('p24');
    expect(ids({ ...base, p23: 'procurou_sem_consulta' })).not.toContain('p24');
    expect(ids(base)).not.toContain('p24');
  });

  it('se P20 voltar para "Não", P23 e P24 são descartadas em cascata', () => {
    const clean = cleanAnswers({ ...CAMINHO, p23: 'nao_procurei', p24: ['medo'] });
    expect(clean).not.toHaveProperty('p23');
    expect(clean).not.toHaveProperty('p24');
    expect(computeResult({ ...CAMINHO, p23: 'nao_procurei', p24: ['medo'] }).ubsAlert).toBeNull();
  });

  it('P23 = procurou sem consulta mostra contatos; "não sei marcar" mostra o passo a passo', () => {
    const a = computeResult({ ...CAMINHO, p21: 'sim', p23: 'procurou_sem_consulta' }).ubsAlert!;
    expect(a.statusText).toBe('Volte à UBS e pergunte sobre a sua marcação.');
    expect(a.showContacts).toBe(true);
    expect(a.barriers).toEqual([]);

    const b = computeResult({ ...CAMINHO, p21: 'sim', p23: 'nao_procurei', p24: ['nao_sabe_marcar'] }).ubsAlert!;
    expect(b.showSteps).toBe(true);
    expect(b.showContacts).toBe(false);
  });

  it('P24 ignora valores inválidos e mantém a ordem das opções', () => {
    const clean = cleanAnswers({ ...CAMINHO, p19: 'sim', p23: 'nao_procurei', p24: ['medo', 'xyz', 'horario', 'medo'] });
    expect(clean.p24).toEqual(['horario', 'medo']);
  });
});

describe('"Não tenho certeza" sem nenhum "Sim" nas P19–P22', () => {
  const answers: Answers = { ...CAMINHO, p19: 'nao_certeza', p22: 'nao_certeza' };
  const r = computeResult(answers);

  it('não mostra P23', () => {
    expect(ids(answers)).not.toContain('p23');
  });

  it('mostra o aviso de dúvida (incerto)', () => {
    expect(r.ubsAlert).toEqual({
      code: 'incerto',
      title: 'Ficou em dúvida sobre a sua pele?',
      intro: 'Se você percebeu uma alteração e está em dúvida, converse com a equipe da UBS. Ela pode olhar sua pele.',
      status: null,
      statusText: '',
      barriers: [],
      showContacts: false,
      showSteps: false,
    });
  });

  it('"Sim" em qualquer sinal tem prioridade sobre "Não tenho certeza"', () => {
    expect(computeResult({ ...answers, p21: 'sim' }).ubsAlert!.code).toBe('sim');
  });
});

describe('texto da barreira "horário"', () => {
  it('usa o horário configurado em ubs.ts', () => {
    const a = computeResult({ ...CAMINHO, p20: 'sim', p23: 'nao_procurei', p24: ['horario'] }).ubsAlert!;
    expect(a.barriers[0].text).toMatch(/^A UBS atende de segunda a sexta, das 7h às 18h\. /);
  });
});
