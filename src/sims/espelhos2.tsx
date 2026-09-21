import { useState } from 'react';
import { MirrorScene } from './mirrorScene';
import { AxisPoint, Axis, COLORS, Defs, Ray, SphericalMirror, Badge } from '../components/svg';
import { Formula, Note, Readout, Reveal, Row, Section, Seg, Slider, Stage, T, Tag } from '../components/ui';
import { NumberCheck, QuickCheck } from '../components/Check';
import { num, REGION_LABEL, REGION_STORY, regionOf, solveImage } from '../lib/optics';

/* ==================================================================== */
/* 4. ESPELHOS ESFÉRICOS                                                */
/* ==================================================================== */

export function LicaoEsfericos() {
  const [tipo, setTipo] = useState<'concavo' | 'convexo'>('concavo');
  const [p, setP] = useState(45);
  const f = tipo === 'concavo' ? 15 : -15;

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="Recorte um pedaço de uma bola espelhada">
        <p className="body">
          Imagine uma bola de Natal espelhada. Se você recortar um pedacinho dela, esse pedacinho é um espelho
          esférico. Ele tem dois lados: o lado de dentro (a "concha") e o lado de fora (a "corcunda"). Qual dos
          dois é espelhado decide tudo:
        </p>
        <div className="grid grid-2">
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <div className="row">
              <span style={{ fontSize: 26 }}>🥄</span>
              <b>
                <T id="concavo" />
              </b>
            </div>
            <p className="body" style={{ fontSize: 15 }}>
              Espelhado por dentro, como o lado de comer da colher. Ele <b>junta</b> a luz num ponto. É o
              espelho de maquiagem e o do dentista.
            </p>
            <code className="muted">C ———— F ———— )</code>
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <div className="row">
              <span style={{ fontSize: 26 }}>🥄</span>
              <b>
                <T id="convexo" />
              </b>
            </div>
            <p className="body" style={{ fontSize: 15 }}>
              Espelhado por fora, como as costas da colher. Ele <b>espalha</b> a luz. É o espelho da esquina, do
              ônibus e do supermercado — mostra muita coisa, tudo pequenininho.
            </p>
            <code className="muted">( ———— F′ ———— C′</code>
          </div>
        </div>
      </Section>

      <Section n="Peças" title="Os três pontos que você precisa reconhecer no desenho">
        <div className="grid grid-3">
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--cyan)' }}>V — <T id="vertice">vértice</T></b>
            <span className="body" style={{ fontSize: 14.5 }}>O meio do espelho. Toda distância começa a contar daqui.</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--purple)' }}>F — <T id="foco">foco</T></b>
            <span className="body" style={{ fontSize: 14.5 }}>O ponto onde a luz que chega paralela se encontra. Fica na metade do caminho até C.</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--blue)' }}>C — <T id="centroCurvatura">centro de curvatura</T></b>
            <span className="body" style={{ fontSize: 14.5 }}>O centro da bola de onde o espelho foi recortado. Fica no dobro de F.</span>
          </div>
        </div>
      </Section>

      <div className="sim-layout">
        <MirrorScene p={p} f={f} pMax={70} onDragP={setP} showRegions={false} label={`Simulador · espelho ${tipo}`} />
        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={tipo}
              onChange={setTipo}
              options={[
                { value: 'concavo', label: 'CÔNCAVO' },
                { value: 'convexo', label: 'CONVEXO' },
              ]}
            />
            <Slider label="Posição do objeto (p)" value={p} min={4} max={70} step={0.5} unit="cm" onChange={setP} hint="Também dá para arrastar a seta verde." />
          </div>
          <Readout>
            <Row k="Tipo" v={tipo === 'concavo' ? 'côncavo' : 'convexo'} />
            <Row k="Distância focal (f)" v={`${num(f, 1)} cm`} tone="var(--purple)" />
            <Row k="Sinal de f" v={f > 0 ? 'positivo (+)' : 'negativo (−)'} tone={f > 0 ? 'var(--green)' : 'var(--rose)'} />
            <Row k="Onde fica F" v={f > 0 ? 'na frente do espelho' : 'atrás do espelho'} />
          </Readout>
          <Note tone="amber">
            No convexo, F e C ficam <b>atrás</b> do espelho: a luz refletida não passa por eles de verdade, ela
            só parece vir dali. Por isso f entra na conta com <b>sinal negativo</b>. Essa é a única diferença de
            sinal entre os dois espelhos.
          </Note>
        </div>
      </div>

      <Reveal question="Por que o convexo sempre mostra tudo pequeno e direito?">
        <p className="body">
          Troque para CONVEXO e arraste o objeto para onde quiser. Repare que a imagem nunca sai de dentro do
          pedacinho entre V e F, atrás do espelho: ela fica sempre virtual, direita e menor. É por isso que esse
          é o espelho escolhido para esquinas e lojas — ele "encolhe" um campo de visão enorme dentro de um
          espelho pequeno. O preço é que tudo parece mais longe do que está (aquele aviso no retrovisor:
          "objetos estão mais próximos do que parecem").
        </p>
      </Reveal>

      <QuickCheck
        question="Uma questão diz: 'espelho esférico convexo de distância focal 20 cm'. Que valor de f você coloca na fórmula?"
        options={[
          { text: '+20 cm', why: 'Positivo é côncavo. O convexo espalha a luz e tem foco virtual.' },
          { text: '−20 cm', ok: true, why: 'Convexo = foco atrás = f negativo. Trocar esse sinal é o erro mais comum da prova.' },
          { text: '+10 cm', why: 'Aqui você dividiu por 2 sem precisar: 20 cm já é o f, não o R.' },
          { text: '−40 cm', why: 'Isso seria o R (dobro do f), e ainda assim o enunciado deu o f.' },
        ]}
        explain="Regra: côncavo → f > 0. Convexo → f < 0. Escreva o sinal ANTES de começar a conta."
      />
    </div>
  );
}

