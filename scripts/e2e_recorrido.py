#!/usr/bin/env python3
"""Prueba de punta a punta: portada, Sala 1 (peces) y las salas 2 a 4 hasta el cierre. Solo con ?sinred=1."""
import http.server
import socketserver
import threading
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
import e2e_sala2 as S2

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
SALA3 = [("p1-a", "t-pares-1"), ("p2-a", "t-pares-2")]
SALA4 = [("e1-a", "t-et-1"), ("e2-a", "t-et-2"), ("e3-a", "t-et-3")]

def soltar(page, nodo, tanque, debe_aceptar=True):
    page.wait_for_selector(f"#{nodo}", state="attached", timeout=8000)
    try:
        page.wait_for_function(
            f"() => {{ const e = document.getElementById('{nodo}'); return e && parseFloat(getComputedStyle(e).opacity || 0) >= 0.4; }}",
            timeout=5000,
        )
    except Exception:
        page.evaluate(f"() => {{ const e = document.getElementById('{nodo}'); if (e) e.style.opacity = '1'; }}")
    # Las tarjetas se apilan: un click en el centro de #id puede golpear otra
    # tarjeta. Despachamos el puntero en el elemento mismo.
    page.evaluate(f"""() => {{
      const el = document.getElementById('{nodo}');
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const ev = (type) => el.dispatchEvent(new PointerEvent(type, {{
        bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse',
        clientX: x, clientY: y, view: window
      }}));
      ev('pointerdown'); ev('pointerup');
    }}""")
    page.wait_for_function(
        f"() => window.estado && estado.elegido && estado.elegido.data && estado.elegido.data.id === '{nodo}'",
        timeout=5000,
    )
    page.locator(f"#{tanque}").click(force=True, timeout=8000)
    if debe_aceptar:
        page.wait_for_function(
            f"() => !document.getElementById('{nodo}') || document.getElementById('{nodo}').classList.contains('colocado')",
            timeout=5000,
        )
        page.wait_for_timeout(200)
    else:
        page.wait_for_timeout(400)

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
        page.goto(f"http://127.0.0.1:{PORT}/index.html?sinred=1&v=20261113b", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(400)

        page.check("#acepto-terminos")
        page.locator("#btn-entrar").click()
        page.wait_for_selector("#entrada-titulo")
        print("sala 1 (peces)")
        page.focus("#entrada-titulo")
        page.keyboard.type("Metodología para adaptación de espacios urbanos para la producción agrourbana en SLP MX con comunidades periurbanas durante 2026", delay=5)
        page.keyboard.press("Enter")
        page.wait_for_selector("#btn-soltar", state="visible")
        page.locator("#btn-soltar").click()
        page.wait_for_function("() => estado.tituloListo && estado.llaves[0]")
        page.wait_for_selector("#btn-continuar", state="visible")
        n = page.evaluate("() => Peces.total()")
        if n != 8:
            ok = False
            errores.append(f"sala 1: se esperaban 8 peces y hay {n}")
        else:
            print("  título soltado: 8 peces, llave obtenida")
        page.locator("#btn-continuar").click()

        print("sala 2 (signos y mayúsculas)")
        page.wait_for_selector("#texto-s2 .gap", timeout=8000)
        ids = page.evaluate("() => estado.s2.ids")
        if len(set(ids)) != 4:
            ok = False
            errores.append(f"sala 2: ids de textos no válidos {ids}")
        for t in range(4):
            page.wait_for_function(f"() => estado.s2.i === {t} && !document.querySelector('#tarjeta-texto.bien')", timeout=8000)
            page.wait_for_timeout(900)
            S2.corregir(page, S2.FR[ids[t]], None)
            try:
                page.wait_for_selector("#tarjeta-texto.bien", timeout=6000)
            except Exception:
                ok = False
                errores.append(f"sala 2: el texto {t + 1} no quedó corregido")
        page.wait_for_selector("#btn-continuar", state="visible", timeout=6000)
        if not page.evaluate("() => estado.llaves[1]"):
            ok = False
            errores.append("sala 2: falta la Llave de Estructura")
        print("  4 textos corregidos y llave obtenida")
        page.locator("#btn-continuar").click()

        print("sala 3")
        for i, (nid, tid) in enumerate(SALA3):
            page.wait_for_selector(f"#{nid}", timeout=8000)
            soltar(page, nid, tid)
            if i < len(SALA3) - 1:
                page.wait_for_timeout(1300)
        page.locator("#btn-seguir").click(force=True)

        print("sala 4")
        for i, (nid, tid) in enumerate(SALA4):
            page.wait_for_selector(f"#{nid}", timeout=8000)
            soltar(page, nid, tid)
            if i < len(SALA4) - 1:
                page.wait_for_timeout(1300)
        page.locator("#btn-seguir").click(force=True)

        print("formulario")
        page.wait_for_selector("#form-registro")
        if "¿Cómo te llamas, amigo? Es para darte tu reconocimiento." not in page.inner_text("#form-registro"):
            ok = False
            errores.append("falta la pregunta de nombre en el cierre")
        page.fill("input[name=nombre]", "Persona de prueba")
        page.fill("input[name=institucion]", "Institución de prueba")
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

        print("estres 200 ideas (en la Sala 3)")
        page2 = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)
        page2.goto(f"http://127.0.0.1:{PORT}/index.html?sinred=1&vista=sala3&v=20261113b", wait_until="networkidle")
        page2.wait_for_selector("#mar[data-listo='1'] #p1-a", state="attached", timeout=20000)
        page2.wait_for_timeout(400)
        page2.evaluate("""async () => {
          const textos = Array.from({length: 200}, (_, i) => "Aporte del consorcio número " + (i + 1));
          await agregarIdeasLote(textos);
        }""")
        page2.wait_for_function("() => document.querySelectorAll('#mar .nodo').length >= 200", timeout=30000)
        info = page2.evaluate("""() => {
          const nodos = [...document.querySelectorAll('#mar .nodo')];
          const font = nodos[0] ? parseFloat(getComputedStyle(nodos[0]).fontSize) : 0;
          return { n: nodos.length, font, total: totalIdeasSesion() };
        }""")
        print("  ", info)
        antes = info["n"]
        page2.evaluate("() => agregarIdea('Detallar los criterios de selección y describir los instrumentos', { local: true })")
        page2.wait_for_timeout(600)
        despues = page2.evaluate("() => document.querySelectorAll('#mar .nodo').length")
        print("  dedup", antes, "->", despues)
        if despues != antes:
            ok = False
            errores.append(f"dedup: se creó una tarjeta extra ({antes} -> {despues})")
        if info["n"] < 200:
            ok = False
            errores.append(f"estres: solo {info['n']} nodos en el mar")
        if info["font"] > 20:
            ok = False
            errores.append(f"estres: fuente {info['font']} px, debería ser muy pequeña")
        # Arrastre programático sobre #s1-a (el montón cubre el centro visual).
        page2.evaluate("""() => {
          const el = document.getElementById('p1-a');
          const tank = document.getElementById('t-pares-1');
          if (!el || !tank) return;
          const r = el.getBoundingClientRect();
          const t = tank.getBoundingClientRect();
          const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, {
            bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse',
            clientX: x, clientY: y, view: window
          }));
          ev('pointerdown', r.left + r.width / 2, r.top + r.height / 2);
          const x0 = r.left + r.width / 2, y0 = r.top + r.height / 2;
          const x1 = t.left + t.width / 2, y1 = t.top + t.height / 2;
          for (let i = 1; i <= 16; i++) {
            ev('pointermove', x0 + (x1 - x0) * i / 16, y0 + (y1 - y0) * i / 16);
          }
          ev('pointerup', x1, y1);
        }""")
        page2.wait_for_function("() => !!document.querySelector('#t-pares-1 .ficha')", timeout=5000)
        hay = page2.evaluate("() => !!document.querySelector('#t-pares-1 .ficha')")
        print("  arrastre predefinida", hay)
        if not hay:
            ok = False
            errores.append("estres: no se pudo arrastrar una idea predefinida al tanque")
        page2.close()
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
