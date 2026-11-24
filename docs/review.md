# Revisão — barra fixa, abertura e Nail Design

Ajustes locais solicitados após a última publicação, em 24/11/2026.

## Resultado

- Barra inferior mobile restaurada com quatro destinos, contagem da sacola, área segura e reserva de espaço para rodapé, foco e avisos.
- Home sem a faixa superior demonstrativa. Abertura em 100svh, imagem desde a borda superior e ações acima da barra inferior.
- Vitrine sem contador e sem botões de setas; navegação por deslize e teclas de direção preservada.
- Ao rolar, a fotografia da abertura suaviza e a descoberta ganha nitidez gradualmente. Valores registrados: blur de 5 px até 0 e opacidade de .55 até 1. Foco deixa a área nítida; redução de movimento mantém tudo estático e claro.
- Páginas internas com cabeçalho preto e logo branca original.
- Nail Design com quatro serviços organizados em blocos, descrição e informações expansíveis. Caixa profissional com área para retrato, identificação, biografia, especialidades e ações. Sem agendamento e sem dados pessoais inventados.

## Validação

- 29 grupos comerciais aprovados: busca, filtros, quantidades, sacola, checkout e armazenamento.
- 9 verificações de navegação e diálogos aprovadas.
- 14 grupos de landing, portfólio, promoções e vitrine aprovados.
- 12 cenários de fallback de imagens aprovados.
- 12 grupos de mobile, toque, serviços e scroll aprovados, incluindo seis rotas em 320×667, 360×740, 390×844, 430×932, 844×390, 768×1024 e 1440×900.
- Altura total da abertura, ausência de faixa na home, ações acima da navegação, teclado e foco na descoberta verificados. Nenhum overflow horizontal indevido ou erro de JavaScript detectado.
- git diff --check aprovado.

Capturas em docs/screenshots/mobile-reset e docs/screenshots/scroll-nav. Movimento comparado em quatro posições de scroll, com e sem redução de movimento. A ferramenta interna motion-capture não existe na versão instalada; foram usados Chrome e Playwright para obter frames e medições equivalentes. Revisão independente aprovou a continuidade visual nos estados capturados, sem inferir FPS ou desempenho em aparelho físico. A apresentação de Nail Design também foi revisada visualmente em mobile e desktop.

## Limites e publicação

Retrato, nome e biografia oficiais continuam pendentes. A logo ocupa esse espaço provisoriamente; o componente aceita os dados já previstos em data.js e recupera o placeholder se o retrato falhar. Fotografias e catálogo continuam demonstrativos.

Validação em Chrome emulado, sem Safari ou aparelho físico. Nenhuma imagem foi gerada e nenhuma dependência foi adicionada.

Prévia local apresentada e publicação dos ajustes autorizada pelo usuário em 24/11/2026.
