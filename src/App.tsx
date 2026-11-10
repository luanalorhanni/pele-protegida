import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Answers, Question } from './content/questions';
import { FOOTER_CREDITS, FOOTER_TEXT } from './content/screens';
import { Icon } from './components/icons';
import { computeResult } from './lib/computeResult';
import { cleanAnswers, visibleQuestions } from './lib/conditions';
import { buildRow } from './lib/payload';
import { sendRow, startQueueSync, submitResponse, type SubmitStatus } from './lib/submit';
import { stopSpeaking } from './lib/speech';
import { UpdateToast } from './pwa/UpdateToast';
import { backTo, navigate, useLocation, type RouteName } from './router';
import { Checklist } from './screens/Checklist';
import { Consentimento } from './screens/Consentimento';
import { FalarUBS } from './screens/FalarUBS';
import { Inicio } from './screens/Inicio';
import { Questionario } from './screens/Questionario';
import { Resultado } from './screens/Resultado';

// Rascunho na sessionStorage: sobrevive a um recarregamento, some ao fechar a aba.
// Nada disso sai do aparelho; o envio é feito só no fim, pela fila.
const DRAFT_KEY = 'pele-protegida:rascunho';
interface Draft {
  answers: Answers;
  consent: boolean;
  finished: Answers | null;
  status: SubmitStatus | null;
}
function loadDraft(): Draft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as Draft;
  } catch {
    /* sem armazenamento: começa vazio */
  }
  return { answers: {}, consent: false, finished: null, status: null };
}

export function App() {
  const loc = useLocation();
  const initial = useMemo(loadDraft, []);
  const [answers, setAnswers] = useState<Answers>(initial.answers);
  const [consent, setConsent] = useState(initial.consent);
  const [finished, setFinished] = useState<Answers | null>(initial.finished);
  const [status, setStatus] = useState<SubmitStatus | 'enviando' | null>(initial.status);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const lastRoute = useRef<RouteName>(loc.route);

  useEffect(() => {
    try {
      const s = status === 'enviando' ? null : status;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, consent, finished, status: s } satisfies Draft));
    } catch {
      /* ignora */
    }
  }, [answers, consent, finished, status]);

  // Fila offline: envia ao abrir o app e quando a conexão volta.
  useEffect(
    () =>
      startQueueSync((pending) => {
        if (pending === 0) setStatus((s) => (s === 'na_fila' ? 'enviada' : s));
      }),
    [],
  );

  // Para a leitura em voz alta ao trocar de tela.
  useEffect(() => {
    if (loc.route !== lastRoute.current) {
      lastRoute.current = loc.route;
      stopSpeaking();
    }
  }, [loc.route]);

  // Proteções de rota.
  const redirect: RouteName | null =
    loc.route === 'questionario' && finished
      ? 'resultado'
      : loc.route === 'questionario' && !consent
        ? 'consentimento'
        : loc.route === 'resultado' && !finished
          ? 'inicio'
          : null;
  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
  }, [redirect]);

  const start = useCallback(() => {
    setAnswers({});
    setFinished(null);
    setStatus(null);
    navigate('questionario', { q: visibleQuestions({})[0].id });
  }, []);

  const onAnswer = useCallback((q: Question, value: string) => {
    setAnswers((prev) => {
      const next: Answers = { ...prev };
      if (q.type === 'multi') {
        const cur = Array.isArray(prev[q.id]) ? [...(prev[q.id] as string[])] : [];
        const i = cur.indexOf(value);
        if (i === -1) cur.push(value);
        else cur.splice(i, 1);
        next[q.id] = cur;
      } else {
        next[q.id] = value;
      }
      return next;
    });
  }, []);

  const onFinish = useCallback(async () => {
    const final = cleanAnswers(answers);
    const row = buildRow(final, computeResult(final));
    setFinished(final);
    setStatus('enviando');
    navigate('resultado', { replace: true });
    try {
      setStatus(await submitResponse(row));
    } catch {
      // IndexedDB indisponível: tenta pelo menos o envio direto.
      const r = await sendRow(row).catch(() => ({ ok: false }) as const);
      setStatus(r.ok ? 'enviada' : null);
    }
  }, [answers]);

  const result = useMemo(() => (finished ? computeResult(finished) : null), [finished]);

  let screen: React.ReactNode = null;
  if (!redirect) {
    switch (loc.route) {
      case 'inicio':
        screen = <Inicio />;
        break;
      case 'checklist':
        screen = <Checklist checks={checks} onToggle={(id) => setChecks((c) => ({ ...c, [id]: !c[id] }))} />;
        break;
      case 'consentimento':
        screen = <Consentimento consent={consent} onConsentChange={setConsent} onStart={start} />;
        break;
      case 'questionario':
        screen = (
          <Questionario
            answers={answers}
            currentId={loc.q}
            onAnswer={onAnswer}
            onNext={(id) => navigate('questionario', { q: id })}
            onBack={(id) => (id ? backTo('questionario', id) : navigate('consentimento'))}
            onFinish={() => void onFinish()}
          />
        );
        break;
      case 'resultado':
        screen = result && <Resultado result={result} status={status ?? 'enviando'} />;
        break;
      case 'ubs':
        screen = (
          <FalarUBS
            onBack={() => {
              // Volta para onde a pessoa estava (inclusive a pergunta do questionário).
              const st = window.history.state as { prevKey?: string } | null;
              if (st?.prevKey) window.history.back();
              else navigate('inicio');
            }}
          />
        );
        break;
    }
  }

  const isQuiz = loc.route === 'questionario';

  return (
    <div className="app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header__inner">
          <img className="header__logo" src="/brand/logo-ceuma.png" alt="Universidade CEUMA" width={55} height={54} />
          <a
            href="/"
            className="header__brand"
            onClick={(e) => {
              e.preventDefault();
              navigate('inicio');
            }}
          >
            Pele Protegida
          </a>
          {loc.route !== 'inicio' && (
            <button type="button" className="header__home" onClick={() => navigate('inicio')}>
              <Icon name="house" size={22} />
              Início
            </button>
          )}
        </div>
      </header>

      <main id="conteudo" className="main">
        {isQuiz ? screen : <div className="container main">{screen}</div>}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__card">
            <img
              className="footer__logo"
              src="/brand/logo-ceuma.png"
              alt="Universidade CEUMA"
              width={109}
              height={108}
              loading="lazy"
            />
            <p className="footer__eixo">{FOOTER_CREDITS.eixo}</p>
            <hr className="footer__divider" />
            <dl className="footer__credits">
              {FOOTER_CREDITS.pessoas.map((p) => (
                <div key={p.papel}>
                  <dt>{p.papel}:</dt> <dd>{p.nomes}</dd>
                </div>
              ))}
            </dl>
            <p className="footer__note">{FOOTER_TEXT}</p>
          </div>
        </div>
      </footer>

      <UpdateToast />
    </div>
  );
}
