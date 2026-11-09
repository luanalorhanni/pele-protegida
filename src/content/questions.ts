// =====================================================================
// Perguntas do questionário Pele Protegida — fonte única de verdade.
//
// - ids estáveis p1…p24 e valores curtos (nunca o texto exibido);
// - cada opção pode gerar códigos internos (flags);
// - `showIf` define quando a pergunta aparece.
//
// Ao mudar textos que alteram o sentido, opções, valores ou condições,
// atualize QUESTIONNAIRE_VERSION para saber qual versão gerou cada resposta.
// =====================================================================

export const QUESTIONNAIRE_VERSION = '2026-11-v1';

export const FLAGS = [
  'EXP-ALTA',
  'PROT-INCOMPLETA',
  'PELE-RISCO',
  'HISTORICO',
  'EXP-ACUMULADA',
  'SEM-REAPLICAR',
  'POUCA-SOMBRA',
  'SEM-SOMBRA',
] as const;
export type Flag = (typeof FLAGS)[number];

export type QuestionId =
  | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9' | 'p10' | 'p11' | 'p12'
  | 'p13' | 'p14' | 'p15' | 'p16' | 'p17' | 'p18' | 'p19' | 'p20' | 'p21' | 'p22' | 'p23' | 'p24';

export type BlockNumber = 1 | 2 | 3 | 4 | 5;

export interface Option {
  value: string;
  label: string;
  flags?: readonly Flag[];
}

/**
 * Condição de exibição:
 * - `{ q, in }`     → a resposta de `q` está na lista;
 * - `{ q, notIn }`  → `q` foi respondida e a resposta NÃO está na lista;
 * - `{ any, in }`   → pelo menos uma das perguntas tem resposta na lista.
 */
export type Condition =
  | { q: QuestionId; in: readonly string[] }
  | { q: QuestionId; notIn: readonly string[] }
  | { any: readonly QuestionId[]; in: readonly string[] };

interface BaseQuestion {
  id: QuestionId;
  block: BlockNumber;
  text: string;
  /** Texto usado quando a pessoa responde em P1 que não trabalha exposta ao sol. */
  textIfNotExposed?: string;
  showIf?: Condition;
  options: readonly Option[];
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single';
}
export interface MultiQuestion extends BaseQuestion {
  type: 'multi';
}
/** Bloco 4: mostra a resposta certa e não entra no resultado. */
export interface QuizQuestion extends BaseQuestion {
  type: 'quiz';
  correct: string;
  explanation: string;
}
export type Question = SingleQuestion | MultiQuestion | QuizQuestion;

export type AnswerValue = string | string[];
export type Answers = Partial<Record<QuestionId, AnswerValue>>;

export const BLOCKS: Record<BlockNumber, string> = {
  1: 'Sua rotina no sol',
  2: 'Sua proteção',
  3: 'Sua pele e seu histórico',
  4: 'O que você sabe',
  5: 'Conheça sua pele',
};
export const BLOCK_COUNT = 5;

const FREQ: readonly Option[] = [
  { value: 'sempre', label: 'Sempre ou quase sempre' },
  { value: 'as_vezes', label: 'Às vezes', flags: ['PROT-INCOMPLETA'] },
  { value: 'nunca', label: 'Nunca ou quase nunca', flags: ['PROT-INCOMPLETA'] },
];

const SIM_NAO_NAOSEI: readonly Option[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'nao_sei', label: 'Não sei' },
];

const SIM_NAO_INCERTO: readonly Option[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'nao_certeza', label: 'Não tenho certeza' },
];

/** P2–P4 só aparecem para quem trabalha exposto ao sol. */
const EXPOSTO: Condition = { q: 'p1', notIn: ['nao'] };

/** Sinais de alerta do Bloco 5. */
export const SIGN_QUESTIONS = ['p19', 'p20', 'p21', 'p22'] as const satisfies readonly QuestionId[];

