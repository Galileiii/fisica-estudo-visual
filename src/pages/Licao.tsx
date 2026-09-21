import { useEffect } from 'react';
import { findLicao, licaoKey } from '../content/curriculum';
import { useProgress } from '../state/progress';

export function LicaoPage({ moduloId, licaoId, go }: { moduloId: string; licaoId: string; go: (p: string) => void }) {
  const found = findLicao(moduloId, licaoId);
  const { isDone, toggle } = useProgress();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [moduloId, licaoId]);

  if (!found) {
    return (
      <div className="card">
        Lição não encontrada.{' '}
        <button className="btn btn-sm" onClick={() => go('/')}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const { modulo, licao, idx, prev, next } = found;
  const key = licaoKey(modulo.id, licao.id);
  const done = isDone(key);
  const Corpo = licao.C;

  return (
    <div className="stack-lg">
      <header className="stack" style={{ gap: 10 }}>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={() => go(`/m/${modulo.id}`)}>
            ← {modulo.emoji} {modulo.nome}
          </button>
          <span className="muted">
            lição {idx + 1} de {modulo.licoes.length}
          </span>
        </div>
        <h1 className="h1" style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}>
          {licao.titulo}
        </h1>
        <p className="lead" style={{ fontSize: 16 }}>
          {licao.sub}
        </p>
      </header>

      <Corpo />

      <footer className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className={`btn ${done ? '' : 'btn-primary'}`} onClick={() => toggle(key)}>
          {done ? '✓ Lição concluída (clique para desmarcar)' : 'Marcar lição como concluída'}
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {prev && (
            <button className="btn btn-sm" onClick={() => go(`/l/${modulo.id}/${prev.id}`)}>
              ← {prev.titulo}
            </button>
          )}
          {next ? (
            <button className="btn btn-sm btn-primary" onClick={() => go(`/l/${modulo.id}/${next.id}`)}>
              {next.titulo} →
            </button>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={() => go('/decifre')}>
              Treinar no modo Decifre →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
