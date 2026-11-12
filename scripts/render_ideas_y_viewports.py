#!/usr/bin/env python3
"""Previews of sinking ideas and layout tests at several viewports."""
import http.server
import socketserver
import threading
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)
PORT = 8896

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, format, *args):
        pass

class ReuseServer(socketserver.TCPServer):
    allow_reuse_address = True

ISSUES = []
CONSOLE = []

def check_bar_top(page, label, tolerate=2):
    info = page.evaluate("""() => {
      const bar = document.querySelector('.barra');
      const lienzo = document.querySelector('#lienzo');
      const esc = document.querySelector('#escenario');
      const br = bar.getBoundingClientRect();
      const lr = lienzo.getBoundingClientRect();
      const btn = document.querySelector('.btn-entrar, .btn-glosario, .btn-idea');
      const btr = btn ? btn.getBoundingClientRect() : null;
      const s = getComputedStyle(lienzo).transform;
      return {
        barTop: Math.round(br.top * 10) / 10,
        barLeft: Math.round(br.left * 10) / 10,
        lienzoTop: Math.round(lr.top * 10) / 10,
        lienzoW: Math.round(lr.width),
        lienzoH: Math.round(lr.height),
        vw: window.innerWidth,
        vh: window.innerHeight,
        scrollH: esc.scrollHeight,
        scrollTop: esc.scrollTop,
        overflowY: getComputedStyle(esc).overflowY,
        btnH: btr ? Math.round(btr.height * 10) / 10 : null,
        btnFont: btn ? getComputedStyle(btn).fontSize : null,
        transform: s
      };
    }""")
    print(label, json.dumps(info))
    if info["lienzoTop"] > tolerate or info["barTop"] > tolerate:
        ISSUES.append(f"{label}: hueco superior lienzoTop={info['lienzoTop']} barTop={info['barTop']}")
    if info["btnH"] is not None and info["vw"] <= 420 and info["btnH"] < 40:
        ISSUES.append(f"{label}: botón demasiado bajo ({info['btnH']}px) en {info['vw']}px")
    return info

