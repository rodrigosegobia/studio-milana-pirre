# Direção e arquitetura

## Direction contract
THESIS: uma boutique de beleza que começa na descoberta de fragrâncias e conduz à sacola ou ao cuidado com as unhas.
OWN-WORLD: paleta fornecida, Bodoni Moda editorial e Manrope para operação; preto nas ações, dourado nos detalhes e champanhe nas superfícies; fotografias reais de perfume com frascos âmbar, fundos azuis, geometria e flores, além de referências nude com pérolas e francesinha; cantos retos, sem cartões decorativos.
STORY: descobrir um perfume, examinar suas notas e concluir a simulação; ou explorar o perfil, os serviços e o portfólio.
FIRST VIEWPORT: marca centralizada, navegação clara, imagem editorial de perfume ocupando a maior área e título em painel off-white à esquerda; no celular imagem e título compactos com ação de compra visível. Nail Design aparece em composição editorial própria a seguir.
FORM: plataforma comercial com shell compartilhado e seis páginas operacionais. seed: none (pinned), “Luxury Beauty Boutique / Premium Mobile Commerce”.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Arquitetura
Início → Perfumaria → Produto → Sacola → Checkout → confirmação na própria página.
Início → Nail Design → portfólio, perfil e serviços na mesma landing page. O endereço antigo da agenda redireciona ao portfólio.
Links reais entre HTMLs; scripts clássicos permitem file://. Estado local com fallback sessionStorage e window.name quando ambos bloqueados. Contatos vazios abrem mensagem demonstrativa em diálogo.
Fotografias reais do Pexels usam URL primária e cópia local da mesma foto como fallback offline. Fontes, estilos e scripts são locais. A orientação final exclui imagens geradas; ASSETS.md registra fontes e créditos.

## Revisão da proposta
A indicação automática de Liquid Glass da busca de design foi descartada por não corresponder à boutique do briefing. A referência visual foi estudada para hierarquia de campanhas e acesso ao catálogo, sem reproduzir conteúdo, identidade ou promoções. Não haverá provas sociais inventadas. O acabamento depende de fotografia, ritmo e tipografia, não de efeitos.

## Revisão da landing page
A identidade existente é preservada. A galeria lidera a descoberta, com ampliação de fotografias; o perfil utiliza a logo até receber o retrato autorizado. Não há agenda ou fluxo de reserva. A home usa rolagem horizontal contínua de 18 px/s, pausável e suspensa durante foco, hover, aba oculta e fora de viewport. Movimento reduzido oferece navegação manual. Faixas diagonais de promoção usam champanhe e preço anterior, sem urgência fictícia.

## Luxury Editorial Beauty Boutique — revisão atual
Preservados logo, paleta, Bodoni Moda e Manrope. A home apresenta os dois universos no hero por um díptico assimétrico, com perfumaria em maior escala. Categorias tipográficas, vitrine manual sem duplicações ou autoplay, preços alinhados e marca Studio Milana Pirre no centro da narrativa. A faixa automática da revisão anterior foi substituída por decisão criativa autorizada; seus registros anteriores são históricos. Nail Design permanece institucional. A implementação usa editorial.css, sem dependências novas. Prévia local para aprovação, sem publicação nesta rodada.
