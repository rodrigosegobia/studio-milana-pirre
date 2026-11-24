# Revisão editorial — prévia local

## Resultado

Prévia local apresentada e publicação autorizada pelo usuário em 24/11/2026. Os resultados abaixo registram a validação anterior à publicação.

A primeira dobra agora apresenta perfumaria e Nail Design em duas fotografias de escalas diferentes, com prioridade comercial da perfumaria e ações explícitas. A identidade existente permanece: logo original, paleta e fontes locais. O cabeçalho tem menor altura e quatro destinos principais; categorias e filtros continuam acessíveis.

A vitrine automática foi substituída por uma faixa manual com snap, controles e teclado. Não há produtos duplicados no DOM. O usuário pode comparar nomes, volumes e preços sem movimento involuntário. Promoções demonstrativas permanecem discretas; o preço atual continua usado pela sacola e checkout.

A faixa de marcas externas foi substituída por uma apresentação do próprio Studio Milana Pirre. O bloco institucional conecta os dois segmentos antes do editorial de unhas. A landing Nail Design foi refinada com hero mais compacto, galeria assimétrica, serviços e perfil provisório, sem agenda.

## Inspeção e correções

Capturas atuais em docs/screenshots/editorial. Inspecionados hero desktop/mobile, home completa, vitrine e landing Nail Design. Durante a inspeção foram corrigidos: altura mínima antiga que alongava o hero desktop, corte da logo no perfil mobile, palavras concatenadas ao esconder quebras de linha e desalinhamento entre preços com e sem promoção. A família olfativa e o volume saíram da fotografia para uma linha de informação própria.

O hero de ambas as páginas foi medido em 360, 390, 430, 640, 768, 1024 e 1440 px. As ações principais ficaram visíveis na primeira dobra, sem sobreposição da navegação inferior. Nenhum overflow horizontal do documento foi identificado. A vitrine usa rolagem horizontal contida e intencional.

## Testes

- 29 grupos de comércio aprovados: filtros, busca, galeria, quantidades, totais, remoção, checkout, HTTP, file:// e armazenamento bloqueado/malformado.
- 9 verificações compartilhadas aprovadas: navegação, nomes de diálogos, teclado, foco, contatos demonstrativos, links e confirmação.
- 14 grupos de landing/vitrine aprovados: seis páginas em quatro larguras, portfólio, retorno de foco, âncoras, redução de movimento, navegação manual, ausência de autoplay, preço promocional e redirecionamento legado.
- 12 cenários de fallback aprovados com o CDN bloqueado: HTTP mobile/desktop e file://, incluindo foto ampliada da galeria. As 60 falhas de rede provocadas foram recuperadas localmente; nenhum erro JavaScript ou falha local.

O teste de fallback passou a abrir a galeria antes de validar sua imagem: o elemento vazio de um diálogo fechado não representa uma fotografia quebrada.

## Avaliação crítica e limites

A hierarquia comercial está mais clara, a primeira dobra já apresenta os dois segmentos e a marca assume a narrativa. A navegação manual melhora a leitura dos produtos. O resultado não deve ser considerado identidade comercial definitiva: fotografias de referência ainda se repetem entre fragrâncias, e faltam retrato, biografia, catálogo e portfólio oficiais. Essas lacunas estão identificadas na interface e não foram preenchidas com informações inventadas.

Verificação em Chrome headless e capturas, sem aparelho físico, Safari, Firefox ou leitor de tela real. Não há backend de pagamentos/pedidos nem painel de edição de portfólio. Nenhuma imagem foi gerada, nenhuma tecnologia foi migrada e não foram adicionadas dependências.
