---
name: "Studio Milana Pirre"
description: "Boutique editorial de perfumaria e Nail Design, com operação clara no celular."
colors:
  ink: "#171717"
  gold: "#B79A64"
  champagne: "#E9DDC9"
  paper: "#FAF9F6"
  white: "#FFFFFF"
  muted: "#67625b"
  line: "#dcd6cc"
  control-line: "#91887a"
  focus: "#8a6a35"
  action-hover: "#39332b"
  hero-surface: "#eee7dc"
  product-surface: "#eee9df"
  commerce-surface: "#f0ebe2"
  booking-surface: "#eee8de"
  error: "#9c2c20"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2.5rem,5vw,4.5rem)"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2rem,4vw,3.25rem)"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.14
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  square: "0"
  circle: "50%"
spacing:
  gap-small: "8px"
  gap-control: "12px"
  gap-medium: "16px"
  panel: "24px"
  gap-large: "28px"
  page-mobile: "22px"
  page-tablet: "32px"
  page-desktop: "48px"
  section-mobile: "56px"
  section-tablet: "72px"
  section-desktop: "88px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  category-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.65rem 1rem"
  category-tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  commerce-summary:
    backgroundColor: "{colors.commerce-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "1.5rem"
  booking-service:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "20px"
  booking-service-selected:
    backgroundColor: "{colors.booking-surface}"
    textColor: "{colors.ink}"
  calendar-day:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  calendar-day-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  booking-time:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "10px 8px"
  booking-time-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  booking-progress:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "14px 4px 18px"
---

# Design System: Studio Milana Pirre

## Overview

**Creative North Star: "Luxury Beauty Boutique / Premium Mobile Commerce"**

A direção já estabelecida combina fotografia editorial de beleza com uma operação comercial sóbria. Bodoni Moda dá caráter aos títulos; Manrope mantém preços, filtros, navegação e formulários legíveis. Preto, dourado, champanhe e off-white formam a identidade confirmada, com áreas generosas de imagem e superfícies planas.

O acabamento depende de fotografia, ritmo e tipografia. A identidade usa o arquivo branco original `assets/images/logo.png`, sobre fundo preto; não se recria o logotipo com texto. As fotografias reais do Pexels mostram frascos âmbar, fundos azuis, composições geométricas e flores; Nail Design usa referências nude com pérolas e francesinha. Esses tons fotográficos complementam a paleta da interface. As fotos são referências ilustrativas, não evidência do catálogo ou do trabalho do studio. A referência editorial orienta a hierarquia, sem reproduzir a identidade de outra marca.

**Key Characteristics:**

- Títulos serifados leves e interface sem serifa.
- Ações pretas, detalhes dourados e fundos claros quentes.
- Fotografia editorial ampla, cartões abertos e divisórias finas.
- Controles retangulares, foco visível e navegação própria para celular.
- Fontes locais e fotografias reais por URL, com cópias locais para fallback offline.

Este documento registra a implementação em `assets/css/styles.css`, `commerce.css` e `booking.css`, incluindo seus ajustes finais. O frontmatter é a referência normativa dos tokens reutilizados; a composição específica da página inicial permanece em `docs/direction.md`.

## Colors

A paleta combina preto de leitura e ação com dourado pontual, champanhe e uma família de superfícies claras quentes.

### Primary

- **Dourado (`gold`)**: detalhes da identidade, indicadores da navegação, data atual e interação de horários; não é a cor de fundo dos botões principais.

### Neutral

- **Preto (`ink`)**: texto principal, cabeçalho, rodapé, ações e seleções ativas.
- **Champanhe (`champagne`)**: faixa de anúncio, composição editorial de Nail Design e destaques suaves.
- **Off-white (`paper`)**: fundo da página, navegação e diálogos.
- **Branco (`white`)**: campos e texto invertido sobre preto.
- **Cinza quente (`muted`)**: texto auxiliar, descrições, legendas e metadados.
- **Linha suave (`line`)**: divisórias e contornos estruturais.
- **Linha de controle (`control-line`)**: contorno mais escuro de inputs, selects e textareas, inclusive busca e checkout. Este token incorpora o ajuste final de contraste.
- **Bronze de foco (`focus`)**: contorno de navegação por teclado.
- **Preto aquecido (`action-hover`)**: resposta do botão principal ao ponteiro.
- **Fundos editoriais (`hero-surface`, `product-surface`)**: painel do hero, confirmação de inclusão e áreas de fotografia de produto.
- **Fundos de resumo (`commerce-surface`, `booking-surface`)**: resumos comerciais, agendamento, confirmações e seleção de serviço.

O token funcional `error` comunica erro no checkout. Ele não participa da paleta editorial.

**The Action Rule.** A ação principal e a seleção ativa usam preto com texto claro; o dourado permanece nos detalhes.

## Typography

**Display Font:** Bodoni Moda, com Georgia e serif como alternativas. A fonte local está em `assets/fonts/bodoni-moda-latin.woff2`, declarada para pesos de 400 a 500, estilo normal.

