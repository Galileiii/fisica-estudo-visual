/**
 * BANCO DE QUESTÕES DO MODO "DECIFRE A QUESTÃO".
 *
 * Cada questão é quebrada nos 6 passos que um aluno precisa dar — e que
 * normalmente ninguém ensina explicitamente:
 *   1. o que a questão me deu        (leitura)
 *   2. o que ela quer descobrir      (alvo)
 *   3. qual fórmula conecta os dois  (caminho)
 *   4. substituir os valores         (organização)
 *   5. resolver                      (conta)
 *   6. o que o resultado significa   (interpretação)
 */

export interface Escolha {
  texto: string;
  ok?: boolean;
  why?: string;
}

export interface Chip {
  texto: string;
  ok: boolean;
  why: string;
}

export interface Questao {
  id: string;
  modulo: 'espelhos' | 'lentes' | 'ondas';
  nivel: 'fácil' | 'médio' | 'difícil';
  enunciado: string;
  /** passo 1 — selecionar os dados que realmente existem no enunciado */
  dados: Chip[];
  /** passo 2 — o que a questão pede */
  alvo: Escolha[];
  /** passo 3 — qual fórmula conecta */
  formula: Escolha[];
  /** passo 4 — substituição correta */
  substituicao: Escolha[];
  /** passo 5 — resolver */
  resposta: { valor: number; unidade: string; tolerancia?: number; passos: string[] };
  /** passo 6 — interpretar */
  significado: Escolha[];
  /** fechamento: a lição que fica */
  licao: string;
}

