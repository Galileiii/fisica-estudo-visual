import { useState } from 'react';
import { Badge, COLORS, Defs, Ray, Ruler } from '../components/svg';
import { Formula, Note, Readout, Reveal, Row, Section, Seg, Slider, Stage, T, Tag } from '../components/ui';
import { NumberCheck, QuickCheck } from '../components/Check';
import { useClock } from '../lib/hooks';
import { num } from '../lib/optics';

/* ---------- desenho de uma senoide ---------- */
function wavePath(opts: {
  x0: number;
  x1: number;
  axisY: number;
  amp: number;
  lambdaPx: number;
  phase: number;
  step?: number;
}) {
  const { x0, x1, axisY, amp, lambdaPx, phase, step = 4 } = opts;
  let d = '';
  for (let x = x0; x <= x1; x += step) {
    const y = axisY - amp * Math.sin((2 * Math.PI * (x - x0)) / lambdaPx - phase);
    d += `${x === x0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

const waveY = (x: number, x0: number, axisY: number, amp: number, lambdaPx: number, phase: number) =>
  axisY - amp * Math.sin((2 * Math.PI * (x - x0)) / lambdaPx - phase);

/* ==================================================================== */
/* 1. O QUE É UMA ONDA                                                  */
/* ==================================================================== */

export function LicaoOQueEOnda() {
  const [tipo, setTipo] = useState<'transversal' | 'longitudinal'>('transversal');
  const t = useClock(true, 1);

  const W = 800;
  const H = 320;
  const axisY = 170;
  const amp = 52;
  const lambdaPx = 190;
  const phase = t * 2.2;

  const markX = 520;
  const markY = waveY(markX, 60, axisY, amp, lambdaPx, phase);

  /* longitudinal: linhas que se aproximam e se afastam */
  const bars = Array.from({ length: 46 }, (_, i) => {
    const base = 70 + i * 15;
    const desloc = 11 * Math.sin((2 * Math.PI * base) / lambdaPx - phase);
    return { x: base + desloc, i };
  });
  const markIndex = 30;

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A onda viaja. O material, não.">
        <p className="body">
          Uma <T id="onda" /> é uma perturbação que se propaga carregando <b>energia</b>. A parte que confunde
          é essa: a onda anda de um lado para o outro, mas o material que ela atravessa fica praticamente no
          lugar, só balançando. Olhe o ponto vermelho no simulador: a onda passa por ele o tempo todo, mas ele
          nunca sai do lugar — ele só sobe e desce.
        </p>
        <Note tone="purple">
          É a mesma coisa da "ola" no estádio: a onda dá a volta no estádio inteiro, mas ninguém trocou de
          cadeira. Cada pessoa só levantou e sentou na hora certa.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label={`Animação · onda ${tipo}`} viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <line x1={40} y1={axisY} x2={W - 30} y2={axisY} stroke={COLORS.axis} strokeWidth={1.2} strokeDasharray="5 6" />

          {tipo === 'transversal' ? (
            <>
              <path d={wavePath({ x0: 60, x1: W - 40, axisY, amp, lambdaPx, phase })} fill="none" stroke={COLORS.cyan} strokeWidth={3.4} strokeLinecap="round" />
              {/* a mão que sacode */}
              <circle cx={60} cy={waveY(60, 60, axisY, amp, lambdaPx, phase)} r={9} fill={COLORS.blue} />
              <text x={60} y={H - 20} fill={COLORS.text3} fontSize={12.5} textAnchor="middle">
                mão sacudindo
              </text>
              {/* ponto material */}
              <line x1={markX} y1={axisY - amp - 14} x2={markX} y2={axisY + amp + 14} stroke={COLORS.rose} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.6} />
              <circle cx={markX} cy={markY} r={9} fill={COLORS.rose} />
              <Badge x={markX + 96} y={axisY - amp - 24} text="este ponto só sobe e desce" color={COLORS.rose} />
              <Ray x1={W - 180} y1={axisY + 96} x2={W - 70} y2={axisY + 96} color={COLORS.amber} head="ray" width={2.4} />
              <text x={W - 190} y={axisY + 100} fill={COLORS.amber} fontSize={12.5} textAnchor="end" fontWeight={700}>
                a onda anda para cá
              </text>
            </>
          ) : (
            <>
              {bars.map((b) => (
                <line
                  key={b.i}
                  x1={b.x}
                  y1={axisY - 52}
                  x2={b.x}
                  y2={axisY + 52}
                  stroke={b.i === markIndex ? COLORS.rose : COLORS.cyan}
                  strokeWidth={b.i === markIndex ? 4 : 2}
                  opacity={b.i === markIndex ? 1 : 0.75}
                />
              ))}
              <Badge x={260} y={axisY - 78} text="apertado (compressão)" color={COLORS.text2} />
              <Badge x={560} y={axisY + 100} text="espaçado (rarefação)" color={COLORS.text2} />
              <Badge x={bars[markIndex].x} y={axisY + 78} text="este ponto vai e volta na horizontal" color={COLORS.rose} />
              <Ray x1={W - 180} y1={axisY + 118} x2={W - 70} y2={axisY + 118} color={COLORS.amber} head="ray" width={2.4} />
            </>
          )}
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Seg
              value={tipo}
              onChange={setTipo}
              options={[
                { value: 'transversal', label: 'Transversal' },
                { value: 'longitudinal', label: 'Longitudinal' },
              ]}
            />
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <b>
              <T id="transversal" />
            </b>
            <span className="body" style={{ fontSize: 14.5 }}>
              O material balança <b>perpendicular</b> (de lado) à direção em que a onda anda. Exemplos: corda,
              ondas do mar, luz.
            </span>
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <b>
              <T id="longitudinal" />
            </b>
            <span className="body" style={{ fontSize: 14.5 }}>
              O material balança <b>na mesma direção</b> em que a onda anda, formando regiões apertadas e
              espaçadas. Exemplo: o som no ar, a mola sanfonada.
            </span>
          </div>
          <Note tone="amber">
            Outra classificação que a prova adora: <b>mecânicas</b> (precisam de um material para existir — som,
            corda, mar) e <b>eletromagnéticas</b> (andam no vácuo — luz, rádio, raio-X). Por isso não existe som
            no espaço, mas existe luz.
          </Note>
        </div>
      </div>

      <QuickCheck
        question="Uma rolha boia no mar e uma onda passa por ela. O que a rolha faz?"
        options={[
          { text: 'Sobe e desce praticamente no mesmo lugar.', ok: true, why: 'A onda transporta energia, não a água (nem a rolha).' },
          { text: 'Viaja junto com a onda até a praia.', why: 'Se isso acontecesse, a água toda iria embora do mar a cada onda.' },
          { text: 'Afunda.' },
          { text: 'Fica parada, sem se mexer.' },
        ]}
        explain="Onda transporta ENERGIA, não matéria. Esse é o conceito mais cobrado em questão teórica de ondas."
      />
    </div>
  );
}

/* ==================================================================== */
/* 2. ANATOMIA DA ONDA                                                  */
/* ==================================================================== */

export function LicaoAnatomia() {
  const [amp, setAmp] = useState(45);
  const [lambdaM, setLambdaM] = useState(4); // metros
  const t = useClock(true, 1);

  const W = 820;
  const H = 360;
  const axisY = 175;
  const PX_POR_M = 45;
  const lambdaPx = lambdaM * PX_POR_M;
  const phase = t * 2;
  const x0 = 60;

  /* posição da primeira crista e da seguinte (para a régua de λ) */
  const cristaX = (k: number) => x0 + ((phase / (2 * Math.PI)) % 1) * lambdaPx + lambdaPx * (0.25 + k);

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="As duas medidas de uma onda">
        <p className="body">
          Toda questão de onda começa identificando duas medidas no desenho. Uma é vertical, a outra é
          horizontal — e trocar as duas é o erro mais comum.
        </p>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · anatomia" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <line x1={30} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.axis} strokeWidth={1.3} strokeDasharray="5 6" />
          <text x={34} y={axisY - 8} fill={COLORS.text3} fontSize={12}>
            linha de repouso
          </text>

          <path d={wavePath({ x0, x1: W - 30, axisY, amp, lambdaPx, phase })} fill="none" stroke={COLORS.cyan} strokeWidth={3.4} strokeLinecap="round" />

          {/* amplitude */}
          <g>
            <line x1={cristaX(0)} y1={axisY} x2={cristaX(0)} y2={axisY - amp} stroke={COLORS.amber} strokeWidth={2.4} markerEnd="url(#ah-ray)" />
            <Badge x={cristaX(0) + 66} y={axisY - amp / 2} text={`A = ${num(amp / 45, 1)} m`} color={COLORS.amber} />
            <circle cx={cristaX(0)} cy={axisY - amp} r={6} fill={COLORS.amber} />
            <text x={cristaX(0)} y={axisY - amp - 18} fill={COLORS.amber} fontSize={12.5} textAnchor="middle" fontWeight={700}>
              crista
            </text>
          </g>

          {/* vale */}
          <g>
            <circle cx={cristaX(0) + lambdaPx / 2} cy={axisY + amp} r={6} fill={COLORS.rose} />
            <text x={cristaX(0) + lambdaPx / 2} y={axisY + amp + 24} fill={COLORS.rose} fontSize={12.5} textAnchor="middle" fontWeight={700}>
              vale
            </text>
          </g>

          {/* comprimento de onda */}
          <Ruler x1={cristaX(0)} x2={cristaX(1)} y={axisY - amp - 44} label={`λ = ${num(lambdaM, 1)} m`} color={COLORS.purple} />
          <text x={(cristaX(0) + cristaX(1)) / 2} y={axisY - amp - 60} fill={COLORS.text3} fontSize={11.5} textAnchor="middle">
            de uma crista até a próxima
          </text>
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Slider label="Amplitude (A)" value={Number((amp / 45).toFixed(1))} min={0.4} max={2} step={0.1} unit="m" onChange={(v) => setAmp(v * 45)} />
            <Slider label="Comprimento de onda (λ)" value={lambdaM} min={1.5} max={8} step={0.5} unit="m" onChange={setLambdaM} />
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <b style={{ color: 'var(--amber)' }}>
              <T id="amplitude" />
            </b>
            <span className="body" style={{ fontSize: 14.5 }}>
              Medida <b>vertical</b>: do repouso até a crista (não é de crista a vale — isso seria 2A!). Diz
              quanta energia a onda carrega. Em som é o volume; em luz é o brilho.
            </span>
          </div>
          <div className="card card-flat stack" style={{ gap: 8 }}>
            <b style={{ color: 'var(--purple)' }}>
              <T id="comprimentoOnda" />
            </b>
            <span className="body" style={{ fontSize: 14.5 }}>
              Medida <b>horizontal</b>: o tamanho de uma onda completa, de crista a crista (ou de vale a vale).
              Mede-se em metros.
            </span>
          </div>
          <Note tone="rose">
            Mudar a amplitude <b>não</b> muda a velocidade nem a frequência da onda. São coisas independentes —
            arraste os dois sliders e confira.
          </Note>
        </div>
      </div>

      <QuickCheck
        question="Num gráfico, a distância vertical medida de uma crista até um vale é 8 cm. Qual é a amplitude?"
        options={[
          { text: '8 cm', why: 'Essa é a distância total do topo ao fundo, que vale 2 amplitudes.' },
          { text: '4 cm', ok: true, why: 'A amplitude conta só metade: do repouso até a crista.' },
          { text: '16 cm' },
          { text: 'Falta o comprimento de onda para saber.' },
        ]}
        explain="Crista até vale = 2A. Repouso até crista = A. Vale sempre conferir de onde a régua está saindo."
      />
    </div>
  );
}

/* ==================================================================== */
/* 3. FREQUÊNCIA E PERÍODO                                              */
/* ==================================================================== */

export function LicaoFrequencia() {
  const [f, setF] = useState(2);
  const t = useClock(true, 1);
  const periodo = 1 / f;

  const W = 820;
  const H = 320;
  const axisY = 150;
  const amp = 46;
  const lambdaPx = 170;
  const phase = t * 2 * Math.PI * f * 0.45; // velocidade visual proporcional a f
  const passaram = Math.floor((phase / (2 * Math.PI)) % 1000);

  const detectorX = 620;
  const detY = waveY(detectorX, 50, axisY, amp, lambdaPx, phase);

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="Frequência é contagem. Período é cronômetro.">
        <p className="body">
          <T id="frequencia" /> responde "quantas ondas passam por segundo?". <T id="periodo" /> responde
          "quanto tempo leva uma onda?". São o mesmo fato contado de dois jeitos — e por isso um é o inverso do
          outro.
        </p>
        <Formula caption="se passam 4 ondas por segundo, cada uma leva 1/4 = 0,25 s">T = 1 / f&nbsp;&nbsp;&nbsp;e&nbsp;&nbsp;&nbsp;f = 1 / T</Formula>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · contando ondas" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <line x1={30} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.axis} strokeWidth={1.2} strokeDasharray="5 6" />
          <path d={wavePath({ x0: 50, x1: W - 30, axisY, amp, lambdaPx, phase })} fill="none" stroke={COLORS.cyan} strokeWidth={3.2} strokeLinecap="round" />

          <line x1={detectorX} y1={axisY - 90} x2={detectorX} y2={axisY + 90} stroke={COLORS.rose} strokeWidth={2} strokeDasharray="6 5" />
          <circle cx={detectorX} cy={detY} r={8} fill={COLORS.rose} />
          <text x={detectorX} y={axisY + 112} fill={COLORS.rose} fontSize={12.5} textAnchor="middle" fontWeight={700}>
            detector
          </text>

          <Badge x={190} y={48} text={`ondas que já passaram: ${passaram}`} color={COLORS.cyan} />
          <Badge x={190} y={80} text={`f = ${num(f, 1)} Hz  ·  T = ${num(periodo, 2)} s`} color={COLORS.purple} />
        </Stage>

        <div className="stack">
          <div className="card card-flat">
            <Slider label="Frequência (f)" value={f} min={0.5} max={8} step={0.5} unit="Hz" onChange={setF} hint="Aumente e veja as ondas passarem mais rápido pelo detector." />
          </div>
          <Readout>
            <Row k="Frequência (f)" v={`${num(f, 1)} Hz`} tone="var(--cyan)" />
            <Row k="Significa" v={`${num(f, 1)} ondas por segundo`} />
            <Row k="Período (T = 1/f)" v={`${num(periodo, 3)} s`} tone="var(--purple)" />
            <Row k="Significa" v={`cada onda leva ${num(periodo, 3)} s`} />
          </Readout>
          <Note tone="amber">
            A frequência é teimosa: ela é definida pela <b>fonte</b> que criou a onda. Quando a onda muda de
            meio (do ar para a água, por exemplo), a velocidade muda, o λ muda — mas a <b>frequência nunca
            muda</b>. Guarde isso, cai direto.
          </Note>
        </div>
      </div>

      <div className="grid grid-2">
        <NumberCheck question="Uma onda tem período T = 0,2 s. Qual é a frequência, em Hz?" answer={5} unit="Hz" explain="f = 1/T = 1/0,2 = 5 Hz. Ou seja: 5 ondas por segundo." />
        <NumberCheck question="Um alto-falante vibra 340 vezes em 2 segundos. Qual é a frequência?" answer={170} unit="Hz" explain="f = 340 vibrações ÷ 2 s = 170 Hz. Frequência é sempre 'quantas vezes' dividido por 'em quanto tempo'." />
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 4. VELOCIDADE DA ONDA                                                */
/* ==================================================================== */

export function LicaoVelocidade() {
  const [lambda, setLambda] = useState(4);
  const [f, setF] = useState(3);
  const v = lambda * f;
  const t = useClock(true, 1);

  const W = 820;
  const H = 300;
  const axisY = 145;
  const PX = 40;
  const lambdaPx = lambda * PX;
  const phase = t * 2 * Math.PI * f * 0.35;

  const cristaX = 60 + (((phase / (2 * Math.PI)) * lambdaPx + lambdaPx * 0.25) % (W - 120));

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="A fórmula mais usada de ondas">
        <p className="body">
          Se cada onda mede λ metros e passam f ondas a cada segundo, então em um segundo a perturbação avança
          λ × f metros. É só isso — a fórmula é quase uma frase:
        </p>
        <Formula caption="velocidade = tamanho de cada onda × quantas passam por segundo">v = λ · f</Formula>
        <Note tone="blue">
          Como T = 1/f, essa fórmula também aparece escrita como <b>v = λ / T</b>. É a mesma coisa. Se a questão
          te der o período em vez da frequência, use essa versão e economize um passo.
        </Note>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · v = λ · f" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <line x1={30} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.axis} strokeWidth={1.2} strokeDasharray="5 6" />
          <path d={wavePath({ x0: 60, x1: W - 30, axisY, amp: 42, lambdaPx, phase })} fill="none" stroke={COLORS.cyan} strokeWidth={3.2} strokeLinecap="round" />
          <circle cx={cristaX} cy={axisY - 42} r={7} fill={COLORS.amber} />
          <Ruler x1={60} x2={60 + lambdaPx} y={axisY + 76} label={`λ = ${num(lambda, 1)} m`} color={COLORS.purple} />
          <Badge x={W - 170} y={44} text={`f = ${num(f, 1)} Hz`} color={COLORS.cyan} />
          <Badge x={W - 170} y={76} text={`v = ${num(v, 1)} m/s`} color={COLORS.green} />
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Slider label="Comprimento de onda (λ)" value={lambda} min={1} max={9} step={0.5} unit="m" onChange={setLambda} />
            <Slider label="Frequência (f)" value={f} min={0.5} max={8} step={0.5} unit="Hz" onChange={setF} />
          </div>
          <div className="card stack">
            <span className="eyebrow">Conta ao vivo</span>
            <div className="calc-line">v = λ · f</div>
            <div className="calc-line">
              v = {num(lambda, 1)} · {num(f, 1)}
            </div>
            <div className="calc-line" style={{ borderColor: 'var(--green)' }}>
              v = <b style={{ color: 'var(--green)' }}>{num(v, 2)} m/s</b>
            </div>
          </div>
          <Note tone="amber">
            Cuidado com as unidades: λ precisa estar em <b>metros</b> e f em <b>hertz</b> para v sair em m/s. Se
            a questão der λ em centímetros, divida por 100 antes.
          </Note>
        </div>
      </div>

      <div className="grid grid-2">
        <NumberCheck question="Uma onda tem λ = 2 m e f = 50 Hz. Qual a velocidade dela, em m/s?" answer={100} unit="m/s" explain="v = λ·f = 2 · 50 = 100 m/s." />
        <NumberCheck
          question="O som anda a 340 m/s no ar. Se a frequência é 170 Hz, qual é o comprimento de onda?"
          answer={2}
          unit="m"
          explain="Isole o que a questão pede: λ = v/f = 340/170 = 2 m."
        />
      </div>

      <QuickCheck
        question="Qual é o primeiro passo quando a questão dá λ = 50 cm e f = 4 Hz e pede v em m/s?"
        options={[
          { text: 'Multiplicar direto: 50 × 4 = 200.', why: 'Isso dá 200 cm/s, não m/s. A unidade sai errada.' },
          { text: 'Converter 50 cm para 0,5 m e só depois multiplicar.', ok: true, why: 'v = 0,5 · 4 = 2 m/s. Converter primeiro evita 90% dos erros de ondas.' },
          { text: 'Dividir 50 por 4.' },
          { text: 'Calcular o período primeiro.', why: 'Não é errado, mas é um passo a mais que a questão não pediu.' },
        ]}
        explain="Antes de calcular, alinhe as unidades. Depois calcule."
      />
    </div>
  );
}

/* ==================================================================== */
/* 5. ONDA MUDANDO DE MEIO                                              */
/* ==================================================================== */

export function LicaoMudancaDeMeio() {
  const [razao, setRazao] = useState(0.5); // v2 / v1
  const t = useClock(true, 1);

  const W = 840;
  const H = 320;
  const axisY = 155;
  const xb = 420;
  const lambda1 = 150;
  const lambda2 = lambda1 * razao;
  const f = 0.45;
  const phase = t * 2 * Math.PI * f;

  /* fase contínua na fronteira: a onda não "quebra" */
  let d = '';
  for (let x = 40; x <= W - 30; x += 3) {
    const ph = x <= xb ? (2 * Math.PI * (x - 40)) / lambda1 : (2 * Math.PI * (xb - 40)) / lambda1 + (2 * Math.PI * (x - xb)) / lambda2;
    const y = axisY - 40 * Math.sin(ph - phase);
    d += `${x === 40 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="Trocou de meio: o que muda e o que não muda">
        <p className="body">
          Quando uma onda passa de um material para outro (corda fina → corda grossa, ar → água), a velocidade
          dela muda. Mas quem manda na frequência é a fonte lá do começo — e a fonte continua vibrando no mesmo
          ritmo. Resultado:
        </p>
        <div className="grid grid-3">
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <Tag tone="rose">NÃO MUDA</Tag>
            <b>frequência (f)</b>
            <span className="body" style={{ fontSize: 14 }}>A fonte não parou de vibrar. Continua a mesma.</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <Tag tone="green">MUDA</Tag>
            <b>velocidade (v)</b>
            <span className="body" style={{ fontSize: 14 }}>Depende do material. Outro meio, outra velocidade.</span>
          </div>
          <div className="card card-flat stack" style={{ gap: 6 }}>
            <Tag tone="green">MUDA</Tag>
            <b>comprimento (λ)</b>
            <span className="body" style={{ fontSize: 14 }}>Consequência: se v muda e f fica igual, λ é obrigado a mudar.</span>
          </div>
        </div>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · atravessando a fronteira" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <rect x={0} y={0} width={xb} height={H} fill="var(--blue)" opacity={0.07} />
          <rect x={xb} y={0} width={W - xb} height={H} fill="var(--purple)" opacity={0.1} />
          <line x1={xb} y1={20} x2={xb} y2={H - 20} stroke={COLORS.ghost} strokeWidth={2} strokeDasharray="7 6" />
          <line x1={30} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.axis} strokeWidth={1.2} strokeDasharray="5 6" />

          <path d={d} fill="none" stroke={COLORS.cyan} strokeWidth={3.2} strokeLinecap="round" />

          <text x={40} y={40} fill={COLORS.blue} fontSize={13.5} fontWeight={750}>
            MEIO 1
          </text>
          <text x={xb + 16} y={40} fill={COLORS.purple} fontSize={13.5} fontWeight={750}>
            MEIO 2
          </text>
          <Ruler x1={120} x2={120 + lambda1} y={axisY + 82} label="λ₁" color={COLORS.blue} />
          <Ruler x1={xb + 30} x2={xb + 30 + lambda2} y={axisY + 82} label="λ₂" color={COLORS.purple} />
          <Badge x={W / 2} y={H - 18} text="a mesma frequência dos dois lados" color={COLORS.rose} />
        </Stage>

        <div className="stack">
          <div className="card card-flat">
            <Slider
              label="Velocidade no meio 2 (em relação ao meio 1)"
              value={razao}
              min={0.3}
              max={2}
              step={0.1}
              unit="×"
              onChange={setRazao}
              hint="Menor que 1 = a onda ficou mais lenta."
            />
          </div>
          <Readout>
            <Row k="v₂ / v₁" v={`${num(razao, 1)} ×`} />
            <Row k="λ₂ / λ₁" v={`${num(razao, 1)} ×`} tone="var(--purple)" />
            <Row k="f₂ / f₁" v="1 × (igual!)" tone="var(--rose)" />
          </Readout>
          <Note tone="purple">
            Repare no desenho: a onda não se parte na fronteira, ela só "estica" ou "encolhe". E os dois lados
            oscilam no mesmo ritmo — é por isso que a frequência é a mesma.
          </Note>
        </div>
      </div>

      <Reveal question="E o que isso tem a ver com a luz entortando nas lentes?">
        <p className="body">
          Tudo. A luz é uma onda. Quando ela entra na água, fica mais lenta, e o comprimento de onda encolhe na
          mesma proporção — mas a cor (que é a frequência) não muda: um laser vermelho continua vermelho dentro
          da água. E é justamente esse "freio" de um lado da frente de onda antes do outro que faz o raio virar,
          que é a refração que você viu no módulo de Lentes.
        </p>
      </Reveal>

      <QuickCheck
        question="Uma onda sonora passa do ar para a água, onde anda 4 vezes mais rápido. O que acontece com a frequência e o comprimento de onda?"
        options={[
          { text: 'f fica igual e λ fica 4 vezes maior.', ok: true, why: 'v = λf: se v quadruplicou e f não muda, λ tem de quadruplicar.' },
          { text: 'f fica 4 vezes maior e λ fica igual.', why: 'A frequência é definida pela fonte e não muda ao trocar de meio.' },
          { text: 'Os dois ficam 4 vezes maiores.' },
          { text: 'Os dois ficam iguais.', why: 'Se os dois ficassem iguais, a velocidade não poderia ter mudado.' },
        ]}
        explain="A frequência é a identidade da onda: ela atravessa qualquer meio sem mudar. Quem se ajusta é o λ."
      />
    </div>
  );
}

