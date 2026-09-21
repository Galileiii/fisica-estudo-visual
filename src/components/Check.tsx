import { useState, type ReactNode } from 'react';
import { useProgress, type Skill } from '../state/progress';

/* ============================ Pergunta de múltipla escolha ============================ */

export interface Option {
  text: string;
  ok?: boolean;
  /** por que essa opção está certa ou errada */
  why?: string;
}

export function QuickCheck({
  question,
  options,
  explain,
  skill = 'interpretacao',
}: {
  question: ReactNode;
  options: Option[];
  explain?: ReactNode;
  skill?: Skill;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const { record } = useProgress();
  const answered = picked !== null;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    record(skill, !!options[i].ok);
  }

  return (
    <div className="quiz">
      <div className="quiz-q">🤔 {question}</div>
      {options.map((o, i) => {
        const state = !answered ? '' : o.ok ? 'right' : i === picked ? 'wrong' : '';
        return (
          <button key={i} className={`opt ${state}`} disabled={answered} onClick={() => choose(i)}>
            {answered && o.ok ? '✅ ' : answered && i === picked ? '❌ ' : ''}
            {o.text}
            {answered && (o.ok || i === picked) && o.why && (
              <div className="muted" style={{ marginTop: 6, fontWeight: 400 }}>
                {o.why}
              </div>
            )}
          </button>
        );
      })}
      {answered && explain && (
        <div className={`feedback ${options[picked!].ok ? 'ok' : 'no'}`} style={{ marginTop: 6 }}>
          {options[picked!].ok ? '🎉 Isso! ' : '🔁 Quase. '}
          {explain}
        </div>
      )}
    </div>
  );
}

/* ============================ Pergunta com resposta numérica ============================ */

export function NumberCheck({
  question,
  answer,
  unit = '',
  tolerance = 0.05,
  explain,
  skill = 'calculo',
}: {
  question: ReactNode;
  answer: number;
  unit?: string;
  /** tolerância relativa (0.05 = aceita 5% de diferença por arredondamento) */
  tolerance?: number;
  explain?: ReactNode;
  skill?: Skill;
}) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const { record } = useProgress();

  function send() {
    const v = Number(text.replace(',', '.').trim());
    if (text.trim() === '' || Number.isNaN(v)) return;
    const ok = Math.abs(v - answer) <= Math.max(Math.abs(answer) * tolerance, 0.02);
    setResult(ok);
    record(skill, ok);
  }

  return (
    <div className="quiz">
      <div className="quiz-q">🧮 {question}</div>
      <div className="row" style={{ flexWrap: 'nowrap', gap: 8 }}>
        <input
          type="text"
          inputMode="decimal"
          value={text}
          placeholder={`resposta${unit ? ` em ${unit}` : ''}`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && result === null && send()}
          disabled={result !== null}
        />
        <button className="btn btn-primary" onClick={send} disabled={result !== null}>
          Conferir
        </button>
      </div>
      {result !== null && (
        <div className={`feedback ${result ? 'ok' : 'no'}`} style={{ marginTop: 12 }}>
          {result ? '🎉 Exato! ' : `🔁 Não é isso. A resposta é ${String(answer).replace('.', ',')}${unit ? ' ' + unit : ''}. `}
          {explain}
        </div>
      )}
      {result === false && (
        <button className="btn btn-sm btn-ghost" style={{ marginTop: 10 }} onClick={() => { setResult(null); setText(''); }}>
          ↻ Tentar de novo
        </button>
      )}
    </div>
  );
}
