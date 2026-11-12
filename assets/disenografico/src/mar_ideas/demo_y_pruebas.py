#!/usr/bin/env python3
"""Pruebas (táctil, reduced-motion, rechazo, errores) y grabación de preview/mar_ideas_demo.webm."""
import http.server, socketserver, threading, shutil, time
from pathlib import Path
from playwright.sync_api import sync_playwright
AQUI = Path(__file__).resolve().parent; A = AQUI.parents[1]; OUT = A / "preview"; M = "/tmp/jmock2"
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=M, **k)
    def log_message(s, *a): pass
class S(socketserver.TCPServer): allow_reuse_address = True
httpd = S(("127.0.0.1", 8895), H); threading.Thread(target=httpd.serve_forever, daemon=True).start()
U = "http://127.0.0.1:8895/index.html"
def centro(pg, sel):
    return pg.evaluate("(s)=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
    # --- táctil: touch events por CDP
    ctx = b.new_context(viewport={"width": 1080, "height": 2022}, has_touch=True)
    pg = ctx.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"{U}?vista=sala1&semilla=5&foto=1&v=tt"); pg.wait_for_timeout(600)
    cdp = ctx.new_cdp_session(pg)
    x, y = centro(pg, "#s1-c"); tx, ty = centro(pg, "#tanque-originalidad")
    def tp(t, px, py): cdp.send("Input.dispatchTouchEvent", {"type": t, "touchPoints": [] if t == "touchEnd" else [{"x": px, "y": py}]})
    tp("touchStart", x, y)
    for i in range(1, 21): tp("touchMove", x + (tx - x) * i / 20, y + (ty - y) * i / 20); pg.wait_for_timeout(16)
    tp("touchEnd", 0, 0); pg.wait_for_timeout(1500)
    print("táctil colocados:", pg.evaluate("Object.keys(estado.colocados)"))
    # --- soltar fuera: la idea debe volver a hundirse (estático y animado)
    for modo in ("&foto=1", ""):
        pg.goto(f"{U}?vista=sala1&semilla=5{modo}&v=ff"); pg.wait_for_timeout(600 if modo else 9000)
        x, y = centro(pg, "#s1-c")
        pg.mouse.move(x, y); pg.mouse.down(); pg.mouse.move(x, 350, steps=14); pg.wait_for_timeout(100); y1 = centro(pg, '#s1-c')[1]; pg.mouse.up(); pg.wait_for_timeout(6000)
        print("fuera", modo or "animado", "-> colocados:", pg.evaluate("Object.keys(estado.colocados)"), "| y al soltar:", round(y1), "| y tras 6 s:", round(centro(pg, '#s1-c')[1]))
    # --- toque + toque en tanque (flujo original)
    pg.goto(f"{U}?vista=sala1&semilla=5&foto=1&v=tq"); pg.wait_for_timeout(600)
    x, y = centro(pg, "#s1-c"); pg.mouse.click(x, y); pg.wait_for_timeout(200)
    tx, ty = centro(pg, "#tanque-originalidad"); pg.mouse.click(tx, ty); pg.wait_for_timeout(1500)
    print("toque+tanque colocados:", pg.evaluate("Object.keys(estado.colocados)"))
    ctx.close()
    # --- reduced motion
    ctx = b.new_context(viewport={"width": 1080, "height": 2022}, reduced_motion="reduce")
    pg = ctx.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"{U}?vista=sala1&v=rm"); pg.wait_for_timeout(500)
    pg.screenshot(path="/tmp/rm.png")
    print("reduced-motion estático ok; rAF activo:", pg.evaluate("MarIdeas.arrastrando()"))
    ctx.close()
    # --- vídeo
    vd = Path("/tmp/vid"); shutil.rmtree(vd, ignore_errors=True)
    ctx = b.new_context(viewport={"width": 1080, "height": 2022}, record_video_dir=str(vd), record_video_size={"width": 360, "height": 674})
    pg = ctx.new_page(); pg.goto(f"{U}?vista=sala1&semilla=5&v=vd"); pg.wait_for_timeout(9000)
    x, y = centro(pg, "#s1-a"); tx, ty = centro(pg, "#tanque-originalidad")
    pg.mouse.move(x, y); pg.mouse.down(); pg.wait_for_timeout(350)
    pg.mouse.move(x + (tx - x) * 0.5, y + (ty - y) * 0.5, steps=40); pg.wait_for_timeout(150)
    pg.mouse.move(tx, ty + 40, steps=30); pg.wait_for_timeout(500)
    pg.mouse.up(); pg.wait_for_timeout(2500)
    ctx.close(); b.close()
    f = next(vd.glob("*.webm")); shutil.copy(f, OUT / "mar_ideas_demo.webm"); print("webm", round(f.stat().st_size / 1e6, 2), "MB")
print("errores de página:", errs)
