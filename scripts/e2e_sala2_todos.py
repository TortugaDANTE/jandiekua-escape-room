#!/usr/bin/env python3
"""Resuelve, arrastrando, cada uno de los 10 fragmentos de la Sala 2 (390x844) y guarda la captura inicial de cada uno.
Solo con ?sinred=1.   Uso: python3 scripts/e2e_sala2_todos.py [carpeta]"""
import re
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
import e2e_sala2 as S

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/workspace/jk_v8_sala2/todos")
OUT.mkdir(parents=True, exist_ok=True)
S.OUT = OUT


def main():
    srv = S.Server(("127.0.0.1", S.PORT + 1), S.Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    ok = 0
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for grupo in ([0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 0, 1]):
            pg = br.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2).new_page()
            pg.goto(f"http://127.0.0.1:{S.PORT + 1}/index.html?sinred=1&vista=sala2&v=t&textos={','.join(map(str, grupo))}", wait_until="networkidle")
            pg.wait_for_selector("#texto-s2 .gap")
            for t, i in enumerate(grupo):
                pg.wait_for_timeout(900)
                frag = S.FR[i]
                S.corregir(pg, frag, f"{frag['id']}")
                pg.wait_for_selector("#tarjeta-texto.bien", timeout=6000)
                fin = S.texto_actual(pg)
                bien = re.sub(r"\s+", "", fin) == re.sub(r"\s+", "", frag["original"])
                print(("PASS" if bien else "FAIL"), frag["id"], frag["regla"])
                ok += bien
                if t < 3:
                    for _ in range(40):
                        if f"texto {t + 2} de 4" in pg.inner_text("#rotulo-texto").lower():
                            break
                        pg.wait_for_timeout(200)
        br.close()
    srv.shutdown()
    print(f"{ok}/12 resueltos")


main()
