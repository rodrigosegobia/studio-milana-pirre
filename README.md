# Studio Milana Pirre

Prévia comercial estática de perfumaria e Nail Design, com sete páginas, compra simulada e agendamento demonstrativo. A perfumaria recebe o destaque principal da página inicial. A logo fornecida pelo cliente foi preservada e aplicada no cabeçalho e rodapé.

## Abrir a apresentação

1. Extraia o ZIP inteiro, preservando as pastas.
2. Abra **index.html** no Chrome, Edge, Firefox ou Safari atual.
3. Navegue pelos links normalmente. Fontes, estilos e scripts estão incluídos. As fotografias reais carregam por URLs do Pexels e têm cópias locais das mesmas fotos como fallback quando a rede não estiver disponível.

Não é necessário instalar bibliotecas, compilar o site ou configurar credenciais. A abertura direta por `file://` foi testada no Chrome, incluindo as duas jornadas completas.

Para uma apresentação com servidor local, abra um terminal nesta pasta e execute:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Depois, acesse **http://127.0.0.1:8765**. Encerre o servidor com `Ctrl+C`. Python é necessário apenas para esta alternativa e para executar os testes, não para abrir os HTMLs.

## Roteiro de demonstração

**Compra:** Início → Perfumaria → busque “âmbar” ou filtre uma categoria → abra um perfume → escolha a quantidade → adicione à sacola → altere ou remova itens → checkout → marque a ciência de demonstração → conclua a simulação.

**Nail Design:** Início → Nail Design → conheça os quatro procedimentos e as referências visuais → escolha um serviço → selecione data e horário → revise → conclua a simulação → visualize a mensagem de WhatsApp com os dados escolhidos.

O calendário usa a data atual no fuso de Brasília. Datas passadas, domingos, intervalos e horários incompatíveis com a duração aparecem indisponíveis conforme a configuração. O cenário inicial usa antecedência de 24 horas e horizonte de 60 dias.

## Arquivos e configurações

| Arquivo | Função |
| --- | --- |
| `index.html` | Vitrine editorial, categorias, produtos em destaque e acesso ao Nail Design |
| `perfumaria.html` | Busca, categorias, famílias olfativas, faixa de preço e ordenação |
| `produto.html?id=ambre` | Detalhes, galeria, quantidade e compra |
| `carrinho.html` | Itens, quantidades, remoção, total e resumo para WhatsApp |
| `checkout.html` | Formulário mínimo e confirmação simulada |
| `nail-design.html` | Serviços e galeria de referências demonstrativas |
| `agendamento.html` | Escolha de serviço, calendário, horários, revisão e confirmação |
| `assets/js/data.js` | Catálogo fictício, categorias, marcas citadas e serviços |
| `assets/js/config.js` | Contatos, fuso, funcionamento e pontos de integração |
| `assets/js/app.js` | Cabeçalho, rodapé, navegação, diálogos e estado da sacola |
| `assets/js/commerce.js` | Lógica de catálogo, produto, sacola e checkout |
| `assets/js/booking.js` | Regras e interface de disponibilidade |
| `assets/css/` | Estilos compartilhados e de cada jornada |
| `assets/images/` e `assets/fonts/` | Assets locais e licenças das fontes |
| `ASSETS.md` | Procedência, URLs e autoria das fotografias reais, logo e fontes |
| `PRODUCT.md`, `DESIGN.md`, `docs/direction.md` | Briefing confirmado, sistema visual e arquitetura |
| `docs/` e `tests/` | Relatórios, capturas de tela e testes reproduzíveis |

### Contatos

Em `assets/js/config.js`, preencha `whatsapp` com o telefone **real confirmado**, incluindo DDI e DDD, e `instagram` com a URL oficial HTTPS do perfil. Ambos começam vazios. Nessa condição, o contato abre um diálogo demonstrativo, sem destino inventado, e permite copiar a mensagem.

Com o telefone configurado, o site monta um link oficial `https://wa.me/` com o texto codificado. O visitante ainda precisa abrir o WhatsApp e confirmar o envio. Não existe API paga, envio automático ou automação não oficial.

