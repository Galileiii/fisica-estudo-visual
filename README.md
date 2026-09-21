# 🔭 FÍSICA VISUAL

**Aprenda Física vendo ela acontecer.**

Aplicativo web interativo de Óptica e Ondulatória para o 2º ano do Ensino Médio.
Nada aqui é apostila digital: cada conceito nasce de um simulador que o aluno
arrasta, gira e observa — a fórmula só aparece depois, como ferramenta.

---

## Como abrir

### Jeito mais fácil (Windows, sem terminal)

Dê dois cliques em **`ABRIR FISICA VISUAL.bat`**, na pasta do projeto.
Uma janela preta abre e o navegador vai sozinho para o app.
Deixe a janela preta aberta enquanto estiver estudando; para fechar o app, feche
essa janela.

### Jeito ainda mais simples (arquivo único, sem terminal nenhum)

Dê dois cliques em **`dist/index.html`**. É o app inteiro dentro de um arquivo
só — funciona offline, sem instalar nada e sem janela preta.
(Use esse modo para estudar; use o `.bat` quando for mexer no código, porque
só o modo `dev` recarrega sozinho ao editar.)

Se você editar o código e quiser atualizar esse arquivo único:

```bash
npm run build
```

### Pelo terminal

Requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

O navegador abre em `http://localhost:5173`. Para parar, `Ctrl + C`.

Outros comandos:

```bash
npm run build      # gera o arquivo único dist/index.html
npm run preview    # serve a versão de produção
npm run typecheck  # checa os tipos TypeScript
```

---

## O que tem dentro

### 🏠 Dashboard
Os três módulos com barra de progresso, mais três medidores:
**🎯 Domínio geral** (lições concluídas), **🧠 Interpretação** (acertos nas
perguntas de leitura) e **🧮 Cálculos** (acertos nas contas). Tudo fica salvo no
navegador (`localStorage`) e pode ser zerado num clique.

### 🪞 Espelhos — 7 lições
1. **Reflexão** — slider de ângulo com `i = r` ao vivo, botão "Por que isso acontece?" e comparação espelho liso × parede áspera.
2. **Espelho plano** — objeto arrastável, imagem acompanhando, réguas de objeto→espelho, espelho→imagem e objeto→imagem em tempo real.
3. **Imagem real e virtual** — animação com fótons percorrendo os raios e o teste da folha de papel (a real projeta, a virtual não).
4. **Espelhos esféricos** — alternância côncavo/convexo com V, F e C marcados.
5. **Foco e raio de curvatura** — feixe do "Sol" convergindo em F, slider de R com `f = R/2` recalculado no desenho.
6. **Formação de imagens no côncavo** — as cinco regiões (além de C, em C, entre C e F, em F, entre F e o espelho) com natureza, orientação e tamanho automáticos.
7. **Equação dos espelhos** — primeiro as distâncias no desenho, depois `1/f = 1/p + 1/p′` e `A = −p′/p = h′/h` resolvidas linha a linha com os valores atuais.

### 🔍 Lentes — 5 lições
Refração e lei de Snell (com reflexão total), lente convergente, lente
divergente, equação de Gauss aplicada a lentes e vergência (`V = 1/f`) com
simulador de miopia e hipermetropia.

### 🌊 Ondas — 6 lições
O que é uma onda (transversal × longitudinal), anatomia (amplitude, λ, crista,
vale), frequência e período, `v = λ · f`, onda mudando de meio (o que muda e o
que não muda) e interferência construtiva/destrutiva.

### 🧩 Decifre a Questão
O modo principal de treino. Em vez de pedir a resposta, conduz pelos 6 passos:

1. O que a questão me deu? (marcar os dados reais entre distratores)
2. O que ela quer descobrir?
3. Qual fórmula conecta essas informações?
4. Substitua os valores
5. Resolva (com resolução comentada disponível)
6. O que o resultado significa?

São 8 questões (espelhos, lentes e ondas), cada uma com explicação de **por que**
cada alternativa está certa ou errada — inclusive as erradas.

### 🗺️ Mapa de fórmulas
As provas fornecem as fórmulas; o difícil é saber qual usar. Esta página lista
cada fórmula com as palavras do enunciado que a denunciam, os erros clássicos e
a tabela de sinais completa.

---

## Decisões de ensino

- **Nenhuma palavra técnica sem explicação.** Termos pontilhados (foco, imagem
  virtual, frequência, vergência…) abrem um balão explicando em linguagem comum.
  O glossário está em `src/content/glossary.ts`.
- **Visual antes de fórmula.** Toda lição começa pelo fenômeno e só depois
  apresenta a equação como ferramenta.
- **O sinal conta uma história.** `p′ < 0` não é erro de conta: é imagem virtual.
  Isso é repetido em cada módulo até virar reflexo.
- **Errar faz parte.** Toda alternativa errada tem uma explicação do motivo do
  erro, porque o erro costuma ser de leitura, não de matemática.

---

## Estrutura do projeto

```
src/
  lib/optics.ts        motor de física (Gauss, Snell, ondas) + formatação
  lib/hooks.ts         arraste em SVG, relógio de animação, estado persistente
  state/progress.tsx   progresso, habilidades e questões resolvidas
  components/          UI (cartões, sliders, quizzes, termos) e peças SVG
  sims/                as 18 lições com seus simuladores
  pages/               dashboard, módulo, lição, decifre, mapa de fórmulas
  content/             currículo, glossário e banco de questões
```

Para adicionar uma lição: crie o componente em `src/sims/` e registre-o em
`src/content/curriculum.ts`. Para adicionar uma questão ao modo Decifre, basta
acrescentar um objeto em `src/content/questoes.ts`.

---

## Stack

React 18 + TypeScript + Vite. CSS moderno (custom properties, `clamp()`,
`color-mix()`) com tema claro e escuro. Todos os diagramas são SVG desenhados a
partir das equações — não há imagens estáticas nem dependências de animação.
