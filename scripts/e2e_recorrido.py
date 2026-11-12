#!/usr/bin/env python3
"""Prueba de punta a punta: completar las cuatro salas y llegar al cierre."""
import http.server
import socketserver
import threading
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = 8892

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, format, *args):
        pass

class ReuseServer(socketserver.TCPServer):
    allow_reuse_address = True

SALA1_VALIDOS = ["s1-a", "s1-b", "s1-c", "s1-d"]
SALA2 = {
    "n-titulo": "t-titulo",
    "n-resumen": "t-resumen",
    "n-palabras": "t-palabras",
    "n-intro": "t-intro",
    "n-metodo": "t-metodo",
    "n-resultados": "t-resultados",
    "n-discusion": "t-discusion",
    "n-referencias": "t-referencias",
}
SALA3 = [("p1-a", "t-pares-1"), ("p2-a", "t-pares-2")]
SALA4 = [("e1-a", "t-et-1"), ("e2-a", "t-et-2"), ("e3-a", "t-et-3")]

def soltar(page, nodo, tanque):
    page.locator(f"#{nodo}").click(force=True, timeout=8000)
    page.locator(f"#{tanque}").click(force=True, timeout=8000)
    page.wait_for_timeout(250)

def main():
    httpd = ReuseServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    ok = True
    errores = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            args=["--headless=new", "--no-sandbox", "--disable-gpu"],
        )
        page = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)
        page.goto(f"http://127.0.0.1:{PORT}/index.html?v=20261112c", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(400)

        page.locator("#btn-entrar").click()
        page.wait_for_selector("#tanque-originalidad")
        print("sala 1")

        soltar(page, "s1-e", "tanque-originalidad")
        lleno = page.locator("#tanque-originalidad").evaluate("el => el.classList.contains('lleno')")
        nivel = page.locator("#tanque-originalidad").evaluate("el => el.style.getPropertyValue('--nivel')")
        if lleno or (nivel not in ("", "0")):
            ok = False
            errores.append(f"tras un rechazo, lleno={lleno} nivel={nivel!r}")
            print("  FALLO rechazo", lleno, nivel)
        else:
            print("  rechazo ok, sin .lleno")

        soltar(page, SALA1_VALIDOS[0], "tanque-originalidad")
        lleno = page.locator("#tanque-originalidad").evaluate("el => el.classList.contains('lleno')")
        nivel = float(page.locator("#tanque-originalidad").evaluate("el => el.style.getPropertyValue('--nivel') || '0'"))
        if lleno:
            ok = False
            errores.append("sala 1: .lleno se activó con la primera ficha")
            print("  FALLO .lleno con la primera ficha")
        elif abs(nivel - 0.25) > 0.01:
            ok = False
            errores.append(f"sala 1: --nivel tras 1/4 = {nivel}")
            print("  FALLO nivel", nivel)
        else:
            print("  primera ficha ok: nivel 0.25, sin .lleno")

        for nid in SALA1_VALIDOS[1:]:
            soltar(page, nid, "tanque-originalidad")
        lleno = page.locator("#tanque-originalidad").evaluate("el => el.classList.contains('lleno')")
        nivel = float(page.locator("#tanque-originalidad").evaluate("el => el.style.getPropertyValue('--nivel') || '0'"))
        if not lleno or abs(nivel - 1) > 0.01:
            ok = False
            errores.append(f"sala 1 al completar: lleno={lleno} nivel={nivel}")
            print("  FALLO al completar", lleno, nivel)
        else:
            print("  completa: .lleno y nivel 1")
        page.locator("#btn-seguir").click()

        print("sala 2")
        page.wait_for_selector("#t-titulo")
        for nid, tid in SALA2.items():
            soltar(page, nid, tid)
            if not page.locator(f"#{tid}").evaluate("el => el.classList.contains('lleno')"):
                ok = False
                errores.append(f"sala 2: {tid} no quedó .lleno al recibir su única pieza")
        page.locator("#btn-seguir").click()

        print("sala 3")
        for i, (nid, tid) in enumerate(SALA3):
            page.wait_for_selector(f"#{nid}", timeout=8000)
            soltar(page, nid, tid)
            if i < len(SALA3) - 1:
                page.wait_for_timeout(1300)
        page.locator("#btn-seguir").click()

        print("sala 4")
        for i, (nid, tid) in enumerate(SALA4):
            page.wait_for_selector(f"#{nid}", timeout=8000)
            soltar(page, nid, tid)
            if i < len(SALA4) - 1:
                page.wait_for_timeout(1300)
        page.locator("#btn-seguir").click()

        print("formulario")
        page.wait_for_selector("#form-registro")
        page.fill("input[name=nombre]", "Persona de prueba")
        page.fill("input[name=institucion]", "Institución de prueba")
        page.fill("input[name=correo]", "prueba@example.com")
        page.fill("input[name=telefono]", "0000000000")
        page.fill("input[name=tema]", "Tema de prueba")
        page.check("input[name=aviso]")
        page.locator("#form-registro button[type=submit]").click()

        print("diploma")
        page.wait_for_selector("#certificado-marco img", timeout=10000)
        page.wait_for_selector("#btn-descarga")
        page.wait_for_selector("#cta-manuscrito")
        leyenda = page.locator(".leyenda-insignia").inner_text()
        if "[POR DEFINIR]" not in leyenda:
            ok = False
            errores.append("falta [POR DEFINIR] junto a la insignia")
        print("  certificado y botones visibles")
        browser.close()
    httpd.shutdown()
    if ok:
        print("E2E OK: las cuatro salas se completaron y se llegó al cierre.")
        return 0
    print("E2E FALLO:")
    for e in errores:
        print(" -", e)
    return 1

if __name__ == "__main__":
    sys.exit(main())
