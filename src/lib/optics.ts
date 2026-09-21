/**
 * MOTOR DE ÓPTICA
 *
 * Convenção de sinais usada no app (a mesma do Ensino Médio / Gauss):
 *
 *  p   > 0  sempre  → objeto real, na frente do espelho / lente
 *  p'  > 0          → imagem REAL   (espelho: mesmo lado do objeto | lente: lado oposto)
 *  p'  < 0          → imagem VIRTUAL (atrás do espelho | mesmo lado do objeto, na lente)
 *  f   > 0          → espelho côncavo  | lente convergente
 *  f   < 0          → espelho convexo  | lente divergente
 *  A   > 0          → imagem DIREITA (mesmo sentido do objeto)
 *  A   < 0          → imagem INVERTIDA
 */

export type Nature = 'real' | 'virtual' | 'impropria';
export type Orientation = 'direita' | 'invertida' | '-';
export type SizeRel = 'maior' | 'menor' | 'igual' | '-';

export interface ImageResult {
  /** distância da imagem (mesma unidade de p e f). Infinity quando p = f */
  pl: number;
  /** aumento linear transversal A = -p'/p */
  A: number;
  /** altura da imagem */
  hl: number;
  nature: Nature;
  orientation: Orientation;
  size: SizeRel;
  /** true quando p = f e os raios saem paralelos (imagem imprópria / no infinito) */
  atInfinity: boolean;
}

/** 1/f = 1/p + 1/p'  →  p' = p·f / (p − f) */
export function imageDistance(p: number, f: number): number {
  const d = p - f;
  if (Math.abs(d) < 1e-9) return Infinity;
  return (p * f) / d;
}

/** Resolve tudo de uma vez: posição, natureza, orientação e tamanho da imagem. */
export function solveImage(p: number, f: number, h = 1): ImageResult {
  const pl = imageDistance(p, f);

  if (!isFinite(pl)) {
    return {
      pl: Infinity,
      A: Infinity,
      hl: Infinity,
      nature: 'impropria',
      orientation: '-',
      size: '-',
      atInfinity: true,
    };
  }

  const A = -pl / p;
  const hl = A * h;
  const absA = Math.abs(A);

  return {
    pl,
    A,
    hl,
    nature: pl > 0 ? 'real' : 'virtual',
    orientation: A > 0 ? 'direita' : 'invertida',
    size: absA > 1.001 ? 'maior' : absA < 0.999 ? 'menor' : 'igual',
    atInfinity: false,
  };
}

/** f = R / 2 */
export const focusFromRadius = (R: number) => R / 2;
/** R = 2f */
export const radiusFromFocus = (f: number) => 2 * f;

/** Vergência (grau) da lente, em dioptrias. f precisa estar em METROS. */
export const vergence = (fMeters: number) => 1 / fMeters;

/** Lei de Snell: n1·sen(i) = n2·sen(r). Retorna o ângulo r em graus, ou null se houver reflexão total. */
export function snellRefract(n1: number, n2: number, iDeg: number): number | null {
  const s = (n1 * Math.sin((iDeg * Math.PI) / 180)) / n2;
  if (s > 1 || s < -1) return null;
  return (Math.asin(s) * 180) / Math.PI;
}

/** Ângulo limite de reflexão total (n1 → n2, com n1 > n2). */
export function criticalAngle(n1: number, n2: number): number | null {
  if (n2 >= n1) return null;
  return (Math.asin(n2 / n1) * 180) / Math.PI;
}

/* ------------------------------------------------------------------ */
/* ONDAS                                                               */
/* ------------------------------------------------------------------ */

/** v = λ · f */
export const waveSpeed = (lambda: number, freq: number) => lambda * freq;
/** T = 1 / f */
export const period = (freq: number) => 1 / freq;
/** f = 1 / T */
export const frequency = (T: number) => 1 / T;

/* ------------------------------------------------------------------ */
/* Formatação                                                          */
/* ------------------------------------------------------------------ */

/** Número curto e legível: 12.5 → "12,5"  |  -0.3333 → "-0,33" */
export function num(v: number, decimals = 2): string {
  if (!isFinite(v)) return '∞';
  const r = Math.abs(v) < 1e-10 ? 0 : v;
  const s = Number(r.toFixed(decimals)).toString();
  return s.replace('.', ',');
}

/** Região do objeto em relação a C e F (só faz sentido no côncavo). */
export type Region = 'alem-de-C' | 'em-C' | 'entre-C-e-F' | 'em-F' | 'entre-F-e-espelho';

export function regionOf(p: number, f: number): Region {
  const C = 2 * f;
  const tol = Math.max(0.6, f * 0.06);
  if (Math.abs(p - C) <= tol) return 'em-C';
  if (Math.abs(p - f) <= tol) return 'em-F';
  if (p > C) return 'alem-de-C';
  if (p > f) return 'entre-C-e-F';
  return 'entre-F-e-espelho';
}

export const REGION_LABEL: Record<Region, string> = {
  'alem-de-C': 'Além de C',
  'em-C': 'Exatamente em C',
  'entre-C-e-F': 'Entre C e F',
  'em-F': 'Exatamente em F',
  'entre-F-e-espelho': 'Entre F e o espelho',
};

/** O que acontece com a imagem em cada região (espelho côncavo). */
export const REGION_STORY: Record<Region, string> = {
  'alem-de-C':
    'A imagem nasce entre C e F. É real, invertida e menor que o objeto. É o caso do espelho de maquiagem visto de longe: você aparece de cabeça para baixo e pequenininho.',
  'em-C':
    'A imagem nasce exatamente em cima de C também. É real, invertida e do mesmo tamanho. Objeto e imagem "se encontram" no mesmo ponto.',
  'entre-C-e-F':
    'Agora inverte o papel: a imagem vai para além de C. É real, invertida e MAIOR que o objeto. É assim que um espelho de dentista aumenta o dente.',
  'em-F':
    'Caso especial: os raios refletidos saem paralelos e nunca se cruzam. Não se forma imagem — dizemos que a imagem é imprópria (está no infinito).',
  'entre-F-e-espelho':
    'O objeto entrou na "zona virtual". Os raios refletidos divergem: eles não se encontram. Quem se encontra são os prolongamentos, atrás do espelho. A imagem fica virtual, direita e maior — é o espelho de maquiagem perto do rosto.',
};