**Body Font:** Manrope, com Arial e sans-serif como alternativas. A fonte local está em `assets/fonts/manrope-latin.woff2`, declarada para pesos de 400 a 700, estilo normal. Ambas usam `font-display: swap`. O arquivo itálico presente nos assets não é carregado pelo CSS atual.

Os títulos têm contraste tipográfico, peso leve e espaçamento ligeiramente fechado. A interface mantém caixa de frase e números tabulares para valores, quantidades, durações e horários. Não há escala modular única: os tamanhos respondem ao papel de cada componente.

- **Display, headline e title**: hierarquia base dos títulos no frontmatter; quebras equilibradas e peso regular. O hero possui suas próprias medidas responsivas, e títulos de produto e agendamento usam ajustes locais.
- **Body**: leitura principal; parágrafos globais limitados a 75 caracteres de largura. O hero, a introdução de Nail Design e as introduções de seção usam corpo de 1rem após a revisão visual.
- **Label**: botões principais; rótulos de campos e muitos controles usam tamanho equivalente com peso regular.
- **Caption**: avisos de demonstração e apoio. Famílias de produto, valores auxiliares e atalhos inferiores usam 0.75rem no CSS final. Algumas legendas de imagem e metainformações do shell permanecem em 0.6875rem.
- **Título de produto em grade**: 1.18rem no celular, 1.6rem a partir de 640px e 1.85rem a partir de 900px. Não aplicar a medida de um hero a cartões de catálogo.

**The Two Voices Rule.** Bodoni Moda conduz a expressão editorial; Manrope conduz a operação.

## Layout

O container central tem largura máxima de 1280px e desconta duas margens laterais. As margens são 22px na base, 32px a partir de 640px e 48px a partir de 900px. As seções gerais usam espaçamento vertical de 56px, 72px e 88px nesses mesmos intervalos; páginas operacionais ajustam esse ritmo conforme o conteúdo.

| Condição implementada | Comportamento |
| --- | --- |
| Até 480px | Ações do hero de Nail Design empilham; setas do portfólio ficam ocultas; calendário reduz padding; resumo de agendamento esconde sua fotografia. |
| Até 639px | Resumo do checkout precede o formulário; cabeçalho de comércio empilha; preço e ação do cartão podem quebrar linha. |
| A partir de 640px | Grade geral passa de duas para três colunas; catálogo mantém duas; serviços e horários ganham mais colunas; margens intermediárias. |
| A partir de 900px | Navegação desktop aparece e barra inferior móvel desaparece; hero e editorial da home ficam em duas colunas; margens e seções aumentam. |
| A partir de 960px | Catálogo ganha filtros laterais e três colunas; produto, sacola, checkout, Nail Design e agendamento assumem layouts amplos; resumos e galerias passam a sticky. |
| A partir de 1440px | Hero da home cresce para altura mínima de 620px, com título de 4.7rem e navegação mais espaçada. |

A grade base de produtos tem duas colunas e espaçamento de 28px por 14px. A seleção da home mostra dois produtos no celular e três a partir de 640px. O catálogo chega a três colunas a partir de 960px; os relacionados chegam a quatro. Fotografias de cartões usam proporção 4:5; a seleção desktop da home usa 1:1.08. As galerias de produto e Nail Design permitem deslizar horizontalmente, com encaixe por imagem.

A navegação inferior móvel tem quatro destinos, altura de 64px acrescida da área segura do dispositivo e estado ativo indicado por texto escuro e linha superior. O conteúdo reserva 68px inferiores; o documento também aplica afastamento de rolagem para que os controles focados permaneçam acessíveis. O cabeçalho é um bloco normal do fluxo, não um cabeçalho sticky.

No desktop, filtros de catálogo usam posição sticky a 170px do topo, galeria de produto a 155px, resumo comercial a 160px e resumo de agendamento a 130px. Essas posições são da implementação atual, não uma escala global de espaçamento.

A página inicial dá maior destaque visual à perfumaria, conforme o briefing; sua composição é descrita em `docs/direction.md`. Esse requisito da home não reduz a presença editorial na página própria de Nail Design.

## Elevation & Depth

O sistema é predominantemente plano. Separação vem de fundos quentes, espaço, imagem e linhas finas; cartões de produto não têm caixa elevada. Diálogos usam um backdrop preto translúcido (`rgba(23,23,23,.6)`), sem blur. A única sombra recorrente observada é a do aviso transitório: `0 5px 20px #0002`.

**The Flat Surface Rule.** Preserve as superfícies planas e a separação tonal; reserve a sombra existente ao aviso transitório.

As transições de cor e contorno duram 0.18s com `ease`. A imagem do cartão amplia para 1.025 em 0.4s; o aviso entra com opacidade e deslocamento vertical de 10px em 0.2s. A preferência `prefers-reduced-motion: reduce` desativa animações e transições e torna a rolagem imediata.

## Shapes

