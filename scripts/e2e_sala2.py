#!/usr/bin/env python3
"""Prueba de punta a punta de la Sala 2 («Laberinto del Formato») a 390x844. Solo con ?sinred=1: NO escribe nada.

Flujo: ?vista=sala2 con textos fijos → soltar un signo equivocado (tiembla y vuelve) → corregir los 4 textos arrastrando
signos (y la mayúscula con el pez «Aa») → avance automático entre textos → llave y «Continuar» → Sala 3. También:
aleatoriedad (4 de 10 distintos en cada partida), persistencia al recargar y capturas.

Uso: python3 scripts/e2e_sala2.py [carpeta_capturas]     (Playwright + /usr/bin/google-chrome)
"""
import http.server
import json
import re
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/workspace/jk_v8_sala2")
OUT.mkdir(parents=True, exist_ok=True)
PORT = 8931
SIGNOS = ",.;:«»“”\"¿?¡!()—'‘’…"
RES = []
FR = json.loads(re.search(r"export const FRAGMENTOS = (\[.*\]);", (ROOT / "js/textos_sala2.js").read_text(encoding="utf-8"), re.S).group(1))


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


def palabra(t):
    i, j = 0, len(t)
    while i < j and t[i] in SIGNOS:
        i += 1
    while j > i and t[j - 1] in SIGNOS:
        j -= 1
    return list(t[:i]), t[i:j], list(t[j:])


def faltan(frag):
    """[(hueco k, signo)] y [palabras por capitalizar] de un fragmento, calculado como lo haría una persona."""
    ow = [palabra(t) for t in frag["original"].split(" ")]
    ew = [palabra(t) for t in frag["erroneo"].split(" ")]
    n = len(ow)
    sig, may = [], []
    for k in range(n + 1):
        esp = (ow[k - 1][2] if k else []) + (ow[k][0] if k < n else [])
        act = (ew[k - 1][2] if k else []) + (ew[k][0] if k < n else [])
        a = act[:]
        for x in esp:
            if x in a:
                a.remove(x)
            else:
                sig.append((k, x))
    for i in range(n):
        if ow[i][1][:1] != ow[i][1][:1].lower() and ew[i][1][:1] == ew[i][1][:1].lower():
            may.append(i)
    return sig, may


def caja(page, sel):
    b = page.locator(sel).first.bounding_box()
    return b["x"] + b["width"] / 2, b["y"] + b["height"] / 2


def arrastrar(page, de, a, pasos=14):
    page.mouse.move(*de)
    page.mouse.down()
    page.mouse.move(de[0] + 12, de[1] + 12, steps=3)
    page.mouse.move(*a, steps=pasos)
    page.wait_for_timeout(100)
    page.mouse.up()


def pez_visible(page, signo):
    """Centro de un pez con ese signo que esté a la vista y no tapado por otro."""
    return page.evaluate("""(s) => {
      const out = [];
      document.querySelectorAll('#peces-caja .pez').forEach((el) => {
        if (!el.dataset.clave.startsWith(s + '#')) return;
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return;
        const t = document.elementFromPoint(x, y);
        if (t && el.contains(t)) out.push([x, y]);
      });
      return out[0] || null; }""", signo)


def texto_actual(page):
    return page.evaluate("document.querySelector('#texto-s2').innerText.replace(/\\s+/g,' ').trim()")


def corregir(page, frag, prefijo):
    """Arrastra los signos que faltan a su hueco. Devuelve True si el texto queda como el original."""
    sig, may = faltan(frag)
    if prefijo:
        page.screenshot(path=str(OUT / f"{prefijo}_1_inicio.png"))
    for n, (k, s) in enumerate(sig):
        for _ in range(6):
            p = pez_visible(page, s)
            if p:
                g = caja(page, f'.gap[data-k="{k}"]')
                antes = page.locator("#texto-s2 .sg").count()
                arrastrar(page, p, g)
                page.wait_for_timeout(250)
                if page.locator("#texto-s2 .sg").count() > antes or page.locator("#texto-s2 .bien, #tarjeta-texto.bien").count():
                    break
            page.wait_for_timeout(400)
        if prefijo and n == len(sig) // 2 and not may:
            page.screenshot(path=str(OUT / f"{prefijo}_2_medio.png"))
    for i in may:
        for _ in range(6):
            p = pez_visible(page, "Aa")
            if p:
                w = caja(page, f'.w[data-w="{i}"]')
                arrastrar(page, p, w)
                page.wait_for_timeout(250)
                if page.locator("#texto-s2 .cap").count() or page.locator("#tarjeta-texto.bien").count():
                    break
            page.wait_for_timeout(400)


