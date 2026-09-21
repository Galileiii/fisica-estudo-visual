import { useState } from 'react';
import { LensScene } from './lensScene';
import { Axis, Badge, COLORS, Defs, LightSource, Ray } from '../components/svg';
import { Formula, Note, Readout, Reveal, Row, Section, Seg, Slider, Stage, T, Tag } from '../components/ui';
import { NumberCheck, QuickCheck } from '../components/Check';
import { criticalAngle, num, snellRefract, solveImage } from '../lib/optics';

/* ==================================================================== */
/* 1. REFRAÇÃO — por que a luz entorta                                  */
/* ==================================================================== */

const MATERIAIS = [
  { nome: 'Água', n: 1.33 },
  { nome: 'Vidro', n: 1.5 },
  { nome: 'Diamante', n: 2.42 },
];

export function LicaoRefracao() {
  const [i, setI] = useState(45);
  const [mat, setMat] = useState(1);
  const [dir, setDir] = useState<'entrando' | 'saindo'>('entrando');

  const n = MATERIAIS[mat].n;
  const n1 = dir === 'entrando' ? 1 : n;
  const n2 = dir === 'entrando' ? n : 1;
  const rAng = snellRefract(n1, n2, i);
  const crit = criticalAngle(n1, n2);

  const W = 780;
  const H = 420;
  const surY = 210;
  const nx = 390;
  const L = 185;
  const rad = (i * Math.PI) / 180;
  const rrad = ((rAng ?? 0) * Math.PI) / 180;
  const down = dir === 'entrando';

  const inStart = { x: nx - L * Math.sin(rad), y: down ? surY - L * Math.cos(rad) : surY + L * Math.cos(rad) };
  const refr = { x: nx + L * Math.sin(rrad), y: down ? surY + L * Math.cos(rrad) : surY - L * Math.cos(rrad) };
  const refl = { x: nx + L * Math.sin(rad), y: down ? surY - L * Math.cos(rad) : surY + L * Math.cos(rad) };

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A luz muda de velocidade — e por isso entorta">
        <p className="body">
          A luz não anda com a mesma velocidade em todo lugar. No ar ela é rapidíssima; dentro da água ou do
          vidro ela fica mais lenta. Quando um raio chega inclinado na divisa entre dois materiais, um lado da
          "frente de onda" freia antes do outro — e o raio inteiro gira. Isso é a <T id="refracao" />.
        </p>
        <Note tone="purple">
          A analogia que resolve: imagine um carrinho de supermercado entrando em diagonal do asfalto para a
          areia. A roda que toca a areia primeiro freia antes, e o carrinho inteiro vira. A luz faz exatamente
          isso. E é por isso que o canudo parece quebrado dentro do copo, e que a piscina parece mais rasa do
          que é.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · refração (lei de Snell)" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          {/* meios */}
          <rect x={0} y={0} width={W} height={surY} fill={down ? 'var(--surface-2)' : 'var(--blue)'} opacity={down ? 0.5 : 0.1} />
          <rect x={0} y={surY} width={W} height={H - surY} fill={down ? 'var(--blue)' : 'var(--surface-2)'} opacity={down ? 0.1 : 0.5} />
          <line x1={0} y1={surY} x2={W} y2={surY} stroke={COLORS.cyan} strokeWidth={2.5} />

          <text x={18} y={30} fill={COLORS.text3} fontSize={13.5} fontWeight={650}>
            {down ? 'AR  ·  n = 1' : `${MATERIAIS[mat].nome.toUpperCase()}  ·  n = ${n}`}
          </text>
          <text x={18} y={H - 16} fill={COLORS.text3} fontSize={13.5} fontWeight={650}>
            {down ? `${MATERIAIS[mat].nome.toUpperCase()}  ·  n = ${n}` : 'AR  ·  n = 1'}
          </text>

          {/* normal */}
          <line x1={nx} y1={30} x2={nx} y2={H - 30} stroke={COLORS.ghost} strokeWidth={1.8} strokeDasharray="7 6" />
          <text x={nx + 8} y={down ? 46 : H - 40} fill={COLORS.ghost} fontSize={12.5} fontWeight={650}>
            normal
          </text>

          {/* raio incidente */}
          <Ray x1={inStart.x} y1={inStart.y} x2={nx} y2={surY} color={COLORS.ray} head="ray" width={3} />
          <LightSource x={inStart.x} y={inStart.y} />

          {/* refratado ou reflexão total */}
          {rAng !== null ? (
            <>
              <Ray x1={nx} y1={surY} x2={refr.x} y2={refr.y} color={COLORS.cyan} head="cyan" width={3} />
              <Badge x={refr.x + 10} y={refr.y} text={`r = ${num(rAng, 1)}°`} color={COLORS.cyan} anchor="start" />
            </>
          ) : (
            <>
              <Ray x1={nx} y1={surY} x2={refl.x} y2={refl.y} color={COLORS.rose} head="rose" width={3} />
              <Badge x={nx + 120} y={down ? surY - 120 : surY + 130} text="REFLEXÃO TOTAL: a luz não sai!" color={COLORS.rose} />
            </>
          )}

          {/* parte refletida fraca */}
          {rAng !== null && <Ray x1={nx} y1={surY} x2={refl.x} y2={refl.y} color={COLORS.ray} head="ray" width={1.6} opacity={0.3} />}

          <Badge x={nx - 105} y={down ? surY - 60 : surY + 70} text={`i = ${i}°`} color={COLORS.ray} />
          <circle cx={nx} cy={surY} r={5} fill="#fff" />
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={dir}
              onChange={setDir}
              options={[
                { value: 'entrando', label: 'Ar → material' },
                { value: 'saindo', label: 'Material → ar' },
              ]}
            />
            <div className="row" style={{ gap: 7 }}>
              {MATERIAIS.map((m, k) => (
                <button key={m.nome} className={`chip ${k === mat ? 'on' : ''}`} onClick={() => setMat(k)}>
                  {m.nome} (n={m.n})
                </button>
              ))}
            </div>
            <Slider label="Ângulo de incidência (i)" value={i} min={0} max={85} onChange={setI} unit="°" />
          </div>

          <Formula caption="lei de Snell — a regra que diz quanto a luz entorta">n₁ · sen i = n₂ · sen r</Formula>

          <Readout>
            <Row k="n do meio de entrada (n₁)" v={num(n1, 2)} />
            <Row k="n do meio de saída (n₂)" v={num(n2, 2)} />
            <Row k="Ângulo de incidência (i)" v={`${i}°`} tone="var(--ray)" />
            <Row k="Ângulo de refração (r)" v={rAng === null ? 'não existe' : `${num(rAng, 1)}°`} tone="var(--cyan)" />
            <Row k="O raio…" v={rAng === null ? 'voltou todo' : rAng < i ? 'aproximou-se da normal' : 'afastou-se da normal'} />
            {crit && <Row k="Ângulo limite" v={`${num(crit, 1)}°`} tone="var(--rose)" />}
          </Readout>

          <Note tone={rAng === null ? 'rose' : 'blue'}>
            {rAng === null ? (
              <>
                Passando de {i}° do {MATERIAIS[mat].nome.toLowerCase()} para o ar, a luz não consegue mais sair:
                ela reflete inteira de volta. Isso é a <b>reflexão total</b>, e é assim que funciona a fibra
                óptica.
              </>
            ) : (
              <>
                Regra prática: entrando num material <b>mais denso</b> (n maior), o raio <b>se aproxima</b> da
                normal. Saindo para um material menos denso, ele <b>se afasta</b>. Teste trocando o material.
              </>
            )}
          </Note>
        </div>
      </div>

      <Reveal question="O que isso tem a ver com lentes?">
        <p className="body">
          Uma lente é só um pedaço de vidro com as faces curvas. Cada raio que chega bate numa inclinação
          diferente do vidro e por isso entorta um tanto diferente. O formato é escolhido de propósito para que
          todos os raios entortem exatamente o quanto for preciso para se encontrarem num único ponto — o foco.
          Uma lente é, literalmente, refração organizada.
        </p>
      </Reveal>

      <QuickCheck
        question="Um raio passa do ar para o vidro. O que acontece com ele?"
        options={[
          { text: 'Aproxima-se da normal, porque no vidro a luz anda mais devagar.', ok: true, why: 'Meio mais refringente (n maior) sempre puxa o raio para a normal.' },
          { text: 'Afasta-se da normal.', why: 'Isso acontece no sentido contrário: do vidro para o ar.' },
          { text: 'Continua reto sempre.', why: 'Só continua reto num caso: se chegar exatamente a 0° (perpendicular).' },
          { text: 'Some.' },
        ]}
        explain="Só existe uma exceção: incidência perpendicular (i = 0°). Aí a luz muda de velocidade, mas não muda de direção."
      />
    </div>
  );
}

