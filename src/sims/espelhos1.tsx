import { useCallback, useRef, useState } from 'react';
import { Axis, AxisPoint, Badge, COLORS, Defs, LightSource, MidArrow, PlaneMirror, Ray, Ruler, ArrowObject } from '../components/svg';
import { Formula, Note, Readout, Reveal, Row, Section, Seg, Slider, Stage, T, Tag } from '../components/ui';
import { NumberCheck, QuickCheck } from '../components/Check';
import { useClock, useSvgDrag, clamp } from '../lib/hooks';
import { num } from '../lib/optics';

/* ==================================================================== */
/* 1. REFLEXÃO                                                          */
/* ==================================================================== */

export function LicaoReflexao() {
  const [i, setI] = useState(40);
  const [surface, setSurface] = useState<'lisa' | 'aspera'>('lisa');

  const W = 760;
  const H = 400;
  const surY = 300;
  const nx = 380;
  const L = 215;
  const rad = (i * Math.PI) / 180;

  const inStart = { x: nx - L * Math.sin(rad), y: surY - L * Math.cos(rad) };
  const outEnd = { x: nx + L * Math.sin(rad), y: surY - L * Math.cos(rad) };

  const arcR = 62;
  const arcIn = `M ${nx} ${surY - arcR} A ${arcR} ${arcR} 0 0 0 ${nx - arcR * Math.sin(rad)} ${surY - arcR * Math.cos(rad)}`;
  const arcOut = `M ${nx} ${surY - arcR} A ${arcR} ${arcR} 0 0 1 ${nx + arcR * Math.sin(rad)} ${surY - arcR * Math.cos(rad)}`;

  /* superfície áspera: mesma lei, mas cada pedacinho aponta para um lado */
  const bumpy = (x: number) => surY + 9 * Math.sin(x / 17) + 4 * Math.sin(x / 6.3);
  const slope = (x: number) => (9 / 17) * Math.cos(x / 17) + (4 / 6.3) * Math.cos(x / 6.3);
  const roughPath = (() => {
    let d = '';
    for (let x = 60; x <= W - 60; x += 6) d += `${x === 60 ? 'M' : 'L'} ${x} ${bumpy(x).toFixed(1)} `;
    return d;
  })();
  const roughRays = [200, 260, 320, 380, 440].map((hx) => {
    const y = bumpy(hx);
    const s = slope(hx);
    const nlen = Math.hypot(s, 1);
    const n = { x: s / nlen, y: -1 / nlen };
    const d = { x: Math.sin(rad), y: Math.cos(rad) };
    const dot = d.x * n.x + d.y * n.y;
    const r = { x: d.x - 2 * dot * n.x, y: d.y - 2 * dot * n.y };
    return {
      hx,
      y,
      from: { x: hx - 150 * d.x, y: y - 150 * d.y },
      to: { x: hx + 130 * r.x, y: y + 130 * r.y },
    };
  });

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A luz bate e volta — mas volta com regra">
        <p className="body">
          Reflexão é simplesmente a luz batendo numa superfície e voltando. O que a Física descobriu é que ela
          não volta de qualquer jeito: ela volta sempre com o <b>mesmo ângulo</b> com que chegou. Só que existe
          um detalhe que quase todo mundo erra na prova:
        </p>
        <Note tone="amber">
          Os ângulos <b>nunca</b> são medidos a partir do espelho. Eles são medidos a partir da <T id="normal" />.
          Se a questão der "o raio faz 30° com o espelho", o ângulo de incidência é <b>60°</b> (porque 90° − 30° = 60°).
          Essa é a pegadinha número 1 do assunto.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · reflexão" viewBox={`0 0 ${W} ${H}`}>
          <Defs />

          {surface === 'lisa' ? (
            <>
              {/* superfície espelhada */}
              <rect x={40} y={surY} width={W - 80} height={26} fill="var(--line)" opacity={0.5} rx={4} />
              <line x1={40} y1={surY} x2={W - 40} y2={surY} stroke={COLORS.cyan} strokeWidth={4} strokeLinecap="round" />

              {/* normal */}
              <line x1={nx} y1={surY} x2={nx} y2={60} stroke={COLORS.ghost} strokeWidth={2} strokeDasharray="7 6" />
              <text x={nx + 8} y={72} fill={COLORS.ghost} fontSize={13} fontWeight={700}>
                normal (90° com o espelho)
              </text>

              {/* raios */}
              <Ray x1={inStart.x} y1={inStart.y} x2={nx} y2={surY} color={COLORS.ray} head="ray" width={3} />
              <MidArrow x1={inStart.x} y1={inStart.y} x2={nx} y2={surY} />
              <Ray x1={nx} y1={surY} x2={outEnd.x} y2={outEnd.y} color={COLORS.ray2} head="ray2" width={3} />

              <LightSource x={inStart.x} y={inStart.y} label="fonte de luz" />

              {/* arcos dos ângulos */}
              <path d={arcIn} fill="none" stroke={COLORS.ray} strokeWidth={2} opacity={0.85} />
              <path d={arcOut} fill="none" stroke={COLORS.ray2} strokeWidth={2} opacity={0.85} />
              <Badge x={nx - 46} y={surY - 78} text={`i = ${i}°`} color={COLORS.ray} />
              <Badge x={nx + 46} y={surY - 78} text={`r = ${i}°`} color={COLORS.ray2} />

              <circle cx={nx} cy={surY} r={5} fill="#fff" />
              <text x={nx} y={surY + 44} fill={COLORS.text3} fontSize={12.5} textAnchor="middle">
                ponto de incidência
              </text>
            </>
          ) : (
            <>
              <path d={roughPath} fill="none" stroke={COLORS.line} strokeWidth={12} strokeLinecap="round" opacity={0.6} />
              <path d={roughPath} fill="none" stroke={COLORS.text3} strokeWidth={3} />
              {roughRays.map((r, k) => (
                <g key={k}>
                  <Ray x1={r.from.x} y1={r.from.y} x2={r.hx} y2={r.y} color={COLORS.ray} head="ray" width={2.2} opacity={0.9} />
                  <Ray x1={r.hx} y1={r.y} x2={r.to.x} y2={r.to.y} color={COLORS.ray2} head="ray2" width={2.2} opacity={0.9} />
                </g>
              ))}
              <text x={W / 2} y={surY + 62} fill={COLORS.text3} fontSize={13.5} textAnchor="middle">
                mesma lei em cada pontinho — mas cada pontinho está virado para um lado
              </text>
            </>
          )}
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={surface}
              onChange={setSurface}
              options={[
                { value: 'lisa', label: '🪞 Espelho (liso)' },
                { value: 'aspera', label: '🧱 Parede (áspera)' },
              ]}
            />
            <Slider
              label="Ângulo de incidência (i)"
              value={i}
              min={0}
              max={80}
              onChange={setI}
              unit="°"
              hint="Arraste e veja r acompanhar sozinho."
            />
          </div>

          <Formula caption="o ângulo de reflexão é sempre igual ao de incidência">i = r</Formula>

          <Readout>
            <Row k="Ângulo de incidência (i)" v={`${i}°`} tone="var(--ray)" />
            <Row k="Ângulo de reflexão (r)" v={`${i}°`} tone="var(--ray-2)" />
            <Row k="Ângulo com o espelho" v={`${90 - i}°`} tone="var(--text-3)" />
          </Readout>
        </div>
      </div>

      <Reveal>
        <div className="stack">
          <p className="body">
            Pense numa bola de bilhar batendo na tabela. Se ela chega bem de frente, volta bem de frente. Se
            chega de lado, sai pelo outro lado com a mesma inclinação. A luz faz exatamente isso — e o motivo é
            que, de todos os caminhos possíveis entre a fonte, o espelho e o seu olho, a luz percorre o mais
            curto (o mais rápido). Matematicamente, o caminho mais curto é justamente aquele em que os dois
            ângulos ficam iguais.
          </p>
          <Note tone="purple">
            <b>E a parede?</b> A parede também obedece i = r! A diferença é que a parede é cheia de morrinhos
            microscópicos, e cada morrinho está virado para uma direção diferente. Resultado: os raios saem
            espalhados para todo lado (chamamos isso de <b>reflexão difusa</b>) e você não enxerga uma imagem,
            só enxerga a parede. O espelho é liso na escala da luz, então todos os raios saem organizados
            (<b>reflexão regular</b>) — e aí aparece a imagem. Clique em "Parede (áspera)" no simulador e compare.
          </Note>
        </div>
      </Reveal>

      <QuickCheck
        question="Um raio de luz chega a um espelho plano formando 25° COM A SUPERFÍCIE do espelho. Qual é o ângulo de reflexão?"
        options={[
          { text: '25°', why: 'Esse é o ângulo com o espelho, e não com a normal.' },
          { text: '65°', ok: true, why: 'Isso: 90° − 25° = 65° é o ângulo de incidência medido da normal, e r = i.' },
          { text: '50°' },
          { text: '90°' },
        ]}
        explain="Sempre converta primeiro: ângulo com a normal = 90° − ângulo com o espelho. Depois aplique i = r."
      />

      <NumberCheck
        question="No simulador, se i = 37°, quanto mede o ângulo entre o raio incidente e o raio refletido (os dois juntos)?"
        answer={74}
        unit="graus"
        explain="Cada raio faz 37° com a normal, um de cada lado. Então entre eles: 37° + 37° = 74°."
      />
    </div>
  );
}

