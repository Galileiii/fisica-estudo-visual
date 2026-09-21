import { useCallback, useRef } from 'react';
import { ArrowObject, Axis, AxisPoint, Badge, COLORS, Defs, Lens, Ray, Ruler } from '../components/svg';
import { Stage } from '../components/ui';
import { useSvgDrag, clamp } from '../lib/hooks';
import { num, solveImage } from '../lib/optics';

export const LW = 900;
export const LH = 430;
const AXIS_Y = 235;
const LENS_X = 380;
const OBJ_PX = 70;

interface Props {
  p: number;
  /** f > 0 convergente | f < 0 divergente */
  f: number;
  pMax: number;
  onDragP?: (p: number) => void;
  showRays?: boolean;
  showRuler?: boolean;
  label?: string;
}

export function LensScene({ p, f, pMax, onDragP, showRays = true, showRuler = true, label }: Props) {
  const converging = f > 0;
  const af = Math.abs(f);
  const s = clamp((LENS_X - 60) / Math.max(pMax, af * 2.2), 0.8, 26);

  const svgRef = useRef<SVGSVGElement>(null);
  const onMove = useCallback(
    (x: number) => {
      if (!onDragP) return;
      onDragP(clamp(Math.round(((LENS_X - x) / s) * 2) / 2, 1, pMax));
    },
    [onDragP, s, pMax],
  );
  const { startDrag } = useSvgDrag(svgRef, LW, onMove);

  const r = solveImage(p, f, OBJ_PX);
  const objX = LENS_X - p * s;
  const objTopY = AXIS_Y - OBJ_PX;

  /* focos: F (lado do objeto) e F′ (lado da imagem) */
  const FlinhaX = LENS_X + f * s; // foco imagem
  const Fx = LENS_X - f * s; // foco objeto

  const far = !isFinite(r.pl) || Math.abs(r.pl * s) > 5000;
  const imgX = far ? 0 : LENS_X + r.pl * s;
  const imgTopY = far ? 0 : AXIS_Y - r.hl;
  const imgVisible = !far && imgX > 15 && imgX < LW - 15;

  const norm = (x: number, y: number) => {
    const L = Math.hypot(x, y) || 1;
    return { x: x / L, y: y / L };
  };

  const P1 = { x: LENS_X, y: objTopY }; // onde o raio paralelo atinge a lente
  const u1 = converging ? norm(FlinhaX - P1.x, AXIS_Y - P1.y) : norm(P1.x - FlinhaX, P1.y - AXIS_Y);
  const O = { x: LENS_X, y: AXIS_Y }; // centro óptico
  const u2 = norm(LENS_X - objX, AXIS_Y - objTopY);

  const Refr = ({ from, u, color, head }: { from: { x: number; y: number }; u: { x: number; y: number }; color: string; head: string }) => (
    <>
      <Ray x1={from.x} y1={from.y} x2={from.x + u.x * 900} y2={from.y + u.y * 900} color={color} head={head} width={2.4} />
      {!far && r.nature === 'virtual' && (
        <Ray x1={from.x} y1={from.y} x2={imgX} y2={imgTopY} color={COLORS.ghost} head="ghost" width={1.9} dashed arrow={false} />
      )}
    </>
  );

  return (
    <Stage label={label} viewBox={`0 0 ${LW} ${LH}`} svgRef={svgRef}>
      <Defs />
      <Axis y={AXIS_Y} x1={20} x2={LW - 20} />

      <Lens x={LENS_X} axisY={AXIS_Y} converging={converging} halfHeight={104} />
      <text x={LENS_X} y={LH - 8} fill={COLORS.cyan} fontSize={12.5} fontWeight={700} textAnchor="middle">
        lente {converging ? 'convergente' : 'divergente'}
      </text>

      <AxisPoint x={Fx} y={AXIS_Y} label="F" color={COLORS.purple} below />
      <AxisPoint x={FlinhaX} y={AXIS_Y} label="F′" color={COLORS.purple} sub={`f = ${num(f, 1)} cm`} />

      {showRays && (
        <>
          <Ray x1={objX} y1={objTopY} x2={P1.x} y2={P1.y} color={COLORS.ray} head="ray" width={2.4} arrow={false} />
          <Refr from={P1} u={u1} color={COLORS.ray} head="ray" />

          <Ray x1={objX} y1={objTopY} x2={O.x} y2={O.y} color={COLORS.ray2} head="ray2" width={2.4} arrow={false} />
          <Refr from={O} u={u2} color={COLORS.ray2} head="ray2" />
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

      {far && <Badge x={LW / 2} y={54} text="objeto em F: os raios saem paralelos, imagem no infinito" color={COLORS.amber} />}
      {!far && !imgVisible && <Badge x={LW / 2} y={54} text={`imagem fora da tela: p′ = ${num(r.pl, 1)} cm`} color={COLORS.amber} />}

      {showRuler && (
        <>
          <Ruler x1={objX} x2={LENS_X} y={AXIS_Y + 62} label={`p = ${num(p, 1)} cm`} color={COLORS.object} />
          {imgVisible && (
            <Ruler
              x1={Math.min(imgX, LENS_X)}
              x2={Math.max(imgX, LENS_X)}
              y={AXIS_Y + 88}
              label={`p′ = ${num(r.pl, 1)} cm`}
              color={r.nature === 'real' ? COLORS.real : COLORS.virtual}
            />
          )}
        </>
      )}
    </Stage>
  );
}
