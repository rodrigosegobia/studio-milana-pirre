# Testes reais do commerce

Execução com Python Playwright e Google Chrome headless instalado, em contextos isolados. Servidor local HTTP e abertura direta `file://`. Nenhuma mensagem externa foi enviada.

## Resultados

| Verificação | Resultado | Evidência |
|---|---|---|
| 390px busca insensível a acentos | PASS | lumiere/Lumière e âmbar |
| 390px categorias e URL persistente | PASS | Árabes: 2 produtos; Todos: 12 |
| 390px filtros combinados de família e preço | PASS | Limite R$350 retorna Fleur de Soie e Soleil Doré |
| 390px ordenação | PASS | menor preço, maior preço e nome |
| 390px busca vazia e recuperação | PASS | Interações e asserções no navegador |
| 390px busca por marcas dos seis perfumes fornecidos | PASS | Interações e asserções no navegador |
| 390px seis perfumes: imagens, páginas, preços de prévia e sacola persistente | PASS | Interações e asserções no navegador |
| 390px galeria por controles e teclado | PASS | Interações e asserções no navegador |
| 390px produto sem atalho de compra por WhatsApp | PASS | Interações e asserções no navegador |
| 390px quantidade, subtotal e ausência de WhatsApp na sacola | PASS | Interações e asserções no navegador |
| 390px remoção e sacola vazia | PASS | Interações e asserções no navegador |
| 390px checkout validado, confirmação e sacola limpa | PASS | Interações e asserções no navegador |
| 390px checkout vazio e produto inexistente | PASS | Interações e asserções no navegador |
| 1440px busca insensível a acentos | PASS | lumiere/Lumière e âmbar |
| 1440px categorias e URL persistente | PASS | Árabes: 2 produtos; Todos: 12 |
| 1440px filtros combinados de família e preço | PASS | Limite R$350 retorna Fleur de Soie e Soleil Doré |
| 1440px ordenação | PASS | menor preço, maior preço e nome |
| 1440px busca vazia e recuperação | PASS | Interações e asserções no navegador |
| 1440px busca por marcas dos seis perfumes fornecidos | PASS | Interações e asserções no navegador |
| 1440px seis perfumes: imagens, páginas, preços de prévia e sacola persistente | PASS | Interações e asserções no navegador |
| 1440px galeria por controles e teclado | PASS | Interações e asserções no navegador |
| 1440px produto sem atalho de compra por WhatsApp | PASS | Interações e asserções no navegador |
| 1440px quantidade, subtotal e ausência de WhatsApp na sacola | PASS | Interações e asserções no navegador |
| 1440px remoção e sacola vazia | PASS | Interações e asserções no navegador |
| 1440px checkout validado, confirmação e sacola limpa | PASS | Interações e asserções no navegador |
| 1440px checkout vazio e produto inexistente | PASS | Interações e asserções no navegador |
| HTTP armazenamento bloqueado preserva carrinho entre páginas e conclui checkout | PASS | Interações e asserções no navegador |
| file:// armazenamento normal preserva carrinho entre páginas e conclui checkout | PASS | Interações e asserções no navegador |
| file:// armazenamento bloqueado preserva carrinho entre páginas e conclui checkout | PASS | Interações e asserções no navegador |
| Armazenamento: JSON inválido tratado sem falha | PASS | Interações e asserções no navegador |
| Armazenamento: estrutura inesperada tratado sem falha | PASS | Interações e asserções no navegador |
| Armazenamento: entradas malformadas tratado sem falha | PASS | Interações e asserções no navegador |
| Console e JavaScript sem erros | PASS | Interações e asserções no navegador |

## Erros JavaScript e console

Erros capturados: 0.

## Escopo e limites

- Cenários comerciais executados em 390 × 900 e 1440 × 900 pixels.
- Nenhuma rolagem horizontal indevida nas páginas comerciais e na confirmação nesses tamanhos.
- Testes de fallback de armazenamento em HTTP e file:// com localStorage e sessionStorage bloqueados.
- Estados inválidos e limites de dados exercitados com armazenamento malformado.
- Galeria exercitada com botões, miniatura e teclado; não é um teste em aparelho físico.
- Não houve transações, reservas nem integração com um gateway real.
- Esta suíte valida funcionamento; a revisão visual ampla é documentada separadamente.

Para repetir: inicie `python -m http.server 8765 --bind 127.0.0.1` na raiz do projeto e execute `python tests/test_commerce.py`.
