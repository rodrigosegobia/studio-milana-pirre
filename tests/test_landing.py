"""Preview checks for the portfolio, promotions and subtle motion."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/screenshots/mobile-reset'
OUT.mkdir(parents=True,exist_ok=True)
BASE='http://127.0.0.1:8765/'
checks=[]
errors=[]
def record(value):
 checks.append(value)
 print('PASS '+value,flush=True)
def ready(page):
 page.evaluate("async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));}")
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
 for width in [360,390,430,1440]:
  context=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
  page=context.new_page()
  page.on('pageerror',lambda e:errors.append(str(e)))
  for route in ['index.html','nail-design.html','perfumaria.html','produto.html?id=ambre','carrinho.html','checkout.html']:
   page.goto(BASE+route,wait_until='networkidle');ready(page)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
   assert page.locator('a[href*="agendamento"]').count()==0
   assert page.locator('main button[id$="whatsapp"]').count()==0
   assert page.locator('h1').count()==1
   if width in [390,1440] and route.split('.')[0] in ['index','nail-design','produto']:
    page.screenshot(path=str(OUT/f'{route.split(".")[0]}-{width}.png'),full_page=True)
  record(f'{width}px: six routes, no overflow or booking links')
  page.goto(BASE+'nail-design.html',wait_until='networkidle')
  expect(page.locator('.nail-service')).to_have_count(4)
  expect(page.locator('.portfolio-work')).to_have_count(2)
  page.locator('[data-photo="0"]').click()
  expect(page.get_by_role('dialog',name='Nude luminoso')).to_be_visible()
  page.keyboard.press('Escape')
  expect(page.locator('[data-photo="0"]')).to_be_focused()
  page.get_by_role('link',name='A profissional',exact=True).first.click()
  assert page.url.endswith('#perfil')
  record(f'{width}px: portfolio, profile anchors, lightbox and focus')
  page.goto(BASE+'index.html',wait_until='networkidle')
  expect(page.locator('#featured-products .product-card')).to_have_count(6)
  expect(page.locator('#featured-products .product-ribbon')).to_have_count(2)
  expect(page.locator('#perfume-pause')).to_have_count(0)
  page.locator('#featured-products').scroll_into_view_if_needed()
  left=page.locator('#featured-products').evaluate('(e)=>e.scrollLeft');page.wait_for_timeout(400)
  assert page.locator('#featured-products').evaluate('(e)=>e.scrollLeft')==left
  page.locator('#perfume-next').click()
  assert page.locator('#featured-products').evaluate('(e)=>e.scrollLeft')>left
  record(f'{width}px: ribbons, reduced motion and manual navigation')
  context.close()
 context=browser.new_context(viewport={'width':1440,'height':900},reduced_motion='no-preference')
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle');ready(page)
 page.locator('#featured-products').scroll_into_view_if_needed();page.mouse.move(0,0);page.wait_for_timeout(250)
 initial=page.locator('#featured-products').evaluate('(e)=>e.scrollLeft');page.wait_for_timeout(700)
 assert page.locator('#featured-products').evaluate('(e)=>e.scrollLeft')==initial
 page.locator('#perfume-next').click();page.wait_for_timeout(550)
 assert page.locator('#featured-products').evaluate('(e)=>e.scrollLeft')>initial
 page.locator('#perfume-prev').click();page.wait_for_timeout(550)
 page.locator('#featured-products [data-add-product="ambre"]').click()
 assert page.evaluate('Studio.cartTotal()')==389
 record('Manual navigation, no autoplay and promotional cart price')
 page.goto(BASE+'agendamento.html',wait_until='networkidle')
 page.wait_for_url('**/nail-design.html#portfolio')
 record('Legacy booking address redirects to portfolio')
 assert not errors,errors
 browser.close()
(OUT/'results.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf8')
print(f'{len(checks)} checks passed; no JavaScript errors.')