/* ==================================================================== */
/* 2. LENTE CONVERGENTE                                                 */
/* ==================================================================== */

export function LicaoConvergente() {
  const f = 12;
  const [p, setP] = useState(36);
  const r = solveImage(p, f, 1);

  const atalhos = [
    { label: 'Além de 2F', p: 36 },
    { label: 'Em 2F', p: 24 },
    { label: 'Entre 2F e F', p: 17 },
    { label: 'Em F', p: 12 },
    { label: 'Lupa (antes de F)', p: 6 },
  ];

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A lupa: vidro mais grosso no meio">
        <p className="body">
          A <T id="convergente" /> é grossa no meio e fina nas bordas. Os raios que chegam paralelos ao eixo
          saem dela todos apontando para o mesmo ponto: o foco. Ela é a lente da lupa, da câmera, do projetor e
          do olho humano.
        </p>
        <Note>
          Só existem <b>dois raios</b> que você precisa saber desenhar (e eles já resolvem qualquer questão):
          <br />
          <b>1.</b> O raio que chega <b>paralelo ao eixo</b> sai passando pelo foco F′.
          <br />
          <b>2.</b> O raio que passa pelo <b>centro da lente</b> segue reto, sem entortar.
          <br />O ponto onde esses dois se cruzam é o topo da imagem. Só isso.
        </Note>
      </Section>

      <div className="sim-layout">
        <LensScene p={p} f={f} pMax={48} onDragP={setP} label="Simulador · lente convergente (arraste o objeto)" />
        <div className="stack">
          <div className="card card-flat stack">
            <div className="row" style={{ gap: 7 }}>
              {atalhos.map((a) => (
                <button key={a.label} className={`chip ${Math.abs(p - a.p) < 0.6 ? 'on' : ''}`} onClick={() => setP(a.p)}>
                  {a.label}
                </button>
              ))}
            </div>
            <Slider label="Posição do objeto (p)" value={p} min={2} max={48} step={0.5} unit="cm" onChange={setP} hint={`Esta lente tem f = ${f} cm, então 2F = ${2 * f} cm.`} />
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
              <Row k="p′" v={isFinite(r.pl) ? `${num(r.pl, 1)} cm` : '∞'} />
              <Row k="Aumento (A)" v={isFinite(r.A) ? num(r.A, 2) : '∞'} />
              <Row k="Lado da imagem" v={r.pl > 0 ? 'lado oposto ao objeto' : 'mesmo lado do objeto'} />
            </Readout>
          </div>

          <Note tone={r.nature === 'virtual' ? 'purple' : 'blue'}>
            {p < f
              ? 'Objeto mais perto que o foco: é o modo LUPA. A imagem fica virtual, direita e maior — e aparece do mesmo lado do objeto, é por isso que você vê a letra ampliada "dentro" da lente.'
              : p < 2 * f - 0.5
                ? 'Objeto entre F e 2F: imagem real, invertida e MAIOR, projetada do outro lado. É o projetor de cinema.'
                : Math.abs(p - 2 * f) < 0.6
                  ? 'Objeto exatamente em 2F: a imagem nasce também em 2F, real, invertida e do mesmo tamanho.'
                  : 'Objeto além de 2F: imagem real, invertida e MENOR, entre F′ e 2F′. É o que sua câmera de celular faz com o mundo inteiro.'}
          </Note>
        </div>
      </div>

      <Reveal question="Por que o raio que passa pelo centro não entorta?">
        <p className="body">
          Bem no meio da lente, as duas faces (a da frente e a de trás) são praticamente paralelas — como se
          fosse uma janela de vidro plana. Numa janela, a luz entorta ao entrar e desentorta exatamente igual ao
          sair. Resultado: ela segue na mesma direção. Por isso o raio central é o mais fácil de desenhar: é só
          uma reta.
        </p>
      </Reveal>

      <QuickCheck
        question="Uma câmera fotografa uma pessoa a 3 m de distância, com uma lente de f = 5 cm. Que tipo de imagem se forma no sensor?"
        options={[
          { text: 'Real, invertida e menor.', ok: true, why: 'O objeto está muito além de 2F, então a imagem cai pertinho de F′, minúscula e de cabeça para baixo — e por isso pode ser projetada no sensor.' },
          { text: 'Virtual, direita e menor.', why: 'Virtual não pode: imagem virtual não se projeta em sensor nenhum.' },
          { text: 'Real, direita e maior.' },
          { text: 'Virtual, direita e maior.', why: 'Esse é o caso da lupa, com o objeto antes do foco.' },
        ]}
        explain="Regra de ouro: se a imagem precisa aparecer numa tela, num sensor ou numa parede, ela é obrigatoriamente REAL."
      />
    </div>
  );
}