/* ==================================================================== */
/* 2. ESPELHO PLANO                                                     */
/* ==================================================================== */

export function LicaoEspelhoPlano() {
  const W = 820;
  const H = 400;
  const mirrorX = 470;
  const axisY = 270;
  const SCALE = 66; // pixels por metro
  const [d, setD] = useState(2); // distância objeto-espelho, em metros

  const svgRef = useRef<SVGSVGElement>(null);
  const onDrag = useCallback((x: number) => {
    const meters = (mirrorX - x) / SCALE;
    setD(clamp(Math.round(meters * 10) / 10, 0.4, 4.4));
  }, []);
  const { startDrag } = useSvgDrag(svgRef, W, onDrag);

  const objX = mirrorX - d * SCALE;
  const imgX = mirrorX + d * SCALE;
  const h = 96;
  const topY = axisY - h;

  const eye = { x: 165, y: 105 };
  const mFor = (fromY: number) => {
    const t = (mirrorX - imgX) / (eye.x - imgX);
    return { x: mirrorX, y: fromY + t * (eye.y - fromY) };
  };
  const mTop = mFor(topY);
  const mBase = mFor(axisY);

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="O espelho não guarda nada atrás dele">
        <p className="body">
          Quando você se olha no espelho do banheiro, seu cérebro jura que existe "alguém" atrás do vidro. Não
          existe. Os raios que saem de você batem no espelho e voltam <b>divergindo</b> (se espalhando). Seu
          cérebro só sabe fazer uma coisa: estica esses raios para trás em linha reta e conclui que eles vieram
          de um ponto lá atrás. Esse ponto inventado é a <T id="imagemVirtual" />.
        </p>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · espelho plano (arraste o objeto)" viewBox={`0 0 ${W} ${H}`} svgRef={svgRef}>
          <Defs />
          <Axis y={axisY} x1={60} x2={W - 40} />

          {/* região atrás do espelho */}
          <rect x={mirrorX} y={40} width={W - mirrorX - 20} height={H - 60} fill="var(--ghost)" opacity={0.045} />
          <text x={mirrorX + 16} y={64} fill={COLORS.text3} fontSize={12.5} fontWeight={650}>
            aqui atrás não existe nada de verdade
          </text>

          <PlaneMirror x={mirrorX} y1={70} y2={352} />
          <text x={mirrorX} y={378} fill={COLORS.cyan} fontSize={13} fontWeight={750} textAnchor="middle">
            ESPELHO
          </text>

          {/* raios até o olho */}
          <Ray x1={objX} y1={topY} x2={mTop.x} y2={mTop.y} color={COLORS.ray} head="ray" width={2.2} arrow={false} />
          <Ray x1={mTop.x} y1={mTop.y} x2={eye.x} y2={eye.y} color={COLORS.ray} head="ray" width={2.2} />
          <Ray x1={imgX} y1={topY} x2={mTop.x} y2={mTop.y} color={COLORS.ghost} head="ghost" width={1.8} dashed arrow={false} />

          <Ray x1={objX} y1={axisY} x2={mBase.x} y2={mBase.y} color={COLORS.ray} head="ray" width={2.2} arrow={false} opacity={0.8} />
          <Ray x1={mBase.x} y1={mBase.y} x2={eye.x} y2={eye.y} color={COLORS.ray} head="ray" width={2.2} opacity={0.8} />
          <Ray x1={imgX} y1={axisY} x2={mBase.x} y2={mBase.y} color={COLORS.ghost} head="ghost" width={1.8} dashed arrow={false} />

          {/* olho */}
          <g>
            <ellipse cx={eye.x} cy={eye.y} rx={19} ry={12} fill="none" stroke={COLORS.text2} strokeWidth={2} />
            <circle cx={eye.x} cy={eye.y} r={6} fill={COLORS.blue} />
            <text x={eye.x} y={eye.y + 32} fill={COLORS.text3} fontSize={12} textAnchor="middle">
              seu olho
            </text>
          </g>

          <ArrowObject x={objX} baseY={axisY} height={h} color={COLORS.object} head="object" label="OBJETO" draggable onPointerDown={startDrag} />
          <ArrowObject x={imgX} baseY={axisY} height={h} color={COLORS.virtual} head="virtual" label="IMAGEM" dashed sub="(virtual)" />

          <Ruler x1={objX} x2={mirrorX} y={axisY + 42} label={`${num(d, 1)} m`} color={COLORS.object} />
          <Ruler x1={mirrorX} x2={imgX} y={axisY + 42} label={`${num(d, 1)} m`} color={COLORS.virtual} />
          <Ruler x1={objX} x2={imgX} y={axisY + 88} label={`objeto → imagem = ${num(2 * d, 1)} m`} color={COLORS.purple} />
        </Stage>

        <div className="stack">
          <div className="card card-flat">
            <Slider
              label="Distância objeto → espelho"
              value={d}
              min={0.4}
              max={4.4}
              step={0.1}
              unit="m"
              onChange={setD}
              hint="Ou arraste a seta verde direto no desenho."
            />
          </div>

          <Readout>
            <Row k="objeto → espelho" v={`${num(d, 1)} m`} tone="var(--object)" />
            <Row k="espelho → imagem" v={`${num(d, 1)} m`} tone="var(--image-virtual)" />
            <Row k="objeto → imagem" v={`${num(2 * d, 1)} m`} tone="var(--purple)" />
            <Row k="Tamanho da imagem" v="igual ao objeto" />
            <Row k="Natureza" v={<Tag tone="virtual">virtual</Tag>} />
            <Row k="Orientação" v="direita" />
          </Readout>

          <Note tone="green">
            A distância objeto–imagem é sempre <b>o dobro</b> da distância objeto–espelho. Se a prova disser
            "uma pessoa anda 1 m na direção do espelho", ela se aproxima 2 m da própria imagem.
          </Note>
        </div>
      </div>

      <Reveal question="Por que a imagem fica exatamente à mesma distância?">
        <p className="body">
          Olhe para os dois raios amarelos do desenho. Eles saem do mesmo ponto do objeto, batem no espelho em
          pontos diferentes e voltam obedecendo i = r. As linhas azuis tracejadas são o "esticão" que seu
          cérebro dá nesses raios. A geometria garante que esses esticões só podem se cruzar num ponto que está
          alinhado com o objeto e exatamente à mesma distância do outro lado — nem mais perto, nem mais longe.
          Arraste o objeto e repare: os dois números sempre continuam iguais.
        </p>
      </Reveal>

      <div className="grid grid-2">
        <QuickCheck
          question="Se eu aproximar o objeto do espelho, o que acontece com a imagem?"
          options={[
            { text: 'A imagem também se aproxima do espelho, e continua do mesmo tamanho.', ok: true, why: 'Ela acompanha o objeto, sempre à mesma distância do outro lado.' },
            { text: 'A imagem fica maior.', why: 'No espelho plano o tamanho nunca muda. Ela parece maior só porque está mais perto do seu olho.' },
            { text: 'A imagem se afasta.', why: 'Ela faz o contrário: espelha o movimento.' },
            { text: 'A imagem some.' },
          ]}
          explain="No espelho plano a imagem é sempre virtual, direita, do mesmo tamanho e simétrica. A única coisa que muda é a posição."
        />
        <NumberCheck
          question="Uma pessoa está a 2 m do espelho e dá 1 m de recuo (se afasta). Qual passa a ser a distância entre ela e a imagem dela?"
          answer={6}
          unit="m"
          explain="Ela fica a 3 m do espelho. A imagem também fica a 3 m do outro lado. Logo 3 + 3 = 6 m."
        />
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 3. IMAGEM REAL x IMAGEM VIRTUAL                                      */
/* ==================================================================== */

export function LicaoRealVirtual() {
  const [kind, setKind] = useState<'real' | 'virtual'>('real');
  const [paper, setPaper] = useState(false);
  const t = useClock(true, 0.42);

  const W = 800;
  const H = 400;
  const axisY = 220;
  const devX = 400;
  const srcX = 120;
  const srcY = 150;

  /* Caminhos dos raios: lista de pontos. Reais (sólidos) e prolongamentos (tracejados). */
  const meet = kind === 'real' ? { x: 660, y: 292 } : { x: 120, y: 292 };

  const rays =
    kind === 'real'
      ? [
          [{ x: srcX, y: srcY }, { x: devX, y: 150 }, { x: meet.x, y: meet.y }],
          [{ x: srcX, y: srcY }, { x: devX, y: 262 }, { x: meet.x, y: meet.y }],
        ]
      : [
          [{ x: srcX, y: srcY }, { x: devX, y: 152 }, { x: 760, y: 92 }],
          [{ x: srcX, y: srcY }, { x: devX, y: 262 }, { x: 760, y: 340 }],
        ];

  const ghosts =
    kind === 'virtual'
      ? [
          [{ x: devX, y: 152 }, { x: meet.x, y: meet.y }],
          [{ x: devX, y: 262 }, { x: meet.x, y: meet.y }],
        ]
      : [];

  const pointAt = (pts: { x: number; y: number }[], frac: number) => {
    const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
    const total = segs.reduce((a, b) => a + b, 0);
    let dist = frac * total;
    for (let i = 0; i < segs.length; i++) {
      if (dist <= segs[i]) {
        const k = segs[i] === 0 ? 0 : dist / segs[i];
        return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
      }
      dist -= segs[i];
    }
    return pts[pts.length - 1];
  };

  const phases = [0, 0.33, 0.66];

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A pergunta que decide tudo: os raios se encontram mesmo?">
        <p className="body">
          Essa é a distinção mais importante de toda a óptica, e ela cabe em uma pergunta: depois de baterem no
          espelho (ou atravessarem a lente), os raios de luz <b>realmente se cruzam</b> em algum ponto do
          espaço, ou eles saem se espalhando e quem se cruza são apenas os <b>prolongamentos imaginários</b>{' '}
          deles?
        </p>
        <div className="grid grid-2">
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <Tag tone="real">IMAGEM REAL</Tag>
            <p className="body" style={{ fontSize: 15 }}>
              Os raios de luz <b>se encontram de verdade</b> naquele ponto. Tem luz chegando ali fisicamente.
              Por isso dá para colocar uma folha de papel no lugar e a imagem aparece projetada. É o que
              acontece no cinema.
            </p>
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <Tag tone="virtual">IMAGEM VIRTUAL</Tag>
            <p className="body" style={{ fontSize: 15 }}>
              Os raios <b>não se encontram</b>: eles vão embora divergindo. Só os prolongamentos (as linhas
              tracejadas, que existem apenas no desenho) se cruzam. A folha de papel ali não mostra nada —
              mas seu olho enxerga.
            </p>
          </div>
        </div>
      </Section>

      <div className="sim-layout">
        <Stage label={`Animação · imagem ${kind}`} viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <Axis y={axisY} x1={40} x2={W - 30} />

          {/* dispositivo óptico */}
          <g>
            <rect x={devX - 9} y={90} width={18} height={250} rx={9} fill="var(--cyan)" opacity={0.18} stroke={COLORS.cyan} strokeWidth={2} />
            <text x={devX} y={368} fill={COLORS.cyan} fontSize={12.5} fontWeight={700} textAnchor="middle">
              {kind === 'real' ? 'sistema que CONVERGE a luz' : 'sistema que DIVERGE a luz'}
            </text>
          </g>

          {ghosts.map((pts, k) => (
            <Ray key={`g${k}`} x1={pts[0].x} y1={pts[0].y} x2={pts[1].x} y2={pts[1].y} color={COLORS.ghost} head="ghost" dashed width={2} arrow={false} opacity={0.85} />
          ))}

          {rays.map((pts, k) =>
            pts.slice(1).map((p, i) => (
              <Ray key={`r${k}-${i}`} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y} color={COLORS.ray} head="ray" width={2.4} arrow={i === pts.length - 2} />
            )),
          )}

          {/* fótons animados */}
          {rays.map((pts, k) =>
            phases.map((ph, j) => {
              const f = (t + ph) % 1;
              const p = pointAt(pts, f);
              return <circle key={`p${k}-${j}`} cx={p.x} cy={p.y} r={5} fill="#fff" opacity={0.9} />;
            }),
          )}

          <LightSource x={srcX} y={srcY} label="ponto do objeto" />

          {/* ponto de encontro */}
          <g className="spark">
            <circle cx={meet.x} cy={meet.y} r={15} fill={kind === 'real' ? COLORS.real : COLORS.virtual} opacity={0.2} />
            <circle cx={meet.x} cy={meet.y} r={6} fill={kind === 'real' ? COLORS.real : COLORS.virtual} />
            <Badge
              x={meet.x}
              y={meet.y + 44}
              text={kind === 'real' ? 'os raios se encontram AQUI' : 'só os prolongamentos se cruzam'}
              color={kind === 'real' ? COLORS.real : COLORS.virtual}
            />
          </g>

          {/* folha de papel */}
          {paper && (
            <g>
              <rect x={meet.x - 6} y={meet.y - 62} width={12} height={124} rx={3} fill="#f6f7ff" opacity={0.92} />
              {kind === 'real' ? (
                <>
                  <circle cx={meet.x} cy={meet.y} r={9} fill={COLORS.real} className="spark" />
                  <Badge x={meet.x} y={meet.y - 80} text="apareceu na folha! ✅" color={COLORS.real} />
                </>
              ) : (
                <Badge x={meet.x} y={meet.y - 80} text="folha em branco ❌" color={COLORS.text3} />
              )}
            </g>
          )}
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={kind}
              onChange={(v) => {
                setKind(v);
                setPaper(false);
              }}
              options={[
                { value: 'real', label: 'Real' },
                { value: 'virtual', label: 'Virtual' },
              ]}
            />
            <button className={`btn ${paper ? '' : 'btn-primary'}`} onClick={() => setPaper((p) => !p)}>
              {paper ? '🗑️ Tirar a folha' : '📄 Colocar uma folha no ponto'}
            </button>
          </div>

          <Readout>
            <Row k="Raios de luz" v={kind === 'real' ? 'convergem' : 'divergem'} />
            <Row k="Quem se cruza" v={kind === 'real' ? 'os raios (luz de verdade)' : 'os prolongamentos'} />
            <Row k="Dá para projetar?" v={kind === 'real' ? 'sim' : 'não'} tone={kind === 'real' ? 'var(--green)' : 'var(--rose)'} />
            <Row k="Posição no espelho" v={kind === 'real' ? 'na frente' : 'atrás'} />
            <Row k="Sinal de p′" v={kind === 'real' ? 'positivo (+)' : 'negativo (−)'} />
          </Readout>

          <Note tone="purple">
            Guarde esse par: <b>p′ &gt; 0 → real e invertida</b>. <b>p′ &lt; 0 → virtual e direita</b>. Nos
            espelhos e lentes isso anda sempre junto. É por isso que o sinal da conta já entrega a resposta da
            questão.
          </Note>
        </div>
      </div>

      <QuickCheck
        question="Numa questão você calculou p′ = −12 cm. O que isso significa na prática?"
        options={[
          { text: 'Você errou a conta: distância não pode ser negativa.', why: 'Pode sim! O sinal aqui não é "tamanho negativo", é informação sobre o tipo de imagem.' },
          { text: 'A imagem é virtual, está 12 cm atrás do espelho e é direita.', ok: true, why: 'O sinal negativo é o recado "sou virtual".' },
          { text: 'A imagem é real e está 12 cm na frente.' },
          { text: 'O objeto está atrás do espelho.' },
        ]}
        explain="O sinal de p′ é a resposta da pergunta 'os raios se encontraram?'. Negativo = não se encontraram = virtual."
      />
    </div>
  );
}