/* ==================================================================== */
/* 5. FOCO E RAIO DE CURVATURA                                          */
/* ==================================================================== */

export function LicaoFocoRaio() {
  const [R, setR] = useState(40);
  const f = R / 2;

  const W = 820;
  const H = 380;
  const axisY = 200;
  const vx = 660;
  const s = 9; // px por cm
  const Rpx = R * s;
  const Fx = vx - f * s;
  const Cx = vx - R * s;

  /* feixe de raios paralelos entrando e convergindo em F */
  const heights = [-84, -56, -28, 28, 56, 84];
  const sag = (y: number) => (y * y) / (2 * Rpx); // afundamento do arco (aproximação)

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="O foco não é uma peça: é onde a luz se junta">
        <p className="body">
          Pegue um espelho côncavo e aponte para o Sol. Os raios do Sol chegam praticamente paralelos (ele está
          longe demais). Todos eles voltam e se cruzam num único ponto. É ali que o papel queima. Esse ponto é
          o <T id="foco" />, e a distância dele até o espelho é a <T id="distanciaFocal" />.
        </p>
        <Note>
          O <T id="raioCurvatura" /> é o raio da esfera original. E existe uma relação simples entre os dois,
          que a prova quase sempre exige que você use antes de qualquer outra conta.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · o Sol batendo no espelho" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <Axis y={axisY} x1={20} x2={W - 20} />
          <SphericalMirror vx={vx} axisY={axisY} Rpx={Rpx} concave halfHeight={95} />

          {heights.map((dy) => {
            const hitX = vx - sag(dy);
            const hitY = axisY + dy;
            return (
              <g key={dy}>
                <Ray x1={40} y1={hitY} x2={hitX} y2={hitY} color={COLORS.ray} head="ray" width={2.2} arrow={false} />
                <Ray x1={hitX} y1={hitY} x2={Fx} y2={axisY} color={COLORS.ray} head="ray" width={2.2} opacity={0.95} />
                <Ray x1={Fx} y1={axisY} x2={Fx - (hitX - Fx) * 0.55} y2={axisY - dy * 0.55} color={COLORS.ray} head="ray" width={1.6} opacity={0.35} arrow={false} />
              </g>
            );
          })}

          <g>
            <circle cx={Fx} cy={axisY} r={20} fill={COLORS.amber} opacity={0.22} className="pulse" />
            <circle cx={Fx} cy={axisY} r={7} fill={COLORS.amber} />
          </g>
          <AxisPoint x={Fx} y={axisY} label="F" color={COLORS.purple} sub={`f = ${num(f, 1)} cm`} />
          <AxisPoint x={Cx} y={axisY} label="C" color={COLORS.blue} below sub={`R = ${num(R, 1)} cm`} />
          <AxisPoint x={vx} y={axisY} label="V" color={COLORS.cyan} below />
          <text x={60} y={44} fill={COLORS.text3} fontSize={13}>
            raios vindos de muito longe chegam paralelos…
          </text>
          <Badge x={Fx} y={axisY + 78} text="…e saem todos por aqui" color={COLORS.amber} />
        </Stage>

        <div className="stack">
          <div className="card card-flat">
            <Slider label="Raio de curvatura (R)" value={R} min={14} max={70} step={2} unit="cm" onChange={setR} hint="Veja o espelho ficar mais fundo ou mais raso." />
          </div>
          <Formula caption="o foco fica sempre na metade do caminho entre o espelho e C">f = R / 2</Formula>
          <Readout>
            <Row k="Raio de curvatura (R)" v={`${num(R, 1)} cm`} tone="var(--blue)" />
            <Row k="Conta" v={`${num(R, 1)} ÷ 2`} />
            <Row k="Distância focal (f)" v={`${num(f, 1)} cm`} tone="var(--purple)" />
          </Readout>
          <Note tone="purple">
            Vale ao contrário também: <b>R = 2f</b>. Se a questão te der R e a fórmula pedir f, converta antes de
            tudo. Se der f e pedir para desenhar C, dobre.
          </Note>
        </div>
      </div>

      <Reveal question="Por que exatamente metade, e não outro número qualquer?">
        <p className="body">
          Siga um raio paralelo bem pertinho do eixo. Ele bate no espelho num ponto onde a "normal" é a reta que
          liga aquele ponto ao centro C (porque em uma esfera a normal sempre aponta para o centro). Como o raio
          chegou paralelo ao eixo, o ângulo com a normal é igual ao ângulo que a normal faz com o eixo. Isso
          cria um triângulo com dois ângulos iguais — um triângulo isósceles — cujos lados iguais são "do ponto
          até F" e "de F até C". Conclusão: F fica exatamente no meio de V e C. Ou seja, f = R/2.
        </p>
      </Reveal>

      <div className="grid grid-2">
        <NumberCheck question="Um espelho côncavo tem raio de curvatura R = 60 cm. Qual é a distância focal?" answer={30} unit="cm" explain="f = R/2 = 60/2 = 30 cm." />
        <NumberCheck question="Outro espelho tem f = 12 cm. A que distância do espelho fica o ponto C?" answer={24} unit="cm" explain="R = 2f = 2 · 12 = 24 cm. C sempre fica no dobro do foco." />
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 6. FORMAÇÃO DE IMAGENS NO CÔNCAVO                                    */
/* ==================================================================== */

export function LicaoFormacaoImagens() {
  const f = 12;
  const [p, setP] = useState(36);
  const r = solveImage(p, f, 1);
  const reg = regionOf(p, f);

  const atalhos: { label: string; p: number }[] = [
    { label: 'Além de C', p: 36 },
    { label: 'Em C', p: 24 },
    { label: 'Entre C e F', p: 17 },
    { label: 'Em F', p: 12 },
    { label: 'Entre F e o espelho', p: 6 },
  ];

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="Cinco lugares, cinco histórias diferentes">
        <p className="body">
          No espelho côncavo a imagem muda completamente dependendo de <b>onde o objeto está</b>. Não adianta
          decorar as cinco situações numa tabela: arraste o objeto pelo desenho e veja a imagem mudar de lugar,
          de tamanho e até de lado. Depois disso a tabela vira só uma confirmação do que você já viu.
        </p>
      </Section>

      <div className="sim-layout">
        <MirrorScene p={p} f={f} pMax={48} onDragP={setP} showRegions label="Simulador · arraste o objeto" />

        <div className="stack">
          <div className="card card-flat stack">
            <span className="muted">Ir direto para uma região:</span>
            <div className="row" style={{ gap: 7 }}>
              {atalhos.map((a) => (
                <button key={a.label} className={`chip ${Math.abs(p - a.p) < 0.6 ? 'on' : ''}`} onClick={() => setP(a.p)}>
                  {a.label}
                </button>
              ))}
            </div>
            <Slider label="Posição do objeto (p)" value={p} min={2} max={48} step={0.5} unit="cm" onChange={setP} hint={`Neste espelho: f = ${f} cm e C = ${2 * f} cm.`} />
          </div>

          <div className="card stack" style={{ gap: 12 }}>
            <span className="eyebrow">A imagem agora</span>
            <div className="row" style={{ gap: 8 }}>
              <Tag tone={r.nature === 'real' ? 'real' : r.nature === 'virtual' ? 'virtual' : 'amber'}>
                {r.nature === 'impropria' ? 'imprópria' : r.nature.toUpperCase()}
              </Tag>
              <Tag tone={r.orientation === 'invertida' ? 'rose' : 'green'}>{r.orientation.toUpperCase()}</Tag>
              <Tag tone="blue">{r.size.toUpperCase()}</Tag>
            </div>
            <Readout>
              <Row k="Região do objeto" v={REGION_LABEL[reg]} />
              <Row k="p (objeto)" v={`${num(p, 1)} cm`} tone="var(--object)" />
              <Row k="p′ (imagem)" v={isFinite(r.pl) ? `${num(r.pl, 1)} cm` : '∞'} tone={r.nature === 'real' ? 'var(--image-real)' : 'var(--image-virtual)'} />
              <Row k="Aumento (A)" v={isFinite(r.A) ? num(r.A, 2) : '∞'} />
            </Readout>
          </div>

          <Note tone={r.nature === 'virtual' ? 'purple' : 'blue'}>{REGION_STORY[reg]}</Note>
        </div>
      </div>

      <Section n="Resumo" title="A tabela que agora faz sentido">
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                {['Onde está o objeto', 'Onde nasce a imagem', 'Natureza', 'Orientação', 'Tamanho'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '13px 16px', fontSize: 13, color: 'var(--text-3)', borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Além de C', 'Entre C e F', 'Real', 'Invertida', 'Menor'],
                ['Em C', 'Em C', 'Real', 'Invertida', 'Igual'],
                ['Entre C e F', 'Além de C', 'Real', 'Invertida', 'Maior'],
                ['Em F', 'No infinito', 'Imprópria', '—', '—'],
                ['Entre F e o espelho', 'Atrás do espelho', 'Virtual', 'Direita', 'Maior'],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 ? 'var(--surface-2)' : 'transparent' }}>
                  {row.map((c, j) => (
                    <td key={j} style={{ padding: '12px 16px', fontSize: 14.5, borderBottom: '1px solid var(--line)' }}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note tone="green">
          Um atalho que salva tempo na prova: no côncavo, <b>só existe imagem virtual quando o objeto está entre
          F e o espelho</b>. Em todos os outros casos ela é real e invertida. E toda imagem virtual de espelho é
          direita; toda imagem real de espelho é invertida.
        </Note>
      </Section>

      <QuickCheck
        question="Um objeto está entre C e F de um espelho côncavo. Como será a imagem?"
        options={[
          { text: 'Real, invertida e maior que o objeto.', ok: true, why: 'É o caso do espelho do dentista: a imagem cresce e vai para além de C.' },
          { text: 'Virtual, direita e maior.', why: 'Isso só acontece se o objeto estiver entre F e o espelho.' },
          { text: 'Real, invertida e menor.', why: 'Esse é o caso de objeto além de C.' },
          { text: 'Não se forma imagem.', why: 'Isso só ocorre exatamente em F.' },
        ]}
        explain="Objeto entre C e F ⇄ imagem além de C. As duas posições trocam de papel — é uma via de mão dupla."
      />
    </div>
  );
}

/* ==================================================================== */
/* 7. EQUAÇÃO DOS ESPELHOS                                              */
/* ==================================================================== */

export function LicaoEquacao() {
  const [p, setP] = useState(30);
  const [f, setF] = useState(10);
  const [h, setH] = useState(4);
  const r = solveImage(p, f, h);
  const pl = r.pl;

  return (
    <div className="stack-lg">
      <Section n="Antes da fórmula" title="Primeiro entenda o que cada letra é no desenho">
        <p className="body">
          A fórmula não é um feitiço. Ela só amarra quatro distâncias que você já viu no desenho. Antes de
          escrever qualquer coisa, identifique as peças:
        </p>
        <div className="grid grid-2">
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--object)' }}>p — onde está o objeto</b>
            <span className="body" style={{ fontSize: 14.5 }}>Do objeto até o espelho. O enunciado quase sempre dá esse valor ("um objeto a 30 cm do espelho").</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--purple)' }}>f — a força do espelho</b>
            <span className="body" style={{ fontSize: 14.5 }}>Do espelho até o foco. Se o enunciado der R, faça f = R/2 primeiro. Côncavo: +. Convexo: −.</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--image-real)' }}>p′ — onde nasce a imagem</b>
            <span className="body" style={{ fontSize: 14.5 }}>Do espelho até a imagem. Normalmente é a incógnita. O sinal dele responde "real ou virtual?".</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <b style={{ color: 'var(--cyan)' }}>h e h′ — as alturas</b>
            <span className="body" style={{ fontSize: 14.5 }}>Altura do objeto e da imagem. h′ negativo significa imagem de cabeça para baixo.</span>
          </div>
        </div>
      </Section>

      <MirrorScene p={p} f={f} pMax={60} onDragP={setP} label="As quatro distâncias, ao vivo" />

      <Section n="A ferramenta" title="Agora sim: as duas fórmulas">
        <div className="grid grid-2">
          <Formula caption="liga as três distâncias — use quando faltar uma delas">1/f = 1/p + 1/p′</Formula>
          <Formula caption="liga tamanho com distância — use quando aparecer altura ou 'quantas vezes maior'">A = −p′/p = h′/h</Formula>
        </div>
        <Note tone="amber">
          Repare no detalhe que derruba muita gente: a primeira fórmula não é "f = p + p′". São os{' '}
          <b>inversos</b> (1 dividido por cada um). Se você achar p′ = 15, precisa lembrar que o que você isolou
          foi 1/p′ — e ainda falta virar a fração de cabeça para baixo.
        </Note>
      </Section>

      <div className="sim-layout">
        <div className="card stack">
          <span className="eyebrow">Resolução passo a passo · ao vivo</span>
          <div className="calc-line">1/f = 1/p + 1/p′</div>
          <div className="calc-line">
            1/{num(f, 1)} = 1/{num(p, 1)} + 1/p′
          </div>
          <div className="calc-line">
            1/p′ = 1/{num(f, 1)} − 1/{num(p, 1)} = {num(1 / f - 1 / p, 4)}
          </div>
          <div className="calc-line" style={{ borderColor: 'var(--green)' }}>
            p′ = 1 ÷ {num(1 / f - 1 / p, 4)} = <b style={{ color: 'var(--green)' }}>{isFinite(pl) ? `${num(pl, 2)} cm` : 'infinito'}</b>
          </div>
          <div className="calc-line">
            A = −p′/p = −({num(pl, 2)}) / {num(p, 1)} = <b>{num(r.A, 2)}</b>
          </div>
          <div className="calc-line">
            h′ = A · h = {num(r.A, 2)} · {num(h, 1)} = <b>{num(r.hl, 2)} cm</b>
          </div>
        </div>

        <div className="stack">
          <div className="card card-flat stack">
            <Slider label="p — distância do objeto" value={p} min={2} max={60} step={0.5} unit="cm" onChange={setP} />
            <Slider label="f — distância focal (negativo = convexo)" value={f} min={-25} max={25} step={1} unit="cm" onChange={(v) => setF(v === 0 ? 1 : v)} />
            <Slider label="h — altura do objeto" value={h} min={1} max={10} step={0.5} unit="cm" onChange={setH} />
          </div>
          <Readout>
            <Row k="p′" v={isFinite(pl) ? `${num(pl, 2)} cm` : '∞'} tone={pl > 0 ? 'var(--image-real)' : 'var(--image-virtual)'} />
            <Row k="Natureza" v={<Tag tone={r.nature === 'real' ? 'real' : 'virtual'}>{r.nature}</Tag>} />
            <Row k="A (aumento)" v={num(r.A, 2)} />
            <Row k="h′ (altura da imagem)" v={`${num(r.hl, 2)} cm`} />
            <Row k="Orientação" v={r.orientation} tone={r.orientation === 'invertida' ? 'var(--rose)' : 'var(--green)'} />
          </Readout>
        </div>
      </div>

      <Reveal question="Como leio o resultado sem decorar tabela?">
        <div className="stack">
          <Note tone="green">
            <b>Sinal de p′:</b> positivo → a imagem está na frente do espelho, os raios se encontraram de
            verdade → <b>real</b>. Negativo → está atrás → <b>virtual</b>.
          </Note>
          <Note tone="rose">
            <b>Sinal de A:</b> negativo → <b>invertida</b>. Positivo → <b>direita</b>.
          </Note>
          <Note tone="blue">
            <b>Tamanho de A:</b> |A| &gt; 1 → maior que o objeto. |A| &lt; 1 → menor. |A| = 1 → igual.
          </Note>
        </div>
      </Reveal>

      <div className="grid grid-2">
        <NumberCheck
          question="Objeto a 30 cm de um espelho côncavo com f = 10 cm. Quanto vale p′?"
          answer={15}
          unit="cm"
          explain="1/p′ = 1/10 − 1/30 = 3/30 − 1/30 = 2/30 → p′ = 30/2 = 15 cm. Positivo: imagem real e invertida."
        />
        <NumberCheck
          question="No caso acima, quanto vale o aumento A?"
          answer={-0.5}
          tolerance={0.1}
          explain="A = −p′/p = −15/30 = −0,5. Negativo = invertida; 0,5 = metade do tamanho."
        />
      </div>
    </div>
  );
}
