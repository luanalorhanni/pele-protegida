// =====================================================================
// computeResult(answers) → { flags, preventionResult, messages, ubsAlert }
// Função pura: não acessa rede, armazenamento nem a interface.
// =====================================================================
import {
  FLAGS,
  SIGN_QUESTIONS,
  type Answers,
  type Flag,
  type P23Status,
  type P24Barrier,
} from '../content/questions';
import {
  CAMINHO_TEXT,
  MEASURES,
  MESSAGES,
  PREVENTION_TITLES,
  UBS_TEXTS,
  type MeasureId,
  type MessageCode,
} from '../content/result-texts';
import { cleanAnswers, visibleQuestions } from './conditions';

/** Mesmos valores da coluna `resultado_prevencao` no banco. */
export type PreventionCode = 'atencao' | 'pode_melhorar' | 'caminho';
/** Mesmos valores da coluna `alerta_ubs` no banco (null = sem alerta). */
export type UbsAlertCode = 'sim' | 'incerto';

export interface Tip {
  measure: MeasureId;
  text: string;
}

export interface PreventionResult {
  code: PreventionCode;
  title: string;
  text: string;
  tips: Tip[];
}

export interface ResultMessage {
  code: MessageCode;
  text: string;
}

export interface UbsAlert {
  code: UbsAlertCode;
  title: string;
  intro: string;
  status: P23Status | null;
  statusText: string;
  barriers: { code: P24Barrier; text: string }[];
  showContacts: boolean;
  showSteps: boolean;
}

export interface Result {
  flags: Flag[];
  preventionResult: PreventionResult;
  messages: ResultMessage[];
  ubsAlert: UbsAlert | null;
}

function joinPt(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
}

export function computeResult(rawAnswers: Answers): Result {
  const answers = cleanAnswers(rawAnswers);

  // ---- flags ----
  const flagSet = new Set<Flag>();
  for (const q of visibleQuestions(answers)) {
    if (q.type === 'quiz') continue; // Bloco 4 não entra no resultado
    const v = answers[q.id];
    if (v === undefined) continue;
    const values = Array.isArray(v) ? v : [v];
    for (const o of q.options) {
      if (o.flags && values.includes(o.value)) o.flags.forEach((f) => flagSet.add(f));
    }
  }
  // Regra explícita: quem não trabalha exposto nunca recebe EXP-ALTA.
  if (answers.p1 === 'nao') flagSet.delete('EXP-ALTA');
  const has = (f: Flag) => flagSet.has(f);
  const flags = FLAGS.filter(has); // ordem estável

  // ---- resultado de prevenção ----
  const weak = MEASURES.filter((m) => answers[m.id] === 'as_vezes' || answers[m.id] === 'nunca');
  const tips: Tip[] = weak.map((m) => ({ measure: m.id, text: m.tip }));

  let preventionResult: PreventionResult;
  if (has('PROT-INCOMPLETA') && (has('EXP-ALTA') || has('PELE-RISCO') || has('HISTORICO'))) {
    const why: string[] = [];
    if (has('EXP-ALTA')) {
      if (answers.p2 === '4mais') why.push('passa 4 horas ou mais no sol');
      else if (answers.p1 === '5mais') why.push('trabalha ao sol 5 dias ou mais por semana');
      else if (answers.p1 === '3a4') why.push('trabalha ao sol 3 a 4 dias por semana');
      else if (answers.p3 === 'sempre') why.push('fica no sol entre 10h e 16h quase sempre');
      else why.push('não sabe ao certo quanto tempo fica no sol');
    }
    if (answers.p11 === 'mais_uma') why.push('já teve queimadura de sol com bolhas mais de uma vez');
    else if (answers.p10 === 'queima') why.push('sua pele queima com facilidade');
    if (answers.p12 === 'sim') why.push('já teve câncer de pele');
    else if (answers.p13 === 'sim') why.push('tem caso de câncer de pele na família');
    for (const m of weak) why.push(m[answers[m.id] as 'as_vezes' | 'nunca']);

    preventionResult = {
      code: 'atencao',
      title: PREVENTION_TITLES.atencao,
      text: `Você contou que ${joinPt(why)}. Veja como incluir ${
        weak.length > 1 ? 'esses cuidados' : 'esse cuidado'
      } na sua jornada.`,
      tips,
    };
  } else if (has('PROT-INCOMPLETA')) {
    preventionResult = {
      code: 'pode_melhorar',
      title: PREVENTION_TITLES.pode_melhorar,
      text: `Veja ${weak.length > 1 ? 'os cuidados que podem' : 'o cuidado que pode'} entrar na sua rotina:`,
      tips,
    };
  } else {
    preventionResult = { code: 'caminho', title: PREVENTION_TITLES.caminho, text: CAMINHO_TEXT, tips: [] };
  }

  // ---- mensagens extras ----
  const messages: ResultMessage[] = [];
  const add = (code: MessageCode) => messages.push({ code, text: MESSAGES[code] });
  if (has('SEM-REAPLICAR')) add('SEM-REAPLICAR');
  if (has('POUCA-SOMBRA') && has('EXP-ALTA')) add('POUCA-SOMBRA+EXP-ALTA');
  if (has('SEM-SOMBRA')) add('SEM-SOMBRA');
  if (has('PELE-RISCO') || has('EXP-ACUMULADA')) add('PELE-RISCO|EXP-ACUMULADA');
  if (has('HISTORICO')) add('HISTORICO');

  // ---- aviso da UBS ----
  let ubsAlert: UbsAlert | null = null;
  if (SIGN_QUESTIONS.some((id) => answers[id] === 'sim')) {
    const status = (answers.p23 as P23Status | undefined) ?? null;
    const barriers =
      status === 'nao_procurei' && Array.isArray(answers.p24) ? (answers.p24 as P24Barrier[]) : [];
    ubsAlert = {
      code: 'sim',
      title: UBS_TEXTS.tituloAlteracao,
      intro: UBS_TEXTS.introAlteracao,
      status,
      statusText: status ? UBS_TEXTS.status[status] : '',
      barriers: barriers.map((b) => ({ code: b, text: UBS_TEXTS.barreiras[b] })),
      showContacts: status === 'procurou_sem_consulta' || barriers.includes('horario'),
      showSteps: barriers.includes('nao_sabe_marcar'),
    };
  } else if (SIGN_QUESTIONS.some((id) => answers[id] === 'nao_certeza')) {
    ubsAlert = {
      code: 'incerto',
      title: UBS_TEXTS.tituloDuvida,
      intro: UBS_TEXTS.duvida,
      status: null,
      statusText: '',
      barriers: [],
      showContacts: false,
      showSteps: false,
    };
  }

  return { flags, preventionResult, messages, ubsAlert };
}
