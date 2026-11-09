// =====================================================================
// Dados da UBS. Os itens entre [colchetes] são PLACEHOLDERS: substitua
// pelos dados reais antes de publicar.
// =====================================================================

export interface UbsConfig {
  nome: string;
  apoio: string;
  endereco: string;
  mapaUrl: string;
  /** Texto exibido. */
  telefone: string;
  /** Link `tel:` no formato internacional, sem espaços. */
  telefoneLink: string;
  whatsapp: string;
  /** Link `https://wa.me/55DDDNUMERO` (só dígitos). */
  whatsappLink: string;
  horario: string;
  /** O mesmo horário no meio de uma frase: "A UBS atende {horarioFrase}." */
  horarioFrase: string;
  comoMarcar: string[];
  oQueLevar: string;
  agente: string;
}

export const UBS: UbsConfig = {
  nome: 'Centro de Saúde Embrião Anexo Sá Viana',
  apoio: 'União dos Moradores',
  endereco: 'R. Cônego Ribamar Carvalho, Sá Viana, São Luís - MA, 65080-580',
  mapaUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Centro de Saúde Embrião Anexo Sá Viana, R. Cônego Ribamar Carvalho, Sá Viana, São Luís - MA, 65080-580'),
  telefone: '(98) 98549-3678',
  telefoneLink: 'tel:+5598985493678',
  // Mesmo número do contato. Confirme se ele atende pelo WhatsApp.
  whatsapp: '(98) 98549-3678',
  whatsappLink: 'https://wa.me/5598985493678',
  horario: 'Segunda a sexta, das 7h às 18h',
  horarioFrase: 'de segunda a sexta, das 7h às 18h',
  comoMarcar: [
    '[Passo 1 — ex.: vá à recepção da UBS ou mande mensagem no WhatsApp]',
    '[Passo 2 — ex.: diga que quer uma consulta para olhar a pele]',
    '[Passo 3 — ex.: anote o dia e a hora da consulta]',
  ],
  oQueLevar: 'Documento com foto e Cartão do SUS',
  agente: 'Trabalha no horário da UBS? Fale com o agente comunitário de saúde da sua área.',
};
