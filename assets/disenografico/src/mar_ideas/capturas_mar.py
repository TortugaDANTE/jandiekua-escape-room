#!/usr/bin/env python3
"""Renderiza las capturas y el demo del mar de ideas desde /tmp/jmock2 (ver montar_mock_mar.py)."""
import http.server, socketserver, threading, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
AQUI = Path(__file__).resolve().parent; A = AQUI.parents[1]; OUT = A / "preview"; M = "/tmp/jmock2"
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=M, **k)
    def log_message(s, *a): pass
class S(socketserver.TCPServer): allow_reuse_address = True
httpd = S(("127.0.0.1", 8894), H); threading.Thread(target=httpd.serve_forever, daemon=True).start()
U = "http://127.0.0.1:8894/index.html"
def centro(pg, sel):
    return pg.evaluate("(s)=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
    ctx = b.new_context(viewport={"width": 1080, "height": 2022})
    pg = ctx.new_page(); pg.on("pageerror", lambda e: print("ERR", e)); pg.on("console", lambda m: print("C", m.text) if m.type == "error" and "404" not in m.text else None)
    # 1) hundimiento en el tiempo
    pg.goto(f"{U}?vista=sala1&semilla=7&v=h1"); t0 = time.time()
    for i, t in enumerate([1.2, 3.4, 11.0], 1):
        pg.wait_for_timeout(max(0, int((t - (time.time() - t0)) * 1000)))
        pg.screenshot(path=str(OUT / f"mar_ideas_hundimiento_{i}.png")); print("hundimiento", i, round(time.time() - t0, 2))
    # 2) tamaño: pocas (sala 1: 8) y muchas (30), estado asentado
    pg.goto(f"{U}?vista=sala1&semilla=3&foto=1&v=t1"); pg.wait_for_timeout(700)
    pg.screenshot(path=str(OUT / "mar_ideas_tamano_pocas.png"))
    pg.goto(f"{U}?vista=sala1&semilla=3&foto=1&ideas=30&v=t2"); pg.wait_for_timeout(900)
    pg.screenshot(path=str(OUT / "mar_ideas_tamano_muchas.png"))
    # 3) arrastre (tiempo real, 12 ideas, ya asentadas); se arrastra una idea válida hacia el tanque
    pg.goto(f"{U}?vista=sala1&semilla=5&v=a1"); pg.wait_for_timeout(7500)
    x, y = centro(pg, "#s1-c"); tx, ty = centro(pg, "#tanque-originalidad")
    pg.mouse.move(x, y); pg.mouse.down(); pg.wait_for_timeout(250)
    pg.mouse.move(x, y - 60, steps=4); pg.wait_for_timeout(120)
    pg.screenshot(path=str(OUT / "mar_ideas_arrastre_1.png"))
    pg.mouse.move(x + (tx - x) * 0.45, y + (ty - y) * 0.45, steps=14); pg.wait_for_timeout(60)
    pg.screenshot(path=str(OUT / "mar_ideas_arrastre_2.png"))
    pg.mouse.move(tx, ty + 40, steps=14); pg.wait_for_timeout(120)
    pg.screenshot(path=str(OUT / "mar_ideas_arrastre_3.png"))
    pg.mouse.up(); pg.wait_for_timeout(200)
    pg.wait_for_timeout(1500)
    print("colocados:", pg.evaluate("Object.keys(estado.colocados)"), "vivos:", pg.evaluate("nodosVivos.length"))
    b.close()
