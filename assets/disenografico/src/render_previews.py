#!/usr/bin/env python3
"""Renderiza cada SVG a PNG (Chrome headless vía Playwright) en ../preview/."""
from pathlib import Path
from playwright.sync_api import sync_playwright
AQUI = Path(__file__).resolve().parents[1]
PREV = AQUI / "preview"; PREV.mkdir(exist_ok=True)
# (archivo, ancho de salida, fondo)
FONDOS = {"fondo_mar": 1, "tanque": "#102438", "nodo": "#102438", "llave": "#003B71", "insignia": "#102438"}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--headless=new", "--no-sandbox", "--disable-gpu"])
    for svg in sorted(AQUI.glob("*.svg")):
        txt = svg.read_text()
        import re
        w, h = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', txt).groups())
        esc = 4 if svg.stem.startswith("llave") else (2 if svg.stem.startswith("nodo") else 1)
        bg = next((v for k, v in FONDOS.items() if svg.stem.startswith(k)), "#102438")
        bg = "transparent" if bg == 1 else bg
        if svg.stem.startswith("tanque"): bg = "#0b1c2c"
        pg = b.new_page(viewport={"width": int(w * esc), "height": int(h * esc)})
        tmp = Path("/tmp/_prev.html"); tmp.write_text(f'<body style="margin:0;background:{bg}"><img src="{svg.as_uri()}" style="width:{int(w*esc)}px;height:{int(h*esc)}px;display:block"></body>')
        pg.goto(tmp.as_uri())
        pg.wait_for_timeout(150)
        pg.screenshot(path=str(PREV / f"{svg.stem}.png"), omit_background=False)
        pg.close()
        print(svg.stem)
    b.close()
