import { findModulo, licaoKey, todasLicoes } from '../content/curriculum';
import { Bar, Note } from '../components/ui';
import { useProgress } from '../state/progress';

export function ModuloPage({ id, go }: { id: string; go: (p: string) => void }) {
  const m = findModulo(id);
  const { store, modulePct } = useProgress();

  if (!m) {
    return (
      <div className="card">
        Módulo não encontrado.{' '}
        <button className="btn btn-sm" onClick={() => go('/')}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const pct = modulePct(todasLicoes(m));

  return (
    <div className="stack-lg">
      <header className="stack" style={{ gap: 12 }}>
        <button className="btn btn-sm btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => go('/')}>
          ← Início
        </button>
        <div className="row" style={{ gap: 14 }}>
          <span style={{ fontSize: 46 }}>{m.emoji}</span>
          <div>
            <h1 className="h1" style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}>
              {m.nome}
            </h1>
            <p className="lead" style={{ fontSize: 16 }}>
              {m.descricao}
            </p>
          </div>
        </div>
        <div className="stack" style={{ gap: 6, maxWidth: 460 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted">Progresso do módulo</span>
            <b style={{ fontFamily: 'var(--mono)' }}>{pct}%</b>
          </div>
          <Bar pct={pct} />
        </div>
      </header>

      <section className="track">
        {m.licoes.map((l, i) => {
          const done = !!store.done[licaoKey(m.id, l.id)];
          return (
            <button key={l.id} className={`track-item ${done ? 'done' : ''}`} onClick={() => go(`/l/${m.id}/${l.id}`)}>
              <span className="track-num">{done ? '✓' : i + 1}</span>
              <span>
                <span className="track-title">{l.titulo}</span>
                <br />
                <span className="track-sub">{l.sub}</span>
              </span>
              <span className="track-arrow">→</span>
            </button>
          );
        })}
      </section>

      <Note tone="purple">
        A trilha foi montada em ordem: cada lição usa o que ficou entendido na anterior. Mas fique à vontade
        para pular direto para a que está te derrubando na prova.
      </Note>
    </div>
  );
}