/* ==================================================================== */
/* 6. INTERFERÊNCIA                                                     */
/* ==================================================================== */

export function LicaoInterferencia() {
  const [defasagem, setDefasagem] = useState(0); // 0 = em fase, 180 = em oposição
  const t = useClock(true, 1);

  const W = 820;
  const H = 400;
  const lambdaPx = 190;
  const amp = 32;
  const phase = t * 2;
  const dphi = (defasagem * Math.PI) / 180;

  const y1 = 80;
  const y2 = 190;
  const y3 = 320;

  const p1 = wavePath({ x0: 50, x1: W - 30, axisY: y1, amp, lambdaPx, phase });
  const p2 = wavePath({ x0: 50, x1: W - 30, axisY: y2, amp, lambdaPx, phase: phase + dphi });

  let p3 = '';
  for (let x = 50; x <= W - 30; x += 3) {
    const a = amp * Math.sin((2 * Math.PI * (x - 50)) / lambdaPx - phase);
    const b = amp * Math.sin((2 * Math.PI * (x - 50)) / lambdaPx - phase - dphi);
    p3 += `${x === 50 ? 'M' : 'L'} ${x.toFixed(1)} ${(y3 - (a + b)).toFixed(1)} `;
  }

  const ampResultante = Math.abs(2 * amp * Math.cos(dphi / 2)) / amp;

  return (
    <div className="stack-lg">
      <Section n="Ideia" title="Duas ondas no mesmo lugar: as alturas se somam">
        <p className="body">
          Quando duas ondas se encontram, não acontece colisão. Elas simplesmente se <b>somam ponto a ponto</b>:
          onde uma está +3 e a outra +3, o resultado é +6. Onde uma está +3 e a outra −3, o resultado é 0. Isso
          é a <T id="interferencia" />. Depois do encontro, cada uma segue seu caminho como se nada tivesse
          acontecido.
        </p>
      </Section>

      <div className="sim-layout">
        <Stage label="Simulador · soma de duas ondas" viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          {[y1, y2, y3].map((y) => (
            <line key={y} x1={30} y1={y} x2={W - 20} y2={y} stroke={COLORS.axis} strokeWidth={1} strokeDasharray="4 6" />
          ))}
          <path d={p1} fill="none" stroke={COLORS.cyan} strokeWidth={2.8} />
          <path d={p2} fill="none" stroke={COLORS.amber} strokeWidth={2.8} />
          <path d={p3} fill="none" stroke={ampResultante > 1 ? COLORS.green : COLORS.rose} strokeWidth={3.6} />

          <text x={34} y={y1 - 42} fill={COLORS.cyan} fontSize={13} fontWeight={700}>
            onda 1
          </text>
          <text x={34} y={y2 - 42} fill={COLORS.amber} fontSize={13} fontWeight={700}>
            onda 2
          </text>
          <text x={34} y={y3 - 78} fill={ampResultante > 1 ? COLORS.green : COLORS.rose} fontSize={13} fontWeight={700}>
            resultado (onda 1 + onda 2)
          </text>
          <Badge
            x={W - 180}
            y={y3 - 78}
            text={ampResultante > 1.5 ? 'interferência CONSTRUTIVA' : ampResultante < 0.5 ? 'interferência DESTRUTIVA' : 'parcial'}
            color={ampResultante > 1 ? COLORS.green : COLORS.rose}
          />
        </Stage>

        <div className="stack">
          <div className="card card-flat stack">
            <Slider label="Defasagem entre as ondas" value={defasagem} min={0} max={360} step={10} unit="°" onChange={setDefasagem} hint="0° = crista com crista. 180° = crista com vale." />
            <div className="row" style={{ gap: 7 }}>
              <button className={`chip ${defasagem === 0 ? 'on' : ''}`} onClick={() => setDefasagem(0)}>
                Em fase (0°)
              </button>
              <button className={`chip ${defasagem === 180 ? 'on' : ''}`} onClick={() => setDefasagem(180)}>
                Oposição (180°)
              </button>
            </div>
          </div>
          <Readout>
            <Row k="Defasagem" v={`${defasagem}°`} />
            <Row k="Amplitude resultante" v={`${num(ampResultante, 2)} × a original`} tone={ampResultante > 1 ? 'var(--green)' : 'var(--rose)'} />
            <Row k="Tipo" v={ampResultante > 1.5 ? 'construtiva' : ampResultante < 0.5 ? 'destrutiva' : 'parcial'} />
          </Readout>
          <Note tone="green">
            <b>Construtiva:</b> crista encontra crista → a onda fica mais alta (som mais forte, luz mais
            brilhante).
          </Note>
          <Note tone="rose">
            <b>Destrutiva:</b> crista encontra vale → as duas se cancelam. É exatamente assim que funciona o
            fone de ouvido com cancelamento de ruído: ele cria a onda oposta ao barulho.
          </Note>
        </div>
      </div>

      <QuickCheck
        question="Duas ondas iguais, de amplitude 5 cm cada, chegam ao mesmo ponto em oposição de fase (crista com vale). Qual é a amplitude resultante?"
        options={[
          { text: '10 cm', why: 'Isso seria se elas chegassem em fase (crista com crista).' },
          { text: '5 cm' },
          { text: '0 cm', ok: true, why: 'Uma sobe exatamente o quanto a outra desce: +5 e −5 somam zero. O ponto fica parado.' },
          { text: '2,5 cm' },
        ]}
        explain="Interferência é soma com sinal. Em oposição de fase e amplitudes iguais, o resultado é cancelamento total."
      />
    </div>
  );
}
