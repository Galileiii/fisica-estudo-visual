import { useEffect, useMemo, useState } from 'react';
import { MODULO_LABEL, QUESTOES, type Escolha, type Questao } from '../content/questoes';
import { Note, Section } from '../components/ui';
import { useProgress } from '../state/progress';

/** Lista de alternativas com feedback (fora do componente para não remontar a cada render). */
function ListaDeEscolhas({
  opcoes,
  escolhido,
  onPick,
}: {
  opcoes: Escolha[];
  escolhido: number | null;
  onPick: (i: number) => void;
}) {
  const respondido = escolhido !== null;
  return (
    <div className="stack" style={{ gap: 0 }}>
      {opcoes.map((o, i) => {
        const estado = !respondido ? '' : o.ok ? 'right' : i === escolhido ? 'wrong' : '';
        return (
          <button key={i} className={`opt ${estado}`} disabled={respondido} onClick={() => onPick(i)}>
            {respondido && o.ok ? '✅ ' : respondido && i === escolhido ? '❌ ' : ''}
            {o.texto}
            {respondido && (o.ok || i === escolhido) && o.why && (
              <div className="muted" style={{ marginTop: 6, fontWeight: 400 }}>
                {o.why}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

const PASSOS = [
  { n: 1, titulo: 'O que a questão me deu?', dica: 'Marque TODAS as informações que realmente estão no enunciado — inclusive as escondidas em palavras como "côncavo" ou "projetar".' },
  { n: 2, titulo: 'O que ela quer descobrir?', dica: 'Procure o verbo: "determine", "calcule", "qual é". O que vem logo depois dele é a incógnita.' },
  { n: 3, titulo: 'Qual fórmula conecta essas informações?', dica: 'A fórmula certa é a que tem, ao mesmo tempo, o que você TEM e o que você QUER.' },
  { n: 4, titulo: 'Substitua os valores', dica: 'Cada número no seu lugar, com o sinal certo, e a incógnita sozinha.' },
  { n: 5, titulo: 'Resolva', dica: 'Agora é só conta. Devagar, um passo por linha.' },
  { n: 6, titulo: 'O que o resultado significa?', dica: 'Um número sozinho não é resposta. Traduza: é real ou virtual? maior ou menor? o que isso quer dizer no mundo real?' },
];

export function DecifrePage() {
  const [filtro, setFiltro] = useState<'todos' | Questao['modulo']>('todos');
  const [qIdx, setQIdx] = useState(0);
  const { record, solveQuestion, store } = useProgress();

  const lista = useMemo(() => (filtro === 'todos' ? QUESTOES : QUESTOES.filter((q) => q.modulo === filtro)), [filtro]);
  const q: Questao = lista[Math.min(qIdx, lista.length - 1)] ?? QUESTOES[0];

  /* ------------------- estado da resolução ------------------- */
  const [passo, setPasso] = useState(0);
  const [marcados, setMarcados] = useState<number[]>([]);
  const [conferido, setConferido] = useState(false);
  const [escolhas, setEscolhas] = useState<Record<number, number | null>>({});
  const [numTexto, setNumTexto] = useState('');
  const [numOk, setNumOk] = useState<boolean | null>(null);
  const [verResolucao, setVerResolucao] = useState(false);
  const [acertos, setAcertos] = useState(0);

  function reiniciar(novoIdx = qIdx) {
    setQIdx(novoIdx);
    setPasso(0);
    setMarcados([]);
    setConferido(false);
    setEscolhas({});
    setNumTexto('');
    setNumOk(null);
    setVerResolucao(false);
    setAcertos(0);
  }

  /* ------------------- passo 1: dados ------------------- */
  const corretos = q.dados.map((d, i) => (d.ok ? i : -1)).filter((i) => i >= 0);
  const passo1Ok = conferido && corretos.length === marcados.length && corretos.every((i) => marcados.includes(i));

  function conferirDados() {
    if (conferido) return;
    setConferido(true);
    const ok = corretos.length === marcados.length && corretos.every((i) => marcados.includes(i));
    record('interpretacao', ok);
    if (ok) setAcertos((a) => a + 1);
  }

  /* ------------------- passos de escolha única ------------------- */
  function escolher(passoIdx: number, opcoes: Escolha[], i: number, skill: 'interpretacao' | 'calculo') {
    if (escolhas[passoIdx] != null) return;
    setEscolhas((e) => ({ ...e, [passoIdx]: i }));
    const ok = !!opcoes[i].ok;
    record(skill, ok);
    if (ok) setAcertos((a) => a + 1);
  }

  const Escolhas = ({ passoIdx, opcoes, skill }: { passoIdx: number; opcoes: Escolha[]; skill: 'interpretacao' | 'calculo' }) => (
    <ListaDeEscolhas
      opcoes={opcoes}
      escolhido={escolhas[passoIdx] ?? null}
      onPick={(i) => escolher(passoIdx, opcoes, i, skill)}
    />
  );

  /* ------------------- passo 5: resolver ------------------- */
  function conferirNumero() {
    const v = Number(numTexto.replace(',', '.').trim());
    if (numTexto.trim() === '' || Number.isNaN(v)) return;
    const tol = Math.max(Math.abs(q.resposta.valor) * (q.resposta.tolerancia ?? 0.03), 0.02);
    const ok = Math.abs(v - q.resposta.valor) <= tol;
    setNumOk(ok);
    record('calculo', ok);
    if (ok) setAcertos((a) => a + 1);
  }

  const podeAvancar =
    passo === 0 ? conferido : passo === 4 ? numOk !== null : passo === 5 ? escolhas[5] != null : escolhas[passo] != null;

  const finalizado = passo === 5 && escolhas[5] != null;
  const jaResolvida = !!store.solved[q.id];

  useEffect(() => {
    if (finalizado && !jaResolvida) solveQuestion(q.id);
  }, [finalizado, jaResolvida, q.id, solveQuestion]);

  return (
    <div className="stack-lg">
      <header className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Modo treino</span>
        <h1 className="h1" style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}>
          🧩 Decifre a Questão
        </h1>
        <p className="lead">
          Aqui ninguém te pede a resposta de cara. Você vai atravessar os 6 passos que separam "li a questão" de
          "resolvi a questão". É treino de leitura, não de decoreba.
        </p>
      </header>

      {/* ------- seletor de questões ------- */}
      <div className="card card-flat stack">
        <div className="row" style={{ gap: 7 }}>
          {(['todos', 'espelhos', 'lentes', 'ondas'] as const).map((k) => (
            <button
              key={k}
              className={`chip ${filtro === k ? 'on' : ''}`}
              onClick={() => {
                setFiltro(k);
                reiniciar(0);
              }}
            >
              {k === 'todos' ? 'Todas' : MODULO_LABEL[k]}
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 7 }}>
          {lista.map((item, i) => (
            <button key={item.id} className={`chip ${item.id === q.id ? 'on' : ''}`} onClick={() => reiniciar(i)}>
              {store.solved[item.id] ? '✓ ' : ''}
              {i + 1}. {item.nivel}
            </button>
          ))}
        </div>
      </div>

      {/* ------- enunciado ------- */}
      <div className="stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">{MODULO_LABEL[q.modulo]} · nível {q.nivel}</span>
          <span className="muted">acertos nesta questão: {acertos}/6</span>
        </div>
        <div className="question-box">{q.enunciado}</div>
      </div>

      {/* ------- trilha dos passos ------- */}
      <div>
        <div className="steps">
          {PASSOS.map((s, i) => (
            <span key={s.n} className={`step-dot ${i < passo ? 'done' : i === passo ? 'now' : ''}`} />
          ))}
        </div>

        <div className="card stack">
          <div className="row" style={{ gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                color: '#fff',
                fontWeight: 800,
              }}
            >
              {PASSOS[passo].n}
            </span>
            <h2 className="h3" style={{ flex: 1 }}>
              {PASSOS[passo].titulo}
            </h2>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {PASSOS[passo].dica}
          </p>

          {/* ---------- PASSO 1 ---------- */}
          {passo === 0 && (
            <div className="stack">
              <div className="row" style={{ gap: 8 }}>
                {q.dados.map((d, i) => {
                  const sel = marcados.includes(i);
                  const estado = !conferido ? (sel ? 'on' : '') : d.ok ? 'right' : sel ? 'wrong' : '';
                  return (
                    <button
                      key={i}
                      className={`chip ${estado}`}
                      disabled={conferido}
                      onClick={() => setMarcados((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))}
                    >
                      {conferido ? (d.ok ? '✅ ' : sel ? '❌ ' : '') : sel ? '✓ ' : ''}
                      {d.texto}
                    </button>
                  );
                })}
              </div>

              {!conferido ? (
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={conferirDados} disabled={marcados.length === 0}>
                  Conferir os dados
                </button>
              ) : (
                <div className={`feedback ${passo1Ok ? 'ok' : 'no'}`}>
                  <b>{passo1Ok ? '🎉 Leitura perfeita.' : '🔁 Faltou (ou sobrou) alguma coisa.'}</b>
                  <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
                    {q.dados.map((d, i) => (
                      <li key={i} style={{ marginBottom: 6, fontSize: 14.3 }}>
                        <b>{d.texto}</b> — {d.ok ? 'é dado' : 'não é dado'}: {d.why}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ---------- PASSOS 2, 3, 4 ---------- */}
          {passo === 1 && <Escolhas passoIdx={1} opcoes={q.alvo} skill="interpretacao" />}
          {passo === 2 && <Escolhas passoIdx={2} opcoes={q.formula} skill="interpretacao" />}
          {passo === 3 && <Escolhas passoIdx={3} opcoes={q.substituicao} skill="calculo" />}

          {/* ---------- PASSO 5 ---------- */}
          {passo === 4 && (
            <div className="stack">
              <div className="row" style={{ flexWrap: 'nowrap', gap: 8 }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={`resposta em ${q.resposta.unidade}`}
                  value={numTexto}
                  onChange={(e) => setNumTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && numOk === null && conferirNumero()}
                  disabled={numOk !== null}
                />
                <button className="btn btn-primary" onClick={conferirNumero} disabled={numOk !== null}>
                  Conferir
                </button>
              </div>

              {numOk === null ? (
                <button className="btn btn-sm btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setVerResolucao((v) => !v)}>
                  {verResolucao ? 'Esconder a resolução' : '💡 Travei — me mostre a resolução'}
                </button>
              ) : (
                <div className={`feedback ${numOk ? 'ok' : 'no'}`}>
                  {numOk
                    ? `🎉 Isso! ${String(q.resposta.valor).replace('.', ',')} ${q.resposta.unidade}.`
                    : `🔁 A resposta é ${String(q.resposta.valor).replace('.', ',')} ${q.resposta.unidade}. Acompanhe a resolução abaixo — o erro costuma estar em um passo só.`}
                </div>
              )}

              {(verResolucao || numOk !== null) && (
                <div className="stack" style={{ gap: 8 }}>
                  {q.resposta.passos.map((p, i) => (
                    <div key={i} className="calc-line">
                      {i + 1}. {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------- PASSO 6 ---------- */}
          {passo === 5 && (
            <div className="stack">
              <div className="calc-line" style={{ borderColor: 'var(--green)' }}>
                resultado: {String(q.resposta.valor).replace('.', ',')} {q.resposta.unidade}
              </div>
              <Escolhas passoIdx={5} opcoes={q.significado} skill="interpretacao" />
            </div>
          )}

          {/* ---------- navegação ---------- */}
          <div className="row" style={{ marginTop: 6 }}>
            {passo > 0 && (
              <button className="btn btn-sm" onClick={() => setPasso((p) => p - 1)}>
                ← Voltar
              </button>
            )}
            {passo < 5 && (
              <button className="btn btn-primary" disabled={!podeAvancar} onClick={() => setPasso((p) => p + 1)} style={{ marginLeft: 'auto' }}>
                Próximo passo →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------- fechamento ------- */}
      {finalizado && (
        <div className="stack fade-in">
          <Section n="Fechamento" title="A lição que fica dessa questão">
            <Note tone="green">{q.licao}</Note>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px' }}>
                <div className="h3">Você acertou {acertos} dos 6 passos</div>
                <span className="muted">
                  {acertos >= 5
                    ? 'Leitura afiada. O caminho da questão está claro para você.'
                    : acertos >= 3
                      ? 'Bom caminho. Reveja os passos que erraram: quase sempre é interpretação, não conta.'
                      : 'Tranquilo — é exatamente para isso que esse modo existe. Refaça essa mesma questão agora que você viu o caminho.'}
                </span>
              </div>
              <button className="btn" onClick={() => reiniciar(qIdx)}>
                ↻ Refazer esta
              </button>
              {qIdx < lista.length - 1 && (
                <button className="btn btn-primary" onClick={() => reiniciar(qIdx + 1)}>
                  Próxima questão →
                </button>
              )}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
