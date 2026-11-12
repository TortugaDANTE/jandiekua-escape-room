#!/usr/bin/env python3
"""Render 1080×2022 previews with _v2 suffix."""
import http.server
import socketserver
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)
PORT = 8891

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
        ("sala1", "sala1_v2.png"),
        ("sala2", "sala2_v2.png"),
        ("sala3", "sala3_v2.png"),
        ("sala4", "sala4_v2.png"),
        ("cierre", "cierre_v2.png"),
        ("portada", "portada_v2.png"),
    ]
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            args=["--headless=new", "--no-sandbox", "--disable-gpu"],
        )
        page = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)
        for vista, nombre in vistas:
            url = f"http://127.0.0.1:{PORT}/index.html?vista={vista}&foto=1&v=20261112b"
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(800)
            if vista == "cierre":
                page.wait_for_selector("#certificado-marco img", timeout=10000)
                page.wait_for_timeout(500)
            page.wait_for_function("() => { const i=document.querySelector('#fondo img, #fondo svg'); return i && (i.tagName!=='IMG' || i.complete); }")
            dest = OUT / nombre
            page.screenshot(path=str(dest), type="png")
            print("wrote", dest)
        browser.close()
    httpd.shutdown()

if __name__ == "__main__":
    main()
