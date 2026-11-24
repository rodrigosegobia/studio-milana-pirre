# Studio Milana Pirre

Prévia estática com loja de perfumes e landing page de Nail Design. Ajustes de navegação, abertura e apresentação profissional aprovados pelo usuário para publicação em 24/11/2026.

## Abrir a prévia

Abra `index.html` no navegador. Para ver diretamente o portfólio e o perfil, abra `nail-design.html`. Não é necessário instalar bibliotecas ou compilar. As fontes são locais; fotografias reais usam URLs do Pexels com cópias locais de contingência. Créditos e licenças em ASSETS.md.

Opcionalmente, execute nesta pasta:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Acesse http://127.0.0.1:8765 e encerre o servidor com Ctrl+C.

## Conteúdo e navegação

- **Perfumaria:** busca, categorias, filtros, ordenação, página de produto, sacola e checkout demonstrativo. Os atalhos comerciais de WhatsApp foram removidos do produto, da sacola e da confirmação.
- **Nail Design:** uma landing page com portfólio ampliável, perfil da profissional e quatro serviços. Não há calendário, seleção de horários ou reserva. `agendamento.html` apenas redireciona antigos links ao portfólio.
- **Página inicial:** foto de abertura em tela inteira, sem faixa superior, e transição gradual de fade/desfoque ao rolar. Vitrine manual por deslize e teclado, sem contador ou setas visuais. Quatro produtos por vez no desktop e dois no celular, sem movimento automático. A preferência por movimento reduzido desativa os efeitos.
- **Promoções demonstrativas:** Ambre Lumière e Soleil Doré exibem faixa diagonal fina e preço anterior riscado. A sacola e o checkout usam o preço atual.

Os dados de produtos e preços são fictícios. Não há cobrança, envio de pedido, estoque real ou reserva. A logo original foi preservada. Nenhuma nova imagem foi gerada nesta revisão.

## Atualizar perfil, serviços e portfólio

Em `assets/js/data.js`:

- `nail.profile.name`, `bio` e `photo`: nome, biografia e URL de retrato autorizado. Os campos começam vazios; a página usa a logo e uma apresentação provisória até receber os dados reais.
- `nail.portfolio`: lista de fotografias, títulos, descrições e textos alternativos. Acrescente entradas para publicar novos trabalhos na galeria. Use imagens autorizadas; as duas atuais são referências de banco de imagens.
- `services`: os quatro serviços e suas descrições.
- `products[].price`: preço atual utilizado nos cálculos.
- `products[].compareAt`: preço anterior. Um valor maior que `price` ativa a apresentação de promoção; omitir o campo retira a faixa e o preço riscado.

As alterações de conteúdo são feitas nos arquivos e publicadas junto ao site. Esta prévia não possui painel de postagem ou upload: edição autônoma pela profissional exigirá um CMS ou painel autenticado e armazenamento de imagens.

Em `assets/js/config.js`, os contatos oficiais começam vazios. O Instagram e o WhatsApp geral do studio abrem estados demonstrativos até receberem dados reais. WhatsApp não participa da compra dos perfumes.

## Arquivos

| Arquivo | Finalidade |
| --- | --- |
| `index.html` | Home, perfumes em movimento e acesso ao portfólio |
| `perfumaria.html` | Catálogo e filtros |
| `produto.html` | Detalhes e adição à sacola |
| `carrinho.html` | Quantidades, remoção e totais |
| `checkout.html` | Compra simulada |
| `nail-design.html` | Perfil, portfólio e serviços |
| `assets/js/home.js` | Vitrine manual e controles |
| `assets/js/nail-design.js` | Conteúdo da landing page e ampliação de fotos |
| `assets/js/app.js` | Navegação, diálogos, sacola e fades |
| `assets/js/commerce.js` | Fluxo da loja |
| `assets/css/` | Estilos compartilhados, loja e Nail Design |

## Verificação desta revisão

- 29 grupos de regressão comercial aprovados, incluindo HTTP, file://, armazenamento bloqueado e dados malformados.
- 9 verificações de navegação, diálogos, links e confirmação aprovadas.
- 14 grupos de verificações de landing page e movimento aprovados: seis páginas em 360/390/430/1440 px, portfólio, foco, âncoras, movimento reduzido, navegação manual e ausência de movimento automático, preço promocional e redirecionamento legado.
- Nenhum erro JavaScript; nenhuma rolagem horizontal indevida do documento. A faixa tem rolagem horizontal intencional dentro de seu próprio quadro.
- Capturas atuais em `docs/screenshots/mobile-reset/`, inspecionadas em mobile e desktop.
- 12 grupos adicionais de escala, barra fixa, toque, serviços, perfil e transição de scroll em sete dimensões, incluindo 320 px e orientação horizontal. Rodar com `python tests/test_mobile.py`.

```powershell
python -m pip install playwright
python tests/test_commerce.py
python tests/test_shell.py
python tests/test_landing.py
```

Testes com Chrome instalado em `C:\Program Files\Google\Chrome\Application\chrome.exe`, em modo headless. Não foram realizados testes em aparelho físico, Safari, Firefox ou leitor de tela real. Os testes não enviam mensagens nem processam pagamentos.

## Produção

Permanecem necessários: catálogo, preços e estoque reais; gateway de pagamento, pedidos e frete no servidor; dados oficiais da empresa; nome, biografia, retrato e trabalhos autorizados da profissional; contatos e políticas comerciais. Para gerenciar o portfólio sem editar código, conectar um CMS ou painel com autenticação e armazenamento de mídia.

Site: https://rodrigosegobia.github.io/studio-milana-pirre/.

Skills aplicadas no projeto: frontend-design, impeccable, ui-ux-pro-max e sites. Playwright foi usado para verificação. Imagegen foi usado em uma etapa antiga; seus resultados foram retirados e nenhuma fotografia gerada integra esta revisão. O controle de computador integrado estava indisponível; a prévia local pode ser aberta diretamente no navegador.

## Direção atual
Campanha da home em tela inteira e sem faixa superior; barra inferior mobile restaurada. Nas páginas internas, cabeçalho preto com logo branca. Nail Design com serviços organizados, detalhes expansíveis e caixa de apresentação profissional, sem agendamento. Catálogo, sacola e checkout permanecem funcionais. Detalhes em DESIGN.md e docs/review.md.
