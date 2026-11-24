# Testes de navegação, estados e fotografias

Verificação realizada em 23/11/2026, após a substituição dos assets por fotografias reais com URL Pexels e cópias locais de contingência. Python Playwright e Google Chrome headless instalado; contextos isolados. Não foram enviadas mensagens nem realizadas transações.

## Shell e estados compartilhados

`python tests/test_shell.py` concluiu com sucesso as nove verificações:

- Busca mobile com foco inicial, fundo inerte durante Tab e retorno de foco ao fechar com Escape.
- Busca global por “âmbar” conduzindo aos dois resultados esperados.
- Menu mobile abrindo e navegando para Nail Design.
- Contato sem telefone configurado: mensagem copiável e link externo oculto, sem href inválido.
- Construção e codificação do link oficial wa.me usando uma fixture somente em memória, sem abrir o destino.
- Estados de calendário selecionado, revisão e confirmação do agendamento.
- Confirmação do checkout demonstrativo.
- Links locais válidos, exatamente um `main` e um `h1` nas sete páginas.
- Zero erros de JavaScript ou console.

As capturas de estado em `docs/screenshots/` foram refeitas com os assets reais: busca, menu, contato, calendário selecionado, revisão e confirmação de agendamento e confirmação de compra. Os resultados estruturados estão em `tests/shell-results.json`.

## Contingência das fotografias

`python tests/test_photos.py` bloqueou intencionalmente todas as requisições a `images.pexels.com` e verificou as cinco páginas com fotografia: início, perfumaria, produto, Nail Design e agendamento.

| Contexto | Páginas | Resultado |
|---|---:|---|
| HTTP, 390 × 900 | 5 | PASS |
| HTTP, 1440 × 900 | 5 | PASS |
| file://, 390 × 900 | 5 | PASS |

As imagens foram forçadas a carregar com `loading="eager"` e chamadas de `decode()`. Todas as imagens de cada página ficaram completas, com dimensões naturais maiores que zero e origem local em `assets/images/`. O teste também cobre imagens geradas dinamicamente pelo catálogo e pela galeria de produto.

Foram **15 combinações de página/contexto aprovadas**, sem erros de JavaScript. As **57 requisições de CDN abortadas** produziram erros de rede `net::ERR_FAILED` esperados; todos foram recuperados pelas cópias locais. Não houve falhas de recursos locais nem outros erros de console. Esses erros provocados são registrados separadamente e não são apresentados como falhas de JavaScript.

Evidência detalhada: `tests/photos-results.json`. A suíte não substitui uma revisão em aparelhos físicos nem verifica disponibilidade permanente do provedor externo.

## Repetição

Na raiz do projeto, execute `python -m http.server 8765 --bind 127.0.0.1`. Em outro terminal, execute `python tests/test_shell.py` e `python tests/test_photos.py`. Instale a dependência de teste com `python -m pip install playwright`; os scripts usam o Google Chrome já instalado e não exigem download de outro navegador.