/* ==================================================================== */
/* 3. LENTE DIVERGENTE                                                  */
/* ==================================================================== */

export function LicaoDivergente() {
  const [p, setP] = useState(24);
  const f = -12;
  const r = solveImage(p, f, 1);

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A lente que espalha: sempre a mesma resposta">
        <p className="body">
          A <T id="divergente" /> é fina no meio e grossa nas bordas. Ela faz o contrário da lupa: abre os
          raios. Por isso a resposta dela nunca muda — arraste o objeto para onde quiser e confira.
        </p>
      </Section>

      <div className="sim-layout">
        <LensScene p={p} f={f} pMax={44} onDragP={setP} label="Simulador · lente divergente" />
        <div className="stack">
          <div className="card card-flat">
            <Slider label="Posição do objeto (p)" value={p} min={2} max={44} step={0.5} unit="cm" onChange={setP} hint="Tente encontrar alguma posição que mude a natureza da imagem. (Spoiler: não existe.)" />
          </div>
          <div className="card stack" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 8 }}>
              <Tag tone="virtual">VIRTUAL</Tag>
              <Tag tone="green">DIREITA</Tag>
              <Tag tone="blue">MENOR</Tag>
            </div>
            <Readout>
              <Row k="f" v={`${f} cm (negativo)`} tone="var(--purple)" />
              <Row k="p′" v={`${num(r.pl, 1)} cm`} tone="var(--image-virtual)" />
              <Row k="A" v={num(r.A, 2)} />
              <Row k="A imagem cabe entre…" v="a lente e o foco" />
            </Readout>
          </div>
          <Note tone="green">
            Tudo o que você precisa gravar da divergente: <b>f é negativo</b>, a imagem é <b>sempre</b> virtual,
            direita, menor e do mesmo lado do objeto. Se sua conta der outra coisa, o erro está no sinal do f.
          </Note>
        </div>
      </div>

      <QuickCheck
        question="Você calculou, para uma lente divergente, p′ = +8 cm. O que isso indica?"
        options={[
          { text: 'A imagem é real — coisa normal para essa lente.', why: 'Lente divergente com objeto real nunca dá imagem real.' },
          { text: 'Provavelmente você esqueceu de colocar f negativo.', ok: true, why: 'Exato. Com f < 0 e p > 0, o p′ sempre sai negativo.' },
          { text: 'O objeto está atrás da lente.' },
          { text: 'A lente está invertida.' },
        ]}
        explain="Use o resultado como detector de erro: divergente com p′ positivo é sinal trocado, 100% das vezes."
      />
    </div>
  );
}

