"""Hero autoplay, graceful motion preferences, asset failures and supplied photos."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/screenshots/carousel'
OUT.mkdir(parents=True, exist_ok=True)
BASE = 'http://127.0.0.1:8765/'
errors, checks = [], []

def state(page):
    return page.locator('.hero-slide').evaluate_all('slides=>slides.map(s=>({src:s.firstElementChild.getAttribute("src"),opacity:+getComputedStyle(s).opacity,active:s.classList.contains("is-active"),entering:s.classList.contains("is-entering"),loaded:s.firstElementChild.complete&&s.firstElementChild.naturalWidth>0}))')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    for width,height in [(320,667),(390,844),(844,390),(1440,900)]:
        page = browser.new_page(viewport={'width':width,'height':height})
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE, wait_until='networkidle')
        expect(page.locator('h1')).to_have_text('Milana Pirre')
        assert page.evaluate('document.documentElement.scrollWidth===innerWidth')
        assert page.locator('.campaign-hero').evaluate('(e)=>e.clientHeight') == height
        assert page.locator('.nail-campaign').bounding_box()['y'] < page.locator('.category-strip').bounding_box()['y']
        assert page.locator('#perfume-prev,#perfume-next,#shelf-position').count()==0
        assert page.locator('.campaign-hero button').count()==0
        assert page.locator('.studio-statement').count()==0
        assert page.locator('.nail-campaign-photo').bounding_box()['y'] == height
        if width<640: assert page.locator('.nail-campaign-inner').bounding_box()['height']==280
        assert page.locator('#selection-title').bounding_box()['y'] < page.locator('.category-strip').bounding_box()['y']
        expect(page.locator('.nail-campaign-photo img')).to_have_attribute('src','assets/images/servico1.jpeg')
        assert page.locator('.nail-campaign-photo').bounding_box()['width']==width
        page.close()
    checks.append('Four viewport sizes: fullscreen, section order, controls and no overflow/overlap')

    # Real browser time: capture the actual first fade, not a mocked class toggle.
    for motion in ['no-preference','reduce']:
        page = browser.new_page(viewport={'width':390,'height':844}, reduced_motion=motion)
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE,wait_until='networkidle')
        folder=OUT/motion
        folder.mkdir(exist_ok=True)
        frames=[]
        page.screenshot(path=str(folder/'00-before.png'))
        frames.append(state(page))
        if motion=='no-preference':
            page.wait_for_function('!!document.querySelector(".hero-slide.is-entering")',timeout=12000)
            for i,delay in enumerate([80,400,500,600,650],1):
                page.wait_for_timeout(delay)
                frames.append(state(page))
                page.screenshot(path=str(folder/f'{i:02d}-fade.png'))
            assert frames[1][1]['opacity'] < frames[2][1]['opacity'] < frames[3][1]['opacity'] <= 1
            assert frames[-1][1]['opacity'] == 1
            assert all(any(s['opacity']==1 for s in f) for f in frames), 'A blank/dark gap appeared'
            page.locator('.campaign-hero a').first.focus()
            page.clock.install()
            before=state(page)
            page.clock.fast_forward(20000)
            assert state(page)==before
            page.evaluate('document.activeElement.blur()')
            # Exercise all perfume slides and the wrap back to Milana.
            sequence=['assets/images/servico1.jpeg']
            for i in range(7):
                page.clock.fast_forward(7600)
                page.wait_for_function('!!document.querySelector(".hero-slide.is-entering")')
                page.clock.fast_forward(2100)
                current=page.locator('.hero-slide.is-active img')
                expect(current).to_have_count(1)
                assert current.evaluate('(e)=>e.complete&&e.naturalWidth>0')
                sequence.append(current.get_attribute('src'))
                page.screenshot(path=str(OUT/f'slide-{i+2}-390.png'), animations='disabled')
            assert len(set(sequence))==8, sequence
            assert sequence[-1]=='assets/images/milana.jpg'
            page.evaluate('scrollTo({top:innerHeight+400,behavior:"instant"})')
            page.wait_for_timeout(100)
            before=state(page)
            page.clock.fast_forward(20000)
            assert state(page)==before
            checks.append('Autoplay: 8 decoded photos, wrap, 2-second continuous fade, focus suspension and offscreen stop')
        else:
            page.clock.install()
            page.clock.fast_forward(20000)
            page.screenshot(path=str(folder/'01-settled.png'))
            frames.append(state(page))
            assert len(state(page))==1 and state(page)[0]['opacity']==1
            assert page.locator('.campaign-hero button').count()==0
            checks.append('Reduced motion: first photo stays visible, no autoplay')
        (folder/'report.json').write_text(json.dumps({'frames':frames,'scope':'390x844 browser rendering; no physical device FPS measurement'},indent=2),encoding='utf-8')
        page.close()

    page=browser.new_page(viewport={'width':390,'height':844})
    page.route('**/servico1.jpeg',lambda route:route.abort())
    page.goto(BASE,wait_until='networkidle')
    page.clock.install()
    page.clock.fast_forward(7600)
    page.wait_for_timeout(100)
    assert state(page)[0]['opacity']==1
    page.clock.fast_forward(7600)
    page.wait_for_function('!!document.querySelector(".hero-slide.is-entering")')
    page.clock.fast_forward(2100)
    assert 'perfumes/' in page.locator('.hero-slide.is-active img').get_attribute('src')
    checks.append('Missing slide: previous photo retained and next available image used')
    page.close()

    page=browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
    page.goto(BASE+'nail-design.html',wait_until='networkidle')
    expect(page.locator('.nail-hero-picture img')).to_have_attribute('src','assets/images/servico1.jpeg')
    expect(page.locator('#profile-picture img')).to_have_attribute('src','assets/images/milana.jpg')
    expect(page.locator('#profile-title')).to_have_text('Milana Pirre')
    expect(page.locator('.portfolio-work')).to_have_count(3)
    page.locator('[data-photo="0"]').click()
    expect(page.locator('#portfolio-photo-note')).to_have_text('Studio Milana Pirre · Nail Design')
    page.get_by_role('button',name='Fechar fotografia').click()
    page.locator('[data-photo="1"]').click()
    expect(page.locator('#portfolio-photo-note')).to_contain_text('Não representa trabalho')
    checks.append('Nail Design: supplied service photo, Milana portrait and honest reference captions')
    page.close()
    browser.close()

assert not errors,errors
(OUT/'checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
for check in checks: print('PASS '+check)
