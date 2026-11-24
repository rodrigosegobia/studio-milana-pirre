"""E2E da agenda estática com Chrome isolado, sem dados nem contatos reais.

Pré-requisitos: Python 3 + playwright, Chrome instalado.
Execute o servidor na raiz: python -m http.server 8765
Execute este teste: python tests/test_booking.py
"""
from pathlib import Path
from datetime import datetime, timezone
import json
import os
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("STUDIO_TEST_URL", "http://127.0.0.1:8765")
CHROME = os.environ.get("CHROME_PATH", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
FIXED_CLOCK = """(() => {
  const NativeDate = Date;
  const now = NativeDate.parse('2026-11-23T13:00:00Z');
  globalThis.Date = class extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  };
})();"""
results = []


def record(name, passed, details=""):
    results.append({"test": name, "passed": bool(passed), "details": details})
    if not passed:
        raise AssertionError(f"{name}: {details}")


def choose_service(page, service):
    page.locator(".booking-service-option").filter(has=page.locator(f'input[value="{service}"]')).click()


def choose_datetime(page):
    day = page.locator("[data-date]:not(:disabled)").first
    date = day.get_attribute("data-date")
    day.click()
    slot = page.locator("[data-time]").first
    time = slot.get_attribute("data-time")
    slot.click()
    return date, time


def audit_width(page, name):
    width = page.evaluate("({ viewport: innerWidth, content: document.documentElement.scrollWidth })")
    record(name, width["content"] <= width["viewport"], json.dumps(width))


def test_journey(browser, width):
    context = browser.new_context(viewport={"width": width, "height": 900}, locale="pt-BR", timezone_id="Asia/Tokyo", reduced_motion="reduce")
    context.add_init_script(FIXED_CLOCK)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda message: errors.append("console: " + message.text) if message.type == "error" else None)
    label = f"{width}px"
    page.goto(BASE_URL + "/nail-design.html")
    expect(page.locator(".nail-service")).to_have_count(4)
    record(f"{label}: quatro serviços", True)
    audit_width(page, f"{label}: Nail Design sem overflow")
    page.locator("main img").evaluate_all("items => Promise.all(items.map(async i => {i.loading='eager'; try {await i.decode()} catch (_) {}}))")
    images = page.locator("main img").evaluate_all("items => items.map(i => ({src:i.getAttribute('src'), ok:i.complete && i.naturalWidth>0}))")
    record(f"{label}: imagens carregadas", all(image["ok"] for image in images), json.dumps(images))
    page.locator('[data-nail-contact="instagram"]').click()
    expect(page.locator("#contact-dialog")).to_be_visible()
    expect(page.locator("[data-contact-link]")).not_to_have_attribute("href")
    expect(page.locator("[data-contact-description]")).to_contain_text("contato oficial ainda será informado")
    page.keyboard.press("Escape")
    record(f"{label}: Instagram sem contato fictício", True)

    page.locator('.nail-service a[href*="servico=alongamento"]').click()
    expect(page.locator("#booking-workspace h2")).to_have_text("Quando é o seu momento?")
    expect(page.locator("#booking-summary")).to_contain_text("Alongamento")
    record(f"{label}: deep-link escolhe serviço", True)
    audit_width(page, f"{label}: agenda sem overflow")
    expect(page.locator("#booking-next")).to_be_disabled()
    expect(page.locator('[data-month="-1"]')).to_be_disabled()
    original_month = page.locator("#calendar-month").text_content()
    page.locator('[data-month="1"]').click()
    record(f"{label}: próximo mês", page.locator("#calendar-month").text_content() != original_month)
    page.locator('[data-month="-1"]').click()
    expect(page.locator("#calendar-month")).to_have_text(original_month)
    record(f"{label}: mês anterior", True)
    disabled = page.locator("[data-date]:disabled")
    record(f"{label}: datas indisponíveis desabilitadas", disabled.count() > 0)
    day, time = choose_datetime(page)
    expect(page.locator(f'[data-date="{day}"]')).to_have_attribute("aria-pressed", "true")
    expect(page.locator(f'[data-time="{time}"]')).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#booking-next")).to_be_enabled()
    record(f"{label}: seleção acessível de data e horário", True, f"{day} {time}")
    page.locator("#booking-next").click()
    expect(page.locator("#booking-workspace h2")).to_have_text("Vamos conferir?")
    expect(page.locator(".booking-review-list")).to_contain_text("Alongamento")
    expect(page.locator(".booking-review-list")).to_contain_text(time)
    record(f"{label}: resumo corresponde à seleção", True)
    page.locator('[data-edit="2"]').click()
    expect(page.locator(f'[data-time="{time}"]')).to_have_attribute("aria-pressed", "true")
    page.locator("#booking-next").click()
    page.locator("#booking-back").click()
    expect(page.locator(f'[data-time="{time}"]')).to_have_attribute("aria-pressed", "true")
    record(f"{label}: voltar e editar data preservam seleção", True)
    page.locator("#booking-next").click()
    page.locator('[data-edit="1"]').click()
    choose_service(page, "blindagem")
    expect(page.locator("#booking-summary")).to_contain_text("Blindagem")
    record(f"{label}: mudar serviço limpa data e horário", page.locator("#booking-summary dd").all_inner_texts()[2:4] == ["A escolher", "A escolher"])
    page.locator("#booking-next").click()
    expect(page.locator("#booking-next")).to_be_disabled()
    day, time = choose_datetime(page)
    page.locator("#booking-next").click()
    page.locator("#booking-confirm").click()
    expect(page.locator(".booking-confirmation")).to_contain_text("nenhum horário real foi reservado")
    expect(page.locator(".booking-confirmation")).to_contain_text("Blindagem")
    expect(page.locator("#booking-summary")).to_be_hidden()
    record(f"{label}: confirmação explícita sem reserva real", True)
    audit_width(page, f"{label}: confirmação sem overflow")
    page.locator("#booking-whatsapp").click()
    message = page.locator("#contact-message").input_value()
    record(f"{label}: mensagem WhatsApp com seleção", all(part in message for part in ["Blindagem", time, "Data desejada:", "agenda demonstrativa", "disponibilidade real"]))
    expect(page.locator("[data-contact-link]")).to_be_hidden()
    expect(page.locator("[data-contact-link]")).not_to_have_attribute("href")
    record(f"{label}: WhatsApp sem número não produz link", True)
    page.keyboard.press("Escape")
    page.locator("#booking-restart").click()
    expect(page.locator("#booking-workspace h2")).to_have_text("Qual cuidado combina com você?")
    expect(page.locator("input[name=service]:checked")).to_have_count(0)
    expect(page.locator("#booking-next")).to_be_disabled()
    record(f"{label}: reiniciar limpa estado", True)
    page.goto(BASE_URL + "/agendamento.html?servico=nao-existe")
    expect(page.locator("#booking-workspace h2")).to_have_text("Qual cuidado combina com você?")
    record(f"{label}: serviço inválido volta à escolha", True)
    record(f"{label}: sem erros JavaScript ou console", not errors, "\n".join(errors))
    context.close()