Botões, campos, fotografias, resumos e opções de serviço têm cantos retos. Os círculos se restringem aos contadores de sacola, números de etapas e símbolos de confirmação. Linhas estruturais são de 1px; foco global é de 2px com afastamento de 4px. O estado atual da etapa usa linha de 2px; a navegação desktop usa traço dourado de 1px.

Ícones são SVG de traço fino. O tamanho geral é 22px, com variações de 15px a 27px conforme o controle. A área de ação costuma ser maior que o desenho: botões de ícone e ações compactas têm pelo menos 44px. Botões principais têm altura mínima de 50px; campos gerais, 48px; horários, 46px. No calendário, o CSS base permite 40px, com 44px até 480px e a partir de 640px.

## Components

### Buttons

Ações diretas, retangulares e com rótulo claro. O principal usa preto e texto branco; o secundário é transparente com contorno preto. Ambos partem de padding de 14px por 24px e altura mínima de 50px. O hover do principal aquece o preto; o secundário inverte para preto e branco. Desabilitados reduzem opacidade para 0.45 na base ou 0.4 nos fluxos comerciais e de agendamento. Links de texto são sublinhados e constituem uma alternativa de menor ênfase.

### Inputs / Fields

Campos brancos, retangulares, com contorno `control-line`, padding de 12px e rótulo acima. Busca de catálogo e checkout mantêm o mesmo contorno final. O foco por teclado usa o anel global bronze, sem remover o contorno do campo. Placeholders e ajuda usam `muted`; erros do checkout usam `error`. Checkboxes e rádios nativos têm acento preto. Não há um tratamento visual próprio de campo inválido além da mensagem implementada.

### Navigation

O cabeçalho preto apresenta o logo branco original centralizado, busca à esquerda e sacola à direita. Em telas amplas, a navegação fica em faixa off-white abaixo do cabeçalho, com texto pequeno e indicador dourado. No celular, menu lateral e barra inferior de quatro destinos dão acesso aos percursos. Busca e sacola mantêm alvos de 44px; o menu lateral usa títulos Bodoni Moda e ocupa até 90% da largura, limitado a 380px.

### Chips / Tabs

Categorias são retangulares. Na home, links têm contorno e hover preto; no catálogo, abas horizontais usam fundo transparente, contorno revelado no hover e preenchimento preto quando `aria-pressed` é verdadeiro. As abas têm altura mínima de 44px e podem rolar horizontalmente. Não arredondar para formato de pílula.

### Cards / Containers

Produtos são cartões abertos: foto, família, nome, preço demonstrativo e ação compacta de adicionar. O texto fica fora da imagem e o volume aparece em etiqueta clara sobre ela. Não há sombra ou contorno envolvendo todo o produto. Resumos comerciais usam `commerce-surface` e padding de 24px na base, 32px a partir de 640px. Resumos de agendamento usam `booking-surface`, com divisórias internas e hierarquia de título serifado e valores sem serifa.

### Booking Service, Calendar & Progress

Opções de serviço são rádios apresentados como blocos de contorno fino. A seleção usa fundo quente, contorno bronze (`#8a7350`) e check; o foco do rádio gera contorno preto ao redor do bloco. As etapas usam números circulares, linha inferior e rótulos; a etapa atual e as concluídas preenchem o número de preto.

O calendário usa sete colunas. Hoje recebe contorno dourado; a data selecionada e o horário selecionado recebem preto e branco. Hover de dia usa champanhe; hover de horário destaca a borda dourada. Datas indisponíveis têm texto claro e não são acionáveis. Horários usam três colunas na base e quatro a partir de 640px.

### Dialogs & Feedback

Diálogos off-white têm cantos retos, largura máxima de 560px, padding de 24px na base e 36px em desktop, com rolagem interna quando necessário. O aviso transitório preto tem texto claro e é posicionado acima da navegação móvel; em desktop fica no canto inferior direito. Confirmações usam símbolo circular e resumo tonal. Conteúdo ilustrativo e transações simuladas continuam identificados no contexto em que aparecem.

## Do's and Don'ts

### Do:

- **Do** preservar o logo branco original sobre o fundo preto.
- **Do** usar Bodoni Moda nos títulos e Manrope nos controles e dados.
- **Do** usar o contorno `control-line` nos campos e manter o foco visível.
- **Do** usar fotografias reais por URL com fallback local, preservando créditos, enquadramentos e identificação de referência ilustrativa.
- **Do** preservar a leitura e as ações confortáveis no celular, verificando 360px, 390px, 430px e desktop.
- **Do** respeitar a preferência por movimento reduzido e os estados de seleção acessíveis.

### Don't:

- **Don't** substituir a paleta confirmada ou reconstruir o logo com texto.
- **Don't** aplicar Liquid Glass, blur decorativo ou elevação aos cartões abertos.
- **Don't** transformar botões, campos e categorias em pílulas arredondadas.
- **Don't** usar dourado como preenchimento padrão da ação principal.
- **Don't** copiar a identidade de marcas de referência nem substituir as fotos reais por imagens geradas.
- **Don't** remover avisos de demonstração ou apresentar imagens e informações fictícias como prova real.
