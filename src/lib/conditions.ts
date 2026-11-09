import {
  QUESTIONS,
  type AnswerValue,
  type Answers,
  type Condition,
  type Question,
} from '../content/questions';

export function evalCondition(cond: Condition | undefined, answers: Answers): boolean {
  if (!cond) return true;
  if ('any' in cond) {
    return cond.any.some((id) => {
      const v = answers[id];
      return typeof v === 'string' && cond.in.includes(v);
    });
  }
  const v = answers[cond.q];
  if ('in' in cond) return typeof v === 'string' && cond.in.includes(v);
  return typeof v === 'string' && !cond.notIn.includes(v);
}

export function visibleQuestions(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => evalCondition(q.showIf, answers));
}

export function questionText(q: Question, answers: Answers): string {
  return answers.p1 === 'nao' && q.textIfNotExposed ? q.textIfNotExposed : q.text;
}

function isEmpty(v: AnswerValue | undefined): boolean {
  return v === undefined || (Array.isArray(v) && v.length === 0);
}

/**
 * Mantém só as respostas de perguntas visíveis e com valores válidos.
 * Ex.: apaga P2–P4 se P1 = "nao"; apaga P24 se P23 deixou de ser "nao_procurei".
 * Repete até estabilizar, porque apagar uma resposta pode esconder outra pergunta.
 */
export function cleanAnswers(answers: Answers | undefined): Answers {
  let current: Answers = answers ?? {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    const out: Answers = {};
    for (const q of visibleQuestions(current)) {
      const v = current[q.id];
      if (isEmpty(v)) continue;
      const valid = new Set(q.options.map((o) => o.value));
      if (q.type === 'multi') {
        const list = (Array.isArray(v) ? v : [v as string]).filter((x) => valid.has(x));
        // Preserva a ordem das opções e remove duplicados.
        const ordered = q.options.map((o) => o.value).filter((x) => list.includes(x));
        if (ordered.length) out[q.id] = ordered;
      } else if (typeof v === 'string' && valid.has(v)) {
        out[q.id] = v;
      }
    }
    if (sameAnswers(out, current)) return out;
    current = out;
  }
  return current;
}

function sameAnswers(a: Answers, b: Answers): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Se a pergunta já foi respondida (para habilitar "Próxima"). */
export function isAnswered(q: Question, answers: Answers): boolean {
  const v = answers[q.id];
  return q.type === 'multi' ? Array.isArray(v) && v.length > 0 : typeof v === 'string';
}
