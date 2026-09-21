import { MODULOS, licaoKey, todasLicoes } from '../content/curriculum';
import { Bar, BarAscii, Note } from '../components/ui';
import { useProgress } from '../state/progress';

export function Dashboard({ go }: { go: (path: string) => void }) {
  const { modulePct, skillPct, store, reset } = useProgress();

  const todas = MODULOS.flatMap(todasLicoes);
  const dominio = modulePct(todas);
  const interp = skillPct('interpretacao');
  const calc = skillPct('calculo');

  /* próxima lição não concluída */
  let proxima: { m: string; l: string; titulo: string; modulo: string } | null = null;
  for (const m of MODULOS) {
    for (const l of m.licoes) {
      if (!store.done[licaoKey(m.id, l.id)]) {
        proxima = { m: m.id, l: l.id, titulo: l.titulo, modulo: m.nome };
        break;
      }
    }
    if (proxima) break;
  }

  const metricas = [
    {
      emoji: '🎯',
      nome: 'Domínio geral',
      pct: dominio,
      tone: undefined as undefined | 'cyan' | 'amber',
      desc: `${todas.filter((id) => store.done[id]).length} de ${todas.length} lições concluídas`,
    },
    {
      emoji: '🧠',
      nome: 'Interpretação',
      pct: interp,
      tone: 'cyan' as const,
      desc:
        store.skills.interpretacao.total === 0
          ? 'ainda sem dados — responda às perguntas das lições'
          : `${store.skills.interpretacao.hit} acertos em ${store.skills.interpretacao.total} perguntas de leitura`,
    },
    {
      emoji: '🧮',
      nome: 'Cálculos',
      pct: calc,
      tone: 'amber' as const,
      desc:
        store.skills.calculo.total === 0
          ? 'ainda sem dados — resolva as contas das lições'
          : `${store.skills.calculo.hit} acertos em ${store.skills.calculo.total} contas`,
    },
  ];

  return (
    <div className="stack-lg">
      <header className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Óptica e Ondulatória · 2º ano</span>
        <h1 className="h1">
          FÍSICA <span style={{ color: 'var(--purple-soft)' }}>VISUAL</span>
        </h1>
        <p className="lead">
          Aprenda Física vendo ela acontecer. Aqui nada é só texto: você arrasta, gira, aproxima e observa o
          fenômeno antes de qualquer fórmula aparecer.
        </p>
      </header>

      {proxima && (
        <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px' }}>
            <div className="muted">Continuar de onde parou</div>
            <div className="h3">
              {proxima.modulo} · {proxima.titulo}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => go(`/l/${proxima!.m}/${proxima!.l}`)}>
            Continuar →
          </button>
        </div>
      )}

      <section className="grid grid-3">
        {MODULOS.map((m) => {
          const pct = modulePct(todasLicoes(m));
          return (
            <button
              key={m.id}
              className="module-card"
              style={{ ['--accent' as string]: m.cor }}
              onClick={() => go(`/m/${m.id}`)}
            >
              <span className="module-emoji">{m.emoji}</span>
              <div>
                <div className="h3">{m.nome}</div>
                <div className="muted">{m.frase}</div>
              </div>
              <p className="body" style={{ fontSize: 14.5, margin: 0 }}>
                {m.descricao}
              </p>
              <div className="stack" style={{ gap: 6, marginTop: 'auto' }}>
                <BarAscii pct={pct} />
                <Bar pct={pct} />
                <span className="muted">{m.licoes.length} lições</span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="stack">
        <h2 className="h2">Seu progresso</h2>
        <div className="grid grid-3">
          {metricas.map((x) => (
            <div key={x.nome} className="card stack" style={{ gap: 10 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                  {x.emoji} {x.nome}
                </span>
                <b style={{ fontFamily: 'var(--mono)', fontSize: 18 }}>{x.pct}%</b>
              </div>
              <Bar pct={x.pct} tone={x.tone} />
              <span className="muted">{x.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 40 }}>🧩</span>
        <div style={{ flex: '1 1 280px' }}>
          <div className="h3">Modo Decifre a Questão</div>
          <p className="body" style={{ fontSize: 14.8, marginTop: 4 }}>
            O modo mais importante do app. Em vez de pedir a resposta, ele te leva pelos 6 passos que ninguém
            ensina: o que a questão deu, o que ela quer, qual fórmula conecta, como substituir, como resolver e
            o que o resultado significa.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => go('/decifre')}>
          Treinar interpretação →
        </button>
      </section>

      <Note tone="purple">
        <b>Como usar:</b> em cada lição, mexa primeiro no simulador até entender o que está acontecendo. Só
        depois leia a fórmula — ela vai parecer óbvia. Toda palavra <span style={{ borderBottom: '2px dotted var(--cyan)' }}>pontilhada</span> pode ser
        clicada para ver o significado.
      </Note>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted">Seu progresso fica salvo neste navegador.</span>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => {
            if (confirm('Apagar todo o progresso e recomeçar do zero?')) reset();
          }}
        >
          ↻ Zerar progresso
        </button>
      </div>
    </div>
  );
}
