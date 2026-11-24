"""Browser-level regression checks for the static commerce demonstration.

Run with the site served at http://127.0.0.1:8765:
    python tests/test_commerce.py
Requires: python -m pip install playwright
Uses the already installed Chrome; does not download a browser.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get("STUDIO_TEST_URL", "http://127.0.0.1:8765/")
CHROME = os.environ.get("STUDIO_CHROME", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
KEY = "milana-demo-cart-v1"
RESULTS: list[dict] = []
ERRORS: list[dict] = []


def record(name: str, detail: str = "") -> None:
    RESULTS.append({"test": name, "status": "PASS", "detail": detail})
    print("PASS " + name, flush=True)


def attach_errors(page, label: str) -> None:
    page.on("pageerror", lambda err: ERRORS.append({"scope": label, "type": "pageerror", "message": str(err)}))
    page.on("console", lambda msg: ERRORS.append({"scope": label, "type": "console", "message": msg.text}) if msg.type == "error" else None)


def navigate(page, route: str, base: str = BASE) -> None:
    page.goto(urljoin(base, route), wait_until="load")
    page.wait_for_function("!!window.Studio")


def assert_no_overflow(page, label: str) -> None:
    result = page.evaluate("({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})")
    assert result["scroll"] <= result["width"] + 1, f"{label}: horizontal overflow {result}"


def close_contact(page) -> None:
    page.locator("#contact-dialog [data-close-dialog]").click()
    expect(page.locator("#contact-dialog")).not_to_be_visible()


def check_whatsapp(page, expected: list[str]) -> None:
    dialog = page.locator("#contact-dialog")
    expect(dialog).to_be_visible()
    text = dialog.locator("textarea").input_value()
    for fragment in expected:
        assert fragment in text, f"Missing WhatsApp summary fragment: {fragment}"
    link = dialog.locator("[data-contact-link]")
    expect(link).to_be_hidden()
    assert link.get_attribute("href") is None
    expect(dialog.locator("[data-contact-description]")).to_contain_text("contato oficial ainda será informado")
    close_contact(page)


def commerce_journey(browser, width: int) -> None:
    label = f"{width}px"
    context = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce", locale="pt-BR")
    page = context.new_page()
    page.set_default_timeout(10000)
    attach_errors(page, label)
    try:
        navigate(page, "perfumaria.html")
        cards = page.locator("#catalog-grid .product-card")
        expect(cards).to_have_count(6)
        assert_no_overflow(page, label + " catalog")
        search = page.locator("#product-search")
        search.fill("lumiere")
        expect(cards).to_have_count(1)
        expect(cards.first).to_contain_text("Ambre Lumière")
        search.fill("Lumière")
        expect(cards).to_have_count(1)
        search.fill("âmbar")
        expect(cards).to_have_count(2)
        record(label + " busca insensível a acentos", "lumiere/Lumière e âmbar")
        search.fill("")
        page.get_by_role("button", name="Árabes", exact=True).click()
        expect(cards).to_have_count(2)
        expect(page.get_by_role("button", name="Árabes", exact=True)).to_have_attribute("aria-pressed", "true")
        page.reload(wait_until="load")
        expect(cards).to_have_count(2)
        page.get_by_role("button", name="Todos", exact=True).click()
        expect(cards).to_have_count(6)
        record(label + " categorias e URL persistente", "Árabes: 2 produtos; Todos: 6")
        details = page.locator("#catalog-filters")
        if not details.evaluate("el=>el.open"):
            details.locator("summary").click()
        page.get_by_label("Ambarado floral", exact=True).check()
        expect(cards).to_have_count(1)
        expect(cards.first).to_contain_text("Ambre Lumière")
        page.locator("#price-filter").select_option("350")
        expect(page.locator("#catalog-empty")).to_be_visible()
        expect(cards).to_have_count(0)
        page.locator("#reset-filters").click()
        page.locator("#price-filter").select_option("350")
        expect(cards).to_have_count(2)
        record(label + " filtros combinados de família e preço", "Limite R$350 retorna Fleur de Soie e Soleil Doré")
        page.locator("#reset-filters").click()
        page.locator("#product-sort").select_option("price-asc")
        expect(cards.first).to_contain_text("Soleil Doré")
        expect(cards.last).to_contain_text("Oud Velours")
        page.locator("#product-sort").select_option("price-desc")
        expect(cards.first).to_contain_text("Oud Velours")
        page.locator("#product-sort").select_option("name")
        expect(cards.first).to_contain_text("Ambre Lumière")
        record(label + " ordenação", "menor preço, maior preço e nome")
        search.fill("produto-inexistente-xyz")
        expect(page.locator("#catalog-empty")).to_be_visible()
        page.locator("#reset-empty").click()
        expect(cards).to_have_count(6)
        expect(search).to_have_value("")
        record(label + " busca vazia e recuperação")

        page.get_by_role("link", name="Conhecer Ambre Lumière", exact=True).click()
        expect(page.locator("h1")).to_have_text("Ambre Lumière")
        assert_no_overflow(page, label + " product")
        expect(page.locator('#gallery-track img')).to_have_attribute('src', 'assets/images/perfume-ambre.jpg')
        expect(page.locator('.gallery-controls')).to_be_hidden()
        navigate(page, 'produto.html?id=oud')
        page.locator("#gallery-next").click()
        expect(page.locator("#gallery-count")).to_have_text("2 / 2")
        page.locator("#gallery-track").focus()
        page.keyboard.press("ArrowLeft")
        expect(page.locator("#gallery-count")).to_have_text("1 / 2")
        expect(page.locator('[data-gallery-index="0"]')).to_have_attribute("aria-pressed", "true")
        page.locator('[data-gallery-index="1"]').click()
        expect(page.locator("#gallery-count")).to_have_text("2 / 2")
        record(label + " galeria por controles e teclado")
        navigate(page, 'produto.html?id=ambre')
        page.locator("#product-plus").click()
        page.locator("#product-plus").click()
        expect(page.locator("#product-qty")).to_have_value("3")
        expect(page.locator("#product-whatsapp")).to_have_count(0)
        record(label + " produto sem atalho de compra por WhatsApp")
        page.locator("#product-add").click()
        expect(page.locator("#product-added-message")).to_contain_text("3 unidades adicionadas")
        assert page.evaluate("Studio.getCart()") == [{"id": "ambre", "qty": 3}]
        page.locator("#product-added a").click()
        expect(page.locator("#cart-total")).to_contain_text("1.167,00")
        page.locator('[data-cart-action="plus"][data-id="ambre"]').click()
        expect(page.locator("#cart-total")).to_contain_text("1.556,00")
        page.locator('[data-cart-action="minus"][data-id="ambre"]').click()
        expect(page.locator("#cart-total")).to_contain_text("1.167,00")
        assert_no_overflow(page, label + " cart")
        expect(page.locator("#cart-whatsapp")).to_have_count(0)
        record(label + " quantidade, subtotal e ausência de WhatsApp na sacola")
        page.get_by_role("link", name="Continuar explorando", exact=True).click()
        page.get_by_role("button", name="Adicionar Fleur de Soie à sacola", exact=True).click()
        navigate(page, "carrinho.html")
        expect(page.locator(".cart-item")).to_have_count(2)
        expect(page.locator("#cart-total")).to_contain_text("1.516,00")
        page.locator('[data-cart-action="remove"][data-id="fleur"]').click()
        expect(page.locator("#cart-total")).to_contain_text("1.167,00")
        page.locator('[data-cart-action="remove"][data-id="ambre"]').click()
        expect(page.locator(".cart-empty")).to_be_visible()
        assert page.evaluate("Studio.getCart().length") == 0
        record(label + " remoção e sacola vazia")

        page.get_by_role("link", name="Explorar perfumaria", exact=True).click()
        page.get_by_role("button", name="Adicionar Ambre Lumière à sacola", exact=True).click(click_count=2, delay=80)
        page.get_by_role("button", name="Adicionar Fleur de Soie à sacola", exact=True).click()
        navigate(page, "carrinho.html")
        expect(page.locator("#cart-total")).to_contain_text("1.127,00")
        page.get_by_role("link", name="Continuar para o checkout", exact=True).click()
        expect(page.locator("#checkout-form")).to_be_visible()
        page.get_by_role("button", name="Concluir simulação", exact=True).click()
        expect(page.locator("#confirmation-title")).to_have_count(0)
        assert page.locator("#checkout-acknowledge").evaluate("el=>!el.validity.valid")
        page.locator("#checkout-name").fill("Cliente demonstração")
        page.locator('input[name="delivery"][value="Retirada"]').check()
        page.locator('input[name="payment"][value="A combinar no atendimento"]').check()
        page.locator("#checkout-acknowledge").check()
        assert_no_overflow(page, label + " checkout")
        page.get_by_role("button", name="Concluir simulação", exact=True).click()
        expect(page.locator("#confirmation-title")).to_have_text("Simulação concluída.")
        expect(page.locator(".checkout-confirmation")).to_contain_text("Nenhum pedido foi enviado")
        expect(page.locator(".confirmation-details")).to_contain_text("1.127,00")
        expect(page.locator(".confirmation-details")).to_contain_text("Retirada (simulação)")
        expect(page.locator(".confirmation-details")).to_contain_text("A combinar no atendimento")
        assert page.evaluate("Studio.getCart().length") == 0
        expect(page.locator("#confirmation-whatsapp")).to_have_count(0)
        record(label + " checkout validado, confirmação e sacola limpa")
        assert_no_overflow(page, label + " confirmation")
        navigate(page, "checkout.html")
        expect(page.locator(".cart-empty")).to_be_visible()
        navigate(page, "produto.html?id=inexistente")
        expect(page.locator(".commerce-missing")).to_contain_text("não foi encontrada")
        record(label + " checkout vazio e produto inexistente")
    finally:
        context.close()


def persistence_journey(browser, file_mode: bool, blocked: bool) -> None:
    label = ("file://" if file_mode else "HTTP") + (" armazenamento bloqueado" if blocked else " armazenamento normal")
    context = browser.new_context(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
    if blocked:
        context.add_init_script("for (const name of ['localStorage','sessionStorage']) Object.defineProperty(window,name,{get(){throw new DOMException('Blocked for test','SecurityError')}})")
    page = context.new_page()
    attach_errors(page, label)
    base = ROOT.as_uri() + "/" if file_mode else BASE
    try:
        navigate(page, "produto.html?id=ambre", base)
        page.locator("#product-plus").click()
        page.locator("#product-add").click()
        assert page.evaluate("Studio.cartTotal()") == 778
        page.locator("#product-added a").click()
        expect(page.locator("#cart-total")).to_contain_text("778,00")
        page.reload(wait_until="load")
        expect(page.locator("#cart-total")).to_contain_text("778,00")
        if blocked:
            assert page.evaluate("Studio.storageMode") == "window"
        page.get_by_role("link", name="Continuar para o checkout", exact=True).click()
        page.locator("#checkout-acknowledge").check()
        page.get_by_role("button", name="Concluir simulação", exact=True).click()
        expect(page.locator("#confirmation-title")).to_have_text("Simulação concluída.")
        assert page.evaluate("Studio.getCart().length") == 0
        record(label + " preserva carrinho entre páginas e conclui checkout")
    finally:
        context.close()


def malformed_storage(browser) -> None:
    cases = [
        ("JSON inválido", "{not-json", []),
        ("estrutura inesperada", '{"id":"ambre"}', []),
        ("entradas malformadas", json.dumps([None, {"id": "unknown", "qty": 2}, {"id": "ambre", "qty": 999}, {"id": "bois", "qty": -1}, {"id": "fleur", "qty": "abc"}]), [{"id": "ambre", "qty": 10}]),
    ]
    for name, raw, expected in cases:
        context = browser.new_context()
        context.add_init_script("localStorage.setItem(" + json.dumps(KEY) + "," + json.dumps(raw) + ");")
        page = context.new_page()
        attach_errors(page, "storage " + name)
        try:
            navigate(page, "carrinho.html")
            assert page.evaluate("Studio.getCart()") == expected
            record("Armazenamento: " + name + " tratado sem falha")
        finally:
            context.close()


def write_report(failure: str | None = None) -> None:
    rows = ["# Testes reais do commerce", "", "Execução com Python Playwright e Google Chrome headless instalado, em contextos isolados. Servidor local HTTP e abertura direta `file://`. Nenhuma mensagem externa foi enviada.", "", "## Resultados", "", "| Verificação | Resultado | Evidência |", "|---|---|---|"]
    for result in RESULTS:
        rows.append(f"| {result['test']} | PASS | {result['detail'] or 'Interações e asserções no navegador'} |")
    if failure:
        rows.append("| Execução interrompida | FAIL | " + failure.replace("\n", " ").replace("|", "/")[:700] + " |")
    rows += ["", "## Erros JavaScript e console", "", f"Erros capturados: {len(ERRORS)}."]
    if ERRORS:
        rows.extend(["", "```json", json.dumps(ERRORS, ensure_ascii=False, indent=2), "```"])
    rows += ["", "## Escopo e limites", "", "- Cenários comerciais executados em 390 × 900 e 1440 × 900 pixels.", "- Nenhuma rolagem horizontal indevida nas páginas comerciais e na confirmação nesses tamanhos.", "- Testes de fallback de armazenamento em HTTP e file:// com localStorage e sessionStorage bloqueados.", "- Estados inválidos e limites de dados exercitados com armazenamento malformado.", "- Galeria exercitada com botões, miniatura e teclado; não é um teste em aparelho físico.", "- Não houve transações, reservas nem integração com um gateway real.", "- Esta suíte valida funcionamento; a revisão visual ampla é documentada separadamente.", "", "Para repetir: inicie `python -m http.server 8765 --bind 127.0.0.1` na raiz do projeto e execute `python tests/test_commerce.py`.", ""]
    (ROOT / "docs" / "tests-commerce.md").write_text("\n".join(rows), encoding="utf-8")
    (ROOT / "tests" / "commerce-results.json").write_text(json.dumps({"checks": RESULTS, "errors": ERRORS, "failure": failure}, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    failure = None
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=CHROME, headless=True)
            try:
                for width in [390, 1440]:
                    commerce_journey(browser, width)
                for file_mode, blocked in [(False, True), (True, False), (True, True)]:
                    persistence_journey(browser, file_mode, blocked)
                malformed_storage(browser)
                assert not ERRORS, json.dumps(ERRORS, ensure_ascii=False)
                record("Console e JavaScript sem erros")
            finally:
                browser.close()
    except Exception as exc:
        failure = str(exc)
        raise
    finally:
        write_report(failure)