export const QUESTOES: Questao[] = [
  /* ================================================================ */
  {
    id: 'esp-01',
    modulo: 'espelhos',
    nivel: 'fácil',
    enunciado:
      'Um objeto está a 30 cm de um espelho côncavo cuja distância focal é 10 cm. Determine a posição da imagem.',
    dados: [
      { texto: 'p = 30 cm', ok: true, why: '"está a 30 cm do espelho" é a distância do objeto: esse é o p.' },
      { texto: 'f = 10 cm', ok: true, why: '"distância focal é 10 cm" é literalmente o f.' },
      { texto: 'espelho côncavo → f é positivo', ok: true, why: 'Côncavo tem foco na frente, então f entra na conta com sinal +.' },
      { texto: 'R = 10 cm', ok: false, why: 'O enunciado falou em distância FOCAL, não em raio de curvatura. Se fosse R, você teria de dividir por 2.' },
      { texto: 'h = 30 cm', ok: false, why: '30 cm é a distância até o espelho, não a altura do objeto. A questão nem fala de altura.' },
      { texto: "p' = 30 cm", ok: false, why: 'p′ é a imagem — é justamente o que a questão quer descobrir. Não pode ser um dado.' },
    ],
    alvo: [
      { texto: 'p — a distância do objeto', why: 'Isso já foi dado no enunciado (30 cm).' },
      { texto: 'f — a distância focal', why: 'Também já foi dado (10 cm).' },
      { texto: "p′ — a distância da imagem até o espelho", ok: true, why: '"Determine a posição da imagem" = onde a imagem fica = p′.' },
      { texto: 'A — o aumento', why: 'A questão não perguntou tamanho, perguntou posição.' },
    ],
    formula: [
      { texto: '1/f = 1/p + 1/p′', ok: true, why: 'É a única que junta as três distâncias. Você tem duas delas e quer a terceira.' },
      { texto: 'A = −p′/p', why: 'Essa serve para tamanho/aumento, e aqui você ainda nem tem p′.' },
      { texto: 'f = R/2', why: 'Serviria se o enunciado tivesse dado R. Ele já deu o f pronto.' },
      { texto: 'v = λ·f', why: 'Essa é de ondas. O "f" dela é frequência, não distância focal — cuidado com letras repetidas.' },
    ],
    substituicao: [
      { texto: '1/10 = 1/30 + 1/p′', ok: true, why: 'f vai no lugar do f, p vai no lugar do p. A incógnita fica sozinha.' },
      { texto: '1/30 = 1/10 + 1/p′', why: 'Trocou o f com o p. Quem é 10 aqui é a distância focal.' },
      { texto: '10 = 30 + p′', why: 'Esqueceu que a fórmula é com os INVERSOS (1 dividido por cada valor).' },
      { texto: '1/p′ = 1/10 + 1/30', why: 'Quase: ao isolar 1/p′ o sinal vira menos, não mais.' },
    ],
    resposta: {
      valor: 15,
      unidade: 'cm',
      passos: [
        '1/p′ = 1/f − 1/p',
        '1/p′ = 1/10 − 1/30',
        'MMC de 10 e 30 é 30 → 1/p′ = 3/30 − 1/30 = 2/30',
        'Inverta a fração: p′ = 30/2',
        'p′ = 15 cm',
      ],
    },
    significado: [
      { texto: 'A imagem é real, invertida e está 15 cm na frente do espelho.', ok: true, why: 'p′ positivo = os raios se encontraram de verdade = imagem real. E no espelho, real anda junto com invertida.' },
      { texto: 'A imagem é virtual e está 15 cm atrás do espelho.', why: 'Aí p′ teria dado negativo.' },
      { texto: 'A imagem tem 15 cm de altura.', why: 'p′ é distância, não altura. Altura seria h′, que vem do aumento.' },
      { texto: 'O objeto precisa ser movido para 15 cm.', why: 'O objeto continua a 30 cm; 15 cm é onde a imagem nasceu.' },
    ],
    licao: 'Quando a questão pede POSIÇÃO da imagem, ela quer p′ — e o sinal do p′ já entrega de brinde a natureza (real/virtual) e a orientação.',
  },

  /* ================================================================ */
  {
    id: 'esp-02',
    modulo: 'espelhos',
    nivel: 'médio',
    enunciado:
      'Um espelho côncavo tem raio de curvatura de 40 cm. Um objeto de 5 cm de altura é colocado a 30 cm do espelho. Qual é a altura da imagem?',
    dados: [
      { texto: 'R = 40 cm', ok: true, why: '"raio de curvatura" é o R. Ele ainda vai precisar virar f.' },
      { texto: 'h = 5 cm', ok: true, why: 'A altura do objeto. Aparece porque no fim a questão quer h′.' },
      { texto: 'p = 30 cm', ok: true, why: 'A distância do objeto ao espelho.' },
      { texto: 'f = 40 cm', ok: false, why: 'Armadilha clássica: 40 cm é o R, não o f. O foco é a metade: f = 20 cm.' },
      { texto: "h' = 5 cm", ok: false, why: 'h′ é a altura da IMAGEM — é o que a questão pergunta.' },
    ],
    alvo: [
      { texto: "h′ — a altura da imagem", ok: true, why: 'É o que a pergunta pede, literalmente.' },
      { texto: 'p′ — a posição da imagem', why: 'Você VAI precisar calcular isso, mas como passo intermediário, não como resposta final.' },
      { texto: 'f — a distância focal', why: 'Também é intermediário: vem de R/2.' },
      { texto: 'R — o raio de curvatura', why: 'Já foi dado.' },
    ],
    formula: [
      { texto: 'Preciso de três: f = R/2, depois 1/f = 1/p + 1/p′, depois A = −p′/p = h′/h', ok: true, why: 'Questões de altura quase sempre exigem essa corrente de três passos.' },
      { texto: 'Só A = h′/h', why: 'Sem saber o A (que vem de p e p′), essa sozinha não resolve nada.' },
      { texto: 'Só 1/f = 1/p + 1/p′', why: 'Essa dá a posição, mas para chegar a uma ALTURA falta o aumento.' },
      { texto: 'h′ = h · f', why: 'Essa fórmula não existe.' },
    ],
    substituicao: [
      { texto: 'f = 40/2 = 20 → 1/p′ = 1/20 − 1/30', ok: true, why: 'Converteu R em f antes de tudo. É esse o caminho.' },
      { texto: '1/p′ = 1/40 − 1/30', why: 'Usou o R no lugar do f. Faltou dividir por 2.' },
      { texto: '1/p′ = 1/30 − 1/20', why: 'Inverteu a ordem: quem fica na frente é 1/f.' },
      { texto: 'h′ = 5 · 30/20', why: 'Chutou uma proporção direta sem passar pelo p′.' },
    ],
    resposta: {
      valor: -10,
      unidade: 'cm',
      tolerancia: 0.06,
      passos: [
        'f = R/2 = 40/2 = 20 cm',
        '1/p′ = 1/20 − 1/30 = 3/60 − 2/60 = 1/60',
        'p′ = 60 cm',
        'A = −p′/p = −60/30 = −2',
        'h′ = A · h = −2 · 5 = −10 cm',
      ],
    },
    significado: [
      { texto: 'A imagem tem 10 cm (o dobro do objeto) e está invertida.', ok: true, why: 'O módulo 10 é o tamanho; o sinal negativo é o aviso de que ela está de cabeça para baixo.' },
      { texto: 'A imagem tem −10 cm de altura, o que é impossível.', why: 'O sinal não é tamanho negativo: é orientação invertida.' },
      { texto: 'A imagem é menor que o objeto.', why: '|A| = 2, então ela é o dobro.' },
      { texto: 'A imagem é virtual.', why: 'p′ = +60 cm é positivo, então ela é real.' },
    ],
    licao: 'Se o enunciado deu R, o primeiro movimento é sempre f = R/2. E quando o resultado de altura vem negativo, o sinal está falando de orientação, não de tamanho.',
  },

  /* ================================================================ */
  {
    id: 'esp-03',
    modulo: 'espelhos',
    nivel: 'médio',
    enunciado:
      'Um espelho convexo usado numa loja tem distância focal de 15 cm (em módulo). Uma pessoa está a 30 cm dele. Onde se forma a imagem?',
    dados: [
      { texto: 'f = −15 cm', ok: true, why: 'Convexo = foco atrás do espelho = f negativo. Esse sinal é a chave da questão inteira.' },
      { texto: 'p = 30 cm', ok: true, why: 'A distância da pessoa até o espelho.' },
      { texto: 'f = +15 cm', ok: false, why: 'Positivo é côncavo. Se você usar +15, toda a resposta sai errada.' },
      { texto: 'R = 15 cm', ok: false, why: 'O enunciado disse distância focal, não raio.' },
    ],
    alvo: [
      { texto: 'p′ — onde a imagem se forma', ok: true, why: '"Onde se forma a imagem" pergunta a posição.' },
      { texto: 'A — o aumento', why: 'Não foi pedido (embora seja fácil calcular depois).' },
      { texto: 'f', why: 'Já foi dado.' },
      { texto: 'h′', why: 'Nem existe altura no enunciado.' },
    ],
    formula: [
      { texto: '1/f = 1/p + 1/p′, com f = −15', ok: true, why: 'A fórmula é a mesma de sempre. O que muda é só o sinal do f.' },
      { texto: 'Uma fórmula especial para espelhos convexos', why: 'Não existe fórmula diferente. É a mesma, com f negativo.' },
      { texto: 'p′ = p − f', why: 'Essa fórmula não existe.' },
      { texto: 'A = h′/h', why: 'Não há alturas aqui.' },
    ],
    substituicao: [
      { texto: '1/p′ = 1/(−15) − 1/30', ok: true, why: 'Isolou 1/p′ e manteve o sinal negativo do f.' },
      { texto: '1/p′ = 1/15 − 1/30', why: 'Perdeu o sinal do convexo no meio do caminho.' },
      { texto: '1/p′ = −1/15 + 1/30', why: 'Trocou o sinal do segundo termo.' },
      { texto: '−15 = 30 + p′', why: 'Esqueceu os inversos.' },
    ],
    resposta: {
      valor: -10,
      unidade: 'cm',
      tolerancia: 0.06,
      passos: [
        '1/p′ = 1/f − 1/p = 1/(−15) − 1/30',
        'MMC 30 → 1/p′ = −2/30 − 1/30 = −3/30',
        '1/p′ = −1/10',
        'p′ = −10 cm',
      ],
    },
    significado: [
      { texto: 'A imagem é virtual, direita e menor, 10 cm atrás do espelho.', ok: true, why: 'p′ negativo = virtual = atrás. E |A| = 10/30 = 0,33, ou seja, menor.' },
      { texto: 'A imagem é real, 10 cm na frente.', why: 'p′ deu negativo, então não é real.' },
      { texto: 'Deu erro na conta, porque distância não é negativa.', why: 'É negativa sim — e esse sinal é informação, não erro.' },
      { texto: 'A imagem é maior que a pessoa.', why: 'Convexo nunca aumenta: por isso é usado em lojas, para "caber" bastante coisa.' },
    ],
    licao: 'No convexo, coloque o sinal negativo no f ANTES de começar. O resultado sempre será p′ negativo: imagem virtual, direita e menor.',
  },

  /* ================================================================ */
  {
    id: 'esp-04',
    modulo: 'espelhos',
    nivel: 'fácil',
    enunciado:
      'Uma pessoa está a 1,5 m de um espelho plano e se afasta 0,5 m. Qual passa a ser a distância entre a pessoa e a sua imagem?',
    dados: [
      { texto: 'distância inicial ao espelho = 1,5 m', ok: true, why: 'Posição de partida.' },
      { texto: 'afastamento = 0,5 m', ok: true, why: 'O quanto ela andou para trás.' },
      { texto: 'espelho plano', ok: true, why: 'Isso define a regra: imagem simétrica, à mesma distância.' },
      { texto: 'f = 1,5 m', ok: false, why: 'Espelho plano não tem foco útil nessa conta. Aqui não se usa a equação de Gauss.' },
      { texto: 'distância final ao espelho = 1 m', ok: false, why: 'Ela se AFASTOU, então a distância aumenta: 1,5 + 0,5 = 2 m.' },
    ],
    alvo: [
      { texto: 'A distância entre a pessoa e a imagem depois do movimento', ok: true, why: 'É exatamente a frase final do enunciado.' },
      { texto: 'A distância da pessoa ao espelho', why: 'Isso é passo intermediário (2 m).' },
      { texto: 'O tamanho da imagem', why: 'Não foi pedido — e no plano é sempre igual ao objeto.' },
      { texto: 'p′ pela equação de Gauss', why: 'Para espelho plano não é preciso fórmula nenhuma: é simetria.' },
    ],
    formula: [
      { texto: 'distância objeto–imagem = 2 × distância objeto–espelho', ok: true, why: 'É a regra do espelho plano: a imagem fica à mesma distância do outro lado.' },
      { texto: '1/f = 1/p + 1/p′', why: 'Funciona (com f infinito), mas é um caminho complicado para algo que é simetria pura.' },
      { texto: 'A = −p′/p', why: 'No plano A = 1 sempre, e isso não responde a pergunta.' },
      { texto: 'v = λ·f', why: 'É de ondas.' },
    ],
    substituicao: [
      { texto: 'nova distância ao espelho = 1,5 + 0,5 = 2 m → resposta = 2 × 2', ok: true, why: 'Primeiro atualize a posição, só depois dobre.' },
      { texto: '2 × 1,5 = 3 m', why: 'Usou a posição antiga: a pessoa já tinha andado.' },
      { texto: '1,5 + 0,5 = 2 m', why: 'Essa é a distância até o ESPELHO, não até a imagem.' },
      { texto: '2 × 0,5 = 1 m', why: 'Dobrou só o deslocamento, esquecendo de onde ela partiu.' },
    ],
    resposta: {
      valor: 4,
      unidade: 'm',
      passos: [
        'Nova distância pessoa–espelho: 1,5 + 0,5 = 2 m',
        'No espelho plano a imagem fica à mesma distância do outro lado: 2 m',
        'Distância pessoa–imagem: 2 + 2 = 4 m',
      ],
    },
    significado: [
      { texto: 'Ela e a imagem estão separadas por 4 m — e a imagem é virtual, direita e do mesmo tamanho.', ok: true, why: 'Espelho plano: sempre virtual, direita, mesmo tamanho, simétrica.' },
      { texto: 'A imagem ficou 4 m menor.', why: 'No espelho plano o tamanho nunca muda.' },
      { texto: 'A imagem está 4 m atrás do espelho.', why: 'Atrás do espelho ela está a 2 m. Os 4 m são pessoa→imagem.' },
      { texto: 'A imagem é real.', why: 'Espelho plano só forma imagem virtual (de objeto real).' },
    ],
    licao: 'Quando a pessoa anda x, ela se afasta 2x da própria imagem. Atualize a posição antes de dobrar — a ordem dos passos é o que derruba nessa questão.',
  },

  /* ================================================================ */
  {
    id: 'len-01',
    modulo: 'lentes',
    nivel: 'fácil',
    enunciado:
      'Uma lente convergente de distância focal 20 cm é usada para projetar numa parede a imagem de uma vela colocada a 60 cm da lente. A que distância da lente a parede deve ficar?',
    dados: [
      { texto: 'f = +20 cm', ok: true, why: 'Convergente → f positivo.' },
      { texto: 'p = 60 cm', ok: true, why: 'A distância da vela até a lente.' },
      { texto: 'a imagem precisa ser projetada (real)', ok: true, why: 'Detalhe importantíssimo: "projetar na parede" só é possível com imagem REAL, ou seja, p′ positivo.' },
      { texto: 'f = −20 cm', ok: false, why: 'Negativo seria divergente, que nunca projeta.' },
      { texto: "p′ = 60 cm", ok: false, why: 'p′ é a incógnita (é onde a parede vai).' },
    ],
    alvo: [
      { texto: 'p′ — a distância da imagem à lente', ok: true, why: 'A parede tem de estar exatamente onde a imagem se forma.' },
      { texto: 'f', why: 'Já foi dado.' },
      { texto: 'A — o aumento', why: 'Não foi perguntado.' },
      { texto: 'h′ — o tamanho da imagem', why: 'Nem existe altura no enunciado.' },
    ],
    formula: [
      { texto: '1/f = 1/p + 1/p′', ok: true, why: 'Mesma equação de Gauss dos espelhos. Serve igual para lentes.' },
      { texto: 'V = 1/f', why: 'Essa dá o grau da lente em dioptrias, não a posição.' },
      { texto: 'A = −p′/p', why: 'Sem p′, ela não resolve.' },
      { texto: 'n₁ sen i = n₂ sen r', why: 'Essa é a lei de Snell, para um raio atravessando uma superfície.' },
    ],
    substituicao: [
      { texto: '1/p′ = 1/20 − 1/60', ok: true, why: '1/f menos 1/p, com f = 20 e p = 60.' },
      { texto: '1/p′ = 1/60 − 1/20', why: 'Inverteu: daria negativo, sugerindo (erradamente) imagem virtual.' },
      { texto: '1/p′ = 1/20 + 1/60', why: 'Ao isolar, o termo 1/p muda de sinal.' },
      { texto: 'p′ = 60 − 20', why: 'Esqueceu os inversos — subtração direta não vale aqui.' },
    ],
    resposta: {
      valor: 30,
      unidade: 'cm',
      passos: [
        '1/p′ = 1/f − 1/p = 1/20 − 1/60',
        'MMC 60 → 3/60 − 1/60 = 2/60 = 1/30',
        'p′ = 30 cm',
      ],
    },
    significado: [
      { texto: 'A parede deve ficar a 30 cm da lente, do outro lado da vela, e a imagem aparecerá invertida.', ok: true, why: 'p′ positivo numa lente = imagem real, do lado oposto ao objeto, sempre invertida.' },
      { texto: 'A parede deve ficar a 30 cm do mesmo lado da vela.', why: 'Na lente, p′ positivo significa o lado OPOSTO — é por lá que a luz saiu.' },
      { texto: 'A imagem aparecerá direita.', why: 'Imagem real é sempre invertida. Por isso o projetor de cinema trabalha com o filme de cabeça para baixo.' },
      { texto: 'Não é possível projetar essa imagem.', why: 'É possível sim: p′ deu positivo, então a imagem é real.' },
    ],
    licao: 'A frase "projetar numa parede/tela/sensor" é um dado disfarçado: significa imagem REAL, p′ > 0. Use isso para conferir se o resultado faz sentido.',
  },

  /* ================================================================ */
  {
    id: 'len-02',
    modulo: 'lentes',
    nivel: 'médio',
    enunciado:
      'Um oftalmologista receitou óculos com lentes de distância focal igual a 50 cm. Qual é o "grau" (vergência) dessas lentes?',
    dados: [
      { texto: 'f = 50 cm', ok: true, why: 'A distância focal dada pelo enunciado.' },
      { texto: 'f = 0,5 m', ok: true, why: 'A MESMA informação convertida para metros — e é assim que ela precisa entrar na fórmula.' },
      { texto: 'V = 50 di', ok: false, why: 'Isso seria a resposta se a fórmula fosse V = f, o que não é o caso.' },
      { texto: 'lente divergente', ok: false, why: 'O enunciado não disse isso, e o f veio positivo: é convergente.' },
    ],
    alvo: [
      { texto: 'V — a vergência, em dioptrias', ok: true, why: '"Grau" de óculos é o nome popular da vergência.' },
      { texto: 'f em metros', why: 'Isso é passo intermediário (conversão de unidade).' },
      { texto: 'p′', why: 'Não há objeto nem imagem nessa questão.' },
      { texto: 'A', why: 'Não há aumento envolvido.' },
    ],
    formula: [
      { texto: 'V = 1/f, com f em metros', ok: true, why: 'É a definição de vergência. A unidade (dioptria) só existe se f estiver em metros.' },
      { texto: 'V = f/1', why: 'Está de cabeça para baixo.' },
      { texto: '1/f = 1/p + 1/p′', why: 'Serve para achar posições de imagem, não o grau.' },
      { texto: 'V = 1/f, com f em centímetros', why: 'Daria 0,02 — resposta clássica errada por esquecer a conversão.' },
    ],
    substituicao: [
      { texto: 'V = 1 / 0,5', ok: true, why: 'Converteu 50 cm para 0,5 m antes de dividir.' },
      { texto: 'V = 1 / 50', why: 'Usou centímetros. Resultado 0,02 — sem sentido para grau de óculos.' },
      { texto: 'V = 0,5 / 1', why: 'Inverteu a divisão.' },
      { texto: 'V = 50 / 100', why: 'Isso é só a conversão de unidade, não a vergência.' },
    ],
    resposta: {
      valor: 2,
      unidade: 'di',
      passos: ['Converter: 50 cm = 0,5 m', 'V = 1/f = 1/0,5', 'V = 2 di (dioptrias)'],
    },
    significado: [
      { texto: 'São lentes convergentes de 2 graus — do tipo usado para corrigir hipermetropia.', ok: true, why: 'V positivo = lente convergente = "grau positivo".' },
      { texto: 'São lentes divergentes de 2 graus.', why: 'Divergente teria vergência negativa.' },
      { texto: 'A lente tem 2 metros de distância focal.', why: 'Confundiu a resposta (2 di) com f. O f é 0,5 m.' },
      { texto: 'A pessoa enxerga 2 vezes melhor.', why: 'Dioptria não é fator de melhora; é uma medida de quanto a lente entorta a luz.' },
    ],
    licao: 'Sempre que a questão falar em GRAU ou DIOPTRIA, o primeiro movimento é converter o f para metros. Esquecer isso é o erro número 1 desse tipo de questão.',
  },

  /* ================================================================ */
  {
    id: 'ond-01',
    modulo: 'ondas',
    nivel: 'fácil',
    enunciado:
      'Uma onda se propaga numa corda com velocidade de 20 m/s e frequência de 5 Hz. Qual é o comprimento de onda?',
    dados: [
      { texto: 'v = 20 m/s', ok: true, why: '"velocidade de 20 m/s" — a unidade m/s já entrega que é velocidade.' },
      { texto: 'f = 5 Hz', ok: true, why: 'Hz é a unidade de frequência. Nunca de distância focal.' },
      { texto: 'λ = 20 m', ok: false, why: '20 é a velocidade. λ é o que a questão pede.' },
      { texto: 'T = 5 s', ok: false, why: '5 Hz é frequência. O período seria 1/5 = 0,2 s.' },
    ],
    alvo: [
      { texto: 'λ — o comprimento de onda', ok: true, why: 'É o que a pergunta pede.' },
      { texto: 'v — a velocidade', why: 'Já foi dada.' },
      { texto: 'f — a frequência', why: 'Também já foi dada.' },
      { texto: 'T — o período', why: 'Não foi pedido (mas dá para calcular: 0,2 s).' },
    ],
    formula: [
      { texto: 'v = λ · f', ok: true, why: 'É a fórmula que liga as três grandezas. Você tem duas e quer a terceira.' },
      { texto: 'T = 1/f', why: 'Dá o período, que não foi pedido.' },
      { texto: '1/f = 1/p + 1/p′', why: 'É de óptica. Aqui o "f" é frequência, e não tem espelho nenhum na questão.' },
      { texto: 'v = d/t', why: 'Velocidade média não usa as informações dadas (não há distância nem tempo aqui).' },
    ],
    substituicao: [
      { texto: '20 = λ · 5', ok: true, why: 'Coloque cada número no seu lugar e deixe a incógnita sozinha.' },
      { texto: 'λ = 20 · 5', why: 'Multiplicou quando devia dividir: λ está multiplicando o f, então passa dividindo.' },
      { texto: '5 = λ · 20', why: 'Trocou v com f.' },
      { texto: 'λ = 5/20', why: 'Dividiu ao contrário. O resultado (0,25) seria absurdamente pequeno.' },
    ],
    resposta: {
      valor: 4,
      unidade: 'm',
      passos: ['v = λ · f', '20 = λ · 5', 'λ = 20 / 5', 'λ = 4 m'],
    },
    significado: [
      { texto: 'Cada onda completa mede 4 metros — a distância de uma crista até a próxima.', ok: true, why: 'λ é uma distância, medida ao longo da corda.' },
      { texto: 'A onda percorre 4 metros por segundo.', why: 'Isso seria velocidade, que já é 20 m/s.' },
      { texto: 'Passam 4 ondas por segundo.', why: 'Isso seria frequência, que já é 5 Hz.' },
      { texto: 'Cada onda leva 4 segundos para passar.', why: 'Isso seria o período, que vale 0,2 s.' },
    ],
    licao: 'Identifique a grandeza pela UNIDADE: m/s é velocidade, Hz é frequência, m é comprimento, s é período. A unidade do enunciado quase sempre entrega quem é quem.',
  },

  /* ================================================================ */
  {
    id: 'ond-02',
    modulo: 'ondas',
    nivel: 'médio',
    enunciado:
      'Numa corda, uma onda tem período de 0,25 s e comprimento de onda de 2 m. Determine a velocidade de propagação.',
    dados: [
      { texto: 'T = 0,25 s', ok: true, why: 'Segundos = tempo de UMA onda = período.' },
      { texto: 'λ = 2 m', ok: true, why: 'Metros = tamanho de uma onda = comprimento de onda.' },
      { texto: 'f = 0,25 Hz', ok: false, why: 'Cuidado: 0,25 é o período. A frequência é o inverso: 1/0,25 = 4 Hz.' },
      { texto: 'v = 2 m/s', ok: false, why: '2 é o λ, não a velocidade. A velocidade é a incógnita.' },
    ],
    alvo: [
      { texto: 'v — a velocidade de propagação', ok: true, why: '"Determine a velocidade" não deixa dúvida.' },
      { texto: 'f — a frequência', why: 'É um passo intermediário útil (f = 4 Hz), não a resposta.' },
      { texto: 'λ', why: 'Já foi dado.' },
      { texto: 'T', why: 'Já foi dado.' },
    ],
    formula: [
      { texto: 'v = λ/T (ou calcular f = 1/T e usar v = λ·f)', ok: true, why: 'Como T = 1/f, as duas versões são a mesma fórmula. Use a que evita um passo.' },
      { texto: 'v = λ · T', why: 'Multiplicar pelo tempo daria uma unidade sem sentido (m·s).' },
      { texto: 'v = T/λ', why: 'Está invertida: daria s/m.' },
      { texto: 'v = 1/T', why: 'Isso é a frequência, não a velocidade.' },
    ],
    substituicao: [
      { texto: 'v = 2 / 0,25', ok: true, why: 'λ dividido pelo período.' },
      { texto: 'v = 2 · 0,25', why: 'Multiplicou em vez de dividir: daria 0,5, lento demais.' },
      { texto: 'v = 0,25 / 2', why: 'Inverteu a divisão.' },
      { texto: 'v = 2 · 4 · 0,25', why: 'Usou f e T ao mesmo tempo, contando o tempo duas vezes.' },
    ],
    resposta: {
      valor: 8,
      unidade: 'm/s',
      passos: [
        'Caminho 1: f = 1/T = 1/0,25 = 4 Hz → v = λ·f = 2 · 4 = 8 m/s',
        'Caminho 2 (direto): v = λ/T = 2/0,25 = 8 m/s',
      ],
    },
    significado: [
      { texto: 'A perturbação avança 8 metros a cada segundo ao longo da corda.', ok: true, why: 'Velocidade de propagação é o quanto a ONDA anda por segundo — não o quanto a corda anda.' },
      { texto: 'Cada pedacinho da corda anda 8 m por segundo para o lado.', why: 'A corda não viaja: ela só sobe e desce. Quem viaja é a perturbação.' },
      { texto: 'Passam 8 ondas por segundo.', why: 'Isso seria frequência; aqui ela vale 4 Hz.' },
      { texto: 'Cada onda mede 8 metros.', why: 'Isso é λ, que vale 2 m.' },
    ],
    licao: 'Quando a questão der o período, você tem dois caminhos equivalentes. Escolher v = λ/T economiza um passo e uma chance de errar.',
  },
];

export const MODULO_LABEL: Record<Questao['modulo'], string> = {
  espelhos: '🪞 Espelhos',
  lentes: '🔍 Lentes',
  ondas: '🌊 Ondas',
};
