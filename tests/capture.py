from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'screenshots'
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ['index.html', 'perfumaria.html', 'produto.html?id=ambre', 'carrinho.html', 'checkout.html', 'nail-design.html']
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    for width in [360, 390, 430, 1440]:
        context = browser.new_context(viewport={'width':width, 'height':900 if width>900 else 844}, device_scale_factor=1, reduced_motion='reduce')
        context.add_init_script("localStorage.setItem('milana-demo-cart-v1', JSON.stringify([{id:'ambre',qty:2},{id:'fleur',qty:1}]))")
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        for path in PAGES:
            response = page.goto('http://127.0.0.1:8765/' + path, wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            page.evaluate("async () => { for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,35));} window.scrollTo(0,0);}")
            page.wait_for_timeout(150)
            page.evaluate("async () => { await Promise.all([...document.images].filter(x => x.getClientRects().length).map(x => { x.loading='eager'; return x.decode().catch(()=>{}); })); }")
            info = page.evaluate("""() => ({overflow:document.documentElement.scrollWidth > innerWidth,
                brokenImages:[...document.images].filter(x=>x.getClientRects().length && (!x.complete||!x.naturalWidth)).map(x=>x.getAttribute('src')),
                h1:document.querySelector('h1')?.textContent, title:document.title,
                overflowing:[...document.querySelectorAll('body *')].filter(x=>{let r=x.getBoundingClientRect();return r.width>0 && r.right>innerWidth+1 && getComputedStyle(x).position!=='absolute' && !x.closest('.gallery-track,.nail-gallery,.category-tabs,dialog')}).slice(0,8).map(x=>x.className)})""")
            results.append({'page':path,'width':width,'status':response.status,**info,'errors':errors.copy()})
            if width in [390,1440]:
                page.screenshot(path=str(OUT / f'{path.split(".")[0]}-{width}.png'), full_page=True)
        context.close()
    browser.close()
(OUT / 'layout-report.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