### Agenda

- `weekdays`: dias da semana, de 0 (domingo) a 6 (sábado).
- `open` / `close`: expediente no formato `HH:mm`.
- `slotMinutes`: intervalo entre sugestões de início.
- `breaks`: lista de intervalos `{ start: '12:00', end: '13:00' }`.
- `daysOff`: datas fechadas no formato `AAAA-MM-DD`.
- `blockedSlots`: intervalos `{ date: 'AAAA-MM-DD', start: 'HH:mm', end: 'HH:mm' }` ou strings `AAAA-MM-DDTHH:mm` que bloqueiam um intervalo de `slotMinutes`.
- `leadHours` / `horizonDays`: antecedência mínima e limite futuro.
- `services[].duration`, em `data.js`: duração do procedimento em minutos.
- `cancellation` / `rescheduling`: configuração preparada para futura integração; não existe reserva persistida a cancelar ou reagendar nesta prévia.

As regras de expediente, duração, intervalos, folgas, bloqueios, antecedência e horizonte já controlam as sugestões. Nenhuma confirmação remove um horário real ou sincroniza reservas entre pessoas.

### Estado local

A sacola usa `localStorage`, com fallback para `sessionStorage` e estado na aba (`window.name`). O fallback permite continuar a apresentação quando os dois armazenamentos estão bloqueados. Em `file://`, o estado da aba também acompanha a navegação entre os HTMLs. Use a mesma aba no modo de fallback; não há sincronização garantida entre abas nesse cenário.

O checkout pede somente nome/apelido opcional, opções ilustrativas e ciência da demonstração. Nenhum cartão, documento, endereço ou email é solicitado. O nome opcional e as confirmações não são enviados nem gravados em servidor; ao recarregar, a confirmação não é um histórico de pedido. A sacola é esvaziada ao concluir a simulação.

## Dados demonstrativos e limitações

Os seis perfumes, nomes, notas, preços e volumes são fictícios. As três fotos de frascos são reutilizadas de forma identificada no pequeno catálogo de demonstração. Não representam produtos de Carolina Herrera, Rabanne, Emporio Armani ou Dior; essas marcas aparecem apenas como interesses citados pelo cliente, separados dos itens fictícios.

As fotos de manicure são fotografias reais de terceiros publicadas no Pexels e usadas como referências ilustrativas, não como portfólio do studio. Durações e disponibilidade também são ilustrativas. Não foram inventados nomes de profissionais, avaliações, prêmios, histórico empresarial, endereço, frete, descontos ou condições oficiais.

Não há pagamento, estoque, pedido enviado, reserva efetiva, login, painel administrativo, notificações, banco de dados ou sincronização entre usuários. Os valores mostrados são subtotais demonstrativos; frete permanece a combinar, sem promessa de gratuidade.

As seis fotografias reais usam links do Pexels e também estão incluídas em `assets/images/` para fallback offline. A seleção compreende quatro imagens de perfumaria de Daria Liudnaya e duas referências de unhas, de elena_sher e Roman Titov. Nenhuma fotografia gerada por IA integra o site ou o ZIP. A logo PNG original permanece sem edição. URLs, autoria e detalhes dos arquivos estão em `ASSETS.md`.

## Verificações realizadas

- **29 grupos de testes comerciais aprovados:** busca com e sem acentos, categorias, filtros combinados, ordenação, estados vazios, galeria por botões/teclado, quantidades, totais, remoção, checkout, confirmação, contatos e armazenamento malformado/bloqueado.
- **52 verificações de Nail Design e agenda aprovadas:** serviços, navegação, calendário, seleção, revisão, edição, reinício, confirmação, mensagem, fuso, duração, intervalos, folgas, bloqueios e limites de datas.
- **9 verificações compartilhadas aprovadas:** busca global, menu, diálogos nomeados, Tab sem foco no conteúdo de fundo, Escape com retorno de foco, copiar mensagem, construtor `wa.me`, links e estrutura das sete páginas.
- **28 combinações de página/largura verificadas:** sete páginas em 360, 390, 430 e 1440 px, sem rolagem horizontal indevida, imagens visíveis quebradas ou erros JavaScript.
- **15 cenários de fotos sem conexão aprovados:** com o CDN bloqueado, as fotografias carregaram pelas cópias locais em HTTP e `file://`, sem erros JavaScript.
- Inspeção visual das sete páginas em mobile e desktop, seguida de refinamento e novas capturas. Estados de calendário, revisão, confirmações, menu, busca e contato também foram capturados.
- Fluxos por HTTP e abertura direta `file://` testados. Nenhuma mensagem foi enviada a contatos externos.

