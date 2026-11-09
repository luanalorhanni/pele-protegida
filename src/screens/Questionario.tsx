import { BLOCKS, BLOCK_COUNT, type Answers, type Question } from '../content/questions';
import { Icon } from '../components/icons';
import { useScreenFocus } from '../components/useScreenFocus';
import { isAnswered, questionText, visibleQuestions } from '../lib/conditions';
import { speak, speechSupported } from '../lib/speech';

interface Props {
  answers: Answers;
  currentId: string | null;
  onAnswer: (q: Question, value: string) => void;
  onNext: (nextId: string) => void;
  onBack: (prevId: string | null) => void;
  onFinish: () => void;
}

const canSpeak = speechSupported();

export function Questionario({ answers, currentId, onAnswer, onNext, onBack, onFinish }: Props) {
  const vis = visibleQuestions(answers);
  let idx = vis.findIndex((q) => q.id === currentId);
  if (idx < 0) idx = 0;
  const q = vis[idx];
  const h1 = useScreenFocus(`q-${q.id}`);

  const isLast = idx === vis.length - 1;
  const isMulti = q.type === 'multi';
  const value = answers[q.id];
  const answered = isAnswered(q, answers);
  const text = questionText(q, answers);
  const progress = Math.round(((idx + 1) / vis.length) * 100);
  const correct = q.type === 'quiz' ? q.options.find((o) => o.value === q.correct) : undefined;
  const nextLabel = isLast ? 'Ver resultado' : 'Próxima';
  const isSelected = (v: string) => (isMulti ? Array.isArray(value) && value.includes(v) : value === v);

  const goNext = () => {
    if (!answered) return;
    if (isLast) onFinish();
    else onNext(vis[idx + 1].id);
  };

  return (
    <div className="quiz">
      <div className="screen container" style={{ gap: 18 }}>
        <div className="stack stack--sm">
          <div className="quiz__meta">
            <span>
              Parte {q.block} de {BLOCK_COUNT} · {BLOCKS[q.block]}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              {idx + 1} de {vis.length}
            </span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Progresso do questionário"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`Pergunta ${idx + 1} de ${vis.length}`}
          >
            <div className="progress__bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h1 ref={h1} tabIndex={-1} id="question-text" className="question">
          {text}
        </h1>

        {canSpeak && (
          <button
            type="button"
            className="listen-btn"
            onClick={() => speak(`${text}. ${q.options.map((o) => o.label).join('. ')}`)}
          >
            <Icon name="speaker" size={26} />
            Ouvir a pergunta
          </button>
        )}

        {isMulti && <p className="strong muted" id="multi-hint">Pode marcar mais de uma opção.</p>}

        <fieldset
          className="options"
          aria-labelledby="question-text"
          aria-describedby={isMulti ? 'multi-hint' : undefined}
        >
          {q.options.map((o) => (
            <label key={o.value} className={`option${isMulti ? ' option--multi' : ''}`}>
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={q.id}
                value={o.value}
                checked={isSelected(o.value)}
                onChange={() => onAnswer(q, o.value)}
              />
              <span className="option__ind" aria-hidden="true">
                <Icon name="check" size={20} strokeWidth={3} />
              </span>
              <span>{o.label}</span>
            </label>
          ))}
        </fieldset>

        {q.type === 'quiz' && answered && correct && (
          <div className="feedback" aria-live="polite">
            <div className="feedback__head">
              <span className="bubble bubble--primary">
                <Icon name="check" size={24} strokeWidth={2.6} />
              </span>
              <h2 className="feedback__title">Resposta certa: {correct.label}</h2>
            </div>
            {value === q.correct && <p className="strong">Você acertou!</p>}
            <p>{q.explanation}</p>
          </div>
        )}
      </div>

      <nav className="quiz-nav container" aria-label="Navegação do questionário">
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => onBack(idx === 0 ? null : vis[idx - 1].id)}
        >
          <Icon name="left" size={24} strokeWidth={2.4} />
          Voltar
        </button>
        <button
          type="button"
          className={answered ? 'btn btn--primary' : 'btn'}
          aria-disabled={!answered}
          onClick={goNext}
        >
          {nextLabel}
          {answered && <Icon name="right" size={24} strokeWidth={2.4} />}
        </button>
      </nav>
    </div>
  );
}