export const QUESTIONS: readonly Question[] = [
  // ---------------- Bloco 1 — Sua rotina no sol ----------------
  {
    id: 'p1', block: 1, type: 'single',
    text: 'Você trabalha exposto ao sol?',
    options: [
      { value: '1a2', label: 'Sim, 1 a 2 dias por semana' },
      { value: '3a4', label: 'Sim, 3 a 4 dias por semana', flags: ['EXP-ALTA'] },
      { value: '5mais', label: 'Sim, 5 dias ou mais', flags: ['EXP-ALTA'] },
      { value: 'nao', label: 'Não trabalho exposto ao sol' },
    ],
  },
  {
    id: 'p2', block: 1, type: 'single', showIf: EXPOSTO,
    text: 'Nos dias em que trabalha ao sol, quanto tempo costuma ficar exposto?',
    options: [
      { value: 'menos2', label: 'Menos de 2 horas' },
      { value: '2a4', label: 'De 2 horas a menos de 4 horas' },
      { value: '4mais', label: '4 horas ou mais', flags: ['EXP-ALTA'] },
      { value: 'nao_sei', label: 'Não sei dizer', flags: ['EXP-ALTA'] },
    ],
  },
  {
    id: 'p3', block: 1, type: 'single', showIf: EXPOSTO,
    text: 'Com que frequência você trabalha ao sol entre 10h e 16h?',
    options: [
      { value: 'sempre', label: 'Sempre ou quase sempre', flags: ['EXP-ALTA'] },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'nunca', label: 'Nunca ou quase nunca' },
      { value: 'nao_sei', label: 'Não sei dizer', flags: ['EXP-ALTA'] },
    ],
  },
  {
    id: 'p4', block: 1, type: 'single', showIf: EXPOSTO,
    text: 'Há quantos anos você trabalha exposto ao sol?',
    options: [
      { value: 'menos5', label: 'Menos de 5 anos' },
      { value: '5a14', label: 'De 5 a 14 anos' },
      { value: '15mais', label: '15 anos ou mais', flags: ['EXP-ACUMULADA'] },
    ],
  },

  // ---------------- Bloco 2 — Sua proteção ----------------
  {
    id: 'p5', block: 2, type: 'single',
    text: 'Quando trabalha ao sol, você usa chapéu ou proteção para a nuca?',
    textIfNotExposed: 'Quando fica ao sol, você usa chapéu ou proteção para a nuca?',
    options: FREQ,
  },
  {
    id: 'p6', block: 2, type: 'single',
    text: 'Quando trabalha ao sol, você usa camisa de manga comprida?',
    textIfNotExposed: 'Quando fica ao sol, você usa camisa de manga comprida?',
    options: FREQ,
  },
  {
    id: 'p7', block: 2, type: 'single',
    text: 'Quando trabalha ao sol, você usa protetor solar?',
    textIfNotExposed: 'Quando fica ao sol, você usa protetor solar?',
    options: FREQ,
  },
  {
    id: 'p8', block: 2, type: 'single', showIf: { q: 'p7', in: ['sempre', 'as_vezes'] },
    text: 'Você reaplica o protetor durante o dia?',
    options: [
      { value: 'sim', label: 'Sim, a cada 2 horas ou depois de suar ou me molhar' },
      { value: 'uma_vez', label: 'Passo só uma vez', flags: ['SEM-REAPLICAR'] },
      { value: 'as_vezes', label: 'Às vezes reaplico', flags: ['SEM-REAPLICAR'] },
    ],
  },
  {
    id: 'p9', block: 2, type: 'single',
    text: 'Nas pausas do trabalho, você costuma ficar na sombra?',
    textIfNotExposed: 'Quando fica ao sol, você costuma fazer pausas na sombra?',
    options: [
      { value: 'sempre', label: 'Sempre ou quase sempre' },
      { value: 'as_vezes', label: 'Às vezes', flags: ['POUCA-SOMBRA'] },
      { value: 'nunca', label: 'Nunca ou quase nunca', flags: ['POUCA-SOMBRA'] },
      { value: 'sem_sombra', label: 'No meu trabalho não tem sombra', flags: ['SEM-SOMBRA'] },
    ],
  },

  // ---------------- Bloco 3 — Sua pele e seu histórico ----------------
  {
    id: 'p10', block: 3, type: 'single',
    text: 'Quando fica no sol sem proteção, o que acontece com sua pele?',
    options: [
      { value: 'queima', label: 'Fica vermelha ou queima e quase não escurece', flags: ['PELE-RISCO'] },
      { value: 'vermelha_escurece', label: 'Fica vermelha e depois escurece' },
      { value: 'escurece', label: 'Escurece e quase nunca fica vermelha' },
      { value: 'nao_sei', label: 'Não sei dizer' },
    ],
  },
  {
    id: 'p11', block: 3, type: 'single',
    text: 'Já teve queimadura de sol com bolhas ou com a pele soltando?',
    options: [
      { value: 'mais_uma', label: 'Sim, mais de uma vez', flags: ['PELE-RISCO'] },
      { value: 'uma_vez', label: 'Sim, uma vez' },
      { value: 'nunca', label: 'Nunca' },
      { value: 'nao_lembro', label: 'Não lembro' },
    ],
  },
  {
    id: 'p12', block: 3, type: 'single',
    text: 'Você já teve câncer de pele?',
    options: [
      { value: 'sim', label: 'Sim', flags: ['HISTORICO'] },
      { value: 'nao', label: 'Não' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
  },
  {
    id: 'p13', block: 3, type: 'single',
    text: 'Alguém da sua família (pai, mãe, irmãos ou filhos) já teve câncer de pele?',
    options: [
      { value: 'sim', label: 'Sim', flags: ['HISTORICO'] },
      { value: 'nao', label: 'Não' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
  },

  // ---------------- Bloco 4 — O que você sabe (não entra no resultado) ----------------
  {
    id: 'p14', block: 4, type: 'quiz', options: SIM_NAO_NAOSEI, correct: 'sim',
    text: 'O câncer de pele pode atingir pessoas de pele negra?',
    explanation:
      'O risco é menor, mas existe. Muitas vezes aparece na sola dos pés, na palma das mãos e embaixo das unhas, e costuma ser descoberto mais tarde.',
  },
  {
    id: 'p15', block: 4, type: 'quiz', options: SIM_NAO_NAOSEI, correct: 'sim',
    text: 'O sol que a gente pega ao longo dos anos aumenta o risco?',
    explanation: 'O efeito do sol se acumula na pele. Quem trabalha anos ao ar livre tem mais risco.',
  },
  {
    id: 'p16', block: 4, type: 'quiz', options: SIM_NAO_NAOSEI, correct: 'sim',
    text: 'Uma ferida que não sara pode ser sinal de alerta?',
    explanation: 'Ferida que não cicatriza em 4 semanas precisa ser vista na UBS.',
  },
  {
    id: 'p17', block: 4, type: 'quiz', options: SIM_NAO_NAOSEI, correct: 'nao',
    text: 'O câncer de pele sempre causa dor?',
    explanation: 'No começo ele quase nunca dói nem coça. Por isso é importante olhar a pele.',
  },
  {
    id: 'p18', block: 4, type: 'quiz', options: SIM_NAO_NAOSEI, correct: 'nao',
    text: 'O protetor solar substitui o chapéu e a camisa de manga comprida?',
    explanation:
      'Ele sai com o suor e a água, e quem só usa protetor tende a ficar mais tempo no sol. Combine protetor, roupa, chapéu e sombra.',
  },

  // ---------------- Bloco 5 — Conheça sua pele ----------------
  {
    id: 'p19', block: 5, type: 'single', options: SIM_NAO_INCERTO,
    text: 'Apareceu uma pinta nova depois de adulto, ou alguma pinta mudou de tamanho, formato ou cor?',
  },
  {
    id: 'p20', block: 5, type: 'single', options: SIM_NAO_INCERTO,
    text: 'Você tem alguma ferida que não sara há mais de 4 semanas?',
  },
  {
    id: 'p21', block: 5, type: 'single', options: SIM_NAO_INCERTO,
    text: 'Você tem alguma mancha, caroço ou ferida que sangra com facilidade ou que está crescendo?',
  },
  {
    id: 'p22', block: 5, type: 'single', options: SIM_NAO_INCERTO,
    text: 'Você tem alguma ferida, casca ou mancha esbranquiçada no lábio que não melhora?',
  },
  {
    id: 'p23', block: 5, type: 'single', showIf: { any: SIGN_QUESTIONS, in: ['sim'] },
    text: 'Essa alteração já foi avaliada por um profissional de saúde?',
    options: [
      { value: 'avaliada', label: 'Sim, já foi avaliada' },
      { value: 'consulta_marcada', label: 'Ainda não, mas tenho consulta marcada' },
      { value: 'procurou_sem_consulta', label: 'Já procurei, mas ainda não tenho consulta' },
      { value: 'nao_procurei', label: 'Ainda não procurei atendimento' },
    ],
  },
  {
    id: 'p24', block: 5, type: 'multi', showIf: { q: 'p23', in: ['nao_procurei'] },
    text: 'O que dificulta você procurar a UBS?',
    options: [
      { value: 'horario', label: 'O horário da UBS bate com meu trabalho' },
      { value: 'distancia', label: 'A UBS é longe ou é difícil chegar' },
      { value: 'nao_importante', label: 'Achei que não era importante' },
      { value: 'medo', label: 'Tenho medo do que pode ser' },
      { value: 'nao_sabe_marcar', label: 'Não sei como marcar' },
      { value: 'outro', label: 'Outro motivo' },
    ],
  },
];

export type P23Status = 'avaliada' | 'consulta_marcada' | 'procurou_sem_consulta' | 'nao_procurei';
export type P24Barrier = 'horario' | 'distancia' | 'nao_importante' | 'medo' | 'nao_sabe_marcar' | 'outro';
