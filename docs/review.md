# Revisão mobile — 24/11/2026

## Motivo e referência

A composição anterior foi rejeitada pelo usuário por escala inadequada e experiência ruim no celular. A nova direção segue a estrutura observada em https://www.carolinaherrera.com/br/pt: campanha de ponta a ponta, cabeçalho sobre a fotografia, títulos sans curtos, links sublinhados, categorias horizontais e apresentação compacta da loja.

Mantidos logo, arquivos de fonte, paleta base, fotografias reais, fallbacks e funcionalidades. Sem imagens geradas ou dependências novas.

## Alterações e correções

- Home de aproximadamente 4.300 para 2.080 px de altura em 390 px de largura.
- Cabeçalho de 72 px mobile; navegação inferior fixa retirada.
- Hero limitado a 480 px; imagens de produto em torno de 187 px no mobile de 390 px. Nail Design na home: 260 px; hero da landing: 200 px.
- Portfólio em duas colunas no celular, com ampliação por toque.
- Títulos, espaços e rodapé reduzidos; catálogo sem fotografia de abertura.
- Removida a lógica que deixava seções com opacidade quase zero até a interseção de scroll.
- CSS e app.js com versão na URL para evitar apresentação híbrida com arquivos antigos em cache.
- Galeria de produto com altura controlada e fotografia inteira, sem corte por cover.

## Verificação

- 29 grupos de comércio aprovados.
- 9 verificações compartilhadas de navegação e diálogos aprovadas.
- 14 grupos da landing e vitrine aprovados.
- 12 cenários de fallback com CDN bloqueado aprovados; 54 falhas provocadas recuperadas localmente.
- 9 grupos adicionais de mobile aprovados: seis rotas em 320×667, 360×740, 390×844, 430×932, 844×390, 768×1024 e 1440×900; limites de imagens, conteúdo visível e ausência de overflow indevido.
- Gestos de toque em Chrome emulado: menu, busca, swipe da vitrine, navegação anterior, produto promocional na sacola e ampliação/fechamento de fotografia com retorno de foco.
- Zero erros JavaScript nas verificações. git diff --check aprovado.

Capturas visuais em docs/screenshots/mobile-reset. Inspecionadas home, Nail Design, catálogo e produto em mobile e desktop. A emulação não substitui um teste em aparelho físico ou Safari real.

## Avaliação e publicação

A página ficou substancialmente mais curta e a navegação mais próxima do modelo solicitado. O hero conserva fotografia com destaque, mas com limite de altura no celular. A identidade final continua limitada por fotografias ilustrativas repetidas, perfil provisório e catálogo fictício.

Prévia local apresentada. Publicação desta revisão autorizada pelo usuário em 24/11/2026.
