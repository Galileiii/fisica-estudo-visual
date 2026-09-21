import type { ComponentType } from 'react';
import { LicaoEspelhoPlano, LicaoReflexao, LicaoRealVirtual } from '../sims/espelhos1';
import { LicaoEquacao, LicaoEsfericos, LicaoFocoRaio, LicaoFormacaoImagens } from '../sims/espelhos2';
import { LicaoConvergente, LicaoDivergente, LicaoEquacaoLentes, LicaoRefracao, LicaoVergencia } from '../sims/lentes';
import {
  LicaoAnatomia,
  LicaoFrequencia,
  LicaoInterferencia,
  LicaoMudancaDeMeio,
  LicaoOQueEOnda,
  LicaoVelocidade,
} from '../sims/ondas';

export interface Licao {
  id: string;
  titulo: string;
  sub: string;
  C: ComponentType;
}

export interface Modulo {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  frase: string;
  descricao: string;
  licoes: Licao[];
}

export const MODULOS: Modulo[] = [
  {
    id: 'espelhos',
    nome: 'Espelhos',
    emoji: '🪞',
    cor: '#4f7cff',
    frase: 'A luz bate e volta.',
    descricao: 'Da reflexão simples até a equação de Gauss — vendo os raios se encontrarem (ou não).',
    licoes: [
      { id: 'reflexao', titulo: 'Reflexão', sub: 'i = r, e por que o ângulo é medido da normal', C: LicaoReflexao },
      { id: 'plano', titulo: 'Espelho plano', sub: 'Arraste o objeto e veja a imagem acompanhar', C: LicaoEspelhoPlano },
      { id: 'real-virtual', titulo: 'Imagem real e virtual', sub: 'A pergunta que decide toda questão de óptica', C: LicaoRealVirtual },
      { id: 'esfericos', titulo: 'Espelhos esféricos', sub: 'Côncavo e convexo, V, F e C', C: LicaoEsfericos },
      { id: 'foco-raio', titulo: 'Foco e raio de curvatura', sub: 'De onde sai o f = R/2', C: LicaoFocoRaio },
      { id: 'formacao', titulo: 'Formação de imagens no côncavo', sub: 'As cinco regiões, arrastando o objeto', C: LicaoFormacaoImagens },
      { id: 'equacao', titulo: 'Equação dos espelhos', sub: '1/f = 1/p + 1/p′ e A = −p′/p, passo a passo', C: LicaoEquacao },
    ],
  },
  {
    id: 'lentes',
    nome: 'Lentes',
    emoji: '🔍',
    cor: '#9b5cff',
    frase: 'A luz atravessa e entorta.',
    descricao: 'Refração, raios notáveis, a mesma equação de Gauss e o grau dos óculos.',
    licoes: [
      { id: 'refracao', titulo: 'Refração', sub: 'Por que a luz entorta ao mudar de meio', C: LicaoRefracao },
      { id: 'convergente', titulo: 'Lente convergente', sub: 'A lupa, o projetor e a câmera', C: LicaoConvergente },
      { id: 'divergente', titulo: 'Lente divergente', sub: 'A que sempre dá a mesma resposta', C: LicaoDivergente },
      { id: 'equacao-lentes', titulo: 'Equação das lentes', sub: 'A mesma fórmula, com um detalhe de sinal', C: LicaoEquacaoLentes },
      { id: 'vergencia', titulo: 'Vergência e os óculos', sub: 'V = 1/f, miopia e hipermetropia', C: LicaoVergencia },
    ],
  },
  {
    id: 'ondas',
    nome: 'Ondas',
    emoji: '🌊',
    cor: '#2fd6d0',
    frase: 'A energia viaja, a matéria fica.',
    descricao: 'Anatomia da onda, frequência, período, v = λ·f, mudança de meio e interferência.',
    licoes: [
      { id: 'o-que-e', titulo: 'O que é uma onda', sub: 'Transversal, longitudinal e por que a rolha não viaja', C: LicaoOQueEOnda },
      { id: 'anatomia', titulo: 'Anatomia da onda', sub: 'Amplitude, comprimento de onda, crista e vale', C: LicaoAnatomia },
      { id: 'frequencia', titulo: 'Frequência e período', sub: 'Contar ondas e cronometrar ondas', C: LicaoFrequencia },
      { id: 'velocidade', titulo: 'Velocidade: v = λ · f', sub: 'A fórmula mais cobrada do módulo', C: LicaoVelocidade },
      { id: 'mudanca-meio', titulo: 'Onda mudando de meio', sub: 'O que muda e o que teima em não mudar', C: LicaoMudancaDeMeio },
      { id: 'interferencia', titulo: 'Interferência', sub: 'Duas ondas no mesmo lugar se somam', C: LicaoInterferencia },
    ],
  },
];

export const findModulo = (id: string) => MODULOS.find((m) => m.id === id);

export function findLicao(moduloId: string, licaoId: string) {
  const m = findModulo(moduloId);
  if (!m) return null;
  const idx = m.licoes.findIndex((l) => l.id === licaoId);
  if (idx < 0) return null;
  return { modulo: m, licao: m.licoes[idx], idx, prev: m.licoes[idx - 1] ?? null, next: m.licoes[idx + 1] ?? null };
}

/** id global de uma lição, usado para salvar o progresso */
export const licaoKey = (moduloId: string, licaoId: string) => `${moduloId}/${licaoId}`;

export const todasLicoes = (m: Modulo) => m.licoes.map((l) => licaoKey(m.id, l.id));
