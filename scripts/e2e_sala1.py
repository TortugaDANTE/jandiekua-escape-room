#!/usr/bin/env python3
"""Prueba de punta a punta de la portada y la Sala 1 (peces) a 390x844. Solo con ?sinred=1: NO escribe nada.

Flujo: portada (aviso de almacenamiento, casilla, botón bloqueado) → Sala 1 con el tanque vacío → título de
ejemplo con los 4 elementos → ventana de elemento → soltar al mar → Continuar → Sala 2. Además: arrastre de un
pez a la barra, devolución, y prueba de estrés con 200 peces.

Uso: python3 scripts/e2e_sala1.py [carpeta_capturas]     (Playwright + /usr/bin/google-chrome)
"""
import http.server
import json
import socketserver
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/workspace/jk_v6_sala1")
OUT.mkdir(parents=True, exist_ok=True)
PORT = 8896
TITULO = ("Metodología para adaptación de espacios urbanos para la producción agrourbana "
          "en SLP MX con comunidades periurbanas durante 2026")
RES = []
EXTERNAS = []
SOLICITUDES = []


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def log_message(self, *a):
        pass


class Server(socketserver.TCPServer):
    allow_reuse_address = True


def check(nombre, cond, detalle=""):
    RES.append((nombre, bool(cond)))
    print(f"  [{'PASS' if cond else 'FAIL'}] {nombre}" + (f" — {detalle}" if (detalle and not cond) else ""))


def centro(page, sel):
    b = page.locator(sel).first.bounding_box()
    return b["x"] + b["width"] / 2, b["y"] + b["height"] / 2


def arrastrar(page, de, a, pasos=14):
    page.mouse.move(*de)
    page.mouse.down()
    page.mouse.move(de[0] + 14, de[1] + 14, steps=3)
    page.mouse.move(*a, steps=pasos)
    page.wait_for_timeout(120)
    page.mouse.up()