/* ==================================================================== */
/* 4. EQUAÇÃO DAS LENTES                                                */
/* ==================================================================== */

export function LicaoEquacaoLentes() {
  const [p, setP] = useState(30);
  const [f, setF] = useState(10);
  const r = solveImage(p, f, 1);

  return (
    <div className="stack-lg">
      <Section n="Boa notícia" title="É a MESMA fórmula dos espelhos">
        <p className="body">
          Você não precisa aprender uma fórmula nova. A equação das lentes é idêntica à dos espelhos — o que
          muda é só o significado geométrico do sinal de p′.
        </p>
        <div className="grid grid-2">
          <Formula caption="equação de Gauss (vale para espelho e para lente)">1/f = 1/p + 1/p′</Formula>
          <Formula caption="aumento (idêntico)">A = −p′/p = h′/h</Formula>
        </div>
        <div className="grid grid-2">
          <Note tone="blue">
            <b>No espelho:</b> p′ &gt; 0 → imagem <b>na frente</b> do espelho (mesmo lado do objeto, onde a luz
            voltou).
          </Note>
          <Note tone="purple">
            <b>Na lente:</b> p′ &gt; 0 → imagem <b>do outro lado</b> da lente (onde a luz saiu). Em ambos os
            casos, p′ &gt; 0 continua significando <b>real</b>.
          </Note>
        </div>
      </Section>

      <div className="sim-layout">
        <div className="stack">
          <LensScene p={p} f={f} pMax={50} onDragP={setP} showRuler label="Confira a conta no desenho" />
          <div className="card stack">
            <span className="eyebrow">Resolução passo a passo · ao vivo</span>
            <div className="calc-line">1/p′ = 1/f − 1/p</div>
            <div className="calc-line">
              1/p′ = 1/{num(f, 1)} − 1/{num(p, 1)} = {num(1 / f - 1 / p, 4)}
            </div>
            <div className="calc-line" style={{ borderColor: 'var(--green)' }}>
              p′ = {isFinite(r.pl) ? `${num(r.pl, 2)} cm` : '∞'} &nbsp;→&nbsp; {r.nature === 'real' ? 'REAL, invertida' : 'VIRTUAL, direita'}
            </div>
            <div className="calc-line">
              A = −p′/p = {num(r.A, 2)} ({Math.abs(r.A) > 1 ? 'maior' : Math.abs(r.A) < 1 ? 'menor' : 'igual'})
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-flat stack">
            <Slider label="p — distância do objeto" value={p} min={2} max={50} step={0.5} unit="cm" onChange={setP} />
            <Slider label="f — distância focal (negativo = divergente)" value={f} min={-20} max={20} step={1} unit="cm" onChange={(v) => setF(v === 0 ? 1 : v)} />
          </div>
          <Note tone="amber">
            <b>Erro clássico:</b> parar a conta em 1/p′. Se você chegou em 1/p′ = 0,0667, a resposta ainda não é
            0,0667. Você precisa inverter: p′ = 1 ÷ 0,0667 = 15 cm.
          </Note>
        </div>
      </div>

      <NumberCheck
        question="Uma lente convergente tem f = 20 cm. Um objeto é colocado a 60 cm dela. Onde fica a imagem (p′)?"
        answer={30}
        unit="cm"
        explain="1/p′ = 1/20 − 1/60 = 3/60 − 1/60 = 2/60 → p′ = 60/2 = 30 cm. Positivo: real e invertida, do outro lado."
      />
    </div>
  );
}

