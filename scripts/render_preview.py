#!/usr/bin/env python3
"""Render 1080×2022 previews of each room and the closing screen."""
import http.server
import socketserver
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)
PORT = 8876

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, format, *args):
        pass

def main():
    class ReuseServer(socketserver.TCPServer):
        allow_reuse_address = True
    httpd = ReuseServer(("127.0.0.1", PORT), Handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    vistas = [
        ("sala1", "sala1.png"),
        ("sala2", "sala2.png"),
        ("sala3", "sala3.png"),
        ("sala4", "sala4.png"),
        ("cierre", "cierre.png"),
        ("portada", "portada.png"),
    ]
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
        page = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)
        for vista, nombre in vistas:
            url = f"http://127.0.0.1:{PORT}/index.html?vista={vista}&foto=1&v=20261112a"
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(700)
            if vista == "cierre":
                page.wait_for_selector("#certificado-marco img", timeout=10000)
                page.wait_for_timeout(400)
            page.screenshot(path=str(OUT / nombre), type="png")
            print("wrote", OUT / nombre)
        browser.close()
    httpd.shutdown()

if __name__ == "__main__":
    main()
