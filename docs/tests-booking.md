# Testes E2E — Nail Design e agendamento

Execução: 2026-11-23T04:40:02+00:00

Resultado: **52/52 verificações aprovadas**.

Chrome headless isolado via Python Playwright. HTTP em 127.0.0.1:8765 e abertura direta file://. Larguras: 390 e 1440 px. Relógio dos testes fixado em 23/11/2026 às 10h de Brasília para reproduzir antecedência e calendário. Fuso do navegador deliberadamente diferente do studio.

| Verificação | Resultado |
| --- | --- |
| 390px: quatro serviços | Aprovado |
| 390px: Nail Design sem overflow | Aprovado |
| 390px: imagens carregadas | Aprovado |
| 390px: Instagram sem contato fictício | Aprovado |
| 390px: deep-link escolhe serviço | Aprovado |
| 390px: agenda sem overflow | Aprovado |
| 390px: próximo mês | Aprovado |
| 390px: mês anterior | Aprovado |
| 390px: datas indisponíveis desabilitadas | Aprovado |
| 390px: seleção acessível de data e horário | Aprovado |
| 390px: resumo corresponde à seleção | Aprovado |
| 390px: voltar e editar data preservam seleção | Aprovado |
| 390px: mudar serviço limpa data e horário | Aprovado |
| 390px: confirmação explícita sem reserva real | Aprovado |
| 390px: confirmação sem overflow | Aprovado |
| 390px: mensagem WhatsApp com seleção | Aprovado |
| 390px: WhatsApp sem número não produz link | Aprovado |
| 390px: reiniciar limpa estado | Aprovado |
| 390px: serviço inválido volta à escolha | Aprovado |
| 390px: sem erros JavaScript ou console | Aprovado |
| 1440px: quatro serviços | Aprovado |
| 1440px: Nail Design sem overflow | Aprovado |
| 1440px: imagens carregadas | Aprovado |
| 1440px: Instagram sem contato fictício | Aprovado |
| 1440px: deep-link escolhe serviço | Aprovado |
| 1440px: agenda sem overflow | Aprovado |
| 1440px: próximo mês | Aprovado |
| 1440px: mês anterior | Aprovado |
| 1440px: datas indisponíveis desabilitadas | Aprovado |
| 1440px: seleção acessível de data e horário | Aprovado |
| 1440px: resumo corresponde à seleção | Aprovado |
| 1440px: voltar e editar data preservam seleção | Aprovado |
| 1440px: mudar serviço limpa data e horário | Aprovado |
| 1440px: confirmação explícita sem reserva real | Aprovado |
| 1440px: confirmação sem overflow | Aprovado |
| 1440px: mensagem WhatsApp com seleção | Aprovado |
| 1440px: WhatsApp sem número não produz link | Aprovado |
| 1440px: reiniciar limpa estado | Aprovado |
| 1440px: serviço inválido volta à escolha | Aprovado |
| 1440px: sem erros JavaScript ou console | Aprovado |
| Configuração: fuso de Brasília independe do navegador | Aprovado |
| Configuração: conversão local para UTC | Aprovado |
| Configuração: passado | Aprovado |
| Configuração: domingo | Aprovado |
| Configuração: antecedência 24h | Aprovado |
| Configuração: intervalo almoço | Aprovado |
| Configuração: duração e fim expediente | Aprovado |
| Configuração: folgas | Aprovado |
| Configuração: bloqueios de intervalos e slots | Aprovado |
| Configuração: horizonte 60 dias | Aprovado |
| Configuração: ausência de horários com recuperação | Aprovado |
| file://: fluxo completo e mensagem sem backend | Aprovado |

## Limites

Não envia mensagens, não testa conta real no WhatsApp/Instagram e não cria reserva. Verifica os estados demonstrativos e o texto preparado. A inspeção estética e screenshots das demais larguras são responsabilidade da revisão visual geral.

## Reproduzir

```powershell
python -m http.server 8765
# Em outro terminal, na raiz do projeto:
python tests/test_booking.py
```

O teste aceita `STUDIO_TEST_URL` e `CHROME_PATH` por variáveis de ambiente. Precisa do pacote Python `playwright`; não é uma dependência do site.
