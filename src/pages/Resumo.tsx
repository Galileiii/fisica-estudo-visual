import { Formula, Note, Section } from '../components/ui';

/**
 * Mapa de fórmulas: como a prova entrega as fórmulas, o que falta é saber
 * QUANDO usar cada uma. Esta página é um índice de decisão, não uma lista.
 */

interface Ferramenta {
  formula: string;
  nome: string;
  usar: string;
  pistas: string[];
  cuidado: string;
}

const ESPELHOS_LENTES: Ferramenta[] = [
  {
    formula: 'f = R / 2',
    nome: 'Foco e raio',
    usar: 'Quando o enunciado der o RAIO DE CURVATURA e a conta precisar do foco (ou o contrário: R = 2f).',
    pistas: ['"raio de curvatura"', '"centro de curvatura C"', 'um valor que é o dobro do que você esperava'],
    cuidado: 'Se o enunciado já deu "distância focal", não divida por 2 — o f já está pronto.',
  },
  {
    formula: '1/f = 1/p + 1/p′',
    nome: 'Equação de Gauss',
    usar: 'Quando a questão envolver POSIÇÕES (objeto, imagem, foco) e faltar uma das três.',
    pistas: ['"determine a posição da imagem"', '"a que distância"', '"onde se forma"', '"onde colocar a tela"'],
    cuidado: 'São inversos. Ao achar 1/p′ você ainda precisa inverter. E côncavo/convergente f > 0; convexo/divergente f < 0.',
  },
  {
    formula: 'A = −p′/p',
    nome: 'Aumento pelas distâncias',
    usar: 'Quando pedirem "quantas vezes maior", ou quando você já tem p e p′ e quer saber o tamanho.',
    pistas: ['"quantas vezes"', '"aumento"', '"o dobro do tamanho"'],
    cuidado: 'O sinal de menos faz parte da fórmula. A negativo = imagem invertida.',
  },
  {
    formula: 'A = h′/h',
    nome: 'Aumento pelas alturas',
    usar: 'Quando aparecerem ALTURAS (do objeto ou da imagem) em cm/m.',
    pistas: ['"objeto de 5 cm de altura"', '"a imagem mede"', '"altura da imagem"'],
    cuidado: 'Combine com A = −p′/p para passar de distância para altura: h′ = A · h.',
  },
  {
    formula: 'V = 1 / f',
    nome: 'Vergência (o "grau")',
    usar: 'Quando falarem em dioptrias, grau de óculos, ou "quantos graus".',
    pistas: ['"dioptrias"', '"grau"', '"di"', '"óculos"'],
    cuidado: 'f OBRIGATORIAMENTE em metros. 25 cm = 0,25 m.',
  },
  {
    formula: 'n₁ · sen i = n₂ · sen r',
    nome: 'Lei de Snell',
    usar: 'Quando um raio atravessa a divisa entre dois meios e a questão fala de ângulos.',
    pistas: ['"índice de refração"', '"ângulo de incidência" com dois meios', '"ar para a água"'],
    cuidado: 'Os ângulos são medidos a partir da NORMAL, nunca da superfície.',
  },
];

const ONDAS: Ferramenta[] = [
  {
    formula: 'v = λ · f',
    nome: 'Equação fundamental',
    usar: 'Sempre que aparecerem duas entre: velocidade, comprimento de onda e frequência.',
    pistas: ['m/s', 'Hz', '"comprimento de onda"', '"velocidade de propagação"'],
    cuidado: 'λ em metros e f em Hz para v sair em m/s. Converta cm antes.',
  },
  {
    formula: 'T = 1 / f',
    nome: 'Período e frequência',
    usar: 'Quando a questão der um e pedir o outro — ou quando der o período e você precisar da frequência para usar v = λf.',
    pistas: ['"período"', 'segundos por oscilação', '"leva 0,2 s"'],
    cuidado: 'Não confunda 0,25 s (período) com 0,25 Hz (frequência). São inversos.',
  },
  {
    formula: 'v = λ / T',
    nome: 'Atalho',
    usar: 'Quando o dado for o período em vez da frequência. Economiza um passo.',
    pistas: ['período dado diretamente'],
    cuidado: 'É a mesma fórmula de sempre, já com T = 1/f substituído.',
  },
];

function Card({ t }: { t: Ferramenta }) {
  return (
    <div className="card stack" style={{ gap: 12 }}>
      <Formula>{t.formula}</Formula>
      <div className="h3">{t.nome}</div>
      <p className="body" style={{ fontSize: 14.8, margin: 0 }}>
        <b>Quando usar:</b> {t.usar}
      </p>
      <div>
        <span className="muted">Palavras que entregam:</span>
        <div className="row" style={{ gap: 6, marginTop: 6 }}>
          {t.pistas.map((p) => (
            <span key={p} className="tag tag-blue">
              {p}
            </span>
          ))}
        </div>
      </div>
      <Note tone="amber">{t.cuidado}</Note>
    </div>
  );
}

export function ResumoPage() {
  return (
    <div className="stack-lg">
      <header className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Colinha inteligente</span>
        <h1 className="h1" style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}>
          🗺️ Mapa de fórmulas
        </h1>
        <p className="lead">
          A prova te dá as fórmulas. O que ela não dá é o mais difícil: saber <b>qual</b> usar. Esta página é um
          mapa de decisão — cada fórmula com as palavras do enunciado que denunciam que ela é a certa.
        </p>
      </header>

      <Note tone="purple">
        <b>O método, em uma frase:</b> a fórmula certa é a única que contém, ao mesmo tempo, aquilo que você{' '}
        <b>tem</b> e aquilo que você <b>quer</b>. Liste os dois antes de escolher — é exatamente o que o modo
        Decifre a Questão treina.
      </Note>

      <Section n="Óptica" title="Espelhos e lentes">
        <div className="grid grid-2">
          {ESPELHOS_LENTES.map((t) => (
            <Card key={t.formula} t={t} />
          ))}
        </div>
      </Section>

      <Section n="Ondulatória" title="Ondas">
        <div className="grid grid-2">
          {ONDAS.map((t) => (
            <Card key={t.formula} t={t} />
          ))}
        </div>
      </Section>

      <Section n="Sinais" title="A tabela de sinais que resolve metade das dúvidas">
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                {['Sinal', 'Em espelhos', 'Em lentes', 'Significa'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '13px 16px', fontSize: 13, color: 'var(--text-3)', borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['f > 0', 'côncavo', 'convergente', 'junta a luz'],
                ['f < 0', 'convexo', 'divergente', 'espalha a luz'],
                ['p′ > 0', 'imagem na frente', 'imagem do outro lado', 'REAL e invertida'],
                ['p′ < 0', 'imagem atrás', 'imagem do mesmo lado', 'VIRTUAL e direita'],
                ['A > 0', 'direita', 'direita', 'mesmo sentido do objeto'],
                ['A < 0', 'invertida', 'invertida', 'de cabeça para baixo'],
                ['|A| > 1', 'maior', 'maior', 'a imagem cresceu'],
                ['|A| < 1', 'menor', 'menor', 'a imagem encolheu'],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 ? 'var(--surface-2)' : 'transparent' }}>
                  {row.map((c, j) => (
                    <td key={j} style={{ padding: '11px 16px', fontSize: 14.5, borderBottom: '1px solid var(--line)', fontFamily: j === 0 ? 'var(--mono)' : undefined, fontWeight: j === 0 ? 700 : 400 }}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