def test_config(browser):
    context = browser.new_context(viewport={"width": 390, "height": 900}, timezone_id="Pacific/Auckland")
    context.add_init_script(FIXED_CLOCK)
    page = context.new_page()
    page.goto(BASE_URL + "/agendamento.html")
    checks = page.evaluate("""() => {
      const api=StudioBooking, cfg=STUDIO_CONFIG.schedule, services=STUDIO_DATA.services;
      const result=[]; const check=(name,passed)=>result.push({name,passed});
      check('fuso de Brasília independe do navegador', api.todayKey()==='2026-11-23');
      check('conversão local para UTC', new Date(api.instantAt('2026-11-25','09:00')).toISOString()==='2026-11-25T12:00:00.000Z');
      check('passado', api.availableSlots('2026-11-22',services[0]).length===0);
      check('domingo', api.availableSlots('2026-11-29',services[0]).length===0);
      check('antecedência 24h', !api.availableSlots('2026-11-24',services[0]).includes('09:30') && api.availableSlots('2026-11-24',services[0]).includes('10:00'));
      check('intervalo almoço', !api.availableSlots('2026-11-25',services[0]).includes('10:30'));
      check('duração e fim expediente', api.availableSlots('2026-11-25',services[1]).includes('17:00') && !api.availableSlots('2026-11-25',services[0]).includes('17:00'));
      cfg.daysOff=['2026-11-25']; check('folgas', api.availableSlots('2026-11-25',services[0]).length===0); cfg.daysOff=[];
      cfg.blockedSlots=['2026-11-25T09:30',{date:'2026-11-25',start:'14:00',end:'15:00'}];
      check('bloqueios de intervalos e slots', !api.availableSlots('2026-11-25',services[0]).includes('09:00') && !api.availableSlots('2026-11-25',services[0]).includes('13:00') && api.availableSlots('2026-11-25',services[0]).includes('15:00'));
      cfg.blockedSlots=[]; check('horizonte 60 dias', api.availableSlots('2027-01-23',services[0]).length===0);
      return result;
    }""")
    for check in checks:
        record("Configuração: " + check["name"], check["passed"])
    page.evaluate("STUDIO_CONFIG.schedule.weekdays=[]")
    choose_service(page, "alongamento")
    page.locator("#booking-next").click()
    expect(page.locator(".booking-availability")).to_contain_text("Não há horários demonstrativos")
    expect(page.locator("[data-date]:not(:disabled)")).to_have_count(0)
    page.locator("[data-edit-service]").click()
    expect(page.locator("#booking-workspace h2")).to_have_text("Qual cuidado combina com você?")
    record("Configuração: ausência de horários com recuperação", True)
    context.close()


