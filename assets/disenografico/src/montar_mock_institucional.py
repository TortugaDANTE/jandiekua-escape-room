#!/usr/bin/env python3
"""Crea /tmp/jmock: copia del árbol de trabajo actual del juego (v2 de Académico) + SOLO los cambios de
imagen institucional. No toca el repo. Uso: python3 montar_mock_institucional.py [--screens]"""
import shutil, sys, http.server, socketserver, threading
from pathlib import Path
A = Path(__file__).resolve().parents[1]; REPO = A.parents[1]; M = Path("/tmp/jmock")
shutil.rmtree(M, ignore_errors=True); M.mkdir()
for n in ("index.html", "css", "js", "assets"):
    (shutil.copytree if (REPO / n).is_dir() else shutil.copy)(REPO / n, M / n)
shutil.copytree(A / "logos", M / "assets" / "logos", dirs_exist_ok=True)   # copias idénticas a los logos oficiales

def sust(path, viejo, nuevo):
    t = path.read_text(); assert viejo in t, (path, viejo[:60]); path.write_text(t.replace(viejo, nuevo))

# 1) index.html: la barra deja de ser un PNG único centrado
sust(M / "index.html",
 '        <img src="assets/logos/logo_banner_blanco.png" width="2890" height="590" alt="Universidad Autónoma de San Luis Potosí y Agenda Ambiental">\n',
 '''        <img class="logo-uaslp" src="assets/logos/logo_uaslp_blanco.svg" width="192" height="74" alt="Universidad Autónoma de San Luis Potosí">
        <img class="logo-aa" src="assets/logos/logo_aa_blanco.svg" width="300" height="127" alt="Agenda Ambiental UASLP">
''')
# 2) CSS
sust(M / "css/juego.css", '''.barra img {
  height: 110px;
  width: auto;
  max-width: 980px;
}''', '''.barra { justify-content: space-between; padding: 0 40px; }
.barra img {
  height: 100px;
  width: auto;
  max-width: none;
}''')
# 3) certificado PNG: dos logos HD (mismos logos, mayor resolución), misma altura, UASLP izq. y AA der.
sust(M / "js/juego.js", '''  const logo = new Image();
  logo.src = "assets/logos/logo_banner_blanco.png";
''', '''  const logoU = new Image();
  logoU.src = "assets/logos/hd/logo_uaslp_blanco.png";
  const logoA = new Image();
  logoA.src = "assets/logos/hd/logo_aa_blanco.png";
''')
sust(M / "js/juego.js", '''    new Promise((res, rej) => { logo.onload = res; logo.onerror = rej; }),
''', '''    new Promise((res, rej) => { logoU.onload = res; logoU.onerror = rej; }),
    new Promise((res, rej) => { logoA.onload = res; logoA.onerror = rej; }),
''')
sust(M / "js/juego.js", '''  const logoH = 130;
  const logoW = logoH * (2890 / 590);
  ctx.drawImage(logo, (W - logoW) / 2, 40, logoW, logoH);
''', '''  const logoH = 112;                       // misma altura; solo escala proporcional
  const wU = logoH * (logoU.width / logoU.height);
  const wA = logoH * (logoA.width / logoA.height);
  ctx.drawImage(logoU, 56, (210 - logoH) / 2, wU, logoH);
  ctx.drawImage(logoA, W - 56 - wA, (210 - logoH) / 2, wA, logoH);
''')
print("mock listo en", M)

if "--screens" in sys.argv:
    from playwright.sync_api import sync_playwright
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(s, *a, **k): super().__init__(*a, directory=str(M), **k)
        def log_message(s, *a): pass
    class S(socketserver.TCPServer): allow_reuse_address = True
    httpd = S(("127.0.0.1", 8893), H); threading.Thread(target=httpd.serve_forever, daemon=True).start()
    OUT = A / "preview"
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
        pg = b.new_page(viewport={"width": 1080, "height": 2022})
        pg.on("pageerror", lambda e: print("ERR", e))
        for v in ["portada", "sala1", "cierre"]:
            pg.goto(f"http://127.0.0.1:8893/index.html?vista={v}&foto=1&v={v}i"); pg.wait_for_timeout(900)
            if v == "cierre":
                pg.wait_for_selector("#certificado-marco img", timeout=10000); pg.wait_for_timeout(500)
            pg.screenshot(path=str(OUT / f"propuesta_institucional_{v}.png"))
            print("ok", v)
        b.close()