def main():
    httpd = ReuseServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}/index.html"
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            args=["--headless=new", "--no-sandbox", "--disable-gpu"],
        )

        # ---- 1080×2022 idea previews ----
        page = browser.new_page(viewport={"width": 1080, "height": 2022}, device_scale_factor=1)
        page.on("console", lambda m: CONSOLE.append(m.type + ": " + m.text) if m.type in ("error",) and "favicon" not in m.text else None)
        page.on("pageerror", lambda e: CONSOLE.append("pageerror: " + str(e)))

        page.goto(f"{base}?vista=sala1&foto=1&semilla=20261112&v=20261112f", wait_until="networkidle")
        page.wait_for_timeout(600)
        page.wait_for_function("() => document.querySelectorAll('#mar .nodo').length >= 8")
        n = page.evaluate("() => document.querySelectorAll('#mar .nodo').length")
        font = page.evaluate("() => getComputedStyle(document.querySelector('#mar .nodo')).fontSize")
        print("pocas nodos", n, "font", font)
        page.screenshot(path=str(OUT / "mar_ideas_pocas.png"), type="png")
        print("wrote", OUT / "mar_ideas_pocas.png")

        page.goto(f"{base}?vista=sala1&foto=1&ideas=200&semilla=20261112&v=20261112f", wait_until="networkidle")
        page.wait_for_timeout(1500)
        info200 = page.evaluate("""() => {
          const nodos = [...document.querySelectorAll('#mar .nodo')];
          const mar = document.querySelector('#mar').getBoundingClientRect();
          const fonts = nodos.map(n => parseFloat(getComputedStyle(n).fontSize));
          const fuera = nodos.filter(n => {
            const r = n.getBoundingClientRect();
            return r.bottom < mar.top - 40 || r.top > mar.bottom + 40;
          }).length;
          return { n: nodos.length, fontMin: Math.min(...fonts), fontMax: Math.max(...fonts), fuera };
        }""")
        print("200", info200)
        if info200["n"] < 200:
            ISSUES.append(f"ideas=200 solo renderizó {info200['n']} nodos")
        if info200["fontMax"] > 20:
            ISSUES.append(f"con 200 ideas la fuente sigue grande: {info200['fontMax']}px")
        page.screenshot(path=str(OUT / "mar_ideas_200.png"), type="png")
        print("wrote", OUT / "mar_ideas_200.png")

        # drag in progress, few ideas
        page.goto(f"{base}?vista=sala1&foto=1&semilla=20261112&v=20261112f", wait_until="networkidle")
        page.wait_for_selector("#s1-a")
        page.wait_for_timeout(400)
        box = page.locator("#s1-a").bounding_box()
        tank = page.locator("#tanque-originalidad").bounding_box()
        if box and tank:
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.mouse.down()
            mid_x = (box["x"] + tank["x"] + tank["width"] / 2) / 2
            mid_y = (box["y"] + tank["y"] + tank["height"] / 2) / 2
            page.mouse.move(mid_x, mid_y, steps=8)
            page.wait_for_timeout(200)
            page.screenshot(path=str(OUT / "mar_ideas_arrastre.png"), type="png")
            print("wrote", OUT / "mar_ideas_arrastre.png")
            page.mouse.up()
        else:
            ISSUES.append("no se pudo iniciar el arrastre para la preview")

        # portada with bigger buttons
        page.goto(f"{base}?vista=portada&foto=1&v=20261112f", wait_until="networkidle")
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / "portada_botones.png"), type="png")
        print("wrote", OUT / "portada_botones.png")

        page.close()

        # ---- viewports ----
        viewports = [
            (390, 844, "phone390"),
            (360, 740, "phone360"),
            (412, 915, "phone412"),
            (1366, 768, "desktop"),
        ]
        for w, h, name in viewports:
            pg = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            pg.on("pageerror", lambda e: CONSOLE.append(f"{name} pageerror: {e}"))
            pg.goto(f"{base}?vista=portada&foto=1&v=20261112f", wait_until="networkidle")
            pg.wait_for_timeout(400)
            info = check_bar_top(pg, f"{name}/portada")
            pg.screenshot(path=str(OUT / f"viewport_{name}_portada.png"), type="png")
            # sala + drag at phone size
            pg.goto(f"{base}?vista=sala1&foto=1&semilla=20261112&v=20261112f", wait_until="networkidle")
            pg.wait_for_selector("#s1-a")
            pg.wait_for_timeout(400)
            check_bar_top(pg, f"{name}/sala1")
            # try a short drag to the tank (select+click also)
            if w <= 420:
                # scroll should not be required; bar at top
                btn = pg.locator(".btn-glosario").bounding_box()
                if btn and btn["height"] < 40:
                    ISSUES.append(f"{name}: glosario mide {btn['height']}px")
            pg.screenshot(path=str(OUT / f"viewport_{name}_sala1.png"), type="png")
            # synthetic short viewport scroll check after phones
            pg.close()

        # explicit scroll case: 390×600
        pg = browser.new_page(viewport={"width": 390, "height": 600}, device_scale_factor=1)
        pg.goto(f"{base}?vista=sala1&foto=1&semilla=20261112&v=20261112f", wait_until="networkidle")
        pg.wait_for_timeout(400)
        info = check_bar_top(pg, "phone390x600/sala1")
        if info["scrollH"] <= info["vh"] + 2:
            ISSUES.append(f"390x600 debería poder desplazarse: scrollH={info['scrollH']} vh={info['vh']}")
        # scroll to bottom and confirm pie visible, then drag still works at top after scroll 0
        pg.evaluate("document.querySelector('#escenario').scrollTop = 400")
        pg.wait_for_timeout(200)
        # puntoLocal/drag after scroll: click-select a node
        visible = pg.evaluate("""() => {
          const el = document.querySelector('#s1-a');
          const r = el.getBoundingClientRect();
          return { top: r.top, h: r.height, inView: r.bottom > 0 && r.top < window.innerHeight };
        }""")
        print("after scroll s1-a", visible)
        pg.screenshot(path=str(OUT / "viewport_390x600_scroll.png"), type="png")
        pg.evaluate("document.querySelector('#escenario').scrollTop = 0")
        pg.locator("#s1-a").click(force=True)
        pg.locator("#tanque-originalidad").click(force=True)
        ok = pg.evaluate("() => !!document.querySelector('#tanque-originalidad .ficha')")
        print("drop after scroll restore", ok)
        if not ok:
            ISSUES.append("tras desplazar y volver arriba, no se pudo soltar la idea en el tanque")
        pg.close()

        browser.close()
    httpd.shutdown()
    print("console:", CONSOLE or "none")
    print("issues:", ISSUES or "none")
    if ISSUES or CONSOLE:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
