/**
 * GLOSSÁRIO
 * Regra do app: nenhuma palavra técnica aparece sem explicação a um clique.
 * Escreva como se o leitor nunca tivesse ouvido a palavra antes.
 */

export interface Term {
  label: string;
  text: string;
}

export const GLOSSARY: Record<string, Term> = {
  /* ---------------- geral ---------------- */
  raio: {
    label: 'raio de luz',
    text: 'É uma setinha que representa o caminho que a luz faz. A luz não anda em "setas" de verdade — a seta é só o nosso jeito de desenhar para onde ela vai.',
  },
  normal: {
    label: 'normal',
    text: 'É uma linha imaginária tracejada, perpendicular (90°) à superfície, desenhada no ponto onde a luz bate. Todos os ângulos de óptica são medidos a partir dela — nunca a partir do espelho.',
  },
  eixoPrincipal: {
    label: 'eixo principal',
    text: 'É a linha horizontal que atravessa o centro do espelho (ou da lente). É a "régua" do desenho: todas as distâncias (p, p′, f, R) são medidas em cima dela.',
  },
  vertice: {
    label: 'vértice (V)',
    text: 'É o centro do espelho, o pontinho onde o eixo principal encosta na superfície espelhada. Todas as distâncias do espelho começam a contar dali.',
  },

  /* ---------------- espelhos ---------------- */
  foco: {
    label: 'foco (F)',
    text: 'É um ponto especial no eixo principal. Todo raio que chega paralelo ao eixo sai passando por ele (no côncavo) ou parecendo vir dele (no convexo). Ele não é uma peça física: é um lugar no espaço onde a luz se encontra.',
  },
  distanciaFocal: {
    label: 'distância focal (f)',
    text: 'É a distância entre o espelho (ou lente) e o foco, medida em cm ou m. Quanto menor o f, mais "forte" é o espelho/lente: ele entorta mais a luz.',
  },
  centroCurvatura: {
    label: 'centro de curvatura (C)',
    text: 'Todo espelho esférico é um pedacinho recortado de uma esfera. C é o centro dessa esfera. Fica sempre no dobro da distância focal: C = 2f.',
  },
  raioCurvatura: {
    label: 'raio de curvatura (R)',
    text: 'É o raio da esfera de onde o espelho foi "recortado" — ou seja, a distância do espelho até C. Vale sempre R = 2f (e portanto f = R/2).',
  },
  concavo: {
    label: 'côncavo',
    text: 'Espelho com a parte espelhada virada para DENTRO, como o fundo de uma colher pelo lado de comer. Ele junta (converge) a luz.',
  },
  convexo: {
    label: 'convexo',
    text: 'Espelho com a parte espelhada virada para FORA, como as costas de uma colher. Ele espalha (diverge) a luz. É o espelho de ônibus e de loja.',
  },
  imagemReal: {
    label: 'imagem real',
    text: 'Os raios de luz realmente se encontram naquele ponto. Por isso ela pode ser projetada numa folha de papel ou numa parede. Em espelho ela aparece na frente dele, e sempre de cabeça para baixo.',
  },
  imagemVirtual: {
    label: 'imagem virtual',
    text: 'Os raios não se encontram de verdade: eles só PARECEM vir de um ponto. Seu cérebro estica os raios para trás e enxerga a imagem ali. Não dá para projetar numa folha. É a imagem do espelho do banheiro.',
  },
  aumento: {
    label: 'aumento (A)',
    text: 'É quantas vezes a imagem é maior ou menor que o objeto. A = 2 significa "o dobro do tamanho". Se A der negativo, quer dizer que a imagem está invertida.',
  },
  p: {
    label: 'p',
    text: 'Distância do OBJETO até o espelho/lente. Em prova é o dado do tipo "um objeto está a 30 cm do espelho".',
  },
  pLinha: {
    label: "p′",
    text: 'Distância da IMAGEM até o espelho/lente. É quase sempre o que a questão pede. O sinal dele conta a história: positivo = real, negativo = virtual.',
  },

  /* ---------------- lentes ---------------- */
  refracao: {
    label: 'refração',
    text: 'É a luz mudando de velocidade ao entrar em outro material (ar → vidro → água) e, por causa disso, entortando o caminho. É por isso que o canudo dentro do copo parece quebrado.',
  },
  indiceRefracao: {
    label: 'índice de refração (n)',
    text: 'Um número que diz o quanto um material segura a luz. Ar ≈ 1, água ≈ 1,33, vidro ≈ 1,5. Quanto maior o n, mais devagar a luz anda ali dentro e mais ela entorta ao entrar.',
  },
  convergente: {
    label: 'lente convergente',
    text: 'Lente mais grossa no meio do que nas bordas (lupa). Ela junta os raios num ponto. Tem f positivo.',
  },
  divergente: {
    label: 'lente divergente',
    text: 'Lente mais fina no meio do que nas bordas. Ela espalha os raios. A imagem é sempre virtual, direita e menor. Tem f negativo.',
  },
  vergencia: {
    label: 'vergência (V)',
    text: 'É o "grau" da lente, medido em dioptrias (di). V = 1/f, com f obrigatoriamente em METROS. Um óculos de +2 graus tem f = 0,5 m.',
  },

  /* ---------------- ondas ---------------- */
  onda: {
    label: 'onda',
    text: 'É uma perturbação que viaja carregando ENERGIA, sem carregar matéria junto. A rolha sobe e desce na água, mas não vai embora com a onda.',
  },
  amplitude: {
    label: 'amplitude (A)',
    text: 'É a altura da onda, medida do meio (repouso) até o topo da crista. Está ligada à energia: onda mais alta = mais energia. Em som, é o volume.',
  },
  comprimentoOnda: {
    label: 'comprimento de onda (λ)',
    text: 'É o tamanho de UMA onda inteira: a distância de uma crista até a próxima crista. Mede-se em metros. Lê-se "lambda".',
  },
  frequencia: {
    label: 'frequência (f)',
    text: 'É quantas ondas passam por um ponto em 1 segundo. Mede-se em hertz (Hz). 5 Hz = 5 ondas por segundo. Em som, é o que define grave ou agudo.',
  },
  periodo: {
    label: 'período (T)',
    text: 'É o tempo que UMA onda leva para passar, em segundos. É o contrário da frequência: T = 1/f. Se passam 4 ondas por segundo, cada uma leva 0,25 s.',
  },
  crista: {
    label: 'crista',
    text: 'É o ponto mais alto da onda. O ponto mais baixo se chama vale.',
  },
  transversal: {
    label: 'onda transversal',
    text: 'A onda anda para o lado, mas o material balança para cima e para baixo — perpendicular à direção da onda. Exemplo: corda sacudida, luz.',
  },
  longitudinal: {
    label: 'onda longitudinal',
    text: 'O material balança na MESMA direção em que a onda anda, formando apertos e alívios. Exemplo: som no ar, mola sanfonada.',
  },
  interferencia: {
    label: 'interferência',
    text: 'É o que acontece quando duas ondas se encontram no mesmo ponto: as alturas se somam. Se crista encontra crista, cresce. Se crista encontra vale, some.',
  },
};

export function term(id: string): Term {
  return GLOSSARY[id] ?? { label: id, text: 'Termo sem descrição.' };
}