def test_file(browser):
    context = browser.new_context(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
    context.add_init_script(FIXED_CLOCK)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto((ROOT / "agendamento.html").as_uri() + "?servico=esmaltacao")
    expect(page.locator("#booking-summary")).to_contain_text("Esmaltação em gel")
    choose_datetime(page)
    page.locator("#booking-next").click()
    page.locator("#booking-confirm").click()
    expect(page.locator(".booking-confirmation")).to_contain_text("nenhum horário real foi reservado")
    page.locator("#booking-whatsapp").click()
    expect(page.locator("#contact-message")).to_have_value(__import__('re').compile("Esmaltação em gel"))
    record("file://: fluxo completo e mensagem sem backend", not errors, "\n".join(errors))
    context.close()


def write_report(error=None):
    passed = sum(result["passed"] for result in results)
    lines = ["# Testes E2E — Nail Design e agendamento", "", f"Execução: {datetime.now(timezone.utc).isoformat(timespec='seconds')}", "", f"Resultado: **{passed}/{len(results)} verificações aprovadas**.", "", "Chrome headless isolado via Python Playwright. HTTP em 127.0.0.1:8765 e abertura direta file://. Larguras: 390 e 1440 px. Relógio dos testes fixado em 23/11/2026 às 10h de Brasília para reproduzir antecedência e calendário. Fuso do navegador deliberadamente diferente do studio.", "", "| Verificação | Resultado |", "| --- | --- |"]
    lines.extend(f"| {r['test']} | {'Aprovado' if r['passed'] else 'Falhou'} |" for r in results)
    if error:
        lines.extend(["", "## Erro", "", "```text", str(error), "```"])
    lines.extend(["", "## Limites", "", "Não envia mensagens, não testa conta real no WhatsApp/Instagram e não cria reserva. Verifica os estados demonstrativos e o texto preparado. A inspeção estética e screenshots das demais larguras são responsabilidade da revisão visual geral.", "", "## Reproduzir", "", "```powershell", "python -m http.server 8765", "# Em outro terminal, na raiz do projeto:", "python tests/test_booking.py", "```", "", "O teste aceita `STUDIO_TEST_URL` e `CHROME_PATH` por variáveis de ambiente. Precisa do pacote Python `playwright`; não é uma dependência do site."])
    (ROOT / "docs" / "tests-booking.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"passed": passed, "total": len(results), "results": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    failure = None
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=CHROME, headless=True)
            try:
                test_journey(browser, 390)
                test_journey(browser, 1440)
                test_config(browser)
                test_file(browser)
            finally:
                browser.close()
    except Exception as error:
        failure = error
    finally:
        write_report(failure)
    if failure:
        raise failure
