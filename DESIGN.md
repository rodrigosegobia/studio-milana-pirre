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
- Faixa superior preta de 28 px identifica os dois segmentos e a demonstração. Cabeçalho de 72 px no celular e 84 px em desktop. Nas páginas internas é branco, com a mesma logo exibida em preto por CSS.
- Categorias em uma faixa horizontal; vitrine manual com dois produtos visíveis no celular, três no tablet e quatro no desktop.
- Hero mobile entre 390 e 480 px (55svh), limitado a 330 px na orientação horizontal curta. A referência usa campanha maior; o limite responde à reclamação de imagens gigantes.
- Campanha Nail Design de 260 px no celular, seguida de mensagem institucional curta.
- Sem barra inferior fixa. Sem seções que dependem de animação para ficarem visíveis.

## Identidade e tipografia

O arquivo assets/images/logo.png permanece original. Manrope, já local ao projeto, conduz títulos e operação. Bodoni Moda permanece disponível para componentes existentes; não há troca de arquivos de fonte ou novas dependências.

Home: título mobile de 25,6 px; títulos de seção entre 20 e 24 px. Produtos: nome de 14 px, preço de 13 px e metadados de 11 px no celular. Inputs conservam 16 px para evitar zoom de formulário. Alvos interativos principais têm pelo menos 44 px.

Preto e branco conduzem navegação e ações. Champanhe aparece nas promoções; dourado fica restrito aos estados existentes. O degradê escuro das campanhas serve ao contraste do texto branco sobre fotografias.

## Produtos e Nail Design

Fotografias de produto em proporção 1:1,08 (aproximadamente 187 px de altura em tela de 390 px). Etiquetas diagonais de promoção e preço anterior continuam ativos; cálculos usam o preço atual.

Nail Design mantém portfólio, quatro serviços e perfil provisório. Hero de 200 px no celular; portfólio em duas colunas com fotos de cerca de 182 px. A ampliação por toque preserva o acesso à fotografia completa. Não há agendamento.

O catálogo abre diretamente em título, categorias, busca e filtros. A fotografia decorativa de abertura foi removida. A galeria da página de produto tem altura de 280 px no celular, com imagem contida.

## Comportamento

A faixa de produtos usa rolagem horizontal nativa, snap, setas e teclado. Não há reprodução automática. As transições se limitam a controles e zoom discreto de fotos, com prefers-reduced-motion respeitado.

CSS e app.js usam identificador de versão nas URLs para impedir a mistura de HTML novo com estilos antigos em cache. Caminhos continuam relativos e compatíveis com GitHub Pages.

## Conteúdo e limites

Fotos reais por URLs externas com cópias locais de fallback. Produtos e valores fictícios, perfil ainda sem dados oficiais e portfólio identificado como referência. Checkout demonstrativo; sem backend de pedidos/pagamentos nem painel de postagem.

Capturas atuais: docs/screenshots/mobile-reset/. Testes de gesto e escala: tests/test_mobile.py. Publicação desta revisão aprovada pelo usuário em 24/11/2026, após apresentação local.
