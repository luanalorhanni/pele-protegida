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