As suítes usaram Google Chrome instalado, em modo headless, com Python Playwright. O navegador integrado do ambiente estava indisponível; isso foi contornado com testes e capturas no Chrome. Não foram realizados testes em aparelho físico, Safari, Firefox ou leitor de tela real. A validação não constitui certificação integral WCAG nem medição de performance em rede móvel. Os relatórios detalhados estão em `docs/tests-commerce.md`, `docs/tests-booking.md`, `docs/review.md` e `docs/screenshots/layout-report.json`.

Para repetir os testes, com o servidor local ativo:

```powershell
python -m pip install playwright
python tests/test_commerce.py
python tests/test_booking.py
python tests/test_shell.py
python tests/test_photos.py
python tests/capture.py
```

O caminho padrão do Chrome nos scripts é `C:\Program Files\Google\Chrome\Application\chrome.exe`. Ajuste-o se necessário. As dependências dos testes não fazem parte do funcionamento do site.

## Skills efetivamente aplicadas

- **frontend-design:** direção editorial, composição, tipografia e textos.
- **impeccable:** contexto do produto, critérios de acabamento, inspeção visual, detector e revisão independente.
- **ui-ux-pro-max:** pesquisa de diretrizes de toque e navegação; a sugestão automática de Liquid Glass foi descartada por não corresponder ao briefing.
- **sites:** orientação de implementação estática e prévia local; esta entrega não foi publicada em hospedagem externa.

Playwright foi usado diretamente para testes e screenshots. A skill de controle de computador foi consultada, mas não foi usada para operar aplicativos nativos.

A skill **imagegen** foi utilizada em uma etapa anterior. Seus resultados foram retirados da entrega após a orientação final de usar fotografias reais; nenhuma nova imagem foi gerada nessa substituição.

## O que exige backend na produção

Os campos de `config.integrations` marcam as futuras integrações; não são endpoints em funcionamento.

1. Catálogo real, preços, estoque e disponibilidade fornecidos por banco de dados/API.
2. Criação e consulta de pedidos, cálculo de frete e regras comerciais no servidor.
3. Gateway de pagamentos com sessão segura e confirmação por webhook; nunca confiar no total calculado apenas pelo navegador.
4. Agenda persistente, bloqueio atômico contra reserva duplicada, disponibilidade por profissional e sincronização de calendário.
5. Cancelamento e reagendamento com autenticação/identificação adequada, políticas confirmadas e notificações autorizadas.
6. Administração, permissões, proteção de dados, logs e rotinas de manutenção.

## Informações a solicitar ao cliente

- Catálogo aprovado: nomes e marcas oficiais, descrições, notas, volumes, preços, estoque, códigos e fotos autorizadas.
- WhatsApp com DDI/DDD e perfil oficial do Instagram.
- Apresentação e identidade da profissional, retrato autorizado e fotos dos trabalhos reais.
- Técnicas, preços, durações, disponibilidade, intervalos, folgas, antecedência e políticas de cancelamento/reagendamento.
- Endereço e área de atendimento, quando aplicáveis; formas de recebimento e pagamento, frete, trocas e devoluções.
- Domínio e hospedagem, dados cadastrais da empresa e textos aprovados de privacidade/termos para a operação real.

Referência de linguagem editorial estudada: [site Carolina Herrera Brasil](https://www.carolinaherrera.com/br/pt). Nenhuma imagem, identidade ou campanha foi copiada.
