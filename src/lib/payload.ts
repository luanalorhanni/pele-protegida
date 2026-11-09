import { QUESTIONNAIRE_VERSION, type Answers } from '../content/questions';
import type { PreventionCode, Result, UbsAlertCode } from './computeResult';
import { cleanAnswers } from './conditions';

/** Linha da tabela `public.respostas`. Nenhum dado pessoal. */
export interface RespostaRow {
  id: string;
  respondida_em: string;
  consentimento: true;
  respostas: Answers;
  flags: string[];
  resultado_prevencao: PreventionCode;
  alerta_ubs: UbsAlertCode | null;
  versao_questionario: string;
  origem: 'web' | 'pwa';
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // Safari no iOS
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function buildRow(answers: Answers, result: Result, now: Date = new Date()): RespostaRow {
  return {
    id: crypto.randomUUID(),
    respondida_em: now.toISOString(),
    consentimento: true,
    respostas: cleanAnswers(answers),
    flags: [...result.flags],
    resultado_prevencao: result.preventionResult.code,
    alerta_ubs: result.ubsAlert?.code ?? null,
    versao_questionario: QUESTIONNAIRE_VERSION,
    origem: isStandalone() ? 'pwa' : 'web',
  };
}