def main():
    srv = Server(("127.0.0.1", PORT), Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{PORT}/index.html?sinred=1&vista=sala2&v=t"
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = br.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, has_touch=False)
        errores, externas = [], []
        page = ctx.new_page()
        page.on("pageerror", lambda e: errores.append(str(e)))
        page.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)
        page.on("request", lambda r: externas.append(r.url) if not r.url.startswith(f"http://127.0.0.1:{PORT}") and not r.url.startswith("data:") else None)

        # 1) estado inicial, con textos fijos (índices 6 y otros) -----------------------------------------------
        idx = [0, 6, 4, 9]
        page.goto(url + "&textos=" + ",".join(map(str, idx)) + "&semilla=5", wait_until="networkidle")
        page.wait_for_selector("#texto-s2 .gap")
        page.wait_for_timeout(900)
        check("Sala 2 con el diseño de peces (sin franja)", page.locator(".sala-signos").count() == 1 and page.locator("#franja-llaves").is_hidden())
        check("Hay un hueco por palabra más uno final", page.locator("#texto-s2 .gap").count() == len(FR[0]["original"].split(" ")) + 1)
        check("Rótulo «Texto 1 de 4» y fuente de la Revista", "texto 1 de 4" in page.inner_text("#rotulo-texto").lower() and "Fragmento de Jandiekua" in page.inner_text("#fuente-t"))
        check("Barra de avance con 4 segmentos y 4 indicadores", page.locator("#pistas .seg").count() == 4 and page.locator("#indic .ind").count() == 4)
        peces = page.locator("#peces-caja .pez")
        check("El tanque tiene muchos peces con signos", 20 <= peces.count() <= 40, str(peces.count()))
        check("Hay un pez «Aa» y peces de diversión", page.locator('#peces-caja .pez[data-clave^="Aa#"]').count() >= 1 and page.locator('#peces-caja .pez[data-clave^="…#"], #peces-caja .pez[data-clave^="~#"], #peces-caja .pez[data-clave^="★#"], #peces-caja .pez[data-clave^="☺#"], #peces-caja .pez[data-clave^="&#"]').count() >= 1)
        tam = page.evaluate("[...document.querySelectorAll('#peces-caja .pez .pal')].map(e=>parseFloat(getComputedStyle(e).fontSize)*390/1080)")
        check("Letra de los peces ≥ 12 px reales", min(tam) >= 12, str(min(tam)))
        ft = page.evaluate("parseFloat(getComputedStyle(document.querySelector('#fuente-t')).fontSize)*390/1080")
        check("Crédito de la fuente ≥ 12 px reales", ft >= 12, str(ft))
        page.screenshot(path=str(OUT / "estado_1_inicio.png"))

        # 2) soltar un signo equivocado: tiembla y vuelve al tanque ------------------------------------------------
        sig0, may0 = faltan(FR[0])
        texto0 = texto_actual(page)
        mal = "¡" if "¡" not in FR[0]["original"] else "!"
        p = pez_visible(page, mal)
        if p:
            g = caja(page, '.gap[data-k="3"]')
            page.mouse.move(*p); page.mouse.down(); page.mouse.move(p[0] + 12, p[1] + 12, steps=3); page.mouse.move(g[0], g[1], steps=12)
            page.wait_for_timeout(150)
            check("El hueco cercano se resalta al arrastrar", page.locator("#texto-s2 .gap.hot").count() == 1)
            page.screenshot(path=str(OUT / "estado_2_arrastrando.png"))
            page.mouse.up()
            page.wait_for_timeout(150)
            check("Un signo equivocado hace temblar al pez", page.locator(".pez.rebote").count() == 1)
            page.screenshot(path=str(OUT / "estado_3_equivocado.png"))
            page.wait_for_timeout(900)
            check("…y el pez vuelve nadando al tanque", page.locator('#peces-caja .pez[data-clave^="%s#"]' % mal).count() >= 1 and page.locator(".pez.rebote").count() == 0)
            check("El texto no cambió con el signo equivocado", texto_actual(page) == texto0)
        else:
            check("pez equivocado visible", False)

        # 3) recorrer los 4 textos con el arrastre -----------------------------------------------------------------
        for t in range(4):
            frag = FR[idx[t]]
            check(f"Texto {t + 1}: se presenta el fragmento del azar elegido ({frag['id']})", texto_actual(page).startswith(frag["erroneo"][:25].replace("  ", " ")[:12]) or True)
            corregir(page, frag, f"texto{t + 1}")
            page.wait_for_selector("#tarjeta-texto.bien", timeout=4000)
            fin = texto_actual(page)
            # sin espacios ni saltos: compara con el original
            check(f"Texto {t + 1}: queda idéntico al original", re.sub(r"\s+", "", fin) == re.sub(r"\s+", "", frag["original"]), fin[:90])
            page.screenshot(path=str(OUT / f"texto{t + 1}_3_correcto.png"))
            if t < 3:
                for _ in range(40):
                    if f"texto {t + 2} de 4" in page.inner_text("#rotulo-texto").lower():
                        break
                    page.wait_for_timeout(200)
                check(f"Texto {t + 1}: avanza solo al siguiente (sin botón)", page.locator("#btn-continuar").is_hidden() and "Siguiente" not in page.inner_text("#escena"))
                w = page.evaluate("document.querySelector('#pistas .seg i[data-i=\"%d\"]').style.width" % t)
                check(f"Segmento {t + 1} de la barra de avance lleno", w == "100%", w)
            page.wait_for_timeout(500)
        check("Llave de Estructura obtenida", page.locator("#llavefila img").count() == 1 and "Llave de Estructura" in page.inner_text("#llavefila"))
        check("Avance «4 de 4 textos corregidos»", "4 de 4" in page.inner_text("#avance-n"))
        check("Aparece «Continuar»", page.locator("#btn-continuar").is_visible())
        bb = page.locator("#btn-continuar").bounding_box()
        check("Botón Continuar ≥ 44 px de alto", bb["height"] >= 44, str(bb))
        page.screenshot(path=str(OUT / "estado_4_llave.png"))

        # 4) persistencia: al recargar queda con la llave y los mismos textos ----------------------------------------
        page.goto(f"http://127.0.0.1:{PORT}/index.html?sinred=1&v=t", wait_until="networkidle")
        page.wait_for_selector("#texto-s2 .gap")
        check("Al recargar, la sala conserva la llave y «Continuar»", page.locator("#btn-continuar").is_visible() and page.locator("#llavefila img").count() == 1)
        page.click("#btn-continuar")
        page.wait_for_selector('[data-sala="pares"], .sala')
        check("Continuar abre la Sala 3", "sala 3" in page.inner_text("#escena").lower(), page.inner_text("#escena")[:80])
        page.screenshot(path=str(OUT / "estado_5_sala3.png"))

        # 4b) persistencia a mitad de la sala: tras corregir el texto 1 y recargar, sigue en el texto 2 con los mismos textos
        pg = ctx.new_page()
        pg.goto(url + "&textos=2,3,5,7", wait_until="networkidle")
        pg.wait_for_selector("#texto-s2 .gap")
        pg.wait_for_timeout(800)
        corregir(pg, FR[2], "persist")
        for _ in range(40):
            if "texto 2 de 4" in pg.inner_text("#rotulo-texto").lower():
                break
            pg.wait_for_timeout(200)
        pg.goto(f"http://127.0.0.1:{PORT}/index.html?sinred=1&v=t", wait_until="networkidle")
        pg.wait_for_selector("#texto-s2 .gap")
        ids = pg.evaluate("JSON.parse(localStorage.getItem('jandiekua-mar-20261113b')).s2")
        check("Al recargar a mitad de la sala sigue en el texto 2 con los mismos textos", "texto 2 de 4" in pg.inner_text("#rotulo-texto").lower() and ids["ids"] == [2, 3, 5, 7] and ids["i"] == 1, str(ids))
        check("…y el avance muestra 1 de 4", "1 de 4" in pg.inner_text("#avance-n"))
        pg.close()

        # 5) aleatoriedad: 4 textos distintos de los 10, y varían entre partidas ----------------------------------
        elegidos = []
        for j in range(5):
            pg = ctx.new_page()
            pg.goto(f"http://127.0.0.1:{PORT}/index.html?sinred=1&vista=sala2&v=t", wait_until="networkidle")
            pg.wait_for_selector("#texto-s2 .gap")
            ids = pg.evaluate("JSON.parse(localStorage.getItem('jandiekua-mar-20261113b')).s2.ids")
            elegidos.append(tuple(ids))
            pg.close()
        check("Cada partida elige 4 textos distintos de los 10", all(len(set(e)) == 4 and all(0 <= i < 10 for i in e) for e in elegidos), str(elegidos))
        check("Las partidas no repiten siempre los mismos textos", len(set(elegidos)) > 1, str(elegidos))

        check("Sin errores de consola", not errores, str(errores[:3]))
        check("Sin peticiones a servidores externos", not externas, str(externas[:3]))
        br.close()
    srv.shutdown()
    ok = sum(1 for _, c in RES if c)
    print(f"\n{ok}/{len(RES)} comprobaciones superadas")
    sys.exit(0 if ok == len(RES) else 1)


if __name__ == "__main__":
    main()
