---
name: "Studio Milana Pirre"
description: "Storefront de beleza com campanha fotográfica e navegação compacta no celular."
colors:
  ink: "#171717"
  gold: "#B79A64"
  champagne: "#E9DDC9"
  paper: "#FFFFFF"
  muted: "#67625b"
  line: "#dedbd6"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
---

# Direção vigente — revisão mobile de 24/11/2026

Esta direção substitui a composição editorial anterior, rejeitada pelo usuário após a publicação. Referência expressamente escolhida: https://www.carolinaherrera.com/, inspecionada na versão /br/pt em 390 × 844 e 1440 × 900. Não há reutilização de logotipo, textos, scripts ou código proprietário da referência.

## Composição

- Campanha fotográfica de ponta a ponta, título curto centralizado sobre a fotografia e links sublinhados. Cabeçalho sobreposto na home, com menu, logo original, busca e sacola.
- A home não tem faixa superior: a foto começa na borda da tela e o cabeçalho é sobreposto. Nas páginas internas, cabeçalho preto e logo branca original, com a faixa demonstrativa existente. Cabeçalho de 72 px no celular e 84 px em desktop.
- Categorias em uma faixa horizontal; vitrine manual com dois produtos visíveis no celular, três no tablet e quatro no desktop.
- Hero da home com 100svh, preenchendo a tela de entrada. Texto e CTAs reservam espaço para a barra inferior e a área segura do aparelho.
- Campanha Nail Design com texto sobreposto e banner preto de 280 px no celular, antes da perfumaria; sem o antigo bloco institucional.
- Barra inferior fixa restaurada no mobile, com Início, Perfumes, Nail Design e Sacola; reservados espaço no rodapé e afastamento para foco e avisos.

## Identidade e tipografia

O arquivo assets/images/logo.png permanece original. Manrope, já local ao projeto, conduz títulos e operação. Bodoni Moda permanece disponível para componentes existentes; não há troca de arquivos de fonte ou novas dependências.

Home: título mobile de 25,6 px; títulos de seção entre 20 e 24 px. Produtos: nome de 14 px, preço de 13 px e metadados de 11 px no celular. Inputs conservam 16 px para evitar zoom de formulário. Alvos interativos principais têm pelo menos 44 px.

Preto e branco conduzem navegação e ações. Champanhe aparece nas promoções; dourado fica restrito aos estados existentes. O degradê escuro das campanhas serve ao contraste do texto branco sobre fotografias.

## Produtos e Nail Design

Fotografias de produto em proporção 1:1,08 (aproximadamente 187 px de altura em tela de 390 px). Etiquetas diagonais de promoção e preço anterior continuam ativos; cálculos usam o preço atual.

Nail Design apresenta quatro serviços em blocos próprios, com descrição e detalhes expansíveis; depois, uma caixa de apresentação profissional com retrato/placeholder, biografia, áreas de atuação e links. Perfil ainda provisório, sem informações pessoais inventadas. Hero de 200 px no celular; portfólio em duas colunas com fotos de cerca de 182 px. A ampliação por toque preserva o acesso à fotografia completa. Não há agendamento.

O catálogo abre diretamente em título, categorias, busca e filtros. A fotografia decorativa de abertura foi removida. A galeria da página de produto tem altura de 280 px no celular, com imagem contida.

## Comportamento

A faixa de produtos usa rolagem horizontal nativa, snap e teclas de direção, sem contador ou botões de setas. Não há reprodução automática. Ao sair da abertura, a fotografia suaviza e a descoberta ganha nitidez de blur(5px)/opacity .55 até blur(0)/opacity 1. O foco torna o conteúdo nítido; prefers-reduced-motion remove blur/fade. Sem JavaScript, os estilos padrão deixam tudo visível.

O hero apresenta Milana, o serviço fotografado e os seis perfumes fornecidos, nessa ordem. Trocas automáticas a cada 7,5 segundos, com sobreposição em fade de 2 segundos: a imagem anterior permanece opaca até a próxima cobri-la. Não há setas, contagem ou botão de pausa, conforme pedido explícito do usuário. O movimento para fora da tela, em outra aba, durante foco nos links do hero ou preferência de movimento reduzido. Apenas a próxima foto é antecipada e decodificada antes da troca. Em telas largas as fotografias verticais conservam o enquadramento, com texto ao lado; no celular ocupam a abertura inteira. Nail Design vem depois, antes das categorias e da vitrine de perfumes. O banner Nail Design encosta diretamente no hero, sem faixa ou espaçamento. Tem fundo preto em largura total, fotografia servico1.jpeg levemente desfocada e reduzida em opacidade, com título, descrição e links nítidos sobrepostos. Mede 280 px no celular e até 340 px no desktop. O bloco “Dois universos. Uma identidade.” foi removido a pedido do usuário.

“Encontre seu perfume” antecede a faixa de categorias, reunindo título, navegação e vitrine em uma única seção.

A landing de Nail Design usa o retrato fornecido de Milana Pirre e a fotografia servico1.jpeg. O portfólio distingue essa fotografia das duas imagens de inspiração, inclusive na ampliação. A biografia completa permanece pendente, sem inventar trajetória profissional.

CSS e app.js usam identificador de versão nas URLs para impedir a mistura de HTML novo com estilos antigos em cache. Caminhos continuam relativos e compatíveis com GitHub Pages.

## Conteúdo e limites

Fotografias fornecidas pelo usuário são servidas localmente. As referências externas mantêm cópias locais de fallback. Os seis perfumes novos têm nomes e marcas identificados, com valores e volumes demonstrativos aprovados pelo usuário; os itens fictícios anteriores permanecem no catálogo. O perfil já apresenta nome e retrato de Milana. O portfólio identifica separadamente a fotografia do serviço e as imagens de inspiração. Checkout demonstrativo; sem backend de pedidos/pagamentos nem painel de postagem.

Capturas atuais: docs/screenshots/mobile-reset/ e docs/screenshots/scroll-nav/. Testes de gesto e escala: tests/test_mobile.py. Publicação destes ajustes aprovada pelo usuário em 24/11/2026.
