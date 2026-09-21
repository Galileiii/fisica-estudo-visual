import { useCallback, useRef } from 'react';
import { ArrowObject, Axis, AxisPoint, Badge, COLORS, Defs, Ray, Ruler, SphericalMirror } from '../components/svg';
import { Stage } from '../components/ui';
import { useSvgDrag, clamp } from '../lib/hooks';
import { num, solveImage } from '../lib/optics';

export const SCENE_W = 880;
export const SCENE_H = 430;
const AXIS_Y = 240;
const VERTEX_X = 640;
const OBJ_PX = 72; // altura do objeto em pixels

interface Props {
  /** distância objeto–espelho, em cm (sempre positivo) */
  p: number;
  /** distância focal em cm: positiva = côncavo, negativa = convexo */
  f: number;
  /** maior p que o usuário consegue escolher — trava a escala do desenho */
  pMax: number;
  onDragP?: (p: number) => void;
  showRays?: boolean;
  showC?: boolean;
  showRuler?: boolean;
  /** faixas coloridas mostrando as regiões (além de C, entre C e F, ...) */
  showRegions?: boolean;
  label?: string;
}

export function MirrorScene({
  p,
  f,
  pMax,
  onDragP,
  showRays = true,
  showC = true,
  showRuler = true,
  showRegions = false,
  label,
}: Props) {
  const concave = f > 0;
  const af = Math.abs(f);
  const s = clamp((VERTEX_X - 70) / Math.max(pMax, af * 2.4), 0.8, 26); // px por cm

  const svgRef = useRef<SVGSVGElement>(null);
  const onMove = useCallback(
    (x: number) => {
      if (!onDragP) return;
      const cm = (VERTEX_X - x) / s;
      onDragP(clamp(Math.round(cm * 2) / 2, 1, pMax));
    },
    [onDragP, s, pMax],
  );
  const { startDrag } = useSvgDrag(svgRef, SCENE_W, onMove);

  const r = solveImage(p, f, OBJ_PX);
  const objX = VERTEX_X - p * s;
  const Fx = VERTEX_X - f * s; // f<0 cai atrás do espelho, automaticamente
  const Cx = VERTEX_X - 2 * f * s;
  const Rpx = Math.abs(2 * f) * s;

  const objTopY = AXIS_Y - OBJ_PX;
  const far = !isFinite(r.pl) || Math.abs(r.pl * s) > 5000;
  const imgX = far ? 0 : VERTEX_X - r.pl * s;
  const imgTopY = far ? 0 : AXIS_Y - r.hl;
  const imgVisible = !far && imgX > 20 && imgX < SCENE_W - 20;

  /* --------- geometria dos dois raios notáveis --------- */
  const M1 = { x: VERTEX_X, y: objTopY }; // raio paralelo bate aqui
  const V = { x: VERTEX_X, y: AXIS_Y };

  const norm = (x: number, y: number) => {
    const L = Math.hypot(x, y) || 1;
    return { x: x / L, y: y / L };
  };
  const uA = concave ? norm(Fx - M1.x, AXIS_Y - M1.y) : norm(M1.x - Fx, M1.y - AXIS_Y);
  const uB = norm(objX - VERTEX_X, AXIS_Y - objTopY);

  /** desenha um raio refletido: parte sólida + prolongamento tracejado quando virtual */
  function Reflected({ from, u, color }: { from: { x: number; y: number }; u: { x: number; y: number }; color: string }) {
    const LEN = 900;
    const solidEnd = { x: from.x + u.x * LEN, y: from.y + u.y * LEN };
    const head = color === COLORS.ray ? 'ray' : 'ray2';
    return (
      <>
        <Ray x1={from.x} y1={from.y} x2={solidEnd.x} y2={solidEnd.y} color={color} head={head} width={2.4} />
        {!far && r.nature === 'virtual' && (
          <Ray x1={from.x} y1={from.y} x2={imgX} y2={imgTopY} color={COLORS.ghost} head="ghost" width={1.9} dashed arrow={false} />
        )}
      </>
    );
  }

  const regions: { from: number; to: number; text: string; color: string }[] = concave
    ? [
        { from: 0, to: f, text: 'entre F e o espelho', color: 'var(--rose)' },
        { from: f, to: 2 * f, text: 'entre F e C', color: 'var(--amber)' },
        { from: 2 * f, to: pMax, text: 'além de C', color: 'var(--blue)' },
      ]
    : [];

  return (
    <Stage label={label} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} svgRef={svgRef}>
      <Defs />

      {/* área atrás do espelho */}
      <path
        d={
          concave
            ? `M ${VERTEX_X} 0 L ${SCENE_W} 0 L ${SCENE_W} ${SCENE_H} L ${VERTEX_X} ${SCENE_H} Z`
            : `M ${VERTEX_X} 0 L ${SCENE_W} 0 L ${SCENE_W} ${SCENE_H} L ${VERTEX_X} ${SCENE_H} Z`
        }
        fill="var(--ghost)"
        opacity={0.05}
      />
      <text x={SCENE_W - 16} y={26} fill={COLORS.text3} fontSize={11.5} textAnchor="end">
        atrás do espelho (onde moram as imagens virtuais)
      </text>

      {showRegions &&
        regions.map((rg) => {
          const x1 = VERTEX_X - rg.to * s;
          const x2 = VERTEX_X - rg.from * s;
          return (
            <g key={rg.text}>
              <rect x={Math.max(x1, 8)} y={AXIS_Y + 96} width={Math.max(x2 - Math.max(x1, 8), 0)} height={26} fill={rg.color} opacity={0.16} rx={5} />
              <text x={(Math.max(x1, 8) + x2) / 2} y={AXIS_Y + 113} fill={COLORS.text3} fontSize={11.5} textAnchor="middle">
                {rg.text}
              </text>
            </g>
          );
        })}

      <Axis y={AXIS_Y} x1={20} x2={SCENE_W - 20} />
      <SphericalMirror vx={VERTEX_X} axisY={AXIS_Y} Rpx={Rpx} concave={concave} halfHeight={118} />

      <AxisPoint x={VERTEX_X} y={AXIS_Y} label="V" color={COLORS.cyan} below sub="vértice" />
      <AxisPoint x={Fx} y={AXIS_Y} label="F" color={COLORS.purple} sub={`f = ${num(Math.abs(f), 1)} cm`} />
      {showC && <AxisPoint x={Cx} y={AXIS_Y} label="C" color={COLORS.blue} sub={`R = ${num(Math.abs(2 * f), 1)} cm`} />}

      {showRays && (
        <>
          {/* raio 1: chega paralelo ao eixo */}
          <Ray x1={objX} y1={objTopY} x2={M1.x} y2={M1.y} color={COLORS.ray} head="ray" width={2.4} arrow={false} />
          <Reflected from={M1} u={uA} color={COLORS.ray} />

          {/* raio 2: vai ao vértice */}
          <Ray x1={objX} y1={objTopY} x2={V.x} y2={V.y} color={COLORS.ray2} head="ray2" width={2.4} arrow={false} />
          <Reflected from={V} u={uB} color={COLORS.ray2} />
        </>
      )}

      <ArrowObject
        x={objX}
        baseY={AXIS_Y}
        height={OBJ_PX}
        color={COLORS.object}
        head="object"
        label="objeto"
        draggable={!!onDragP}
        onPointerDown={onDragP ? startDrag : undefined}
        sub={`p = ${num(p, 1)} cm`}
      />

      {imgVisible && (
        <ArrowObject
          x={imgX}
          baseY={AXIS_Y}
          height={r.hl}
          color={r.nature === 'real' ? COLORS.real : COLORS.virtual}
          head={r.nature === 'real' ? 'real' : 'virtual'}
          label="imagem"
          dashed={r.nature === 'virtual'}
          sub={`p′ = ${num(r.pl, 1)} cm`}
        />
      )}

      {far && (
        <Badge x={SCENE_W / 2 - 60} y={60} text="raios paralelos: imagem no infinito (imprópria)" color={COLORS.amber} />
      )}
      {!far && !imgVisible && (
        <Badge x={150} y={60} text={`imagem muito longe: p′ = ${num(r.pl, 1)} cm`} color={COLORS.amber} />
      )}

      {showRuler && (
        <>
          <Ruler x1={objX} x2={VERTEX_X} y={AXIS_Y + 60} label={`p = ${num(p, 1)} cm`} color={COLORS.object} />
          {imgVisible && (
            <Ruler
              x1={Math.min(imgX, VERTEX_X)}
              x2={Math.max(imgX, VERTEX_X)}
              y={AXIS_Y + 84}
              label={`p′ = ${num(r.pl, 1)} cm`}
              color={r.nature === 'real' ? COLORS.real : COLORS.virtual}
            />
          )}
        </>
      )}
    </Stage>
  );
}
