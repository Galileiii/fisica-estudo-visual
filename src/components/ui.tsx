import { useEffect, useRef, useState, type ReactNode } from 'react';
import { term } from '../content/glossary';

/* ============================ Termo explicado ============================ */

/** Palavra técnica com explicação. Clique/toque abre um balão. */
export function T({ id, children }: { id: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const t = term(id);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="term"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        aria-label={`O que significa ${t.label}`}
      >
        {children ?? t.label}
      </button>
      {open && (
        <span className="term-pop" onMouseLeave={() => setOpen(false)}>
          <b style={{ color: 'var(--cyan)' }}>{t.label}</b>
          <br />
          {t.text}
        </span>
      )}
    </span>
  );
}

/* ============================ Palco ============================ */

export function Stage({
  label,
  children,
  viewBox,
  svgRef,
  onPointerDown,
  height,
}: {
  label?: string;
  children: ReactNode;
  viewBox: string;
  svgRef?: React.Ref<SVGSVGElement>;
  onPointerDown?: (e: React.PointerEvent) => void;
  height?: number;
}) {
  return (
    <div className="stage">
      {label && <div className="stage-label">{label}</div>}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        onPointerDown={onPointerDown}
        style={height ? { maxHeight: height } : undefined}
        role="img"
      >
        {children}
      </svg>
    </div>
  );
}

/* ============================ Slider ============================ */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  hint,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="control">
      <div className="control-head">
        <span className="control-name">{label}</span>
        <span className="control-val">
          {String(value).replace('.', ',')}
          {unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className="muted">{hint}</span>}
    </div>
  );
}

/* ============================ Segmented ============================ */

export function Seg<V extends string>({
  value,
  options,
  onChange,
}: {
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
}) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          className={o.value === value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ============================ Reveal ============================ */

/** Botão "Por que isso acontece?" que abre uma explicação. */
export function Reveal({
  question = 'Por que isso acontece?',
  children,
}: {
  question?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="stack" style={{ gap: 10 }}>
      <button className="reveal-btn" onClick={() => setOpen((o) => !o)}>
        {open ? '▾' : '▸'} {question}
      </button>
      {open && <div className="reveal-body">{children}</div>}
    </div>
  );
}

/* ============================ Fórmula ============================ */

export function Formula({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="formula">
      {children}
      {caption && <small>{caption}</small>}
    </div>
  );
}

/* ============================ Leitura de valores ============================ */

export function Row({ k, v, tone }: { k: ReactNode; v: ReactNode; tone?: string }) {
  return (
    <div className="readout-row">
      <span className="k">{k}</span>
      <b style={tone ? { color: tone } : undefined}>{v}</b>
    </div>
  );
}

export function Readout({ children }: { children: ReactNode }) {
  return <div className="readout">{children}</div>;
}

/* ============================ Barra de progresso ============================ */

export function Bar({ pct, tone }: { pct: number; tone?: 'cyan' | 'amber' }) {
  return (
    <div className={`bar ${tone ?? ''}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

/** Barra estilo terminal: ███████░░░ 70% */
export function BarAscii({ pct }: { pct: number }) {
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * 10);
  return (
    <span className="bar-ascii">
      {'█'.repeat(filled)}
      {'░'.repeat(10 - filled)} {Math.round(pct)}%
    </span>
  );
}

/* ============================ Nota ============================ */

export function Note({
  tone = 'blue',
  children,
}: {
  tone?: 'blue' | 'purple' | 'amber' | 'green' | 'rose';
  children: ReactNode;
}) {
  return <div className={`note ${tone === 'blue' ? '' : tone}`}>{children}</div>;
}

export function Tag({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

/* ============================ Seção de lição ============================ */

export function Section({
  n,
  title,
  children,
}: {
  n?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="stack">
      <div className="row" style={{ gap: 10 }}>
        {n && <span className="eyebrow">{n}</span>}
        <h2 className="h2" style={{ flex: '1 1 auto' }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

