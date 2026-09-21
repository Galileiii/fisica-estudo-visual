/**
 * Peças de desenho reutilizadas por todos os simuladores de óptica.
 * Tudo em SVG puro para escalar bem em qualquer tela.
 */

export const COLORS = {
  ray: 'var(--ray)',
  ray2: 'var(--ray-2)',
  ghost: 'var(--ghost)',
  object: 'var(--object)',
  real: 'var(--image-real)',
  virtual: 'var(--image-virtual)',
  axis: 'var(--axis)',
  line: 'var(--line-strong)',
  text: 'var(--text)',
  text2: 'var(--text-2)',
  text3: 'var(--text-3)',
  blue: 'var(--blue)',
  purple: 'var(--purple)',
  cyan: 'var(--cyan)',
  amber: 'var(--amber)',
  green: 'var(--green)',
  rose: 'var(--rose)',
};

/** Pontas de seta. Precisa aparecer uma vez dentro de cada <svg>. */
export function Defs() {
  const heads: [string, string][] = [
    ['ray', COLORS.ray],
    ['ray2', COLORS.ray2],
    ['ghost', COLORS.ghost],
    ['object', COLORS.object],
    ['real', COLORS.real],
    ['virtual', COLORS.virtual],
    ['blue', COLORS.blue],
    ['cyan', COLORS.cyan],
    ['axis', COLORS.axis],
    ['green', COLORS.green],
    ['rose', COLORS.rose],
  ];
  return (
    <defs>
      {heads.map(([id, color]) => (
        <marker
          key={id}
          id={`ah-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      ))}
      <linearGradient id="glowRay" x1="0" x2="1">
        <stop offset="0%" stopColor={COLORS.ray} stopOpacity="0.2" />
        <stop offset="100%" stopColor={COLORS.ray} stopOpacity="1" />
      </linearGradient>
    </defs>
  );
}

/* ============================ Eixo principal ============================ */

export function Axis({ y, x1, x2, label }: { y: number; x1: number; x2: number; label?: string }) {
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={COLORS.axis} strokeWidth={1.5} strokeDasharray="6 5" />
      {label && (
        <text x={x1 + 4} y={y - 8} fill={COLORS.text3} fontSize={12}>
          {label}
        </text>
      )}
    </>
  );
}

/* ============================ Raio de luz ============================ */

export function Ray({
  x1,
  y1,
  x2,
  y2,
  color = COLORS.ray,
  head = 'ray',
  dashed = false,
  width = 2.4,
  animated = false,
  opacity = 1,
  arrow = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  head?: string;
  dashed?: boolean;
  width?: number;
  animated?: boolean;
  opacity?: number;
  arrow?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
      strokeDasharray={dashed ? '8 7' : undefined}
      className={animated && !dashed ? 'dash-anim' : undefined}
      markerEnd={arrow ? `url(#ah-${head})` : undefined}
    />
  );
}

/** Seta no meio do segmento, para indicar o sentido de propagação. */
export function MidArrow({ x1, y1, x2, y2, color = COLORS.ray, head = 'ray' }: { x1: number; y1: number; x2: number; y2: number; color?: string; head?: string }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = ((x2 - x1) / len) * 10;
  const uy = ((y2 - y1) / len) * 10;
  return <line x1={mx - ux} y1={my - uy} x2={mx + ux} y2={my + uy} stroke={color} strokeWidth={2.4} markerEnd={`url(#ah-${head})`} />;
}

/* ============================ Objeto / imagem (seta vertical) ============================ */

export function ArrowObject({
  x,
  baseY,
  height,
  color,
  head,
  label,
  dashed = false,
  draggable = false,
  onPointerDown,
  sub,
}: {
  x: number;
  baseY: number;
  /** positivo = para cima */
  height: number;
  color: string;
  head: string;
  label?: string;
  dashed?: boolean;
  draggable?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  sub?: string;
}) {
  const tipY = baseY - height;
  const up = height >= 0;
  return (
    <g
      className={draggable ? 'draggable' : undefined}
      onPointerDown={onPointerDown}
      style={{ touchAction: 'none' }}
    >
      {draggable && <rect x={x - 26} y={Math.min(baseY, tipY) - 18} width={52} height={Math.abs(height) + 36} fill="transparent" />}
      <line
        x1={x}
        y1={baseY}
        x2={x}
        y2={tipY}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={dashed ? '7 6' : undefined}
        markerEnd={`url(#ah-${head})`}
      />
      <circle cx={x} cy={baseY} r={4} fill={color} />
      {label && (
        <text
          x={x}
          y={up ? tipY - 14 : tipY + 24}
          fill={color}
          fontSize={14}
          fontWeight={750}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
      {sub && (
        <text x={x} y={up ? tipY - 32 : tipY + 40} fill={COLORS.text3} fontSize={11.5} textAnchor="middle">
          {sub}
        </text>
      )}
      {draggable && (
        <g opacity={0.9}>
          <circle cx={x} cy={tipY} r={9} fill="none" stroke={color} strokeWidth={1.6} className="pulse" />
        </g>
      )}
    </g>
  );
}

/* ============================ Marcos no eixo (F, C, V) ============================ */

export function AxisPoint({
  x,
  y,
  label,
  color = COLORS.purple,
  below,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  color?: string;
  below?: boolean;
  sub?: string;
}) {
  return (
    <g>
      <line x1={x} y1={y - 9} x2={x} y2={y + 9} stroke={color} strokeWidth={2} />
      <circle cx={x} cy={y} r={4.5} fill={color} />
      <text
        x={x}
        y={below ? y + 30 : y - 16}
        fill={color}
        fontSize={15}
        fontWeight={800}
        textAnchor="middle"
      >
        {label}
      </text>
      {sub && (
        <text x={x} y={below ? y + 46 : y - 32} fill={COLORS.text3} fontSize={11.5} textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

/* ============================ Régua de distância ============================ */

export function Ruler({
  x1,
  x2,
  y,
  label,
  color = COLORS.text3,
  above = false,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  color?: string;
  above?: boolean;
}) {
  const mid = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.6} markerStart="url(#ah-axis)" markerEnd="url(#ah-axis)" />
      <line x1={x1} y1={y - 6} x2={x1} y2={y + 6} stroke={color} strokeWidth={1.4} />
      <line x1={x2} y1={y - 6} x2={x2} y2={y + 6} stroke={color} strokeWidth={1.4} />
      <rect x={mid - label.length * 4.1 - 6} y={above ? y - 22 : y - 10} width={label.length * 8.2 + 12} height={20} rx={6} fill="var(--stage)" opacity={0.92} />
      <text x={mid} y={above ? y - 8 : y + 4} fill={color} fontSize={13} fontWeight={700} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

/* ============================ Espelho plano ============================ */

export function PlaneMirror({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const ticks = [];
  for (let y = y1 + 6; y < y2; y += 13) {
    ticks.push(<line key={y} x1={x} y1={y} x2={x + 12} y2={y + 10} stroke={COLORS.line} strokeWidth={2} />);
  }
  return (
    <g>
      {ticks}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={COLORS.cyan} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#fff" strokeWidth={1.2} opacity={0.45} />
    </g>
  );
}

/* ============================ Espelho esférico ============================ */

/**
 * Desenha o arco do espelho.
 * concave = true  → superfície espelhada virada para a esquerda (junta a luz)
 * concave = false → superfície espelhada virada para a direita (espalha a luz)
 */
export function SphericalMirror({
  vx,
  axisY,
  Rpx,
  concave,
  halfHeight = 110,
}: {
  vx: number;
  axisY: number;
  Rpx: number;
  concave: boolean;
  halfHeight?: number;
}) {
  const R = Math.max(Rpx, halfHeight * 1.05);
  const cx = concave ? vx - R : vx + R;
  const thetaMax = Math.asin(Math.min(halfHeight / R, 0.98));

  const pts: string[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const th = -thetaMax + (2 * thetaMax * i) / N;
    const x = concave ? cx + R * Math.cos(th) : cx - R * Math.cos(th);
    const y = axisY + R * Math.sin(th);
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = pts.join(' ');

  return (
    <g>
      <path d={d} fill="none" stroke={COLORS.line} strokeWidth={13} strokeLinecap="round" opacity={0.55} />
      <path d={d} fill="none" stroke={COLORS.cyan} strokeWidth={4} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.4} />
    </g>
  );
}

/* ============================ Lente ============================ */

export function Lens({
  x,
  axisY,
  halfHeight = 110,
  converging,
}: {
  x: number;
  axisY: number;
  halfHeight?: number;
  converging: boolean;
}) {
  const top = axisY - halfHeight;
  const bot = axisY + halfHeight;
  const bulge = 26;
  const d = converging
    ? `M ${x} ${top} Q ${x + bulge} ${axisY} ${x} ${bot} Q ${x - bulge} ${axisY} ${x} ${top} Z`
    : `M ${x - 15} ${top} Q ${x + 2} ${axisY} ${x - 15} ${bot} L ${x + 15} ${bot} Q ${x - 2} ${axisY} ${x + 15} ${top} Z`;

  const arrow = 15;
  return (
    <g>
      <path d={d} fill="var(--cyan)" opacity={0.14} stroke={COLORS.cyan} strokeWidth={2.4} />
      {/* símbolo esquemático: linha com setas */}
      <line x1={x} y1={top - 16} x2={x} y2={bot + 16} stroke={COLORS.cyan} strokeWidth={2} opacity={0.75} />
      {converging ? (
        <>
          <path d={`M ${x - arrow} ${top - 4} L ${x} ${top - 18} L ${x + arrow} ${top - 4}`} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
          <path d={`M ${x - arrow} ${bot + 4} L ${x} ${bot + 18} L ${x + arrow} ${bot + 4}`} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d={`M ${x - arrow} ${top - 18} L ${x} ${top - 4} L ${x + arrow} ${top - 18}`} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
          <path d={`M ${x - arrow} ${bot + 18} L ${x} ${bot + 4} L ${x + arrow} ${bot + 18}`} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

/* ============================ Etiqueta flutuante ============================ */

export function Badge({
  x,
  y,
  text,
  color = COLORS.text2,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const w = text.length * 7.6 + 18;
  const bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g>
      <rect x={bx} y={y - 15} width={w} height={23} rx={8} fill="var(--surface-solid)" stroke="var(--line)" opacity={0.96} />
      <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 9 : x + 9} y={y + 1} fill={color} fontSize={13} fontWeight={700} textAnchor={anchor}>
        {text}
      </text>
    </g>
  );
}

/** Lâmpada / fonte de luz */
export function LightSource({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={16} fill={COLORS.ray} opacity={0.18} className="pulse" />
      <circle cx={x} cy={y} r={9} fill={COLORS.ray} />
      <circle cx={x - 3} cy={y - 3} r={3} fill="#fff" opacity={0.7} />
      {label && (
        <text x={x} y={y + 32} fill={COLORS.text3} fontSize={12.5} textAnchor="middle" fontWeight={650}>
          {label}
        </text>
      )}
    </g>
  );
}
