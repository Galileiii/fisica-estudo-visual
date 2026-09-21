import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Permite arrastar elementos dentro de um <svg> com mouse OU dedo.
 * Converte a posição do ponteiro na tela para a coordenada X do viewBox.
 */
export function useSvgDrag(
  svgRef: React.RefObject<SVGSVGElement | null>,
  vbWidth: number,
  onMove: (svgX: number) => void,
) {
  const active = useRef(false);

  const toSvgX = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return 0;
      const r = svg.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * vbWidth;
    },
    [svgRef, vbWidth],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!active.current) return;
      e.preventDefault();
      onMove(toSvgX(e.clientX));
    };
    const up = () => {
      active.current = false;
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [onMove, toSvgX]);

  /** Coloque em onPointerDown do elemento arrastável (ou do fundo do palco). */
  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      active.current = true;
      onMove(toSvgX(e.clientX));
    },
    [onMove, toSvgX],
  );

  return { startDrag, isDragging: active };
}

/** Relógio de animação: devolve o tempo em segundos, atualizado a cada frame. */
export function useClock(running = true, speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setT((v) => v + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);
  return t;
}

/** Estado que sobrevive ao F5 (fica salvo no navegador). */
export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* modo privado do navegador: segue sem salvar */
    }
  }, [key, value]);

  return [value, setValue];
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
