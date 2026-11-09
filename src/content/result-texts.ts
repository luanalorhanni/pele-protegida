// Textos usados por computeResult(). Edite aqui sem mexer na lógica.
import type { P23Status, P24Barrier } from './questions';
import { UBS } from './ubs';

export type MeasureId = 'p5' | 'p6' | 'p7';

/** Medidas de proteção avaliadas no resultado (P5–P7). */
export const MEASURES: readonly {
  id: MeasureId;
  as_vezes: string;
  nunca: string;
  tip: string;
}[] = [
  {
    id: 'p5',
    as_vezes: 'usa chapéu ou proteção para a nuca só às vezes',
    nunca: 'quase nunca usa chapéu ou proteção para a nuca',
    tip: 'Use chapéu de aba larga que cubra rosto, orelhas e nuca. Boné deixa orelhas e nuca de fora.',
  },
  {
    id: 'p6',
    as_vezes: 'usa camisa de manga comprida só às vezes',
    nunca: 'quase nunca usa camisa de manga comprida',
    tip: 'Use camisa leve de manga comprida. Ela protege braços e ombros por todo o dia, sem precisar reaplicar.',
  },
  {
    id: 'p7',
    as_vezes: 'usa protetor só às vezes',
    nunca: 'quase nunca usa protetor',
    tip: 'Leve o protetor e passe nas áreas descobertas: rosto, orelhas, nuca e mãos.',
  },
];

export type MessageCode =
  | 'SEM-REAPLICAR'
  | 'POUCA-SOMBRA+EXP-ALTA'
  | 'SEM-SOMBRA'
  | 'PELE-RISCO|EXP-ACUMULADA'
  | 'HISTORICO';

export const MESSAGES: Record<MessageCode, string> = {
  'SEM-REAPLICAR': 'O protetor perde efeito com o suor e a água. Leve o frasco e reaplique a cada 2 horas.',
  'POUCA-SOMBRA+EXP-ALTA':
    'Quando der, faça as pausas na sombra e deixe para depois das 16h as tarefas que podem esperar.',
  'SEM-SOMBRA':
    'Se no seu trabalho não tem sombra, chapéu de aba larga e camisa de manga comprida são ainda mais importantes.',
  'PELE-RISCO|EXP-ACUMULADA':
    'Sua pele precisa de mais cuidado com o sol. Olhe sua pele uma vez por mês e peça para alguém olhar suas costas.',
  HISTORICO:
    'Quem tem histórico de câncer de pele, próprio ou na família, deve ter a pele examinada regularmente. Conte isso à equipe da UBS na próxima consulta.',
};

export const PREVENTION_TITLES = {
  atencao: 'Sua rotina exige atenção!',
  pode_melhorar: 'Sua proteção pode melhorar!',
  caminho: 'Você está no caminho da prevenção!',
} as const;

export const CAMINHO_TEXT =
  'Você contou que usa chapéu, manga comprida e protetor com frequência. Continue combinando esses cuidados.';

export const UBS_TEXTS: {
  tituloAlteracao: string;
  introAlteracao: string;
  status: Record<P23Status, string>;
  barreiras: Record<P24Barrier, string>;
  tituloDuvida: string;
  duvida: string;
} = {
  tituloAlteracao: 'Uma alteração na pele merece atenção',
  introAlteracao:
    'Você contou que notou uma mudança na pele. Isso não quer dizer que seja algo grave, mas vale mostrar para a equipe da UBS.',
  status: {
    avaliada: 'Siga o que foi combinado com a equipe. Se a alteração mudar, crescer ou sangrar, volte à UBS.',
    consulta_marcada: 'Ótimo! Não falte. Se piorar antes da data, procure a UBS.',
    procurou_sem_consulta: 'Volte à UBS e pergunte sobre a sua marcação.',
    nao_procurei: 'Procure a UBS para mostrar essa alteração. Veja o que pode ajudar:',
  },
  barreiras: {
    horario: `A UBS atende ${UBS.horarioFrase}. Se não der para ir nesse horário, ligue ou mande mensagem, ou fale com o agente comunitário de saúde da sua área.`,
    distancia: 'Fale com o agente comunitário de saúde da sua área. Ele pode orientar e ajudar a marcar.',
    nao_importante: 'Uma alteração que não melhora merece ser vista, mesmo sem dor.',
    medo: 'Quanto mais cedo o câncer de pele é visto, mais simples costuma ser o tratamento.',
    nao_sabe_marcar: 'Veja abaixo o passo a passo para marcar.',
    outro:
      'Converse com a equipe da UBS ou com o agente comunitário de saúde. Eles podem ajudar a encontrar um jeito.',
  },
  tituloDuvida: 'Ficou em dúvida sobre a sua pele?',
  duvida:
    'Se você percebeu uma alteração e está em dúvida, converse com a equipe da UBS. Ela pode olhar sua pele.',
};
