// Textos fixos das telas Checklist, Consentimento e rodapé.
import type { IconName } from '../components/icons';

export interface ChecklistItem {
  id: string;
  icon: IconName;
  t: string;
  d: string;
}

export const CHECKLIST: readonly { title: string; items: readonly ChecklistItem[] }[] = [
  {
    title: 'Antes de sair',
    items: [
      { id: 'chapeu', icon: 'hat', t: 'Chapéu de aba larga', d: 'Protege rosto, orelhas e nuca.' },
      { id: 'camisa', icon: 'shirt', t: 'Camisa leve de manga comprida', d: 'Cobre braços e ombros o dia todo.' },
      { id: 'oculos', icon: 'glasses', t: 'Óculos escuros com proteção UV', d: 'Protege os olhos do sol e do reflexo.' },
      {
        id: 'protetor', icon: 'bottle', t: 'Protetor FPS 30 ou mais, amplo espectro (UVA/UVB)',
        d: 'Passe antes de sair, inclusive nas orelhas, na nuca e no dorso das mãos. Leve o frasco para reaplicar.',
      },
      { id: 'labial', icon: 'lips', t: 'Protetor labial com FPS', d: 'Os lábios também queimam no sol.' },
    ],
  },
  {
    title: 'Durante o dia',
    items: [
      { id: 'reaplicar', icon: 'clock', t: 'Reaplique o protetor a cada 2 horas', d: 'E sempre depois de suar, nadar ou se enxugar.' },
      {
        id: 'horario', icon: 'sun', t: 'Entre 10h e 16h o sol é mais forte',
        d: 'Deixe para esse horário as tarefas que dá para fazer na sombra, como separar o pescado e organizar as redes.',
      },
      { id: 'sombra', icon: 'shade', t: 'Faça pausas na sombra', d: 'O reflexo na água e na areia aumenta a exposição ao sol.' },
    ],
  },
  {
    title: 'Lembretes',
    items: [
      { id: 'nublado', icon: 'cloud', t: 'Dia nublado também exige proteção', d: 'O sol que faz mal passa pelas nuvens.' },
      { id: 'licenca', icon: 'wave', t: 'Protetor não é licença para ficar mais tempo no sol', d: 'Combine protetor, roupa, chapéu e sombra.' },
      {
        id: 'app', icon: 'phone', t: 'Veja o índice UV no celular',
        d: 'O app gratuito SunSmart Global UV, da OMS, mostra o índice do dia. A partir de 3, use proteção.',
      },
    ],
  },
  {
    title: 'Uma vez por mês',
    items: [
      { id: 'espelho', icon: 'mirror', t: 'Olhe sua pele com espelho e boa luz', d: 'Repare em pintas, manchas e feridas.' },
      { id: 'ajuda', icon: 'people', t: 'Peça para alguém de casa olhar', d: 'Costas, nuca e couro cabeludo são difíceis de ver sozinho.' },
      { id: 'ubs', icon: 'house', t: 'Notou algo diferente? Procure a UBS', d: 'No começo, o câncer de pele geralmente não dói.' },
    ],
  },
];

export const CONSENT_ITEMS: readonly { icon: IconName; t: string }[] = [
  { icon: 'clock', t: 'As perguntas levam cerca de 5 minutos.' },
  { icon: 'person', t: 'Você não precisa informar nome, CPF ou telefone.' },
  {
    icon: 'lock',
    t: 'As respostas são guardadas sem identificação e usadas apenas para planejar ações de saúde da UBS e para um trabalho acadêmico.',
  },
  { icon: 'pause', t: 'Você pode parar a qualquer momento.' },
];

export const FOOTER_TEXT =
  'Este site dá orientações de prevenção e ajuda a perceber sinais na pele que merecem atenção. Ele não faz diagnóstico e não substitui uma consulta. Em caso de dúvida, procure a UBS.';

export const FOOTER_CREDITS = {
  eixo: 'Eixo Interação Ensino Serviço Comunidade e Gestão V (IESCG V)',
  pessoas: [
    { papel: 'Orientador', nomes: 'Prof. Me. Fernando Bacelar' },
    { papel: 'Preceptora', nomes: 'Dra. Ariane Sousa' },
    {
      papel: 'Acadêmicos',
      nomes: 'Alexandre Lobato, José Carlos, José Ferreira, Laura Miranda, Leylane Lopes, Lívia Lorhanni',
    },
  ],
};

// Referências no formato ABNT: `destaque` é o trecho em negrito (título do periódico/obra).
export const REFERENCIAS: { antes: string; destaque: string; depois: string; url?: string }[] = [
  {
    antes:
      'FACCENDA, P. H.; FREITAS, C. S.; MARCON, C. L. V. Hábitos de proteção solar de pacientes atendidos em uma unidade de saúde na Região Sul do Brasil. ',
    destaque: 'Revista Brasileira de Medicina de Família e Comunidade',
    depois: ', Rio de Janeiro, v. 18, n. 45, 3427, 2023.',
  },
  {
    antes: 'FITZPATRICK, T. B. The validity and practicality of sun-reactive skin types I through VI. ',
    destaque: 'Archives of Dermatology',
    depois: ', Chicago, v. 124, n. 6, p. 869-871, 1988.',
  },
  {
    antes:
      'GOMES, K. A. N. F. et al. Políticas públicas, Estado e prevenção do câncer de pele relacionado à exposição ocupacional: uma revisão integrativa. ',
    destaque: 'Revista Brasileira de Medicina do Trabalho',
    depois: ', São Paulo, v. 23, n. 3, e20251477, 2025.',
  },
  {
    antes: 'INSTITUTO NACIONAL DE CÂNCER (Brasil). ',
    destaque: 'Câncer de pele não melanoma',
    depois:
      '. Rio de Janeiro: INCA, [2024]. Disponível em: https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-nao-melanoma. Acesso em: 11 nov. 2026.',
    url: 'https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-nao-melanoma',
  },
  {
    antes:
      'KARLSSON, E. et al. Validation of SEPI in German: a German translation of the Sun Exposure and Protection Index. ',
    destaque: 'International Journal of Environmental Research and Public Health',
    depois: ', Basel, v. 17, n. 17, 6172, 2020.',
  },
  {
    antes: 'KNIPPING, S. et al. Translation and validation of the Dutch version of the Sun Exposure and Protection Index. ',
    destaque: 'Dermatology',
    depois: ', Basel, v. 240, n. 2, p. 282-290, 2024.',
  },
  {
    antes:
      'MAGALHÃES, L. A. et al. Prevenção e diagnóstico precoce de câncer de pele: avanços, fatores de risco e estratégias futuras. ',
    destaque: 'Brazilian Journal of Health Review',
    depois: ', Curitiba, v. 7, n. 5, p. 1-9, 2024.',
  },
  {
    antes: 'SCHALKA, S. et al. Consenso Brasileiro de Fotoproteção. ',
    destaque: 'Anais Brasileiros de Dermatologia',
    depois: ', Rio de Janeiro, v. 89, n. 6, supl. 1, p. 1-74, 2014.',
  },
  {
    antes: 'WORLD HEALTH ORGANIZATION. ',
    destaque: 'Global solar UV index',
    depois: ': a practical guide. Geneva: WHO, 2002.',
  },
  {
    antes: 'WORLD HEALTH ORGANIZATION. ',
    destaque: 'Guide to cancer early diagnosis',
    depois: '. Geneva: WHO, 2017.',
  },
];
