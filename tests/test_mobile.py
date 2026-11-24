"""Regression checks for mobile image scale, touch gestures and visible content."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:8765/'
OUT = ROOT / 'docs/screenshots/mobile-reset'
OUT.mkdir(parents=True, exist_ok=True)
checks, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    for width, height in [(320, 667), (360, 740), (390, 844), (430, 932), (844, 390), (768, 1024), (1440, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width < 900, has_touch=width < 900, reduced_motion='no-preference')
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        for route in ['index.html', 'nail-design.html', 'perfumaria.html', 'produto.html?id=ambre', 'carrinho.html', 'checkout.html']:
            page.goto(BASE + route, wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, route)
            assert page.locator('.mobile-bottom-nav').count() == 0
            assert page.locator('.reveal-ready:not(.is-revealed)').count() == 0
            assert page.locator('h1').count() == 1
            for y in [height // 2, page.evaluate('document.documentElement.scrollHeight')]:
                page.evaluate('(y)=>window.scrollTo(0,y)', y)
                assert page.evaluate("[...document.querySelectorAll('main>section')].every(e=>getComputedStyle(e).opacity==='1')")
            if width <= 430:
                photos = page.locator('.product-photo, .portfolio-photo, .nail-hero-picture img').evaluate_all('items=>items.map(e=>e.getBoundingClientRect().height)')
                assert all(0 < h <= 220 for h in photos), (width, route, photos)
            if route == 'index.html' and width < 640:
                assert page.locator('.campaign-hero').evaluate('(e)=>e.clientHeight') <= 480
                assert page.locator('.nail-campaign').evaluate('(e)=>e.clientHeight') <= 260
        checks.append(f'{width}x{height}: six routes, bounded images, no hidden sections or document overflow')
        context.close()

    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until='networkidle')
    page.locator('[data-open-menu]').tap()
    expect(page.get_by_role('dialog', name='Explore o studio')).to_be_visible()
    page.get_by_role('button', name='Fechar menu').tap()
    page.locator('[data-open-search]').tap()
    expect(page.locator('#global-search')).to_be_focused()
    page.get_by_role('button', name='Fechar busca').tap()
    shelf = page.locator('#featured-products')
    shelf.scroll_into_view_if_needed()
    bounds = shelf.bounding_box()
    y = min(650, bounds['y'] + 90)
    cdp = context.new_cdp_session(page)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 310, 'y': y}]})
    for x in [280, 245, 210, 175, 140, 105, 70]:
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y}]})
        page.wait_for_timeout(20)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(600)
    assert shelf.evaluate('(e)=>e.scrollLeft') > 80
    assert page.evaluate('document.documentElement.scrollWidth===innerWidth')
    page.locator('#perfume-prev').tap()
    page.wait_for_timeout(600)
    page.locator('[data-add-product="ambre"]').tap()
    assert page.evaluate('Studio.cartTotal()') == 389
    checks.append('Touch: menu, search, horizontal swipe, previous control and promotional add-to-cart')
    page.goto(BASE + 'nail-design.html', wait_until='networkidle')
    page.locator('[data-photo="0"]').tap()
    expect(page.get_by_role('dialog', name='Nude luminoso')).to_be_visible()
    page.get_by_role('button', name='Fechar fotografia').tap()
    expect(page.locator('[data-photo="0"]')).to_be_focused()
    checks.append('Touch: portfolio enlargement, close and restored focus')
    context.close()
    browser.close()

assert not errors, errors
(OUT / 'mobile-results.json').write_text(json.dumps({'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
for check in checks:
    print('PASS ' + check)