/* ==================================================================== */
/* 5. VERGÊNCIA E OS ÓCULOS                                             */
/* ==================================================================== */

export function LicaoVergencia() {
  const [grau, setGrau] = useState(2);
  const [olho, setOlho] = useState<'miope' | 'normal' | 'hipermetrope'>('normal');
  const [oculos, setOculos] = useState(false);

  const fMetros = grau === 0 ? Infinity : 1 / grau;

  const W = 780;
  const H = 360;
  const axisY = 180;
  const eyeX = 520;
  const retina = eyeX + 92;
  /* onde a luz se junta dentro do olho */
  let focoX = retina;
  if (!oculos) focoX = olho === 'miope' ? retina - 44 : olho === 'hipermetrope' ? retina + 46 : retina;

  const alturas = [-52, -26, 26, 52];

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="O 'grau' do óculos é só o inverso da distância focal">
        <p className="body">
          Quando alguém diz "tenho 2 graus", está falando da <T id="vergencia" />. Vergência é uma medida de
          quanto a lente entorta a luz: quanto maior o número, mais forte a lente. E a conta é a coisa mais
          simples do módulo:
        </p>
        <Formula caption="com f obrigatoriamente em METROS. A unidade da vergência é a dioptria (di), o 'grau'.">V = 1 / f</Formula>
        <Note tone="amber">
          Pegadinha garantida: se a questão der f em centímetros, <b>converta para metros antes</b>. f = 50 cm =
          0,5 m → V = 1/0,5 = 2 di. Quem esquece de converter acha 0,02 e erra.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · o olho e a correção" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <Axis y={axisY} x1={20} x2={W - 20} />

          {/* óculos */}
          {oculos && olho !== 'normal' && (
            <g>
              <ellipse cx={330} cy={axisY} rx={olho === 'miope' ? 7 : 13} ry={62} fill="var(--cyan)" opacity={0.16} stroke={COLORS.cyan} strokeWidth={2} />
              <text x={330} y={axisY + 88} fill={COLORS.cyan} fontSize={12.5} textAnchor="middle" fontWeight={700}>
                {olho === 'miope' ? 'lente divergente (grau −)' : 'lente convergente (grau +)'}
              </text>
            </g>
          )}

          {/* olho */}
          <g>
            <circle cx={eyeX + 46} cy={axisY} r={62} fill="var(--surface-2)" stroke={COLORS.line} strokeWidth={2} />
            <ellipse cx={eyeX} cy={axisY} rx={12} ry={40} fill="var(--cyan)" opacity={0.25} stroke={COLORS.cyan} strokeWidth={2} />
            <text x={eyeX} y={axisY - 52} fill={COLORS.cyan} fontSize={12} textAnchor="middle">
              cristalino
            </text>
            <path d={`M ${retina} ${axisY - 46} Q ${retina + 16} ${axisY} ${retina} ${axisY + 46}`} fill="none" stroke={COLORS.rose} strokeWidth={4} />
            <text x={retina + 24} y={axisY + 70} fill={COLORS.rose} fontSize={12.5} fontWeight={700} textAnchor="middle">
              retina
            </text>
          </g>

          {/* raios */}
          {alturas.map((dy) => {
            const bend = oculos && olho !== 'normal' ? 330 : null;
            const startY = axisY + dy;
            const midY = bend ? axisY + dy * (olho === 'miope' ? 1.22 : 0.82) : startY;
            return (
              <g key={dy}>
                <Ray x1={30} y1={startY} x2={bend ?? eyeX} y2={startY} color={COLORS.ray} head="ray" width={2} arrow={false} />
                {bend && <Ray x1={bend} y1={startY} x2={eyeX} y2={midY} color={COLORS.ray} head="ray" width={2} arrow={false} />}
                <Ray x1={eyeX} y1={bend ? midY : startY} x2={focoX} y2={axisY} color={COLORS.ray} head="ray" width={2} />
              </g>
            );
          })}

          <circle cx={focoX} cy={axisY} r={8} fill={focoX === retina ? COLORS.green : COLORS.rose} className="spark" />
          <Badge
            x={focoX}
            y={axisY - 70}
            text={focoX === retina ? 'foco na retina: enxerga nítido ✅' : focoX < retina ? 'foco ANTES da retina: borrado' : 'foco DEPOIS da retina: borrado'}
            color={focoX === retina ? COLORS.green : COLORS.rose}
          />
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={olho}
              onChange={(v) => {
                setOlho(v);
                setOculos(false);
              }}
              options={[
                { value: 'miope', label: 'Miopia' },
                { value: 'normal', label: 'Normal' },
                { value: 'hipermetrope', label: 'Hipermetropia' },
              ]}
            />
            <button className={`btn ${oculos ? '' : 'btn-primary'}`} disabled={olho === 'normal'} onClick={() => setOculos((o) => !o)}>
              {oculos ? '👓 Tirar os óculos' : '👓 Colocar os óculos'}
            </button>
          </div>

          <div className="card card-flat">
            <Slider label="Grau da lente (vergência V)" value={grau} min={-6} max={6} step={0.25} unit="di" onChange={setGrau} />
          </div>

          <Readout>
            <Row k="Vergência (V)" v={`${num(grau, 2)} di`} tone="var(--purple)" />
            <Row k="Distância focal (f)" v={grau === 0 ? '∞' : `${num(fMetros, 3)} m`} />
            <Row k="Em centímetros" v={grau === 0 ? '∞' : `${num(fMetros * 100, 1)} cm`} />
            <Row k="Tipo de lente" v={grau > 0 ? 'convergente' : grau < 0 ? 'divergente' : 'nenhuma'} tone={grau > 0 ? 'var(--green)' : 'var(--rose)'} />
          </Readout>

          <Note tone={olho === 'miope' ? 'rose' : olho === 'hipermetrope' ? 'blue' : 'green'}>
            {olho === 'miope'
              ? 'Miopia: o olho converge demais e forma a imagem ANTES da retina. Correção: uma lente divergente (grau negativo), que abre um pouco os raios antes de entrarem.'
              : olho === 'hipermetrope'
                ? 'Hipermetropia: o olho converge de menos e a imagem se formaria DEPOIS da retina. Correção: lente convergente (grau positivo), que ajuda a fechar os raios.'
                : 'Olho normal: os raios paralelos que vêm de longe se encontram exatamente na retina. Sem correção necessária.'}
          </Note>
        </div>
      </div>

      <div className="grid grid-2">
        <NumberCheck question="Uma lente tem distância focal de 25 cm. Qual é a vergência dela, em dioptrias?" answer={4} unit="di" explain="25 cm = 0,25 m → V = 1/0,25 = 4 di." />
        <NumberCheck question="Um óculos tem grau −2,5 di. Qual é a distância focal, em metros? (use o sinal)" answer={-0.4} tolerance={0.08} explain="f = 1/V = 1/(−2,5) = −0,4 m. Negativo = lente divergente = correção de miopia." />
      </div>
    </div>
  );
}