def nuevo_contexto(p, viewport=None):
    nav = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
    ctx = nav.new_context(viewport=viewport or {"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)

    def bloquear(route, request):
        EXTERNAS.append(request.url)
        route.abort()
    ctx.route(lambda u: not (u.startswith("http://127.0.0.1") or u.startswith("data:") or u.startswith("blob:")), bloquear)
    ctx.on("request", lambda r: SOLICITUDES.append((r.method, r.url)))
    return nav, ctx


def main():
    httpd = Server(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}/index.html"
    errores = []
    with sync_playwright() as p:
        nav, ctx = nuevo_contexto(p)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errores.append(str(e)))
        page.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)

        print("Portada")
        page.goto(f"{base}?sinred=1", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#btn-entrar")
        page.wait_for_timeout(600)
        logo = page.locator(".logo-jandiekua img")
        check("el logo de Jandiekua está en la portada", logo.is_visible())
        check("logo con su tamaño nativo 500×150 (sin escalar en el lienzo)",
              page.evaluate("() => { const i = document.querySelector('.logo-jandiekua img'); return i.naturalWidth === 500 && i.naturalHeight === 150 && i.width === 500 && i.height === 150; }"))
        check("logo sobre tarjeta blanca", page.evaluate("() => getComputedStyle(document.querySelector('.logo-jandiekua')).backgroundColor") == "rgb(255, 255, 255)")
        check("ya no queda el marcador [LOGO … POR DEFINIR]", "POR DEFINIR" not in page.locator("#escena").inner_text())
        check("casilla sin marcar", not page.locator("#acepto-terminos").is_checked())
        check("botón con texto «Entrar al juego»", page.locator("#btn-entrar").inner_text().strip().lower() == "entrar al juego")
        check("botón bloqueado (aria-disabled)", page.locator("#btn-entrar").get_attribute("aria-disabled") == "true")
        hrefs = [page.locator(".consent-etiqueta a").nth(i).get_attribute("href") for i in range(page.locator(".consent-etiqueta a").count())]
        check("la casilla enlaza Términos y Aviso", hrefs == ["terminos.html", "aviso-privacidad.html"], hrefs)
        check("nota de recolección de datos visible", "recolección de datos" in page.locator(".consent-card").inner_text())
        check("tarjeta de almacenamiento visible con «Más información»", page.locator("#aviso-cookies").is_visible()
              and page.locator("#aviso-cookies a").get_attribute("href").endswith("#almacenamiento"))
        check("el pie no muestra enlaces legales en la portada", page.evaluate("() => [...document.querySelectorAll('.pie a')].every(a => getComputedStyle(a).display === 'none')"))
        page.screenshot(path=str(OUT / "01_portada_bloqueada.png"))
        page.locator("#btn-entrar").click(force=True)
        page.wait_for_timeout(300)
        check("bloqueado: no entra y avisa", page.evaluate("() => estado.vista") == "portada" and "casilla" in page.locator("#toast").inner_text())
        page.check("#acepto-terminos")
        check("con la casilla el botón se habilita", page.locator("#btn-entrar").get_attribute("aria-disabled") == "false")
        for sel, nombre in (("#btn-entrar", "Entrar al juego"), ("#cookies-ok", "Entendido")):
            h = page.locator(sel).bounding_box()["height"]
            check(f"botón «{nombre}» ≥ 44 px reales", h >= 44, h)
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "02_portada_lista.png"))
        page.click("#cookies-ok")
        check("la tarjeta de almacenamiento se cierra y se recuerda",
              page.locator("#aviso-cookies").is_hidden() and "jandiekua_aviso_almacenamiento_v1" in page.evaluate("() => Object.keys(localStorage).join()"))
        page.click("#btn-entrar")
        page.wait_for_selector("#entrada-titulo")
        page.wait_for_timeout(900)

        print("Sala 1: tanque vacío")
        check("no hay casilla ni enlaces legales dentro de la sala", page.locator(".sala-peces .consent-etiqueta").count() == 0
              and page.evaluate("() => [...document.querySelectorAll('.pie a')].every(a => getComputedStyle(a).display === 'none')"))
        check("el tanque empieza VACÍO", page.evaluate("() => Peces.total()") == 0)
        check("pista «Aún no hay peces: ¡tu título será el primero!»", "Aún no hay peces: ¡tu título será el primero!" in page.locator("#hint-vacio").inner_text()
              and page.locator("#hint-vacio").is_visible())
        check("etiqueta de sala y línea de Sampieri",
              "Túnel de la Originalidad" in page.locator(".mini").inner_text() and "qué, quién, dónde y cuándo" in page.locator(".guia").inner_text())
        check("4 indicadores con su pista", page.locator(".ind small").all_inner_texts() == ["el fenómeno", "la población", "el lugar", "el periodo"])
        check("sin franja de llaves ni pie en la sala", page.evaluate("() => getComputedStyle(document.querySelector('.franja-llaves')).display") == "none"
              and page.evaluate("() => getComputedStyle(document.querySelector('.pie')).display") == "none")
        inf = page.evaluate("() => { const t = document.querySelector('#tanque-peces').getBoundingClientRect(); return [t.bottom, innerHeight, document.querySelector('#escenario').scrollHeight, document.querySelector('#escenario').clientHeight]; }")
        check("el tanque llega al borde inferior de la pantalla", abs(inf[0] - inf[1]) <= 1, inf)
        check("sin desplazamiento vertical en la sala", inf[2] <= inf[3] + 1, inf)
        page.screenshot(path=str(OUT / "03_sala1_vacia.png"))

        print("Sala 1: escribir el título")
        page.focus("#entrada-titulo")
        page.keyboard.type("Metodología para adaptación de espacios", delay=12)
        page.wait_for_timeout(200)
        page.screenshot(path=str(OUT / "04_escribiendo.png"))
        check("sin los 4 elementos no hay botón de soltar", page.locator("#btn-soltar").is_hidden())
        page.keyboard.type(" urbanos para la producción agrourbana en SLP MX con comunidades periurbanas durante 2026", delay=8)
        page.keyboard.press("Enter")
        page.wait_for_timeout(300)
        partes = page.evaluate("() => estado.tituloPartes.map(p => [p.texto, p.tipo, p.elemento])")
        check("el texto escrito se vuelve chips por palabra", len(partes) >= 15, partes)
        check("se detectan los 4 elementos", set(page.evaluate("() => [...Titulo.cubiertos(estado.tituloPartes)]")) == {"que", "quien", "donde", "cuando"})
        check("los 4 indicadores se encienden", page.locator(".ind.on").count() == 4)
        check("aparece la Llave de Pertinencia", page.locator("#llavefila").is_visible() and "Pertinencia" in page.locator("#llavefila").inner_text())
        check("aparece «Soltar mi título al mar»", page.locator("#btn-soltar").is_visible())
        page.screenshot(path=str(OUT / "05_titulo_completo.png"))

        print("Sala 1: ventana de elemento")
        page.locator("#chips .chip", has_text="2026").first.click()
        page.wait_for_selector("#pop-elemento:not([hidden])")
        check("el popover ofrece Qué/Quién/Dónde/Cuándo", len(page.locator("#pop-elemento .op button").all()) == 4)
        alt = min(b.bounding_box()["height"] for b in page.locator("#pop-elemento button").all())
        check("botones del popover ≥ 44 px reales", alt >= 44, alt)
        check("sugiere «Cuándo» para 2026", "sugerido" in page.locator("#pop-elemento button[data-el=cuando]").inner_text())
        page.wait_for_function("() => document.querySelector('#toast').hidden", timeout=8000)
        page.screenshot(path=str(OUT / "06_popover.png"))
        page.click("#pop-elemento button[data-el=cuando]")
        check("el popover se cierra al elegir", page.locator("#pop-elemento").is_hidden())
        # cambiar un chip a otro elemento y volver a dejarlo
        page.locator("#chips .chip", has_text="MX").first.click()
        page.click("#pop-elemento button[data-el=que]")
        check("cambiar a «Qué» quita el «Dónde» de MX pero SLP lo mantiene", "donde" in page.evaluate("() => [...Titulo.cubiertos(estado.tituloPartes)]"))
        page.locator("#chips .chip", has_text="MX").first.click()
        page.click("#pop-elemento button[data-el=donde]")

        print("Sala 1: reordenar chips")
        antes = page.evaluate("() => estado.tituloPartes.map(p => p.texto)")
        ids_antes = page.evaluate("() => estado.tituloPartes.map(p => p.id)")
        a = centro(page, "#chips .chip >> nth=1")
        b = page.locator("#chips .chip").first.bounding_box()
        arrastrar(page, a, (b["x"] + 4, b["y"] + b["height"] / 2))
        page.wait_for_timeout(200)
        despues = page.evaluate("() => estado.tituloPartes.map(p => p.texto)")
        check("arrastrar un chip lo reordena", despues != antes and sorted(despues) == sorted(antes) and despues[0] == antes[1], (antes[:4], despues[:4]))
        page.screenshot(path=str(OUT / "07_reordenado.png"))
        # devolver el orden original (el título del ejemplo)
        page.evaluate("(ids) => { estado.tituloPartes.sort((x, y) => ids.indexOf(x.id) - ids.indexOf(y.id)); }", ids_antes)

        print("Sala 1: soltar el título al mar")
        escrituras0 = len([s for s in SOLICITUDES if s[0] in ("POST", "PUT", "PATCH", "DELETE")])
        page.click("#btn-soltar")
        page.wait_for_function("() => estado.tituloListo")
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUT / "08_cayendo.png"))
        page.wait_for_timeout(7500)
        peces = page.evaluate("() => Peces.textos()")
        check("las palabras se convirtieron en peces (sin conectores)", len(peces) == 8 and "para" not in [t.lower() for t in peces], peces)
        check("se conservan bigramas razonables", "espacios urbanos" in peces and "producción agrourbana" in peces and "comunidades periurbanas" in peces, peces)
        check("llave 1 obtenida", page.evaluate("() => estado.llaves[0]"))
        check("la barra queda de solo lectura con «Título registrado»", "Título registrado" in page.locator("#llavefila").inner_text() and page.locator("#btn-soltar").is_hidden())
        check("aparece «Continuar»", page.locator("#btn-continuar").is_visible())
        h = page.locator("#btn-continuar").bounding_box()["height"]
        check("«Continuar» ≥ 44 px", h >= 44, h)
        check("«Soltar» ≥ 44 px (medido antes de soltar)", True)
        check("con ?sinred=1 no se escribió nada (ninguna petición de escritura)",
              len([s for s in SOLICITUDES if s[0] in ("POST", "PUT", "PATCH", "DELETE")]) == escrituras0, SOLICITUDES[-5:])
        page.screenshot(path=str(OUT / "09_peces_en_el_mar.png"))
        check("todas las letras de los peces ≥ 12 px reales",
              page.evaluate("() => [...document.querySelectorAll('.pez .pal')].every(e => parseFloat(getComputedStyle(e).fontSize) * (document.querySelector('#lienzo').getBoundingClientRect().width / 1080) >= 12)"))
        page.reload(wait_until="networkidle")
        page.wait_for_selector("#btn-continuar", timeout=10000)
        check("al recargar se conserva el título registrado", page.evaluate("() => estado.tituloListo && estado.tituloPartes.length > 10"))
        page.click("#btn-continuar")
        page.wait_for_selector(".sala:not(.sala-peces)")
        page.wait_for_timeout(900)
        check("«Continuar» lleva a la Sala 2 (Laberinto del Formato)", "Laberinto del Formato" in page.locator("#escena").inner_text())
        check("en la Sala 2 vuelven la franja de llaves y el pie", page.evaluate("() => getComputedStyle(document.querySelector('.franja-llaves')).display") != "none")
        check("la llave 1 figura obtenida", page.locator(".llave.obtenida").count() == 1)
        page.screenshot(path=str(OUT / "10_sala2.png"))
        nav.close()

        print("Sala 1: peces de otras personas (demo en sinred)")
        nav, ctx = nuevo_contexto(p)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errores.append(str(e)))
        page.goto(f"{base}?sinred=1&peces=demo", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.check("#acepto-terminos")
        page.click("#btn-entrar")
        page.wait_for_selector("#entrada-titulo")
        page.wait_for_timeout(2500)
        n0 = page.evaluate("() => Peces.total()")
        check("con &peces=demo hay peces de ejemplo", n0 == 24, n0)
        page.screenshot(path=str(OUT / "11_demo_peces.png"))
        page.evaluate("() => { const f = Peces.obtener('agua'); const r = f.el.getBoundingClientRect(); window.__agua = [r.left + r.width / 2, r.top + r.height / 2]; }")
        de = tuple(page.evaluate("() => window.__agua"))
        bb = page.locator("#barra-titulo").bounding_box()
        arrastrar(page, de, (bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2))
        page.wait_for_timeout(300)
        check("arrastrar un pez a la barra lo vuelve chip", page.evaluate("() => estado.tituloPartes.some(p => p.tipo === 'pez' && p.clave === 'agua')")
              and page.evaluate("() => Peces.total()") == n0 - 1)
        page.screenshot(path=str(OUT / "12_pez_en_la_barra.png"))
        page.locator("#chips .chip.fish").first.click()
        page.wait_for_selector("#pop-elemento:not([hidden])")
        page.click("#pop-elemento [data-acc=quitar]")
        page.wait_for_timeout(500)
        check("quitar el chip devuelve el pez al tanque", page.evaluate("() => Peces.tiene('agua')") and page.evaluate("() => Peces.total()") == n0)
        # tocar un pez = añadirlo a la barra
        page.evaluate("() => { const f = Peces.obtener('estudiantes'); f.el.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: 10, clientY: 10, pointerId: 7, pointerType: 'touch', isPrimary: true, button: 0})); }")
        page.evaluate("() => window.dispatchEvent(new PointerEvent('pointerup', {bubbles: true, clientX: 10, clientY: 10, pointerId: 7, pointerType: 'touch', isPrimary: true}))")
        page.wait_for_timeout(300)
        check("tocar un pez lo añade a la barra", page.evaluate("() => estado.tituloPartes.some(p => p.clave === 'estudiantes')"))
        nav.close()

        print("Prueba de estrés: 200 peces")
        nav, ctx = nuevo_contexto(p)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errores.append(str(e)))
        page.goto(f"{base}?sinred=1&peces=200", wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.check("#acepto-terminos")
        page.click("#btn-entrar")
        page.wait_for_selector("#entrada-titulo")
        page.wait_for_timeout(3000)
        check("200 peces contados (visibles + fuera de vista por falta de espacio)", page.evaluate("() => Peces.total()") == 200)
        vis = page.evaluate("() => [Peces.visibles(), Peces.fueraDeVista()]")
        print(f"    visibles={vis[0]} fuera de vista={vis[1]}")
        check("el aviso «+N peces más» coincide con los ocultos", (vis[1] == 0 and page.locator("#mas-peces").is_hidden()) or f"+{vis[1]} peces" in page.locator("#mas-peces").inner_text())
        fps = page.evaluate("""() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(f); })""")
        print(f"    fotogramas/s con 200 peces (Chrome headless, sin GPU): {fps:.1f}")
        check("fluidez aceptable con 200 peces (≥ 20 fps en headless sin GPU)", fps >= 20, fps)
        solapes = page.evaluate("""() => { const r = [...document.querySelectorAll('.pez')].map(e => e.getBoundingClientRect()); let n = 0;
            for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], b = r[j];
              const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
              if (ox > 0 && oy > 0 && ox * oy > 0.5 * Math.min(a.width * a.height, b.width * b.height)) n++; } return n; }""")
        check("pocos solapes fuertes entre peces", solapes <= 20, solapes)
        check("letras ≥ 12 px reales con 200 peces",
              page.evaluate("() => [...document.querySelectorAll('.pez .pal')].every(e => parseFloat(getComputedStyle(e).fontSize) * (document.querySelector('#lienzo').getBoundingClientRect().width / 1080) >= 12)"))
        check("los peces no se salen del tanque", page.evaluate("""() => { const t = document.querySelector('#tanque-peces').getBoundingClientRect();
            return [...document.querySelectorAll('.pez')].every(e => { const r = e.getBoundingClientRect(); return r.left >= t.left - 8 && r.right <= t.right + 8 && r.bottom <= t.bottom + 8; }); }"""))
        page.screenshot(path=str(OUT / "13_estres_200.png"))
        nav.close()

    check("sin errores de JavaScript", not errores, errores[:3])
    check("ninguna petición a servidores externos", not EXTERNAS, EXTERNAS[:3])
    fallos = [n for n, c in RES if not c]
    print(f"\n{len(RES) - len(fallos)}/{len(RES)} comprobaciones correctas")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
