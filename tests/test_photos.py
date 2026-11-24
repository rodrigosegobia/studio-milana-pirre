"""Verify local photo fallbacks by intentionally blocking the photo CDN.

No screenshots or external messages. Run after starting the static server:
    python tests/test_photos.py
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:8765/"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ROUTES = ["index.html", "perfumaria.html", "produto.html?id=ambre", "nail-design.html"]
checks, page_errors, console_errors, failed_requests = [], [], [], []


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=CHROME, headless=True)
    try:
        for scheme, width in [("http", 390), ("http", 1440), ("file", 390)]:
            context = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
            context.route("**images.pexels.com/**", lambda route: route.abort("failed"))
            page = context.new_page()
            page.set_default_timeout(15000)
            label = f"{scheme} {width}px"
            page.on("pageerror", lambda error: page_errors.append(str(error)))
            page.on("console", lambda message: console_errors.append({"message": message.text, "url": message.location.get("url", "")}) if message.type == "error" else None)
            page.on("requestfailed", lambda request: failed_requests.append({"url": request.url, "failure": request.failure}))
            base = ROOT.as_uri() + "/" if scheme == "file" else BASE
            try:
                for route in ROUTES:
                    page.goto(urljoin(base, route), wait_until="load")
                    page.wait_for_function("!!window.Studio")
                    page.evaluate("""async () => {
                      const images = [...document.images];
                      images.forEach(image => { image.loading = 'eager'; });
                      await Promise.all(images.map(image => image.decode().catch(() => {})));
                    }""")
                    page.wait_for_function("[...document.images].every(image => image.complete && image.naturalWidth > 0 && !image.currentSrc.includes('images.pexels.com'))")
                    images = page.locator("img").evaluate_all("images=>images.map(image=>({src:image.getAttribute('src'),currentSrc:image.currentSrc,width:image.naturalWidth,height:image.naturalHeight,visible:!!(image.offsetWidth||image.offsetHeight||image.getClientRects().length)}))")
                    assert images, route + " contains no images"
                    assert all(image["width"] and image["height"] for image in images)
                    assert all("assets/images/" in image["src"] for image in images), images
                    checks.append({"scope": label, "route": route, "status": "PASS", "image_count": len(images), "visible_images": sum(image["visible"] for image in images), "all_sources_local": True})
                    print(f"PASS {label} {route}: {len(images)} imagens locais decodificadas", flush=True)
            finally:
                context.close()
        assert not page_errors, page_errors
        unexpected_console = [error for error in console_errors if not ("images.pexels.com" in error["url"] and "net::ERR_FAILED" in error["message"])]
        unexpected_requests = [request for request in failed_requests if "images.pexels.com" not in request["url"]]
        assert not unexpected_console, unexpected_console
        assert not unexpected_requests, unexpected_requests
        assert failed_requests, "CDN blocking did not exercise the fallback"
    finally:
        browser.close()
        payload = {"checks": checks, "javascript_errors": page_errors, "expected_aborted_cdn_requests": len(failed_requests), "console_errors": console_errors, "request_failures": failed_requests}
        (ROOT / "tests" / "photos-results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"PASS Fotos: {len(checks)} rotas/contextos; 0 erros JavaScript; {len(failed_requests)} falhas de CDN provocadas e recuperadas.")
