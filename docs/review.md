# Revisão final de acabamento

## Veredito

**SHIP — prévia demonstrativa pronta para apresentação.** As duas jornadas estão completas e os achados da revisão anterior foram corrigidos. O contrato de sete páginas, perfumaria em destaque, logo original e linguagem de boutique foi preservado.

A revisão independente inicial cobriu as 14 capturas mobile e desktop. Na rodada final, foram revisadas as seis capturas de home, produto e Nail Design com fotografias reais. O implementador fechou a revisão da última recaptura da home desktop após limitar a altura do módulo de Nail Design. Não foram encontrados bloqueios materiais remanescentes nesta cobertura.

## Refinamentos verificados

| Achado anterior | Fechamento |
| --- | --- |
| Diálogos sem nome acessível | Menu, busca e contato têm títulos associados por `aria-labelledby`; testes verificam abertura, foco, Escape e retorno ao acionador. |
| Navegação sem indicação correta de seção | `aria-current` distingue página e seção; sacola e agendamento recebem seus indicadores. |
| Bordas discretas nos campos | Token operacional `--control-line` aplicado aos controles. Divisórias editoriais continuam discretas. |
| Alvos de quantidade pequenos | Botões ajustados para 44 px. |
| Busca mobile, títulos e editorial Nail | Busca acessível no cabeçalho; títulos e espaçamentos refinados, sem conflito entre os editoriais das duas páginas. |
| Seção Nail alta após adoção de foto vertical | No desktop, a imagem preenche um quadro com altura definida pelo conteúdo e mínimo de 570 px. A recaptura final confirma proporção equilibrada. |
| Fotografias geradas | Substituídas pelas seis fotografias reais do Pexels documentadas em ASSETS.md, por URL e com cópias locais das mesmas fotos como fallback. |
| Relatório de agenda incompleto | Substituído pelo relatório da execução de 52 verificações aprovadas. |

Os cinco avisos de espaçamento do detector foram conferidos visualmente: os componentes recebem padding de seus elementos internos ou containers, portanto não exigiram padding duplicado.

## Evidência funcional e visual

| Cobertura | Resultado | Evidência |
| --- | --- | --- |
| Comércio: busca, filtros, ordenação, galeria, sacola, checkout, contato e armazenamento | 29 grupos aprovados | `docs/tests-commerce.md`, `tests/commerce-results.json` |
| Nail Design e agenda: serviço, calendário, horários, edição, confirmação e regras | 52 verificações aprovadas | `docs/tests-booking.md` |
| Navegação compartilhada, diálogos, links e estrutura das páginas | 9 verificações aprovadas | `docs/tests-shell.md`, `tests/shell-results.json` |
| Fotos com CDN deliberadamente bloqueado, em HTTP 390/1440 e file:// 390 | 15 cenários aprovados | `tests/photos-results.json` |
| Sete páginas em 360, 390, 430 e 1440 px | 28 combinações aprovadas | `docs/screenshots/layout-report.json` |

Na última captura não houve overflow horizontal, imagens visíveis quebradas ou erros JavaScript. As suítes de comércio e navegação também não registraram erros de console. No teste de fotos, 57 falhas de rede esperadas foram provocadas pelo bloqueio do CDN; todas foram recuperadas pelas cópias locais, sem falha de recurso local nem erro JavaScript.

As 14 capturas das páginas e sete capturas de estados estão em `docs/screenshots/`. Elas mostram as fotografias reais. A prioridade visual permanece na perfumaria, com acesso ao catálogo no primeiro viewport; Nail Design aparece depois da seleção de perfumes. A tipografia, a logo e a navegação permanecem coerentes entre as jornadas.

A logo PNG fornecida pelo usuário permanece integral, com SHA-256 `B97B3E77BAA873D841F0C3D1A4D19D8846F9C00F24080778896BD91CB9983A38`. O enquadramento usa CSS. DESIGN.md e seu sidecar documentam o sistema visual; ASSETS.md registra fontes, créditos e licenças.

## Limites e honestidade da demonstração

Os testes usaram Chrome headless com Playwright, incluindo abertura direta por file://. A inspeção visual usa capturas; não houve teste em aparelho físico, Safari, Firefox, leitor de tela real ou medição de performance em rede móvel. Elementos fixos aparecem na coordenada inicial do viewport em screenshots de página inteira; isso não representa obstrução permanente da página.

Produtos, preços, durações e disponibilidade são demonstrativos. As fotografias reais são referências, não catálogo ou portfólio do studio. Os contatos permanecem vazios até receber os dados oficiais. Não há pagamento, envio de pedido, bloqueio real de horário ou mensagem enviada automaticamente.

As integrações e os dados reais necessários à produção estão relacionados no README.md. Essas dependências não impedem a apresentação da prévia solicitada.

Questions skipped: direção e escopo já confirmados; nenhuma decisão visual foi reaberta.
