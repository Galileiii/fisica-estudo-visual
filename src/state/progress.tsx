import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalState } from '../lib/hooks';

export type Skill = 'interpretacao' | 'calculo';

interface Store {
  /** ids das lições concluídas */
  done: Record<string, boolean>;
  /** acertos / tentativas por habilidade */
  skills: Record<Skill, { hit: number; total: number }>;
  /** questões do modo Decifre já finalizadas */
  solved: Record<string, boolean>;
  streak: number;
}

const EMPTY: Store = {
  done: {},
  skills: { interpretacao: { hit: 0, total: 0 }, calculo: { hit: 0, total: 0 } },
  solved: {},
  streak: 0,
};

interface Ctx {
  store: Store;
  isDone: (id: string) => boolean;
  complete: (id: string) => void;
  toggle: (id: string) => void;
  record: (skill: Skill, correct: boolean) => void;
  solveQuestion: (id: string) => void;
  skillPct: (skill: Skill) => number;
  modulePct: (ids: string[]) => number;
  reset: () => void;
}

const ProgressCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useLocalState<Store>('fisica-visual:progresso:v1', EMPTY);

  const isDone = useCallback((id: string) => !!store.done[id], [store.done]);

  const complete = useCallback(
    (id: string) => {
      setStore((s) => (s.done[id] ? s : { ...s, done: { ...s.done, [id]: true } }));
    },
    [setStore],
  );

  const toggle = useCallback(
    (id: string) => {
      setStore((s) => {
        const done = { ...s.done };
        if (done[id]) delete done[id];
        else done[id] = true;
        return { ...s, done };
      });
    },
    [setStore],
  );

  const record = useCallback(
    (skill: Skill, correct: boolean) => {
      setStore((s) => ({
        ...s,
        streak: correct ? s.streak + 1 : 0,
        skills: {
          ...s.skills,
          [skill]: {
            hit: s.skills[skill].hit + (correct ? 1 : 0),
            total: s.skills[skill].total + 1,
          },
        },
      }));
    },
    [setStore],
  );

  const solveQuestion = useCallback(
    (id: string) => setStore((s) => ({ ...s, solved: { ...s.solved, [id]: true } })),
    [setStore],
  );

  const skillPct = useCallback(
    (skill: Skill) => {
      const s = store.skills[skill];
      if (!s || s.total === 0) return 0;
      return Math.round((s.hit / s.total) * 100);
    },
    [store.skills],
  );

  const modulePct = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return 0;
      const n = ids.filter((i) => store.done[i]).length;
      return Math.round((n / ids.length) * 100);
    },
    [store.done],
  );

  const reset = useCallback(() => setStore(EMPTY), [setStore]);

  const value = useMemo<Ctx>(
    () => ({ store, isDone, complete, toggle, record, solveQuestion, skillPct, modulePct, reset }),
    [store, isDone, complete, toggle, record, solveQuestion, skillPct, modulePct, reset],
  );

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error('useProgress precisa estar dentro de <ProgressProvider>');
  return ctx;
}
