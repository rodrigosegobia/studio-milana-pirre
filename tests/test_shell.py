"""Shared navigation, dialog, link and presentation-state checks. No external messages."""
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'screenshots'
BASE = 'http://127.0.0.1:8765/'
checks, errors = [], []
def record(name):
    checks.append(name)
    print('PASS ' + name, flush=True)
def capture(page, name, full=False):
    page.evaluate('document.fonts.ready')
    if full: page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=str(OUT / (name + '.png')), full_page=full)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    context = browser.new_context(viewport={'width':390,'height':844}, locale='pt-BR', reduced_motion='reduce')
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type=='error' else None)
    page.goto(BASE, wait_until='networkidle')
    search = page.locator('[data-open-search]')
    expect(search).to_be_visible()
    search.click()
    expect(page.get_by_role('dialog',name='Qual será sua assinatura?')).to_be_visible()
    expect(page.locator('#global-search')).to_be_focused()
    capture(page,'search-open-390')
    for i in range(12):
        page.keyboard.press('Tab')
        assert page.evaluate("document.activeElement===document.body || !!document.activeElement.closest('#search-dialog')")
    page.keyboard.press('Escape')
    expect(search).to_be_focused()
    record('Busca mobile acessível, fundo inerte durante Tab e retorno de foco com Escape')
    search.click()
    page.locator('#global-search').fill('âmbar')
    page.locator('#global-search').press('Enter')
    expect(page.locator('#catalog-grid .product-card')).to_have_count(3)
    record('Busca global navega para resultados com acentos')
    page.locator('[data-open-menu]').click()
    expect(page.get_by_role('dialog',name='Explore o studio')).to_be_visible()
    capture(page,'menu-open-390')
    page.get_by_role('dialog').get_by_role('link',name='Nail Design',exact=True).click()
    expect(page).to_have_url(BASE+'nail-design.html')
    record('Menu mobile abre e navega entre as duas áreas')
    page.locator('.site-footer [data-contact="whatsapp"]').click()
    expect(page.get_by_role('dialog',name='Vamos conversar?')).to_be_visible()
    expect(page.locator('[data-contact-link]')).to_be_hidden()
    capture(page,'contact-open-390')
    page.locator('[data-copy-message]').click()
    expect(page.locator('[data-copy-status]')).to_contain_text('copiada')
    page.keyboard.press('Escape')
    record('Contato sem número real tem mensagem copiável e nenhum link quebrado')
    page.evaluate("STUDIO_CONFIG.whatsapp='00000000000'; Studio.contact('whatsapp','Teste técnico: âmbar & gel')")
    link=page.locator('[data-contact-link]').get_attribute('href')
    assert link=='https://wa.me/00000000000?text=Teste%20t%C3%A9cnico%3A%20%C3%A2mbar%20%26%20gel'
    assert page.locator('[data-contact-link]').get_attribute('rel')=='noopener noreferrer'
    page.keyboard.press('Escape')
    page.evaluate("STUDIO_CONFIG.whatsapp='' ")
    record('Construtor oficial wa.me codifica mensagem; fixture zerada só no teste, sem abrir link')
    page.locator('[data-photo="0"]').click()
    expect(page.get_by_role('dialog',name='Vermelho com brilho')).to_be_visible()
    capture(page,'portfolio-detail-390',True)
    page.keyboard.press('Escape')
    record('Portfólio abre fotografia ampliada e fecha por Escape')
    page.goto(BASE+'produto.html?id=ambre')
    page.locator('#product-add').click()
    page.goto(BASE+'checkout.html')
    page.locator('#checkout-acknowledge').check()
    page.get_by_role('button',name='Concluir simulação',exact=True).click()
    capture(page,'checkout-confirmation-390',True)
    record('Captura da confirmação da compra simulada')
    for route in ['index.html','perfumaria.html','produto.html','carrinho.html','checkout.html','nail-design.html']:
        page.goto(BASE+route,wait_until='networkidle')
        links=page.locator('a[href]').evaluate_all('items=>items.map(a=>a.getAttribute("href"))')
        for href in links:
            parsed=urlparse(href)
            if not parsed.scheme and parsed.path:
                assert (ROOT/unquote(parsed.path)).is_file(), f'{route} -> {href}'
        assert page.locator('h1').count()==1
        assert page.locator('main').count()==1
    record('Links locais válidos, um main e um h1 nas seis páginas')
    assert not errors,errors
    record('Shell e estados inspecionados sem erros de JavaScript ou console')
    context.close()
    browser.close()
(ROOT/'tests'/'shell-results.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
