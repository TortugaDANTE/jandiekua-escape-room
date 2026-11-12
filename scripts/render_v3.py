#!/usr/bin/env python3
"""Render 1080×2022 previews with _v3 suffix and verify institutional logos."""
import base64
import http.server
import socketserver
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)
PORT = 8893

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, format, *args):
        pass

class ReuseServer(socketserver.TCPServer):
    allow_reuse_address = True

def main():
    httpd = ReuseServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    vistas = [
        ("sala1", "sala1_v3.png"),
        ("sala2", "sala2_v3.png"),
        ("sala3", "sala3_v3.png"),
        ("sala4", "sala4_v3.png"),
        ("cierre", "cierre_v3.png"),
        ("portada", "portada_v3.png"),
    ]
    console_errors = []
    issues = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            args=["--headless=new", "--no-sandbox", "--disable-gpu"],
        )
        page = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)

        def on_console(msg):
            if msg.type in ("error", "warning"):
                console_errors.append(f"{msg.type}: {msg.text}")

        def on_page_error(exc):
            console_errors.append(f"pageerror: {exc}")

        page.on("console", on_console)
        page.on("pageerror", on_page_error)

        for vista, nombre in vistas:
            url = f"http://127.0.0.1:{PORT}/index.html?vista={vista}&foto=1&v=20261112c"
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(800)
            if vista == "cierre":
                page.wait_for_selector("#certificado-marco img", timeout=10000)
                page.wait_for_timeout(500)
            page.wait_for_function(
                "() => { const imgs=[...document.querySelectorAll('.barra img, #fondo img')]; return imgs.every(i => i.complete && i.naturalWidth>0); }"
            )
            # Verify bar logos
            info = page.evaluate("""() => {
              const bar = document.querySelector('.barra');
              const u = document.querySelector('.barra .logo-uaslp');
              const a = document.querySelector('.barra .logo-aa');
              const br = bar.getBoundingClientRect();
              const ur = u.getBoundingClientRect();
              const ar = a.getBoundingClientRect();
              const cs = getComputedStyle(bar);
              return {
                justify: cs.justifyContent,
                paddingLeft: cs.paddingLeft,
                paddingRight: cs.paddingRight,
                uSrc: u.getAttribute('src'),
                aSrc: a.getAttribute('src'),
                uNat: [u.naturalWidth, u.naturalHeight],
                aNat: [a.naturalWidth, a.naturalHeight],
                uBox: [Math.round(ur.x), Math.round(ur.y), Math.round(ur.width), Math.round(ur.height)],
                aBox: [Math.round(ar.x), Math.round(ar.y), Math.round(ar.width), Math.round(ar.height)],
                barH: Math.round(br.height),
              };
            }""")
            print(vista, "barra", info)
            if info["justify"] != "space-between":
                issues.append(f"{vista}: justify-content={info['justify']}")
            if abs(info["uBox"][3] - 100) > 1 or abs(info["aBox"][3] - 100) > 1:
                issues.append(f"{vista}: logo heights {info['uBox'][3]} / {info['aBox'][3]} (esperadas 100)")
            if "hd/logo_uaslp_blanco.png" not in info["uSrc"] or "hd/logo_aa_blanco.png" not in info["aSrc"]:
                issues.append(f"{vista}: src inesperados {info['uSrc']} {info['aSrc']}")
            if info["uBox"][0] >= info["aBox"][0]:
                issues.append(f"{vista}: UASLP no está a la izquierda")
            dest = OUT / nombre
            page.screenshot(path=str(dest), type="png")
            print("wrote", dest)

            if vista == "cierre":
                data_url = page.evaluate("() => document.querySelector('#certificado-marco img').src")
                if not data_url.startswith("data:image/png"):
                    issues.append(f"certificado src no es data PNG: {data_url[:80]}")
                else:
                    b64 = data_url.split(",", 1)[1]
                    raw = base64.b64decode(b64)
                    cert_path = OUT / "certificado_v3.png"
                    cert_path.write_bytes(raw)
                    print("wrote", cert_path, "bytes", len(raw))
                    # Inspect pixels: both ends of 210px blue header should have bright (logo) pixels
                    from PIL import Image
                    import io
                    im = Image.open(io.BytesIO(raw)).convert("RGB")
                    w, h = im.size
                    print("cert size", w, h)
                    if (w, h) != (1080, 1350):
                        issues.append(f"certificado mide {w}x{h}, se esperaba 1080x1350")
                    def bright_ratio(box):
                        crop = im.crop(box)
                        pix = list(crop.getdata())
                        # white-ish logo on #003B71
                        n = sum(1 for r, g, b in pix if r > 180 and g > 180 and b > 180)
                        return n / len(pix)
                    left = bright_ratio((56, 40, 56 + 280, 40 + 130))
                    right = bright_ratio((1080 - 56 - 280, 40, 1080 - 56, 40 + 130))
                    center = bright_ratio((1080 // 2 - 80, 40, 1080 // 2 + 80, 40 + 130))
                    print(f"cert bright ratios left={left:.3f} center={center:.3f} right={right:.3f}")
                    if left < 0.05:
                        issues.append(f"certificado: poco blanco a la izquierda ({left:.3f}); ¿falta logo UASLP?")
                    if right < 0.05:
                        issues.append(f"certificado: poco blanco a la derecha ({right:.3f}); ¿falta logo AA?")
                    if center > 0.05:
                        issues.append(f"certificado: el centro del encabezado no está libre ({center:.3f}); ¿sigue el banner centrado?")

        browser.close()
    httpd.shutdown()
    print("console:", console_errors or "none")
    print("issues:", issues or "none")
    if console_errors or issues:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
